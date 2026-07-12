import Link from "next/link";
import { LayoutDashboard, Boxes, Settings, ShieldCheck, FileText } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/assets", label: "Assets", icon: Boxes },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/security", label: "Security", icon: ShieldCheck },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 flex-col border-r border-border bg-slate-950/95 p-6 text-slate-100 lg:flex">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">AssetFlow</p>
        <h2 className="mt-2 text-xl font-semibold">Enterprise Control Center</h2>
      </div>
      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
