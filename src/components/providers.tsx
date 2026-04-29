"use client";

import { useEffect, type ReactNode } from "react";

import OSOverlayManager from "@/components/overlays/os-overlay-manager";
import { useUIStore } from "@/lib/store/ui";

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return (
    target.isContentEditable ||
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select"
  );
};

export default function Providers({ children }: { children: ReactNode }) {
  const toggle = useUIStore((store) => store.toggle);
  const closeAll = useUIStore((store) => store.closeAll);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.key === "Escape") {
        closeAll();
        return;
      }

      if (!(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) {
        return;
      }

      const key = event.key.toLowerCase();

      if (key === "k") {
        event.preventDefault();
        toggle("commandCenter");
      }

      if (key === "n") {
        event.preventDefault();
        toggle("omniCreator");
      }

      if (key === "i") {
        event.preventDefault();
        toggle("universalInbox");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAll, toggle]);

  return (
    <>
      {children}
      <OSOverlayManager />
    </>
  );
}