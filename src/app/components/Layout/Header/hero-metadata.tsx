import type { AppLocale } from "../../../hooks/useI18n";
import styles from "./Header.module.scss";

type HeroMetadataProps = {
  locale: AppLocale;
  localTime: string;
  kp: number;
  kpLabel: string;
  kpDescription: string;
  languageSwitchLabel: string;
  metadataRef: React.RefObject<HTMLDivElement>;
  onToggleLocale: () => void;
};

const HeroMetadata = ({
  locale,
  localTime,
  kp,
  kpLabel,
  kpDescription,
  languageSwitchLabel,
  metadataRef,
  onToggleLocale,
}: HeroMetadataProps) => {
  const location =
    locale === "nb"
      ? "Bodø, Norge — 67° N 14° E"
      : "Bodø, Norway — 67° N 14° E";
  const kpIndexLabel = locale === "nb" ? "KP-indeks" : "KP index";
  const nextLocaleLabel = locale === "nb" ? "English" : "Norsk";
  const languageClassName = `${styles["language-switch"]} ${
    locale === "en" ? styles["language-switch-en"] : ""
  }`;

  return (
    <div ref={metadataRef} className={styles["metadata-rail"]}>
      <span className={styles["metadata-line"]} aria-hidden="true" />

      <div className={styles["metadata-item"]} data-metadata-item>
        {location}
      </div>

      <div
        className={`${styles["metadata-item"]} ${styles["clock"]}`}
        data-metadata-item
        aria-live="off"
      >
        <i className={styles["clock-dot"]} aria-hidden="true" />
        <time>{localTime}</time>
      </div>

      <div
        className={`${styles["metadata-item"]} ${styles["kp-metric"]}`}
        data-metadata-item
      >
        <button
          type="button"
          className={styles["kp-trigger"]}
          aria-describedby="hero-kp-explainer"
        >
          {kpIndexLabel}: {kp.toFixed(1)}
          <i aria-hidden="true" />
        </button>
        <span
          id="hero-kp-explainer"
          role="tooltip"
          className={styles["kp-tooltip"]}
        >
          <strong>{kpLabel}</strong>
          {kpDescription}
        </span>
      </div>

      <div
        className={`${styles["metadata-item"]} ${styles["language"]}`}
        data-metadata-item
      >
        <button
          type="button"
          className={languageClassName}
          onClick={onToggleLocale}
          aria-label={`${languageSwitchLabel}: ${nextLocaleLabel}`}
        >
          <span className={locale === "nb" ? styles["active-locale"] : ""}>
            NO
          </span>
          <i aria-hidden="true" />
          <span className={locale === "en" ? styles["active-locale"] : ""}>
            EN
          </span>
        </button>
      </div>
    </div>
  );
};

export default HeroMetadata;
