import { EmptyWorkspacePanel } from "@/components/os/workspace-ui";

export default function ProjectDetailPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background animate-fade-in">
      <EmptyWorkspacePanel
        title="Detalle de proyecto"
        description="Selecciona un proyecto desde el tablero para ver su detalle completo."
      />
    </div>
  );
}