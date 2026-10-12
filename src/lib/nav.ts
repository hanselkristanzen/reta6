/** The sections the navigation points at, in page order. One list feeds the navbar, the dock and the active-section tracker. */
export const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Leadership" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Credentials" },
] as const;

/** Every section the page tracks, including the hero and the closing contact band. */
export const SECTION_IDS: string[] = ["home", ...NAV_ITEMS.map((item) => item.id), "contact"];
