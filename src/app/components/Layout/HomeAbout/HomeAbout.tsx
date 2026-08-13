import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../../../hooks/useI18n";
import { usePageTransition } from "../../../hooks/usePageTransition";
import AnimatedLink from "../../UI/AnimatedLink/AnimatedLink";
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
  const { transitionTo } = usePageTransition();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const supportingRef = useRef<HTMLDivElement>(null);
  const content = copy[locale];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const content = contentRef.current;
      const statement = statementRef.current;
      const supporting = supportingRef.current;
      if (!section || !content || !statement || !supporting) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const compactLayout = window.matchMedia("(max-width: 760px)").matches;

      if (reducedMotion || compactLayout) {
        gsap.set([statement, supporting], {
          autoAlpha: 1,
          clearProps: "clipPath,filter,transform",
        });
        return;
      }

      let split: SplitText | null = null;

      try {
        split = SplitText.create(statement, { type: "words,chars" });
        const characters = split.chars;

        gsap.set(characters, { autoAlpha: 0, filter: "blur(14px)" });
        gsap.set(supporting, {
          autoAlpha: 0,
          clipPath: "inset(100% 0 0)",
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            pin: content,
            pinSpacing: false,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(characters, {
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.004,
          ease: "power2.out",
        });
        timeline.to(supporting, {
          autoAlpha: 1,
          clipPath: "inset(0% 0 0)",
          duration: 0.8,
          ease: "power3.out",
        });
      } catch {
        gsap.set([statement, supporting], {
          autoAlpha: 1,
          clearProps: "clipPath,filter",
        });
      }

      return () => split?.revert();
    },
    { scope: sectionRef, dependencies: [locale] },
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
      <div ref={contentRef} className={styles["home-about-inner"]}>
        <h2 ref={statementRef} className={styles["statement"]}>
          {content.statement}
        </h2>

        <div ref={supportingRef} className={styles["supporting"]}>
          <p>{content.supporting}</p>
          <AnimatedLink
            href="/about"
            className={styles["about-link"]}
            onClick={(event) => {
              event.preventDefault();
              transitionTo("/about");
            }}
          >
            {content.link} <i aria-hidden="true" />
          </AnimatedLink>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
