import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../../../hooks/useI18n";
import styles from "./home-about.module.css";

gsap.registerPlugin(SplitText, ScrollTrigger);

const copy = {
  en: {
    statement:
      "Digital designer and creative frontend developer, shaping expressive digital experiences from early ideas and UX to visual direction and production-ready code.",
    supporting:
      "I work with businesses and creative teams that need the idea to hold up all the way to launch — from early direction and interface design to refined, production-ready front-end.",
    link: "More about me",
  },
  nb: {
    statement:
      "Digital designer og kreativ frontendutvikler som former uttrykksfulle digitale opplevelser fra tidlige ideer og UX til visuell retning og produksjonsklar kode.",
    supporting:
      "Jeg jobber med virksomheter og kreative team som trenger at idéen holder hele veien til lansering — fra tidlig retning og grensesnittdesign til raffinert, produksjonsklar frontend.",
    link: "Mer om meg",
  },
} as const;

const HomeAbout = () => {
  const { locale } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const supportingRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDListElement>(null);
  const content =
    locale === "nb"
      ? {
          ...copy[locale],
          supporting:
            "Jeg har bakgrunn fra grafisk design, interaksjonsdesign og frontendutvikling. Tidligere har jeg designet og utviklet nettsider for kinoer og kulturhus rundt om i Norge. Nå jobber jeg med egne prosjekter og er åpen for både frilansoppdrag og en fast stilling.",
        }
      : copy[locale];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      const statement = statementRef.current;
      const supporting = supportingRef.current;
      const metadata = metadataRef.current;
      if (!section || !content || !statement || !supporting || !metadata) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const compactLayout = window.matchMedia("(max-width: 760px)").matches;

      if (reducedMotion) {
        gsap.set([statement, supporting, metadata], {
          autoAlpha: 1,
          clearProps: "clipPath,filter,transform",
        });
        return;
      }

      let split: SplitText | null = null;
      let timeline: gsap.core.Timeline | null = null;
      let refreshFrame: number | null = null;

      try {
        split = SplitText.create(statement, { type: "words,chars" });
        const characters = split.chars;

        gsap.set(characters, { autoAlpha: 0, filter: "blur(14px)" });
        gsap.set([supporting, metadata], {
          autoAlpha: 0,
          clipPath: "inset(0 0 100% 0)",
        });

        const hero = document.querySelector<HTMLElement>("#home-hero");
        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: hero ?? section,
            start: hero ? "70% top" : "top top",
            end: hero
              ? () => `+=${window.innerHeight * (compactLayout ? 1.4 : 1)}`
              : "bottom top",
            pin: content,
            pinSpacing: false,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(characters, {
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 2.2,
          stagger: 0.008,
          ease: "power2.out",
        });
        timeline.to([supporting, metadata], {
          autoAlpha: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.8,
          ease: "power3.out",
        });

        refreshFrame = window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          timeline?.scrollTrigger?.update();
        });
      } catch {
        gsap.set([statement, supporting, metadata], {
          autoAlpha: 1,
          clearProps: "clipPath,filter",
        });
      }

      return () => {
        timeline?.scrollTrigger?.kill(true);
        timeline?.kill();
        split?.revert();
        gsap.set(content, {
          clearProps: "position,top,left,right,bottom,width,height,transform",
        });
        if (refreshFrame !== null) window.cancelAnimationFrame(refreshFrame);
      };
    },
    {
      scope: sectionRef,
      dependencies: [locale],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={sectionRef}
      className={styles["home-about"]}
      id="about"
      data-aurora-state
      data-aurora-presence="0.72"
      data-aurora-color="#86cfa3"
    >
      <div ref={contentRef} className={styles["home-about-pin"]}>
        <div className={styles["home-about-inner"]}>
          <h2
            key={`statement-${locale}`}
            ref={statementRef}
            className={styles["statement"]}
          >
            {content.statement}
          </h2>

          <div
            key={`supporting-${locale}`}
            ref={supportingRef}
            className={styles["supporting"]}
          >
            <p>{content.supporting}</p>
          </div>
          <dl
            key={`metadata-${locale}`}
            ref={metadataRef}
            className={styles["metadata"]}
          >
            <div>
              <dt>{locale === "nb" ? "Bakgrunn" : "Background"}</dt>
              <dd>{locale === "nb" ? "Grafisk +\ninteraksjonsdesign" : "Graphic +\nInteraction design"}</dd>
            </div>
            <div>
              <dt>{locale === "nb" ? "Erfaring" : "Experience"}</dt>
              <dd>Dialog EXE</dd>
            </div>
            <div>
              <dt>{locale === "nb" ? "Praksis" : "Internship"}</dt>
              <dd>Unfold AS<br />Trigger Oslo</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
