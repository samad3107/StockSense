export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: "Electronics" | "Raw Materials" | "Hardware" | "Packaging" | "Accessories";
  quantity: number;
  minThreshold: number;
  maxThreshold: number;
  unitCost: number;
  salePrice: number;
  location: string;
  status: StockStatus;
  lastUpdated: string;
}

export type OperationType = "Receipt (Inbound)" | "Delivery (Outbound)" | "Internal Transfer";
export type OperationStatus = "Draft" | "Ready" | "Done" | "Cancelled";

export interface StockOperation {
  id: string;
  reference: string;
  type: OperationType;
  partner: string; // Vendor or Customer
  sourceLocation: string;
  destinationLocation: string;
  itemCount: number;
  totalValue: number;
  status: OperationStatus;
  date: string;
}

export interface InventoryStats {
  totalValuation: number;
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  pendingReceipts: number;
  pendingDeliveries: number;
}
