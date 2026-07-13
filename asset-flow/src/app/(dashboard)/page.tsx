"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Boxes, CalendarDays, Users, Wrench, ArrowRight, LayoutDashboard, FileClock, ShieldCheck } from "lucide-react";

const ExecutiveDashboard = dynamic(() => import("@/components/executive-dashboard"), { ssr: false });

const quickLinks = [
  {
    href: "/assets",
    label: "Assets",
    description: "Manage all equipment",
    icon: Boxes,
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    border: "border-indigo-100 dark:border-indigo-900/40",
  },
  {
    href: "/bookings",
    label: "Bookings",
    description: "Schedule resources",
    icon: CalendarDays,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    border: "border-amber-100 dark:border-amber-900/40",
  },
  {
    href: "/allocations",
    label: "Allocations",
    description: "Track assignments",
    icon: Users,
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    border: "border-emerald-100 dark:border-emerald-900/40",
  },
  {
    href: "/maintenance",
    label: "Maintenance",
    description: "Monitor work orders",
    icon: Wrench,
    color: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    border: "border-rose-100 dark:border-rose-900/40",
  },
  {
    href: "/employees",
    label: "Employees",
    description: "Manage your team",
    icon: Users,
    color: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    border: "border-violet-100 dark:border-violet-900/40",
  },
  {
    href: "/audit",
    label: "Audit Logs",
    description: "Full audit history",
    icon: FileClock,
    color: "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
    border: "border-sky-100 dark:border-sky-900/40",
  },
  {
    href: "/notifications",
    label: "Notifications",
    description: "View alerts",
    icon: ShieldCheck,
    color: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    border: "border-orange-100 dark:border-orange-900/40",
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Analytics & exports",
    icon: LayoutDashboard,
    color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-700",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 px-2 pb-12">
      {/* Quick Navigation */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Quick Navigation
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex flex-col items-center gap-2 rounded-2xl border ${link.border} bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${link.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{link.label}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{link.description}</p>
                </div>
                <ArrowRight className="h-3 w-3 text-slate-300 transition group-hover:text-slate-500 dark:text-slate-600" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Executive Dashboard with all KPIs and charts */}
      <ExecutiveDashboard />
    </div>
  );
}
