"use client";

import React, { useEffect, useMemo, useState } from "react";

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, minWidth: 180, background: "white" }}>
      <div style={{ color: "#6b7280", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{value}</div>
    </div>
  );
}

export default function ExecutiveDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");

  async function load() {
    const [summaryRes, notifRes, activitiesRes] = await Promise.all([
      fetch("/api/dashboard/summary"),
      fetch("/api/notifications"),
      fetch(`/api/activities?page=${page}&filter=${filter}`),
    ]);
    const summaryJson = await summaryRes.json();
    const notifJson = await notifRes.json();
    const activitiesJson = await activitiesRes.json();
    setSummary(summaryJson?.data);
    setNotifications(notifJson?.data ?? []);
    setActivities(activitiesJson?.data ?? []);
  }

  useEffect(() => { load(); }, [page, filter]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) { setSearchResults(null); return; }
      const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
      const json = await res.json();
      setSearchResults(json?.data);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const metrics = useMemo(() => summary?.metrics ?? {}, [summary]);

  return (
    <div style={{ padding: 24, display: "grid", gap: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Executive Dashboard</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <StatCard title="Assets Available" value={metrics.assetsAvailable ?? 0} />
        <StatCard title="Assets Allocated" value={metrics.assetsAllocated ?? 0} />
        <StatCard title="Assets Under Maintenance" value={metrics.assetsUnderMaintenance ?? 0} />
        <StatCard title="Pending Transfers" value={metrics.pendingTransfers ?? 0} />
        <StatCard title="Upcoming Returns" value={metrics.upcomingReturns ?? 0} />
        <StatCard title="Bookings Today" value={metrics.bookingsToday ?? 0} />
        <StatCard title="Audit Summary" value={metrics.auditSummary ?? 0} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 20 }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "white" }}>
          <h2 style={{ marginBottom: 12 }}>Asset Utilization & Categories</h2>
          <ul>
            {(summary?.assetCategories ?? []).map((item: any) => (
              <li key={item.id} style={{ marginBottom: 8 }}>{item.name}: {item._count?.assets ?? 0} assets</li>
            ))}
          </ul>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "white" }}>
          <h2 style={{ marginBottom: 12 }}>Department Allocation</h2>
          <ul>
            {(summary?.departmentAllocation ?? []).map((item: any) => (
              <li key={item.id} style={{ marginBottom: 8 }}>{item.name}: {item._count?.assets ?? 0} assets</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "white" }}>
          <h2 style={{ marginBottom: 12 }}>Global Search</h2>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets, employees, bookings, departments, maintenance, audit" style={{ width: "100%", padding: 8 }} />
          {searchResults && (
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              {Object.entries(searchResults).map(([key, values]: any) => values?.length ? <div key={key}><strong>{key}</strong><ul>{values.slice(0,3).map((item:any, idx:number)=><li key={idx}>{JSON.stringify(item)}</li>)}</ul></div> : null)}
            </div>
          )}
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "white" }}>
          <h2 style={{ marginBottom: 12 }}>Notifications</h2>
          <button onClick={async ()=>{ await fetch('/api/notifications',{method:'PATCH'}); load(); }} style={{ marginBottom: 8 }}>Mark all as read</button>
          <ul>
            {notifications.map((n:any) => <li key={n.id} style={{ marginBottom: 6 }}>{n.message} {n.read ? "✓" : "•"}</li>)}
          </ul>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "white" }}>
          <h2 style={{ marginBottom: 12 }}>Recent Activities</h2>
          <ul>
            {(summary?.recentActivities ?? []).map((item: any) => <li key={item.id} style={{ marginBottom: 8 }}>{item.action} — {new Date(item.createdAt).toLocaleString()}</li>)}
          </ul>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "white" }}>
          <h2 style={{ marginBottom: 12 }}>Activity Logs</h2>
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
            <option value="all">All</option>
            <option value="asset">Asset</option>
            <option value="booking">Booking</option>
            <option value="allocation">Allocation</option>
          </select>
          <ul style={{ marginTop: 12 }}>
            {activities.map((item: any) => <li key={item.id} style={{ marginBottom: 8 }}>{item.action} — {new Date(item.createdAt).toLocaleString()}</li>)}
          </ul>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            <span>Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "white" }}>
        <h2 style={{ marginBottom: 12 }}>Reports</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {['CSV Export','PDF Export','Department Report','Maintenance Report','Audit Report','Utilization Report'].map((report) => <button key={report}>{report}</button>)}
        </div>
      </div>
    </div>
  );
}
