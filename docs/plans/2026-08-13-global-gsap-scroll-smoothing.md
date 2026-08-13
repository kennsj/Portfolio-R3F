# Global GSAP Scroll Smoothing

## Scope

Add restrained global GSAP scroll smoothing to the portfolio while preserving the fixed navigation, fixed 3D background, route transitions, anchor scrolling, existing ScrollTriggers, and reduced-motion behavior.

## Structure

- Add `#smooth-wrapper` around the normal document flow and `#smooth-content` around `main` plus `footer`.
- Keep the navigation, cursor, page transition, and fixed 3D canvas outside the transformed scroll content.

## Motion

- Initialize GSAP ScrollSmoother once in the root layout after mount.
- Use a 0.9-second smooth value with `effects` disabled so the result is weighted but restrained.
- Disable the smoother for `prefers-reduced-motion`.
- Refresh ScrollTrigger after initialization and kill the instance on unmount.

## Anchor Scrolling

- Retain existing ScrollToPlugin behavior when the smoother is inactive.
- Target ScrollSmoother's scroll position when active so header controls and hash navigation retain the current fixed-nav offset and easing.
