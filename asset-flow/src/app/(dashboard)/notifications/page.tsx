"use client";
import { useEffect, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications', { credentials: 'include' });
        const j = await res.json();
        // show only unread notifications by default
        setItems((j?.data ?? []).filter((n: any) => !n.read));
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markAllRead() {
    await fetch('/api/notifications', { method: 'PATCH', credentials: 'include' });
    load();
  }

  async function markRead(id: string) {
    await fetch('/api/notifications', { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  }

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-500">System alerts, approvals, and activity notifications.</p>
        </div>
        <div>
          <Button onClick={markAllRead} disabled={loading} className="rounded-full">Mark all read</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No notifications" description="You are all caught up. New alerts will appear here." />
      ) : (
        <div className="space-y-3">
          {items.map(n => (
            <div key={n.id} className={`rounded-xl border p-3 ${n.read ? 'bg-slate-50 dark:bg-slate-800/40' : 'bg-white dark:bg-slate-900'}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">{n.title ?? 'Notification'}</div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{n.message}</div>
                  <div className="mt-2 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex flex-col gap-2">
                  {!n.read && <Button size="sm" onClick={() => markRead(n.id)}>Mark read</Button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AnimatedPage>
  );
}
