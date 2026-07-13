"use client";

import Link from "next/link";
import { Boxes, ShieldCheck, Sparkles, Workflow, ArrowRight, BarChart3, Clock, CheckCircle2, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
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

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 dark:bg-slate-950 dark:selection:bg-indigo-900/50 dark:selection:text-indigo-100">
      
      {/* Navigation */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/70 py-4 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-900 dark:text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <Boxes className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-lg dark:from-white dark:to-slate-300">AssetFlow</span>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-5"
          >
            <Link href="/login" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
              Sign in
            </Link>
            <Link href="/signup" className="hidden rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 hover:shadow sm:inline-flex dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      <main className="relative z-10">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/5"></div>
        <div className="absolute top-1/3 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[130px] dark:bg-cyan-500/5"></div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-36 pb-20 lg:pt-48 lg:pb-32">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-indigo-50/50 px-4 py-1.5 text-xs font-semibold text-indigo-700 backdrop-blur dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-300"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
              Enterprise asset operations, reimagined
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl dark:text-white"
            >
              Manage your enterprise assets <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500">at the speed of thought.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400"
            >
              Bring together bookings, allocations, approvals, and maintenance in one stunning, high-performance workspace designed for modern teams.
            </motion.p>
            
            <motion.div 
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-10 flex items-center justify-center gap-4"
            >
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98]">
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
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
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-950/5 shadow-2xl backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/50">
              <div className="flex items-center border-b border-slate-200/80 bg-slate-100/50 px-4 py-3 dark:border-slate-800/50 dark:bg-slate-900/40">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                </div>
              </div>
              <img src="/screenshots/dashboard.png" alt="AssetFlow Dashboard" className="w-full object-cover transition-all duration-700 hover:scale-[1.01]" />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-24 sm:py-32 bg-slate-100/50 border-y border-slate-200/50 dark:bg-slate-900/20 dark:border-slate-800/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
              >
                Everything you need to scale operations
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-slate-600 dark:text-slate-400"
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                    <LayoutDashboard className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Dynamic Executive Dashboard</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                    Get a real-time overview of your entire organization's assets. Instantly see system health, storage usage, audit progress, and monthly asset growth powered by live database statistics.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-500 flex-shrink-0" /> Live Data Aggregation
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-indigo-500 flex-shrink-0" /> Interactive KPI Trends
                    </li>
                  </ul>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl dark:border-slate-800"
                >
                  <img src="/screenshots/dashboard.png" alt="Dynamic Dashboard" className="w-full object-cover" />
                </motion.div>
              </div>

              {/* Feature 2 */}
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <motion.div 
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl dark:border-slate-800 lg:order-1 order-2"
                >
                  <img src="/screenshots/assets.png" alt="Assets DataTable" className="w-full object-cover" />
                </motion.div>
                <motion.div variants={itemVariants} className="lg:order-2 order-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Lightning Fast DataTables</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                    Manage thousands of assets, bookings, and allocations effortlessly. Our premium data tables include built-in searching, status badges, and beautiful hover states for an elite user experience.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" /> Instant Search & Filtering
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" /> Responsive Layouts
                    </li>
                  </ul>
                </motion.div>
              </div>

              {/* Feature 3 */}
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
                <motion.div variants={itemVariants}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20">
                    <Workflow className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">Premium Interactive Forms</h3>
                  <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                    Registering assets or creating bookings has never looked this good. We use custom input components with floating labels, contextual error states, and animated slide-out drawers.
                  </p>
                  <ul className="mt-6 space-y-3">
                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-rose-500 flex-shrink-0" /> Animated Floating Labels
                    </li>
                    <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="h-5 w-5 text-rose-500 flex-shrink-0" /> Inline Validation
                    </li>
                  </ul>
                </motion.div>
                <motion.div 
                  variants={itemVariants}
                  className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl dark:border-slate-800"
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
              className="mx-auto max-w-2xl text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Ready to take control of your enterprise assets?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400"
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
              <Link href="/signup" className="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white shadow-xl transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 hover:scale-105 active:scale-95">
                Create your account
              </Link>
            </motion.div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-12 dark:border-slate-800/80 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-center gap-2 font-semibold text-slate-900 dark:text-white mb-4">
            <Boxes className="h-5 w-5 text-indigo-600" />
            AssetFlow
          </div>
          <p>&copy; 2026 AssetFlow Inc. All rights reserved. Built for modern enterprises.</p>
        </div>
      </footer>
    </div>
  );
}
