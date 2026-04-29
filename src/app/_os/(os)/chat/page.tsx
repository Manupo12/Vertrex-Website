"use client";

import { useUIStore } from "@/lib/store/ui";
import ChatWorkspaceScreen from "@/components/os/chat-workspace-screen";

export default function ChatPage() {
  const open = useUIStore((store) => store.open);
  return <ChatWorkspaceScreen />;
}