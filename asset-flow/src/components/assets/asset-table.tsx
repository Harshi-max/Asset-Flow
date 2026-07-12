"use client";

import { useEffect, useState } from "react";
import { TableWrapper } from "@/components/common/table-wrapper";
import Link from "next/link";

export function AssetTable() {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`/api/assets?page=${page}&perPage=10`).then((r) => r.json()).then((j) => setItems(j.data ?? []));
  }, [page]);

  return (
    <TableWrapper>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-sm text-slate-500">
            <th className="p-3">Name</th>
            <th className="p-3">Tag</th>
            <th className="p-3">Category</th>
            <th className="p-3">Department</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-t">
              <td className="p-3">{it.name}</td>
              <td className="p-3">{it.tag}</td>
              <td className="p-3">{it.category?.name ?? '-'}</td>
              <td className="p-3">{it.department?.name ?? '-'}</td>
              <td className="p-3"><span className="rounded-full bg-emerald-100 px-2 py-1 text-sm">{it.status}</span></td>
              <td className="p-3">
                <Link href={`/assets/${it.id}`} className="text-blue-600">Open</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrapper>
  );
}
