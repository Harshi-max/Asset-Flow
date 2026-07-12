"use client";

import React, { useEffect, useState } from "react";
import AllocationForm from "@/components/allocation-form";

export default function AllocationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div style={{ padding: 16 }}>
      <h1>Allocations</h1>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h2>Create Allocation</h2>
          <AllocationForm onCreated={load} />
        </div>
        <div style={{ flex: 2 }}>
          <h2>Active Allocations</h2>
          {loading ? <div>Loading...</div> : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Holder</th>
                  <th>Status</th>
                  <th>Expected Return</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.asset?.name ?? it.assetId}</td>
                    <td>{it.holder?.name ?? it.holderId}</td>
                    <td>{it.status}</td>
                    <td>{it.expectedReturn ? new Date(it.expectedReturn).toLocaleString() : "—"}</td>
                    <td>{it.status !== "RETURNED" && <button onClick={() => handleReturn(it.id)}>Return</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
