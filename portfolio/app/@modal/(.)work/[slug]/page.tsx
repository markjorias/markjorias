import { notFound } from "next/navigation";
import CaseStudyModal from "@/components/CaseStudyModal";
import { featuredStudyParams, getFeaturedStudy } from "@/lib/works";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return featuredStudyParams();
}

export default async function CaseStudyModalPage({ params }: Props) {
  const study = await getFeaturedStudy((await params).slug);
  if (!study) notFound();
  return <CaseStudyModal study={study} />;
}
