import { useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedLink from "./components/UI/AnimatedLink/AnimatedLink";
import HeadingAnimation from "./components/UI/HeadingAnimation/HeadingAnimation";
import { useI18n } from "./hooks/useI18n";
import styles from "./styles/about-page.module.css";

gsap.registerPlugin(ScrollTrigger);

const copy = {
  nb: {
    label: "Om / 01",
    headline:
      "Jeg former digitale opplevelser fra tidlig retning til produksjonsklar frontend.",
    introduction:
      "Jeg er en uavhengig designer og kreativ frontendutvikler i Bodø. Jeg jobber direkte med virksomheter og sammen med kreative team når et prosjekt trenger både en tydelig visuell retning og noen som kan føre den helt ut i kode.",
    principle: "Jeg spør heller én gang til enn å designe feil løsning.",
    practiceLabel: "Praksis / 02",
    practiceTitle: "Design og frontend som ett sammenhengende fag.",
    practice: [
      "Når samme person kan følge idé, hierarki og interaksjon inn i implementasjonen, forsvinner færre gode valg på veien. Det gir kortere avstand mellom det som blir tegnet og det som faktisk møter brukeren.",
      "Jeg kan gå inn tidlig og bidra med retning, struktur og grensesnitt, eller koble meg på et eksisterende team for å utvikle og raffinere frontend. Målet er det samme: et tydelig uttrykk som holder hele veien til lansering.",
    ],
    capabilitiesLabel: "Fagfelt / 03",
    capabilitiesTitle: "Fra retning til ferdig grensesnitt.",
    capabilities: [
      "Visuell retning",
      "UX & UI-design",
      "Interaksjonsdesign",
      "Kreativ frontend",
    ],
    processLabel: "Arbeidsmåte / 04",
    processTitle: "Tydelig nok til å bygge. Fleksibelt nok til å utvikle.",
    process: [
      [
        "Forstå",
        "Avklare kontekst, målgruppe og problemet arbeidet faktisk skal løse.",
      ],
      [
        "Forme",
        "Samle struktur, visuelt språk og interaksjon i en retning teamet kan bruke.",
      ],
      [
        "Bygge og foredle",
        "Oversette retningen til robust frontend og raffinere detaljene i bruk.",
      ],
    ],
    availabilityLabel: "Tilgjengelighet / 05",
    availability:
      "Tilgjengelig for utvalgte kundeprosjekter, studiosamarbeid og den rette faste rollen.",
    cta: "Start en samtale",
    portraitAlt: "Plassholder for portrett av Kenneth Jørgensen",
  },
  en: {
    label: "About / 01",
    headline:
      "I shape digital experiences from early direction to production-ready front-end.",
    introduction:
      "I’m an independent designer and creative front-end developer based in Bodø. I work directly with businesses and alongside creative teams when a project needs both a clear visual direction and someone who can carry it into code.",
    principle:
      "I’d rather ask one more question than design the wrong solution.",
    practiceLabel: "Practice / 02",
    practiceTitle: "Design and front-end as one connected practice.",
    practice: [
      "When one person can follow the idea, hierarchy, and interaction into implementation, fewer good decisions disappear along the way. The distance between what is designed and what users actually meet becomes shorter.",
      "I can join early to shape direction, structure, and interface, or support an existing team by developing and refining the front-end. The aim is the same: a clear expression that holds together through launch.",
    ],
    capabilitiesLabel: "Capabilities / 03",
    capabilitiesTitle: "From direction to finished interface.",
    capabilities: [
      "Visual direction",
      "UX & UI design",
      "Interaction design",
      "Creative front-end",
    ],
    processLabel: "Approach / 04",
    processTitle: "Clear enough to build. Flexible enough to evolve.",
    process: [
      [
        "Understand",
        "Clarify the context, audience, and the problem the work actually needs to solve.",
      ],
      [
        "Shape",
        "Bring structure, visual language, and interaction into a direction the team can use.",
      ],
      [
        "Build and refine",
        "Translate the direction into robust front-end and refine the details in use.",
      ],
    ],
    availabilityLabel: "Availability / 05",
    availability:
      "Available for selected client projects, studio collaborations, and the right permanent role.",
    cta: "Start a conversation",
    portraitAlt: "Placeholder portrait of Kenneth Jørgensen",
  },
} as const;

export default function AboutPage() {
  const { locale } = useI18n();
  const content = copy[locale];

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.utils.toArray<HTMLElement>("[data-about-reveal]").forEach((item) => {
      gsap.fromTo(
        item,
        { clipPath: "inset(0 0 100% 0)", y: 24 },
        {
          clipPath: "inset(0 0 0% 0)",
          y: 0,
          duration: 0.9,
          ease: "shiftReveal",
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        },
      );
    });
  });

  return (
    <article className={styles["about-page"]}>
      <header className={styles["about-hero"]}>
        <div className={styles["section-meta"]}>
          <span>{content.label}</span>
          <span>Bodø / 67°17′N</span>
        </div>
        <HeadingAnimation level={1} immediate>
          {content.headline}
        </HeadingAnimation>
        <p>{content.introduction}</p>
      </header>

      <section className={styles["portrait-section"]} data-about-reveal>
        <figure className={styles["image-placeholder"]}>
          <img
            src="/images/placeholders/about-portrait.svg"
            alt={content.portraitAlt}
          />
        </figure>
        <blockquote>{content.principle}</blockquote>
      </section>

      <section className={styles["practice-section"]} data-about-reveal>
        <div className={styles["section-heading"]}>
          <span>{content.practiceLabel}</span>
          <HeadingAnimation level={2}>{content.practiceTitle}</HeadingAnimation>
        </div>
        <div className={styles["copy-columns"]}>
          {content.practice.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className={styles["capabilities-section"]} data-about-reveal>
        <div className={styles["section-heading"]}>
          <span>{content.capabilitiesLabel}</span>
          <HeadingAnimation level={2}>
            {content.capabilitiesTitle}
          </HeadingAnimation>
        </div>
        <ol>
          {content.capabilities.map((capability, index) => (
            <li key={capability}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <span>{capability}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles["process-section"]} data-about-reveal>
        <div className={styles["section-heading"]}>
          <span>{content.processLabel}</span>
          <HeadingAnimation level={2}>{content.processTitle}</HeadingAnimation>
        </div>
        <ol>
          {content.process.map(([title, description], index) => (
            <li key={title}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles["availability-section"]} data-about-reveal>
        <span>{content.availabilityLabel}</span>
        <p>{content.availability}</p>
        <AnimatedLink href="mailto:hei@kennethjorgensen.no">
          {content.cta}
          <i aria-hidden="true" />
        </AnimatedLink>
      </section>
    </article>
  );
}
