"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role: "EMPLOYEE" }),
    });

    if (response.ok) {
      router.push("/login");
      return;
    }

    const data = await response.json().catch(() => ({}));
    setError(data.message || "Unable to create your account right now.");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.12),_transparent_40%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] p-6 dark:bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_transparent_45%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)]">
      <Card className="w-full max-w-md border-slate-200/80 shadow-[0_20px_80px_-36px_rgba(15,23,42,0.35)] dark:border-slate-800">
        <CardHeader className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">AssetFlow</p>
          <CardTitle className="text-2xl">Create your workspace</CardTitle>
          <p className="text-sm text-slate-600 dark:text-slate-300">Set up your account and start organizing operations.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="name">Name</label>
              <input id="name" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:border-slate-300" placeholder="Jordan Lee" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">Email</label>
              <input id="email" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:border-slate-300" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">Password</label>
              <input id="password" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:border-slate-300" placeholder="Create a strong password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">{error}</p> : null}
            <Button className="w-full" size="lg" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
            Already have an account? <Link href="/login" className="font-semibold text-slate-900 underline-offset-4 hover:underline dark:text-white">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
