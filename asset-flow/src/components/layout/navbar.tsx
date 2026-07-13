"use client";

import { useTheme } from "next-themes";
import { Bell, Menu, Moon, Search, Sun, SunMoon, X, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Boxes, FileText, LayoutDashboard, Settings, ShieldCheck } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/assets", label: "Assets", icon: Boxes },
  { href: "/bookings", label: "Bookings", icon: FileText },
  { href: "/allocations", label: "Allocations", icon: ShieldCheck },
  { href: "/organizations", label: "Organizations", icon: Settings },
];

type SearchResults = {
  assets: Array<{ id: string; name?: string | null; tag?: string | null }>;
  departments: Array<{ id: string; name: string }>;
  audit: Array<{ id: string; action: string }>;
};

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ assets: [], departments: [], audit: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  function handleChange(val: string) {
    setQuery(val);
    setShowDropdown(Boolean(val && val.length > 0));
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      if (!val || val.trim().length === 0) {
        setResults({ assets: [], departments: [], audit: [] });
        return;
      }
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
        const j = await res.json();
        if (j?.success) {
          setResults({ assets: j.data.assets ?? [], departments: j.data.departments ?? [], audit: j.data.audit ?? [] });
        }
      } catch (e) {
        // ignore
      }
    }, 300) as unknown as number;
  }

  useEffect(() => {
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current); };
  }, []);

  useEffect(() => setMounted(true), []);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      router.push('/');
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              AssetFlow
            </div>
          </div>

          <div className="relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-400">
            <Search className="h-4 w-4 shrink-0" />
            {mounted ? (
              <>
                <input
                  aria-label="Search"
                  className="min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="Search assets, teams, and reports"
                  value={query}
                    onChange={(e) => handleChange(e.target.value)}
                    ref={inputRef}
                  />
                </>
              ) : (
              <span className="truncate">Search assets, teams, and reports</span>
            )}

            {mounted && showDropdown && query && (
              <div className="absolute left-0 top-full mt-2 w-[560px] max-w-full rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <h4 className="mb-2 text-xs font-semibold text-slate-500">Assets</h4>
                    {results.assets.length === 0 ? <div className="text-sm text-slate-400">No assets</div> : results.assets.map((a) => (
                      <Link key={a.id} href={`/assets?q=${encodeURIComponent(a.name ?? a.tag ?? "")}`} className="block py-1 text-sm hover:underline">{a.name ?? a.tag}</Link>
                    ))}
                  </div>
                  <div>
                    <h4 className="mb-2 text-xs font-semibold text-slate-500">Teams</h4>
                    {results.departments.length === 0 ? <div className="text-sm text-slate-400">No teams</div> : results.departments.map(d => (
                      <Link key={d.id} href={`/organizations?q=${encodeURIComponent(d.name)}`} className="block py-1 text-sm hover:underline">{d.name}</Link>
                    ))}
                  </div>
                  <div>
                    <h4 className="mb-2 text-xs font-semibold text-slate-500">Reports</h4>
                    {results.audit.length === 0 ? <div className="text-sm text-slate-400">No reports</div> : results.audit.map(r => (
                      <Link key={r.id} href={`/reports?q=${encodeURIComponent(r.action)}`} className="block py-1 text-sm hover:underline">{r.action}</Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
              <Bell className="h-4 w-4" />
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-gradient-to-br from-indigo-600 to-sky-500 px-3 py-2 text-sm font-semibold text-white shadow-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">AD</span>
              <span className="hidden sm:inline">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
            <motion.aside initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} transition={{ type: "spring", stiffness: 260, damping: 24 }} className="flex h-full w-72 flex-col border-r border-slate-800 bg-slate-950 p-5 text-slate-100" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">AssetFlow</p>
                  <h2 className="mt-1 text-lg font-semibold">Menu</h2>
                </div>
                <button onClick={() => setMobileOpen(false)} className="rounded-full border border-slate-800 p-2 text-slate-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="mt-6 space-y-2">
                {links.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white">
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                <p className="font-semibold">Secure and local-first</p>
                <p className="mt-1 text-emerald-100/80">Operations that stay fast and private.</p>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
