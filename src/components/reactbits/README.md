# React Bits components

These files are from [React Bits](https://github.com/DavidHDev/react-bits)
(`src/ts-tailwind`, the TypeScript + Tailwind variant), by David Haz. React Bits is licensed
MIT with the Commons Clause; the licence text is in [LICENSE.md](./LICENSE.md).

React Bits is copy-in source, not an npm package, so each component here is a modified copy
and is no longer interchangeable with a fresh copy from upstream. The header comment at the
top of every file lists what was kept and what was changed. They are reproduced below so the
differences can be reviewed in one place.

Shared changes: colours come from the site's palette instead of upstream defaults; motion
uses the site's ease-out curve; `prefers-reduced-motion` is handled; effects that need a
hovering pointer are mouse-only; loops pause when off screen; listeners, timers and frame
loops are cleaned up; animated text is `aria-hidden` and the real text is exposed once.

Dependencies: `gsap`, `@gsap/react`, `motion` and `ogl` (Aurora only).

## AnimatedContent

AnimatedContent, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/AnimatedContent).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- Starts through `onceInView` instead of ScrollTrigger, so content scrolled past before it rendered
  (deep link, then scroll up) is shown rather than left hidden.
- The hidden state is `opacity: 0`, not `visibility: hidden`: the content stays in the tab order, and
  focusing it scrolls it into view, which reveals it.
- Quieter defaults (a 28px rise, not 100px), an optional `blur`, and a 55ms-step-friendly `delay` in seconds.
- When the tween finishes the inline transform, opacity and filter are cleared. A leftover
  `transform` would make this element the containing block for fixed descendants and block
  `position: sticky` and later hover transforms.
- `prefers-reduced-motion`: the content is simply shown.
- The `disappearAfter` options are dropped (nothing here needs content to leave again).

## Aurora

Aurora, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Backgrounds/Aurora).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- Frames are drawn only while the section is on screen (an IntersectionObserver), and the colour uniform is rebuilt only when the colours change (the original allocated new colour objects every frame).
- `prefers-reduced-motion`: one still frame, no loop.
- Loaded lazily by the page, so `ogl` stays out of the main bundle. Colours are hex palette values.

## BlurText

BlurText, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/BlurText).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- Starts through `onceInView`, so text already scrolled past is shown rather than left blurred.
- `startDelay` sequences it inside the hero intro.
- `prefers-reduced-motion`: plain text, no animation.
- Words are `aria-hidden` pieces of a paragraph that carries the full text as its label, so a
  screen reader reads one sentence rather than one word at a time.

## ClickSpark

ClickSpark, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/ClickSpark).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- The animation loop runs only while sparks exist. The original redrew an empty canvas on every
  frame for the life of the page.
- The canvas extends past its wrapper by the spark radius, so a spark at a button's edge is not clipped,
  and it is drawn at device pixel ratio.
- A keyboard-initiated click (no pointer position) sparks from the middle of the clicked element.
- `sparkColor` may be a CSS variable of the palette (resolved when the click happens, so it follows the theme).
- `prefers-reduced-motion`: no sparks.
- `className` on the wrapper, instead of a forced `w-full h-full`.

## CountUp

CountUp, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/CountUp).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- `prefix` and `suffix` (for "94%" or "150+") that are part of the same readout.
- The animated digits are `aria-hidden`; the final value is exposed once as plain text, so a
  screen reader does not announce every intermediate number.
- `prefers-reduced-motion`: the final value is shown at once.
- A timed ease-out tween (`animate`) instead of upstream's `useSpring`. The spring's damping is high
  enough that it creeps toward the target for several seconds, so a figure such as a GPA of 3.51 read
  "3.50" long after the count looked finished. The tween lands on the exact value when `duration` ends.

## DecryptedText

DecryptedText, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/DecryptedText).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- `prefers-reduced-motion`: plain text, no scrambling.
- The screen-reader copy of the text was `visibility: hidden`, which hides it from assistive technology too; that line is removed.

## Dock

Dock, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Components/Dock).
MIT + Commons Clause, see ./LICENSE.md.

Kept from upstream: the magnification model (cosine falloff over `distance`), the damped-spring
integration that drives each icon's size, the `fit` scaling that shrinks the whole dock to the
space it has, the tooltip labels, the active dot and arrow / Home / End keyboard movement.

Changes for this site:
- Items are links (`href`) so they are real anchors: they work without script, show the target
  in the status bar and take the page's smooth anchor scroll. `aria-current` marks the active one.
- Colours come from the site's role tokens (`--c-*`) instead of the upstream dark/light hex maps,
  so the dock follows the theme switch with no `theme` prop.
