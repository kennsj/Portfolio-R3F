import { Suspense, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./components/Layout/Header/Header";
import Contact from "./components/Layout/Contact/Contact";
import Expertise from "./components/Layout/Expertise/Expertise";
import Projects from "./components/Layout/Project/Projects";
import { useI18n } from "./hooks/useI18n";
import {
  setAuroraPresence,
  setLightColor,
} from "./components/Experiences/lightStore";
import styles from "./styles/Homepage.module.scss";
import HeadingAnimation from "./components/UI/HeadingAnimation/HeadingAnimation";
import { usePageTransition } from "./hooks/usePageTransition";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const { t } = useI18n();
  const { transitionTo } = usePageTransition();
  const aboutRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = aboutRef.current;
      if (
        !section ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const pathways =
        section.querySelectorAll<HTMLElement>("[data-about-copy]");
      gsap.from(pathways, {
        yPercent: 22,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "shiftReveal",
        scrollTrigger: { trigger: pathways[0], start: "top 88%", once: true },
      });
    },
    { scope: aboutRef },
  );

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-aurora-state]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        const el = active.target as HTMLElement;
        setAuroraPresence(Number(el.dataset.auroraPresence || 1));
        if (el.dataset.auroraColor) setLightColor(el.dataset.auroraColor);
      },
      { rootMargin: "-28% 0px -28%", threshold: [0, 0.25, 0.5, 0.75] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      setAuroraPresence(1);
    };
  }, []);

  return (
    <>
      {/*
				Direction: Northern Signal Studio.
				World: an arctic creative practice documented with the precision of a field station.
				First viewport: oversized editorial type cuts through a live aurora atmosphere.
				Path: positioning → work → capabilities → direct contact and live aurora forecast.
				Signature: the aurora is both environmental material and a living data signal.
			*/}
      <div
        data-aurora-state
        data-aurora-presence="0.92"
        data-aurora-color="#9df5bf"
      >
        <Header signalNavIntroAfterHero />
      </div>

      <section
        ref={aboutRef}
        id="about"
        data-aurora-state
        data-aurora-presence="0.72"
        data-aurora-color="#86cfa3"
      >
        <div className={styles.about}>
          <HeadingAnimation level={2} className={styles["section-index"]}>
            <span>01 / {t.homeAboutLabel}</span>
            <span>Design × Development</span>
          </HeadingAnimation>
          <div className={styles["about-statement"]}>
            <h2 data-about-copy>{t.homeAboutTitle}</h2>
            <div className={styles["about-copy"]} data-about-copy>
              <p>{t.homeAboutBody}</p>
              <a
                className={styles["about-link"]}
                href="/about"
                onClick={(event) => {
                  event.preventDefault();
                  transitionTo("/about");
                }}
              >
                <span>{t.homeAboutCta}</span>
                <i aria-hidden="true">↗</i>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Suspense>
        <Projects />
      </Suspense>
      <Suspense>
        <Expertise />
      </Suspense>
      <Contact showForecast />
    </>
  );
}
