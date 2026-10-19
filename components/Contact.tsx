import type { SiteConfig } from "@/lib/types";
import ContactActions from "./ContactActions";
import styles from "./Contact.module.css";

type Props = { site: SiteConfig; hasResume: boolean };

export default function Contact({ site, hasResume }: Props) {
  return (
    <div className={`container ${styles.contact}`}>
      <h2>Contact</h2>
      <p className={styles.lede}>
        I&apos;m looking for software engineering internships. Email is the fastest way to reach me.
      </p>
      <p className={styles.email}>{site.email}</p>
      <ContactActions email={site.email} hasResume={hasResume} />
      <ul className={styles.links}>
        <li>
          <a href={site.links.linkedin} rel="noopener">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={site.links.github} rel="noopener">
            GitHub
          </a>
        </li>
      </ul>
    </div>
  );
}
