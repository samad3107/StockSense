# StockSense 📦

> **Next-Generation Inventory Management System (IMS)**  
> An enterprise-grade platform to digitize warehouse operations, streamline supply chain movements, and eliminate manual stock discrepancies.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Overview

**StockSense** is an enterprise-grade, real-time inventory management platform inspired by modular enterprise ERP architectures. It replaces error-prone spreadsheets and manual ledgers with an automated, auditable digital workflow covering the entire stock lifecycle—from vendor procurement to warehouse fulfillment.

---

## 🚀 Key Features

### 📊 1. Real-Time Analytics Dashboard
- **Live Stock Valuation**: Instant calculation of total asset value across all storage locations.
- **Stock Health Indicators**: Automated flags for Low Stock, Out-of-Stock, and Overstocked SKUs.
- **Activity Timeline**: Full audit log of all inbound, outbound, and internal movements.

### 🏷️ 2. Product & SKU Catalog
- **Master Data Management**: Centralized records with SKU, Barcode, Category, and Unit of Measure (UoM).
- **Automated Reordering Rules**: Configurable minimum/maximum stock rules triggering procurement notifications.
- **Cost & Price Tracking**: Support for standard and dynamic inventory valuation.

### 📥 3. Inbound Receipts (Vendor Stock-In)
- **Supplier Receipts**: Track goods received against purchase orders.
- **State Flow**: `Draft` ➔ `Waiting Availability` ➔ `Ready` ➔ `Done`.
- **Quality Checks & Partial Deliveries**: Inspect incoming batches before shelving.

### 📤 4. Outbound Delivery Orders (Stock-Out)
- **Customer Fulfillment**: Pick, pack, and ship workflows for outgoing orders.
- **Stock Reservation**: Reserve inventory automatically upon order confirmation to prevent overselling.

### 🔄 5. Internal Transfers & Warehouse Adjustments
- **Multi-Location Routing**: Effortlessly move items between different warehouses, aisles, and bins.
- **Cycle Counts & Adjustments**: Reconcile physical inventory counts against digital ledger numbers.
- **Scrap & Damage Management**: Record lost, expired, or damaged inventory with reason codes.
- **Immutable Stock Ledger**: Full double-entry movement history recording every stock in/out event.

### 👥 6. Role-Based Cockpits (Manager vs. Warehouse Staff)
- **Inventory Manager**: Strategic valuation metrics, SKU pricing, procurement rules, and high-level KPI oversight.
- **Warehouse Staff**: Floor-level cockpit for shelving inbound goods, picking & packing outbound deliveries, inter-rack transfers, and physical audits.

### 🌐 7. Dual Currency & Universal Dark/Light Themes
- **Dual Currency Switcher**: Instant toggle between Indian Rupee (₹ INR) and US Dollar ($ USD) with automatic conversions.
- **Fluid Theme Engine**: Seamless dark and light modes with custom CSS tokens and high-contrast inputs.
- **Public Landing Page**: Clean onboarding portal with responsive product showcase and 1-click team sign-in.

---

## 🏗️ System Workflow

```mermaid
graph TD
    Vendor([Vendor / Supplier]) -->|Inbound Receipt| Warehouse[(Central Warehouse)]
    Warehouse -->|Internal Transfer| Branch[(Regional Branch / Hub)]
    Warehouse -->|Physical Count Variance| Adj[Inventory Adjustment]
    Warehouse -->|Delivery Order| Customer([End Customer])
    
    subgraph Operations Lifecycle
        Draft[Draft] --> Ready[Ready / Reserved]
        Ready --> Done[Validated / Done]
    end




📁 Project Structure

StockSense/
├── public/                 # Static assets, logos, and icons
├── src/
│   ├── app/                # Next.js App Router (pages & layouts)
│   │   ├── layout.tsx      # Root application layout with theme context
│   │   ├── page.tsx        # Role-based Dashboard & Public Landing gate
│   │   └── globals.css     # Global styles & Tailwind CSS tokens
│   ├── components/         # Reusable UI components & modals
│   │   ├── LandingPage.tsx          # Public marketing & feature overview
│   │   ├── AuthModal.tsx            # Login, registration, and OTP verification
│   │   ├── StaffDashboardView.tsx   # Floor staff operational cockpit
│   │   ├── KPICards.tsx             # Live valuation & stock status KPIs
│   │   ├── ProductTable.tsx         # SKU catalog with search and filters
│   │   ├── OperationsView.tsx       # Receipts, deliveries, and transfers
│   │   ├── StockAdjustmentView.tsx  # Physical counting & discrepancy reconciliation
│   │   ├── StockLedgerView.tsx      # Double-entry audit move history
│   │   ├── WarehouseSettingsView.tsx# Locations, warehouses & user access
│   │   ├── Sidebar.tsx              # Role-aware navigation & theme controls
│   │   └── Navbar.tsx               # Top search bar & profile status
│   ├── context/
│   │   └── ThemeContext.tsx         # Light / Dark theme management
│   ├── data/
│   │   └── mockData.ts              # Master catalog & transaction state
│   ├── types/
│   │   └── inventory.ts             # Domain models & TypeScript interfaces
│   └── utils/
│       └── formatters.ts            # Currency formatter (INR ₹ / USD $)
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
