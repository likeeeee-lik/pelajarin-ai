"use client";

import { useState } from "react";
import { Check, Crown } from "lucide-react";

type Billing = "bulanan" | "6bulan" | "tahunan";

const BILLING: { value: Billing; label: string; badge?: string }[] = [
  { value: "bulanan", label: "Bulanan" },
  { value: "6bulan", label: "6 Bulan", badge: "-20%" },
  { value: "tahunan", label: "Tahunan", badge: "-50%" },
];

const PRO_PRICE: Record<Billing, { perBulan: string; total: string }> = {
  bulanan: { perBulan: "60.000", total: "Ditagih bulanan" },
  "6bulan": { perBulan: "48.000", total: "Rp 288.000 / 6 bulan" },
  tahunan: { perBulan: "30.000", total: "Rp 360.000 / tahun" },
};

const FREE_FEATURES = [
  "Catatan terbatas",
  "Flashcards & Quiz unlimited",
  "Chat AI terbatas",
  "Video & audio processing terbatas",
  "Basic support",
];
const PRO_FEATURES = [
  "Unlimited catatan",
  "Flashcards & Quiz unlimited",
  "Unlimited chat AI",
  "Unlimited video processing",
  "Unlimited audio processing",
  "Priority support tertinggi",
];
const INST_FEATURES = [
  "Unlimited semua fitur",
  "Custom integration",
  "Dedicated support",
  "Analytics & reporting",
  "Custom jumlah pelajar",
];

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("tahunan");
  const pro = PRO_PRICE[billing];

  return (
    <div className="flex flex-col items-center">
      {/* toggle */}
      <div className="flex rounded-2xl border border-ink-500/70 bg-ink-700/50 p-1">
        {BILLING.map((b) => (
          <button
            key={b.value}
            type="button"
            onClick={() => setBilling(b.value)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              billing === b.value ? "bg-ink-500 text-white" : "text-muted hover:text-white"
            }`}
          >
            {b.label}
            {b.badge ? (
              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                {b.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-8 grid w-full gap-5 lg:grid-cols-3">
        {/* Free */}
        <Plan name="Free" tagline="Cocok untuk belajar dasar">
          <p className="text-4xl font-extrabold">Gratis</p>
          <CtaButton variant="surface">Mulai Gratis</CtaButton>
          <FeatureList items={FREE_FEATURES} />
        </Plan>

        {/* Pro */}
        <Plan name="Pro" tagline="Unlimited untuk profesional" featured>
          <p className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold">Rp {pro.perBulan}</span>
            <span className="text-muted">/ bulan</span>
          </p>
          <p className="text-sm text-emerald-400">{pro.total}</p>
          <CtaButton variant="brand">Upgrade ke Pro</CtaButton>
          <FeatureList items={PRO_FEATURES} />
        </Plan>

        {/* Institusi */}
        <Plan name="Institusi" tagline="Solusi perusahaan atau institusi untuk bulk pelajar">
          <p className="text-4xl font-extrabold">Custom</p>
          <CtaButton variant="surface">Hubungi Sales</CtaButton>
          <FeatureList items={INST_FEATURES} />
        </Plan>
      </div>
    </div>
  );
}

function Plan({
  name,
  tagline,
  featured,
  children,
}: {
  name: string;
  tagline: string;
  featured?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex flex-col gap-4 rounded-xl2 border p-6 ${
        featured ? "border-brand bg-ink-600/60" : "border-ink-500/70 bg-ink-600/40"
      }`}
    >
      {featured ? (
        <span className="absolute -top-3 left-6 flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
          <Crown className="h-3.5 w-3.5" /> Terpopuler
        </span>
      ) : null}
      <div>
        <h3 className={`text-xl font-extrabold ${featured ? "text-brand" : ""}`}>{name}</h3>
        <p className="text-sm text-muted">{tagline}</p>
      </div>
      {children}
    </div>
  );
}

function CtaButton({
  variant,
  children,
}: {
  variant: "brand" | "surface";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`rounded-2xl px-5 py-3 font-bold transition ${
        variant === "brand"
          ? "bg-brand text-white shadow-brand hover:bg-brand-600"
          : "border border-ink-500 text-white hover:bg-ink-600"
      }`}
    >
      {children}
    </button>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 flex flex-col gap-2.5 text-sm">
      {items.map((f) => (
        <li key={f} className="flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0 text-brand" />
          {f}
        </li>
      ))}
    </ul>
  );
}
