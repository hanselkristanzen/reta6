import { useEffect, useState } from "react";

/**
 * Which section the visitor is reading: the last one whose top edge has passed a line 35% down the
 * viewport (or the final one once the page is scrolled to its end, since a short last section may
 * never reach that line). Driven by a passive scroll listener throttled to one read per frame,
 * which is cheap for a handful of sections and, unlike an observer ranked by visible ratio, does not
 * flip between neighbours of very different heights.
 */
export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? "");

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      let current = sectionIds[0] ?? "";
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      }
      if (atEnd) current = sectionIds[sectionIds.length - 1] ?? current;
      setActiveId(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionIds]);

  return activeId;
}
