"use client";

import React, { useState } from "react";
import { StockOperation } from "@/types/inventory";
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, CheckCircle2, Clock, Check, Filter } from "lucide-react";

interface OperationsViewProps {
  operations: StockOperation[];
  onValidateOperation: (id: string) => void;
}

export default function OperationsView({
  operations,
  onValidateOperation,
}: OperationsViewProps) {
  const [selectedType, setSelectedType] = useState<string>("ALL");

  const filteredOps = operations.filter((op) => {
    if (selectedType === "ALL") return true;
    return op.type === selectedType;
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Warehouse Operations</h2>
          <p className="text-xs text-zinc-500">Track Inbound Receipts, Outbound Deliveries, and Internal Transfers</p>
        </div>

        {/* Filter by Type */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-zinc-400 mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Type:
          </span>
          {[
            { label: "All Moves", val: "ALL" },
            { label: "Inbound (Receipts)", val: "Receipt (Inbound)" },
            { label: "Outbound (Deliveries)", val: "Delivery (Outbound)" },
            { label: "Internal Transfers", val: "Internal Transfer" },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setSelectedType(item.val)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                selectedType === item.val
                  ? "bg-purple-600 text-white"
                  : "border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80">
            <tr>
              <th className="px-5 py-3.5">Reference</th>
              <th className="px-4 py-3.5">Type</th>
              <th className="px-4 py-3.5">Partner / Entity</th>
              <th className="px-4 py-3.5">Route (From ➔ To)</th>
              <th className="px-4 py-3.5">Items</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Odoo Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filteredOps.map((op) => (
              <tr key={op.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition">
                <td className="px-5 py-4 font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  {op.reference}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                      op.type === "Receipt (Inbound)"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : op.type === "Delivery (Outbound)"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                        : "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                    }`}
                  >
                    {op.type === "Receipt (Inbound)" && <ArrowDownLeft className="h-3 w-3" />}
                    {op.type === "Delivery (Outbound)" && <ArrowUpRight className="h-3 w-3" />}
                    {op.type === "Internal Transfer" && <ArrowLeftRight className="h-3 w-3" />}
                    {op.type}
                  </span>
                </td>

                <td className="px-4 py-4 font-medium text-zinc-800 dark:text-zinc-200">
                  {op.partner}
                </td>

                <td className="px-4 py-4 text-xs text-zinc-500">
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">{op.sourceLocation}</span>
                  <span className="mx-1.5 text-purple-600">➔</span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">{op.destinationLocation}</span>
                </td>

                <td className="px-4 py-4 font-semibold text-zinc-800 dark:text-zinc-200">
                  {op.itemCount} units (${op.totalValue.toLocaleString()})
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      op.status === "Done"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : op.status === "Ready"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {op.status === "Done" ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Clock className="h-3 w-3 text-blue-600" />
                    )}
                    {op.status}
                  </span>
                </td>

                <td className="px-4 py-4 text-right">
                  {op.status !== "Done" ? (
                    <button
                      onClick={() => onValidateOperation(op.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Validate & Post
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-400 font-medium">Archived / Posted</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
