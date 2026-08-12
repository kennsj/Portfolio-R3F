# Reference Hero Redesign

## Direction

Rebuild the home hero as closely as practical to the supplied earlier-version reference while retaining the live 3D aurora background and current entrance infrastructure.

## Composition

- Keep the fixed navigation above the hero.
- Place a quiet role statement above the name.
- Use the visitor-facing name as the single `h1`, split across two asymmetric lines: solid `Kenneth`, outlined `Jørgensen`.
- Place a restrained Discover control in the lower-left area of the hero.
- Place local time, KP index, and aurora status as a semantic definition list in the lower-right.
- Preserve generous negative space and avoid decorative rules or a large pill CTA.

## Typography and Color

- Use the existing Syne display family for the name.
- Use IBM Plex Mono for the role, control, and environmental data.
- Reuse the existing signal-black, primary, muted-primary, and aurora-mint tokens.
- Keep the 3D experience visible behind the interface while maintaining text contrast.

## Semantics and Motion

- Retain the current character-based `h1` reveal and coordinated canvas entrance.
- Reveal supporting content quietly after the name.
- Use a paragraph for the role, a button for the scroll action, and `dl`/`dt`/`dd` for live readings.
- Preserve reduced-motion behavior.

## Responsive Behavior

- Maintain the asymmetric name composition on wide screens.
- Reduce or remove horizontal offsets on narrow screens to prevent clipping.
- Stack the lower utility content cleanly while keeping all essential readings available.
