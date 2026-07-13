"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  FileText,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  Bell,
  BarChart3,
  Building2,
  ClipboardList,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/assets", label: "Assets", icon: Boxes },
  { href: "/bookings", label: "Bookings", icon: FileText },
  { href: "/allocations", label: "Allocations", icon: ShieldCheck },
  { href: "/maintenance", label: "Maintenance", icon: Wrench },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/organizations", label: "Organizations", icon: Building2 },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/audit", label: "Audit Logs", icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-slate-200 bg-[linear-gradient(180deg,_#0f172a_0%,_#111827_100%)] p-4 text-slate-100 lg:flex dark:border-slate-800 overflow-y-auto">
      {/* Brand */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-400">AssetFlow</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight">Enterprise Control Center</h2>
        <p className="mt-1 text-xs text-slate-400">Premium operations workspace</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-xs text-emerald-200">
        <p className="font-semibold">Secure & local-first</p>
        <p className="mt-0.5 text-emerald-100/70">All workflows stay fast and private.</p>
      </div>
    </aside>
  );
}
