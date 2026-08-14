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
    let activeSection: HTMLElement | null = null;
    let frame: number | null = null;

    const updateAuroraState = () => {
      frame = null;
      const activationLine = window.innerHeight * 0.5;
      const active =
        sections.find((section) => {
          const { top, bottom } = section.getBoundingClientRect();
          return top <= activationLine && bottom > activationLine;
        }) ??
        sections.reduce<HTMLElement | null>((closest, section) => {
          if (!closest) return section;
          const closestDistance = Math.abs(
            closest.getBoundingClientRect().top - activationLine,
          );
          const sectionDistance = Math.abs(
            section.getBoundingClientRect().top - activationLine,
          );
          return sectionDistance < closestDistance ? section : closest;
        }, null);

      if (!active || active === activeSection) return;
      activeSection = active;
      setAuroraPresence(Number(active.dataset.auroraPresence || 1));
      if (active.dataset.auroraColor) setLightColor(active.dataset.auroraColor);
    };

    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateAuroraState);
    };

    updateAuroraState();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
      setAuroraPresence(1);
      setLightColor("#a6d59e");
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
