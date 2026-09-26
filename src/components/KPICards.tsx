"use client";

import React from "react";
import { DollarSign, PackageCheck, AlertTriangle, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { InventoryStats } from "@/types/inventory";

interface KPICardsProps {
  stats: InventoryStats;
  onFilterLowStock: () => void;
  onFilterOutOfStock?: () => void;
  onGoToOperations: () => void;
}

export default function KPICards({
  stats,
  onFilterLowStock,
  onFilterOutOfStock,
  onGoToOperations,
}: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Valuation */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Total Stock Value
            </p>
            <h3 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              ${stats.totalValuation.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
            <p className="mt-1 text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span>↑ 4.2%</span> vs last audit cycle
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Total Items On Hand */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Units in Warehouse
            </p>
            <h3 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {stats.totalItems.toLocaleString()}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Across all recorded SKUs
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <PackageCheck className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Critical Stock Alerts */}
      <div
        onClick={onFilterLowStock}
        className="cursor-pointer relative overflow-hidden rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs transition hover:bg-amber-50 hover:shadow-md dark:border-amber-900/50 dark:bg-amber-950/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              Reorder Alerts
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                {stats.lowStockCount} Low
              </h3>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onFilterOutOfStock?.();
                }}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                ({stats.outOfStockCount} Out)
              </span>
            </div>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-400 font-medium">
              Click to view flagged items ➔
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Pending Operations */}
      <div
        onClick={onGoToOperations}
        className="cursor-pointer relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Pending Operations
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-sm font-semibold text-emerald-600 flex items-center gap-0.5">
                <ArrowDownLeft className="h-4 w-4" /> {stats.pendingReceipts} In
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-sm font-semibold text-blue-600 flex items-center gap-0.5">
                <ArrowUpRight className="h-4 w-4" /> {stats.pendingDeliveries} Out
              </span>
            </div>
            <p className="mt-1 text-xs text-zinc-500 font-medium">
              Awaiting verification ➔
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <ArrowUpRight className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
