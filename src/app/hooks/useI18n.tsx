import {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { localeFromPathname, localizePath } from "../utils/locale-path";

export type AppLocale = "en" | "nb";

/** Slugs under `/project/:slug` with dedicated SEO copy. */
export type ProjectSlug = "verchia" | "pradelna" | "dialog-exe" | "manshausen";

type ProjectSeoEntry = { title: string; description: string };

function detectLocale(): AppLocale {
  if (typeof window === "undefined") return "nb";
  const urlLang = new URLSearchParams(window.location.search).get("lang");
  if (urlLang === "en") return "en";
  if (urlLang === "nb") return "nb";
  return localeFromPathname(window.location.pathname);
}

export type Translations = {
  languageSwitchLabel: string;
  menuOpen: string;
  menuClose: string;
  expertiseEyebrow: string;
  expertiseTitleLineOne: string;
  expertiseTitleLineTwo: string;
  expertiseModes: Array<{ title: string; description: string; meta: string }>;
  auroraEyebrow: string;
  auroraTitleLineOne: string;
  auroraTitleLineTwo: string;
  auroraExplanation: string;
  auroraCalm: string;
  auroraActive: string;
  footerNavigationLabel: string;
  footerBackToTop: string;
  navAbout: string;
  navContact: string;
  headerTagline: string;
  footerHome: string;
  footerAbout: string;
  footerWork: string;
  footerContact: string;
  errorTitle: string;
  errorPrefix: string;
  auroraLocationCity: string;
  auroraLocationRegion: string;
  auroraKpIndex: string;
  auroraVisibleTonight: string;
  auroraSliderLabel: string;
  auroraReset: string;
  auroraResetAria: string;
  auroraDisclaimer: string;
  seoTitle: string;
  seoDescription: string;
  seoProjectIndexTitle: string;
  seoProjectIndexDescription: string;
  projectSeoBySlug: Record<ProjectSlug, ProjectSeoEntry>;
  seoSiteName: string;
};

const translations: Record<AppLocale, Translations> = {
  en: {
    languageSwitchLabel: "Change language",
    menuOpen: "Menu",
    menuClose: "Close",
    expertiseEyebrow: "Expertise",
    expertiseTitleLineOne: "I design it.",
    expertiseTitleLineTwo: "I build it.",
    expertiseModes: [
      {
        title: "Visual direction",
        description:
          "I find the visual approach that gives each project direction, clarity and personality.",
        meta: "01 / direction",
      },
      {
        title: "UX/UI & Interactions",
        description:
          "I make complex things easier through structure, flow and thoughtful interaction.",
        meta: "02 / interaction",
      },
      {
        title: "Digital products",
        description:
          "I design websites and digital experiences around real content, needs and users.",
        meta: "03 / product",
      },
      {
        title: "Creative frontend",
        description:
          "I take the design all the way into code, with components, animation and details built for production.",
        meta: "04 / development",
      },
    ],
    auroraEyebrow: "Live signal",
    auroraTitleLineOne: "Aurora as",
    auroraTitleLineTwo: "interface",
    auroraExplanation:
      "The live KP index drives the colour, intensity and movement of the aurora across this site. Move the signal to simulate the sky and see the interface respond.",
    auroraCalm: "Quiet sky",
    auroraActive: "Active sky",
    footerNavigationLabel: "Footer navigation",
    footerBackToTop: "Back to top",
    navAbout: "About",
    navContact: "Contact",
    headerTagline: "Designer. Developer. Occasional gamer.",
    footerHome: "Home",
    footerAbout: "About",
    footerWork: "Work",
    footerContact: "Contact",
    errorTitle: "Something went wrong",
    errorPrefix: "Error",
    auroraLocationCity: "Bodø,",
    auroraLocationRegion: "Norway",
    auroraKpIndex: "KP Index",
    auroraVisibleTonight: "- visible from Bodø tonight",
    auroraSliderLabel: "Adjust the Aurora forecast",
    auroraReset: "Reset",
    auroraResetAria: "Reset the Aurora forecast",
    auroraDisclaimer:
      "Disclaimer: The aurora depicted in the background is an artistic interpretation. Colours, speed, and behaviour may not reflect actual conditions above Bodo. The best chances are between September and April, if the clouds cooperate, which is rarely.",
    seoTitle: "Designer & Front-End Developer in Bodø | Kenneth Jørgensen",
    seoDescription:
      "Designer and front-end developer in Bodø helping businesses and creative teams with visual direction, web design, and production-ready front-end development.",
    seoProjectIndexTitle:
      "Selected work — portfolio projects | Kenneth Jørgensen",
    seoProjectIndexDescription:
      "Case studies in web design, UI, and front-end development by Kenneth Jørgensen — designer and developer in Bodø, Nordland, northern Norway.",
    projectSeoBySlug: {
      manshausen: {
        title: "Manshausen — case study | Kenneth Jørgensen",
        description:
          "Design and front-end build for Manshausen: visual direction, interaction, and a React-led implementation.",
      },
      verchia: {
        title: "Verchia — case study | Kenneth Jørgensen",
        description:
          "Design and front-end build for Verchia: visual direction, interaction, and a React-led implementation.",
      },
      pradelna: {
        title: "Pradelna — case study | Kenneth Jørgensen",
        description:
          "Front-end development for Pradelna — structure, performance, and craft.",
      },
      "dialog-exe": {
        title: "Dialog eXe — UX/UI case study | Kenneth Jørgensen",
        description:
          "UX and UI for Dialog eXe: flows, visual language, and interface design.",
      },
    },
    seoSiteName: "Kenneth Jørgensen Portfolio",
  },
  nb: {
    languageSwitchLabel: "Bytt språk",
    menuOpen: "Meny",
    menuClose: "Lukk",
    expertiseEyebrow: "Ekspertise",
    expertiseTitleLineOne: "Jeg designer det.",
    expertiseTitleLineTwo: "Jeg bygger det.",
    expertiseModes: [
      {
        title: "Visuell retning",
        description:
          "Jeg finner det visuelle grepet som gir prosjektet retning, tydelighet og personlighet.",
        meta: "01 / retning",
      },
      {
        title: "UX/UI & Interaksjon",
        description:
          "Jeg gjør komplekse ting enklere gjennom struktur, flyt og gjennomtenkte interaksjoner.",
        meta: "02 / interaksjon",
      },
      {
        title: "Digitale produkter",
        description:
          "Jeg designer nettsider og digitale løsninger rundt ekte innhold, behov og brukere.",
        meta: "03 / produkt",
      },
      {
        title: "Kreativ frontend",
        description:
          "Jeg tar designet helt ut i kode, med komponenter, animasjon og detaljer som holder i produksjon.",
        meta: "04 / utvikling",
      },
    ],
    auroraEyebrow: "Levende signal",
    auroraTitleLineOne: "Nordlyset som",
    auroraTitleLineTwo: "grensesnitt",
    auroraExplanation:
      "Den levende KP-indeksen styrer fargen, intensiteten og bevegelsen i nordlyset på siden. Flytt signalet for å simulere himmelen og se grensesnittet svare.",
    auroraCalm: "Stille himmel",
    auroraActive: "Aktiv himmel",
    footerNavigationLabel: "Bunnavigasjon",
    footerBackToTop: "Til toppen",
    navAbout: "Om",
    navContact: "Kontakt",
    headerTagline: "Designer. Utvikler. Sporadisk gamer.",
    footerHome: "Hjem",
    footerAbout: "Om",
    footerWork: "Prosjekter",
    footerContact: "Kontakt",
    errorTitle: "Noe gikk galt",
    errorPrefix: "Feil",
    auroraLocationCity: "Bodø,",
    auroraLocationRegion: "Norge",
    auroraKpIndex: "KP-indeks",
    auroraVisibleTonight: "- synlig fra Bodø i kveld",
    auroraSliderLabel: "Juster nordlysvarselet",
    auroraReset: "Nullstill",
    auroraResetAria: "Nullstill nordlysvarselet",
    auroraDisclaimer:
      "Forbehold: Nordlyset i bakgrunnen er en kunstnerisk tolkning. Farger, hastighet og bevegelse speiler ikke alltid faktiske forhold over Bodø. De beste sjansene er mellom september og april, hvis skyene samarbeider, noe de sjelden gjør.",
    seoTitle: "Designer og webutvikler i Bodø | Kenneth Jørgensen",
    seoDescription:
      "Designer og webutvikler i Bodø som hjelper bedrifter og kreative team med visuell retning, webdesign og produksjonsklar frontend.",
    seoProjectIndexTitle: "Utvalgte prosjekter — Kenneth Jørgensen",
    seoProjectIndexDescription:
      "Case og arbeid innen webdesign, UI og frontend av Kenneth Jørgensen — designer og utvikler i Bodø, Nordland, Nord-Norge.",
    projectSeoBySlug: {
      manshausen: {
        title: "Manshausen — case | Kenneth Jørgensen",
        description:
          "Design og frontend for Manshausen — visuell retning, interaksjon og et selvinitiert konseptprosjekt.",
      },
      verchia: {
        title: "Verchia — case | Kenneth Jørgensen",
        description:
          "Design og frontend for Verchia — visuell retning, interaksjon og React-basert utførelse.",
      },
      pradelna: {
        title: "Pradelna — case | Kenneth Jørgensen",
        description:
          "Frontendutvikling for Pradelna — struktur, ytelse og finish.",
      },
      "dialog-exe": {
        title: "Dialog eXe — UX/UI-case | Kenneth Jørgensen",
        description:
          "UX og UI for Dialog eXe — flyt, visuelt språk og grensesnitt.",
      },
    },
    seoSiteName: "Kenneth Jørgensen Portfolio",
  },
};

/** Default Open Graph / Twitter image (absolute URL built in RootLayout). */
export const SEO_DEFAULT_OG_IMAGE_PATH = "/og.jpg";

export function getSeoForPath(
  pathname: string,
  t: Translations,
): { title: string; description: string } {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/project") {
    return {
      title: t.seoProjectIndexTitle,
      description: t.seoProjectIndexDescription,
    };
  }
  const match = /^\/project\/([^/]+)$/.exec(path);
  if (match) {
    const slug = match[1] as ProjectSlug;
    const entry = t.projectSeoBySlug[slug];
    if (entry) return { title: entry.title, description: entry.description };
  }
  return { title: t.seoTitle, description: t.seoDescription };
}

