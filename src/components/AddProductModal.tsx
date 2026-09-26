"use client";

import React, { useState } from "react";
import { Product, UnitOfMeasure } from "@/types/inventory";
import { X, Plus, Package } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: Omit<Product, "id" | "status" | "lastUpdated">) => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onAddProduct,
}: AddProductModalProps) {
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Product["category"]>("Raw Materials");
  const [uom, setUom] = useState<UnitOfMeasure>("kg");
  const [quantity, setQuantity] = useState<number>(50);
  const [minThreshold, setMinThreshold] = useState<number>(20);
  const [maxThreshold, setMaxThreshold] = useState<number>(200);
  const [unitCost, setUnitCost] = useState<number>(150);
  const [location, setLocation] = useState("Main Store / Rack-A");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !name) return;

    onAddProduct({
      sku: sku.toUpperCase(),
      name,
      category,
      uom,
      quantity: Number(quantity),
      minThreshold: Number(minThreshold),
      maxThreshold: Number(maxThreshold),
      unitCost: Number(unitCost),
      location,
    });

    // Reset
    setSku("");
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Create New Product (SKU)</h3>
              <p className="text-xs text-zinc-500">Master Data Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                SKU / Code *
              </label>
              <input
                type="text"
                placeholder="e.g. STL-ROD-100"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product["category"])}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="Raw Materials">Raw Materials</option>
                <option value="Finished Goods">Finished Goods</option>
                <option value="Electronics">Electronics</option>
                <option value="Hardware">Hardware</option>
                <option value="Packaging">Packaging</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Product Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Cold Rolled Steel Bars"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Unit of Measure (UoM) *
              </label>
              <select
                value={uom}
                onChange={(e) => setUom(e.target.value as UnitOfMeasure)}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-semibold text-purple-700 dark:text-purple-400"
              >
                <option value="kg">kg (Kilograms)</option>
                <option value="units">units (Individual Count)</option>
                <option value="meters">meters (Length)</option>
                <option value="boxes">boxes (Package Quantity)</option>
                <option value="liters">liters (Volume)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Unit Cost (₹ INR) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Initial Stock
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Min (Reorder)
              </label>
              <input
                type="number"
                min="1"
                value={minThreshold}
                onChange={(e) => setMinThreshold(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Max Stock
              </label>
              <input
                type="number"
                min="10"
                value={maxThreshold}
                onChange={(e) => setMaxThreshold(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Storage Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div className="mt-6 flex justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition"
            >
              <Plus className="h-4 w-4" />
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
