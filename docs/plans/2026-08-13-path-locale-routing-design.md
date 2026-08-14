# Path-based locale routing

## URL model

- Norwegian is the default locale and uses unprefixed paths such as `/`, `/about`, and `/project/manshausen`.
- English mirrors every public route beneath `/en`, for example `/en`, `/en/about`, and `/en/project/manshausen`.
- Language switching preserves the current logical page and hash while replacing the locale prefix.
- Legacy `?lang=en` and `?lang=nb` URLs are normalized with history replacement.

## Routing boundary

Locale path parsing and construction live in shared helpers. The i18n provider derives locale from the path and language controls navigate to the equivalent localized path. Page transitions receive public localized URLs but resolve the underlying application route before calling TanStack Router.

## SEO

Canonical URLs match the active localized path. English alternates use `/en`; Norwegian and `x-default` use the unprefixed path. JSON-LD identifiers and breadcrumb URLs follow the same model.

## Compatibility

Existing page components and copy dictionaries remain unchanged. The route aliases render the existing pages, preserving animation and page-transition architecture.