type I18nContextValue = {
  locale: AppLocale;
  t: Translations;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
  renderText: (value: string) => ReactNode;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<AppLocale>(detectLocale);
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const queryLocale = new URLSearchParams(window.location.search).get("lang");
    const pathLocale = localeFromPathname(pathname);
    const nextLocale =
      queryLocale === "en" || queryLocale === "nb" ? queryLocale : pathLocale;
    const targetPath = localizePath(pathname, nextLocale);

    setLocale(nextLocale);
    if (queryLocale || targetPath !== pathname) {
      void navigate({
        to: targetPath,
        hash: hash.replace(/^#/, "") || undefined,
        replace: true,
      });
    }
  }, [hash, navigate, pathname]);

  useEffect(() => {
    document.documentElement.lang = locale === "nb" ? "nb-NO" : "en";
    window.localStorage.setItem("portfolio-locale", locale);
  }, [locale]);

  const changeLocale = (nextLocale: AppLocale) => {
    setLocale(nextLocale);
    document.cookie = `portfolio-locale=${nextLocale}; Max-Age=31536000; Path=/; SameSite=Lax`;
    void navigate({
      to: localizePath(pathname, nextLocale),
      hash: hash.replace(/^#/, "") || undefined,
      resetScroll: false,
      hashScrollIntoView: false,
    });
  };

  const value = useMemo(
    () => ({
      locale,
      t: translations[locale],
      setLocale: changeLocale,
      toggleLocale: () => changeLocale(locale === "nb" ? "en" : "nb"),
      renderText: (value: string) => {
        const parts = value.split(/<br\s*\/?>/gi);
        if (parts.length === 1) return value;
        return parts.map((part, index) => (
          <Fragment key={`${part}-${index}`}>
            {part}
            {index < parts.length - 1 ? <br /> : null}
          </Fragment>
        ));
      },
    }),
    [hash, locale, pathname],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return ctx;
}
