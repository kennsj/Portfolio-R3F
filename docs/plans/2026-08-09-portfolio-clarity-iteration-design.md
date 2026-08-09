# Portfolio clarity iteration

## Direction

Keep the existing Bodø / 67°N editorial system, live KP signal, aurora atmosphere, oversized Syne typography, warm project surface, and restrained motion. Improve clarity by adding short, decision-oriented context at the points where a visitor decides whether the work is relevant.

## Implementation approach

1. **Content-first iteration (recommended):** refine existing copy, add concise project summaries and a reusable case-study context block. Lowest visual risk and strongest improvement to professional credibility.
2. **Interaction-first iteration:** focus on semantic project links, mobile behavior, focus states, cursor restraint, and motion fallbacks. Strong usability gain, but less content clarity on its own.
3. **Structural redesign:** reorganize the page hierarchy and case-study templates. Rejected for this iteration because it risks losing the current identity and stable behavior.

## Approved scope

- Make the hero offer explicit in Norwegian and English.
- Shorten the transition into selected work and add contextual project descriptions.
- Use semantic links for project rows while preserving hover previews.
- Add compact case-study metadata for starting point, goal, role, key choices, delivery, and next evaluation.
- Strengthen About practice, capabilities, availability, and tool context using only existing content.
- Add contact expectation-setting and copy-to-clipboard behavior with inline confirmation.
- Reduce cursor dominance, keep touch/reduced-motion fallbacks, and guard animation targets.
- Preserve localization, aurora/KP behavior, editorial pacing, and the current visual language.

## Verification

Run lint, typecheck/build-equivalent commands available in the repository and inspect responsive/accessibility-sensitive code paths. Note any remaining real-content dependencies such as CV, metrics, or client outcomes.
