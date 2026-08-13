import gsap from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import ScrollSmoother from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollToPlugin, ScrollSmoother);

/** Site footer is a sibling of `<main>`; fade/route transitions must target both. */
export const GSAP_PAGE_CONTENT_SELECTOR = "main, footer";

/** Fixed nav height — keeps section headings clear of the bar */
export const SCROLL_NAV_OFFSET_PX = 96;

function scrollWindowToElement(el: HTMLElement, onComplete?: () => void) {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    gsap.to(smoother, {
      duration: 0.82,
      ease: "power3.out",
      scrollTop: Math.max(
        0,
        el.getBoundingClientRect().top +
          smoother.scrollTop() -
          SCROLL_NAV_OFFSET_PX,
      ),
      onComplete,
    });
    return;
  }

  gsap.to(window, {
    duration: 0.82,
    ease: "power3.out",
    scrollTo: {
      y: el,
      offsetY: SCROLL_NAV_OFFSET_PX,
      // Touch devices: default autoKill stops the tween when the browser
      // still has touch/scroll in the same gesture as the tap (link click).
      autoKill: false,
    },
    onComplete,
  });
}

export function gsapScrollToHashId(id: string, onComplete?: () => void) {
  const clean = id.replace(/^#/, "");
  if (!clean) return;
  const el = document.getElementById(clean);
  if (!el) return;
  scrollWindowToElement(el, onComplete);
}

/**
 * Retries until the target exists (e.g. lazy `Projects` mounting for `#work`).
 */
export function gsapScrollToHashIdWhenReady(
  id: string,
  onDone?: () => void,
  maxAttempts = 72,
) {
  const clean = id.replace(/^#/, "");
  if (!clean) {
    onDone?.();
    return;
  }

  let attempts = 0;
  const tick = () => {
    const el = document.getElementById(clean);
    if (el) {
      scrollWindowToElement(el, onDone);
      return;
    }
    if (++attempts >= maxAttempts) {
      onDone?.();
      return;
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export function gsapScrollToTop() {
  const smoother = ScrollSmoother.get();
  if (smoother) {
    gsap.to(smoother, {
      duration: 0.72,
      ease: "power3.out",
      scrollTop: 0,
    });
    return;
  }

  gsap.to(window, {
    duration: 0.72,
    ease: "power3.out",
    scrollTo: { y: 0, autoKill: true },
  });
}
