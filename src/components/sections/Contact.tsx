import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, MapPin, Phone } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import DecryptedText from "@/components/reactbits/DecryptedText";
import Magnet from "@/components/reactbits/Magnet";
import { Boundary } from "@/components/ui/Boundary";
import { GitHubMark, LinkedInMark } from "@/components/ui/BrandIcons";
import { buttonClass } from "@/components/ui/Button";
import FadeContent from "@/components/reactbits/FadeContent";
import { ResumeLink } from "@/components/ui/ResumeLink";
import { SwapIcon } from "@/components/ui/SwapIcon";
import { profile } from "@/data/portfolio";

/** The WebGL background is a separate chunk, fetched only when the contact band is about to scroll in. */
const Aurora = lazy(() => import("@/components/reactbits/Aurora"));

/** Palette colours for the aurora, as literals: the shader cannot read CSS variables. */
const AURORA = ["#004466", "#a9c4c4", "#755468"];

/** Copies the address and confirms it in place. The status is announced to screen readers. */
function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be blocked; the address is still a visible mailto link above.
    }
  };

  return (
    <>
      <button type="button" onClick={copy} className={buttonClass("secondary", "sm")}>
        <SwapIcon swapped={copied} from={<Copy size={14} aria-hidden="true" />} to={<Check size={14} aria-hidden="true" />} />
        {copied ? "Copied" : "Copy email"}
      </button>
      <span className="sr-only" role="status">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </>
  );
}

/**
 * The closing band, always in the dark palette (Oblivion with Lush Aqua) whichever theme the page is in,
 * so the ending reads as an ending. The heading decrypts into place once, the email is a magnetic button
 * with a spark on click, and a slow aurora in the palette colours sits behind it.
 */
export function Contact() {
  const { contact } = profile;
  const telHref = `tel:${contact.phone.replace(/[^+\d]/g, "")}`;
  const sectionRef = useRef<HTMLElement>(null);
  const [nearScreen, setNearScreen] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearScreen(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Links get an underline that draws in from the left on hover (pointer devices only).
  const link =
    "press-feedback relative inline-flex min-h-11 items-center gap-2 after:absolute after:inset-x-0 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out can-hover:text-ink can-hover:after:scale-x-100";

  return (
    <section
      ref={sectionRef}
      id="contact"
      data-theme="dark"
      className="relative isolate overflow-hidden bg-bg text-ink section-y"
    >
      <div aria-hidden="true" className="mask-fade-b pointer-events-none absolute inset-0 -z-10 opacity-60">
        {nearScreen && (
          <Boundary>
            <Suspense fallback={null}>
              <Aurora colorStops={AURORA} amplitude={1.1} blend={0.7} speed={0.5} />
            </Suspense>
          </Boundary>
        )}
      </div>

      <div className="container-page">
        <FadeContent duration={0.6}>
          <p className="type-eyebrow flex items-center gap-3">
            <span className="h-0.5 w-8 rounded-full bg-accent" aria-hidden="true" />
            Contact
          </p>
        </FadeContent>
        <h2 className="type-h2 mt-4 max-w-3xl">
          <DecryptedText
            text="Let’s build something secure."
            animateOn="view"
            sequential
            revealDirection="start"
            speed={38}
            useOriginalCharsOnly
            encryptedClassName="text-ink-3"
          />
        </h2>
        <FadeContent delay={0.2} duration={0.7}>
          <p className="type-lead mt-5 max-w-xl text-ink-2">
            Open to opportunities in cybersecurity, including penetration testing, security monitoring, and SOC-related
            roles.
          </p>

          <div className="mt-10">
            <Magnet padding={90} magnetStrength={5}>
              <ClickSpark sparkColor="var(--c-accent)" sparkCount={10} sparkRadius={26} sparkSize={12} className="inline-flex">
                <a
                  href={`mailto:${contact.email}`}
                  className="press-feedback group inline-flex max-w-full items-center gap-3 rounded-full bg-btn py-4 pr-5 pl-7 font-display text-[clamp(1.05rem,3.6vw,1.75rem)] leading-tight font-semibold text-on-btn shadow-lift can-hover:bg-btn-hover sm:py-5 sm:pr-7 sm:pl-9"
                >
                  <span className="min-w-0 [overflow-wrap:anywhere]">{contact.email}</span>
                  <ArrowUpRight
                    className="size-[1em] shrink-0 transition-transform duration-200 group-can-hover:translate-x-1 group-can-hover:-translate-y-1"
                    aria-hidden="true"
                  />
                </a>
              </ClickSpark>
            </Magnet>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CopyEmail email={contact.email} />
            <ResumeLink icon="download" iconSize={14} className={buttonClass("secondary", "sm")}>
              Download resume
            </ResumeLink>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-1 border-t border-line pt-6 text-ink-2">
            <li>
              <a href={contact.linkedin} target="_blank" rel="noreferrer noopener" className={link}>
                <LinkedInMark size={16} />
                LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={contact.github} target="_blank" rel="noreferrer noopener" className={link}>
                <GitHubMark size={16} />
                GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={telHref} className={link}>
                <Phone size={16} aria-hidden="true" />
                {contact.phone}
              </a>
            </li>
            <li className="inline-flex min-h-11 items-center gap-2">
              <MapPin size={16} aria-hidden="true" />
              {contact.location}
            </li>
          </ul>
        </FadeContent>
      </div>
    </section>
  );
}
