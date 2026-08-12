# Consistent H2 Reveal Design

## Scope

Give every `h2` in the site the same character-based blur and fade reveal used by the home hero `h1`, without changing heading copy, typography, layout, or semantic hierarchy.

## Implementation

- Render every site `h2` through the existing `HeadingAnimation` component.
- Split reusable headings into words and characters after fonts are ready, then animate the characters in the existing deterministic shuffled order.
- Trigger below-fold headings once when their top reaches 88% of the viewport.
- Coordinate the home-header `h2` with the existing hero intro and remove it from the generic supporting-copy tween so it is animated only once.
- Preserve cleanup, responsive behavior, and the reduced-motion static fallback.

## Adaptive Timing

- Keep the established character pace for headings of up to eight characters.
- Above eight characters, exponentially compress duration and stagger timing as character count increases, with a lower bound that keeps long headings legible.
- Apply the same timing helper to the hero `h1` and all reusable heading reveals so both heading levels remain visually consistent.

