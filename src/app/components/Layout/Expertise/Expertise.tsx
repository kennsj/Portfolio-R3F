import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import { useI18n } from "../../../hooks/useI18n";
import styles from "./Expertise.module.scss";
import { usePageTransition } from "../../../hooks/usePageTransition";
import ArrowIcon from "../../UI/ArrowIcon/ArrowIcon";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Expertise = () => {
  const { t } = useI18n();
  const { transitionTo } = usePageTransition();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (
        !section ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const title = section.querySelector<HTMLElement>("[data-field-title]");
      if (!title) return;
      const split = SplitText.create(title, { type: "lines", mask: false });
      gsap.set(split.lines, { overflow: "visible" });
      // Do not mask line wrappers: the Å ring extends above the line box and
      // would otherwise be clipped while the title is split for animation.
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 76%", once: true },
        defaults: { ease: "shiftReveal" },
      });
      timeline
        .from(split.lines, {
          yPercent: 110,
          rotationX: -28,
          duration: 0.8,
          stagger: 0.08,
        })
        .from(
          section.querySelectorAll("[data-field-index]"),
          { y: 24, autoAlpha: 0, duration: 0.55, stagger: 0.07 },
          "-=.4",
        );
      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        split.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-label={`${t.expertiseCapabilitiesLabel} / ${t.expertiseFieldsLabel}`}
      data-aurora-state
      data-aurora-presence="0.92"
      data-aurora-color="#8ed7ad"
    >
      <header className={styles.header}>
        <span className={styles.eyebrow}>02 / {t.expertiseEyebrow}</span>
        <a
          href="/about"
          onClick={(event) => {
            event.preventDefault();
            transitionTo("/about");
          }}
          data-field-about
        >
          {t.expertiseAboutCta}
          <ArrowIcon />
        </a>
      </header>

      <div className={styles.composition}>
        <div className={styles.stage}>
          <h2 data-field-title>
            {t.expertiseTitleLineOne}
            <br />
            <em>{t.expertiseTitleLineTwo}</em>
          </h2>
          <div className={styles.activeWord}>
            {/* <p>{t.expertiseIntro}</p> */}
          </div>
        </div>

        <div className={styles.practiceMap}>
          <div className={styles.groupHead}>
            <span>01—04</span>
            <strong>{t.expertiseCapabilitiesLabel}</strong>
          </div>
          <ol>
            {t.expertiseModes.map((mode, index) => (
              <li key={mode.title} data-field-index>
                <details open={index === 0}>
                  <summary>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{mode.title}</strong>
                    <i aria-hidden="true">+</i>
                  </summary>
                  <div className={styles.modeDescription}>
                    <span>{mode.meta}</span>
                    <p>{mode.description}</p>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Expertise;
