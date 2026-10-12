import { lazy, Suspense, useState, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";
import CountUp from "@/components/reactbits/CountUp";
import PixelTransition from "@/components/reactbits/PixelTransition";
import { Badge } from "@/components/ui/Badge";
import { GitHubLink } from "@/components/ui/GitHubLink";
import { GlowCard } from "@/components/ui/GlowCard";
import { useLightbox } from "@/components/ui/LightboxProvider";
import { PullQuote } from "@/components/ui/PullQuote";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/data/portfolio";
import { useInViewOnce } from "@/hooks/useInViewOnce";
import { cn } from "@/lib/cn";
import { useTheme } from "@/lib/theme";
import type { Project, Severity } from "@/types/portfolio";

const ProjectCaseStudyModal = lazy(() =>
  import("@/components/sections/ProjectCaseStudyModal").then((mod) => ({ default: mod.ProjectCaseStudyModal })),
);

const SEVERITY_LABEL: Record<Severity, string> = { high: "High", medium: "Medium", low: "Low" };
const SEVERITY_BAR: Record<Severity, string> = { high: "bg-sev-high", medium: "bg-sev-medium", low: "bg-sev-low" };

/**
 * Cards lift 2px on hover (pointer devices only) and settle to 99.2% while pressed anywhere on the card.
 * Only `translate` and `scale` move, so the hover stays off the paint path.
 */
const LIFT = "transition-[translate,scale] duration-200 ease-out can-hover:-translate-y-0.5 has-[button:active]:scale-[0.992]";

/**
 * The whole card is one click target: the button's ::after stretches over the
 * card, so there is a single tab stop. Real links inside sit above it (z-10).
 */
function CaseStudyButton({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="group/cta inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-link transition-colors duration-200 after:absolute after:inset-0 after:content-[''] can-hover:text-ink"
    >
      View case study
      <span className="sr-only">: {project.codename ?? project.title}</span>
      <ArrowUpRight
        size={15}
        className="transition-transform duration-200 group-can-hover/cta:translate-x-0.5 group-can-hover/cta:-translate-y-0.5"
        aria-hidden="true"
      />
    </button>
  );
}

function Tools({ tools, className }: { tools: string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Tools">
      {tools.map((tool) => (
        <li key={tool}>
          <Badge>{tool}</Badge>
        </li>
      ))}
    </ul>
  );
}

/** A figure that counts up when it is a plain number or percentage, and prints as-is otherwise (technique IDs such as T1110). */
function MetricValue({ value, className }: { value: string; className?: string }) {
  const counted = /^(\d+)(%?)$/.exec(value);
  return (
    <span className={className}>
      {counted ? <CountUp to={Number(counted[1])} suffix={counted[2]} duration={1.4} /> : value}
    </span>
  );
}

function Metrics({ items }: { items?: { label: string; value: string }[] }) {
  if (!items?.length) return null;
  return (
    <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
      {items.map((metric) => (
        <div key={metric.label} className="flex flex-col-reverse">
          <dt className="type-meta">{metric.label}</dt>
          <dd>
            <MetricValue value={metric.value} className="font-display text-xl font-semibold tabular-nums" />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Category and project type on one line, so every card says what it is and whose work it was. */
function ProjectMeta({ project }: { project: Project }) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
      <span className="text-sm font-semibold text-accent-text">{project.category}</span>
      <span className="type-meta">{project.projectType}</span>
    </p>
  );
}

function ProjectTitle({ project }: { project: Project }) {
  return (
    <>
      <h3 className="type-h3 mt-2">{project.codename ?? project.title}</h3>
      {project.codename && project.title !== project.category && <p className="type-meta mt-1">{project.title}</p>}
    </>
  );
}

/**
 * The data panel for projects with no screenshots: the resume's own figures set large,
 * then what the project detects or monitors. Nothing here is decorative.
 */
function DataPanel({ project }: { project: Project }) {
  const { findings, findingsLabel } = project.caseStudy;
  return (
    <div className="flex h-full flex-col justify-between gap-8 border-b border-line bg-[color-mix(in_oklab,var(--c-link)_8%,transparent)] p-6 sm:p-7">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
        {project.metrics?.map((metric) => (
          <div key={metric.label} className="flex flex-col-reverse justify-end gap-2">
            <dt className="type-meta">{metric.label}</dt>
            <dd>
              <MetricValue
                value={metric.value}
                className="font-display text-4xl leading-none font-bold tracking-[-0.03em] tabular-nums sm:text-5xl"
              />
            </dd>
          </div>
        ))}
      </dl>
      <div>
        {findingsLabel && <p className="type-meta">{findingsLabel}</p>}
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {findings.map((finding) => (
            <li key={finding}>
              <Badge tone="brand">{finding}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Case study link, then the repository when the project has one. Pinned to the bottom of the card. */
function ProjectActions({ project, onOpen }: { project: Project; onOpen: (project: Project) => void }) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-7">
      <CaseStudyButton project={project} onOpen={onOpen} />
      {project.github && <GitHubLink href={project.github} project={project.codename ?? project.title} />}
    </div>
  );
}

/** Same body for every two-up card: meta, title, summary, tools, then actions pinned to the bottom. */
function ProjectCard({
  project,
  media,
  onOpen,
  showMetrics = true,
  aligned = false,
}: {
  project: Project;
  media?: ReactNode;
  onOpen: (project: Project) => void;
  showMetrics?: boolean;
  /** Join the parent's two grid rows (media, then body) so a side-by-side pair lines up. */
  aligned?: boolean;
}) {
  return (
    <GlowCard className={cn(LIFT, "flex h-full flex-col", aligned && "md:row-span-2 md:grid md:grid-rows-subgrid md:gap-y-0")}>
      {media}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <ProjectMeta project={project} />
        <ProjectTitle project={project} />
        <p className="mt-4 text-ink-2">{project.summary}</p>
        {showMetrics && <Metrics items={project.metrics} />}
        <Tools tools={project.tools} className="mt-5" />
        <ProjectActions project={project} onOpen={onOpen} />
      </div>
    </GlowCard>
  );
}

/** Severity breakdown drawn from the real finding counts; every segment also prints its word. */
function SeverityBars({ project }: { project: Project }) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  if (!project.severityBreakdown) return null;
  return (
    <div ref={ref} data-in={seen} className="mt-6">
      <div
        className="flex h-3 gap-1"
        role="img"
        aria-label={project.severityBreakdown.map((s) => `${s.count} ${SEVERITY_LABEL[s.severity]}`).join(", ")}
      >
        {project.severityBreakdown.map((entry, index) => (
          <span
            key={entry.severity}
            style={{ flexGrow: entry.count, "--i": index } as React.CSSProperties}
            className={cn("draw-x rounded-sm", SEVERITY_BAR[entry.severity])}
          />
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {project.severityBreakdown.map((entry) => (
          <li key={entry.severity}>
            <Badge tone={entry.severity}>
              {entry.count} {SEVERITY_LABEL[entry.severity]}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * EdTech screenshots: the landing page and the admin dashboard share one frame and trade places through a
 * pixel transition (hover or keyboard focus on a mouse device, a tap on touch). Under it, a row of all four
 * screenshots opens the full-size lightbox, so every screen is reachable without the effect.
 */
function EdTechMedia({ project }: { project: Project }) {
  const { theme } = useTheme();
  const openLightbox = useLightbox();
  const gallery = project.gallery ?? [];
  const landing = gallery[0];
  const dashboard = gallery[gallery.length - 1];
  if (!landing || !dashboard) return null;

  const shot = (item: { src: string; alt: string }) => (
    <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="size-full object-cover object-top" />
  );

  return (
    <div className="flex h-full flex-col gap-3 bg-[color-mix(in_oklab,var(--c-link)_8%,transparent)] p-4 sm:p-5">
      <PixelTransition
        label="Digi+wo screenshots: the landing page. Hover, focus or tap to see the admin dashboard."
        firstContent={shot(landing)}
        secondContent={shot(dashboard)}
        aspectRatio="16 / 10"
        gridSize={14}
        pattern="random"
        pixelAnimation="pop"
        pixelColor={theme === "dark" ? "#a9c4c4" : "#004466"}
        className="rounded-control border border-line"
      />
      <ul className="grid grid-cols-4 gap-2" aria-label="Screenshots">
        {gallery.map((item) => (
          <li key={item.src}>
            <button
              type="button"
              onClick={() => openLightbox(item)}
              aria-label={`Enlarge: ${item.caption ?? item.alt}`}
              className="press-feedback block aspect-[4/3] w-full overflow-hidden rounded-control border border-line can-hover:border-line-strong"
            >
              <img src={item.src} alt="" loading="lazy" decoding="async" className="size-full object-cover object-top" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // The data file is in display order; the resume projects come first, the rest are secondary.
  const primary = projects.filter((project) => !project.additional);
  const additional = projects.filter((project) => project.additional);
  const [mobile, soc, splunk, edtech] = primary;
  const [findingsMetric, standardMetric] = mobile.metrics ?? [];

  return (
    <section id="projects" className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Projects"
          title="What I’ve"
          accent="built."
          description="Technical security projects across mobile penetration testing, defensive log analysis, SIEM detection, and secure web development."
        />

        <div className="mt-12 flex flex-col gap-6 md:mt-16">
          {/* Featured: the mobile pentest. No screenshots on purpose (they would expose a real system),
              so its visual is the findings themselves, drawn from the real counts. */}
          <AnimatedContent distance={28}>
            <GlowCard className={cn(LIFT, "grid md:grid-cols-12")}>
              <div className="p-6 sm:p-9 md:col-span-7">
                <ProjectMeta project={mobile} />
                <h3 className="type-h3 mt-2 max-w-md">{mobile.title}</h3>
                <p className="mt-5 max-w-xl text-ink-2">{mobile.summary}</p>
                {mobile.quote && <PullQuote className="mt-7">{mobile.quote}</PullQuote>}
                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <CaseStudyButton project={mobile} onOpen={setActiveProject} />
                  {mobile.github && <GitHubLink href={mobile.github} project={mobile.title} />}
                </div>
              </div>

              <div className="border-t border-line bg-[color-mix(in_oklab,var(--c-link)_8%,transparent)] p-6 sm:p-9 md:col-span-5 md:border-t-0 md:border-l">
                {findingsMetric && (
                  <div>
                    <p className="font-display text-7xl leading-none font-bold tracking-[-0.04em] tabular-nums">
                      <MetricValue value={findingsMetric.value} />
                    </p>
                    <p className="type-meta mt-2">{findingsMetric.label}</p>
                  </div>
                )}
                <SeverityBars project={mobile} />
                {standardMetric && (
                  <p className="mt-6 text-sm text-ink-2">
                    {standardMetric.label}: <span className="font-semibold text-ink">{standardMetric.value}</span>
                  </p>
                )}
                <Tools tools={mobile.tools} className="mt-6" />
              </div>
            </GlowCard>
          </AnimatedContent>

          {/* The defensive pair: no screenshots exist, so each gets a panel of its own resume figures. */}
          <div className="grid gap-6 md:grid-cols-2 md:grid-rows-[auto_1fr]">
            {[soc, splunk].map((project, index) => (
              <AnimatedContent
                key={project.id}
                delay={index * 0.08}
                distance={28}
                className="md:row-span-2 md:grid md:grid-rows-subgrid md:gap-y-0"
              >
                <ProjectCard
                  project={project}
                  onOpen={setActiveProject}
                  showMetrics={false}
                  aligned
                  media={<DataPanel project={project} />}
                />
              </AnimatedContent>
            ))}
          </div>

          {/* EdTech: the one project with real screenshots, so it gets the wide media-left composition. */}
          <AnimatedContent distance={28}>
            <GlowCard className={cn(LIFT, "grid md:grid-cols-12")}>
              <div className="md:col-span-7">
                <EdTechMedia project={edtech} />
              </div>
              <div className="flex flex-col p-6 sm:p-8 md:col-span-5">
                <ProjectMeta project={edtech} />
                <ProjectTitle project={edtech} />
                <p className="mt-4 text-ink-2">{edtech.summary}</p>
                <Metrics items={edtech.metrics} />
                <Tools tools={edtech.tools} className="mt-5" />
                <ProjectActions project={edtech} onOpen={setActiveProject} />
              </div>
            </GlowCard>
          </AnimatedContent>
        </div>

        {/* Group work that is not on the current resume. Compact, text only, kept below the main four. */}
        {additional.length > 0 && (
          <div className="mt-16 md:mt-20">
            <h3 className="type-h3 mb-6">Additional projects</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {additional.map((project, index) => (
                <AnimatedContent key={project.id} delay={index * 0.08} distance={28}>
                  <ProjectCard project={project} onOpen={setActiveProject} />
                </AnimatedContent>
              ))}
            </div>
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <ProjectCaseStudyModal project={activeProject} onClose={() => setActiveProject(null)} />
      </Suspense>
    </section>
  );
}
