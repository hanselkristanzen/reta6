import { Bug, CodeXml, Radar, Users } from "lucide-react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import CountUp from "@/components/reactbits/CountUp";
import GradientText from "@/components/reactbits/GradientText";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { organizationRoles, profile, projects } from "@/data/portfolio";
import { useTheme } from "@/lib/theme";

/**
 * Four areas of focus, each tied to work that is on the resume. Every line
 * restates something already shown in Projects or Experience.
 */
// const FOCUS_AREAS = [
//   {
//     icon: Bug,
//     title: "Offensive security",
//     body: "Static and dynamic analysis of a Flutter-based hospital app, with every finding scored using CVSS v4.0.",
//   },
//   {
//     icon: Radar,
//     title: "Defensive security and monitoring",
//     body: "A Python tool that detects suspicious SSH activity, and a Splunk and Sysmon lab with SPL detections.",
//   },
//   {
//     icon: CodeXml,
//     title: "Application security",
//     body: "Secure web development with bcrypt hashing, account lockout, server-side validation, and XSS-safe output.",
//   },
//   {
//     icon: Users,
//     title: "Leadership and coordination",
//     body: "Led publication and marketing teams, and chaired LDK-CP HIMTI 2026, at BINUS University.",
//   },
// ];

/**
 * Reads a number out of a data string ("94%", "3.51 / 4.0"). By default it takes the first one;
 * pass a pattern with one capture group when the first number is not the figure ("LDK-CP HIMTI 2026 ... 150+ participants").
 */
function figure(text: string | undefined, pattern = /(\d[\d,.]*)/): number {
  const match = text?.match(pattern);
  return match ? parseFloat(match[1].replace(/,/g, "")) : Number.NaN;
}

/** The headcount is the number written with a plus sign: "for 150+ participants". */
const HEADCOUNT = /(\d[\d,]*)\+\s*participants/;

const findProject = (id: string) => projects.find((project) => project.id === id);
const metric = (id: string, label: string) => findProject(id)?.metrics?.find((entry) => entry.label === label)?.value;

/** Every figure is read from the same data the rest of the page uses, so it cannot drift from it. */
const STATS = [
  { to: figure(profile.gpa), suffix: "", label: "Cumulative GPA, out of 4.0" },
  { to: figure(metric("mobile-pentest", "Vulnerabilities identified")), suffix: "", label: "Vulnerabilities found in a mobile app assessment" },
  { to: figure(metric("soc-log-analyzer", "Test coverage")), suffix: "%", label: "Test coverage on the SOC Log Analyzer" },
  { to: figure(organizationRoles[0]?.achievements.find((line) => HEADCOUNT.test(line)), HEADCOUNT), suffix: "+", label: "Participants at LDK-CP HIMTI 2026" },
].filter((stat) => Number.isFinite(stat.to));

export function About() {
  const { theme } = useTheme();
  const colors = theme === "dark" ? ["#a9c4c4", "#e4b55d", "#a9c4c4"] : ["#004466", "#755468", "#004466"];

  return (
    <section id="about" className="section-y">
      <div className="container-page">
        <SectionHeading eyebrow="About" title="Hands-on security," accent="built through projects." />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <ScrollReveal className="font-display text-[clamp(1.5rem,2.9vw,2.125rem)] leading-[1.28] font-medium tracking-[-0.02em]">
              {profile.summary}
            </ScrollReveal>
          </div>

          <dl className="grid grid-cols-2 gap-4 lg:col-span-5 lg:self-start">
            {STATS.map((stat, index) => (
              <AnimatedContent key={stat.label} delay={index * 0.07} distance={20} className="surface flex flex-col-reverse justify-end gap-2 p-5">
                <dt className="type-meta">{stat.label}</dt>
                <dd>
                  <GradientText colors={colors} animationSpeed={18} pauseOnHover className="font-display text-5xl leading-none font-bold tracking-[-0.04em] tabular-nums">
                    <CountUp to={stat.to} suffix={stat.suffix} duration={1.6} delay={index * 0.07} />
                  </GradientText>
                </dd>
              </AnimatedContent>
            ))}
          </dl>
        </div>

        {/* <h3 className="type-h3 mt-20">What I focus on</h3>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FOCUS_AREAS.map((area, index) => (
            <li key={area.title}>
              <AnimatedContent delay={index * 0.06} distance={20} className="surface h-full p-6">
                <span className="grid size-11 place-items-center rounded-control bg-[color-mix(in_oklab,var(--c-link)_12%,transparent)] text-link">
                  <area.icon size={20} aria-hidden="true" />
                </span>
                <h4 className="mt-5 font-display text-lg leading-snug font-semibold tracking-[-0.015em]">{area.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{area.body}</p>
              </AnimatedContent>
            </li>
          ))}
        </ul> */}
      </div>
    </section>
  );
}
