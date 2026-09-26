"use client";

import React, { useState } from "react";
import { Warehouse, Plus, CheckCircle2, MapPin } from "lucide-react";

interface WarehouseItem {
  id: string;
  code: string;
  name: string;
  address: string;
  storageZones: string[];
  totalSKUs: number;
  isPrimary: boolean;
}

const initialWarehouses: WarehouseItem[] = [
  {
    id: "wh-1",
    code: "WH/MAIN",
    name: "Central Warehouse (Primary)",
    address: "Plot 42, Electronic City Phase 1, Bangalore, Karnataka",
    storageZones: ["Main Store / Rack-A", "Main Store / Rack-B", "Zone-P (Packaging)"],
    totalSKUs: 6,
    isPrimary: true,
  },
  {
    id: "wh-2",
    code: "WH/NORTH",
    name: "North Regional Hub",
    address: "Sector 18, Udyog Vihar, Gurugram, Haryana",
    storageZones: ["Dock-1", "Rack-N1", "Rack-N2"],
    totalSKUs: 3,
    isPrimary: false,
  },
  {
    id: "wh-3",
    code: "WH/HAZARD",
    name: "Hazardous & Climate-Controlled Facility",
    address: "MIDC Industrial Area, Pune, Maharashtra",
    storageZones: ["FireSafe-Vault", "Cold-Storage-04"],
    totalSKUs: 1,
    isPrimary: false,
  },
];

export default function WarehouseSettingsView() {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>(initialWarehouses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleAddWarehouse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newWh: WarehouseItem = {
      id: `wh-${Date.now()}`,
      code: code.toUpperCase(),
      name,
      address,
      storageZones: ["General Receiving", "Storage Bin 1"],
      totalSKUs: 0,
      isPrimary: false,
    };

    setWarehouses([...warehouses, newWh]);
    setCode("");
    setName("");
    setAddress("");
    setIsModalOpen(false);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Multi-Warehouse Settings</h2>
          </div>
          <p className="text-xs text-zinc-500">
            Configure storage hubs, regional fulfillment centers, and location routing
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Warehouse
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800 dark:bg-zinc-950 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                  {wh.code}
                </span>
                {wh.isPrimary && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Primary Facility
                  </span>
                )}
              </div>
              <h3 className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">{wh.name}</h3>
              <p className="mt-1 text-xs text-zinc-500 flex items-start gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-400 mt-0.5" />
                <span>{wh.address}</span>
              </p>

              <div className="mt-3">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Configured Storage Zones:
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {wh.storageZones.map((z, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {z}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>Managed SKUs: <strong className="text-zinc-900 dark:text-zinc-100">{wh.totalSKUs}</strong></span>
              <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[11px]">
                <CheckCircle2 className="h-3 w-3" /> Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">Add New Warehouse</h3>
            <form onSubmit={handleAddWarehouse} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Warehouse Code *</label>
                <input
                  type="text"
                  required
                  placeholder="WH/SOUTH"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Facility Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Distribution Hub"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Physical Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
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
                  className="rounded-lg bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition"
                >
                  Save Warehouse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
