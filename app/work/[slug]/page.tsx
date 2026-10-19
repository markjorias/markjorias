import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CaseStudyView from "@/components/CaseStudyView";
import { featuredStudyParams, getFeaturedStudy } from "@/lib/works";
import styles from "./page.module.css";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return featuredStudyParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = await getFeaturedStudy((await params).slug);
  if (!study) return {};
  return { title: `${study.title} · Joseph Orias`, description: study.summary };
}

export default async function CaseStudyPage({ params }: Props) {
  const study = await getFeaturedStudy((await params).slug);
  if (!study) notFound();
  return (
    <main className={`container ${styles.page}`}>
      <Link className={styles.back} href="/#work">
        Back to all work
      </Link>
      <CaseStudyView study={study} />
    </main>
  );
}
