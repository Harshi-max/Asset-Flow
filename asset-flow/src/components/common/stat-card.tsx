import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  trend,
  className,
}: {
  label: string;
  value: string;
  trend?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-[24px] border border-slate-200/80 bg-white/80 p-5 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.35)] backdrop-blur transition hover:-translate-y-1 hover:shadow-[0_16px_50px_-24px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/80", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{value}</p>
        </div>
        {trend ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {trend}
          </div>
        ) : null}
      </div>
    </div>
  );
}
