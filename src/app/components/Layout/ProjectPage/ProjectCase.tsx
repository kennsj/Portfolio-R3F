import { useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../../../hooks/useI18n";
import { usePageTransition } from "../../../hooks/usePageTransition";
import styles from "./ProjectCase.module.scss";
import ArrowIcon from "../../UI/ArrowIcon/ArrowIcon";

gsap.registerPlugin(ScrollTrigger);

type Copy = { en: string; nb: string };
type Project = {
  slug: string;
  title: string;
  role: string;
  type: string;
  status: Copy;
  intro: Copy;
  brief: Copy;
  approach: Copy;
  contribution: Copy;
  context?: { label: string; en: string; nb: string }[];
  video: string;
  poster: string;
  color: string;
  live?: string;
  next: { title: string; slug: string };
};

const projects: Record<string, Project> = {
  manshausen: {
    slug: "manshausen",
    title: "Manshausen",
    role: "Design / Frontend",
    type: "Hospitality / Personal project",
    status: { en: "Independent concept", nb: "Egeninitiert konsept" },
    color: "#78c69a",
    intro: {
      en: "A digital redesign for an island retreat at the edge of the Norwegian Sea.",
      nb: "Et digitalt redesign for et øyretreat ytterst i Norskehavet.",
    },
    brief: {
      en: "The concept explores how a remote place can feel immediate online without losing its quiet, elemental character. Navigation, pace and imagery are treated as one continuous arrival.",
      nb: "Konseptet utforsker hvordan et avsides sted kan føles nært på nett uten å miste sin stille, elementære karakter. Navigasjon, tempo og bilder behandles som én sammenhengende ankomst.",
    },
    approach: {
      en: "Large atmospheric media carries the destination while restrained typography keeps practical information easy to scan. The interface moves slowly and deliberately, echoing the journey to the island.",
      nb: "Store atmosfæriske flater bærer destinasjonen, mens behersket typografi gjør praktisk informasjon lett å skanne. Grensesnittet beveger seg rolig og bevisst, som reisen ut til øya.",
    },
    contribution: {
      en: "Visual direction, interface design, interaction concept and front-end exploration.",
      nb: "Visuell retning, grensesnittdesign, interaksjonskonsept og frontend-utforskning.",
    },
    video: "/videos/manshausen.webm",
    poster: "/images/kenneth-aurora.jpg",
    next: { title: "Verchia", slug: "verchia" },
  },
  verchia: {
    slug: "verchia",
    title: "Verchia",
    role: "Visual direction / Design / Frontend",
    type: "Fashion / Digital experience",
    status: { en: "Live project", nb: "Publisert prosjekt" },
    color: "#b6a6ee",
    live: "https://verchia.vercel.app/",
    intro: {
      en: "A fashion experience where image, rhythm and interface move as one visual system.",
      nb: "En moteopplevelse der bilde, rytme og grensesnitt beveger seg som ett visuelt system.",
    },
    brief: {
      en: "The work needed a digital presence with the same confidence as the collection itself: expressive enough to establish a world, but clear enough to keep exploration effortless.",
      nb: "Arbeidet trengte en digital tilstedeværelse med samme selvsikkerhet som kolleksjonen: uttrykksfull nok til å etablere en verden, men tydelig nok til å gjøre utforskningen enkel.",
    },
    approach: {
      en: "Editorial scale, cinematic transitions and controlled image crops create momentum. A custom React build keeps the experience responsive while preserving the art direction across screen sizes.",
      nb: "Redaksjonell skala, filmatiske overganger og kontrollerte bildeutsnitt skaper fremdrift. En skreddersydd React-løsning bevarer art direction på tvers av skjermstørrelser.",
    },
    contribution: {
      en: "Visual direction, UX and UI design, interaction design and React front-end development.",
      nb: "Visuell retning, UX- og UI-design, interaksjonsdesign og frontend-utvikling i React.",
    },
    video: "/videos/verchia.webm",
    poster: "/images/verchia.webp",
    next: { title: "Pradelna", slug: "pradelna" },
  },
  pradelna: {
    slug: "pradelna",
    title: "Pradelna",
    role: "Frontend development",
    type: "Services / Website",
    status: { en: "Live project", nb: "Publisert prosjekt" },
    color: "#e2cf9d",
    live: "https://www.pradelnakrkonose.cz/",
    intro: {
      en: "A clear, responsive service website translated from design into a precise front-end system.",
      nb: "En tydelig, responsiv tjenestenettside oversatt fra design til et presist frontend-system.",
    },
    brief: {
      en: "The implementation had to make a broad set of services easy to understand and preserve the visual character of the supplied direction at every breakpoint.",
      nb: "Implementasjonen måtte gjøre et bredt tjenestetilbud lett å forstå og bevare den visuelle karakteren i designretningen på alle skjermstørrelser.",
    },
    approach: {
      en: "A disciplined component structure, responsive typography and careful spacing create a calm reading flow. Motion supports orientation without competing with the content.",
      nb: "En disiplinert komponentstruktur, responsiv typografi og presis spacing skaper en rolig leseflyt. Bevegelse støtter orienteringen uten å konkurrere med innholdet.",
    },
    contribution: {
      en: "Responsive front-end development, component implementation and interaction detailing.",
      nb: "Responsiv frontend-utvikling, komponentimplementasjon og detaljering av interaksjon.",
    },
    video: "/videos/pradelna.webm",
    poster: "/images/pradelna.webp",
    next: { title: "Dialog eXe", slug: "dialog-exe" },
  },
  "dialog-exe": {
    slug: "dialog-exe",
    title: "Dialog eXe",
    role: "UX / UI",
    type: "Product design / Concept",
    status: { en: "Product concept", nb: "Produktkonsept" },
    color: "#8bb8dc",
    intro: {
      en: "A UX and interface concept for making complex dialogue flows easier to understand and use.",
      nb: "Et UX- og grensesnittkonsept som gjør komplekse dialogflyter enklere å forstå og bruke.",
    },
    brief: {
      en: "Dialogue systems can quickly become dense and difficult to navigate. The concept focuses on making structure, context and the next available action visible at the right moment.",
      nb: "Dialogsystemer kan raskt bli tette og vanskelige å navigere. Konseptet fokuserer på å gjøre struktur, kontekst og neste mulige handling synlig i riktig øyeblikk.",
    },
    approach: {
      en: "Information is progressively disclosed instead of shown all at once. Clear hierarchy and predictable interaction patterns reduce the effort required to follow and edit a flow.",
      nb: "Informasjon avdekkes gradvis i stedet for å vises samtidig. Tydelig hierarki og forutsigbare interaksjonsmønstre reduserer innsatsen som kreves for å følge og redigere en flyt.",
    },
    contribution: {
      en: "User-flow exploration, information architecture, interaction design and interface concept.",
      nb: "Utforskning av brukerflyt, informasjonsarkitektur, interaksjonsdesign og grensesnittkonsept.",
    },
    video: "/videos/dx.webm",
    poster: "/images/dx-kino.webp",
    next: { title: "Manshausen", slug: "manshausen" },
  },
};

export default function ProjectCase({ slug }: { slug: keyof typeof projects }) {
  const project = projects[slug];
  const { locale } = useI18n();
  const { transitionTo } = usePageTransition();
  const copy = (value: Copy) => value[locale];
	const context = project.context ?? [
		{ label: "Start", en: copy(project.brief), nb: copy(project.brief) },
		{ label: "Goal", en: copy(project.approach), nb: copy(project.approach) },
		{ label: "Role", en: copy(project.contribution), nb: copy(project.contribution) },
		{ label: "Choices", en: copy(project.approach), nb: copy(project.approach) },
		{ label: "Delivery", en: copy(project.contribution), nb: copy(project.contribution) },
		{ label: "Next", en: "Test the concept with users and stakeholders against the intended experience.", nb: "Teste konseptet med brukere og interessenter mot den tiltenkte opplevelsen." },
	];

  useLayoutEffect(() => window.scrollTo(0, 0), []);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.utils.toArray<HTMLElement>("[data-case-reveal]").forEach((element) => {
      gsap.from(element, {
        y: 80,
        autoAlpha: 0,
        duration: 1,
        ease: "shiftReveal",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      });
    });
  });

  const go = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    transitionTo(href);
  };

  return (
    <article
      className={styles.case}
      style={{ "--case-color": project.color } as React.CSSProperties}
    >
      <header className={styles.hero}>
        <div className={styles.heroMeta}>
          <span>{project.type}</span>
          <span>Bodø / 67°17′N</span>
        </div>
        <h1>{project.title}</h1>
        <p>{copy(project.intro)}</p>
        <span className={styles.scroll}>
          {locale === "nb" ? "Scroll for å utforske" : "Scroll to explore"} <ArrowIcon direction="down" />
        </span>
      </header>

      <figure className={styles.heroMedia} data-case-reveal>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={project.slug === "manshausen" ? undefined : project.poster}
        >
          <source src={project.video} type="video/webm" />
        </video>
      </figure>

      <section className={styles.overview} data-case-reveal>
        <dl>
          <div>
            <dt>{locale === "nb" ? "Rolle" : "Role"}</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{copy(project.status)}</dd>
          </div>
          <div>
            <dt>{locale === "nb" ? "Fokus" : "Focus"}</dt>
            <dd>Design × Development</dd>
          </div>
        </dl>
        <div>
          <span className={styles.label}>
            {locale === "nb" ? "Oppgaven" : "The brief"}
          </span>
          <p>{copy(project.brief)}</p>
          {project.live && (
            <a
              className={styles.textLink}
              href={project.live}
              target="_blank"
              rel="noreferrer"
            >
              {locale === "nb" ? "Se nettsiden" : "Visit live site"}
              <ArrowIcon />
            </a>
          )}
        </div>
      </section>

		<section className={styles.context} data-case-reveal aria-label={locale === "nb" ? "Prosjektkontekst" : "Project context"}>
			{context.map((item) => <div key={item.label}><span className={styles.label}>{locale === "nb" ? ({Start: "Utgangspunkt", Goal: "Mål", Role: "Min rolle", Choices: "Viktigste valg", Delivery: "Leveranse", Next: "Hva jeg ville testet videre"}[item.label] ?? item.label) : item.label}</span><p>{copy(item)}</p></div>)}
		</section>

      <section className={styles.manifesto} data-case-reveal>
        <span className={styles.label}>
          {locale === "nb" ? "Retning" : "Direction"}
        </span>
        <h2>{copy(project.approach)}</h2>
      </section>

      <div className={styles.mediaPair} data-case-reveal>
        <figure>
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={project.slug === "manshausen" ? undefined : project.poster}
          >
            <source src={project.video} type="video/webm" />
          </video>
        </figure>
        <figure>
          {project.slug === "manshausen" ? (
            <video autoPlay loop muted playsInline>
              <source src={project.video} type="video/webm" />
            </video>
          ) : (
            <img src={project.poster} alt={`${project.title} visual detail`} />
          )}
        </figure>
      </div>

      <section className={styles.contribution} data-case-reveal>
        <span className={styles.label}>
          {locale === "nb" ? "Bidrag" : "Contribution"}
        </span>
        <p>{copy(project.contribution)}</p>
      </section>

      <a
        className={styles.next}
        href={`/project/${project.next.slug}`}
        onClick={(event) => go(event, `/project/${project.next.slug}`)}
      >
        <span>{locale === "nb" ? "Neste prosjekt" : "Next project"}</span>
        <strong>{project.next.title}</strong>
        <ArrowIcon size="display" />
      </a>
    </article>
  );
}
