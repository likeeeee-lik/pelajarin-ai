import Link from "next/link";
import { LogoWordmark } from "@/components/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink-500/40 bg-ink-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <LogoWordmark />
          <p className="mt-3 max-w-xs text-sm text-muted">
            Platform belajar AI untuk siswa.
          </p>
          <a href="https://discord.gg" className="mt-3 inline-block text-sm font-semibold text-brand">
            Gabung Discord →
          </a>
        </div>

        <FooterCol
          title="PRODUK"
          links={[
            { href: "/harga", label: "Harga" },
            { href: "/harga", label: "Institusi" },
            { href: "#", label: "Karier" },
          ]}
        />
        <FooterCol
          title="LEGAL"
          links={[
            { href: "#", label: "Pengembalian Dana" },
            { href: "#", label: "Ketentuan" },
            { href: "#", label: "Privasi" },
          ]}
        />

        <div className="text-sm text-muted">
          <p className="font-semibold text-white">CV Triputra Consulting</p>
          <p className="mt-1">AKR Tower LT 16A, Kebun Jeruk</p>
          <p>Jakarta Barat, DKI Jakarta, 11510</p>
          <p className="mt-3">
            Email:{" "}
            <a href="mailto:support@pelajarin.ai" className="text-brand">
              support@pelajarin.ai
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-ink-500/40 py-5 text-center text-xs text-muted">
        © 2026 Pelajarin.ai · Didukung oleh dewaweb
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-bold tracking-wider text-muted">{title}</p>
      <ul className="mt-3 flex flex-col gap-2 text-sm">
        {links.map((l, i) => (
          <li key={i}>
            <Link href={l.href} className="text-white/80 transition hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
