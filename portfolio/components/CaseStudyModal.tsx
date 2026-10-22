"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { CaseStudy } from "@/lib/types";
import CaseStudyView from "./CaseStudyView";
import styles from "./CaseStudyModal.module.css";

type Props = { study: CaseStudy };

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CaseStudyModal({ study }: Props) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `study-title-${study.slug}`;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        router.back();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      // Keep Tab inside the dialog.
      const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
      // Return focus to the card that opened the study.
      const card = document.querySelector<HTMLElement>(`a[href="/work/${study.slug}"]`);
      (opener?.isConnected ? opener : card)?.focus();
    };
  }, [router, study.slug]);

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && router.back()}>
      <motion.div
        ref={dialogRef}
        layoutId={`study-${study.slug}`}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button ref={closeRef} type="button" className={styles.close} onClick={() => router.back()}>
          Close
        </button>
        <CaseStudyView study={study} titleId={titleId} />
      </motion.div>
    </div>
  );
}
