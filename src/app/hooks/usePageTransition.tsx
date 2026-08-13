import { useNavigate, useLocation } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  setAuroraSpeedMultiplier,
  setLightColor,
  setTransitionLightSurge,
} from "../components/Experiences/lightStore";
import {
  DEFAULT_PAGE_LIGHT_COLOR,
  PAGE_LIGHT_COLORS,
} from "../pageLightColors";
import { gsapScrollToTop } from "../utils/gsapScroll";
import { useI18n } from "./useI18n";

function normalizePath(p: string) {
  const t = p.replace(/\/$/, "") || "/";
  return t;
}

let transitionInProgress = false;

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

/** Path + optional hash for TanStack Router (hash without leading #). */
function splitInternalHref(href: string): { to: string; hash?: string } {
  if (href.startsWith("#")) {
    const h = href.slice(1);
    return h ? { to: "/", hash: h } : { to: "/" };
  }
  const hashIdx = href.indexOf("#");
  if (hashIdx === -1) {
    return { to: href || "/" };
  }
  const to = href.slice(0, hashIdx) || "/";
  const hash = href.slice(hashIdx + 1);
  return hash ? { to, hash } : { to };
}

export function usePageTransition() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { locale } = useI18n();

  function transitionTo(href: string) {
    const { to, hash } = splitInternalHref(href);
    const targetPath = normalizePath(to);
    const currentPath = normalizePath(pathname);

    // Same route: never fade main out (that left opacity at 0 when pathname did not change).
    if (targetPath === currentPath) {
      if (hash) {
        void navigate({
          to: targetPath,
          hash,
          search: { lang: locale },
          replace: true,
          resetScroll: false,
          hashScrollIntoView: false,
        });
        // Smooth scroll + ScrollTrigger.refresh: RootLayout `useLayoutEffect`
      } else {
        void navigate({
          to: targetPath,
          search: { lang: locale },
          replace: true,
        });
        gsapScrollToTop();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }
      return;
    }

    if (transitionInProgress) return;

    const content = document.querySelector<HTMLElement>("#smooth-content");
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const changeRoute = async () => {
      setLightColor(PAGE_LIGHT_COLORS[targetPath] ?? DEFAULT_PAGE_LIGHT_COLOR);
      await navigate({
        to,
        search: { lang: locale },
        ...(hash
          ? { hash, resetScroll: false, hashScrollIntoView: false }
          : {}),
      });
      if (!hash) gsapScrollToTop();
    };

    if (reducedMotion || !content) {
      void changeRoute().then(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      return;
    }

    transitionInProgress = true;
    setAuroraSpeedMultiplier(5.5);
    setTransitionLightSurge(1.65);

    gsap.to(content, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.in",
      onStart: () => {
        content.style.pointerEvents = "none";
      },
      onComplete: () => {
        void wait(200)
          .then(changeRoute)
          .then(
            () =>
              new Promise<void>((resolve) =>
                requestAnimationFrame(() =>
                  requestAnimationFrame(() => resolve()),
                ),
              ),
          )
          .then(() => wait(200))
          .then(() => {
            setAuroraSpeedMultiplier(1);
            setTransitionLightSurge(1);
            gsap.to(content, {
              opacity: 1,
              duration: 0.8,
              ease: "power3.out",
              onComplete: () => {
                content.style.pointerEvents = "";
                ScrollTrigger.refresh();
                transitionInProgress = false;
              },
            });
          })
          .catch(() => {
            gsap.set(content, { opacity: 1 });
            content.style.pointerEvents = "";
            setAuroraSpeedMultiplier(1);
            setTransitionLightSurge(1);
            transitionInProgress = false;
          });
      },
    });
  }

  return { transitionTo };
}
