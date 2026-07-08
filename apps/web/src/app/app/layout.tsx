import { redirect } from "next/navigation";
import { getLogtoContext } from "@logto/next/server-actions";
import { AppShell } from "@/components/app/app-shell";
import { logtoConfig } from "@/lib/logto";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Gate area app saat memakai Logto. Di mode "stub" dilewati (dead-code
  // dieliminasi karena NEXT_PUBLIC_AUTH_MODE di-inline saat build).
  if (process.env.NEXT_PUBLIC_AUTH_MODE === "logto") {
    const { isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) redirect("/api/logto/sign-in");
  }
  return <AppShell>{children}</AppShell>;
}
