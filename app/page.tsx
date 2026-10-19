import Contact from "@/components/Contact";
import { publicFileExists } from "@/lib/public-file";
import { loadSite } from "@/lib/site";

export default async function Home() {
  const site = await loadSite();
  const hasResume = publicFileExists("resume.pdf");
  return (
    <main>
      <section id="intro" />
      <section id="experience" />
      <section id="work" />
      <section id="contact">
        <Contact site={site} hasResume={hasResume} />
      </section>
    </main>
  );
}
