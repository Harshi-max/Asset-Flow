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
    <div className={cn("rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900", className)}>
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl font-semibold">{value}</span>
        {trend ? <span className="text-sm font-medium text-emerald-600">{trend}</span> : null}
      </div>
    </div>
  );
}
