"use client";

import { Activity, BellDot, ChevronRight, Search, ShieldCheck, Sparkles, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function StatCard({ title, value, trend, isPositive }: { title: string; value: string | number; trend?: string; isPositive?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</div>
        {trend && (
          <div className={`text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ExecutiveDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  async function load() {
    try {
      const [statsRes, chartsRes, activitiesRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/charts"),
        fetch(`/api/activity-logs`),
      ]);
      const statsJson = await statsRes.json();
      const chartsJson = await chartsRes.json();
      const activitiesJson = await activitiesRes.json();
      setStats(statsJson?.data);
      setCharts(chartsJson?.data);
      setActivities(activitiesJson?.data ?? []);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6 pb-12 bg-[#f8fafc] dark:bg-[#020617]">
      {/* Top Header / Title (Optional based on PRD, keeping it clean) */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Real-time KPIs, charts, trends, insights and reports</p>
      </div>

      {/* 6 Stat Cards Row */}
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Assets" value={stats?.totalAssets ?? 0} trend="24%" isPositive={true} />
        <StatCard title="Available" value={stats?.available ?? 0} trend="4%" isPositive={true} />
        <StatCard title="Allocated" value={stats?.allocated ?? 0} trend="14%" isPositive={false} />
        <StatCard title="Maintenance" value={stats?.maintenance ?? 0} trend="20%" isPositive={false} />
        <StatCard title="Reserved" value={stats?.reserved ?? 0} />
        <StatCard title="Lost / Retired" value={stats?.lostRetired ?? 0} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assets by Category - Donut Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Assets by Category</h2>
          {charts?.assetsByCategory ? (
            <>
              {/* Chart — fixed height so it never overflows */}
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={charts.assetsByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                      {charts.assetsByCategory.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Custom compact legend */}
              <div className="mt-3 flex flex-col gap-1.5 overflow-y-auto max-h-[80px] pr-1">
                {charts.assetsByCategory.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: entry.fill }} />
                      <span className="truncate text-slate-600 dark:text-slate-400">{entry.name}</span>
                    </div>
                    <span className="ml-2 shrink-0 font-semibold text-slate-700 dark:text-slate-300">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="flex flex-1 items-center justify-center text-sm text-slate-400">Loading...</div>}
        </div>

        {/* Maintenance Trend - Line Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white mb-6">Maintenance Trend</h2>
          <div className="h-[250px] w-full">
            {charts?.maintenanceTrend ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.maintenanceTrend}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="issues" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading...</div>}
          </div>
        </div>

        {/* Department Utilization - Bar Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white mb-6">Department Utilization</h2>
          <div className="h-[250px] w-full">
            {charts?.departmentUtilization ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.departmentUtilization} barSize={32}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="allocated" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading...</div>}
          </div>
        </div>
      </div>

      {/* Secondary Charts & Widgets Row */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1fr]">
        
        {/* Monthly Asset Growth - Area Chart */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white mb-6">Monthly Asset Growth</h2>
          <div className="h-[250px] w-full">
            {charts?.monthlyAssetGrowth ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.monthlyAssetGrowth}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="assets" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="flex h-full items-center justify-center text-sm text-slate-400">Loading...</div>}
          </div>
        </div>

        {/* System Health & Storage */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white mb-4">System Health</h2>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">All services operational</p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Storage Usage</h2>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">45 GB <span className="text-slate-400 font-normal">/ 100 GB</span></span>
              <span className="text-slate-500">45%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: '45%' }} />
            </div>
          </div>
        </div>

        {/* Audit Progress */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Audit Progress</h2>
          <div className="flex flex-col gap-6">
            <div className="flex items-end gap-3">
              <div className="text-4xl font-bold text-slate-900 dark:text-white">{charts?.auditProgress?.verified ?? 0}%</div>
              <div className="text-sm text-slate-500 mb-1 dark:text-slate-400">Verified</div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>Verified Assets</span>
                  <span>{charts?.auditProgress?.verified ?? 0}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${charts?.auditProgress?.verified ?? 0}%` }} />
                </div>
              </div>
              
              <div>
                <div className="mb-1 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>Flagged / Missing</span>
                  <span>{charts?.auditProgress?.flagged ?? 0}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: `${charts?.auditProgress?.flagged ?? 0}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>Pending Review</span>
                  <span>{charts?.auditProgress?.pending ?? 0}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${charts?.auditProgress?.pending ?? 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Widgets Row */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Recent Activities */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Recent Activities</h2>
          <div className="space-y-4 h-[350px] overflow-y-auto pr-2">
            {activities.length > 0 ? activities.map((item: any, i: number) => (
              <div key={item.id || i} className="flex items-start gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                <div className="rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.action}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  {item.action.includes("Create") ? "System" : item.action.includes("Asset") ? "Asset Mgr" : "Auto"}
                </div>
              </div>
            )) : <p className="py-4 text-sm text-slate-500">No recent activities found.</p>}
          </div>
        </div>

        {/* AI Assistant Chat Widget */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-900 dark:text-white">AI Assistant</span>
            <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Live</span>
          </div>
          <AIChatWidget stats={stats} />
        </div>
      </div>
    </div>
  );
}

function AIChatWidget({ stats }: { stats: any }) {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "👋 Hi! I can answer questions about your assets, bookings, maintenance, and more. Try asking me something!" },
  ]);
  const [loading, setLoading] = React.useState(false);

  async function handleSend() {
    const q = input.trim();
    if (!q) return;
    const userMsg = { role: "user" as const, text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q }) });
      const j = await res.json();
      const aiText = j?.reply ?? (j?.message ?? 'Sorry, I could not answer that.');
      const aiMsg = { role: 'ai' as const, text: aiText };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Error: failed to contact AI service.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 0 }}>
      {/* Messages */}
      <div className="flex flex-col gap-3 overflow-y-auto p-4" style={{ maxHeight: 260 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
              m.role === "user"
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-slate-100 text-slate-700 rounded-bl-sm dark:bg-slate-800 dark:text-slate-300"
            }`}>
              {m.text.split("**").map((part, j) =>
                j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Input */}
      <div className="border-t border-slate-100 p-3 dark:border-slate-800">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about assets, bookings, maintenance..."
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-300"
          />
          <button
            onClick={handleSend}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </div>
    </div>
  );
}
