import MyDayWorkspaceScreen from "@/components/os/my-day-workspace-screen";
import { getRecentBusinessEvents } from "@/lib/ops/business-event-service";
import { getWorkspaceSnapshot } from "@/lib/ops/workspace-service";

export default async function MyDayPage() {
  const [workspaceSnapshot, businessEvents] = await Promise.all([
    getWorkspaceSnapshot(),
    getRecentBusinessEvents({ limit: 14 }),
  ]);

  return <MyDayWorkspaceScreen workspaceSnapshot={workspaceSnapshot} businessEvents={businessEvents} />;
}
