# Homepage structure cleanup

## Goal

Make the homepage JSX easier to read, navigate, and edit without intentionally changing its visual output, animation timing, routing, accessibility, or content.

## Approved approach

Separate dense presentation markup from behavior while avoiding a broad architectural rewrite.

- Move homepage aurora section tracking into a focused hook.
- Extract the header role and metadata rail into named components while retaining animation refs and selectors.
- Split the projects view into named list, item, and preview components while keeping animation ownership and shared refs in the section controller.
- Extract repeated expertise item markup.
- Simplify localized values and deeply nested JSX expressions with named variables.
- Keep existing semantic elements, DOM order, CSS classes, data attributes, IDs, and animation contracts intact.
- Keep the cleanup limited to homepage components.

## Verification

- Run the production build.
- Run diff whitespace checks.
- Confirm existing selectors and data attributes remain present.
