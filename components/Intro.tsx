import type { SiteConfig } from "@/lib/types";
import ContactActions from "./ContactActions";
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
          <p className={styles.stack}>
            Code: {site.stack.code.join(", ")}. Design: {site.stack.design.join(", ")}.
          </p>
          <ContactActions email={site.email} hasResume={hasResume} />
        </div>
        <div className={`${styles.photo} ${styles.fade}`}>
          <PhotoFrame hasPhoto={hasPhoto} alt={site.name} />
        </div>
      </div>
    </div>
  );
}
