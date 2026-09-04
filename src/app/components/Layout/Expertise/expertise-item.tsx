import styles from "./Expertise.module.scss";

type ExpertiseItemProps = {
  index: number;
  title: string;
  description: string;
  isActive: boolean;
  isDimmed: boolean;
  onActivate: (index: number) => void;
};

const ExpertiseItem = ({
  index,
  title,
  description,
  isActive,
  isDimmed,
  onActivate,
}: ExpertiseItemProps) => {
  const itemClassName = `${styles.discipline} ${
    isActive ? styles["active-row"] : ""
  }`.trim();

  return (
    <li className={itemClassName} style={{ opacity: isDimmed ? 0.25 : 1 }}>
      <button
        type="button"
        className={isActive ? styles.active : ""}
        onMouseEnter={() => onActivate(index)}
        onFocus={() => onActivate(index)}
        onClick={() => onActivate(index)}
      >
        <span>{String(index + 1).padStart(2, "0")}</span>
        <strong>{title}</strong>
        <div className={styles.details}>
          <span>{description}</span>
        </div>
      </button>
    </li>
  );
};

export default ExpertiseItem;
