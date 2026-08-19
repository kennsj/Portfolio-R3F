# Footer email hover design

## Goal

Make the oversized footer email animate with the same randomized character-reveal language as the other links while keeping its larger scale calm, seamless, and natural.

## Approved approach

- Preserve the existing `AnimatedLink` component and character-based reveal.
- Replace the long-link-only grouped blur treatment with a size-aware character reveal.
- Normalize blur distance, opacity, duration, and stagger using the rendered font size and character count so large text does not appear harsher or substantially slower.
- Keep the email dot and underline stable to avoid excessive competing motion.
- Preserve focus behavior and `prefers-reduced-motion` handling.

## Verification

- Confirm the production build succeeds.
- Verify hover entry, interrupted exit, repeated hover, keyboard focus, and reduced-motion behavior.
