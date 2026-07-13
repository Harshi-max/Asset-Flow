"use client";

import { useEffect, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3, Loader2, FileDown, TrendingUp, Package, Calendar, Users } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/stats").then(r => r.json()),
      fetch("/api/dashboard/charts").then(r => r.json()),
      fetch("/api/assets?perPage=1000").then(r => r.json()),
    ]).then(([s, c, a]) => {
      setStats(s?.data);
      setCharts(c?.data);
      setAssets(a?.data ?? []);
      setLoading(false);
    });
  }, []);

  const summaryCards = [
    { label: "Total Assets", value: stats?.totalAssets ?? "—", icon: Package, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" },
    { label: "Active Bookings", value: stats?.todaysBookings ?? "—", icon: Calendar, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
    { label: "Total Employees", value: stats?.totalEmployees ?? "—", icon: Users, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
    { label: "Maintenance Pending", value: stats?.pendingMaintenance ?? "—", icon: TrendingUp, color: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" },
  ];

  const assetColumns = [
    { key: "name", header: "Asset Name", cell: (it: any) => <span className="font-medium text-slate-800 dark:text-slate-200">{it.name}</span> },
    { key: "tag", header: "Tag" },
    { key: "category", header: "Category", cell: (it: any) => it.category?.name ?? "—" },
    { key: "department", header: "Department", cell: (it: any) => it.department?.name ?? "—" },
    { key: "status", header: "Status", cell: (it: any) => (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        it.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700" :
        it.status === "ALLOCATED" ? "bg-indigo-50 text-indigo-700" :
        "bg-amber-50 text-amber-700"
      }`}>{it.status}</span>
    )},
    { key: "purchaseCost", header: "Cost", cell: (it: any) => it.purchaseCost ? `$${Number(it.purchaseCost).toLocaleString()}` : "—" },
  ];

  function exportCSV() {
    const headers = ["Name", "Tag", "Category", "Department", "Status", "Cost"];
    const rows = assets.map(a => [a.name, a.tag, a.category?.name ?? "", a.department?.name ?? "", a.status, a.purchaseCost ?? ""].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "assetflow-report.csv"; link.click();
  }

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500">Analytics, summaries, and data exports.</p>
        </div>
        <button onClick={exportCSV} className="inline-flex items-center gap-2 self-start rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
          <FileDown className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {summaryCards.map(({ label, value, icon: Icon, color }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color} mb-3`}><Icon className="h-5 w-5" /></div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Monthly Asset Growth</h3>
              <div className="h-[200px]">
                {charts?.monthlyAssetGrowth && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={charts.monthlyAssetGrowth}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                      <Line type="monotone" dataKey="assets" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Department Utilization</h3>
              <div className="h-[200px]">
                {charts?.departmentUtilization && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={charts.departmentUtilization} barSize={24}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                      <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                      <Bar dataKey="allocated" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* Asset List */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Full Asset Inventory</h3>
            {assets.length === 0 ? (
              <EmptyState title="No Assets" description="No asset data available for export." />
            ) : (
              <DataTable columns={assetColumns} data={assets} searchKey="name" searchPlaceholder="Search assets..." />
            )}
          </div>
        </>
      )}
    </AnimatedPage>
  );
}
