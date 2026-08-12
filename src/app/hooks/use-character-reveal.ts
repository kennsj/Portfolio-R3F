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

export function getCharacterRevealTiming(length: number) {
  const excessCharacters = Math.max(0, length - 8);
  const speedFactor = Math.max(1.42, Math.exp(-excessCharacters * 0.035));

  return {
    duration: 0.8 * speedFactor,
    stagger: 0.022 * speedFactor,
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
          clearProps: "transform",
        });
        return;
      }

      let cancelled = false;
      let split: SplitText | null = null;
      let tween: gsap.core.Tween | null = null;

      document.fonts.ready.then(() => {
        if (cancelled || !heading.isConnected) return;
        try {
          split = SplitText.create(heading, { type: "words,chars" });
        } catch {
          gsap.set(heading, {
            autoAlpha: 1,
            filter: "none",
            clearProps: "transform",
          });
          return;
        }
        const units = split.chars;
        const order = deterministicCharacterOrder(units.length);
        const rank = new Map(
          order.map((characterIndex, position) => [characterIndex, position]),
        );
        const timing = getCharacterRevealTiming(units.length);

        gsap.set(heading, { autoAlpha: 1 });
        if (!immediate) {
          gsap.set(units, { autoAlpha: 0, filter: "blur(12px)" });
        }
        tween = gsap.fromTo(
          units,
          {
            autoAlpha: 0,
            filter: "blur(12px)",
          },
          {
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: timing.duration,
            delay,
            immediateRender: immediate,
            ease: "power2.out",
            stagger: (index) => (rank.get(index) ?? index) * timing.stagger,
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
