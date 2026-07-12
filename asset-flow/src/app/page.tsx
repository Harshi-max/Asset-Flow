import Link from "next/link";
import { Boxes, ShieldCheck, Sparkles, Workflow } from "lucide-react";

const highlights = ["Live asset visibility", "Smarter bookings", "Faster approvals"];
const stats = [
  { label: "Teams aligned", value: "24/7" },
  { label: "Assets tracked", value: "1.2k+" },
  { label: "Avg. response", value: "< 2m" },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_45%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8 dark:bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.18),_transparent_40%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)]">
      <div className="grid w-full max-w-7xl gap-6 rounded-[36px] border border-slate-200 bg-white/80 p-6 shadow-[0_24px_90px_-32px_rgba(15,23,42,0.4)] backdrop-blur xl:grid-cols-[1.05fr_0.95fr] xl:p-8 dark:border-slate-800 dark:bg-slate-900/80">
        <section className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            Enterprise asset operations, reimagined
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            Keep every asset, booking, and approval flowing with confidence.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            AssetFlow brings your operating rhythm into one polished workspace so teams can move faster with less friction.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
              Sign in
            </Link>
            <Link href="/signup" className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Create account
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {highlights.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-2xl font-semibold text-slate-950 dark:text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-[30px] border border-slate-200 bg-slate-950 p-6 text-white shadow-inner dark:border-slate-800">
          <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
              <Workflow className="h-4 w-4" />
              Operations hub
            </div>
            <h2 className="mt-3 text-2xl font-semibold">A modern command surface for asset teams.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Bring together bookings, allocations, approvals, and maintenance in one intuitive experience.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <Boxes className="h-4 w-4 text-indigo-300" />
                Live inventory
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">1,248</p>
              <p className="mt-1 text-sm text-slate-400">Assets in motion</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-slate-900/70 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Secure by design
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">100%</p>
              <p className="mt-1 text-sm text-slate-400">Local-first workflow</p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
