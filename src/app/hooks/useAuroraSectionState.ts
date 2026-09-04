import { useEffect } from "react";
import {
  setAuroraPresence,
  setLightColor,
} from "../components/Experiences/lightStore";

const DEFAULT_AURORA_COLOR = "#a6d59e";

export function useAuroraSectionState() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-aurora-state]"),
    );
    let activeSection: HTMLElement | null = null;
    let frame: number | null = null;

    const findActiveSection = (activationLine: number) =>
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

    const updateAuroraState = () => {
      frame = null;
      const active = findActiveSection(window.innerHeight * 0.5);

      if (!active || active === activeSection) return;

      activeSection = active;
      setAuroraPresence(Number(active.dataset.auroraPresence || 1));

      if (active.dataset.auroraColor) {
        setLightColor(active.dataset.auroraColor);
      }
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
      setLightColor(DEFAULT_AURORA_COLOR);
    };
  }, []);
}
