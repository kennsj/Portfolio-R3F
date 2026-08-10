import styles from "./ArrowIcon.module.scss";

type ArrowIconProps = {
  direction?: "up-right" | "up" | "down";
  size?: "inline" | "display";
};

const arrowPath = "M3 21 21 3M10 3h11v11";

export default function ArrowIcon({
  direction = "up-right",
  size = "inline",
}: ArrowIconProps) {
  return (
    <span
      className={`${styles.arrow} ${direction === "up" ? styles.up : ""} ${direction === "down" ? styles.down : ""} ${size === "display" ? styles.display : ""}`}
      aria-hidden="true"
    >
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={arrowPath} />
      </svg>
      <svg
        className={`${styles.icon} ${styles.reentry}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={arrowPath} />
      </svg>
    </span>
  );
}
