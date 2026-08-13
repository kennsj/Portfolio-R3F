# Pinned Home About Intro

## Scope

Replace the homepage About preview with the supplied composition. Leave the `/about` page unchanged.

## Structure

- Use a semantic homepage `section` with an `h2` for the statement.
- Use a paragraph for supporting copy and a link to `/about`.
- Build the interaction as a dedicated `HomeAbout` component with a CSS Module rather than extending the existing editorial-rail component.

## Scroll Interaction

- On desktop, pin the About composition while the visitor scrolls through the section.
- Split the statement into characters and reveal them from blur plus opacity in a deterministic shuffled order.
- After the statement completes, reveal the supporting paragraph and link from a bottom-to-top clip path.
- On mobile and for reduced motion, do not pin; show the content in normal document flow and preserve readable content.

## Visual Direction

- Match the reference: ample black space, a large quiet statement in the upper center-left, and compact supporting copy plus link offset to the right below it.
- Reuse the existing primary, muted-primary, and aurora-mint tokens.
- Keep the interaction restrained so the motion supports reading rather than competing with the 3D environment.
