# Project Preview Tilt Design

## Scope

Add subtle directional tilt to the existing project hover preview without changing its layout, reveal transition, media switching, or pointer tracking.

## Behavior

- Derive tilt from horizontal pointer velocity rather than cursor position.
- Moving right rotates the preview clockwise; moving left rotates it counter-clockwise.
- Clamp rotation to nine degrees in either direction.
- Increase positional follow duration to 0.75 seconds for a more noticeable trailing response.
- Smooth rotation independently from positional following and return it to neutral shortly after horizontal movement stops.
- Preserve the existing touch exclusion and reduced-motion behavior.

## Implementation

Extend the existing GSAP pointer-follow logic in `Projects.tsx`. Store the previous pointer position, calculate the horizontal delta for each move, animate the preview position as before, and apply a bounded rotation to the same positioned element. No CSS changes or new dependencies are required.
