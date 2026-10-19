import Markdown, { type Components } from "react-markdown";
import type { CaseStudy } from "@/lib/types";
import styles from "./CaseStudyView.module.css";

type Props = { study: CaseStudy; titleId?: string };

const markdownComponents: Components = {
  // Spans, not figures: Markdown puts images inside paragraphs.
  img: ({ src, alt }) => (
    <span className={styles.frame}>
      {/* eslint-disable-next-line @next/next/no-img-element -- Markdown images have unknown sizes */}
      <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" />
    </span>
  ),
};

export default function CaseStudyView({ study, titleId }: Props) {
  return (
    <article className={styles.study}>
      <header className={styles.head}>
        <h1 id={titleId} className={styles.title}>
          {study.title}
        </h1>
        <p className={styles.summary}>{study.summary}</p>
        <p className={styles.meta}>
          <span>{study.role}</span>
          <a href={`https://github.com/${study.repo}`} rel="noopener">
            Code
          </a>
          {study.demoUrl && (
            <a href={study.demoUrl} rel="noopener">
              Live demo
            </a>
          )}
        </p>
      </header>
      {study.cover && (
        <span className={styles.frame}>
          {/* eslint-disable-next-line @next/next/no-img-element -- cover size is unknown, it's Joseph's own file */}
          <img src={study.cover} alt="" />
        </span>
      )}
      <div className={styles.body}>
        <Markdown components={markdownComponents}>{study.body}</Markdown>
      </div>
    </article>
  );
}
