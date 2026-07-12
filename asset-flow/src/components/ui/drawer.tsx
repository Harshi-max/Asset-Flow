"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Drawer({ open, onClose, children, side = "right", className }: { open: boolean; onClose: () => void; children: React.ReactNode; side?: "right" | "left"; className?: string }) {
  return (
    <div className={cn("fixed inset-0 z-50 pointer-events-none", open ? "" : "hidden")}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className={cn("absolute top-0 h-full w-full max-w-md bg-white shadow-lg dark:bg-slate-900 pointer-events-auto", side === "right" ? "right-0" : "left-0", className)}>
        <div className="p-4">{children}</div>
      </aside>
    </div>
  );
}
