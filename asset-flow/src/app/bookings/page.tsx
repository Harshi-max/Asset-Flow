"use client";

import React, { useEffect, useState } from "react";
import BookingForm from "@/components/booking-form";

export default function BookingsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/bookings');
    const j = await res.json();
    setItems(j?.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Bookings</h1>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h2>Create Booking</h2>
          <BookingForm onCreated={load} />
        </div>
        <div style={{ flex: 2 }}>
          <h2>Upcoming Bookings</h2>
          {loading ? <div>Loading...</div> : (
            <ul>
              {items.map(b => (
                <li key={b.id} style={{ marginBottom: 8 }}>
                  <strong>{b.title}</strong> — {b.resourceType} {b.resourceId ? `(${b.resourceId})` : ''} — {new Date(b.startAt).toLocaleString()} to {new Date(b.endAt).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
