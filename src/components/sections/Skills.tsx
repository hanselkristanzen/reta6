import MagicBento, { type BentoCard } from "@/components/reactbits/MagicBento";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/portfolio";
import { useTheme } from "@/lib/theme";

/** Column spans on the 6-column grid (large screens), by group. Two rows of 4 + 2, then 3 + 3. */
const SPAN: Record<string, string> = {
  Cybersecurity: "lg:col-span-4",
  "Programming Languages": "lg:col-span-2",
  "Security Tools": "lg:col-span-4",
  "Web Development": "lg:col-span-2",
  "Development Tools": "lg:col-span-3",
  "Soft Skills": "lg:col-span-3",
};
/** The group that defines the page's positioning gets tinted chips; the rest stay quiet. */
const EMPHASIZED = "Cybersecurity";

/**
 * Skills grouped by their real categories, as a bento grid (React Bits MagicBento): a glow follows a
 * mouse across the grid, the border lights up near the cursor, and stars drift on the card under it.
 * No proficiency bars or percentages: the resume gives none, so none are shown.
 */
export function Skills() {
  const { theme } = useTheme();

  const cards: BentoCard[] = skillGroups.map((group, index) => ({
    id: group.label,
    label: String(index + 1).padStart(2, "0"),
    title: group.label,
    className: `sm:col-span-1 ${SPAN[group.label] ?? "lg:col-span-3"}`,
    children: (
      <ul className="flex flex-wrap gap-2" aria-label={group.label}>
        {group.items.map((item) => (
          <li key={item}>
            <Badge tone={group.label === EMPHASIZED ? "brand" : "default"}>{item}</Badge>
          </li>
        ))}
      </ul>
    ),
  }));

  return (
    <section id="skills" className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Skills"
          title="Skills and"
          accent="tools."
          description="Grouped by the kind of work they support."
        />
        <MagicBento
          cards={cards}
          glowColor={theme === "dark" ? "169, 196, 196" : "0, 68, 102"}
          className="mt-12 sm:grid-cols-2 lg:grid-cols-6"
        />
      </div>
    </section>
  );
}
