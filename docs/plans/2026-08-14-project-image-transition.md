# Project image continuity transition

## Approved direction

Desktop pointer navigation from the homepage project index will use the active
hover preview as a continuity object. The preview locks on click, sheds its
cursor-follow tilt, and expands into a fixed 16:10 project-hero frame while the
existing HTML fade, aurora acceleration, and light surge continue underneath.

The route changes beneath the fixed media layer. Once the destination project
hero is mounted, the transition media dissolves to reveal the real project
media. The navigation remains visible throughout.

The destination header keeps its title and project type inside the site's
maximum-width grid. Its media sits below as a centered `90vw` breakout, using a
16:10 desktop crop. Continuity navigation resets ScrollSmoother immediately;
the expanded media is the only incoming motion.

## Scope and fallbacks

- Run only for a primary pointer click while the matching hover preview is open.
- Keyboard, touch, reduced-motion, or missing-media navigation uses the existing
  page transition unchanged.
- Reuse the selected project's current video and poster; do not capture the
  canvas or add a dependency.
- Keep the overlay outside the smooth-scroll content so route unmounting cannot
  remove it mid-transition.
- Prevent duplicate clicks and clean up the overlay on completion or failure.

## Motion

1. Lock the active preview and remove tilt over roughly 180ms.
2. Expand from its measured viewport rectangle into the project hero frame over
   roughly 1.2s with the site's existing reveal easing.
3. Start the existing page transition shortly after expansion begins so the
   aurora surge remains visible around the image.
4. Hold through the route swap, then fade the overlay over roughly 350ms once
   the destination frame exists.
