import Link from "next/link";
import type { ReactNode } from "react";
import { LogoWordmark } from "@/components/logo";

/** Kerangka halaman auth: header brand + kartu tengah di atas bg aurora. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <main className="bg-aurora flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <Link href="/">
          <LogoWordmark />
        </Link>
        <ThemeStub />
      </header>

      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className={`w-full ${wide ? "max-w-lg" : "max-w-md"}`}>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-muted">{subtitle}</p>
            ) : null}
          </div>
          {children}
          {footer ? <div className="mt-6 text-center">{footer}</div> : null}
        </div>
      </div>
    </main>
  );
}

/** Placeholder tombol tema (☀️) — fungsional menyusul. */
function ThemeStub() {
  return (
    <button
      type="button"
      aria-label="Ganti tema"
      className="grid h-9 w-9 place-items-center rounded-full border border-ink-500 text-muted transition hover:text-white"
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
