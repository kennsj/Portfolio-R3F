# Animated Link Component Design

## Scope

Replace the document-wide link-hover mutation hook with a reusable semantic link component. Preserve each link's existing layout, click behavior, accessibility, nested content, and typography.

## Component

- Render a standard `a` element and accept normal anchor attributes and event handlers.
- Split only visible text nodes when pointer hover or keyboard focus starts.
- Allow complex links to identify a narrower animation target, such as the project title.
- Keep icons and elements marked `aria-hidden` out of SplitText.
- Own GSAP animation setup, reversal, cleanup, touch exclusion, and reduced-motion handling locally.

## Typography Preservation

- Read the computed typography from each original text node's parent before inserting animation markup.
- Store the values as scoped CSS custom properties on the temporary wrapper.
- Apply font family, size, style, weight, line height, letter spacing, and text transform to generated wrappers and characters with sufficient specificity to resist component rules such as `.meta span`.
- Continue inheriting color so existing hover and focus color changes remain functional.

## Migration

- Replace ordinary site anchors with `AnimatedLink`.
- Leave components that already own specialized character animation, such as `ArrowLink` and `AnimatedButton`, unchanged.
- Remove the global `useLinkLetterHover` call after migration so links cannot animate twice.
