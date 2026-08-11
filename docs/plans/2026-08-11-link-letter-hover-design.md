# Link letter hover animation

Apply one delegated hover animation to every anchor in the portfolio. Only
visible text nodes are temporarily split into words and characters, preserving
the existing nested layout, metadata, and icons.

On pointer hover or keyboard focus, characters blur and fade out in a randomized
order, then blur and fade back in using a separately randomized order. The cycle
is intentionally short and cleans up its temporary wrappers on completion.
Repeated hovers interrupt and restart cleanly. Touch pointers and users who
prefer reduced motion retain the original static text.
