import type { Works as WorksData } from "@/lib/types";
import FeaturedCard from "./FeaturedCard";
import ProjectCard from "./ProjectCard";
import styles from "./Works.module.css";

type Props = { works: WorksData; githubUrl: string };

function GitHubNote({ message, githubUrl }: { message: string; githubUrl: string }) {
  return (
    <div className={styles.note}>
      <p>{message}</p>
      <a href={githubUrl} rel="noopener">
        See my projects on GitHub
      </a>
    </div>
  );
}

export default function Works({ works, githubUrl }: Props) {
  return (
    <div className="container">
      <div className={styles.heading}>
        <h2>Work</h2>
        {works.status === "ok" && (works.projects.length > 0 || works.featured.length > 0) && (
          <a href={githubUrl} rel="noopener">GitHub profile</a>
        )}
      </div>
      {works.status === "ok" && works.isDemo && (
        <p className={styles.demoNote}>Demo preview. The projects and case study below are sample content.</p>
      )}
      {works.status === "unavailable" ? (
        <GitHubNote message="Projects couldn't be loaded right now." githubUrl={githubUrl} />
      ) : works.featured.length === 0 && works.projects.length === 0 ? (
        <GitHubNote message="Projects are on the way." githubUrl={githubUrl} />
      ) : (
        <>
          {works.featured.length > 0 && (
            <div className={styles.featured}>
              {works.featured.map((study) => (
                <FeaturedCard key={study.slug} study={study} />
              ))}
            </div>
          )}
          {works.projects.length > 0 && (
            <div className={styles.grid}>
              {works.projects.map((project) => (
                <ProjectCard key={project.fullName} project={project} isDemo={works.isDemo} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
