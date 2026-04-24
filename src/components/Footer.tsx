import Logo from "./Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Logo size="sm" />
          <div className="flex flex-col gap-1 text-xs text-zinc-500 sm:flex-row sm:gap-6 sm:text-sm">
            <a
              href="mailto:info@blitzmailer.ai"
              className="transition-colors hover:text-zinc-300"
            >
              info@blitzmailer.ai
            </a>
            <a
              href="tel:+14697085988"
              className="transition-colors hover:text-zinc-300"
            >
              1-469-708-5988
            </a>
            <span>© {year} Blitzmailer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
