"use client";

import React, { useState } from "react";
import { StockOperation, Product, OperationType } from "@/types/inventory";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  Check,
  Plus,
  Truck,
} from "lucide-react";

interface OperationsViewProps {
  operations: StockOperation[];
  products: Product[];
  currentTypeFilter: "ALL" | OperationType;
  onValidateOperation: (id: string) => void;
  onCreateOperation: (newOp: Omit<StockOperation, "id" | "reference" | "status" | "date">) => void;
}

export default function OperationsView({
  operations,
  products,
  currentTypeFilter,
  onValidateOperation,
  onCreateOperation,
}: OperationsViewProps) {
  const [selectedType, setSelectedType] = useState<"ALL" | OperationType>(currentTypeFilter);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [opType, setOpType] = useState<OperationType>("Receipt");
  const [partner, setPartner] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [quantity, setQuantity] = useState<number>(10);
  const [sourceLocation, setSourceLocation] = useState("Partner Locations / Vendors");
  const [destinationLocation, setDestinationLocation] = useState("Main Store / Rack-A");

  const filteredOps = operations.filter((op) => {
    if (selectedType === "ALL") return true;
    return op.type === selectedType;
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleOpenModal = (defaultType: OperationType) => {
    setOpType(defaultType);
    if (defaultType === "Receipt") {
      setPartner("Tata Steel Logistics");
      setSourceLocation("Partner Locations / Vendors");
      setDestinationLocation("Main Store / Rack-A");
    } else if (defaultType === "Delivery") {
      setPartner("Customer Order #SO-109");
      setSourceLocation("WH/Finished/Ais-2");
      setDestinationLocation("Partner Locations / Customers");
    } else {
      setPartner("Internal Logistics");
      setSourceLocation("Main Store");
      setDestinationLocation("Production Rack / Line-1");
    }
    setIsModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    onCreateOperation({
      type: opType,
      partner,
      sourceLocation,
      destinationLocation,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: Number(quantity),
      uom: selectedProduct.uom,
    });

    setIsModalOpen(false);
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 p-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              {selectedType === "ALL" && "All Stock Operations"}
              {selectedType === "Receipt" && "Inbound Receipts (Vendor Stock-In)"}
              {selectedType === "Delivery" && "Outbound Delivery Orders (Customer Fulfillment)"}
              {selectedType === "Transfer" && "Internal Transfers (Inter-Location Moves)"}
            </h2>
          </div>
          <p className="text-xs text-zinc-500">
            Validating an operation automatically updates inventory levels and logs to the Stock Ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter buttons */}
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-800 dark:bg-zinc-950 text-xs font-semibold">
            {(["ALL", "Receipt", "Delivery", "Transfer"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`rounded-md px-2.5 py-1 transition ${
                  selectedType === t
                    ? "bg-white text-purple-700 shadow-xs dark:bg-zinc-800 dark:text-purple-300"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                }`}
              >
                {t === "ALL" ? "All" : t + "s"}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleOpenModal(selectedType === "ALL" ? "Receipt" : selectedType)}
            className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition"
          >
            <Plus className="h-4 w-4" />
            New Operation
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-semibold uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950/80">
            <tr>
              <th className="px-5 py-3.5">Reference</th>
              <th className="px-4 py-3.5">Type</th>
              <th className="px-4 py-3.5">Partner / Customer</th>
              <th className="px-4 py-3.5">Product & Quantity</th>
              <th className="px-4 py-3.5">Movement Route</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filteredOps.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-zinc-500">
                  No operations found for this category.
                </td>
              </tr>
            ) : (
              filteredOps.map((op) => (
                <tr key={op.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-purple-700 dark:text-purple-400">
                    {op.reference}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                        op.type === "Receipt"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : op.type === "Delivery"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                          : "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                      }`}
                    >
                      {op.type === "Receipt" && <ArrowDownLeft className="h-3 w-3" />}
                      {op.type === "Delivery" && <ArrowUpRight className="h-3 w-3" />}
                      {op.type === "Transfer" && <ArrowLeftRight className="h-3 w-3" />}
                      {op.type}
                    </span>
                  </td>

                  <td className="px-4 py-4 font-medium text-zinc-800 dark:text-zinc-200">
                    {op.partner}
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {op.productName}
                    </span>
                    <p className="font-mono text-xs text-purple-600 font-bold">
                      {op.quantity} {op.uom}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-xs text-zinc-500">
                    <span className="font-mono text-zinc-700 dark:text-zinc-300">{op.sourceLocation}</span>
                    <span className="mx-1 text-purple-600">➔</span>
                    <span className="font-mono text-zinc-700 dark:text-zinc-300">{op.destinationLocation}</span>
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
                        Validate & Apply
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-400 font-medium">Posted to Ledger</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* New Operation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Create New {opType} Order
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              {opType === "Receipt" && "Receiving goods from supplier into warehouse stock."}
              {opType === "Delivery" && "Delivering goods from warehouse to customer."}
              {opType === "Transfer" && "Moving inventory between internal warehouse locations."}
            </p>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Operation Type
                </label>
                <select
                  value={opType}
                  onChange={(e) => {
                    const newT = e.target.value as OperationType;
                    setOpType(newT);
                    if (newT === "Receipt") {
                      setSourceLocation("Partner Locations / Vendors");
                      setDestinationLocation("Main Store / Rack-A");
                    } else if (newT === "Delivery") {
                      setSourceLocation("WH/Finished/Ais-2");
                      setDestinationLocation("Partner Locations / Customers");
                    } else {
                      setSourceLocation("Main Store");
                      setDestinationLocation("Production Rack / Line-1");
                    }
                  }}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-medium"
                >
                  <option value="Receipt">Receipt (Incoming Stock +)</option>
                  <option value="Delivery">Delivery Order (Outgoing Stock -)</option>
                  <option value="Transfer">Internal Transfer (Location Relocation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Partner / Entity *
                </label>
                <input
                  type="text"
                  required
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  placeholder="e.g. Tata Steel / Customer / Dept"
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Product
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — Available: {p.quantity} {p.uom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Quantity ({selectedProduct?.uom}) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Source Location
                  </label>
                  <input
                    type="text"
                    required
                    value={sourceLocation}
                    onChange={(e) => setSourceLocation(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Destination Location
                  </label>
                  <input
                    type="text"
                    required
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-mono"
                  />
                </div>
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
                  <Plus className="h-4 w-4" />
                  Create Draft Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
