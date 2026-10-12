import { useEffect, useMemo, useState } from "react";
import { Award, FolderGit2, GraduationCap, House, Mail, User, Users, Wrench } from "lucide-react";
import Dock, { type DockItemData } from "@/components/reactbits/Dock";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ICON = 20;

const ICONS: Record<string, React.ReactNode> = {
  home: <House size={ICON} />,
  about: <User size={ICON} />,
  education: <GraduationCap size={ICON} />,
  projects: <FolderGit2 size={ICON} />,
  experience: <Users size={ICON} />,
  skills: <Wrench size={ICON} />,
  certifications: <Award size={ICON} />,
  contact: <Mail size={ICON} />,
};

const DOCK_SECTIONS: { id: string; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Leadership" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

/**
 * A second way around the page for pointer and keyboard visitors on tablets and larger: the React Bits
 * Dock, floating at the bottom edge. It stays out of the way while the hero is on screen (the navbar
 * covers that stretch) and rises once the visitor has scrolled past it. Phones get the navbar menu only.
 */
export function QuickDock({ activeId }: { activeId: string }) {
  const wide = useMediaQuery("(min-width: 48rem)", false);
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return undefined;
    const observer = new IntersectionObserver(([entry]) => setHeroInView(entry.intersectionRatio > 0.35), {
      threshold: [0, 0.35, 0.36, 1],
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const items: DockItemData[] = useMemo(
    () =>
      DOCK_SECTIONS.map((section) => ({
        icon: ICONS[section.id],
        label: section.label,
        href: `#${section.id}`,
        active: activeId === section.id,
      })),
    [activeId],
  );

  if (!wide) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <Dock items={items} hidden={heroInView} className="pointer-events-auto" />
    </div>
  );
}
