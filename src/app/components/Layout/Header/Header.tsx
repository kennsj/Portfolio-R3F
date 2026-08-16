import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useHeroIntro } from "../../../hooks/HeroIntroContext";
import { useI18n } from "../../../hooks/useI18n";
import { getKpLabel, useKpIndex } from "../../../hooks/useKpIndex";
import { deterministicCharacterOrder } from "../../../hooks/use-character-reveal";
import { useManualKp } from "../../../hooks/KpContext";
import styles from "./Header.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText);

type HeaderProps = {
  signalNavIntroAfterHero?: boolean;
};

type HeroStyle = CSSProperties & {
  "--aurora-stroke-opacity": number;
  "--aurora-stroke-glow": string;
};

const Header = ({ signalNavIntroAfterHero = false }: HeaderProps) => {
  const { homeHeroSceneReady, homeHeroIntroReady, markHomeHeroIntroComplete } =
    useHeroIntro();
  const { locale, t, toggleLocale } = useI18n();
  const { data } = useKpIndex();
  const { manualKp } = useManualKp();
  const kp = manualKp ?? data?.latest ?? 0;
  const { label: kpLabel } = getKpLabel(kp, locale);
  const kpDescription =
    locale === "nb"
      ? "KP-indeksen måler global geomagnetisk aktivitet fra 0 til 9. Høyere verdi betyr sterkere nordlysaktivitet."
      : "The KP index measures global geomagnetic activity from 0 to 9. A higher value means stronger aurora activity.";
  const normalizedKp = Math.min(1, Math.max(0, kp / 9));
  const heroStyle: HeroStyle = {
    "--aurora-stroke-opacity": 0.2 + normalizedKp * 0.35,
    "--aurora-stroke-glow": `${0.5 + normalizedKp * 1.6}px`,
  };
  const [localTime, setLocalTime] = useState("-- : -- : --");
  const [heroIntroStarted, setHeroIntroStarted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLocalTime = () => {
      const parts = new Intl.DateTimeFormat(
        locale === "nb" ? "nb-NO" : "en-GB",
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Europe/Oslo",
          hour12: false,
        },
      ).formatToParts(new Date());
      const readPart = (type: Intl.DateTimeFormatPartTypes) =>
        parts.find((part) => part.type === type)?.value ?? "--";
      setLocalTime(
        `${readPart("hour")} : ${readPart("minute")} : ${readPart("second")}`,
      );
    };

    updateLocalTime();
    const timer = window.setInterval(updateLocalTime, 1_000);

    return () => window.clearInterval(timer);
  }, [locale]);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header || !signalNavIntroAfterHero || !homeHeroSceneReady) return;

      if (homeHeroIntroReady) {
        gsap.set(header, { autoAlpha: 1, visibility: "visible" });
        gsap.set(header.querySelectorAll<HTMLElement>("[data-hero-support]"), {
          autoAlpha: 1,
          filter: "none",
        });
        if (headingRef.current) {
          gsap.set(headingRef.current, { autoAlpha: 1, filter: "none" });
        }
        setHeroIntroStarted(true);
        return;
      }

      let cancelled = false;
      let timeline: gsap.core.Timeline | null = null;
      let metadataTimeline: gsap.core.Timeline | null = null;
      let metadataObserver: ResizeObserver | null = null;
      const headingSplits: SplitText[] = [];

      document.fonts.ready.then(() => {
        if (cancelled || !header.isConnected) return;

        const canvas = document.querySelector<HTMLElement>("#canvas");
        const curtain = document.querySelector<HTMLElement>(
          ".home-intro-curtain",
        );
        const supporting = header.querySelectorAll<HTMLElement>(
          "[data-hero-support]",
        );
        const heading = headingRef.current;
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const metadata = metadataRef.current;
        const metadataLine = metadata?.querySelector<HTMLElement>(
          `.${styles["metadata-line"]}`,
        );
        const metadataItems = metadata
          ? Array.from(
              metadata.querySelectorAll<HTMLElement>("[data-metadata-item]"),
            )
          : [];

        const buildMetadataTimeline = (progress = 0) => {
          if (!metadata || !metadataLine || metadataItems.length === 0) return;

          metadataTimeline?.kill();
          const railRect = metadata.getBoundingClientRect();
          const lineDuration = 1.35;
          metadataTimeline = gsap.timeline();
          metadataTimeline.fromTo(
            metadataLine,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: lineDuration,
              transformOrigin: "left center",
              ease: "power2.out",
            },
          );

          metadataItems.forEach((item) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const itemProgress = gsap.utils.clamp(
              0,
              1,
              (itemCenter - railRect.left) / Math.max(railRect.width, 1),
            );
            metadataTimeline?.fromTo(
              item,
              { autoAlpha: 0, y: 6 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.42,
                ease: "power2.out",
              },
              lineDuration * itemProgress,
            );
          });

          metadataTimeline.progress(progress);
        };

        timeline = gsap.timeline();

        if (reducedMotion && metadata && metadataLine) {
          gsap.set(metadataLine, { scaleX: 1, transformOrigin: "left center" });
          gsap.set(metadataItems, { autoAlpha: 1, y: 0 });
        } else if (metadata && metadataLine) {
          gsap.set(metadataLine, { scaleX: 0, transformOrigin: "left center" });
          gsap.set(metadataItems, { autoAlpha: 0, y: 6 });
          metadataObserver = new ResizeObserver(() => {
            if (!metadataTimeline) return;
            buildMetadataTimeline(metadataTimeline.progress());
          });
          metadataObserver.observe(metadata);
        }

        if (!reducedMotion) {
          gsap.set(supporting, { autoAlpha: 0, filter: "blur(10px)" });
        }

        if (canvas) {
          timeline.fromTo(
            canvas,
            {
              autoAlpha: 0,
              filter: reducedMotion ? "brightness(1)" : "brightness(0.12)",
              scale: reducedMotion ? 1 : 1.03,
            },
            {
              autoAlpha: 1,
              filter: "brightness(1)",
              scale: 1,
              duration: reducedMotion ? 0.2 : 1.8,
              ease: "power3.out",
            },
            0,
          );
        }

        if (curtain) {
          timeline.to(
            curtain,
            {
              autoAlpha: 0,
              duration: reducedMotion ? 0.2 : 1.5,
              ease: "power2.out",
            },
            reducedMotion ? 0 : 0.15,
          );
        }

        timeline.set(
          header,
          { autoAlpha: 1, visibility: "visible" },
          reducedMotion ? 0 : 0.3,
        );
        timeline.call(
          () => setHeroIntroStarted(true),
          [],
          reducedMotion ? 0 : 0.3,
        );

        let headingRevealEnd = 0.45;
        let metadataStart = headingRevealEnd;

        if (heading && !reducedMotion) {
          gsap.set(heading, { autoAlpha: 1, filter: "none" });

          try {
            const characterDuration = 1.05;
            const characterStagger = 0.028;
            let firstNameRevealDuration = characterDuration;
            const nameLines = [
              heading.querySelector<HTMLElement>(`.${styles["first-name"]}`),
              heading.querySelector<HTMLElement>(`.${styles["last-name"]}`),
            ];

            nameLines.forEach((nameLine, lineIndex) => {
              if (!nameLine) return;

              const split = SplitText.create(nameLine, {
                type: "words,chars",
              });
              headingSplits.push(split);
              const characters = split.chars;
              const characterOrder = deterministicCharacterOrder(
                characters.length,
              );
              const characterRank = new Map(
                characterOrder.map((characterIndex, rank) => [
                  characterIndex,
                  rank,
                ]),
              );
              const initialBlur = "32px";

              if (lineIndex === 0) {
                firstNameRevealDuration =
                  characterDuration +
                  Math.max(0, characters.length - 1) * characterStagger;
              } else {
                nameLine.dataset.revealing = "true";
              }

              gsap.set(characters, {
                autoAlpha: 0,
                filter: `blur(${initialBlur})`,
              });
              const characterRevealStart =
                lineIndex === 0
                  ? 0.45
                  : 0.45 + firstNameRevealDuration * 0.5;
              const characterRevealEnd =
                characterRevealStart +
                characterDuration +
                Math.max(0, characters.length - 1) * characterStagger;
              if (lineIndex === 1) {
                metadataStart =
                  characterRevealStart +
                  (characterRevealEnd - characterRevealStart) * 0.5;
              }
              headingRevealEnd = Math.max(
                headingRevealEnd,
                characterRevealEnd,
              );

              timeline?.fromTo(
                characters,
                { autoAlpha: 0, filter: `blur(${initialBlur})` },
                {
                  autoAlpha: 1,
                  filter: "blur(0px)",
                  duration: characterDuration,
                  stagger: (characterIndex) =>
                    (characterRank.get(characterIndex) ?? characterIndex) *
                    characterStagger,
                  ease: "power2.out",
                },
                characterRevealStart,
              );

              if (lineIndex === 1) {
                timeline?.call(
                  () => nameLine.removeAttribute("data-revealing"),
                  [],
                  characterRevealEnd,
                );
              }
            });
          } catch {
            heading
              .querySelector<HTMLElement>(`.${styles["last-name"]}`)
              ?.removeAttribute("data-revealing");
            headingSplits.forEach((split) => split.revert());
            headingSplits.length = 0;
            timeline.fromTo(
              heading,
              { autoAlpha: 0, filter: "blur(12px)" },
              {
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: 1.05,
                ease: "power2.out",
              },
              0.45,
            );
            headingRevealEnd = 1.5;
          }
        } else if (heading) {
          gsap.set(heading, { autoAlpha: 1, filter: "none" });
        }

        const supportingStart = reducedMotion ? 0.15 : headingRevealEnd + 0.15;
        const supportingEnd = reducedMotion
          ? supportingStart
          : supportingStart +
            0.7 +
            Math.max(0, supporting.length - 1) * 0.06;

        if (!reducedMotion) {
          timeline.fromTo(
            supporting,
            { autoAlpha: 0, filter: "blur(10px)" },
            {
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.7,
              stagger: 0.06,
              ease: "power2.out",
            },
            supportingStart,
          );
        }

        if (!reducedMotion) {
          timeline.call(() => buildMetadataTimeline(), [], metadataStart);
        }

        timeline.call(
          markHomeHeroIntroComplete,
          [],
          reducedMotion
            ? supportingEnd
            : metadataStart,
        );
      });

      return () => {
        cancelled = true;
        timeline?.kill();
        metadataTimeline?.kill();
        metadataObserver?.disconnect();
        headingRef.current
          ?.querySelector<HTMLElement>(`.${styles["last-name"]}`)
          ?.removeAttribute("data-revealing");
        headingSplits.forEach((split) => split.revert());
      };
    },
    {
      scope: headerRef,
      dependencies: [
        signalNavIntroAfterHero,
        homeHeroSceneReady,
        homeHeroIntroReady,
      ],
    },
  );

  useGSAP(
    () => {
      const header = headerRef.current;
      const heading = headingRef.current;
      if (
        !header ||
        !heading ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      gsap.to(heading, {
        yPercent: -12,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: header,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    },
    { scope: headerRef },
  );

  return (
    <header
      ref={headerRef}
      id="home-hero"
      className={`${styles["hero"]} ${
        signalNavIntroAfterHero && !heroIntroStarted
          ? styles["hero-pending"]
          : ""
      }`}
      style={
        signalNavIntroAfterHero && !heroIntroStarted
          ? { ...heroStyle, opacity: 0, visibility: "hidden" }
          : heroStyle
      }
    >
      <div className={styles["hero-main"]}>
        <div className={styles["name-lockup"]}>
          <p id="hero-role" className={styles["role"]} data-hero-support>
            {locale === "nb" ? (
              <>
                Digital designer &amp;
                <br /> kreativ frontend-utvikler
              </>
            ) : (
              <>
                Digital designer &amp;
                <br /> creative frontend developer
              </>
            )}
          </p>

          <h1 ref={headingRef} aria-describedby="hero-role">
            <span className={styles["first-name"]}>Kenneth</span>
            <span
              className={styles["last-name"]}
              data-text="Jørgensen"
            >
              Jørgensen
            </span>
          </h1>
        </div>
      </div>

      <div ref={metadataRef} className={styles["metadata-rail"]}>
        <span className={styles["metadata-line"]} aria-hidden="true" />
        <div className={styles["metadata-item"]} data-metadata-item>
          {locale === "nb" ? "Bodø, Norge — 67°N" : "Bodø, Norway — 67°N"}
        </div>
        <div
          className={`${styles["metadata-item"]} ${styles["clock"]}`}
          data-metadata-item
          aria-live="off"
        >
          <span aria-hidden="true">( </span>
          <i className={styles["clock-dot"]} aria-hidden="true" />
          <time>{localTime}</time>
          <span aria-hidden="true"> )</span>
        </div>
        <div
          className={`${styles["metadata-item"]} ${styles["kp-metric"]}`}
          data-metadata-item
        >
          <button
            type="button"
            className={styles["kp-trigger"]}
            aria-describedby="hero-kp-explainer"
          >
            {locale === "nb" ? "KP-indeks" : "KP index"}: {kp.toFixed(1)}
            <i aria-hidden="true" />
          </button>
          <span
            id="hero-kp-explainer"
            role="tooltip"
            className={styles["kp-tooltip"]}
          >
            <strong>{kpLabel}</strong>
            {kpDescription}
          </span>
        </div>
        <div
          className={`${styles["metadata-item"]} ${styles["language"]}`}
          data-metadata-item
        >
          <button
            type="button"
            className={`${styles["language-switch"]} ${locale === "en" ? styles["language-switch-en"] : ""}`}
            onClick={toggleLocale}
            aria-label={`${t.languageSwitchLabel}: ${locale === "nb" ? "English" : "Norsk"}`}
          >
            <span className={locale === "nb" ? styles["active-locale"] : ""}>
              NO
            </span>
            <i aria-hidden="true" />
            <span className={locale === "en" ? styles["active-locale"] : ""}>
              EN
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
