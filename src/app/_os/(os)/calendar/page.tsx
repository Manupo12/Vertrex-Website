"use client";

import CalendarWorkspaceScreen from "@/components/os/calendar-workspace-screen";
import { useUIStore } from "@/lib/store/ui";

export default function CalendarPage() {
  const open = useUIStore((store) => store.open);
  return <CalendarWorkspaceScreen open={open} />;
}