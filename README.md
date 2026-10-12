# Margareta Nadya: Cyber Security Portfolio

A portfolio for Margareta Nadya Roselani Bramanjaya, a Cyber Security student at
BINUS University. Built with React, Vite, TypeScript, and Tailwind CSS v4, with
[React Bits](https://github.com/DavidHDev/react-bits) components for motion
(see **React Bits** below).

Every fact on the site (dates, GPA, titles, project scope, tools, metrics,
skills) is sourced from the current resume or from certificates, photos, and
project case studies supplied directly. See **Content accuracy** below.

## Getting started

```bash
npm install
npm run dev       # dev server, usually http://localhost:5173
```

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
npm run lint       # oxlint
```

Deploy `dist/` anywhere static: on Vercel or Netlify, framework preset
"Vite", no extra config needed.

## Updating the resume

The site links to one PDF: `public/Margareta-Nadya-Bramanjaya-Resume.pdf`. Every
resume link (hero, navigation on desktop and mobile, and the Contact band) is the
same `ResumeLink` component: a same-origin `<a download>`, so the browser saves the
file as `Margareta-Resume.pdf` instead of opening a viewer. After a click the icon
swaps to a check for two seconds and a live region announces "Resume download
started". To publish a new version, overwrite the PDF and keep its file name. The
link and the saved file name are defined once in `src/data/portfolio.ts` (`resume`).

## Project links

A project gets a GitHub button when its entry in `src/data/portfolio.ts` has a
`github` URL. Set it and the button appears on the card and in the case-study dialog;
leave it out and nothing is shown (no placeholder links). Currently only Digi+wo has
one.

## Project structure

```text
src/
├── assets/images/         Optimized WebP photos, certificates, project shots
├── components/
│   ├── reactbits/         React Bits components, copied in and adapted (see below)
│   ├── sections/          Page sections: Navbar, Hero, HeroBadge, About, Education, Projects,
│   │                      Experience, Additional, Skills, Certifications, Contact, Footer, QuickDock
│   └── ui/                Primitives: Button, Badge, GlowCard, SectionHeading, Dialog, Lightbox,
│                          ThemeToggle, ResumeLink, GitHubLink, BrandIcons, Boundary, ...
├── data/portfolio.ts      All content, the single source of truth
├── types/portfolio.ts     TypeScript interfaces for the data above
├── hooks/                 useActiveSection, useHashScroll, useInViewOnce, useReducedMotion,
│                          useMediaQuery, useDialogBehavior, usePresence
├── lib/                   gsap (registered plugins), theme (provider + circle-reveal switch),
│                          nav (section list), inView, charGradient, cn
├── App.tsx
├── main.tsx
└── index.css              Palette, role tokens (light and dark), type roles, motion utilities
```

To change any text, edit `src/data/portfolio.ts`. Components read from
there rather than hardcoding copy. Projects are listed in display order; set
`additional: true` on a project to move it to the compact secondary row. The few
figures shown as large numbers in About (GPA, vulnerability count, test coverage,
participant count) are read from that same data, so they cannot drift from it.

## Design system

Everything lives in `src/index.css`; components never set ad hoc colours or sizes.

### Palette

Six colours, defined once as CSS custom properties. Every other colour is a role
that points at one of them, or a `color-mix` tint of them, so nothing outside the
identity can enter the page.

| Name | Hex | Role |
| --- | --- | --- |
| Abalone Shell | `#E1DED9` | Light background and warm neutral surfaces; text colour in dark |
| Lush Aqua | `#004466` | Primary brand: buttons, links and strong shapes in light; surfaces and glow in dark |
| River of Gold | `#E4B55D` | Sparing accent: active nav bar, selected states, small dots and rules; the action colour in dark |
| Hothouse Orchid | `#755468` | Complement: the second stop of heading gradients, role and category labels |
| Blende Blue | `#A9C4C4` | Soft surfaces, shapes, chips and gradients; link and glow colour in dark |
| Oblivion | `#000435` | Dark background and the strongest text contrast |

Light is Abalone, Blende and Aqua. Dark is Oblivion and Aqua, with Gold for actions
because Aqua on Oblivion is only 1.9:1. Gold never carries text on Abalone (1.4:1); it
is a fill, a rule or a dot. The tokens come in two layers: the six names above, and
role variables (`--c-bg`, `--c-ink`, `--c-surface`, `--c-btn`, `--c-link`, `--c-accent`,
`--c-comp`, ...) that are remapped per theme and exposed to Tailwind through
`@theme inline` (`bg-bg`, `text-ink-2`, `bg-surface`, `text-link`, ...).

### Theme

`data-theme="light|dark"` on `<html>`. An inline script in `index.html` sets it before
first paint from the saved choice, falling back to the OS setting, so there is no flash.
The toggle in the navbar uses the View Transitions API to grow the new theme as a circle
from the button (560ms; browsers without it switch instantly). A section can opt into
the dark tokens on its own with `data-theme="dark"`; the Contact band does.

### Type, layout, shape

- **Type**: Bricolage Grotesque (display, optical-size axis) and Instrument Sans,
  both self-hosted. Roles as utilities: `type-h2`, `type-h3`, `type-lead`, `type-meta`,
  `type-eyebrow`. Display sizes are tight-tracked and use `clamp()`.
- **Layout**: `container-page` (one container width) and `section-y` (one vertical rhythm).
- **Radius**: `rounded-control` for buttons and chips, `rounded-surface` for cards and photos.
- **`can-hover:`** replaces Tailwind's `hover:` everywhere. It only applies on a real
  hover-capable pointer (`(hover: hover) and (pointer: fine)`), so tapping on touch
  devices never leaves an element stuck mid-hover.

### Motion

The aim is premium but controlled: motion confirms, orients or reveals, and almost
nothing moves on its own.

- One ease for interface motion: `cubic-bezier(0.23, 1, 0.32, 1)` (strong ease-out).
  Interface transitions stay under 300ms; reveals run longer because they are seen once.
- Nothing grows from `scale(0)`. Pressable elements scale to 0.97 on press (`.press-feedback`).
- Groups stagger by 30 to 80ms. Only `transform`, `opacity`, `clip-path` and `filter` animate.
- Reveals use an `IntersectionObserver` (`onceInView`), so a section reached by a deep
  link, or scrolled past quickly, still ends up visible. Scrubbed effects (the About
  paragraph, section headings, the experience timeline rail) use GSAP ScrollTrigger.
- Springs carry the visitor's own velocity: the hero badge swings from the speed it was released at.
- Nothing loops without a way out. The tool marquee has a visible pause button, the
  rotating hero text makes one pass and rests, and the shader background is slow and
  decorative. The hero grid is still and only lights up under the cursor.
- Off-screen animation sleeps (marquee, dock loop, shader, bento pointer tracking), and
  every listener, `requestAnimationFrame` and observer is cleaned up on unmount.
- The hero profile card is draggable and swings on a spring (mouse, touch and keyboard
  arrow keys); a vertical swipe on touch still scrolls the page.
- **Reduced motion** (`prefers-reduced-motion: reduce`): reveals become short fades, the
  marquee becomes a static wrapped list, the rotating text and counters show their final
  value, the badge drags without overshoot, the dock does not magnify and the shader shows
  one still frame. Hover and focus colour changes remain.
- **Touch**: effects that need a hovering pointer (glow, magnetism, tilt, magnify) are
  mouse-only; touch gets the same content without them. The pixel image transition
  responds to a tap.

Implementation notes: Tailwind v4's `translate-*` and `scale-*` utilities set the
`translate` and `scale` properties, not `transform`. When two utilities set the same
property on one element, the stylesheet order decides, not the class order, so
`buttonClass` carries padding by size instead of being overridden, and navbar buttons
are hidden by a wrapper rather than by a second `display` class.

## React Bits

[React Bits](https://github.com/DavidHDev/react-bits) is copy-in source rather than an
npm package. These 22 components were taken from the official `src/ts-tailwind` set (the
TypeScript + Tailwind variant, matching this repo) and live in `src/components/reactbits/`.
Each file starts with a header that lists exactly what was changed from upstream. React Bits
is MIT with the Commons Clause; its licence is kept in `src/components/reactbits/LICENSE.md`.

| Component | Where it is used |
| --- | --- |
| SplitText | Hero name, line by line |
| BlurText | Hero summary |
| ShinyText | "Open to cybersecurity roles" pill |
| RotatingText | Hero focus line (one pass, then rests) |
| GradientText | Large figures in About |
| CountUp | About figures and project metrics |
| ScrollReveal | About paragraph, word by word with scroll |
| ScrollFloat | Section headings |
| DecryptedText | Contact heading |
| AnimatedContent | Card and block reveals across the page |
| FadeContent | Footer |
| Magnet | Hero "View projects" and the Contact email button |
| ClickSpark | The same two buttons |
| GlareHover | Leadership photos |
| TiltedCard | Hero profile card |
| SpotlightCard | Every content card (`GlowCard`) |
| PixelTransition | Digi+wo landing page to dashboard |
| LogoLoop | Hero tool marquee |
| ShapeGrid | Hero background grid |
| Aurora | Contact band background (lazy, one WebGL context) |
| Dock | Floating icon dock that appears after the hero |
| MagicBento | Skills grid |

Common adaptations: palette colours and the site's easing instead of upstream defaults;
`prefers-reduced-motion` handling; touch alternatives for hover-only effects; effects
pause off screen; cleanup of timers, observers and frame loops; accessible text for
animated text (the animated glyphs are `aria-hidden` and the real text is exposed once).
The Aurora shader sits inside an error boundary and mounts only when near the viewport.

Differences from the brief's candidate list: `Squares` no longer exists upstream, so
`ShapeGrid` is used for the hero grid. `TextPressure` was not used because it needs an
external font and does not suit these headings. `PixelTransition`, `Dock`, `MagicBento`,
`LogoLoop` and `Aurora` were each used once, where one background or one effect per
section was the rule. Components that were not used on the page were not added.

## New dependencies

| Package | Why |
| --- | --- |
| `gsap`, `@gsap/react` | Text splitting, scroll-linked effects and particle tweens used by the React Bits components |
| `motion` | Springs and layout of TiltedCard, the dock, CountUp, RotatingText and the badge drag (import from `motion/react`) |
| `ogl` | The small WebGL library behind Aurora |

`.gitignore` was added (it was missing, so linting scanned `node_modules`). Vendor code is
split into `vendor-react`, `vendor-gsap` and `vendor-motion` chunks in `vite.config.ts`.

## Content accuracy

- Resume facts (dates, GPA, titles, project scope, tools, metrics, skills,
  coursework) follow the current resume PDF. Where a project's case study adds
  detail beyond the resume, it comes from material supplied for that project.
- Projects are ordered: Mobile Application Penetration Tester, SOC Log
  Analyzer, Splunk Enterprise SIEM & Threat Intel Lab, EdTech Platform
  Development. ThreatBlueprint and WasteWise are not on the current resume, so they
  sit in a compact "Additional projects" row, text only.
- Case-study sections (impact, mitigation, takeaway) are optional in the data
  and are left out wherever the resume gives no basis for them.
- The ThreatBlueprint project has no cover image, and its description names no
  specific social media product.
- **The Mobile Application Penetration Tester project deliberately omits
  the hospital's real name and does not reproduce technical evidence
  screenshots.** Those would expose a live API domain, real JWT payloads, and an
  exposed email address of a named, presumably still-operational hospital
  system, which is not appropriate for a public, search-indexable portfolio.
  Its visual is an abstract severity bar drawn from the real finding counts
  (1 High, 2 Medium, 3 Low).
- The Leadership section (organization roles, certificates, photos, and
  "Other events and recognition") is content-locked. Its text is unchanged apart
  from replacing em dashes in five captions and labels with colons.
- ICPC Asia Jakarta 2025 and Codeavour 7.0 are shown as photo evidence
  only, with no invented title, date, or responsibilities.
- The HILET "2nd Place: Best Noble, House Highspire" recognition is shown under
  SESVENT 2025 using the wording on the award slide, since it differs from
  "Best Mentor Award."
- The EdTech case-study screenshots mention "22 math topics" while the
  resume says "30+". The resume's figure is used on the site.
- Copy style: no em dashes anywhere in the site, and no third-party brand
  names in project descriptions beyond the tools actually used.

## Accessibility & performance

- Skip-to-content link, semantic landmarks and headings, full keyboard support, a visible
  2px focus ring on every control in both themes, `aria-current` on the active nav link and
  dock item, and a mobile menu whose closed links are `inert`. External links announce
  "opens in a new tab"; resume links announce "PDF download". The case-study dialog and
  image lightbox share one focus-trapped, Escape-to-close dialog that returns focus to its trigger.
- Text contrast was measured in both themes in a real browser (every text node against its
  composited background): all 341 meet WCAG AA (4.5:1, or 3:1 for large text). The ends of
  the heading gradients are 7.8:1 (Aqua) and 4.9:1 (Orchid) on Abalone, and 10.7:1 (Blende)
  and 10.4:1 (Gold) on Oblivion.
- Severity is never colour alone: each badge prints High, Medium or Low.
- The copy-email control announces its result through a live region.
- Auto-moving content has a way out (marquee pause button; the rotating text stops after
  one pass) and a static equivalent under reduced motion.
- The case-study modal, the lightbox and the Aurora background are code-split (`React.lazy`).
- Photos and certificates are optimized WebP, lazy-loaded below the fold, and sit in
  fixed-aspect frames so nothing shifts as they load.
- `viewport-fit=cover` + `env(safe-area-inset-*)` so the fixed header clears notches.
- A link such as `/#contact` opens at that section (`useHashScroll`), even though the page
  renders on the client.
- Bundle: the app chunk is about 157 kB (52 kB gzipped). The animation libraries add
  `vendor-gsap` (121 kB, 48 kB gzipped) and `vendor-motion` (150 kB, 50 kB gzipped) next to
  `vendor-react` (211 kB, 66 kB gzipped). All of it is cached separately from the app code.
  Before the redesign the single bundle was about 281 kB (88 kB gzipped).
