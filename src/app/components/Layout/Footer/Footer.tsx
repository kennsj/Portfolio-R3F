import type { MouseEvent } from "react";
import { usePageTransition } from "@/app/hooks/usePageTransition";
import { useI18n } from "@/app/hooks/useI18n";
import ArrowIcon from "../../UI/ArrowIcon/ArrowIcon";
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation";
import styles from "./Footer.module.scss";

const Footer = () => {
  const { transitionTo } = usePageTransition();
  const { locale, setLocale, t } = useI18n();

  const goTo = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    transitionTo(href);
  };

  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.intro}>
          <div className={styles.availability}>
            <i aria-hidden="true" />
            <span>{t.footerAvailability}</span>
          </div>
          <HeadingAnimation level={2}>
            {locale === "nb"
              ? "La oss lage noe som varer."
              : "Let’s build something that lasts."}
          </HeadingAnimation>
        </div>

        <div className={styles.details}>
          <nav aria-label={t.footerNavigationLabel}>
            <a href="/" onClick={goTo("/")}>
              {t.footerHome}
            </a>
            <a href="/#work" onClick={goTo("/#work")}>
              {t.footerWork}
            </a>
            <a href="/about" onClick={goTo("/about")}>
              {t.footerAbout}
            </a>
            <a href="/#contact" onClick={goTo("/#contact")}>
              {t.footerContact}
            </a>
          </nav>

          <a className={styles.email} href="mailto:hei@kennethjorgensen.no">
            hei@kennethjorgensen.no <ArrowIcon />
          </a>

          <div className={styles.meta}>
            <div>
              <span>{locale === "nb" ? "Sted" : "Location"}</span>
              <p>Bodø / 67°17′N</p>
            </div>
            <div>
              <span>{locale === "nb" ? "Sosialt" : "Social"}</span>
              <a
                href="https://www.linkedin.com/in/kennethstrandjorgensen/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/kennsj"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className={styles.utility}>
          <p>© {new Date().getFullYear()} Kenneth Jørgensen</p>
          <div
            className={styles.languages}
            role="group"
            aria-label={t.languageSwitchLabel}
          >
            <button
              type="button"
              className={locale === "nb" ? styles.active : ""}
              onClick={() => setLocale("nb")}
              lang="nb"
              aria-pressed={locale === "nb"}
            >
              NO
            </button>
            <span>/</span>
            <button
              type="button"
              className={locale === "en" ? styles.active : ""}
              onClick={() => setLocale("en")}
              lang="en"
              aria-pressed={locale === "en"}
            >
              EN
            </button>
          </div>
          <a className={styles.top} href="#top">
            {t.footerBackToTop} <ArrowIcon direction="up" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
