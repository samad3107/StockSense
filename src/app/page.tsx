"use client";

import React, { useState } from "react";
import LandingPage from "@/components/LandingPage";
import Sidebar, { NavItem } from "@/components/Sidebar";
import KPICards from "@/components/KPICards";
import StaffDashboardView from "@/components/StaffDashboardView";
import ProductTable from "@/components/ProductTable";
import OperationsView from "@/components/OperationsView";
import StockAdjustmentView from "@/components/StockAdjustmentView";
import StockLedgerView from "@/components/StockLedgerView";
import WarehouseSettingsView from "@/components/WarehouseSettingsView";
import AddProductModal from "@/components/AddProductModal";
import AuthModal from "@/components/AuthModal";

import {
  initialProducts,
  initialOperations,
  initialAdjustments,
  initialLedger,
} from "@/data/mockData";

import {
  Product,
  StockOperation,
  StockAdjustment,
  StockLedgerEntry,
  UserProfile,
  Currency,
  StockStatus,
} from "@/types/inventory";

import {
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowDownLeft,
  ClipboardCheck,
  History,
  Layers,
  LogOut,
  Sun,
  Moon,
  Warehouse,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import EditProductModal from "@/components/EditProductModal";

export default function Home() {
  const { theme, toggleTheme, mounted } = useTheme();
  // Application Data States
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [operations, setOperations] = useState<StockOperation[]>(initialOperations);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>(initialAdjustments);
  const [ledger, setLedger] = useState<StockLedgerEntry[]>(initialLedger);

  // Authentication & Role State (Defaults to null so Landing Page is the default view on load)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentTab, setCurrentTab] = useState<NavItem>("dashboard");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [filterStatus, setFilterStatus] = useState<StockStatus | "ALL">("ALL");
  const [selectedFacility, setSelectedFacility] = useState<string>("All Warehouses");
  const [isAlertTrayOpen, setIsAlertTrayOpen] = useState(false);
  const [operationNotice, setOperationNotice] = useState<string | null>(null);

  // Modals
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Helper: Stock status calculation
  const calculateStockStatus = (quantity: number, minThreshold: number): StockStatus => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity <= minThreshold) return "Low Stock";
    return "In Stock";
  };

  // Live KPI Calculations
  const pendingReceipts = operations.filter((op) => op.type === "Receipt" && op.status !== "Done").length;
  const pendingDeliveries = operations.filter((op) => op.type === "Delivery" && op.status !== "Done").length;
  const scheduledTransfers = operations.filter((op) => op.type === "Transfer" && op.status !== "Done").length;

  const kpiData = {
    totalValuation: products.reduce((acc, p) => acc + p.quantity * p.unitCost, 0),
    totalProductsCount: products.length,
    lowStockCount: products.filter((p) => p.status === "Low Stock").length,
    outOfStockCount: products.filter((p) => p.status === "Out of Stock").length,
    pendingReceipts,
    pendingDeliveries,
    scheduledTransfers,
  };

  // ==========================================
  // CORE STOCK ENGINE (AUTOMATIC LEDGER & QUANTITY)
  // ==========================================

  // 1. Validate an Operation (Receipt, Delivery, or Transfer)
  const handleValidateOperation = (opId: string) => {
    const op = operations.find((o) => o.id === opId);
    if (!op || op.status === "Done" || op.status === "Canceled") return;

    const targetProduct = products.find((p) => p.id === op.productId);
    if (!targetProduct) return;

    // Delivery Guardrail (Problem Statement Spec): check physical availability
    if (op.type === "Delivery" && targetProduct.quantity < op.quantity) {
      setOperations((prev) =>
        prev.map((o) => (o.id === opId ? { ...o, status: "Waiting" as const } : o))
      );
      setOperationNotice(
        `⚠️ Delivery Order ${op.reference} placed on "Waiting Availability": Requested ${op.quantity} ${targetProduct.uom}, but only ${targetProduct.quantity} ${targetProduct.uom} available in storage.`
      );
      return;
    }

    setOperationNotice(null);
    let qtyDelta = 0;
    let newQty = targetProduct.quantity;
    let newLocation = targetProduct.location;

    if (op.type === "Receipt") {
      qtyDelta = op.quantity;
      newQty = targetProduct.quantity + op.quantity;
    } else if (op.type === "Delivery") {
      qtyDelta = -op.quantity;
      newQty = Math.max(0, targetProduct.quantity - op.quantity);
    } else if (op.type === "Transfer") {
      qtyDelta = 0;
      newLocation = op.destinationLocation;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === targetProduct.id
          ? {
              ...p,
              quantity: newQty,
              location: newLocation,
              status: calculateStockStatus(newQty, p.minThreshold),
              lastUpdated: "Just now",
            }
          : p
      )
    );

    setOperations((prev) =>
      prev.map((o) => (o.id === opId ? { ...o, status: "Done" as const } : o))
    );

    const newLedgerEntry: StockLedgerEntry = {
      id: `led-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      reference: op.reference,
      type: op.type,
      productName: targetProduct.name,
      sku: targetProduct.sku,
      quantityChange: qtyDelta,
      uom: targetProduct.uom,
      fromLocation: op.sourceLocation,
      toLocation: op.destinationLocation,
      operator: user ? `${user.name} (${user.role})` : "Floor Operator",
      notes: `${op.type} validated — ${Math.abs(op.quantity)} ${targetProduct.uom}`,
    };

    setLedger((prev) => [newLedgerEntry, ...prev]);
  };

  const handleCancelOperation = (opId: string) => {
    setOperations((prev) =>
      prev.map((o) => (o.id === opId ? { ...o, status: "Canceled" as const } : o))
    );
  };

  const handleMarkReady = (opId: string) => {
    setOperations((prev) =>
      prev.map((o) => (o.id === opId ? { ...o, status: "Ready" as const } : o))
    );
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === updated.id
          ? {
              ...updated,
              status: calculateStockStatus(updated.quantity, updated.minThreshold),
              lastUpdated: "Just now",
            }
          : p
      )
    );
  };

  // 2. Create a new Operation order
  const handleCreateOperation = (
    newOp: Omit<StockOperation, "id" | "reference" | "date">
  ) => {
    const prefix = newOp.type === "Receipt" ? "WH/IN" : newOp.type === "Delivery" ? "WH/OUT" : "WH/INT";
    const ref = `${prefix}/${String(operations.length + 1).padStart(4, "0")}`;

    const created: StockOperation = {
      ...newOp,
      id: `op-${Date.now()}`,
      reference: ref,
      date: new Date().toISOString().split("T")[0],
    };

    setOperations((prev) => [created, ...prev]);
  };

  // 3. Apply Physical Inventory Adjustment
  const handleApplyAdjustment = (
    adjData: Omit<StockAdjustment, "id" | "reference" | "status" | "date">
  ) => {
    const ref = `INV/ADJ/${String(adjustments.length + 1).padStart(4, "0")}`;

    const newAdj: StockAdjustment = {
      ...adjData,
      id: `adj-${Date.now()}`,
      reference: ref,
      status: "Done",
      date: new Date().toISOString().split("T")[0],
    };

    setProducts((prev) =>
      prev.map((p) =>
        p.id === adjData.productId
          ? {
              ...p,
              quantity: adjData.countedQuantity,
              status: calculateStockStatus(adjData.countedQuantity, p.minThreshold),
              lastUpdated: "Just now",
            }
          : p
      )
    );

    setAdjustments((prev) => [newAdj, ...prev]);

    const targetProduct = products.find((p) => p.id === adjData.productId);
    const newLedgerEntry: StockLedgerEntry = {
      id: `led-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      reference: ref,
      type: "Adjustment",
      productName: adjData.productName,
      sku: targetProduct?.sku || "SKU",
      quantityChange: adjData.difference,
      uom: adjData.uom,
      fromLocation: adjData.location,
      toLocation: adjData.difference < 0 ? "Scrap / Discrepancy" : adjData.location,
      operator: user ? `${user.name} (${user.role})` : "Auditor",
      notes: `Physical count: ${adjData.countedQuantity} vs recorded ${adjData.recordedQuantity} (${adjData.reason})`,
    };

    setLedger((prev) => [newLedgerEntry, ...prev]);
  };

  // 4. Add New Product
  const handleAddProduct = (newProduct: Omit<Product, "id" | "status" | "lastUpdated">) => {
    const status = calculateStockStatus(newProduct.quantity, newProduct.minThreshold);
    const createdProduct: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      status,
      lastUpdated: "Just now",
    };

    setProducts((prev) => [createdProduct, ...prev]);

    if (newProduct.quantity > 0) {
      setLedger((prev) => [
        {
          id: `led-${Date.now()}`,
          timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
          reference: `INIT/${newProduct.sku}`,
          type: "Adjustment",
          productName: newProduct.name,
          sku: newProduct.sku,
          quantityChange: newProduct.quantity,
          uom: newProduct.uom,
          fromLocation: "Initial Inventory Setup",
          toLocation: newProduct.location,
          operator: user ? user.name : "System",
          notes: "Initial inventory setup entry",
        },
        ...prev,
      ]);
    }
  };

  // 5. Quick Stock Adjuster
  const handleQuickAdjustQuantity = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newQty = Math.max(0, p.quantity + delta);
        return {
          ...p,
          quantity: newQty,
          status: calculateStockStatus(newQty, p.minThreshold),
          lastUpdated: "Just now",
        };
      })
    );
  };

  // ==========================================
  // VIEW RENDER: LANDING PAGE (WHEN LOGGED OUT)
  // ==========================================
  if (!user) {
    return (
      <>
        <LandingPage
          onOpenAuth={() => setIsAuthModalOpen(true)}
          currency={currency}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(newProfile) => {
            setUser(newProfile);
            setCurrentTab("dashboard");
          }}
        />
      </>
    );
  }

  // ==========================================
  // VIEW RENDER: AUTHENTICATED IMS (BY ROLE)
  // ==========================================
  const isManager = user.role === "Inventory Manager";
  const displayProducts =
    selectedFacility === "All Warehouses"
      ? products
      : products.filter((p) =>
          p.location.toLowerCase().includes(selectedFacility.toLowerCase())
        );

  return (
    <div className="flex min-h-screen bg-zinc-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* 1. Left Sidebar Navigation (Dynamic by Role) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        pendingReceipts={pendingReceipts}
        pendingDeliveries={pendingDeliveries}
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          setUser(null);
          setCurrentTab("dashboard");
        }}
        currency={currency}
        onToggleCurrency={() => setCurrency((c) => (c === "INR" ? "USD" : "INR"))}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header Bar */}
        <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between dark:border-zinc-800 dark:bg-zinc-950 shrink-0">
          <div>
            <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-50 capitalize">
              {currentTab === "dashboard" && (isManager ? "Inventory Management Dashboard" : "Warehouse Floor Cockpit")}
              {currentTab === "products" && "Product Catalog & Master Data"}
              {currentTab === "receipts" && "Inbound Vendor Receipts (Stock-In)"}
              {currentTab === "deliveries" && "Outbound Delivery Orders (Stock-Out)"}
              {currentTab === "transfers" && "Internal Warehouse Transfers"}
              {currentTab === "adjustments" && "Physical Inventory Adjustments"}
              {currentTab === "ledger" && "Central Stock Ledger (Move History)"}
              {currentTab === "settings" && "Warehouse Configuration"}
            </h1>
            <p className="text-xs text-zinc-500">
              Facility: {user.warehouse} • Mode: <span className="font-semibold text-purple-600">{user.role}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Interactive Facility Filter (Page 1 Problem Statement Spec) */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs dark:border-zinc-800 dark:bg-zinc-900">
              <Warehouse className="h-3.5 w-3.5 text-purple-600" />
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="bg-transparent font-medium text-zinc-700 focus:outline-none dark:text-zinc-300"
              >
                <option value="All Warehouses">All Warehouses (Global)</option>
                <option value="Main Store">Main Store (Rack A/B)</option>
                <option value="Production">Production Hub</option>
                <option value="Ais-2">Aisle-2 Finished</option>
              </select>
            </div>

            {/* Low-Stock Notification Bell (Problem Statement Reorder Alerts) */}
            <div className="relative">
              <button
                onClick={() => setIsAlertTrayOpen(!isAlertTrayOpen)}
                title="Stock Reorder Alerts"
                className="relative flex items-center justify-center h-7 w-7 rounded-lg border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 transition"
              >
                <Bell className="h-3.5 w-3.5" />
                {kpiData.lowStockCount + kpiData.outOfStockCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white">
                    {kpiData.lowStockCount + kpiData.outOfStockCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isAlertTrayOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Stock Reorder Alerts
                    </h4>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {products.filter((p) => p.status !== "In Stock").length} Alert(s)
                    </span>
                  </div>

                  <div className="mt-3 max-h-60 overflow-y-auto space-y-2">
                    {products.filter((p) => p.status !== "In Stock").length === 0 ? (
                      <p className="text-xs text-zinc-400 py-3 text-center">All products are healthy & in stock!</p>
                    ) : (
                      products
                        .filter((p) => p.status !== "In Stock")
                        .map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between rounded-lg border border-zinc-100 p-2 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40"
                          >
                            <div>
                              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{p.name}</p>
                              <p className="text-[11px] text-zinc-500">
                                Stock: <span className="font-bold text-rose-600">{p.quantity} {p.uom}</span> (Min: {p.minThreshold})
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setIsAlertTrayOpen(false);
                                setCurrentTab("receipts");
                              }}
                              className="rounded bg-purple-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-purple-700 transition"
                            >
                              + Receive
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                isManager
                  ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                  : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {user.name} ({user.role})
            </span>

            {/* Theme Toggle (Hydration Safe) */}
            <button
              onClick={toggleTheme}
              title={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center justify-center h-7 w-7 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
            >
              {!mounted ? (
                <span className="h-3.5 w-3.5" />
              ) : theme === "dark" ? (
                <Sun className="h-3.5 w-3.5 text-amber-400" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-zinc-600" />
              )}
            </button>

            <button
              onClick={() => {
                setUser(null);
                setCurrentTab("dashboard");
              }}
              title="Sign Out to Landing Home Page"
              className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-600 hover:bg-rose-50 hover:text-rose-600 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Real-Time Operational Notice Banner */}
        {operationNotice && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2.5 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <span className="font-medium">{operationNotice}</span>
            </div>
            <button
              onClick={() => setOperationNotice(null)}
              className="text-amber-900 dark:text-amber-200 hover:underline font-bold text-[11px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Contents */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: DASHBOARD (DIFFERENTIATED BY ROLE) */}
          {currentTab === "dashboard" && (
            <>
              {isManager ? (
                /* INVENTORY MANAGER VIEW */
                <div className="space-y-6">
                  {/* Manager Banner */}
                  <div className="rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-zinc-900 p-6 text-white shadow-md relative overflow-hidden">
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200 border border-purple-400/30">
                          <Sparkles className="h-3.5 w-3.5" /> Inventory Manager Cockpit
                        </span>
                        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                          Executive Inventory Valuation & Traceability
                        </h2>
                        <p className="mt-1 text-xs text-purple-200/90 max-w-2xl leading-relaxed">
                          Monitor multi-warehouse valuation, approve vendor receipts, review customer deliveries,
                          and oversee reorder threshold alerts in real-time.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setIsAddProductOpen(true)}
                          className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-purple-500 transition"
                        >
                          <Plus className="h-4 w-4" />
                          Add Product
                        </button>
                        <button
                          onClick={() => setCurrentTab("receipts")}
                          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition border border-white/15"
                        >
                          <ArrowDownLeft className="h-4 w-4" />
                          Receive Stock
                        </button>
                        <button
                          onClick={() => setCurrentTab("adjustments")}
                          className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition border border-white/15"
                        >
                          <ClipboardCheck className="h-4 w-4" />
                          Audit Stock
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Key Warehouse Performance Indicators */}
                  <KPICards
                    data={kpiData}
                    currency={currency}
                    onNavigateTab={(tab) => setCurrentTab(tab)}
                  />

                  {/* Health Bar & Move History */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                          <Layers className="h-4 w-4 text-purple-600" />
                          Warehouse Health & SLA
                        </h3>
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" /> 99.1% Acc.
                        </span>
                      </div>

                      <div className="mt-4 space-y-3 text-xs">
                        <div>
                          <div className="flex justify-between font-medium text-zinc-600 dark:text-zinc-400">
                            <span>In-Stock Items</span>
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
                          <div className="flex justify-between font-medium text-zinc-600 dark:text-zinc-400">
                            <span>Low Stock Alerts</span>
                            <span className="font-bold text-amber-600">{kpiData.lowStockCount} SKUs</span>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{
                                width: `${(kpiData.lowStockCount / products.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between font-medium text-zinc-600 dark:text-zinc-400">
                            <span>Out of Stock</span>
                            <span className="font-bold text-rose-600">{kpiData.outOfStockCount} SKUs</span>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full bg-rose-500 rounded-full"
                              style={{
                                width: `${(kpiData.outOfStockCount / products.length) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                          <History className="h-4 w-4 text-purple-600" />
                          Central Stock Ledger (Recent Moves)
                        </h3>
                        <button
                          onClick={() => setCurrentTab("ledger")}
                          className="text-xs font-semibold text-purple-600 hover:underline"
                        >
                          View Full Ledger ➔
                        </button>
                      </div>

                      <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
                        {ledger.slice(0, 4).map((entry) => (
                          <div key={entry.id} className="py-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span
                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                  entry.type === "Receipt"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                    : entry.type === "Delivery"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                    : "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                                }`}
                              >
                                {entry.type}
                              </span>
                              <div>
                                <p className="font-semibold text-zinc-800 dark:text-zinc-200">{entry.productName}</p>
                                <p className="text-[11px] text-zinc-400 font-mono">
                                  {entry.fromLocation} ➔ {entry.toLocation}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <span
                                className={`font-mono font-bold text-xs ${
                                  entry.quantityChange > 0
                                    ? "text-emerald-600"
                                    : entry.quantityChange < 0
                                    ? "text-rose-600"
                                    : "text-zinc-500"
                                }`}
                              >
                                {entry.quantityChange > 0 ? `+${entry.quantityChange}` : entry.quantityChange} {entry.uom}
                              </span>
                              <p className="text-[10px] text-zinc-400">{entry.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Embedded Products Table */}
                  <ProductTable
                    products={displayProducts}
                    currency={currency}
                    onAddProductClick={() => setIsAddProductOpen(true)}
                    onEditProductClick={(p) => setEditingProduct(p)}
                    onUpdateQuantity={handleQuickAdjustQuantity}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                  />
                </div>
              ) : (
                /* WAREHOUSE STAFF VIEW (FLOOR OPERATIONS) */
                <StaffDashboardView
                  products={displayProducts}
                  operations={operations}
                  recentLedger={ledger}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onValidateOperation={handleValidateOperation}
                />
              )}
            </>
          )}

          {/* TAB 2: PRODUCTS */}
          {currentTab === "products" && (
            <ProductTable
              products={displayProducts}
              currency={currency}
              onAddProductClick={() => setIsAddProductOpen(true)}
              onEditProductClick={(p) => setEditingProduct(p)}
              onUpdateQuantity={handleQuickAdjustQuantity}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          )}

          {/* TAB 3: RECEIPTS (STOCK IN) */}
          {currentTab === "receipts" && (
            <OperationsView
              operations={operations}
              products={products}
              currentTypeFilter="Receipt"
              onValidateOperation={handleValidateOperation}
              onCancelOperation={handleCancelOperation}
              onMarkReady={handleMarkReady}
              onCreateOperation={handleCreateOperation}
            />
          )}

          {/* TAB 4: DELIVERY ORDERS (STOCK OUT) */}
          {currentTab === "deliveries" && (
            <OperationsView
              operations={operations}
              products={products}
              currentTypeFilter="Delivery"
              onValidateOperation={handleValidateOperation}
              onCancelOperation={handleCancelOperation}
              onMarkReady={handleMarkReady}
              onCreateOperation={handleCreateOperation}
            />
          )}

          {/* TAB 5: INTERNAL TRANSFERS */}
          {currentTab === "transfers" && (
            <OperationsView
              operations={operations}
              products={products}
              currentTypeFilter="Transfer"
              onValidateOperation={handleValidateOperation}
              onCancelOperation={handleCancelOperation}
              onMarkReady={handleMarkReady}
              onCreateOperation={handleCreateOperation}
            />
          )}

          {/* TAB 6: STOCK ADJUSTMENTS (PHYSICAL COUNT) */}
          {currentTab === "adjustments" && (
            <StockAdjustmentView
              products={products}
              adjustments={adjustments}
              onApplyAdjustment={handleApplyAdjustment}
            />
          )}

          {/* TAB 7: MOVE HISTORY / STOCK LEDGER */}
          {currentTab === "ledger" && <StockLedgerView entries={ledger} />}

          {/* TAB 8: WAREHOUSE SETTINGS */}
          {currentTab === "settings" && <WarehouseSettingsView />}
        </main>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Edit Product & Reordering Rules Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onUpdateProduct={handleUpdateProduct}
      />

      {/* Role-Based Authentication & OTP Password Reset Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(newProfile) => {
          setUser(newProfile);
          setCurrentTab("dashboard");
        }}
      />
    </div>
  );
}
