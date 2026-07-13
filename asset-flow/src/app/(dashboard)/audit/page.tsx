"use client";

import { useEffect, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Loader2, ShieldCheck, Filter } from "lucide-react";
import { motion } from "framer-motion";

const actionColors: Record<string, string> = {
  Create: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  Update: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  Delete: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
  Assign: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400",
  Login: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
};

function getActionColor(action: string) {
  const key = Object.keys(actionColors).find(k => action.includes(k));
  return key ? actionColors[key] : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
}

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/api/activity-logs?limit=500")
      .then(r => r.json())
      .then(j => { setLogs(j?.data ?? []); setLoading(false); });
  }, []);

  const filtered = filter
    ? logs.filter(l => l.action.toLowerCase().includes(filter.toLowerCase()))
    : logs;

  const stats = {
    total: logs.length,
    creates: logs.filter(l => l.action.includes("Create")).length,
    updates: logs.filter(l => l.action.includes("Update")).length,
    deletes: logs.filter(l => l.action.includes("Delete")).length,
  };

  const columns = [
    {
      key: "id", header: "#",
      cell: (it: any) => <span className="font-mono text-xs text-slate-400">#{it.id.slice(-6)}</span>,
    },
    {
      key: "action", header: "Action",
      cell: (it: any) => (
        <div className="flex items-center gap-2">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getActionColor(it.action)}`}>
            {it.action.split(" ")[0]}
          </span>
          <span className="text-sm text-slate-600 dark:text-slate-400">{it.action.split(" ").slice(1).join(" ")}</span>
        </div>
      ),
    },
    {
      key: "createdAt", header: "Timestamp",
      cell: (it: any) => (
        <span className="font-mono text-xs text-slate-500">{new Date(it.createdAt).toLocaleString()}</span>
      ),
    },
  ];

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Audit Logs</h1>
          <p className="text-sm text-slate-500">Complete trail of every action performed across the platform.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 self-start">
          <ShieldCheck className="h-3.5 w-3.5" /> Tamper-evident log
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Events", value: stats.total, color: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
          { label: "Creates", value: stats.creates, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Updates", value: stats.updates, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
          { label: "Deletes", value: stats.deletes, color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20" },
        ].map(({ label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color} mb-3`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm w-full max-w-sm dark:border-slate-800 dark:bg-slate-900">
        <Filter className="h-4 w-4 text-slate-400" />
        <input
          placeholder="Filter by action..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-300"
        />
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No audit events" description="Activity will be logged here automatically." />
      ) : (
        <DataTable columns={columns} data={filtered} searchKey="action" searchPlaceholder="Search events..." />
      )}
    </AnimatedPage>
  );
}
