import { Bell, Search, SunMoon } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 rounded-full border border-border bg-slate-50 px-3 py-2 text-sm text-slate-500 shadow-sm dark:bg-slate-900">
          <Search className="h-4 w-4" />
          <span>Search assets, teams, and reports</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-border p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <SunMoon className="h-4 w-4" />
          </button>
          <button className="rounded-full border border-border p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            <Bell className="h-4 w-4" />
          </button>
          <div className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
