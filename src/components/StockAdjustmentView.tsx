"use client";

import React, { useState } from "react";
import { Product, StockAdjustment } from "@/types/inventory";
import { ClipboardCheck, Plus, CheckCircle2 } from "lucide-react";

interface StockAdjustmentViewProps {
  products: Product[];
  adjustments: StockAdjustment[];
  onApplyAdjustment: (newAdj: Omit<StockAdjustment, "id" | "reference" | "status" | "date">) => void;
}

export default function StockAdjustmentView({
  products,
  adjustments,
  onApplyAdjustment,
}: StockAdjustmentViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [countedQty, setCountedQty] = useState<number>(0);
  const [reason, setReason] = useState<StockAdjustment["reason"]>("Damaged Items");

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const difference = selectedProduct ? countedQty - selectedProduct.quantity : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    onApplyAdjustment({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      location: selectedProduct.location,
      recordedQuantity: selectedProduct.quantity,
      countedQuantity: Number(countedQty),
      difference,
      uom: selectedProduct.uom,
      reason,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Physical Stock Adjustments</h2>
          </div>
          <p className="text-xs text-zinc-500">
            Reconcile physical inventory counts against recorded system stock (damage, shrinkage, cycle count)
          </p>
        </div>

        <button
          onClick={() => {
            if (selectedProduct) setCountedQty(selectedProduct.quantity);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition"
        >
          <Plus className="h-4 w-4" />
          New Physical Count
        </button>
      </div>

      {/* Adjustments Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80">
            <tr>
              <th className="px-5 py-3.5">Reference</th>
              <th className="px-4 py-3.5">Date</th>
              <th className="px-4 py-3.5">Product & Location</th>
              <th className="px-4 py-3.5">Recorded Qty</th>
              <th className="px-4 py-3.5">Counted Qty</th>
              <th className="px-4 py-3.5">Variance (Difference)</th>
              <th className="px-4 py-3.5">Reason Code</th>
              <th className="px-4 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {adjustments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-zinc-500">
                  No inventory adjustments recorded yet.
                </td>
              </tr>
            ) : (
              adjustments.map((adj) => (
                <tr key={adj.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {adj.reference}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-zinc-500">{adj.date}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">{adj.productName}</p>
                    <p className="font-mono text-xs text-zinc-400">{adj.location}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                    {adj.recordedQuantity} {adj.uom}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
                    {adj.countedQuantity} {adj.uom}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs font-bold">
                    {adj.difference < 0 ? (
                      <span className="text-rose-600 dark:text-rose-400">
                        {adj.difference} {adj.uom}
                      </span>
                    ) : adj.difference > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        +{adj.difference} {adj.uom}
                      </span>
                    ) : (
                      <span className="text-zinc-400">0 (Match)</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {adj.reason}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Applied
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Adjustment Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              New Physical Count Adjustment
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Updates recorded stock to match real physical count and logs variance in the Stock Ledger.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Product / Location
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod) setCountedQty(prod.quantity);
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — Recorded: {p.quantity} {p.uom}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-3 rounded-lg dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800">
                <div>
                  <span className="text-[11px] text-zinc-500">System Recorded:</span>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {selectedProduct.quantity} {selectedProduct.uom}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500">Location:</span>
                  <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate">
                    {selectedProduct.location}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Physical Counted Quantity ({selectedProduct.uom}) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={countedQty}
                  onChange={(e) => setCountedQty(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-mono font-bold text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Resulting Variance:</span>
                  <span
                    className={`font-mono font-bold ${
                      difference < 0 ? "text-rose-600" : difference > 0 ? "text-emerald-600" : "text-zinc-500"
                    }`}
                  >
                    {difference > 0 ? `+${difference}` : difference} {selectedProduct.uom}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Adjustment Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as StockAdjustment["reason"])}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <option value="Damaged Items">Damaged Items (Physical defect)</option>
                  <option value="Cycle Count">Routine Cycle Count Audit</option>
                  <option value="Theft / Loss">Theft / Unaccounted Loss</option>
                  <option value="Found Stock">Found Stock / Inventory Surplus</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  Validate & Post Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