- Removed features this page does not use: context menus and long-press, the click "hop"
  (the brief asks for no excessive bounce), count badges and auto-hide. Roughly 600 lines go with them.
- New `hidden` prop: the page shows the dock only once the visitor has scrolled past the hero.
  While hidden the dock is `inert`, so it cannot take focus.
- Magnification follows a real mouse only, and is off under `prefers-reduced-motion`. Hover
  labels only exist on hover-capable pointers.
- The animation loop sleeps when every icon is at rest, and the window listeners are removed on unmount.

## FadeContent

FadeContent, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/FadeContent).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- Starts through `onceInView` instead of ScrollTrigger (see AnimatedContent).
- Hidden with `opacity: 0` rather than `autoAlpha`, so the content stays focusable.
- `duration` and `delay` are in seconds only (the original guessed units from the size of the number).
- Inline opacity and filter are cleared after the fade.
- `prefers-reduced-motion`: the content is simply shown.

## GlareHover

GlareHover, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/GlareHover).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- Sized and styled by `className` (the original forced a 500x500 grid cell with its own
  background and border props), so it can wrap a photo or a card of any size.
- Only a real mouse triggers it (`hover: hover` and `pointer: fine`); a tap on a touch screen
  does not leave the glare stuck.
- The glare is a `background-position` transition on a `pointer-events: none` overlay.
- `prefers-reduced-motion`: no glare.

## GradientText

GradientText, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/GradientText).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- Unmodified apart from this header. It already honours `prefers-reduced-motion` and stops its loop off screen.
- Colours are passed as CSS variables of the site palette (`var(--gt-a)` and so on, defined per theme in index.css).

## LogoLoop

LogoLoop, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/LogoLoop).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- No animation frames while the loop is off screen (an IntersectionObserver switches the loop off and on).
- `paused` prop, so the page can offer a visible pause control for the moving content.
- The fade colour is passed in by the caller as a palette token (`fadeOutColor`).
- Reduced motion (static) and pause on hover are the upstream implementation; the page also swaps in a wrapped list under reduced motion so every item stays reachable.

## MagicBento

MagicBento, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Components/MagicBento).
MIT + Commons Clause, see ./LICENSE.md.

Kept from upstream: the proximity glow that follows the cursor across the whole grid (per-card
`--glow-x/--glow-y/--glow-intensity` driven by distance to the card), the glowing border ring,
the drifting star particles on hover, the small magnetic pull and the click ripple.

Changes for this site:
- Data-driven: it takes `cards` with real content (a grid of skill groups) instead of the demo
  `cardData`, and the grid layout is set by the caller through each card's `className`.
- Colours are the site's role tokens plus a `glowColor` "r, g, b" triple for the rings and stars,
  so the section follows the light and dark themes. The upstream purple palette and its inline
  <style> block (hard-coded greys and purples) are gone; the styles live in index.css (.bento-*).
- The 800px fixed spotlight element that blends with `mix-blend-mode: screen` is removed: it is
  invisible on a light page. The same effect is carried by the in-card radial glow.
- Everything cursor-driven runs for a real mouse only (`hover: hover` and `pointer: fine`) and not
  under `prefers-reduced-motion`; touch and reduced-motion visitors get a still, fully readable grid.
- The pointer listener is one rAF-throttled `pointermove` on the window that only works while the
  grid is on screen (IntersectionObserver); particles start from a small scale, not from zero, and
  are removed on leave and on unmount.
- Cards are keyboard-reachable only when the caller makes their content interactive; the card
  itself is a plain `<li>` with a heading, so the effect never traps focus.

## Magnet

Magnet, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/Magnet).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- No React state on pointer move. The original called `setPosition` with a new object on every
  mouse move of every Magnet on the page, re-rendering them all. The pointer is read in a
  requestAnimationFrame and written straight to `style.transform`.
- Listens only while the element is on screen, and only for a real mouse (`hover: hover` and
  `pointer: fine`). Touch and keyboard users get the plain button.
- `prefers-reduced-motion`: no movement.
- Ease-out curves from the site's motion tokens: a quick pull in, a slightly slower release.

## PixelTransition

PixelTransition, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Animations/PixelTransition).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- A `label` prop names the interactive area (the root is focusable and acts as a group or a button).
- Sized by the caller (`w-full`, themed radius) instead of a fixed 300px box.
- Reduced motion (instant swap), touch (tap to toggle), keyboard focus and the canvas drawing are the upstream implementation.

## RotatingText

RotatingText, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/RotatingText).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- The `layout` props are gone: they animated the text box with a scale transform, which distorts
  letters. The rotating word sits at the end of its line, so nothing needs to move around it.
