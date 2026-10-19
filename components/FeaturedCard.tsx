"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { CaseStudy } from "@/lib/types";
import styles from "./FeaturedCard.module.css";

type Props = { study: CaseStudy };

export default function FeaturedCard({ study }: Props) {
  return (
    <motion.article layoutId={`study-${study.slug}`} className={styles.card}>
      <div className={styles.text}>
        <h3 className={styles.title}>{study.title}</h3>
        <p className={styles.summary}>{study.summary}</p>
        <Link className={styles.read} href={`/work/${study.slug}`} scroll={false}>
          Read case study
        </Link>
      </div>
      {study.cover && (
        <div className={styles.cover}>
          {/* eslint-disable-next-line @next/next/no-img-element -- cover size is unknown, it's Joseph's own file */}
          <img src={study.cover} alt="" />
        </div>
      )}
    </motion.article>
  );
}
