import { Suspense, useEffect } from "react";
import Header from "./components/Layout/Header/Header";
import Aurora from "./components/Layout/Aurora/Aurora";
import Expertise from "./components/Layout/Expertise/Expertise";
import Projects from "./components/Layout/Project/Projects";
import { useI18n } from "./hooks/useI18n";
import {
  setAuroraPresence,
  setLightColor,
} from "./components/Experiences/lightStore";
import styles from "./styles/Homepage.module.scss";
import HomeAbout from "./components/Layout/HomeAbout/HomeAbout";

export default function HomePage() {
  const { t } = useI18n();

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

      <HomeAbout />

      <Suspense>
        <Projects />
      </Suspense>
      <Suspense>
        <Expertise />
      </Suspense>
      <section
        className={styles.aurora}
        data-aurora-state
        data-aurora-presence="1.16"
        data-aurora-color="#a8f3c3"
        aria-label={t.auroraTitleLineOne}
      >
        <Aurora />
      </section>
    </>
  );
}
