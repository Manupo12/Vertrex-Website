"use client";

import AssetsWorkspaceScreen from "@/components/os/assets-workspace-screen";
import { useUIStore } from "@/lib/store/ui";

export default function AssetsPage() {
  const open = useUIStore((store) => store.open);
  return <AssetsWorkspaceScreen open={open} />;
}