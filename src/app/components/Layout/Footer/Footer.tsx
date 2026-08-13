import type { MouseEvent } from "react";
import { usePageTransition } from "@/app/hooks/usePageTransition";
import { useI18n } from "@/app/hooks/useI18n";
import ArrowIcon from "../../UI/ArrowIcon/ArrowIcon";
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation";
import AnimatedLink from "../../UI/AnimatedLink/AnimatedLink";
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
            <AnimatedLink href="/" onClick={goTo("/")}>
              {t.footerHome}
            </AnimatedLink>
            <AnimatedLink href="/#work" onClick={goTo("/#work")}>
              {t.footerWork}
            </AnimatedLink>
            <AnimatedLink href="/about" onClick={goTo("/about")}>
              {t.footerAbout}
            </AnimatedLink>
            <AnimatedLink href="/#contact" onClick={goTo("/#contact")}>
              {t.footerContact}
            </AnimatedLink>
          </nav>

          <AnimatedLink
            className={styles.email}
            href="mailto:hei@kennethjorgensen.no"
          >
            hei@kennethjorgensen.no <ArrowIcon />
          </AnimatedLink>

          <div className={styles.meta}>
            <div>
              <span>{locale === "nb" ? "Sted" : "Location"}</span>
              <p>Bodø / 67°17′N</p>
            </div>
            <div>
              <span>{locale === "nb" ? "Sosialt" : "Social"}</span>
              <AnimatedLink
                href="https://www.linkedin.com/in/kennethstrandjorgensen/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </AnimatedLink>
              <AnimatedLink
                href="https://github.com/kennsj"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </AnimatedLink>
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
          <AnimatedLink className={styles.top} href="#top">
            {t.footerBackToTop} <ArrowIcon direction="up" />
          </AnimatedLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
