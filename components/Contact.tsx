import type { SiteConfig } from "@/lib/types";
import ContactActions from "./ContactActions";
import styles from "./Contact.module.css";

type Props = { site: SiteConfig; hasResume: boolean };

export default function Contact({ site, hasResume }: Props) {
  return (
    <div className="container">
      <div className={styles.contact}>
        <div className={styles.intro}>
          <h2>Contact</h2>
          <p className={styles.lede}>
            I&apos;m looking for software engineering internships. Email is the fastest way to reach me.
          </p>
        </div>
        <a className={styles.email} href={`mailto:${site.email}`}>{site.email}</a>
        <ContactActions email={site.email} hasResume={hasResume} />
        <ul className={styles.links}>
          <li><a href={site.links.linkedin} rel="noopener">LinkedIn</a></li>
          <li><a href={site.links.github} rel="noopener">GitHub</a></li>
        </ul>
      </div>
      <div className={styles.footer}>
        <span>{site.name}</span>
        <a href="#intro">Back to top</a>
      </div>
    </div>
  );
}
