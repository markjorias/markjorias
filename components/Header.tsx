import Link from "next/link";
import type { SiteConfig } from "@/lib/types";
import ContactActions from "./ContactActions";
import styles from "./Header.module.css";

type Props = { site: SiteConfig; hasResume: boolean };

export default function Header({ site, hasResume }: Props) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.name} href="/#intro">
          {site.name}
        </Link>
        <nav aria-label="Sections" className={styles.nav}>
          <Link href="/#experience">Experience</Link>
          <Link href="/#work">Work</Link>
          <Link href="/#contact">Contact</Link>
        </nav>
        <ContactActions email={site.email} hasResume={hasResume} compact />
      </div>
    </header>
  );
}
