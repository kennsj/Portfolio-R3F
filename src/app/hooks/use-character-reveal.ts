import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";

gsap.registerPlugin(SplitText, ScrollTrigger);

type CharacterRevealOptions = {
  immediate?: boolean;
  enabled?: boolean;
  delay?: number;
};

export function deterministicCharacterOrder(length: number) {
  return Array.from({ length }, (_, index) => index).sort((a, b) => {
    const hashA = ((a + 1) * 2654435761) >>> 0;
    const hashB = ((b + 1) * 2654435761) >>> 0;
    return hashA - hashB;
  });
}

function getWordRevealTiming(length: number) {
  const additionalWords = Math.max(0, length - 5);
  const durationScale = Math.max(0.68, 1 - additionalWords * 0.035);

  return {
    duration: 0.8 * durationScale,
    stagger: Math.max(0.045, 0.09 - additionalWords * 0.003),
  };
}

export function useCharacterReveal(
  ref: RefObject<HTMLElement>,
  { immediate = false, enabled = true, delay = 0 }: CharacterRevealOptions = {},
) {
  useGSAP(
    () => {
      const heading = ref.current;
      if (!heading || !enabled) return;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reducedMotion) {
        gsap.set(heading, {
          autoAlpha: 1,
          filter: "none",
          clearProps: "transform,clipPath",
        });
        return;
      }

      let cancelled = false;
      let split: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;

      document.fonts.ready.then(() => {
        if (cancelled || !heading.isConnected) return;
        try {
          split = SplitText.create(heading, {
            type: "words",
            wordsClass: "heading-word",
          });
        } catch {
          gsap.set(heading, {
            autoAlpha: 1,
            filter: "none",
            clearProps: "transform,clipPath",
          });
          return;
        }
        const units = split.words;
        const timing = getWordRevealTiming(units.length);

        gsap.set(heading, { autoAlpha: 1 });
        if (!immediate) {
          gsap.set(units, {
            autoAlpha: 0,
            yPercent: 105,
            clipPath: "inset(0 0 100% 0)",
          });
        }
        tween = gsap.fromTo(
          units,
          {
            autoAlpha: 0,
            yPercent: 105,
            clipPath: "inset(0 0 100% 0)",
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: timing.duration,
            delay,
            immediateRender: immediate,
            ease: "power2.out",
            stagger: timing.stagger,
            scrollTrigger: immediate
              ? undefined
              : {
                  trigger: heading,
                  start: "top 88%",
                  once: true,
                  fastScrollEnd: true,
                },
          },
        );
      });

      return () => {
        cancelled = true;
        tween?.scrollTrigger?.kill();
        tween?.kill();
        split?.revert();
      };
    },
    { scope: ref, dependencies: [immediate, enabled, delay] },
  );
}
