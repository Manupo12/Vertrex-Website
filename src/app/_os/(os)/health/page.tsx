import HealthWorkspaceScreen from "@/components/os/health-workspace-screen";
import { buildWorkspaceHealthSnapshot } from "@/lib/ops/workspace-health";
import { getWorkspaceSnapshot } from "@/lib/ops/workspace-service";

export default async function HealthPage() {
  const workspaceSnapshot = await getWorkspaceSnapshot();
  const healthSnapshot = buildWorkspaceHealthSnapshot(workspaceSnapshot);

  return <HealthWorkspaceScreen snapshot={healthSnapshot} />;
}
