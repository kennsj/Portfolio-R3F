import type { AppLocale, ProjectSlug, Translations } from "../hooks/useI18n"
import { localizePath } from "./locale-path"

type JsonLdThing = Record<string, unknown>

const PERSON_ID_SUFFIX = "/#person"
const WEBSITE_ID_SUFFIX = "/#website"

function projectNameFromSeoTitle(title: string): string {
	const first = title.split(/\s*[—–]\s*/)[0]?.trim()
	return first || title
}

function breadcrumbItems(
	origin: string,
	locale: AppLocale,
	pathname: string,
	canonicalUrl: string,
	t: Translations,
): { position: number; name: string; item: string }[] | null {
	const path = pathname.replace(/\/$/, "") || "/"
	const home = `${origin}${localizePath("/", locale)}`

	if (path === "/") return null

	if (path === "/project") {
		return [
			{ position: 1, name: t.footerHome, item: home },
			{ position: 2, name: t.footerWork, item: `${origin}${localizePath("/project", locale)}` },
		]
	}

	const match = /^\/project\/([^/]+)$/.exec(path)
	if (match) {
		const slug = match[1]
		const entry = t.projectSeoBySlug[slug as ProjectSlug]
		const label = entry ? projectNameFromSeoTitle(entry.title) : slug
		return [
			{ position: 1, name: t.footerHome, item: home },
			{ position: 2, name: t.footerWork, item: `${origin}${localizePath("/project", locale)}` },
			{ position: 3, name: label, item: canonicalUrl },
		]
	}

	return null
}

export function buildSeoJsonLd(params: {
	origin: string
	pathname: string
	locale: AppLocale
	canonicalUrl: string
	ogImageUrl: string
	pageTitle: string
	pageDescription: string
	t: Translations
}): JsonLdThing {
	const {
		origin,
		pathname,
		locale,
		canonicalUrl,
		ogImageUrl,
		pageTitle,
		pageDescription,
		t,
	} = params

	const personId = `${origin}${PERSON_ID_SUFFIX}`
	const websiteId = `${origin}${WEBSITE_ID_SUFFIX}`
	const webpageId = `${canonicalUrl}#webpage`
	const inLanguage = locale === "nb" ? "nb-NO" : "en"

	const person: JsonLdThing = {
		"@type": "Person",
		"@id": personId,
		name: "Kenneth Jørgensen",
		url: origin,
		image: `${origin}/images/kenneth-aurora.jpg`,
		jobTitle: t.headerTagline,
		description: t.seoDescription,
		email: "hei@kennethjorgensen.no",
		address: {
			"@type": "PostalAddress",
			addressLocality: "Bodø",
			addressRegion: "Nordland",
			addressCountry: "NO",
		},
		sameAs: [
			"https://www.linkedin.com/in/kennethstrandjorgensen/",
			"https://github.com/kennsj",
		],
	}

	const website: JsonLdThing = {
		"@type": "WebSite",
		"@id": websiteId,
		url: origin,
		name: t.seoSiteName,
		description: t.seoDescription,
		inLanguage: locale === "nb" ? ["nb-NO", "en"] : ["en", "nb-NO"],
		publisher: { "@id": personId },
	}

	const path = pathname.replace(/\/$/, "") || "/"
	const projectMatch = /^\/project\/([^/]+)$/.exec(path)
	const projectSlug = projectMatch?.[1]
	const projectEntry = projectSlug
		? t.projectSeoBySlug[projectSlug as ProjectSlug]
		: undefined

	const graph: JsonLdThing[] = [person, website]

	const crumbs = breadcrumbItems(origin, locale, pathname, canonicalUrl, t)
	if (crumbs?.length) {
		graph.push({
			"@type": "BreadcrumbList",
			"@id": `${canonicalUrl}#breadcrumb`,
			itemListElement: crumbs.map((c) => ({
				"@type": "ListItem",
				position: c.position,
				name: c.name,
				item: c.item,
			})),
		})
	}

	if (projectEntry) {
		const projectId = `${canonicalUrl}#creativework`
		graph.push({
			"@type": "CreativeWork",
			"@id": projectId,
			name: projectNameFromSeoTitle(projectEntry.title),
			headline: projectEntry.title,
			description: projectEntry.description,
			url: canonicalUrl,
			inLanguage,
			image: ogImageUrl,
			author: { "@id": personId },
			creator: { "@id": personId },
		})

		graph.push({
			"@type": "WebPage",
			"@id": webpageId,
			url: canonicalUrl,
			name: pageTitle,
			description: pageDescription,
			inLanguage,
			isPartOf: { "@id": websiteId },
			about: { "@id": personId },
			primaryImageOfPage: { "@type": "ImageObject", url: ogImageUrl },
			breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
			mainEntity: { "@id": projectId },
		})
	} else {
		graph.push({
			"@type": "WebPage",
			"@id": webpageId,
			url: canonicalUrl,
			name: pageTitle,
			description: pageDescription,
			inLanguage,
			isPartOf: { "@id": websiteId },
			about: { "@id": personId },
			primaryImageOfPage: { "@type": "ImageObject", url: ogImageUrl },
			...(crumbs?.length
				? { breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` } }
				: {}),
		})
	}

	return {
		"@context": "https://schema.org",
		"@graph": graph,
	}
}
