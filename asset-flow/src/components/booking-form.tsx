"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingForm({ onCreated }: { onCreated?: () => void }) {
  const [title, setTitle] = useState("");
  const [resourceType, setResourceType] = useState("EQUIPMENT");
  const [resourceId, setResourceId] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [organizerId, setOrganizerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, resourceType, resourceId: resourceId || null, startAt, endAt, organizerId: organizerId || null }),
      });
      const data = await res.json();
      if (!data?.success) throw new Error(data?.message || "Failed");
      setTitle(""); setResourceId(""); setStartAt(""); setEndAt(""); setOrganizerId("");
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">New Booking</h2>
        <p className="text-sm text-slate-500">Reserve an asset or room for a specific timeframe.</p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="rounded-xl bg-rose-50 p-4 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Input label="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
      
      <div className="group relative w-full">
        <div className="relative w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 transition-colors duration-200 focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-900">
          <label className="pointer-events-none absolute left-3 top-2 text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Resource Type
          </label>
          <select 
            value={resourceType} 
            onChange={(e)=>setResourceType(e.target.value)}
            className="w-full bg-transparent px-3 pb-2 pt-6 text-sm text-slate-900 outline-none dark:text-white appearance-none cursor-pointer"
          >
            <option value="EQUIPMENT">Equipment</option>
            <option value="ROOM">Room</option>
            <option value="VEHICLE">Vehicle</option>
          </select>
        </div>
      </div>

      <Input label="Resource ID" value={resourceId} onChange={(e)=>setResourceId(e.target.value)} />
      
      <div className="grid grid-cols-2 gap-4">
        <Input label="Start At (ISO Date)" placeholder="2026-07-12T10:00:00Z" value={startAt} onChange={(e)=>setStartAt(e.target.value)} required />
        <Input label="End At (ISO Date)" placeholder="2026-07-12T12:00:00Z" value={endAt} onChange={(e)=>setEndAt(e.target.value)} required />
      </div>

      <Input label="Organizer ID" value={organizerId} onChange={(e)=>setOrganizerId(e.target.value)} />
      
      <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={() => onCreated?.()} className="rounded-xl">Cancel</Button>
        <Button type="submit" disabled={loading} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Create Booking"}
        </Button>
      </div>
    </form>
  );
}
