"use client";

import { Check } from "lucide-react";
import type { SelectOption } from "@/lib/onboarding/types";

export function SingleSelect({
  options,
  value,
  onChange,
}: {
  options: SelectOption[];
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const selected = value === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${
              selected
                ? "border-brand bg-brand/10 text-brand"
                : "border-ink-500/70 bg-ink-700/50 text-white hover:border-ink-500"
            }`}
          >
            {Icon ? (
              <Icon className={`h-6 w-6 shrink-0 ${selected ? "text-brand" : "text-muted"}`} />
            ) : null}
            <span className="flex-1">
              <span className="block font-semibold">{opt.label}</span>
              {opt.sublabel ? (
                <span className={`block text-sm ${selected ? "text-brand/80" : "text-muted"}`}>
                  {opt.sublabel}
                </span>
              ) : null}
            </span>
            {selected ? <Check className="h-5 w-5 shrink-0 text-brand" /> : null}
          </button>
        );
      })}
    </div>
  );
}
