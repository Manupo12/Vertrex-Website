"use client";
import React, { createContext, useContext, useState } from 'react';

type OSContext = { projectId?: string; setProjectId: (id?: string) => void };

const Context = createContext<OSContext | undefined>(undefined);

export function OSProvider({ children }: { children: React.ReactNode }) {
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  return <Context.Provider value={{ projectId, setProjectId }}>{children}</Context.Provider>;
}

export function useOSContext() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useOSContext must be used within OSProvider');
  return ctx;
}
