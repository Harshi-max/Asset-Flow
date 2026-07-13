"use client";

import { useEffect, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Users, Loader2, Plus, UserCheck, UserX, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = ["ADMIN", "ASSET_MANAGER", "DEPARTMENT_HEAD", "EMPLOYEE"];
const roleStyles: Record<string, string> = {
  ADMIN: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300",
  ASSET_MANAGER: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
  DEPARTMENT_HEAD: "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300",
  EMPLOYEE: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function EmployeesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "EMPLOYEE" });

  const stats = {
    total: items.length,
    active: items.filter(i => i.isActive !== false).length,
    inactive: items.filter(i => i.isActive === false).length,
    admins: items.filter(i => i.role === "ADMIN").length,
  };

  async function load() {
    setLoading(true);
    const res = await fetch("/api/employees");
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!j?.success && !j?.user) throw new Error(j?.message || "Failed to create employee");
      setOpen(false);
      setForm({ name: "", email: "", password: "", role: "EMPLOYEE" });
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  const columns = [
    {
      key: "name", header: "Name",
      cell: (it: any) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
            {(it.name ?? it.email ?? "?")[0].toUpperCase()}
          </div>
          <span className="font-medium text-slate-800 dark:text-slate-200">{it.name ?? "—"}</span>
        </div>
      ),
    },
    { key: "email", header: "Email", cell: (it: any) => <span className="text-slate-600 dark:text-slate-400">{it.email}</span> },
    {
      key: "role", header: "Role",
      cell: (it: any) => <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleStyles[it.role] ?? "bg-slate-100 text-slate-600"}`}>{it.role}</span>,
    },
    { key: "department", header: "Department", cell: (it: any) => it.department?.name ?? <span className="text-slate-400">—</span> },
    {
      key: "isActive", header: "Status",
      cell: (it: any) => it.isActive !== false ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"><UserCheck className="h-3 w-3" />Active</span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500"><UserX className="h-3 w-3" />Inactive</span>
      ),
    },
    { key: "createdAt", header: "Joined", cell: (it: any) => new Date(it.createdAt).toLocaleDateString() },
  ];

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Employees</h1>
          <p className="text-sm text-slate-500">Manage team members, roles, and department assignments.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="rounded-full bg-indigo-600 hover:bg-indigo-700 self-start sm:self-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: Users, color: "text-slate-600 bg-slate-100 dark:bg-slate-800" },
          { label: "Active", value: stats.active, icon: UserCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Inactive", value: stats.inactive, icon: UserX, color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20" },
          { label: "Admins", value: stats.admins, icon: Building2, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20" },
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
        <EmptyState title="No Employees Found" description="Add your first employee to get started." actionLabel="Add Employee" onAction={() => setOpen(true)} />
      ) : (
        <DataTable columns={columns} data={items} searchKey="name" searchPlaceholder="Search by name or email..." />
      )}

      <Drawer open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Employee</h2>
            <p className="text-sm text-slate-500">Create a new team member account.</p>
          </div>
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Email Address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <Input label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          <div className="relative w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 focus-within:border-indigo-500">
            <label className="pointer-events-none absolute left-3 top-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-600">Role</label>
            <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full appearance-none bg-transparent px-3 pb-2 pt-6 text-sm text-slate-900 outline-none dark:text-white">
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={formLoading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 min-w-[130px]">
              {formLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : "Add Employee"}
            </Button>
          </div>
        </form>
      </Drawer>
    </AnimatedPage>
  );
}
