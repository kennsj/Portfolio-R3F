import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useHeroIntro } from "../../../hooks/HeroIntroContext";
import { useI18n } from "../../../hooks/useI18n";
import { gsapScrollToHashIdWhenReady } from "../../../utils/gsapScroll";
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
  const { locale } = useI18n();
  const { data } = useKpIndex();
  const { manualKp } = useManualKp();
  const kp = manualKp ?? data?.latest ?? 0;
  const { label: kpLabel } = getKpLabel(kp, locale);
  const normalizedKp = Math.min(1, Math.max(0, kp / 9));
  const heroStyle: HeroStyle = {
    "--aurora-stroke-opacity": 0.2 + normalizedKp * 0.35,
    "--aurora-stroke-glow": `${0.5 + normalizedKp * 1.6}px`,
  };
  const [localTime, setLocalTime] = useState("--:--");
  const [heroIntroStarted, setHeroIntroStarted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const updateLocalTime = () => {
      setLocalTime(
        new Intl.DateTimeFormat(locale === "nb" ? "nb-NO" : "en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Oslo",
          hour12: false,
        }).format(new Date()),
      );
    };

    updateLocalTime();
    const timer = window.setInterval(updateLocalTime, 30_000);

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

        timeline = gsap.timeline();

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

        if (heading && !reducedMotion) {
          gsap.set(heading, { autoAlpha: 1, filter: "none" });

          try {
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
              const initialBlur = lineIndex === 0 ? "32px" : "18px";

              gsap.set(characters, {
                autoAlpha: 0,
                filter: `blur(${initialBlur})`,
              });
              timeline?.fromTo(
                characters,
                { autoAlpha: 0, filter: `blur(${initialBlur})` },
                {
                  autoAlpha: 1,
                  filter: "blur(0px)",
                  duration: 1.05,
                  stagger: (characterIndex) =>
                    (characterRank.get(characterIndex) ?? characterIndex) *
                    0.028,
                  ease: "power2.out",
                },
                lineIndex === 0 ? 0.45 : 0.75,
              );
            });
          } catch {
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
          }
        } else if (heading) {
          gsap.set(heading, { autoAlpha: 1, filter: "none" });
        }

        const supportingStart = reducedMotion ? 0.15 : 1.35;
        timeline.call(markHomeHeroIntroComplete, [], supportingStart);

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
      });

      return () => {
        cancelled = true;
        timeline?.kill();
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

      <div className={styles["hero-utility"]} data-hero-support>
        <button
          type="button"
          className={styles["discover"]}
          onClick={() => gsapScrollToHashIdWhenReady("work")}
        >
          <span>{locale === "nb" ? "Oppdag" : "Discover"}</span>
          <i aria-hidden="true" />
        </button>

        <dl className={styles["environment"]}>
          <div>
            <dt>{locale === "nb" ? "Lokal tid" : "Local time"}</dt>
            <dd>{localTime}</dd>
          </div>
          <div>
            <dt>KP Index</dt>
            <dd>{kp.toFixed(1)}</dd>
          </div>
          <div>
            <dt>{locale === "nb" ? "Nordlys" : "Aurora"}</dt>
            <dd>{kpLabel}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
};

export default Header;
