"use client";
import { ReactNode } from 'react';

export default function Card({ children }: { children: ReactNode }) {
  return <div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>{children}</div>;
}
