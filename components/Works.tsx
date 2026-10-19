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
      <h2>Work</h2>
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
                <ProjectCard key={project.fullName} project={project} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
