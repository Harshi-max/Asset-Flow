"use client";

import { useEffect, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Building2, Loader2, Plus, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrganizationsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"departments" | "categories">("departments");
  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deptForm, setDeptForm] = useState({ name: "", description: "" });
  const [catForm, setCatForm] = useState({ name: "", description: "" });

  async function load() {
    setLoading(true);
    const [d, c] = await Promise.all([
      fetch("/api/organizations/departments").then(r => r.json()),
      fetch("/api/organizations/categories").then(r => r.json()),
    ]);
    setDepartments(d?.data ?? []);
    setCategories(c?.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDeptSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true); setError(null);
    try {
      const res = await fetch("/api/organizations/departments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(deptForm) });
      const j = await res.json();
      if (!j?.success) throw new Error(j?.message || "Failed");
      setOpen(false); setDeptForm({ name: "", description: "" }); load();
    } catch (err: any) { setError(err.message); } finally { setFormLoading(false); }
  }

  async function handleCatSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormLoading(true); setError(null);
    try {
      const res = await fetch("/api/organizations/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(catForm) });
      const j = await res.json();
      if (!j?.success) throw new Error(j?.message || "Failed");
      setOpen(false); setCatForm({ name: "", description: "" }); load();
    } catch (err: any) { setError(err.message); } finally { setFormLoading(false); }
  }

  const deptColumns = [
    { key: "name", header: "Department Name", cell: (it: any) => <span className="font-medium text-slate-800 dark:text-slate-200">{it.name}</span> },
    { key: "description", header: "Description", cell: (it: any) => it.description ?? <span className="text-slate-400">—</span> },
    { key: "head", header: "Department Head", cell: (it: any) => it.head?.name ?? <span className="text-slate-400">—</span> },
    { key: "_count", header: "Members", cell: (it: any) => <span className="font-semibold text-slate-700 dark:text-slate-300">{it.members?.length ?? 0}</span> },
    { key: "createdAt", header: "Created", cell: (it: any) => new Date(it.createdAt).toLocaleDateString() },
  ];

  const catColumns = [
    { key: "name", header: "Category Name", cell: (it: any) => <span className="font-medium text-slate-800 dark:text-slate-200">{it.name}</span> },
    { key: "description", header: "Description", cell: (it: any) => it.description ?? <span className="text-slate-400">—</span> },
    { key: "active", header: "Status", cell: (it: any) => (
      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${it.active ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-slate-100 text-slate-500"}`}>
        {it.active ? "Active" : "Inactive"}
      </span>
    )},
    { key: "createdAt", header: "Created", cell: (it: any) => new Date(it.createdAt).toLocaleDateString() },
  ];

  const isDept = activeTab === "departments";

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Organizations</h1>
          <p className="text-sm text-slate-500">Manage departments and asset categories.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="rounded-full bg-indigo-600 hover:bg-indigo-700 self-start sm:self-auto">
          <Plus className="mr-2 h-4 w-4" /> Add {isDept ? "Department" : "Category"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 mb-3">
            <Building2 className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{departments.length}</p>
          <p className="text-xs text-slate-500">Total Departments</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 mb-3">
            <Tag className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{categories.length}</p>
          <p className="text-xs text-slate-500">Asset Categories</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 w-fit dark:border-slate-800 dark:bg-slate-900">
        {(["departments", "categories"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${activeTab === tab ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : isDept ? (
        departments.length === 0 ? <EmptyState title="No Departments" description="Add your first department." actionLabel="Add Department" onAction={() => setOpen(true)} /> :
        <DataTable columns={deptColumns} data={departments} searchKey="name" searchPlaceholder="Search departments..." />
      ) : (
        categories.length === 0 ? <EmptyState title="No Categories" description="Add your first asset category." actionLabel="Add Category" onAction={() => setOpen(true)} /> :
        <DataTable columns={catColumns} data={categories} searchKey="name" searchPlaceholder="Search categories..." />
      )}

      <Drawer open={open} onClose={() => setOpen(false)}>
        <form onSubmit={isDept ? handleDeptSubmit : handleCatSubmit} className="flex flex-col gap-4">
          <div className="mb-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add {isDept ? "Department" : "Category"}</h2>
            <p className="text-sm text-slate-500">{isDept ? "Create a new organizational department." : "Create a new asset category."}</p>
          </div>
          <AnimatePresence>
            {error && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20">{error}</motion.div>}
          </AnimatePresence>
          {isDept ? (
            <>
              <Input label="Department Name" value={deptForm.name} onChange={e => setDeptForm(f => ({ ...f, name: e.target.value }))} required />
              <Input label="Description" value={deptForm.description} onChange={e => setDeptForm(f => ({ ...f, description: e.target.value }))} />
            </>
          ) : (
            <>
              <Input label="Category Name" value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} required />
              <Input label="Description" value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} />
            </>
          )}
          <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button type="submit" disabled={formLoading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 min-w-[130px]">
              {formLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save"}
            </Button>
          </div>
        </form>
      </Drawer>
    </AnimatedPage>
  );
}
