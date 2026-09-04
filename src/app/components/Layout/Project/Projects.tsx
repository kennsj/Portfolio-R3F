import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Projects.module.scss";
import { usePageTransition } from "../../../hooks/usePageTransition";
import { useI18n } from "../../../hooks/useI18n";
import { workTransition } from "../../Experiences/workTransitionStore";
import { orderedProjectData, type ProjectSummary } from "./project-data";
import ProjectList from "./project-list";
import ProjectPreview from "./project-preview";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const { locale } = useI18n();
  const { transitionTo } = usePageTransition();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewPositionRef = useRef<HTMLDivElement>(null);
  const previewRevealRef = useRef<HTMLDivElement>(null);
  const previewMediaRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLImageElement | null>>([]);
  const mobilePreviewRefs = useRef<Array<HTMLImageElement | null>>([]);
  const currentIndexRef = useRef<number | null>(null);
  const previewOpenRef = useRef(false);
  const concealTimerRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const settleTiltRef = useRef<gsap.core.Tween | null>(null);
  const projectTransitionRef = useRef(false);

  const getLocalPointer = useCallback((clientX: number, clientY: number) => {
    const section = sectionRef.current;
    if (!section) return { x: clientX, y: clientY };
    const rect = section.getBoundingClientRect();
    return {
      x: clientX - rect.left + section.scrollLeft,
      y: clientY - rect.top + section.scrollTop,
    };
  }, []);

  useEffect(
    () => () => {
      if (concealTimerRef.current !== null)
        window.clearTimeout(concealTimerRef.current);
      settleTiltRef.current?.kill();
    },
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (
      !section ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 220%",
        end: "top 115%",
        scrub: 0.7,
      },
    });

    timeline
      .to(workTransition, { calm: 1, duration: 0.55, ease: "none" })
      .to(workTransition, { calm: 0, duration: 0.45, ease: "none" });

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      workTransition.calm = 0;
    };
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (
        !section ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;

      const timelines = Array.from(
        section.querySelectorAll<HTMLElement>(`.${styles["project-item"]}`),
      ).map((item) => {
        const details = item.querySelector<HTMLElement>(`.${styles.details}`);
        const rule = item.querySelector<HTMLElement>(
          `.${styles["project-rule"]}`,
        );
        const targets = [details, rule].filter(
          (target): target is HTMLElement => target !== null,
        );

        gsap.set(targets, { willChange: "transform, opacity" });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            once: true,
            fastScrollEnd: true,
          },
        });

        if (details) {
          timeline.fromTo(
            details,
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 1.1, ease: "power2.out" },
          );
        }

        if (rule) {
          timeline.fromTo(
            rule,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.85, ease: "power2.out" },
            details ? "-=.35" : 0,
          );
        }

        return timeline;
      });

      return () => {
        timelines.forEach((timeline) => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        });
      };
    },
    { scope: sectionRef },
  );

  const reveal = useCallback(
    (index: number, clientX?: number, clientY?: number) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (concealTimerRef.current !== null) {
        window.clearTimeout(concealTimerRef.current);
        concealTimerRef.current = null;
      }

      setActiveIndex(index);
      const preview = previewRef.current;
      const previewPosition = previewPositionRef.current;
      const revealFrame = previewRevealRef.current;
      const media = previewMediaRef.current;
      if (!preview || !previewPosition || !revealFrame || !media) return;
      gsap.killTweensOf(revealFrame);
      gsap.killTweensOf(preview);
      const previousIndex = currentIndexRef.current;
      const nextVideo = videoRefs.current[index];

      const localPointer = getLocalPointer(
        clientX ?? window.innerWidth * 0.64,
        clientY ?? window.innerHeight * 0.52,
      );
      const x = localPointer.x;
      const y = localPointer.y;
      pointerRef.current = {
        x: clientX ?? window.innerWidth * 0.64,
        y: clientY ?? window.innerHeight * 0.52,
      };
      settleTiltRef.current?.kill();
      gsap.set(preview, { autoAlpha: 1 });
      gsap.set(previewPosition, { x, y, rotation: 0 });

      if (previewOpenRef.current && previousIndex === index) {
        gsap.killTweensOf(revealFrame);
        gsap.set(revealFrame, { scaleY: 1 });
        return;
      }

      if (
        previewOpenRef.current &&
        previousIndex !== null &&
        previousIndex !== index
      ) {
        const previousVideo = videoRefs.current[previousIndex];
        const travel = index > previousIndex ? 100 : -100;
        gsap.killTweensOf([revealFrame, previousVideo, nextVideo]);
        gsap.set(revealFrame, { scaleY: 1 });
        gsap.set(nextVideo, { autoAlpha: 1, yPercent: -travel });
        gsap
          .timeline({ defaults: { duration: 0.6, ease: "shiftReveal" } })
          .to(previousVideo, { yPercent: travel }, 0)
          .to(nextVideo, { yPercent: 0 }, 0)
          .set(previousVideo, { autoAlpha: 0, yPercent: 0 });
        currentIndexRef.current = index;
        return;
      }

      videoRefs.current.forEach((video, videoIndex) => {
        if (!video) return;
        gsap.set(video, {
          autoAlpha: videoIndex === index ? 1 : 0,
          yPercent: 0,
        });
      });
      currentIndexRef.current = index;
      previewOpenRef.current = true;
      gsap.killTweensOf([revealFrame, media]);
      gsap.set(media, { yPercent: 0, scale: 1.6 });
      gsap
        .timeline()
        .fromTo(
          revealFrame,
          { scaleY: 0, transformOrigin: "bottom" },
          { scaleY: 1, duration: 0.8, ease: "shiftReveal" },
        )
        .to(media, { scale: 1.2, duration: 1.6, ease: "power2.out" }, 0);
    },
    [getLocalPointer],
  );

  const follow = useCallback(
    (event: Pick<PointerEvent, "clientX" | "clientY">) => {
      const horizontalDelta = event.clientX - pointerRef.current.x;
      pointerRef.current = { x: event.clientX, y: event.clientY };
      const preview = previewRef.current;
      const previewPosition = previewPositionRef.current;
      if (!preview || !previewPosition || activeIndex === null) return;
      const localPointer = getLocalPointer(event.clientX, event.clientY);

      gsap.to(previewPosition, {
        x: localPointer.x,
        y: localPointer.y,
        duration: 1.1,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(previewPosition, {
        rotation: gsap.utils.clamp(-12, 12, horizontalDelta * -0.5),
        duration: 0.24,
        ease: "power2.out",
        overwrite: "auto",
      });

      settleTiltRef.current?.kill();
      settleTiltRef.current = gsap.to(previewPosition, {
        rotation: 0,
        duration: 0.55,
        delay: 0.12,
        ease: "power3.out",
        overwrite: "auto",
      });
    },
    [activeIndex, getLocalPointer],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onPointerMove = (event: PointerEvent) => follow(event);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [activeIndex, follow]);

  const conceal = useCallback(() => {
    if (projectTransitionRef.current) return;
    if (concealTimerRef.current !== null)
      window.clearTimeout(concealTimerRef.current);
    concealTimerRef.current = window.setTimeout(() => {
      const preview = previewRef.current;
      const revealFrame = previewRevealRef.current;
      const previewPosition = previewPositionRef.current;
      if (!preview || !revealFrame || !previewPosition) return;
      settleTiltRef.current?.kill();
      gsap.to(previewPosition, {
        rotation: 0,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.to(revealFrame, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 0.6,
        ease: "shiftReveal",
        onComplete: () => {
          gsap.set(preview, { autoAlpha: 0 });
          videoRefs.current.forEach((video) => {
            if (video instanceof HTMLVideoElement) video.pause();
          });
          previewOpenRef.current = false;
          currentIndexRef.current = null;
          setActiveIndex(null);
        },
      });
    }, 90);
  }, []);

  const transitionFromPreview = useCallback(
    (index: number, href: string) => {
      const previewPosition = previewPositionRef.current;
      const mobileLayout = window.matchMedia(
        "(max-width: 768px), (hover: none)",
      ).matches;
      const sourceMedia = mobileLayout
        ? mobilePreviewRefs.current[index]
        : videoRefs.current[index];
      const sourceFrame = mobileLayout ? sourceMedia : previewPosition;
      const canAnimate =
        sourceMedia &&
        sourceFrame &&
        (mobileLayout ||
          (previewOpenRef.current && currentIndexRef.current === index)) &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!canAnimate || projectTransitionRef.current) {
        transitionTo(href);
        return;
      }

      projectTransitionRef.current = true;
      document.documentElement.dataset.projectContinuityArrival = "true";
      settleTiltRef.current?.kill();
      const sourceRect = sourceFrame.getBoundingClientRect();
      const overlay = document.createElement("div");
      const transitionImage = document.createElement("img");
      const rootFontSize = Number.parseFloat(
        window.getComputedStyle(document.documentElement).fontSize,
      );
      const clampValue = (
        minimum: number,
        preferred: number,
        maximum: number,
      ) => Math.min(maximum, Math.max(minimum, preferred));
      const viewportGutter = clampValue(
        1.25 * rootFontSize,
        window.innerWidth * 0.04,
        3.5 * rootFontSize,
      );
      const targetWidth = mobileLayout
        ? window.innerWidth - viewportGutter * 2
        : window.innerWidth * 0.9;
      const targetHeight = targetWidth / 1.6;
      const targetLeft = mobileLayout
        ? viewportGutter
        : (window.innerWidth - targetWidth) / 2;
      const heroPaddingTop = clampValue(
        (mobileLayout ? 10 : 20) * rootFontSize,
        window.innerHeight * (mobileLayout ? 0.24 : 0.4),
        (mobileLayout ? 16 : 32) * rootFontSize,
      );
      const heroTitleHeight =
        clampValue(
          (mobileLayout ? 2.8 : 3.25) * rootFontSize,
          window.innerWidth * (mobileLayout ? 0.125 : 0.065),
          (mobileLayout ? 5 : 7) * rootFontSize,
        ) * 0.9;
      const heroMediaMarginTop = clampValue(
        2.5 * rootFontSize,
        window.innerWidth * 0.05,
        4.5 * rootFontSize,
      );
      const targetTop = heroPaddingTop + heroTitleHeight + heroMediaMarginTop;

      overlay.className = styles["project-transition-overlay"];
      transitionImage.src = sourceMedia.currentSrc || sourceMedia.src;
      transitionImage.alt = "";
      overlay.appendChild(transitionImage);
      document.body.appendChild(overlay);

      gsap.set(overlay, {
        left: sourceRect.left,
        top: sourceRect.top,
        width: sourceRect.width,
        height: sourceRect.height,
        rotation: mobileLayout
          ? 0
          : gsap.getProperty(previewPosition, "rotation"),
      });
      gsap.set(mobileLayout ? sourceFrame : previewRef.current, {
        autoAlpha: 0,
      });

      let destinationReady = false;
      let enterStarted = false;
      let destinationChecks = 0;
      let destination: HTMLElement | null = null;
      let handoffFrame: number | null = null;
      const alignOverlayToDestination = () => {
        if (!destination) return;
        const destinationRect = destination.getBoundingClientRect();
        gsap.set(overlay, {
          left: destinationRect.left,
          top: destinationRect.top,
          width: destinationRect.width,
          height: destinationRect.height,
          rotation: 0,
        });
      };
      const completeHandoff = () => {
        if (!destinationReady || !enterStarted) return;
        window.removeEventListener("page-transition-enter", onPageEnter);
        // ScrollSmoother and ScrollTrigger settle immediately after the enter
        // event. Keep the continuity layer alive until that layout has settled,
        // then measure once more so its final frame exactly matches the hero.
        handoffFrame = window.requestAnimationFrame(() => {
          handoffFrame = window.requestAnimationFrame(() => {
            alignOverlayToDestination();
            overlay.remove();
            handoffFrame = null;
          });
        });
      };
      const onPageEnter = () => {
        enterStarted = true;
        completeHandoff();
      };
      const findDestination = () => {
        destination = document.querySelector<HTMLElement>(
          "[data-project-hero-media]",
        );
        destinationChecks += 1;
        if (!destination && destinationChecks < 120) {
          window.requestAnimationFrame(findDestination);
          return;
        }
        if (destination) {
          alignOverlayToDestination();
        }
        destinationReady = true;
        completeHandoff();
      };

      window.addEventListener("page-transition-enter", onPageEnter, {
        once: true,
      });

      gsap.to(overlay, {
        left: targetLeft,
        top: targetTop,
        width: targetWidth,
        height: targetHeight,
        rotation: 0,
        duration: 1.2,
        ease: "shiftReveal",
      });
      window.setTimeout(
        () =>
          transitionTo(href, {
            skipEnterAnimation: true,
            exitDuration: 0.42,
          }),
        100,
      );
      window.setTimeout(findDestination, 850);
      window.setTimeout(() => {
        window.removeEventListener("page-transition-enter", onPageEnter);
        if (handoffFrame !== null) window.cancelAnimationFrame(handoffFrame);
        if (document.body.contains(overlay)) {
          gsap.to(overlay, {
            autoAlpha: 0,
            duration: 0.35,
            onComplete: () => overlay.remove(),
          });
        }
      }, 5000);
    },
    [transitionTo],
  );

  const selectProject = (index: number, project: ProjectSummary) => {
    if (project.comingSoon) return;
    transitionFromPreview(index, `/project/${project.slug}`);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className={styles.section}
        id="work"
        data-aurora-state
        data-aurora-presence=".82"
        data-aurora-color="#d7a2bb"
      >
        <header className={styles["project-intro"]}>
          <p className={styles["project-label"]}>
            <span>01 - {locale === "nb" ? "Prosjekter" : "Projects"}</span>
          </p>
          <p className={styles["project-summary"]}>
            {locale === "nb"
              ? "Utvalgte prosjekter innen visuell retning, digital design og kreativ frontendutvikling."
              : "Selected work across visual direction, interface design and creative frontend development."}
          </p>
        </header>
        <ProjectList
          projects={orderedProjectData}
          locale={locale}
          activeIndex={activeIndex}
          onConceal={conceal}
          onReveal={reveal}
          onSelect={selectProject}
          setMobilePreviewRef={(index, node) => {
            mobilePreviewRefs.current[index] = node;
          }}
        />
        <ProjectPreview
          projects={orderedProjectData}
          previewRef={previewRef}
          positionRef={previewPositionRef}
          revealRef={previewRevealRef}
          mediaRef={previewMediaRef}
          setImageRef={(index, node) => {
            videoRefs.current[index] = node;
          }}
        />
      </section>
    </>
  );
};

export default Projects;
