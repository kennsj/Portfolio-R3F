# Local SEO Corrections

## Goal

Make the Norwegian homepage the authoritative result for local design and web-development searches in Bodø while giving crawlers one consistent set of locale URLs.

## Approved Approach

- Keep the existing homepage as the primary local-service page instead of creating a thin keyword landing page.
- Use `/` for Norwegian and `/en` for English everywhere: canonicals, hreflang, internal localization, and the sitemap.
- Remove country-based redirects so crawlers and users always receive the URL they requested.
- Remove nonexistent, redirecting, opted-out, and non-indexable URLs from the sitemap.
- Strengthen the Norwegian homepage title, description, and visible introductory copy around designer, webutvikler, webdesign, and Bodø without keyword stuffing.
- Keep the English page internationally positioned and reciprocally linked through hreflang.
- Align Person/WebSite structured data with visible professional positioning and remove non-professional wording from `jobTitle`.
- Preserve the portfolio's visual hierarchy, routes, motion, and bilingual experience.

## Verification

- Validate the sitemap XML and ensure every listed route exists in the route tree.
- Build the production application.
- Inspect generated metadata logic, canonicals, hreflang, and JSON-LD source.
- Report Search Console submission and reindexing as required post-deployment steps.
