"use client";

import React from "react";
import {
  Boxes,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Truck,
  ArrowLeftRight,
  ClipboardCheck,
  Lock,
  Warehouse,
  CheckCircle2,
  Sun,
  Moon,
} from "lucide-react";
import { Currency } from "@/types/inventory";
import { useTheme } from "@/context/ThemeContext";

interface LandingPageProps {
  onOpenAuth: () => void;
  currency: Currency;
}

export default function LandingPage({ onOpenAuth }: LandingPageProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans flex flex-col">
      {/* Landing Navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight">StockSense</span>
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  Enterprise IMS
                </span>
              </div>
              <p className="text-[11px] text-zinc-500">Real-Time Inventory Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#features"
              className="hidden md:inline-block text-xs font-semibold text-zinc-600 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 transition"
            >
              Key Features
            </a>
            <a
              href="#roles"
              className="hidden md:inline-block text-xs font-semibold text-zinc-600 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 transition"
            >
              Role Capabilities
            </a>

            {/* Theme Toggle Button (Hydration Safe) */}
            <button
              onClick={toggleTheme}
              title={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center justify-center h-8 w-8 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
            >
              {!mounted ? (
                <span className="h-4 w-4" />
              ) : theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-zinc-600" />
              )}
            </button>

            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition"
            >
              <Lock className="h-3.5 w-3.5" />
              Sign In / Launch App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-zinc-100 dark:border-zinc-900 bg-gradient-to-b from-purple-50/40 via-white to-white dark:from-purple-950/20 dark:via-zinc-950 dark:to-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1.5 text-xs font-semibold text-purple-800 dark:border-purple-900/60 dark:bg-purple-950/40 dark:text-purple-300 mb-6">
            <ShieldCheck className="h-4 w-4 text-purple-600" />
            <span>Enterprise Warehouse Logistics & Real-Time Stock Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Stop Tracking Inventory on Spreadsheets.{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
              Automate the Entire Stock Flow.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A centralized, real-time IMS engineered for modern warehouses. From vendor receipts and customer delivery
            orders to internal rack transfers and cycle count adjustments — with a 100% immutable Stock Ledger.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition"
            >
              <span>Access Inventory Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#roles"
              className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition"
            >
              Explore Role Views
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
              <p className="text-[11px] font-semibold text-zinc-500">Live Traceability</p>
              <h4 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">100% Audited</h4>
              <p className="text-[11px] text-emerald-600 font-medium">Every move in Ledger</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
              <p className="text-[11px] font-semibold text-zinc-500">Automated Reordering</p>
              <h4 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">Zero Stockouts</h4>
              <p className="text-[11px] text-purple-600 font-medium">Min/Max Thresholds</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
              <p className="text-[11px] font-semibold text-zinc-500">Multi-Location</p>
              <h4 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">Racks & Bins</h4>
              <p className="text-[11px] text-blue-600 font-medium">Internal transfers</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 shadow-xs">
              <p className="text-[11px] font-semibold text-zinc-500">Currency Support</p>
              <h4 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100">₹ INR Default</h4>
              <p className="text-[11px] text-zinc-500 font-medium">Dual toggle to $ USD</p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Roles Breakdown */}
      <section id="roles" className="py-16 bg-zinc-50 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Role-Based Access Architecture
            </span>
            <h2 className="mt-1 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              Tailored Experiences by Warehouse Responsibility
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              StockSense provides dedicated operational cockpits tailored for Managers and Warehouse Staff.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Inventory Manager Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-purple-100 px-2.5 py-1 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    Role: Inventory Manager
                  </span>
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="mt-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  Strategic Oversight & Financial Controls
                </h3>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                  Targeted at operations directors and inventory controllers needing high-level analytics, valuation KPIs, and procurement rules.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Total inventory valuation ($ / ₹) across all warehouse hubs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Vendor Procurement & Inbound Receipt validation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Customer Delivery Order approvals & reservations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Master SKU pricing, categories, and min/max reorder rules</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={onOpenAuth}
                  className="w-full rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition"
                >
                  Log In as Inventory Manager
                </button>
              </div>
            </div>

            {/* Warehouse Staff Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    Role: Warehouse Staff
                  </span>
                  <Warehouse className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  Floor Operations: Picking, Shelving & Counting
                </h3>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                  Targeted at warehouse operators on the ground executing putaway, inter-rack transfers, packing customer boxes, and cycle count audits.
                </p>

                <ul className="mt-5 space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Inter-Rack internal transfers (Main Store ➔ Production Rack)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Physical count reconciliation (Cycle counting & damaged scrap logging)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Picking and packing execution for customer orders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <span>Streamlined task lists without distracting financial costs</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={onOpenAuth}
                  className="w-full rounded-xl bg-zinc-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition"
                >
                  Log In as Warehouse Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid (Core Warehouse flows) */}
      <section id="features" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
            Core Platform Modules
          </span>
          <h2 className="mt-1 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            Engineered for Complete Physical Accuracy
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-950/60 mb-3">
              <Truck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">1. Vendor Receipts</h4>
            <p className="mt-1 text-xs text-zinc-500">
              When raw goods arrive from suppliers, validation automatically increments stock and logs to ledger.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-950/60 mb-3">
              <ArrowRight className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">2. Delivery Orders</h4>
            <p className="mt-1 text-xs text-zinc-500">
              Pick and pack customer shipments. Validation decreases stock automatically to prevent overselling.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-950/60 mb-3">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">3. Internal Transfers</h4>
            <p className="mt-1 text-xs text-zinc-500">
              Move items between aisles, storage racks, and production lines while keeping global count identical.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
            <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center dark:bg-amber-950/60 mb-3">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">4. Stock Adjustments</h4>
            <p className="mt-1 text-xs text-zinc-500">
              Reconcile physical inventory counts against digital records. Auto-logs shrinkage or damage variances.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 py-6 px-4 text-center text-xs text-zinc-500 dark:border-zinc-800">
        <div className="flex items-center justify-center gap-1 font-semibold text-zinc-700 dark:text-zinc-300">
          <span>StockSense</span> • <span>Real-Time Warehouse Management System</span>
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">
          Team: Syed Moazam, Mohammed Abdul Samad, Syed Omer Ali
        </p>
      </footer>
    </div>
  );
}
