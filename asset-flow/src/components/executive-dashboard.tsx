"use client";

import { Activity, BellDot, ChevronRight, Search, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-[24px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_16px_50px_-24px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/80">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</div>
    </motion.div>
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
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-[32px] border border-slate-200/80 bg-[linear-gradient(135deg,_rgba(99,102,241,0.13)_0%,_rgba(14,165,233,0.09)_100%)] p-6 shadow-[0_20px_80px_-35px_rgba(15,23,42,0.45)] dark:border-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/70 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
              <Sparkles className="h-4 w-4" />
              Executive command center
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Operations tuned for clarity and momentum.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Monitor asset availability, approvals, and activity streams from one refined command surface.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Secure local-first workspace
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Assets Available" value={metrics.assetsAvailable ?? 0} />
        <StatCard title="Assets Allocated" value={metrics.assetsAllocated ?? 0} />
        <StatCard title="Under Maintenance" value={metrics.assetsUnderMaintenance ?? 0} />
        <StatCard title="Bookings Today" value={metrics.bookingsToday ?? 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Fleet pulse</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Weekly operating outlook</p>
            </div>
            <div className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">+12.4%</div>
          </div>
          <div className="mt-6 flex h-44 items-end gap-3">
            {[48, 72, 64, 84, 90, 76, 96].map((height, index) => (
              <div key={index} className="flex-1 rounded-t-2xl bg-gradient-to-t from-indigo-600 to-sky-400" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Approval readiness</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Critical path health</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">Healthy</div>
          </div>
          <div className="mt-6 space-y-4">
            {[
              { label: "Transfers", value: 82 },
              { label: "Bookings", value: 76 },
              { label: "Maintenance", value: 91 },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                  <span>{row.label}</span>
                  <span className="font-semibold text-slate-950 dark:text-white">{row.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${row.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Asset utilization</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Category distribution across the estate</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">Live</div>
          </div>
          <div className="mt-5 space-y-3">
            {(summary?.assetCategories ?? []).map((item: any) => {
              const count = item._count?.assets ?? 0;
              const max = Math.max(...((summary?.assetCategories ?? []).map((entry: any) => entry._count?.assets ?? 0)), 1);
              const width = `${Math.max(12, (count / max) * 100)}%`;
              return (
                <div key={item.id} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                    <span className="text-sm font-semibold text-slate-950 dark:text-white">{count} assets</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500" style={{ width }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Department focus</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Allocation intensity by team</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">Stable</div>
          </div>
          <div className="mt-5 space-y-3">
            {(summary?.departmentAllocation ?? []).map((item: any) => {
              const count = item._count?.assets ?? 0;
              const max = Math.max(...((summary?.departmentAllocation ?? []).map((entry: any) => entry._count?.assets ?? 0)), 1);
              const width = `${Math.max(10, (count / max) * 100)}%`;
              return (
                <div key={item.id} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                    <span className="text-sm font-semibold text-slate-950 dark:text-white">{count}</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Global search</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Find assets, teams, and activity instantly</p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Search className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/70">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets, employees, bookings, departments, maintenance, audit" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
          </div>
          {searchResults && (
            <div className="mt-4 space-y-3">
              {Object.entries(searchResults).map(([key, values]: any) => values?.length ? (
                <div key={key} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/70">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{key}</div>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    {values.slice(0, 3).map((item: any, idx: number) => <li key={idx} className="rounded-lg bg-white/70 px-3 py-2 dark:bg-slate-900/60">{JSON.stringify(item)}</li>)}
                  </ul>
                </div>
              ) : null)}
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Notifications</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Stay aligned with the latest updates</p>
            </div>
            <button onClick={async () => { await fetch("/api/notifications", { method: "PATCH" }); load(); }} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Mark all read</button>
          </div>
          <div className="mt-5 space-y-3">
            {notifications.map((n: any) => (
              <div key={n.id} className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/70">
                <div className="mt-0.5 rounded-full bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                  <BellDot className="h-3.5 w-3.5" />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  <p>{n.message}</p>
                  <p className="mt-1 text-xs text-slate-400">{n.read ? "Seen" : "New"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Recent activities</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest operating events</p>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {(summary?.recentActivities ?? []).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                <span className="text-sm text-slate-600 dark:text-slate-300">{item.action}</span>
                <span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Activity logs</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Filter the operating timeline</p>
            </div>
            <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <option value="all">All</option>
              <option value="asset">Asset</option>
              <option value="booking">Booking</option>
              <option value="allocation">Allocation</option>
            </select>
          </div>
          <div className="mt-5 space-y-3">
            {activities.map((item: any) => (
              <div key={item.id} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/70">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600 dark:text-slate-300">{item.action}</span>
                  <span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Previous</button>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Page {page}</span>
            <button onClick={() => setPage((p) => p + 1)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">Next</button>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Operational reports</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Export-ready insights for your team</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Explore reports
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          {['CSV Export','PDF Export','Department Report','Maintenance Report','Audit Report','Utilization Report'].map((report) => (
            <div key={report} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">{report}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
