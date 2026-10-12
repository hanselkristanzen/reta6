import { useEffect, useRef, useState } from "react";
import { onceInView } from "@/lib/inView";

/**
 * True once the element has scrolled into view (or has been scrolled past, so a deep link to a later
 * section never leaves it unrevealed). Used to start CSS-driven draws such as the severity bars.
 */
export function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    return onceInView(element, () => setSeen(true));
  }, []);

  return [ref, seen] as const;
}
