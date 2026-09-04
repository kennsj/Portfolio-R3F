import type { AppLocale } from "../../../hooks/useI18n";
import styles from "./Header.module.scss";

type HeroContentProps = {
  locale: AppLocale;
  headingRef: React.RefObject<HTMLHeadingElement>;
};

const HeroContent = ({ locale, headingRef }: HeroContentProps) => (
  <div className={styles["hero-main"]}>
    <div className={styles["name-lockup"]}>
      <p id="hero-role" className={styles["role"]} data-hero-support>
        {locale === "nb" ? (
          <>
            Designer &amp; webutvikler
            <br /> i Bodø
          </>
        ) : (
          <>
            Designer &amp; front-end developer
            <br /> based in Bodø, Norway
          </>
        )}
      </p>

      <h1 ref={headingRef} aria-describedby="hero-role">
        <span className={styles["first-name"]}>Kenneth</span>
        <span className={styles["last-name"]} data-text="Jørgensen">
          Jørgensen
        </span>
      </h1>
    </div>
  </div>
);

export default HeroContent;
