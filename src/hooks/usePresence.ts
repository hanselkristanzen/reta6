import { useEffect, useState } from "react";

/**
 * Keeps something mounted for `exitMs` after `isOpen` turns false, so it can play an exit
 * animation instead of vanishing. `closing` is true during that window.
 */
export function usePresence(isOpen: boolean, exitMs: number) {
  const [lingering, setLingering] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setLingering(true);
      return;
    }
    const timer = window.setTimeout(() => setLingering(false), exitMs);
    return () => window.clearTimeout(timer);
  }, [isOpen, exitMs]);

  return { mounted: isOpen || lingering, closing: !isOpen && lingering };
}

/**
 * The latest non-null value. A dialog's content is derived from "the open item"; this keeps
 * that content on screen while the dialog plays its exit animation after the item is cleared.
 */
export function useLastDefined<T>(value: T | null): T | null {
  const [last, setLast] = useState<T | null>(value);
  if (value !== null && value !== last) setLast(value);
  return value ?? last;
}
