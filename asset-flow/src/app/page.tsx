"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Boxes, ShieldCheck, Sparkles, Workflow, ArrowRight, BarChart3, Clock, CheckCircle2, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

function AnimatedStat({ value, suffix = "", prefix = "", label }: { value: number; suffix?: string; prefix?: string; label: string }) {
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let frame = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [hasAnimated, value]);

  const formatted = Number.isInteger(value)
    ? `${prefix}${Math.round(display)}${suffix}`
    : `${prefix}${display.toFixed(1)}${suffix}`;

  return (
    <div ref={ref} className="rounded-[20px] border border-white/10 bg-black/40 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/8">
      <div className="text-3xl font-semibold tracking-[-0.02em] text-white">{formatted}</div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
    </div>
  );
}

export default function HomePage() {
  const [footerSpotlight, setFooterSpotlight] = useState({ x: 50, y: 50 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  } as const;

  const handleFooterMove = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setFooterSpotlight({ x, y });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30 selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/60 py-4 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/80 to-fuchsia-500/70 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_10px_30px_rgba(168,85,247,0.25)]">
              <Boxes className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-lg font-semibold text-transparent">AssetFlow</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-5"
          >
            <Link href="/login" className="text-sm font-medium text-slate-300 transition hover:text-white">
              Sign in
            </Link>
            <Link href="/signup" className="hidden rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_30px_rgba(0,0,0,0.3)] transition hover:-translate-y-0.5 hover:bg-white/15 sm:inline-flex">
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* Glow Effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-[140px]" />
          <div className="absolute right-0 top-1/3 h-[600px] w-[600px] rounded-full bg-fuchsia-500/10 blur-[160px]" />
          <div className="absolute left-0 top-1/2 h-[420px] w-[420px] rounded-full bg-slate-500/10 blur-[160px]" />
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-36 pb-20 lg:pt-48 lg:pb-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 backdrop-blur-xl"
            >
              <Sparkles className="h-3.5 w-3.5 text-violet-300 animate-pulse" />
              Enterprise asset operations, reimagined
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mx-auto max-w-4xl text-5xl font-semibold tracking-[-0.03em] text-white sm:text-7xl"
            >
              Manage your enterprise assets <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-violet-200 to-slate-100">at the speed of thought.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400"
            >
              Bring together bookings, allocations, approvals, and maintenance in one stunning, high-performance workspace designed for modern teams.
            </motion.p>
            
            <motion.div 
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(168,85,247,0.25)] transition-all hover:-translate-y-0.5 hover:scale-[1.01] active:scale-[0.98]">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition hover:-translate-y-0.5 hover:bg-white/10">
                View live demo
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, type: "spring", stiffness: 50 }}
            className="mx-auto mt-20 max-w-7xl px-6"
          >
            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-2 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="flex items-center rounded-[18px] border border-white/10 bg-black/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                </div>
              </div>
              <img src="/screenshots/dashboard.png" alt="AssetFlow Dashboard" className="mt-2 w-full rounded-[18px] object-cover transition-all duration-700 hover:scale-[1.01]" />
            </div>
          </motion.div>
        </section>

        {/* Premium Dashboard Section */}
        <section className="relative overflow-hidden border-y border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.12),transparent_50%)] py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.06] to-black/40 p-6 shadow-[0_25px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-8 lg:p-10"
            >
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-violet-300" />
                    Premium control plane
                  </div>
                  <h3 className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
                    Enterprise-grade governance, built into every workflow.
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate-400">
                    From approvals to permission boundaries, every interaction feels deliberate, secure, and beautifully orchestrated across your asset operations.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <AnimatedStat value={99.8} suffix="%" label="Security uptime" />
                    <AnimatedStat value={18} suffix="k" label="Daily actions" />
                    <AnimatedStat value={4.9} suffix="/5" label="Ops confidence" />
                  </div>

                  <div className="mt-8 grid gap-4 lg:grid-cols-2">
                    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-[20px] border border-violet-400/20 bg-violet-500/10 p-5 shadow-[0_10px_35px_rgba(139,92,246,0.12)]">
                      <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
                        <ShieldCheck className="h-4 w-4" />
                        RBAC Overview
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        Admins, asset managers, and department heads operate with scoped approvals and role-aware controls.
                      </p>
                    </motion.div>
                    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-[20px] border border-white/10 bg-black/40 p-5 backdrop-blur-xl">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <LayoutDashboard className="h-4 w-4 text-violet-300" />
                        Permission Management
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-300">
                        Permissions stay readable and secure with context-aware access checks across assets, bookings, and maintenance.
                      </p>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-[24px] border border-white/10 bg-black/50 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                >
                  <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-4">
                    <div className="flex items-center justify-between rounded-[16px] border border-white/10 bg-black/50 px-4 py-3">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Security status</div>
                        <div className="mt-1 text-sm font-semibold text-white">Protected workspace</div>
                      </div>
                      <div className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
                        Live
                      </div>
                    </div>

                    <div className="mt-4 rounded-[18px] border border-white/10 bg-black/40 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-400">
                        <span>Access oversight</span>
                        <span className="font-medium text-white">92% aligned</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white/10">
                        <div className="h-2 w-[92%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                      </div>

                      <div className="mt-5 grid gap-3">
                        <div className="flex items-center justify-between rounded-[14px] border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">
                          <span>Admin approvals</span>
                          <span className="font-semibold text-white">14 pending</span>
                        </div>
                        <div className="flex items-center justify-between rounded-[14px] border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">
                          <span>Audit trail</span>
                          <span className="font-semibold text-white">Realtime</span>
                        </div>
                        <div className="flex items-center justify-between rounded-[14px] border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">
                          <span>Policy sync</span>
                          <span className="font-semibold text-white">Secure</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-y border-white/10 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.08),transparent_70%)] py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl"
              >
                Everything you need to scale operations
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-slate-400"
              >
                AssetFlow replaces messy spreadsheets with a streamlined, real-time command center for your entire organization.
              </motion.p>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="mx-auto mt-16 max-w-7xl space-y-32"
            >
              
              {/* Feature 1 */}
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <motion.div variants={itemVariants}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-violet-200 shadow-[0_10px_30px_rgba(139,92,246,0.18)]">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">Dynamic Executive Dashboard</h3>
                  <p className="mt-4 text-base leading-7 text-slate-400">
                    Get a real-time overview of your entire organization's assets. Instantly see system health, storage usage, audit progress, and monthly asset growth powered by live database statistics.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex gap-3 text-sm text-slate-400">
                      <CheckCircle2 className="h-5 w-5 text-violet-300 flex-shrink-0" /> Live Data Aggregation
                    </li>
                    <li className="flex gap-3 text-sm text-slate-400">
                      <CheckCircle2 className="h-5 w-5 text-violet-300 flex-shrink-0" /> Interactive KPI Trends
                    </li>
                  </ul>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                >
                  <img src="/screenshots/dashboard.png" alt="Dynamic Dashboard" className="w-full object-cover" />
                </motion.div>
              </div>

              {/* Feature 2 */}
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <motion.div 
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:order-1 order-2"
                >
                  <img src="/screenshots/assets.png" alt="Assets DataTable" className="w-full object-cover" />
                </motion.div>
                <motion.div variants={itemVariants} className="lg:order-2 order-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-violet-200 shadow-[0_10px_30px_rgba(139,92,246,0.18)]">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">Lightning Fast DataTables</h3>
                  <p className="mt-4 text-base leading-7 text-slate-400">
                    Manage thousands of assets, bookings, and allocations effortlessly. Our premium data tables include built-in searching, status badges, and beautiful hover states for an elite user experience.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex gap-3 text-sm text-slate-400">
                      <CheckCircle2 className="h-5 w-5 text-violet-300 flex-shrink-0" /> Instant Search & Filtering
                    </li>
                    <li className="flex gap-3 text-sm text-slate-400">
                      <CheckCircle2 className="h-5 w-5 text-violet-300 flex-shrink-0" /> Responsive Layouts
                    </li>
                  </ul>
                </motion.div>
              </div>

              {/* Feature 3 */}
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <motion.div variants={itemVariants}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-violet-200 shadow-[0_10px_30px_rgba(139,92,246,0.18)]">
                    <Workflow className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">Premium Interactive Forms</h3>
                  <p className="mt-4 text-base leading-7 text-slate-400">
                    Registering assets or creating bookings has never looked this good. We use custom input components with floating labels, contextual error states, and animated slide-out drawers.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex gap-3 text-sm text-slate-400">
                      <CheckCircle2 className="h-5 w-5 text-violet-300 flex-shrink-0" /> Animated Floating Labels
                    </li>
                    <li className="flex gap-3 text-sm text-slate-400">
                      <CheckCircle2 className="h-5 w-5 text-violet-300 flex-shrink-0" /> Inline Validation
                    </li>
                  </ul>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                >
                  <img src="/screenshots/drawer.png" alt="Register Asset Drawer" className="w-full object-cover" />
                </motion.div>
              </div>
              
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mx-auto max-w-2xl text-4xl font-semibold tracking-[-0.02em] text-white"
            >
              Ready to take control of your enterprise assets?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-400"
            >
              Join thousands of teams streamlining their operations with AssetFlow's modern platform.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <Link href="/signup" className="rounded-full border border-white/10 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:bg-white/15 hover:scale-[1.01] active:scale-[0.98]">
                Create your account
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer
        className="relative overflow-hidden border-t border-white/10 bg-black/85 py-14 sm:py-16"
        onMouseMove={handleFooterMove}
        onMouseLeave={() => setFooterSpotlight({ x: 50, y: 50 })}
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent_60%)]" />
        <div
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
          style={{
            ['--x' as string]: `${footerSpotlight.x}%`,
            ['--y' as string]: `${footerSpotlight.y}%`,
            background: `radial-gradient(320px circle at var(--x, 50%) var(--y, 50%), rgba(167,139,250,0.16), transparent 70%)`,
          }}
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
              <div>
                <div className="flex items-center gap-2.5 font-semibold text-white">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/80 to-fuchsia-500/70 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_10px_30px_rgba(168,85,247,0.25)]">
                    <Boxes className="h-5 w-5" />
                  </div>
                  <span className="text-lg">Asset-Flow</span>
                </div>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
                  Secure, elegant asset operations for modern teams that need clarity, speed, and control.
                </p>
                <p className="mt-4 text-sm text-slate-500">
                  Trusted by modern teams for secure asset management.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Navigate</h4>
                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                  {[
                    ["Features", "/#features"],
                    ["Security", "/#security"],
                    ["Pricing", "/signup"],
                    ["Documentation", "/login"],
                    ["Contact", "/signup"],
                  ].map(([label, href]) => (
                    <li key={label}>
                      <Link href={href} className="transition hover:text-white">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Stay connected</h4>
                <div className="mt-4 flex items-center gap-3">
                  {[
                    ["GitHub", "https://github.com/Harshi-max/"],
                    ["LinkedIn", "https://www.linkedin.com/in/harshitha-arava/"],
                    ["Mail", "mailto:srilakshmidevimutyala@gmail.com"],
                  ].map(([label, href]) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                      aria-label={label}
                    >
                      {label === "GitHub" ? "GH" : label === "LinkedIn" ? "in" : "@"}
                    </a>
                  ))}
                </div>

                <form className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="h-11 flex-1 rounded-full border border-white/10 bg-black/40 px-4 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  <button className="h-11 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)]">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 Asset-Flow. All rights reserved.</p>
              <p className="text-slate-400">Built for premium operations and secure collaboration.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
