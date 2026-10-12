import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { ResumeLink } from "@/components/ui/ResumeLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { profile } from "@/data/portfolio";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "@/lib/nav";

/** Horizontal padding of a nav link (px-3.5), so the active bar spans the text only. */
const LINK_PAD = 14;

const SHORT_NAME = profile.fullName.split(" ").slice(0, 2).join(" ");

interface Box {
  x: number;
  width: number;
}

/**
 * A minimal horizontal bar. At the top of the page it is transparent; once the page scrolls it
 * becomes a translucent layer with the content blurring underneath (.nav-material). Links get a
 * single pill that glides between them on hover and focus, and a gold bar marks the current section.
 * Below 1024px the links move into a dropdown panel under the bar (not a full-screen menu).
 */
export function Navbar({ activeId }: { activeId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [active, setActive] = useState<Box | null>(null);
  const [hover, setHover] = useState<{ box: Box; shown: boolean } | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const measure = (id: string): Box | null => {
    const link = linkRefs.current[id];
    return link ? { x: link.offsetLeft, width: link.offsetWidth } : null;
  };

  // The active bar is measured again after web fonts load and on resize, since both change link widths.
  useLayoutEffect(() => {
    const update = () => setActive(measure(activeId));
    update();
    window.addEventListener("resize", update);
    void document.fonts?.ready.then(update);
    return () => window.removeEventListener("resize", update);
  }, [activeId]);

  const showPill = (id: string) => {
    const box = measure(id);
    if (box) setHover({ box, shown: true });
  };
  const hidePill = () => setHover((previous) => (previous ? { ...previous, shown: false } : previous));

  // The mobile menu is a dropdown, not a modal: Escape or a tap elsewhere closes it.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300",
        isOpen || isScrolled ? "nav-material" : "",
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a
          href="#home"
          aria-label={`${profile.fullName}, back to the top`}
          className="press-feedback flex items-center gap-3"
        >
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-control bg-btn font-display text-sm font-bold tracking-tight text-on-btn"
          >
            MN
          </span>
          <span className="hidden leading-tight min-[26rem]:block" aria-hidden="true">
            <span className="block font-display text-[0.95rem] font-semibold text-ink">{SHORT_NAME}</span>
            <span className="block text-xs text-ink-3">{profile.program}</span>
          </span>
        </a>

        <nav aria-label="Primary" className="relative hidden items-center lg:flex" onPointerLeave={hidePill}>
          {/* Hover pill: one element that glides between links (transform and width, 250ms). */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-0 h-9 -translate-y-1/2 rounded-full bg-surface-2 transition-[transform,width,opacity] duration-[250ms] ease-[var(--ease-out)]"
            style={{
              width: hover?.box.width ?? 0,
              transform: `translateX(${hover?.box.x ?? 0}px) translateY(0)`,
              opacity: hover?.shown ? 1 : 0,
            }}
          />
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                ref={(node) => {
                  linkRefs.current[item.id] = node;
                }}
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                onPointerEnter={(event) => event.pointerType === "mouse" && showPill(item.id)}
                onFocus={(event) => event.currentTarget.matches(":focus-visible") && showPill(item.id)}
                onBlur={hidePill}
                className={cn(
                  "relative inline-flex h-16 items-center rounded-full px-3.5 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-ink" : "text-ink-2 can-hover:text-ink",
                )}
              >
                {item.label}
              </a>
            );
          })}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 left-0 h-0.5 w-px origin-left rounded-full bg-accent transition-[transform,opacity] duration-300 ease-[var(--ease-out)]"
            style={{
              transform: `translateX(${(active?.x ?? 0) + LINK_PAD}px) scaleX(${Math.max((active?.width ?? 0) - LINK_PAD * 2, 0)})`,
              opacity: active ? 1 : 0,
            }}
          />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Wrapped, not hidden directly: buttonClass sets `display`, and a second display utility on the
              same element is decided by stylesheet order, which left both buttons showing on phones. */}
          <div className="hidden rounded-control bg-bg xl:block">
            <ResumeLink iconSize={14} className={buttonClass("secondary", "sm")}>
              Resume
            </ResumeLink>
          </div>
          <div className="hidden lg:block">
            <a href="#contact" className={buttonClass("primary", "sm")}>
              Get in touch
            </a>
          </div>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="press-feedback -mr-1 grid size-11 place-items-center text-ink lg:hidden"
          >
            {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Dropdown panel under the bar, revealed top-down with clip-path (see .menu-panel), so no layout
          animates. `inert` keeps closed links out of the tab order. Items follow the panel in a short
          stagger on open and drop out with no delay on close. */}
      <div
        id="mobile-menu"
        inert={!isOpen}
        data-open={isOpen}
        className="menu-panel absolute inset-x-0 top-full border-b border-line bg-bg lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page pb-5">
          <ul>
            {[...NAV_ITEMS, { id: "resume", label: "Resume" }].map((item, index) => {
              const isResume = item.id === "resume";
              const isCurrent = activeId === item.id;
              const link = "flex items-center justify-between py-3.5 font-display text-xl font-medium";
              return (
                <li
                  key={item.id}
                  className={cn(
                    "border-t border-line transition-[opacity,translate] duration-300 ease-out first:border-t-0",
                    isOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
                  )}
                  style={{ transitionDelay: isOpen ? `${80 + index * 35}ms` : "0ms" }}
                >
                  {isResume ? (
                    <ResumeLink
                      iconSize={18}
                      iconPlacement="end"
                      iconClassName="text-ink-3"
                      onActivate={() => setIsOpen(false)}
                      className={cn(link, "text-ink")}
                    >
                      {item.label}
                    </ResumeLink>
                  ) : (
                    <a
                      href={`#${item.id}`}
                      onClick={() => setIsOpen(false)}
                      aria-current={isCurrent ? "location" : undefined}
                      className={cn(link, isCurrent ? "text-link" : "text-ink")}
                    >
                      {item.label}
                      {isCurrent && <span className="size-2 rounded-full bg-accent" aria-hidden="true" />}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className={cn(buttonClass("primary", "md"), "mt-2 w-full text-base")}
          >
            Get in touch
          </a>
        </nav>
      </div>
    </header>
  );
}
