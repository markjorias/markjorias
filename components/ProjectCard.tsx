import type { Project } from "@/lib/types";
import styles from "./ProjectCard.module.css";

type Props = { project: Project };

export default function ProjectCard({ project }: Props) {
  return (
    <article className={styles.card}>
      <svg className={styles.outline} aria-hidden="true" focusable="false">
        <rect x="0" y="0" width="100%" height="100%" pathLength={1} />
      </svg>
      <h3 className={styles.name}>{project.name}</h3>
      {project.description && <p className={styles.description}>{project.description}</p>}
      {(project.language || project.topics.length > 0) && (
        <p className={styles.meta}>
          {project.language && <span className={styles.language}>{project.language}</span>}
          {project.topics.map((topic) => (
            <span key={topic} className={styles.topic}>
              {topic}
            </span>
          ))}
        </p>
      )}
      <p className={styles.links}>
        <a href={project.repoUrl} rel="noopener">
          Code
        </a>
        {project.demoUrl && (
          <a href={project.demoUrl} rel="noopener">
            Live demo
          </a>
        )}
      </p>
    </article>
  );
}
