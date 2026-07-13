"use client";

import React, { useEffect, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/common/page-header";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import AllocationForm from "@/components/allocation-form";
import { Plus, Loader2 } from "lucide-react";

export default function AllocationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/allocations");
    const json = await res.json();
    setItems(json?.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleReturn(id: string) {
    const notes = prompt("Return notes (optional)");
    const res = await fetch(`/api/allocations/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "RETURN", notes }) });
    const j = await res.json();
    if (j?.success) load(); else alert(j?.message || "Failed");
  }

  const columns = [
    { key: "asset", header: "Asset", cell: (it: any) => <span className="font-medium text-slate-800 dark:text-slate-200">{it.asset?.name ?? it.assetId}</span> },
    { key: "holder", header: "Holder", cell: (it: any) => it.holder?.name ?? it.holderId },
    { key: "status", header: "Status", cell: (it: any) => (
      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold 
        ${it.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300' : 
          it.status === 'RETURNED' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : 
          'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300'}`}>
        {it.status}
      </span>
    )},
    { key: "expectedReturn", header: "Expected Return", cell: (it: any) => it.expectedReturn ? new Date(it.expectedReturn).toLocaleString() : "—" },
    { key: "actions", header: "Actions", cell: (it: any) => (
      it.status !== "RETURNED" ? (
        <button onClick={() => handleReturn(it.id)} className="text-sm font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400">
          Mark Returned
        </button>
      ) : <span className="text-sm text-slate-400">Returned</span>
    )}
  ];

  return (
    <AnimatedPage className="space-y-6">
      <PageHeader
        title="Allocations"
        description="Manage asset assignments and custodianship across employees."
        actions={
          <Button onClick={() => setOpen(true)} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Allocate Asset
          </Button>
        }
      />
      
      {loading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/50">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <p className="mt-4 text-sm text-slate-500">Loading allocations...</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState 
          title="No Allocations Found" 
          description="Allocate your first asset to an employee to get started." 
          actionLabel="Allocate Asset"
          onAction={() => setOpen(true)}
        />
      ) : (
        <DataTable columns={columns} data={items} />
      )}

      <Drawer open={open} onClose={() => setOpen(false)}>
        <AllocationForm onCreated={() => { setOpen(false); load(); }} />
      </Drawer>
    </AnimatedPage>
  );
}