- Rotation pauses while the element is off screen or the tab is hidden, and (with `loop={false}`)
  stops on the last item, so automatically changing text never runs indefinitely (WCAG 2.2.2).
- The complete list is exposed once as plain text; the animated characters are `aria-hidden`.
- `prefers-reduced-motion`: no rotation; the first item is shown, and the full list is still in
  the accessible text.

## ScrollFloat

ScrollFloat, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/ScrollFloat).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- Scoped to this element with `useGSAP` (the original never cleaned its ScrollTrigger up).
- Renders any heading tag (`as`) with the full text as its accessible label, and the characters
  `aria-hidden`, so a heading is announced once and whole.
- `accent`: a trailing part of the title painted with the theme gradient, one continuous gradient
  across its characters (see `@/lib/charGradient`).
- Words are wrapped, so a long title breaks between words, never inside one.
- Gentler defaults for a heading (power3.out, a shorter scroll span), and a bottom pad so the
  overflow mask does not clip descenders.
- `prefers-reduced-motion`: the heading is static.

## ScrollReveal

ScrollReveal, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/ScrollReveal).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- Scoped to this element with `useGSAP`. The original cleanup called `ScrollTrigger.getAll().kill()`,
  which would also kill every other component's triggers.
- One scrubbed timeline drives opacity and blur together instead of two tweens.
- Renders a `<p>` (the original put a `<p>` inside an `<h2>`), and the rotation is optional (off).
- Blur is small (3px) and applies only while the paragraph crosses the viewport.
- `prefers-reduced-motion`: the paragraph is shown fully legible, with no scroll effect.

## ShapeGrid

ShapeGrid, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Backgrounds/ShapeGrid).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- The built-in dark vignette (a hard-coded purple) is removed; the page fades the grid with a CSS mask in its own palette instead.
- The grid can be still (`speed` 0, and always still under reduced motion), and it then draws only while the pointer is moving over it, rather than every frame.
- Hover is read from the window, because the grid sits behind the hero content and would otherwise never receive the pointer.
- The off-screen and hidden-tab pause is the upstream implementation. Colours must be literal (canvas cannot read CSS variables).

## ShinyText

ShinyText, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/ShinyText).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- `prefers-reduced-motion` disables the sweep (the text keeps its base colour).
- Colours must be literal (hex or rgb): the component parses them with a canvas, which cannot resolve CSS variables.
- Everything else, including the pause while off screen, is the upstream implementation.

## SplitText

SplitText, from React Bits (DavidHDev/react-bits, src/ts-tailwind/TextAnimations/SplitText).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- GSAP plugins come from the shared registration in `@/lib/gsap`.
- The reveal waits for an IntersectionObserver (`onceInView`) instead of a ScrollTrigger, so a
  heading that was scrolled past before it rendered (deep link, then scroll up) still appears.
- The text stays hidden until the web font is ready and the split is done, so there is no flash of
  unsplit text; a 1.5s timeout keeps a slow font from hiding it for good.
- `gradient` gives each character its slice of one continuous gradient (see `@/lib/charGradient`).
- `prefers-reduced-motion`: the text is split (so the gradient still works) but never animated.
- The wrapper no longer clips (`overflow-hidden` cut descenders at tight line heights).

## SpotlightCard

SpotlightCard, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Components/SpotlightCard).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- Radius and padding are no longer baked in (`rounded-3xl p-8`), so a call site sets its own without fighting a utility.
- Off-screen cards ignore pointer moves, so a page full of cards does not recompute geometry for every one of them.
- Surface, border and shadow come from the site's role tokens (set through the CSS variables the component reads); the spotlight colour is a palette colour.
- Reduced motion, focus-visible handling and the tap-and-hold flare are the upstream implementation.

## TiltedCard

TiltedCard, from React Bits (DavidHDev/react-bits, src/ts-tailwind/Components/TiltedCard).
MIT + Commons Clause, see ./LICENSE.md.

Changes for this site:
- Takes `children` as well as `imageSrc`, so the tilt can carry a whole card (photo and details),
  not only a single image. The tilt maths and spring settings are the upstream ones.
- Sized by the caller (`className`) instead of fixed pixel props.
- The cursor tooltip and the "not optimized for mobile" notice are removed. Tilt follows a real mouse
  only (`pointerType === "mouse"`, `hover: hover` and `pointer: fine`); touch visitors drag the
  badge instead (see HeroBadge).
- Pointer position is no longer kept in React state, so moving the mouse does not re-render.
- `prefers-reduced-motion`: no tilt.
