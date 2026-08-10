# Complete portfolio structural refactor

## Approved direction

Refine the existing Northern Signal portfolio into one coherent system without redesigning its visual identity. Preserve the dark green atmosphere, warm project section, current typography, aurora/KP signature, editorial grid, controlled asymmetry, and designer/developer positioning.

## Global architecture

- One persistent navigation component with a single exposed navigation model at each responsive state.
- One canonical footer with `id="contact"`, one email address, one navigation group, correct social destinations, location, availability, language, copyright, and back-to-top.
- No page-level contact section or pre-footer contact duplication.
- Visible content is the baseline; GSAP, SplitText, WebGL, custom cursor, and page transitions progressively enhance it.

## Page narratives

- Home: hero, concise practice introduction, selected work, concise capabilities/approach, aurora/KP signature, footer.
- About: stable hero, personal/professional introduction, generic verified experience, three-stage process, detailed capabilities, real tools/technology, availability bridge, footer.
- Projects: localized hero metadata, distinct context fields, visual narrative, one next-project transition, footer.

## Verification

- Norwegian and English across every route.
- 1440, 1024, 768, 390, and 360 px layouts.
- Reduced motion and WebGL fallback.
- One h1, one footer, one visible email, one footer navigation, no mixed-language labels, no corrupted UTF-8.
