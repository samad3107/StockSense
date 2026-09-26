"use client";

import React from "react";
import { Boxes, Bell, Warehouse, Sparkles } from "lucide-react";

interface NavbarProps {
  lowStockCount: number;
  selectedWarehouse: string;
  onSelectWarehouse: (wh: string) => void;
  activeTab: "overview" | "inventory" | "operations";
  setActiveTab: (tab: "overview" | "inventory" | "operations") => void;
}

export default function Navbar({
  lowStockCount,
  selectedWarehouse,
  onSelectWarehouse,
  activeTab,
  setActiveTab,
}: NavbarProps) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 sticky top-0 z-40">
      {/* Top Banner */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab("overview")}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  StockSense
                </span>
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950/70 dark:text-purple-300">
                  Enterprise IMS
                </span>
              </div>
              <p className="text-xs text-zinc-500">Real-Time Warehouse Management</p>
            </div>
          </div>

          {/* Warehouse Selector */}
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Warehouse className="h-4 w-4 text-purple-600" />
            <select
              value={selectedWarehouse}
              onChange={(e) => onSelectWarehouse(e.target.value)}
              className="bg-transparent font-medium text-zinc-700 focus:outline-none dark:text-zinc-300"
            >
              <option value="All Warehouses">All Warehouses (Global)</option>
              <option value="Central WH/Stock">Central WH (Primary)</option>
              <option value="North Regional Hub">North Regional Hub</option>
              <option value="Hazardous / FireSafe">Hazardous / FireSafe</option>
            </select>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Low Stock Notification */}
          <div className="relative flex items-center">
            <button
              onClick={() => setActiveTab("inventory")}
              title={`${lowStockCount} items need attention`}
              className="relative rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition"
            >
              <Bell className="h-5 w-5" />
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
                  {lowStockCount}
                </span>
              )}
            </button>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-3 border-l border-zinc-200 pl-3 dark:border-zinc-800">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 font-bold text-white text-sm">
              SM
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Syed Moazam</p>
              <p className="text-xs text-zinc-500">Warehouse Lead</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-t border-zinc-200 px-4 sm:px-6 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "border-purple-600 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Dashboard Overview
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "inventory"
              ? "border-purple-600 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          <Boxes className="h-4 w-4" />
          Products & Inventory
        </button>

        <button
          onClick={() => setActiveTab("operations")}
          className={`flex items-center gap-2 border-b-2 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === "operations"
              ? "border-purple-600 text-purple-600 dark:text-purple-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
          }`}
        >
          <Warehouse className="h-4 w-4" />
          Operations (Receipts & Deliveries)
        </button>
      </div>
    </header>
  );
}
