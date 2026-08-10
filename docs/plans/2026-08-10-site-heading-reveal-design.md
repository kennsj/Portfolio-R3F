# Site Entrance and Heading Reveal Design

## Scope

Implement a home entrance inspired by Fleava and reusable character-based heading reveals inspired by Trionn. Preserve the existing layout, typography, content, navigation, and WebGL scene. Project-list titles remain unchanged.

## Home Entrance

- Begin with a fully black viewport and hidden hero UI.
- Initialize the existing WebGL scene behind the black state.
- Use the existing first-render readiness signal instead of a normal loading delay.
- Reveal the canvas over approximately 1.8 seconds with opacity, brightness, and subtle scale.
- Begin the hero character reveal once the scene is clearly visible.
- Resolve supporting hero UI and navigation after the headline.
- Use one coordinated GSAP entrance timeline.

## Character Reveal

- Upgrade the existing semantic `HeadingAnimation` component and use an internal reusable hook.
- Wait for fonts before creating SplitText instances.
- Split headings into characters.
- Animate characters from `autoAlpha: 0` and `blur(12px)` to fully visible and sharp.
- Use deterministic randomized character ordering instead of left-to-right staggering.
- Trigger below-fold headings once through ScrollTrigger.
- Revert SplitText and kill animation instances during cleanup.

## Accessibility and Failure Handling

- Reduced motion uses a short reveal without blur or stagger.
- A WebGL failure fallback prevents permanently hidden content.
- Initial hidden states prevent flashes before GSAP initializes.
