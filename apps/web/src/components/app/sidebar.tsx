"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Home, LogOut, Rocket, User } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { signOut } from "@/lib/auth";
import { MOCK_USER } from "@/lib/mock-user";
import { useProfileSettings } from "@/lib/store";
import { NAV_ITEMS, isActive } from "./nav-config";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const profile = useProfileSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const upgradeActive = pathname.startsWith("/app/upgrade");

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-ink-500/50 bg-ink-800/70 p-3 backdrop-blur transition-[width] ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between px-1 py-2">
        {!collapsed && (
          <Link href="/app" className="flex items-center gap-2">
            <LogoMark className="h-7 w-7 text-white" />
            <span className="font-extrabold tracking-tight">pelajarin.ai</span>
          </Link>
        )}
        <button
          type="button"
          onClick={onToggle}
          aria-label="Lipat sidebar"
          className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-ink-600 hover:text-white"
        >
          <ChevronLeft className={`h-5 w-5 transition ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-brand text-white shadow-brand"
                  : "text-muted hover:bg-ink-600 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {/* Tingkatkan Pro (menonjol) */}
        <Link
          href="/app/upgrade"
          title="Tingkatkan Pro"
          className={`mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
            upgradeActive
              ? "bg-brand text-white"
              : "bg-brand/15 text-brand hover:bg-brand/25"
          } ${collapsed ? "justify-center" : ""}`}
        >
          <Rocket className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Tingkatkan Pro</span>}
        </Link>
      </nav>

      {/* User */}
      <div className="relative mt-3">
        {menuOpen && (
          <>
            <button
              type="button"
              aria-hidden
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div className="absolute bottom-full left-0 z-20 mb-2 w-52 overflow-hidden rounded-xl border border-ink-500 bg-ink-700 shadow-xl">
              <div className="border-b border-ink-500 px-4 py-3">
                <p className="truncate font-semibold">{profile.nama}</p>
                <p className="truncate text-xs text-muted">{MOCK_USER.email}</p>
              </div>
              <Link
                href="/app/profil"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white transition hover:bg-ink-600"
              >
                <User className="h-4 w-4" /> Profil
              </Link>
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white transition hover:bg-ink-600"
              >
                <Home className="h-4 w-4" /> Beranda
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-ink-600"
              >
                <LogOut className="h-4 w-4" /> Keluar
              </button>
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className={`flex w-full items-center gap-3 rounded-xl border border-ink-500/60 bg-ink-700/50 p-2.5 text-left transition hover:bg-ink-600 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Avatar name={profile.nama} />
          {!collapsed && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{profile.nama}</span>
              <span className="block truncate text-xs text-muted">{MOCK_USER.email}</span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-600 text-sm font-bold text-white">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
