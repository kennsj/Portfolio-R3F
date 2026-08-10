# Home Hero Reveal Design

## Scope

Add a cinematic loading and reveal sequence when entering the home route (`/`). Other route transitions remain unchanged for this phase.

## Architecture

- `ProgressiveBackground`/Three.js reports readiness after the scene assets are loaded and the first frame has rendered.
- `HeroIntroContext` coordinates home-route readiness and intro completion.
- The home hero owns one GSAP master timeline for the scene, hero content, navigation, and overlay.
- A synchronous CSS black state prevents a first-paint flash before JavaScript runs.

## Sequence

- Begin with a fully opaque black overlay and hidden home hero/navigation.
- Hold black briefly, then reveal the WebGL scene over roughly 1.4–2.2 seconds using opacity, brightness, and subtle scale.
- Reveal metadata, then masked headline lines with an upward stagger.
- Reveal supporting copy and CTA.
- Reveal navigation last.
- Remove the overlay and restore normal interaction.

## Lifecycle

- The intro runs when entering `/` and does not replay during scrolling or rerenders.
- It can replay after leaving home and returning to `/`.
- WebGL failure falls back to a controlled content reveal instead of leaving the page hidden.
- Reduced-motion users receive a short crossfade with no large transforms.

## Constraints

- Preserve the existing hero layout, typography, colors, WebGL scene, and interactions.
- Do not alter non-home route transitions.
- Avoid arbitrary multi-second loader timers and independent uncontrolled intro animations.
