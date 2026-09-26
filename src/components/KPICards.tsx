"use client";

import React from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  IndianRupee,
  DollarSign,
} from "lucide-react";
import { Currency } from "@/types/inventory";
import { formatCurrency } from "@/utils/formatters";

export interface DashboardKPIData {
  totalValuation: number;
  totalProductsCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  scheduledTransfers: number;
}

interface KPICardsProps {
  data: DashboardKPIData;
  currency: Currency;
  onNavigateTab: (tab: "products" | "receipts" | "deliveries" | "transfers") => void;
}

export default function KPICards({ data, currency, onNavigateTab }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {/* 1. Total Products in Stock & Valuation */}
      <div
        onClick={() => onNavigateTab("products")}
        className="cursor-pointer relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-xs hover:border-purple-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Total In Stock
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {data.totalProductsCount} SKUs
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
              {formatCurrency(data.totalValuation, currency)}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            {currency === "INR" ? <IndianRupee className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
          </div>
        </div>
      </div>

      {/* 2. Low Stock / Out of Stock Items */}
      <div
        onClick={() => onNavigateTab("products")}
        className="cursor-pointer relative overflow-hidden rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs hover:bg-amber-50 hover:shadow-md dark:border-amber-900/40 dark:bg-amber-950/20 transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              Low / Out of Stock
            </p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <h3 className="text-2xl font-extrabold text-amber-900 dark:text-amber-300">
                {data.lowStockCount}
              </h3>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                ({data.outOfStockCount} Out)
              </span>
            </div>
            <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400 font-medium">
              Needs procurement ➔
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Pending Receipts (Incoming Stock) */}
      <div
        onClick={() => onNavigateTab("receipts")}
        className="cursor-pointer relative overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-xs hover:bg-emerald-50 hover:shadow-md dark:border-emerald-900/40 dark:bg-emerald-950/20 transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Pending Receipts
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-emerald-900 dark:text-emerald-300">
              {data.pendingReceipts} Inbound
            </h3>
            <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              Vendor arrivals ➔
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 4. Pending Deliveries (Outgoing Stock) */}
      <div
        onClick={() => onNavigateTab("deliveries")}
        className="cursor-pointer relative overflow-hidden rounded-xl border border-blue-100 bg-blue-50/40 p-4 shadow-xs hover:bg-blue-50 hover:shadow-md dark:border-blue-900/40 dark:bg-blue-950/20 transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-400">
              Pending Deliveries
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-blue-900 dark:text-blue-300">
              {data.pendingDeliveries} Outbound
            </h3>
            <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-400 font-medium">
              Orders to ship ➔
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 5. Internal Transfers Scheduled */}
      <div
        onClick={() => onNavigateTab("transfers")}
        className="cursor-pointer relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-xs hover:border-purple-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Scheduled Transfers
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {data.scheduledTransfers} Moves
            </h3>
            <p className="mt-0.5 text-xs text-zinc-500 font-medium">
              Inter-warehouse ➔
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
