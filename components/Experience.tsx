import type { ExperienceEntry } from "@/lib/types";
import styles from "./Experience.module.css";

type Props = { entries: ExperienceEntry[] };

export default function Experience({ entries }: Props) {
  return (
    <div className={`container ${styles.layout}`}>
      <h2 className={styles.heading}>Experience</h2>
      <ol className={styles.timeline}>
        {entries.map((entry) => (
          <li key={`${entry.title}-${entry.org}`} className={styles.entry}>
            <h3 className={styles.title}>{entry.title}</h3>
            <p className={styles.org}>
              {entry.orgUrl ? (
                <a href={entry.orgUrl} rel="noopener">
                  {entry.org}
                </a>
              ) : (
                entry.org
              )}
            </p>
            {entry.period && <p className={styles.period}>{entry.period}</p>}
            {entry.summary && <p className={styles.summary}>{entry.summary}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
