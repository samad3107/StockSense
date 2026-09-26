"use client";

import React, { useState } from "react";
import { Product, StockStatus, Currency } from "@/types/inventory";
import { Search, Filter, Plus, PlusCircle, MinusCircle, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface ProductTableProps {
  products: Product[];
  currency: Currency;
  onAddProductClick: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  filterStatus?: StockStatus | "ALL";
  setFilterStatus: (status: StockStatus | "ALL") => void;
}

export default function ProductTable({
  products,
  currency,
  onAddProductClick,
  onUpdateQuantity,
  filterStatus = "ALL",
  setFilterStatus,
}: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "Raw Materials", "Finished Goods", "Electronics", "Hardware", "Packaging"];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;
    const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Products Catalog & Inventory</h2>
          <p className="text-xs text-zinc-500">Manage SKUs, Unit of Measure (UoM), locations, and reorder levels</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search SKU, item name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          {/* Add Product Button */}
          <button
            onClick={onAddProductClick}
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition"
          >
            <Plus className="h-4 w-4" />
            Create Product
          </button>
        </div>
      </div>

      {/* Category & Status Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-5 py-3 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/40">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-zinc-400 mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                selectedCategory === cat
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5">
          {(["ALL", "In Stock", "Low Stock", "Out of Stock"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                filterStatus === st
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80">
            <tr>
              <th className="px-5 py-3.5">SKU & Product Name</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Storage Location</th>
              <th className="px-4 py-3.5">On Hand (UoM)</th>
              <th className="px-4 py-3.5">Reorder Thresholds</th>
              <th className="px-4 py-3.5">Unit Valuation</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Quick Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-zinc-400" />
                    <p className="font-medium">No products match your current filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const stockPercent = Math.min(100, Math.round((p.quantity / p.maxThreshold) * 100));

                return (
                  <tr key={p.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition">
                    {/* SKU & Name */}
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
                          {p.sku}
                        </span>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">{p.name}</p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {p.category}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 font-mono text-xs text-zinc-600 dark:text-zinc-400">
                      {p.location}
                    </td>

                    {/* Stock Level with UoM */}
                    <td className="px-4 py-4">
                      <div className="flex items-baseline gap-1 font-bold text-zinc-900 dark:text-zinc-100">
                        <span className="text-base">{p.quantity}</span>
                        <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">{p.uom}</span>
                      </div>
                    </td>

                    {/* Reorder thresholds */}
                    <td className="px-4 py-4">
                      <div className="w-32">
                        <div className="flex justify-between text-[11px] text-zinc-400">
                          <span>Min: {p.minThreshold}</span>
                          <span>Max: {p.maxThreshold}</span>
                        </div>
                        <div className="mt-1 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.quantity === 0
                                ? "bg-rose-500"
                                : p.quantity <= p.minThreshold
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.max(5, stockPercent)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Unit Cost formatted in Currency */}
                    <td className="px-4 py-4 font-medium text-zinc-700 dark:text-zinc-300">
                      {formatCurrency(p.unitCost, currency)} / {p.uom}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          p.status === "In Stock"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : p.status === "Low Stock"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}
                      >
                        ● {p.status}
                      </span>
                    </td>

                    {/* Quick Adjust Buttons */}
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onUpdateQuantity(p.id, -1)}
                          disabled={p.quantity <= 0}
                          title={`Decrease stock by 1 ${p.uom}`}
                          className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-30 dark:hover:bg-zinc-800 transition"
                        >
                          <MinusCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onUpdateQuantity(p.id, 1)}
                          title={`Increase stock by 1 ${p.uom}`}
                          className="rounded-md p-1 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition"
                        >
                          <PlusCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-zinc-200 px-5 py-3 text-xs text-zinc-500 dark:border-zinc-800 flex justify-between items-center">
        <span>Showing {filteredProducts.length} of {products.length} products</span>
        <span className="font-mono text-[11px] text-zinc-400">Values formatted in {currency}</span>
      </div>
    </div>
  );
}
