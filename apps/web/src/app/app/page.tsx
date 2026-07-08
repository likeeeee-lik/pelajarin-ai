import { Greeting } from "@/components/app/dashboard/greeting";
import { StatCards } from "@/components/app/dashboard/stat-cards";
import { CreateBar } from "@/components/app/dashboard/create-bar";
import { StartEmpty } from "@/components/app/dashboard/start-empty";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <Greeting />
      <StatCards />
      <CreateBar />
      <StartEmpty />
    </div>
  );
}
