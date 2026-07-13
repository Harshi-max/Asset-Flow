"use client";

import { useEffect, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Wrench, Loader2, Plus, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const statusStyles: Record<string, string> = {
  REQUESTED: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  IN_PROGRESS: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  RESOLVED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  CANCELLED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};
const priorityStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-amber-50 text-amber-600",
  HIGH: "bg-orange-50 text-orange-600",
  CRITICAL: "bg-rose-50 text-rose-700",
};

export default function MaintenancePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ assetId: "", requestedById: "", priority: "MEDIUM", issue: "" });

  const stats = {
    total: items.length,
    pending: items.filter(i => i.status === "REQUESTED").length,
    inProgress: items.filter(i => i.status === "IN_PROGRESS").length,
    resolved: items.filter(i => i.status === "RESOLVED").length,
  };

  async function load() {
    setLoading(true);
    const res = await fetch("/api/maintenance");
    const j = await res.json();
    setItems(j?.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!j?.success) throw new Error(j?.message || "Failed to create request");
      setOpen(false);
      setForm({ assetId: "", requestedById: "", priority: "MEDIUM", issue: "" });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  const columns = [
    {
      key: "asset", header: "Asset",
      cell: (it: any) => <span className="font-medium text-slate-800 dark:text-slate-200">{it.asset?.name ?? it.assetId}</span>,
    },
    { key: "issue", header: "Issue", cell: (it: any) => <span className="max-w-[200px] truncate block text-slate-600 dark:text-slate-400">{it.issue}</span> },
    {
      key: "priority", header: "Priority",
      cell: (it: any) => <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityStyles[it.priority] ?? "bg-slate-100 text-slate-600"}`}>{it.priority}</span>,
    },
    {
      key: "status", header: "Status",
      cell: (it: any) => <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[it.status] ?? "bg-slate-100 text-slate-600"}`}>{it.status}</span>,
    },
    { key: "createdAt", header: "Reported", cell: (it: any) => new Date(it.createdAt).toLocaleDateString() },
    { key: "requestedBy", header: "Reported By", cell: (it: any) => it.requestedBy?.name ?? it.requestedById ?? "—" },
  ];

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Maintenance</h1>
          <p className="text-sm text-slate-500">Track and resolve equipment maintenance requests.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="rounded-full bg-indigo-600 hover:bg-indigo-700 self-start sm:self-auto">
          <Plus className="mr-2 h-4 w-4" /> New Request
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: Wrench, color: "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400" },
          { label: "In Progress", value: stats.inProgress, icon: AlertCircle, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" },
          { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${color} mb-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No Maintenance Requests" description="All equipment is running smoothly. Create a request when needed." actionLabel="New Request" onAction={() => setOpen(true)} />
      ) : (
        <DataTable columns={columns} data={items} searchKey="issue" searchPlaceholder="Search by issue..." />
      )}

      <Drawer open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">New Maintenance Request</h2>
            <p className="text-sm text-slate-500">Report an equipment issue for resolution.</p>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <Input label="Asset ID" value={form.assetId} onChange={e => setForm(f => ({ ...f, assetId: e.target.value }))} required />
          <Input label="Requested By (User ID)" value={form.requestedById} onChange={e => setForm(f => ({ ...f, requestedById: e.target.value }))} required />
          <div className="relative w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 focus-within:border-indigo-500">
            <label className="pointer-events-none absolute left-3 top-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">Priority</label>
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full appearance-none bg-transparent px-3 pb-2 pt-6 text-sm text-slate-900 outline-none dark:text-white">
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="relative w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 focus-within:border-indigo-500">
            <label className="pointer-events-none absolute left-3 top-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">Issue Description</label>
            <textarea value={form.issue} onChange={e => setForm(f => ({ ...f, issue: e.target.value }))} rows={4} className="w-full bg-transparent px-3 pb-3 pt-7 text-sm text-slate-900 outline-none dark:text-white resize-none" required />
          </div>
          <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={formLoading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 min-w-[130px]">
              {formLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : "Submit Request"}
            </Button>
          </div>
        </form>
      </Drawer>
    </AnimatedPage>
  );
}
