// Types for StockSense Inventory Management System (Enterprise IMS)

export type UnitOfMeasure = "units" | "kg" | "meters" | "boxes" | "liters";

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: "Raw Materials" | "Finished Goods" | "Electronics" | "Hardware" | "Packaging";
  quantity: number;
  uom: UnitOfMeasure;
  minThreshold: number;
  maxThreshold: number;
  unitCost: number; // Stored in base currency (INR)
  location: string;
  status: StockStatus;
  lastUpdated: string;
}

export type OperationType = "Receipt" | "Delivery" | "Transfer" | "Adjustment";
export type OperationStatus = "Draft" | "Waiting" | "Ready" | "Done" | "Canceled";

export interface StockOperation {
  id: string;
  reference: string;
  type: OperationType;
  partner: string; // Supplier name, customer name, or department
  sourceLocation: string;
  destinationLocation: string;
  productId: string;
  productName: string;
  quantity: number;
  uom: UnitOfMeasure;
  status: OperationStatus;
  date: string;
}

export interface StockLedgerEntry {
  id: string;
  timestamp: string;
  reference: string;
  type: OperationType;
  productName: string;
  sku: string;
  quantityChange: number; // Positive for in, negative for out
  uom: UnitOfMeasure;
  fromLocation: string;
  toLocation: string;
  operator: string;
  notes?: string;
}

export interface StockAdjustment {
  id: string;
  reference: string;
  productId: string;
  productName: string;
  location: string;
  recordedQuantity: number;
  countedQuantity: number;
  difference: number;
  uom: UnitOfMeasure;
  reason: "Damaged Items" | "Cycle Count" | "Theft / Loss" | "Found Stock";
  status: "Draft" | "Done";
  date: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: "Inventory Manager" | "Warehouse Staff";
  warehouse: string;
}

export type Currency = "INR" | "USD";
