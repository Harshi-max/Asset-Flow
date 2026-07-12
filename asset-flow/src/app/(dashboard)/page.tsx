const metrics = [
  { label: "Active Assets", value: "1,248", change: "+12.4%" },
  { label: "Maintenance", value: "84", change: "+3.2%" },
  { label: "Pending Reviews", value: "27", change: "-1.8%" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-white p-8 shadow-sm dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">Operations Overview</p>
        <h1 className="mt-3 text-3xl font-semibold">Welcome back, operations team.</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          AssetFlow is being shaped as a robust enterprise control center for monitoring assets, maintenance, and resource health.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-white p-5 shadow-sm dark:bg-slate-900">
            <p className="text-sm text-slate-500">{metric.label}</p>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-2xl font-semibold">{metric.value}</span>
              <span className="text-sm font-medium text-emerald-600">{metric.change}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
