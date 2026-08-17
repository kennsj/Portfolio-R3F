import { useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useI18n } from "../../../hooks/useI18n";
import { usePageTransition } from "../../../hooks/usePageTransition";
import { deterministicCharacterOrder } from "../../../hooks/use-character-reveal";
import styles from "./ProjectCase.module.scss";
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation";
import AnimatedLink from "../../UI/AnimatedLink/AnimatedLink";

gsap.registerPlugin(ScrollTrigger, SplitText);

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
    video: "/images/work/manshausen-preview.png",
    poster: "/images/work/manshausen-preview.png",
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
    video: "/images/work/verchia-preview.png",
    poster: "/images/verchia.webp",
    next: { title: "Tørrfesken", slug: "torrfesken" },
  },
  pradelna: {
    slug: "torrfesken",
    title: "Tørrfesken",
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
    video: "/images/work/tørrfesken-preview.png",
    poster: "/images/work/tørrfesken-preview.png",
    next: { title: "Verchia", slug: "verchia" },
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
    video: "/images/work/verchia-preview.png",
    poster: "/images/dx-kino.webp",
    next: { title: "Manshausen", slug: "manshausen" },
  },
};

export default function ProjectCase({ slug }: { slug: keyof typeof projects }) {
  const project = projects[slug];
  const { locale } = useI18n();
  const { transitionTo } = usePageTransition();
  const heroHeadingRef = useRef<HTMLDivElement>(null);
  const continuityArrival = useRef(
    document.documentElement.dataset.projectContinuityArrival === "true",
  ).current;
  const copy = (value: Copy) => value[locale];
  const details = [
    {
      label: locale === "nb" ? "Situasjon" : "Situation",
      value: project.brief,
    },
    { label: locale === "nb" ? "Mål" : "Objective", value: project.intro },
    {
      label: locale === "nb" ? "Min rolle" : "My role",
      value: project.contribution,
    },
    {
      label: locale === "nb" ? "Leveranse" : "Deliverables",
      value: {
        en: `${project.role.en}. Responsive interface and interaction work documented in this case study.`,
        nb: `${project.role.nb}. Responsivt grensesnitt og interaksjonsarbeid dokumentert i denne casen.`,
      },
    },
  ];

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    delete document.documentElement.dataset.projectContinuityArrival;

    if (!continuityArrival || !heroHeadingRef.current) return;

    const heading = heroHeadingRef.current.querySelector("h1");
    const role = heroHeadingRef.current.querySelector<HTMLElement>(
      `.${styles["hero-type"]}`,
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) return;

    gsap.set([heading, role], { autoAlpha: 0 });

    let headingSplit: SplitText | null = null;
    let revealTimeline: gsap.core.Timeline | null = null;

    const revealHeading = () => {
      void document.fonts.ready.then(() => {
        if (!heading?.isConnected) return;

        try {
          headingSplit = SplitText.create(heading, {
            type: "words,chars",
          });
          const characters = headingSplit.chars;
          const characterOrder = deterministicCharacterOrder(characters.length);
          const characterRank = new Map(
            characterOrder.map((characterIndex, rank) => [
              characterIndex,
              rank,
            ]),
          );

          gsap.set(heading, { autoAlpha: 1, filter: "none" });
          gsap.set(characters, {
            autoAlpha: 0,
            filter: "blur(32px)",
          });

          revealTimeline = gsap
            .timeline()
            .fromTo(
              characters,
              { autoAlpha: 0, filter: "blur(32px)" },
              {
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: 1.05,
                stagger: (characterIndex) =>
                  (characterRank.get(characterIndex) ?? characterIndex) * 0.028,
                ease: "power2.out",
              },
            )
            .fromTo(
              role,
              { autoAlpha: 0, filter: "blur(10px)" },
              {
                autoAlpha: 1,
                filter: "blur(0px)",
                duration: 0.7,
                ease: "power2.out",
              },
              0.55,
            );
        } catch {
          gsap.set([heading, role], { autoAlpha: 1, filter: "none" });
        }
      });
    };

    window.addEventListener("page-transition-enter", revealHeading, {
      once: true,
    });

    return () => {
      window.removeEventListener("page-transition-enter", revealHeading);
      revealTimeline?.kill();
      headingSplit?.revert();
    };
  }, [continuityArrival]);
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.utils.toArray<HTMLElement>("[data-case-reveal]").forEach((element) => {
      gsap.fromTo(
        element,
        { clipPath: "inset(0 0 100% 0)", y: 24 },
        {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          duration: 0.9,
          ease: "shiftReveal",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        },
      );
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
        {/* <div className={styles.heroMeta}>
          <span>
            {copy(project.type)} / {copy(project.status)}
          </span>
          <span>Bodø / 67N, 14E</span>
        </div> */}
        <div ref={heroHeadingRef} className={styles["hero-heading-row"]}>
          <HeadingAnimation
            level={1}
            immediate={!continuityArrival}
            enabled={!continuityArrival}
          >
            {project.title}
          </HeadingAnimation>
          <p className={styles["hero-type"]}>{copy(project.role)}</p>
        </div>
        <div
          className={styles["hero-transition-media"]}
          data-project-hero-media
        >
          {project.video.endsWith(".png") ? (
            <img src={project.video} alt={`${project.title} project preview`} />
          ) : (
            <video
              src={project.video}
              poster={project.poster}
              muted
              loop
              autoPlay
              playsInline
            />
          )}
        </div>
        <p className={styles["hero-intro"]}>{copy(project.intro)}</p>
      </header>

      <section className={styles.overview} data-case-reveal>
        <dl>
          <div>
            <dt>{locale === "nb" ? "Rolle" : "Role"}</dt>
            <dd>{copy(project.role)}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{copy(project.type)}</dd>
          </div>
        </dl>
        <div>
          <span className={styles.label}>
            {locale === "nb" ? "Kort fortalt" : "In brief"}
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
              <i aria-hidden="true" />
            </AnimatedLink>
          )}
        </div>
      </section>

      <section
        className={styles.context}
        data-case-reveal
        aria-label={locale === "nb" ? "Prosjektkontekst" : "Project context"}
      >
        {details.map((item) => (
          <div key={item.label}>
            <span className={styles.label}>{item.label}</span>
            <p>{copy(item.value)}</p>
          </div>
        ))}
      </section>

      <section className={styles.manifesto} data-case-reveal>
        <span className={styles.label}>
          {locale === "nb" ? "Definerende valg" : "Defining decision"}
        </span>
        <HeadingAnimation level={2}>{copy(project.approach)}</HeadingAnimation>
      </section>

      <div className={styles.mediaPair} data-case-reveal>
        <figure>
          <img
            src={`/images/placeholders/${project.slug}-detail.svg`}
            alt={`${project.title} interface placeholder`}
          />
          <figcaption>
            {locale === "nb" ? "System / Hierarki" : "System / Hierarchy"}
          </figcaption>
        </figure>
        <figure>
          <img
            src={`/images/placeholders/${project.slug}-detail.svg`}
            alt={`${project.title} interaction placeholder`}
          />
          <figcaption>
            {locale === "nb" ? "Interaksjon / Rytme" : "Interaction / Rhythm"}
          </figcaption>
        </figure>
      </div>

      <section className={styles.contribution} data-case-reveal>
        <span className={styles.label}>
          {locale === "nb" ? "Mitt bidrag" : "My contribution"}
        </span>
        <div>
          <HeadingAnimation level={2}>
            {copy(project.contribution)}
          </HeadingAnimation>
          <p>
            {locale === "nb"
              ? "Arbeidet som vises her beskriver mitt faktiske ansvarsområde, uten å tilskrive prosjektet udokumenterte resultater."
              : "The work shown here reflects my actual scope, without attributing undocumented outcomes to the project."}
          </p>
        </div>
      </section>

      <AnimatedLink
        className={styles.next}
        href={`/project/${project.next.slug}`}
        onClick={(event) => go(event, `/project/${project.next.slug}`)}
      >
        <span>{locale === "nb" ? "Neste prosjekt" : "Next project"}</span>
        <strong>{project.next.title}</strong>
        <i aria-hidden="true" />
      </AnimatedLink>
    </article>
  );
}
