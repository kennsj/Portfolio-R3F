import styles from "./SupportUkraine.module.scss";

const SupportUkraine = () => (
  <a
    className={styles.flag}
    href="https://u24.gov.ua/"
    target="_blank"
    rel="noreferrer"
    aria-label="Support Ukraine"
  >
    <span className={styles.blue} />
    <span className={styles.yellow} />
  </a>
);

export default SupportUkraine;
