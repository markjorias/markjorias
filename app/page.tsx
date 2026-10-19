import Contact from "@/components/Contact";
import Intro from "@/components/Intro";
import { publicFileExists } from "@/lib/public-file";
import { loadSite } from "@/lib/site";

export default async function Home() {
  const site = await loadSite();
  const hasResume = publicFileExists("resume.pdf");
  return (
    <main>
      <section id="intro">
        <Intro site={site} hasPhoto={publicFileExists("photo.jpg")} hasResume={hasResume} />
      </section>
      <section id="experience" />
      <section id="work" />
      <section id="contact">
        <Contact site={site} hasResume={hasResume} />
      </section>
    </main>
  );
}
