import { useMemo, useState } from "react";
import { ArrowRight, Mail, Pause, Play } from "lucide-react";
import BlurText from "@/components/reactbits/BlurText";
import ClickSpark from "@/components/reactbits/ClickSpark";
import LogoLoop, { type LogoItem } from "@/components/reactbits/LogoLoop";
import Magnet from "@/components/reactbits/Magnet";
import RotatingText from "@/components/reactbits/RotatingText";
import ShapeGrid from "@/components/reactbits/ShapeGrid";
import ShinyText from "@/components/reactbits/ShinyText";
import SplitText from "@/components/reactbits/SplitText";
import { HeroBadge } from "@/components/sections/HeroBadge";
import { GitHubMark, LinkedInMark } from "@/components/ui/BrandIcons";
import { buttonClass } from "@/components/ui/Button";
import { ResumeLink } from "@/components/ui/ResumeLink";
import { SwapIcon } from "@/components/ui/SwapIcon";
import { profile, skillGroups } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/lib/theme";

const NAME_WORDS = profile.fullName.split(" ");
const NAME_LINE_1 = NAME_WORDS.slice(0, 2).join(" ");
const NAME_LINE_2 = NAME_WORDS.slice(2).join(" ");

/** The first sentence of the resume summary leads; the whole summary is on the About section. */
const LEAD = (profile.summary.match(/[^.]+\./g) ?? [profile.summary])[0].trim();

/** The three focus areas of the positioning line; the loop rests on the first (the one the page leads with). */
const FOCUS = profile.positioning.split(" · ").slice(1);
const ROTATION = [...FOCUS.slice(1).reverse(), FOCUS[0]];

/** Tools for the marquee: real entries from the skill groups, interleaved so neighbours differ. */
const TOOL_GROUPS = ["Security Tools", "Programming Languages", "Web Development", "Development Tools"];
function interleavedTools(): string[] {
  const columns = TOOL_GROUPS.map((label) => skillGroups.find((group) => group.label === label)?.items ?? []);
  const longest = Math.max(...columns.map((column) => column.length));
  const out: string[] = [];
  for (let i = 0; i < longest; i++) columns.forEach((column) => column[i] && out.push(column[i]));
  return out;
}
const TOOLS = interleavedTools();

const CHIP =
  "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm leading-none font-medium text-ink-2 shadow-card";

const SOCIAL =
  "press-feedback grid size-11 place-items-center rounded-full border border-line text-ink-2 can-hover:border-line-strong can-hover:text-link";

/**
 * The opening. Left: a status pill, the name in two deliberate lines (the second in the palette
 * gradient), what the visitor is focused on, a one-sentence summary, actions and social links.
 * Right: the swinging profile card. Behind: a still grid that lights up under the cursor.
 * Along the bottom: the tools she works with, scrolling slowly, with a visible pause button.
 * One entrance is choreographed: the pill, then the name's letters, then the lines below, then the card.
 */
