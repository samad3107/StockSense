# StockSense 📦
Next-Generation Inventory Management System (IMS)

## Overview
StockSense is an enterprise-grade, real-time warehouse inventory management solution. It replaces manual spreadsheets and registers with an automated, auditable digital workflow that covers the entire stock lifecycle.

## Key Features
- 📊 Real-Time Analytics & KPIs: Inventory valuation, low-stock alerts, pending movements.
- 🏷️ Product Catalog & Reordering Rules: SKU master data, min/max thresholds, automated status tags.
- 📥 Inbound Receipts: Vendor validation workflow with automatic stock increment.
- 📤 Outbound Delivery Orders: Availability checks, anti-negative stock guardrails.
- 🔄 Internal Transfers: Rack-to-rack moves with live location tracking.
- ⚖️ Physical Stock Adjustments: Variance reconciliation with reason codes.
- 📜 Immutable Stock Ledger: Double-entry audit trail with timestamps and operators.

## System Architecture
flowchart LR
    Vendor -->|Inbound Receipt| Warehouse
    Warehouse -->|Internal Transfer| Rack
    Warehouse -->|Delivery Order| Customer

| Technology Usage
| Next.js 16,App Router, enterprise frontend
| React 19 | UI components 
| TypeScript | Strong typing & maintainability
| Tailwind CSS v4 | Styling & theming 
| Lucide Icons | Iconography

Getting Started 
git clone <repo-url>
cd StockSense
npm install
npm run dev

Team & Contributions:-
Syed Moazam
Mohammed Abdul Samad
Syed Omer Ali

