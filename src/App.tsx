import { About } from "@/components/sections/About";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Education } from "@/components/sections/Education";
import { Experience } from "@/components/sections/Experience";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/sections/Navbar";
import { Projects } from "@/components/sections/Projects";
import { QuickDock } from "@/components/sections/QuickDock";
import { Skills } from "@/components/sections/Skills";
import { LightboxProvider } from "@/components/ui/LightboxProvider";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useHashScroll } from "@/hooks/useHashScroll";
import { SECTION_IDS } from "@/lib/nav";

function App() {
  const activeId = useActiveSection(SECTION_IDS);
  useHashScroll();

  return (
    <LightboxProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-control focus:bg-btn focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-btn"
      >
        Skip to main content
      </a>
      <Navbar activeId={activeId} />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Education />
        <Projects />
        <Experience />
        <Skills />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <QuickDock activeId={activeId} />
    </LightboxProvider>
  );
}

export default App;
