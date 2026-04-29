"use client";

import CRMWorkspaceScreen from "@/components/os/crm-workspace-screen";
import { useUIStore } from "@/lib/store/ui";

export default function CRMPage() {
  const open = useUIStore((store) => store.open);
  return <CRMWorkspaceScreen open={open} />;
}