import { createContext, lazy, Suspense, useContext, useMemo, useState, type ReactNode } from "react";
import type { MediaItem } from "@/types/portfolio";

const Lightbox = lazy(() => import("@/components/ui/Lightbox").then((mod) => ({ default: mod.Lightbox })));

const LightboxContext = createContext<((item: MediaItem) => void) | null>(null);

export function useLightbox(): (item: MediaItem) => void {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return context;
}

/** Mounts a single (lazily-loaded) Lightbox instance for the whole page; any section can open it via useLightbox(). */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<MediaItem | null>(null);
  const openLightbox = useMemo(() => (next: MediaItem) => setItem(next), []);

  return (
    <LightboxContext.Provider value={openLightbox}>
      {children}
      <Suspense fallback={null}>
        <Lightbox item={item} onClose={() => setItem(null)} />
      </Suspense>
    </LightboxContext.Provider>
  );
}
