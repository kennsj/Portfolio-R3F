import type { RefObject } from "react";
import type { ProjectSummary } from "./project-data";
import styles from "./Projects.module.scss";

type ProjectPreviewProps = {
  projects: readonly ProjectSummary[];
  previewRef: RefObject<HTMLDivElement>;
  positionRef: RefObject<HTMLDivElement>;
  revealRef: RefObject<HTMLDivElement>;
  mediaRef: RefObject<HTMLDivElement>;
  setImageRef: (index: number, node: HTMLImageElement | null) => void;
};

const ProjectPreview = ({
  projects,
  previewRef,
  positionRef,
  revealRef,
  mediaRef,
  setImageRef,
}: ProjectPreviewProps) => (
  <div ref={previewRef} className={styles.hoverPreview} aria-hidden="true">
    <div ref={positionRef} className={styles.previewPosition}>
      <div ref={revealRef} className={styles.previewReveal}>
        <div ref={mediaRef} className={styles.previewMedia}>
          {projects.map((project, index) => (
            <img
              key={project.video}
              ref={(node) => setImageRef(index, node)}
              src={project.video}
              alt=""
              width={project.width}
              height={project.height}
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProjectPreview;
