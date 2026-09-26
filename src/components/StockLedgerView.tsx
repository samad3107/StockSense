"use client";

import React, { useState } from "react";
import { StockLedgerEntry } from "@/types/inventory";
import { History, Search, ArrowDownLeft, ArrowUpRight, ArrowLeftRight, ClipboardCheck, Filter } from "lucide-react";

interface StockLedgerViewProps {
  entries: StockLedgerEntry[];
}

export default function StockLedgerView({ entries }: StockLedgerViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.operator.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "ALL" || entry.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Stock Ledger & Move History</h2>
          </div>
          <p className="text-xs text-zinc-500">
            Immutable chronological audit trail of all warehouse physical movements and stock adjustments
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by SKU, move ref, operator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Filter by operation type */}
      <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-2.5 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs">
        <span className="font-semibold text-zinc-400 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" /> Type:
        </span>
        {["ALL", "Receipt", "Delivery", "Transfer", "Adjustment"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-md px-2.5 py-1 font-medium transition ${
              filterType === t
                ? "bg-purple-600 text-white"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80">
            <tr>
              <th className="px-5 py-3.5">Timestamp</th>
              <th className="px-4 py-3.5">Reference</th>
              <th className="px-4 py-3.5">Operation Type</th>
              <th className="px-4 py-3.5">Item & SKU</th>
              <th className="px-4 py-3.5">Stock Delta (Change)</th>
              <th className="px-4 py-3.5">Route (From ➔ To)</th>
              <th className="px-4 py-3.5">Operator</th>
              <th className="px-4 py-3.5">Audit Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-zinc-500">
                  No movement records found.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition">
                  <td className="px-5 py-3.5 font-mono text-xs text-zinc-500 whitespace-nowrap">
                    {entry.timestamp}
                  </td>

                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
                    {entry.reference}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                        entry.type === "Receipt"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : entry.type === "Delivery"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                          : entry.type === "Transfer"
                          ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {entry.type === "Receipt" && <ArrowDownLeft className="h-3 w-3" />}
                      {entry.type === "Delivery" && <ArrowUpRight className="h-3 w-3" />}
                      {entry.type === "Transfer" && <ArrowLeftRight className="h-3 w-3" />}
                      {entry.type === "Adjustment" && <ClipboardCheck className="h-3 w-3" />}
                      {entry.type}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{entry.productName}</p>
                    <p className="font-mono text-xs text-zinc-400">{entry.sku}</p>
                  </td>

                  <td className="px-4 py-3.5 font-mono text-xs font-bold">
                    {entry.quantityChange > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        +{entry.quantityChange} {entry.uom}
                      </span>
                    ) : entry.quantityChange < 0 ? (
                      <span className="text-rose-600 dark:text-rose-400">
                        {entry.quantityChange} {entry.uom}
                      </span>
                    ) : (
                      <span className="text-zinc-500">
                        0 (Location Move)
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <span>{entry.fromLocation}</span>
                    <span className="mx-1 text-purple-600">➔</span>
                    <span>{entry.toLocation}</span>
                  </td>

                  <td className="px-4 py-3.5 text-xs font-medium text-zinc-800 dark:text-zinc-200">
                    {entry.operator}
                  </td>

                  <td className="px-4 py-3.5 text-xs text-zinc-500 italic max-w-xs truncate">
                    {entry.notes || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
