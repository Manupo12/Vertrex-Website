"use client";
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside style={{ width: 220, padding: 16, borderRight: '1px solid #e5e7eb' }}>
      <div style={{ marginBottom: 12, fontWeight: 700 }}>Vertrex OS</div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: 8 }}>
            <Link href="/">Dashboard</Link>
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/(os)/projects">Projects</Link>
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/(os)/crm">CRM</Link>
          </li>
          <li style={{ marginBottom: 8 }}>
            <Link href="/(os)/settings">Settings</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
