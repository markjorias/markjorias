import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Intro from "@/components/Intro";
import Works from "@/components/Works";
import { loadExperience } from "@/lib/experience";
import { publicFileExists } from "@/lib/public-file";
import { loadSite } from "@/lib/site";
import { getWorks } from "@/lib/works";

export const revalidate = 3600;

export default async function Home() {
  const [site, experience, works] = await Promise.all([loadSite(), loadExperience(), getWorks()]);
  const hasResume = publicFileExists("resume.pdf");
  return (
    <main id="main-content" tabIndex={-1}>
      <section id="intro">
        <Intro site={site} hasPhoto={publicFileExists("photo.jpg")} hasResume={hasResume} />
      </section>
      <section id="experience">
        <Experience entries={experience} />
      </section>
      <section id="work">
        <Works works={works} githubUrl={site.links.github} />
      </section>
      <section id="contact">
        <Contact site={site} hasResume={hasResume} />
      </section>
    </main>
  );
}
