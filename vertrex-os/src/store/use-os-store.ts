"use client";

import { useSyncExternalStore } from "react";

type OSState = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const listeners = new Set<() => void>();
let sidebarOpen = true;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emit = () => {
  listeners.forEach((listener) => listener());
};

const setSidebarOpen = (open: boolean) => {
  sidebarOpen = open;
  emit();
};

export function useOSStore<T>(selector: (state: OSState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector({ sidebarOpen, setSidebarOpen }),
    () => selector({ sidebarOpen, setSidebarOpen }),
  );
}
