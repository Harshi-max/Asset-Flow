"use client";

import { useEffect, useState } from "react";
import { TableWrapper } from "@/components/common/table-wrapper";
import { ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";

const statusClasses: Record<string, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
  ALLOCATED: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300",
  MAINTENANCE: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
  RETIRED: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export function AssetTable() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/assets?page=${page}&perPage=10`)
      .then((r) => r.json())
      .then((j) => setItems(j.data ?? []))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <TableWrapper>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50/80 dark:bg-slate-950/50">
            <tr className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Tag</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white/60 dark:divide-slate-800 dark:bg-slate-900/40">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading assets...
                  </div>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                  No assets registered yet.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-950/60">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">{it.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{it.tag}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{it.category?.name ?? "-"}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{it.department?.name ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[it.status] ?? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                      {it.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/assets/${it.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-500 dark:text-indigo-300">
                      Open
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
        <span>Page {page}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">Prev</button>
          <button onClick={() => setPage((p) => p + 1)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">Next</button>
        </div>
      </div>
    </TableWrapper>
  );
}
