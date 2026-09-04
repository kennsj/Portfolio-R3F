import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useI18n } from "../../../hooks/useI18n";
import styles from "./Expertise.module.scss";
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation";
import ExpertiseItem from "./expertise-item";

gsap.registerPlugin(ScrollTrigger);

const Expertise = () => {
  const { locale, t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (
        !section ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 74%", once: true },
      });
      const leadCopy = section.querySelectorAll(
        `.${styles.lead} > span, .${styles.lead} > p`,
      );

      timeline
        .from(leadCopy, {
          autoAlpha: 0,
          y: 28,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
        })
        .from(
          section.querySelectorAll(`.${styles.discipline}`),
          {
            autoAlpha: 0,
            y: 28,
            duration: 0.65,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=.2",
        );

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      id="expertise"
      aria-label={t.expertiseEyebrow}
      data-aurora-state
      data-aurora-presence="0.88"
      data-aurora-color="#7ba7d6"
    >
      <div className={styles.lead}>
        <span className={styles.eyebrow}>02 - {locale === "nb" ? "Ekspertise" : "Expertise"}</span>
        <HeadingAnimation level={2}>
          {t.expertiseTitleLineOne}
          <br />
          {t.expertiseTitleLineTwo}
        </HeadingAnimation>
      </div>

      <ol
        className={`${styles.disciplines} ${
          activeIndex !== null ? styles["has-active"] : ""
        }`.trim()}
        onMouseLeave={() => setActiveIndex(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setActiveIndex(null);
          }
        }}
      >
        {t.expertiseModes.map((mode, index) => (
          <ExpertiseItem
            key={mode.title}
            index={index}
            title={mode.title}
            description={mode.description}
            isActive={activeIndex === index}
            isDimmed={activeIndex !== null && activeIndex !== index}
            onActivate={setActiveIndex}
          />
        ))}
      </ol>
    </section>
  );
};

export default Expertise;
