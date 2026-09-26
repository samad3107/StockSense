"use client";

import React from "react";
import { Product, StockOperation, StockLedgerEntry } from "@/types/inventory";
import {
  ArrowLeftRight,
  ClipboardCheck,
  CheckCircle2,
  Package,
  Layers,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
} from "lucide-react";

interface StaffDashboardViewProps {
  products: Product[];
  operations: StockOperation[];
  recentLedger: StockLedgerEntry[];
  onNavigateTab: (tab: "transfers" | "adjustments" | "receipts" | "deliveries") => void;
  onValidateOperation: (id: string) => void;
}

export default function StaffDashboardView({
  products,
  operations,
  recentLedger,
  onNavigateTab,
  onValidateOperation,
}: StaffDashboardViewProps) {
  const pendingReceipts = operations.filter((op) => op.type === "Receipt" && op.status !== "Done");
  const pendingDeliveries = operations.filter((op) => op.type === "Delivery" && op.status !== "Done");
  const pendingTransfers = operations.filter((op) => op.type === "Transfer" && op.status !== "Done");

  return (
    <div className="space-y-6">
      {/* Staff Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-zinc-900 p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-200 border border-blue-400/30">
              <Layers className="h-3.5 w-3.5" /> Warehouse Staff Cockpit • Floor Operations
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
              Picking, Shelving & Physical Counting
            </h2>
            <p className="mt-1 text-xs text-blue-200/90 max-w-xl">
              Execute inter-rack transfers, verify incoming vendor boxes, pick customer delivery orders,
              and perform cycle count audits.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateTab("transfers")}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition"
            >
              <ArrowLeftRight className="h-4 w-4" />
              Transfer Between Racks
            </button>
            <button
              onClick={() => onNavigateTab("adjustments")}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-xs hover:bg-white/20 transition border border-white/15"
            >
              <ClipboardCheck className="h-4 w-4" />
              Physical Count (Audit)
            </button>
          </div>
        </div>
      </div>

      {/* Floor Task Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Putaway & Shelving */}
        <div
          onClick={() => onNavigateTab("receipts")}
          className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 hover:border-blue-400 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase text-zinc-500">Putaway / Inbound Shelving</p>
              <h3 className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {pendingReceipts.length} Batches
              </h3>
              <p className="mt-0.5 text-xs text-blue-600 font-medium">Items waiting on receiving dock ➔</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Picking & Packing */}
        <div
          onClick={() => onNavigateTab("deliveries")}
          className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 hover:border-emerald-400 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase text-zinc-500">Pick & Pack Outbound</p>
              <h3 className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {pendingDeliveries.length} Shipments
              </h3>
              <p className="mt-0.5 text-xs text-emerald-600 font-medium">Ready for customer dispatch ➔</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Internal Transfers Scheduled */}
        <div
          onClick={() => onNavigateTab("transfers")}
          className="cursor-pointer rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 hover:border-purple-400 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase text-zinc-500">Rack-to-Rack Moves</p>
              <h3 className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {pendingTransfers.length} Transfers
              </h3>
              <p className="mt-0.5 text-xs text-purple-600 font-medium">Aisle relocation tasks ➔</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60">
              <ArrowLeftRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Floor Task Queue & Locator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Floor Tasks to Validate */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Pending Floor Tasks (Ready to Execute)
            </h3>
            <span className="text-xs font-semibold text-zinc-400">Direct Actions</span>
          </div>

          <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {operations.filter((op) => op.status !== "Done").length === 0 ? (
              <div className="py-6 text-center text-zinc-400">
                <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto mb-1" />
                <p>All floor operations are currently validated!</p>
              </div>
            ) : (
              operations
                .filter((op) => op.status !== "Done")
                .map((op) => (
                  <div key={op.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                          {op.reference}
                        </span>
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {op.type}
                        </span>
                      </div>
                      <p className="mt-0.5 font-medium text-zinc-800 dark:text-zinc-200">
                        {op.productName} • <strong className="text-purple-600">{op.quantity} {op.uom}</strong>
                      </p>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        {op.sourceLocation} ➔ {op.destinationLocation}
                      </p>
                    </div>

                    <button
                      onClick={() => onValidateOperation(op.id)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                    >
                      Complete & Post
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Physical Bin & Rack Locator (No financial numbers, purely operational) */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-600" />
              Physical Item Locator & Shelf Availability
            </h3>
            <span className="text-xs font-semibold text-zinc-400 font-mono">Floor Map</span>
          </div>

          <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">{p.name}</p>
                  <p className="font-mono text-[11px] text-purple-600">{p.sku}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {p.location}
                  </span>
                  <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    {p.quantity} {p.uom} on shelf
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Move History Log for Staff */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 pb-3 dark:border-zinc-800">
          Recent Floor Movements Executed
        </h3>
        <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
          {recentLedger.slice(0, 3).map((entry) => (
            <div key={entry.id} className="py-2 flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{entry.productName}</span>
                <span className="ml-2 font-mono text-[11px] text-zinc-400">
                  ({entry.fromLocation} ➔ {entry.toLocation})
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-purple-600">
                  {entry.quantityChange > 0 ? `+${entry.quantityChange}` : entry.quantityChange} {entry.uom}
                </span>
                <span className="ml-2 text-[10px] text-zinc-400">{entry.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
