import FadeContent from "@/components/reactbits/FadeContent";
import { profile } from "@/data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-bg pt-8 pb-10 md:pb-28">
      <FadeContent>
        <div className="container-page flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-2">
            © {year} {profile.fullName}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="type-meta">
              {profile.program} Student · {profile.university}
            </p>
            <a href="#home" className="press-feedback py-2 font-medium text-ink-2 can-hover:text-ink">
              Back to top
            </a>
          </div>
        </div>
      </FadeContent>
    </footer>
  );
}
