import {
  FileSearch,
  Flame,
  Folder,
  Home,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Exact match untuk menandai aktif (default: startsWith). */
  exact?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/app", label: "Dashboard", icon: Home, exact: true },
  { href: "/app/mata-pelajaran", label: "Mata Pelajaran", icon: Folder },
  { href: "/app/latihan-soal", label: "Latihan Soal", icon: FileSearch },
  { href: "/app/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/app/streaks", label: "Streaks", icon: Flame },
];

export function isActive(pathname: string, item: NavItem): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}
