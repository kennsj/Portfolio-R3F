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
  title: string;
  role: Copy;
  type: Copy;
  intro: Copy;
  brief: Copy;
  media: { src: string; width: number; height: number };
  color: string;
  live?: string;
  next: { title: string; slug: string };
};

const projects: Record<string, Project> = {
  manshausen: {
    title: "Manshausen",
    role: { en: "Design / Front-end", nb: "Design / Frontend" },
    type: {
      en: "Travel / Independent concept",
      nb: "Reiseliv / Eget konseptprosjekt",
    },
    color: "#78c69a",
    intro: {
      en: "A digital redesign for an island retreat at the edge of the Norwegian Sea.",
      nb: "Et digitalt redesign for et øyretreat ytterst i Norskehavet.",
    },
    brief: {
      en: "The concept explores how a remote place can feel immediate online without losing its quiet, elemental character. Navigation, pace and imagery are treated as one continuous arrival.",
      nb: "Konseptet utforsker hvordan et avsides sted kan føles nært på nett uten å miste sin stille, elementære karakter. Navigasjon, tempo og bilder behandles som én sammenhengende ankomst.",
    },
    media: {
      src: "/images/work/manshausen-preview.png",
      width: 1448,
      height: 1086,
    },
    next: { title: "Verchia", slug: "verchia" },
  },
  verchia: {
    title: "Verchia",
    role: {
      en: "Visual direction / Design / Front-end",
      nb: "Visuell retning / Design / Frontend",
    },
    type: {
      en: "Fashion / Digital experience",
      nb: "Mote / Digital opplevelse",
    },
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
    media: {
      src: "/images/work/verchia-preview.png",
      width: 1448,
      height: 1086,
    },
    next: { title: "Tørrfesken", slug: "torrfesken" },
  },
  pradelna: {
    title: "Tørrfesken",
    role: { en: "Front-end development", nb: "Frontendutvikling" },
    type: { en: "Services / Website", nb: "Tjenester / Nettside" },
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
    media: {
      src: "/images/work/tørrfesken-preview.png",
      width: 1536,
      height: 1024,
    },
    next: { title: "Verchia", slug: "verchia" },
  },
  "dialog-exe": {
    title: "Dialog eXe",
    role: { en: "UX / UI", nb: "UX / UI" },
    type: { en: "Product design / Concept", nb: "Produktdesign / Konsept" },
    color: "#8bb8dc",
    intro: {
      en: "A UX and interface concept for making complex dialogue flows easier to understand and use.",
      nb: "Et UX- og grensesnittkonsept som gjør komplekse dialogflyter enklere å forstå og bruke.",
    },
    brief: {
      en: "Dialogue systems can quickly become dense and difficult to navigate. The concept focuses on making structure, context and the next available action visible at the right moment.",
      nb: "Dialogsystemer kan raskt bli tette og vanskelige å navigere. Konseptet fokuserer på å gjøre struktur, kontekst og neste mulige handling synlig i riktig øyeblikk.",
    },
    media: {
      src: "/images/work/verchia-preview.png",
      width: 1448,
      height: 1086,
    },
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
          <img
            src={project.media.src}
            alt={`${project.title} project preview`}
            width={project.media.width}
            height={project.media.height}
            fetchPriority="high"
          />
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
          <p>{locale === "nb" ? "Mer kommer" : "More to come"}</p>
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
