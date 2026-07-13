"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function doLogin(e: string, p: string) {
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: e, password: p }),
    });
    if (response.ok) {
      router.push("/dashboard");
      return;
    }
    const data = await response.json().catch(() => ({}));
    setError(data.message || "Unable to sign in. Please try again.");
    setLoading(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await doLogin(email, password);
  }

  async function handleAdminLogin() {
    setEmail("admin123");
    setPassword("123");
    await doLogin("admin123", "123");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.12),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-6 dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_transparent_45%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)]">
      <Card className="w-full max-w-md border-slate-200/80 shadow-[0_20px_80px_-36px_rgba(15,23,42,0.35)] dark:border-slate-800">
        <CardHeader className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">AssetFlow</p>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-300">Sign in to continue working from your dashboard.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">Email / Username</label>
              <input id="email" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:border-slate-300" placeholder="you@company.com or admin123" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">Password</label>
              <input id="password" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:border-slate-300" placeholder="••••••••" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">{error}</p> : null}
            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : "Sign in"}
            </Button>
          </form>

          {/* Admin Quick Login */}
          <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Admin Access</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Demo credentials: <span className="font-mono font-medium text-slate-700 dark:text-slate-300">admin123</span> / <span className="font-mono font-medium text-slate-700 dark:text-slate-300">123</span>
            </p>
            <button
              type="button"
              onClick={handleAdminLogin}
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Login as Admin
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
            Need an account? <Link href="/signup" className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-white">Create one</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

