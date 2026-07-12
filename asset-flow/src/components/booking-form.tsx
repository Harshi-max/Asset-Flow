"use client";

import React, { useState } from "react";

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
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 520 }}>
      <label>Title<input value={title} onChange={(e)=>setTitle(e.target.value)} /></label>
      <label>Resource Type<select value={resourceType} onChange={(e)=>setResourceType(e.target.value)}><option>EQUIPMENT</option><option>ROOM</option><option>VEHICLE</option></select></label>
      <label>Resource ID (optional)<input value={resourceId} onChange={(e)=>setResourceId(e.target.value)} /></label>
      <label>Start At<input value={startAt} onChange={(e)=>setStartAt(e.target.value)} placeholder="2026-07-12T10:00:00Z" /></label>
      <label>End At<input value={endAt} onChange={(e)=>setEndAt(e.target.value)} placeholder="2026-07-12T12:00:00Z" /></label>
      <label>Organizer ID (optional)<input value={organizerId} onChange={(e)=>setOrganizerId(e.target.value)} /></label>
      <div>
        <button type="submit" disabled={loading}>{loading ? "Booking..." : "Create Booking"}</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </form>
  );
}
