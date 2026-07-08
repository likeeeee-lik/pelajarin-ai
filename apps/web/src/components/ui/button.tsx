import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "brand" | "surface" | "ghost" | "black";

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  brand:
    "bg-brand text-white shadow-brand hover:bg-brand-600 active:translate-y-px",
  surface:
    "bg-ink-600 text-white border border-ink-500 hover:bg-ink-500/70",
  ghost: "text-brand hover:text-brand-400",
  black: "bg-black text-white hover:bg-black/85",
};

export function Button({
  variant = "brand",
  className = "",
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & ComponentProps<"button">) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "brand",
  className = "",
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & ComponentProps<typeof Link>) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
