"use client";

import { useEffect, useState } from "react";
import styles from "./ContactActions.module.css";

type Props = { email: string; hasResume: boolean; compact?: boolean };

export default function ContactActions({ email, hasResume, compact = false }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the mailto link still works.
    }
  }

  return (
    <div className={compact ? `${styles.actions} ${styles.compact}` : styles.actions}>
      <a className={`${styles.button} ${styles.primary}`} href={`mailto:${email}`}>
        Email me
      </a>
      {!compact && (
        <button type="button" className={styles.button} onClick={copyEmail}>
          <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
        </button>
      )}
      {hasResume && (
        <a className={styles.button} href="/resume.pdf" download>
          Download resume
        </a>
      )}
    </div>
  );
}
