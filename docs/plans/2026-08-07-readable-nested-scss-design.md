# Readable nested SCSS design

## Direction

Keep the Northern Signal / aurora field-station identity while making the interface calmer and easier to read.

## Decisions

- Preserve the dark aurora palette and existing page structure.
- Consolidate typography into readable display, body, and utility roles.
- Increase contrast for supporting copy and controls.
- Use consistent content widths, section rhythm, and mobile gutters.
- Nest descendants, pseudo-elements, states, and media-query overrides beneath their parent selectors in SCSS.
- Preserve keyboard focus visibility and reduced-motion support.

## Success criteria

- All component styles remain valid SCSS modules and build successfully.
- The page reads clearly at desktop and mobile widths.
- No visual behavior depends on duplicated flat selectors where nesting can express ownership.
