"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { adminAction, getCurrentUser } from "@/lib/admin-client";

const statusClasses: Record<string, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  ALLOCATED: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300",
  MAINTENANCE: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  RETIRED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export function AssetTable() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Fetch all for local filtering/pagination
    fetch(`/api/assets?perPage=1000`)
      .then((r) => r.json())
      .then((j) => setItems(j.data ?? []))
      .finally(() => setLoading(false));
    (async () => {
      try {
        const u = await getCurrentUser();
        if (u?.success) setCurrentUser(u.data);
      } catch (e) {}
    })();
  }, []);

  const columns = [
    { key: "name", header: "Name" },
    { key: "tag", header: "Tag" },
    { key: "category", header: "Category", cell: (it: any) => it.category?.name ?? "-" },
    { key: "department", header: "Department", cell: (it: any) => it.department?.name ?? "-" },
    { key: "status", header: "Status", cell: (it: any) => (
      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[it.status] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
        {it.status}
      </span>
    )},
    { key: "actions", header: "Actions", cell: (it: any) => (
      <div className="flex items-center gap-2">
        <Link href={`/assets/${it.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-400">
          Open
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'ASSET_MANAGER') && (
          <select defaultValue={it.status} onChange={async (e) => { const s = e.target.value; await adminAction('changeAssetStatus', it.id, { status: s }); const j = await fetch(`/api/assets?perPage=1000`).then(r => r.json()); setItems(j.data ?? []); }} className="rounded border px-2 py-1 text-sm">
            <option value="ACTIVE">ACTIVE</option>
            <option value="ALLOCATED">ALLOCATED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
            <option value="RESERVED">RESERVED</option>
            <option value="LOST">LOST</option>
            <option value="RETIRED">RETIRED</option>
          </select>
        )}
      </div>
    )}
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <p className="mt-4 text-sm text-slate-500">Loading assets...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState 
        title="No Assets Found" 
        description="Get started by registering your first enterprise asset." 
      />
    );
  }

  return <DataTable columns={columns} data={items} searchKey="name" searchPlaceholder="Search assets by name..." />;
}
