import type { Project } from "@/lib/types";
import styles from "./ProjectCard.module.css";

type Props = { project: Project; isDemo?: boolean };

export default function ProjectCard({ project, isDemo = false }: Props) {
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
        {isDemo ? (
          <span className={styles.sample}>Sample project</span>
        ) : (
          <>
            <a href={project.repoUrl} rel="noopener" aria-label={`Code for ${project.name}`}>
              Code
            </a>
            {project.demoUrl && (
              <a href={project.demoUrl} rel="noopener" aria-label={`Live demo of ${project.name}`}>
                Live demo
              </a>
            )}
          </>
        )}
      </p>
    </article>
  );
}
