"use client";

import React, { useEffect, useState } from "react";
import { AnimatedPage } from "@/components/ui/animated-page";
import { PageHeader } from "@/components/common/page-header";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import BookingForm from "@/components/booking-form";
import { Plus, Loader2 } from "lucide-react";

export default function BookingsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/bookings');
    const j = await res.json();
    setItems(j?.data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const columns = [
    { key: "title", header: "Title", cell: (it: any) => <span className="font-medium">{it.title}</span> },
    { key: "resource", header: "Resource", cell: (it: any) => `${it.resourceType} ${it.resourceId ? `(${it.resourceId})` : ''}` },
    { key: "startAt", header: "Start", cell: (it: any) => new Date(it.startAt).toLocaleString() },
    { key: "endAt", header: "End", cell: (it: any) => new Date(it.endAt).toLocaleString() },
    { key: "status", header: "Status", cell: (it: any) => (
      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold 
        ${it.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300' : 
          it.status === 'PENDING' ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300' : 
          it.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300' : 
          'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
        {it.status}
      </span>
    )}
  ];

  return (
    <AnimatedPage className="space-y-6">
      <PageHeader
        title="Bookings"
        description="Manage equipment and facility reservations."
        actions={
          <Button onClick={() => setOpen(true)} className="rounded-full bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        }
      />
      
      {loading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/50 dark:border-slate-800 dark:bg-slate-900/50">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <p className="mt-4 text-sm text-slate-500">Loading bookings...</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState 
          title="No Bookings Found" 
          description="Schedule an asset or room booking to get started." 
          actionLabel="New Booking"
          onAction={() => setOpen(true)}
        />
      ) : (
        <DataTable columns={columns} data={items} searchKey="title" searchPlaceholder="Search bookings..." />
      )}

      <Drawer open={open} onClose={() => setOpen(false)}>
        <BookingForm onCreated={() => { setOpen(false); load(); }} />
      </Drawer>
    </AnimatedPage>
  );
}
