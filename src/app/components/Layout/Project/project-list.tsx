import type { FocusEvent } from "react";
import type { AppLocale } from "../../../hooks/useI18n";
import AnimatedLink from "../../UI/AnimatedLink/AnimatedLink";
import HeadingAnimation from "../../UI/HeadingAnimation/HeadingAnimation";
import type { ProjectSummary } from "./project-data";
import styles from "./Projects.module.scss";

type ProjectListProps = {
  projects: readonly ProjectSummary[];
  locale: AppLocale;
  activeIndex: number | null;
  onConceal: () => void;
  onReveal: (index: number, clientX?: number, clientY?: number) => void;
  onSelect: (index: number, project: ProjectSummary) => void;
  setMobilePreviewRef: (
    index: number,
    node: HTMLImageElement | null,
  ) => void;
};

const ProjectList = ({
  projects,
  locale,
  activeIndex,
  onConceal,
  onReveal,
  onSelect,
  setMobilePreviewRef,
}: ProjectListProps) => {
  const handleBlur = (event: FocusEvent<HTMLOListElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) onConceal();
  };

  return (
    <ol
      className={`${styles.index} ${
        activeIndex !== null ? styles["has-active"] : ""
      }`.trim()}
      data-project-list
      onPointerLeave={onConceal}
      onBlur={handleBlur}
    >
      {projects.map((project, index) => {
        const itemClassName = `${styles["project-item"]} ${
          activeIndex === index ? styles.projectItemActive : ""
        }`.trim();
        const actionLabel = project.comingSoon
          ? locale === "nb"
            ? "Kommer snart"
            : "Coming soon"
          : locale === "nb"
            ? "Se prosjekt"
            : "View project";

        return (
          <li key={project.slug} className={itemClassName}>
            <AnimatedLink
              animationTarget="h3"
              animateText={false}
              href={`/project/${project.slug}`}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") {
                  onReveal(index, event.clientX, event.clientY);
                }
              }}
              onFocus={() => onReveal(index)}
              onClick={(event) => {
                event.preventDefault();
                onSelect(index, project);
              }}
              data-cursor="explore"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <HeadingAnimation level={3} className={styles["project-title"]}>
                {project.name}
              </HeadingAnimation>

              <div className={styles["mobile-preview"]} aria-hidden="true">
                <img
                  ref={(node) => setMobilePreviewRef(index, node)}
                  src={project.video}
                  alt=""
                  width={project.width}
                  height={project.height}
                  loading="lazy"
                />
              </div>

              <div className={styles.details}>
                <i>
                  {locale === "nb" ? "Rolle" : "Role"} / {project.work[locale]}
                </i>
                <p>{project.description[locale]}</p>
                <span>
                  {actionLabel}
                  <i aria-hidden="true" />
                </span>
              </div>
            </AnimatedLink>

            {index < projects.length - 1 && (
              <span className={styles["project-rule"]} aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default ProjectList;
