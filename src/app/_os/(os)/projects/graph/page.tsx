import { EmptyWorkspacePanel } from "@/components/os/workspace-ui";

export default function ProjectGraphPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <EmptyWorkspacePanel
        title="Vista de Grafo no disponible"
        description="Esta vista está en desarrollo. Usa la vista de tablero para gestionar tareas."
      />
    </div>
  );
}