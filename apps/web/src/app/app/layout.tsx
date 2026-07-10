import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLogtoContext } from "@logto/next/server-actions";
import { AppShell } from "@/components/app/app-shell";
import { SESSION_COOKIE } from "@/lib/auth-cookie";
import { logtoConfig } from "@/lib/logto";

const MODE = process.env.NEXT_PUBLIC_AUTH_MODE ?? "stub";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Gate area app. Mode "stub" dilewati (dev).
  if (MODE === "local") {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) redirect("/masuk");
  } else if (MODE === "logto") {
    const { isAuthenticated } = await getLogtoContext(logtoConfig);
    if (!isAuthenticated) redirect("/api/logto/sign-in");
  }
  return <AppShell>{children}</AppShell>;
}
