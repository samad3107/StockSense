"use client";

import React, { useState } from "react";
import { Product, UnitOfMeasure } from "@/types/inventory";
import { X, Save, Edit3 } from "lucide-react";

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProduct: (updated: Product) => void;
}

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onUpdateProduct: (updated: Product) => void;
}

function EditProductForm({ product, onClose, onUpdateProduct }: EditProductFormProps) {
  const [name, setName] = useState(product.name);
  const [category, setCategory] = useState<Product["category"]>(product.category);
  const [uom, setUom] = useState<UnitOfMeasure>(product.uom);
  const [minThreshold, setMinThreshold] = useState<number>(product.minThreshold);
  const [maxThreshold, setMaxThreshold] = useState<number>(product.maxThreshold);
  const [unitCost, setUnitCost] = useState<number>(product.unitCost);
  const [location, setLocation] = useState(product.location);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onUpdateProduct({
      ...product,
      name,
      category,
      uom,
      minThreshold: Number(minThreshold),
      maxThreshold: Number(maxThreshold),
      unitCost: Number(unitCost),
      location,
      lastUpdated: "Just now",
    });

    onClose();
  };

  return (
    <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300">
            <Edit3 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Edit SKU & Reorder Rules</h3>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-purple-600 dark:text-purple-400">
                {product.sku}
              </span>
            </div>
            <p className="text-xs text-zinc-500">Update pricing, storage bin, and min/max thresholds</p>
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
        <div>
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Product Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
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

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Unit of Measure (UoM)</label>
            <select
              value={uom}
              onChange={(e) => setUom(e.target.value as UnitOfMeasure)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            >
              <option value="units">units</option>
              <option value="kg">kg</option>
              <option value="meters">meters</option>
              <option value="boxes">boxes</option>
              <option value="liters">liters</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5 dark:border-purple-900/40 dark:bg-purple-950/20">
          <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider mb-2">
            Automated Reordering Rules
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Min Reorder Level ({uom})
              </label>
              <input
                type="number"
                min="0"
                required
                value={minThreshold}
                onChange={(e) => setMinThreshold(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
              <p className="mt-1 text-[11px] text-zinc-500">Triggers Low Stock alert</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Target Max Capacity ({uom})
              </label>
              <input
                type="number"
                min="1"
                required
                value={maxThreshold}
                onChange={(e) => setMaxThreshold(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
              <p className="mt-1 text-[11px] text-zinc-500">Maximum shelf storage</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Unit Cost (₹ INR)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Storage Location / Rack</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition"
          >
            <Save className="h-3.5 w-3.5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
  onUpdateProduct,
}: EditProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <EditProductForm
        key={product.id}
        product={product}
        onClose={onClose}
        onUpdateProduct={onUpdateProduct}
      />
    </div>
  );
}
