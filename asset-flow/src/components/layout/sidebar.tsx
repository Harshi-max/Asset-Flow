import Link from "next/link";
import { Boxes, FileText, LayoutDashboard, Settings, ShieldCheck } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/assets", label: "Assets", icon: Boxes },
  { href: "/bookings", label: "Bookings", icon: FileText },
  { href: "/allocations", label: "Allocations", icon: ShieldCheck },
  { href: "/organizations", label: "Organizations", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-[linear-gradient(180deg,_#0f172a_0%,_#111827_100%)] p-6 text-slate-100 lg:flex dark:border-slate-800">
      <div className="mb-10 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">AssetFlow</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">Enterprise Control Center</h2>
        <p className="mt-2 text-sm text-slate-400">Premium operations workspace</p>
      </div>

      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
        <p className="font-semibold">Secure and local-first</p>
        <p className="mt-1 text-emerald-100/80">All workflows stay fast and private.</p>
      </div>
    </aside>
  );
}
