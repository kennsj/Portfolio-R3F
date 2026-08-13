import { useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../../../hooks/useI18n";
import { usePageTransition } from "../../../hooks/usePageTransition";
import styles from "./ProjectCase.module.scss";
import ArrowIcon from "../../UI/ArrowIcon/ArrowIcon";
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation";
import AnimatedLink from "../../UI/AnimatedLink/AnimatedLink";

gsap.registerPlugin(ScrollTrigger);

type Copy = { en: string; nb: string };
type Project = {
  slug: string;
  title: string;
  role: Copy;
  type: Copy;
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
    role: { en: "Design / Front-end", nb: "Design / Frontend" },
    type: {
      en: "Travel / Independent concept",
      nb: "Reiseliv / Eget konseptprosjekt",
    },
    status: { en: "Independent concept project", nb: "Eget konseptprosjekt" },
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
    role: {
      en: "Visual direction / Design / Front-end",
      nb: "Visuell retning / Design / Frontend",
    },
    type: {
      en: "Fashion / Digital experience",
      nb: "Mote / Digital opplevelse",
    },
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
    role: { en: "Front-end development", nb: "Frontendutvikling" },
    type: { en: "Services / Website", nb: "Tjenester / Nettside" },
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
    role: { en: "UX / UI", nb: "UX / UI" },
    type: { en: "Product design / Concept", nb: "Produktdesign / Konsept" },
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
    { label: "Start", en: project.brief.en, nb: project.brief.nb },
    { label: "Goal", en: project.intro.en, nb: project.intro.nb },
    { label: "Role", en: project.contribution.en, nb: project.contribution.nb },
    { label: "Choices", en: project.approach.en, nb: project.approach.nb },
    {
      label: "Delivery",
      en: `A responsive ${project.title} experience combining the documented design and interaction work.`,
      nb: `En responsiv ${project.title}-opplevelse som samler det dokumenterte design- og interaksjonsarbeidet.`,
    },
    {
      label: "Next",
      en: "Test the concept with users and stakeholders against the intended experience.",
      nb: "Teste konseptet med brukere og interessenter mot den tiltenkte opplevelsen.",
    },
  ];

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.utils.toArray<HTMLElement>("[data-case-reveal]").forEach((element) => {
      gsap.from(element, {
        y: 80,
        autoAlpha: 0,
        immediateRender: false,
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
          <span>{copy(project.type)}</span>
          <span>Bodø / 67°17′N</span>
        </div>
        <HeadingAnimation level={1} immediate>
          {project.title}
        </HeadingAnimation>
        <p>{copy(project.intro)}</p>
      </header>

      <figure className={styles.heroMedia} data-case-reveal>
        <video
          aria-hidden="true"
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
            <dd>{copy(project.role)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{copy(project.status)}</dd>
          </div>
          <div>
            <dt>{locale === "nb" ? "Fokus" : "Focus"}</dt>
            <dd>
              {locale === "nb" ? "Design × utvikling" : "Design × development"}
            </dd>
          </div>
        </dl>
        <div>
          <span className={styles.label}>
            {locale === "nb" ? "Oppgaven" : "The brief"}
          </span>
          <p>{copy(project.brief)}</p>
          {project.live && (
            <AnimatedLink
              className={styles.textLink}
              href={project.live}
              target="_blank"
              rel="noreferrer"
            >
              {locale === "nb" ? "Se nettsiden" : "Visit live site"}
              <ArrowIcon />
            </AnimatedLink>
          )}
        </div>
      </section>

      <section
        className={styles.context}
        data-case-reveal
        aria-label={locale === "nb" ? "Prosjektkontekst" : "Project context"}
      >
        {context.map((item) => (
          <div key={item.label}>
            <span className={styles.label}>
              {locale === "nb"
                ? ({
                    Start: "Utgangspunkt",
                    Goal: "Mål",
                    Role: "Min rolle",
                    Choices: "Viktigste valg",
                    Delivery: "Leveranse",
                    Next: "Hva jeg ville testet videre",
                  }[item.label] ?? item.label)
                : item.label}
            </span>
            <p>{copy(item)}</p>
          </div>
        ))}
      </section>

      <section className={styles.manifesto} data-case-reveal>
        <span className={styles.label}>
          {locale === "nb" ? "Retning" : "Direction"}
        </span>
        <HeadingAnimation level={2}>{copy(project.approach)}</HeadingAnimation>
      </section>

      <div className={styles.mediaPair} data-case-reveal>
        <figure>
          <video
            aria-hidden="true"
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
            <video aria-hidden="true" autoPlay loop muted playsInline>
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

      <AnimatedLink
        className={styles.next}
        href={`/project/${project.next.slug}`}
        onClick={(event) => go(event, `/project/${project.next.slug}`)}
      >
        <span>{locale === "nb" ? "Neste prosjekt" : "Next project"}</span>
        <strong>{project.next.title}</strong>
        <ArrowIcon size="display" />
      </AnimatedLink>
    </article>
  );
}
