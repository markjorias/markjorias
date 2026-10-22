"use client";

import { useEffect, useState } from "react";
import styles from "./ContactActions.module.css";

type Props = { email: string; hasResume: boolean; compact?: boolean };

export default function ContactActions({ email, hasResume, compact = false }: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (copyState !== "copied") return;
    const timer = setTimeout(() => setCopyState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [copyState]);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <div className={compact ? `${styles.actions} ${styles.compact}` : styles.actions}>
      <a className={`${styles.button} ${styles.primary}`} href={`mailto:${email}`}>
        Email me
      </a>
      {!compact && (
        <button type="button" className={styles.button} onClick={copyEmail}>
          <span aria-live="polite">{copyState === "copied" ? "Copied" : "Copy email"}</span>
        </button>
      )}
      {hasResume && (
        <a className={styles.button} href="/resume.pdf" download>
          Download resume
        </a>
      )}
      {copyState === "failed" && (
        <p className={styles.feedback} role="alert">
          Couldn&apos;t copy. Use Email me or copy this address manually: {" "}
          <span className={styles.address}>{email}</span>
        </p>
      )}
    </div>
  );
}
