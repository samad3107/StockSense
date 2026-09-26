"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import KPICards from "@/components/KPICards";
import ProductTable from "@/components/ProductTable";
import OperationsView from "@/components/OperationsView";
import AddProductModal from "@/components/AddProductModal";
import { initialProducts, initialOperations } from "@/data/mockData";
import { Product, StockOperation, StockStatus, InventoryStats } from "@/types/inventory";
import { Plus, ArrowDownLeft, ArrowUpRight, ShieldCheck, Sparkles, TrendingUp, Layers } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [operations, setOperations] = useState<StockOperation[]>(initialOperations);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("All Warehouses");
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "operations">("overview");
  const [filterStatus, setFilterStatus] = useState<StockStatus | "ALL">("ALL");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Compute live stats
  const stats: InventoryStats = {
    totalValuation: products.reduce((acc, p) => acc + p.quantity * p.unitCost, 0),
    totalItems: products.reduce((acc, p) => acc + p.quantity, 0),
    lowStockCount: products.filter((p) => p.status === "Low Stock").length,
    outOfStockCount: products.filter((p) => p.status === "Out of Stock").length,
    pendingReceipts: operations.filter((op) => op.type === "Receipt (Inbound)" && op.status !== "Done").length,
    pendingDeliveries: operations.filter((op) => op.type === "Delivery (Outbound)" && op.status !== "Done").length,
  };

  // Helper to recompute product status
  const determineStatus = (qty: number, min: number): StockStatus => {
    if (qty <= 0) return "Out of Stock";
    if (qty <= min) return "Low Stock";
    return "In Stock";
  };

  // Handler: Add new product
  const handleAddProduct = (newProduct: Omit<Product, "id" | "status" | "lastUpdated">) => {
    const status = determineStatus(newProduct.quantity, newProduct.minThreshold);
    const productWithId: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      status,
      lastUpdated: "Just now",
    };
    setProducts((prev) => [productWithId, ...prev]);
  };

  // Handler: Quick stock adjust (+1 / -1)
  const handleUpdateQuantity = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newQty = Math.max(0, p.quantity + delta);
        const newStatus = determineStatus(newQty, p.minThreshold);
        return {
          ...p,
          quantity: newQty,
          status: newStatus,
          lastUpdated: "Just now",
        };
      })
    );
  };

  // Handler: Validate operation (Odoo ERP state flow)
  const handleValidateOperation = (id: string) => {
    setOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status: "Done" as const } : op))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        lowStockCount={stats.lowStockCount}
        selectedWarehouse={selectedWarehouse}
        onSelectWarehouse={setSelectedWarehouse}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Cards Row */}
        <KPICards
          stats={stats}
          onFilterLowStock={() => {
            setActiveTab("inventory");
            setFilterStatus("Low Stock");
          }}
          onFilterOutOfStock={() => {
            setActiveTab("inventory");
            setFilterStatus("Out of Stock");
          }}
          onGoToOperations={() => setActiveTab("operations")}
        />

        {/* Tab 1: Overview Dashboard */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Action Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-zinc-900 p-6 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200 border border-purple-400/30">
                    <Sparkles className="h-3.5 w-3.5" /> Odoo Hackathon 2026 Edition
                  </span>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Centralized Stock Control & Traceability
                  </h1>
                  <p className="mt-1 text-sm text-purple-200/90 max-w-2xl">
                    Live inventory synchronization across aisles, storage bins, and transit corridors.
                    Zero spreadsheet latency, automated reordering thresholds, and auditable movements.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition"
                  >
                    <Plus className="h-4 w-4" />
                    + New SKU
                  </button>
                  <button
                    onClick={() => setActiveTab("operations")}
                    className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition border border-white/15"
                  >
                    <ArrowDownLeft className="h-4 w-4" />
                    Receive Inbound
                  </button>
                </div>
              </div>
            </div>

            {/* Grid: Health Metrics & Recent Operations */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Warehouse Health & Status summary */}
              <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-600" />
                    Storage Health Status
                  </h3>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> 98.4% Acc.
                  </span>
                </div>

                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      <span>Optimal Stock</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {products.filter((p) => p.status === "In Stock").length} SKUs
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width: `${(products.filter((p) => p.status === "In Stock").length / products.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      <span>Low Stock Alert</span>
                      <span className="font-bold text-amber-600">
                        {stats.lowStockCount} SKUs
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{
                          width: `${(stats.lowStockCount / products.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      <span>Out of Stock</span>
                      <span className="font-bold text-rose-600">
                        {stats.outOfStockCount} SKUs
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{
                          width: `${(stats.outOfStockCount / products.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
                    <span className="text-zinc-500">Warehouse Location:</span>
                    <span className="font-semibold text-purple-600">{selectedWarehouse}</span>
                  </div>
                </div>
              </div>

              {/* Fast Operations Feed */}
              <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    Recent Warehouse Moves (Audit Log)
                  </h3>
                  <button
                    onClick={() => setActiveTab("operations")}
                    className="text-xs font-semibold text-purple-600 hover:underline"
                  >
                    View All Operations ➔
                  </button>
                </div>

                <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                  {operations.slice(0, 3).map((op) => (
                    <div key={op.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            op.type === "Receipt (Inbound)"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60"
                              : op.type === "Delivery (Outbound)"
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-950/60"
                              : "bg-purple-50 text-purple-600 dark:bg-purple-950/60"
                          }`}
                        >
                          {op.type === "Receipt (Inbound)" && <ArrowDownLeft className="h-4 w-4" />}
                          {op.type === "Delivery (Outbound)" && <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200">
                            {op.reference}
                          </p>
                          <p className="text-xs text-zinc-500">{op.partner}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            op.status === "Done"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          }`}
                        >
                          {op.status}
                        </span>
                        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {op.itemCount} units
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Embedded Product Catalog Preview */}
            <ProductTable
              products={products}
              onAddProductClick={() => setIsAddModalOpen(true)}
              onUpdateQuantity={handleUpdateQuantity}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </div>
        )}

        {/* Tab 2: Dedicated Inventory Catalog */}
        {activeTab === "inventory" && (
          <ProductTable
            products={products}
            onAddProductClick={() => setIsAddModalOpen(true)}
            onUpdateQuantity={handleUpdateQuantity}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        )}

        {/* Tab 3: Dedicated Operations View */}
        {activeTab === "operations" && (
          <OperationsView
            operations={operations}
            onValidateOperation={handleValidateOperation}
          />
        )}
      </main>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}
