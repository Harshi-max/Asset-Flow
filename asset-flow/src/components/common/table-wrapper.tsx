import { cn } from "@/lib/utils";

export function TableWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/80 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80", className)}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
