import { useNavigate, useLocation } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
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
import { useManualKp } from "./KpContext";
import { useI18n } from "./useI18n";
import { getKpWaveSpeedMultiplier, useKpIndex } from "./useKpIndex";
import { localizePath, stripLocalePrefix } from "../utils/locale-path";

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
  const { data } = useKpIndex();
  const { manualKp } = useManualKp();

  function transitionTo(
    href: string,
    options: { skipEnterAnimation?: boolean } = {},
  ) {
    const { to, hash } = splitInternalHref(href);
    const localizedTarget = localizePath(to, locale);
    const targetPath = normalizePath(localizedTarget);
    const currentPath = normalizePath(pathname);
    const logicalTargetPath = normalizePath(stripLocalePrefix(targetPath));

    // Same route: never fade main out (that left opacity at 0 when pathname did not change).
    if (targetPath === currentPath) {
      if (hash) {
        void navigate({
          to: targetPath,
          hash,
          search: {},
          replace: true,
          resetScroll: false,
          hashScrollIntoView: false,
        });
        // Smooth scroll + ScrollTrigger.refresh: RootLayout `useLayoutEffect`
      } else {
        void navigate({
          to: targetPath,
          search: {},
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
      setLightColor(
        PAGE_LIGHT_COLORS[logicalTargetPath] ?? DEFAULT_PAGE_LIGHT_COLOR,
      );
      await navigate({
        to: targetPath,
        search: {},
        ...(hash
          ? { hash, resetScroll: false, hashScrollIntoView: false }
          : {}),
      });
      if (!hash) {
        if (options.skipEnterAnimation) {
          const smoother = ScrollSmoother.get();
          if (smoother) smoother.scrollTop(0);
          window.scrollTo(0, 0);
        } else {
          gsapScrollToTop();
        }
      }
    };

    if (reducedMotion || !content) {
      void changeRoute().then(() => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      return;
    }

    transitionInProgress = true;
    const kp = manualKp ?? data?.latest ?? 5;
    const kpWaveSpeed = getKpWaveSpeedMultiplier(kp);
    const transitionSpeed = Math.min(9, 10 / kpWaveSpeed);

    setAuroraSpeedMultiplier(transitionSpeed);
    setTransitionLightSurge(2.6);

    gsap.to(content, {
      opacity: 0,
      duration: 0.75,
      ease: "power2.in",
      onStart: () => {
        content.style.pointerEvents = "none";
      },
      onComplete: () => {
        void wait(325)
          .then(changeRoute)
          .then(
            () =>
              new Promise<void>((resolve) =>
                requestAnimationFrame(() =>
                  requestAnimationFrame(() => resolve()),
                ),
              ),
          )
          .then(() => wait(325))
          .then(() => {
            setAuroraSpeedMultiplier(1);
            setTransitionLightSurge(1);
            if (options.skipEnterAnimation) {
              gsap.set(content, { opacity: 1 });
              content.style.pointerEvents = "";
              window.dispatchEvent(new Event("page-transition-enter"));
              ScrollTrigger.refresh();
              transitionInProgress = false;
              return;
            }
            window.dispatchEvent(new Event("page-transition-enter"));
            gsap.to(content, {
              opacity: 1,
              duration: 1,
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
