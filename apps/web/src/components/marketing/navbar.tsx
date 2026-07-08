import Link from "next/link";
import { LogoWordmark } from "@/components/logo";

const LINKS = [
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#fitur", label: "Fitur" },
  { href: "/harga", label: "Harga" },
  { href: "/#faq", label: "FAQ" },
];

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-500/40 bg-ink-900/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/">
          <LogoWordmark />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-lg border border-ink-500 px-2.5 py-1 text-xs text-muted sm:inline">
            ID
          </span>
          <Link
            href="/masuk"
            className="rounded-2xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-brand transition hover:bg-brand-600"
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
}
