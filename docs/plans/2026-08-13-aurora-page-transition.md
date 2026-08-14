# Aurora page transition

## Approved direction

- Keep the persistent navigation and WebGL canvas visible throughout navigation.
- Fade `#smooth-content` (page content and footer) out over 750 ms.
- Ease the aurora from its current KP-derived speed to a 9x transition multiplier.
- Hold on the canvas for 650 ms, changing route at the midpoint.
- Fade the destination content in over 1000 ms.
- Ease the aurora multiplier back to 1x as the destination begins entering.
- Raise scene lighting to 2.6x and expand a much brighter central point light during
  the canvas-only interval, then damp both back as the destination enters.
- Do not replay the home hero intro—or its canvas fade—after it has completed once.
- Skip the animation for reduced-motion users and prevent overlapping transitions.

The transition uses the existing GSAP and shader infrastructure. It adds no overlay,
does not remount the canvas, and does not replace the KP-derived base speed.