export function Hero() {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const dark = theme === "dark";

  const logos: LogoItem[] = useMemo(
    () =>
      TOOLS.map((tool) => ({
        ariaLabel: tool,
        node: (
          <span className={CHIP}>
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {tool}
          </span>
        ),
      })),
    [],
  );

  return (
    <section id="home" className="relative isolate flex min-h-svh flex-col overflow-hidden pt-24 lg:pt-28">
      {/* One principal background: a still grid, faded toward the edges, that fills squares under the cursor. */}
      <div aria-hidden="true" className="mask-fade-edges absolute inset-0 -z-10">
        <ShapeGrid
          speed={0}
          squareSize={46}
          shape="square"
          borderColor={dark ? "#a9c4c41a" : "#0044661c"}
          hoverFillColor={dark ? "#004466" : "#a9c4c4"}
          hoverTrailAmount={4}
        />
      </div>

      <div className="container-page grid flex-1 items-center gap-14 pb-10 lg:grid-cols-12 lg:gap-8 lg:pb-14">
        <div className="[container-type:inline-size] lg:col-span-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[0.8125rem] font-medium shadow-card">
              <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
              <ShinyText
                text="Open to cybersecurity roles"
                color={dark ? "#a9c4c4" : "#004466"}
                shineColor={dark ? "#e1ded9" : "#e4b55d"}
                trigger="view"
                speed={1.6}
                delay={0.4}
              />
            </span>
          </div>

          <h1
            aria-label={profile.fullName}
            className="mt-6 font-display text-[clamp(2.05rem,9.3cqi,4.75rem)] leading-[1.0] font-bold tracking-[-0.045em] text-ink"
          >
            <SplitText tag="span" text={NAME_LINE_1} className="block w-fit" delay={30} duration={0.9} startDelay={0.15} />
            <SplitText tag="span" text={NAME_LINE_2} gradient className="block w-fit" delay={30} duration={0.9} startDelay={0.5} />
          </h1>

          <p className="mt-6 flex flex-wrap items-baseline gap-x-2 text-lg font-medium text-ink sm:text-xl">
            <span>{profile.program} student, focused on</span>
            <RotatingText
              texts={reduced ? [FOCUS[0]] : ROTATION}
              loop={true}
              rotationInterval={2100}
              mainClassName="overflow-hidden rounded-control bg-[color-mix(in_oklab,var(--gold)_30%,transparent)] px-2.5 py-0.5 text-ink"
              splitLevelClassName="overflow-hidden pb-0.5"
              staggerFrom="last"
              staggerDuration={0.02}
              transition={{ type: "spring", damping: 32, stiffness: 340 }}
            />
          </p>

          <div className="mt-5 max-w-xl text-ink-2 sm:text-lg">
            <BlurText text={LEAD} delay={45} startDelay={0.9} stepDuration={0.3} className="leading-relaxed" />
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnet padding={60} magnetStrength={4}>
              <ClickSpark sparkColor="var(--c-accent)" sparkCount={8} sparkRadius={20} className="inline-flex">
                <a href="#projects" className={buttonClass("primary")}>
                  View projects
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </ClickSpark>
            </Magnet>
            <ResumeLink className={buttonClass("secondary")}>Resume</ResumeLink>
            <a href="#contact" className={buttonClass("ghost")}>
              Get in touch
            </a>
          </div>

          <ul className="mt-8 flex items-center gap-2.5" aria-label="Social links">
            <li>
              <a href={profile.contact.linkedin} target="_blank" rel="noreferrer noopener" className={SOCIAL}>
                <LinkedInMark size={18} />
                <span className="sr-only">LinkedIn (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.contact.github} target="_blank" rel="noreferrer noopener" className={SOCIAL}>
                <GitHubMark size={18} />
                <span className="sr-only">GitHub (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.contact.email}`} className={SOCIAL}>
                <Mail size={18} aria-hidden="true" />
                <span className="sr-only">Email {profile.contact.email}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-5 lg:-mt-28 lg:self-start">
          <HeroBadge />
        </div>
      </div>

      <div className="pb-8 lg:pb-10">
        <div className="container-page mb-3 flex items-center justify-between gap-4">
          <p className="type-eyebrow">Tools and languages</p>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Resume the scrolling tools list" : "Pause the scrolling tools list"}
              className="press-feedback grid size-11 place-items-center rounded-full border border-line text-ink-2 can-hover:border-line-strong can-hover:text-ink sm:size-9"
            >
              <SwapIcon swapped={paused} from={<Pause size={14} />} to={<Play size={14} />} />
            </button>
          )}
        </div>
        {reduced ? (
          <ul className="container-page flex flex-wrap gap-2.5" aria-label="Tools and languages">
            {TOOLS.map((tool) => (
              <li key={tool} className={CHIP}>
                <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
                {tool}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mask-fade-x">
            <LogoLoop logos={logos} speed={42} gap={14} logoHeight={40} paused={paused} pauseOnHover ariaLabel="Tools and languages" />
          </div>
        )}
      </div>
    </section>
  );
}
