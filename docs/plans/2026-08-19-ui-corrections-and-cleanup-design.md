# UI Corrections and Cleanup

## Goal

Improve accessibility, reduced-motion behavior, media performance, and navigation efficiency while preserving the portfolio's current visual direction, routes, responsive layouts, page transitions, and WebGL identity.

## Scope

- Add a keyboard skip link, dark color-scheme declaration, and matching browser theme color.
- Stop decorative looping media for reduced-motion users and avoid unnecessary preview playback.
- Replace the navigation's continuous active-section animation-frame loop with event-driven observation.
- Add stable image dimensions and appropriate loading hints where the asset dimensions are known.
- Contain overscroll inside the full-screen navigation menu.
- Remove commented-out and opted-out interface sections.
- Remove styles, component data, types, and bilingual translation entries that become unused.
- Format touched HTML, CSS/SCSS, and React/TypeScript files without changing the established design system.

## Cleanup Boundary

Remove code only when it is either:

1. statically unreferenced by the current application, or
2. exclusively associated with a commented-out, opted-out, or currently disabled section.

Dynamic CSS Module references and route-driven content must be verified manually before removal. Existing project routes, live sections, SEO data, localization behavior, and interaction transitions remain in scope for preservation.

## Verification

- Run the production build.
- Run TypeScript checking when supported by the repository configuration.
- Run the configured lint command and report configuration limitations if it remains unavailable.
- Review the final diff for accidental generated-output or unrelated changes.
