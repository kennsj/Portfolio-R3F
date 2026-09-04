import type { AppLocale } from "../../../hooks/useI18n";

export type ProjectSummary = {
  name: string;
  work: Record<AppLocale, string>;
  description: Record<AppLocale, string>;
  video: string;
  width: number;
  height: number;
  slug: string;
  color: string;
  comingSoon?: boolean;
};

const projects = [
  {
    name: "Manshausen",
    work: { nb: "Design / Frontend", en: "Design / Front-end" },
    description: {
      nb: "Digitalt konsept og frontend for et arkitektonisk øyretreat.",
      en: "Digital concept and front-end for an architectural island retreat.",
    },
    video: "/images/work/manshausen-preview.png",
    width: 1448,
    height: 1086,
    slug: "manshausen",
    color: "#78c69a",
  },
  {
    name: "Tørrfesken",
    work: { nb: "Visuell retning / Kode", en: "Visual direction / Code" },
    description: {
      nb: "Visuell retning og digital opplevelse utviklet fra konsept til kode.",
      en: "Visual direction and a digital experience developed from concept to code.",
    },
    video: "/images/work/tørrfesken-preview.png",
    width: 1536,
    height: 1024,
    slug: "torrfesken",
    color: "#e2cf9d",
    comingSoon: true,
  },
  {
    name: "Verchia",
    work: { nb: "Frontendutvikling", en: "Front-end development" },
    description: {
      nb: "Frontendimplementasjon med fokus på typografi, rytme og responsivitet.",
      en: "Front-end implementation focused on type, rhythm, and responsiveness.",
    },
    video: "/images/work/verchia-preview.png",
    width: 1448,
    height: 1086,
    slug: "verchia",
    color: "#b6a6ee",
  },
] satisfies readonly ProjectSummary[];

export const orderedProjectData: readonly ProjectSummary[] = [
  projects[1],
  projects[0],
  projects[2],
];
