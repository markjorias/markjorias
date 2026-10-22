import type { SiteConfig } from "@/lib/types";
import IntroLines from "./IntroLines";
import PhotoFrame from "./PhotoFrame";
import styles from "./Intro.module.css";

type Props = { site: SiteConfig; hasPhoto: boolean; hasResume: boolean };

export default function Intro({ site, hasPhoto, hasResume }: Props) {
  return (
    <div className="container">
      <div className={styles.sheet}>
        <IntroLines />
        <div className={`${styles.text} ${styles.fade}`}>
          <h1 className={styles.name}>{site.name}</h1>
          <p className={styles.role}>{site.role}</p>
          <p className={styles.lede}>{site.intro}</p>
          <div className={styles.actions}>
            <a className={styles.workLink} href="#work">
              View work
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 4v16m-6-6 6 6 6-6" />
              </svg>
            </a>
            <a className={styles.emailLink} href={`mailto:${site.email}`}>Email me</a>
            {hasResume && <a className={styles.emailLink} href="/resume.pdf" download>Download resume</a>}
          </div>
        </div>
        <div className={`${styles.photo} ${styles.fade}`}>
          <PhotoFrame hasPhoto={hasPhoto} alt={site.name} />
        </div>
        <dl className={styles.skills} aria-label="Skills and tools">
          <div>
            <dt>Code</dt>
            <dd><ul>{site.stack.code.map((tool) => <li key={tool}>{tool}</li>)}</ul></dd>
          </div>
          <div>
            <dt>Design</dt>
            <dd><ul>{site.stack.design.map((tool) => <li key={tool}>{tool}</li>)}</ul></dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
