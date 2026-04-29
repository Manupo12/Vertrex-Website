"use client";

import FinanceWorkspaceScreen from "@/components/os/finance-workspace-screen";
import { useUIStore } from "@/lib/store/ui";

export default function FinancePage() {
  const open = useUIStore((store) => store.open);
  return <FinanceWorkspaceScreen open={open} />;
}