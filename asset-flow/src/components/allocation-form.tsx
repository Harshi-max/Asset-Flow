"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AllocationForm({ onCreated }: { onCreated?: () => void }) {
  const [assetId, setAssetId] = useState("");
  const [holderId, setHolderId] = useState("");
  const [departmentId, setDepartmentId] = useState<string>("");
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
        body: JSON.stringify({ assetId, holderId, departmentId: departmentId || null, expectedReturn }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.message || "Failed");
      setAssetId("");
      setHolderId("");
      setDepartmentId("");
      setExpectedReturn("");
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Allocate Asset</h2>
        <p className="text-sm text-slate-500">Assign an asset to an employee or department.</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Input label="Asset ID" value={assetId} onChange={(e) => setAssetId(e.target.value)} required />
      <Input label="Holder (User ID)" value={holderId} onChange={(e) => setHolderId(e.target.value)} required />
      <Input label="Department ID (optional)" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} />
      <Input label="Expected Return (ISO Date)" placeholder="2026-07-20T10:00:00Z" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} />
      
      <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={() => onCreated?.()} className="rounded-xl">Cancel</Button>
        <Button type="submit" disabled={loading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Allocate"}
        </Button>
      </div>
    </form>
  );
}
