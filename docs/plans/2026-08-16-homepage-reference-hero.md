# Homepage Reference Hero

## Approved direction

Update the existing home `Header` and `Nav` components in place so the first viewport matches the supplied reference while preserving the current site architecture, animation infrastructure, aurora experience, localization, and all content below the hero.

## Composition

- Keep the shared maximum width and page gutters as the alignment system.
- Place the logo at the upper-left, the desktop links in the order Work, About, Contact at the horizontal center, and a fixed contact action at the upper-right.
- Reuse the existing identity artwork in the contact action; do not introduce a generated portrait.
- Keep the existing custom two-line name lockup and character reveal unchanged, but position it in the lower-left portion of a hero that is at least `100svh` tall.
- Preserve open negative space above the name for the interactive aurora.
- Replace the current lower utility area with a full-width metadata rail containing location, local time, live KP index, and the language switch.

## Motion

- Append the rail sequence to the existing hero GSAP timeline at the actual computed end of the H1 reveal.
- Animate the rail line left-to-right over roughly 1.35 seconds.
- Measure each metadata item's horizontal position within the rail and schedule its reveal when the growing line reaches that position.
- Recalculate the schedule when the rail geometry changes and clean up animation and resize resources on unmount.
- With reduced motion, render the complete line and metadata immediately while continuing to update the clock.

## Interaction and responsive behavior

- Keep all links and controls keyboard accessible.
- Show the localized KP explanation on hover and keyboard focus using the current live KP value.
- Retain the existing mobile navigation behavior and keep the contact action available without obscuring it.
- Convert the metadata rail to a compact two-column layout on narrow screens.
- Scale the existing wordmark fluidly without clipping.

## Scope

Only the homepage hero and shared top navigation are changed. The aurora implementation, cursor response, live data source, locale routing, H1 letter styling and reveal behavior, and all sections below the hero remain intact.
