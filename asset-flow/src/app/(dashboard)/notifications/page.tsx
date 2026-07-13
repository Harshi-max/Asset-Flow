"use client";
import { AnimatedPage } from "@/components/ui/animated-page";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotificationsPage() {
  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Notifications</h1>
        <p className="text-sm text-slate-500">System alerts, approvals, and activity notifications.</p>
      </div>
      <EmptyState title="No notifications" description="You are all caught up. New alerts will appear here." />
    </AnimatedPage>
  );
}
