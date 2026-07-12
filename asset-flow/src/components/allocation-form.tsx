"use client";

import React, { useState } from "react";

export default function AllocationForm({ onCreated }: { onCreated?: () => void }) {
  const [assetId, setAssetId] = useState("");
  const [holderId, setHolderId] = useState("");
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [expectedReturn, setExpectedReturn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId, holderId, departmentId, expectedReturn }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.message || "Failed");
      setAssetId("");
      setHolderId("");
      setExpectedReturn("");
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
      <label>
        Asset ID
        <input value={assetId} onChange={(e) => setAssetId(e.target.value)} />
      </label>
      <label>
        Holder (User ID)
        <input value={holderId} onChange={(e) => setHolderId(e.target.value)} />
      </label>
      <label>
        Department ID (optional)
        <input value={departmentId ?? ""} onChange={(e) => setDepartmentId(e.target.value || null)} />
      </label>
      <label>
        Expected return (ISO)
        <input value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} placeholder="2026-07-20T10:00:00Z" />
      </label>
      <div>
        <button type="submit" disabled={loading}>{loading ? "Allocating..." : "Allocate"}</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </form>
  );
}
