"use client";

import {
  Boxes,
  LayoutDashboard,
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  ClipboardCheck,
  History,
  Settings,
  User,
  LogOut,
  Warehouse,
  Layers,
  Sun,
  Moon,
} from "lucide-react";
import { UserProfile, Currency } from "@/types/inventory";
import { useTheme } from "@/context/ThemeContext";

export type NavItem =
  | "dashboard"
  | "products"
  | "receipts"
  | "deliveries"
  | "transfers"
  | "adjustments"
  | "ledger"
  | "settings";

interface SidebarProps {
  currentTab: NavItem;
  setCurrentTab: (tab: NavItem) => void;
  pendingReceipts: number;
  pendingDeliveries: number;
  user: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  currency: Currency;
  onToggleCurrency: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  pendingReceipts,
  pendingDeliveries,
  user,
  onOpenAuthModal,
  onLogout,
  currency,
  onToggleCurrency,
}: SidebarProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isManager = user?.role === "Inventory Manager";

  // Menu items configured dynamically by role (Role-based access)
  const navItems = isManager
    ? [
        { id: "dashboard" as NavItem, label: "Dashboard (Manager)", icon: LayoutDashboard },
        { id: "products" as NavItem, label: "Products & Pricing", icon: Package },
        {
          id: "receipts" as NavItem,
          label: "Inbound Receipts",
          icon: ArrowDownLeft,
          badge: pendingReceipts > 0 ? pendingReceipts : undefined,
          badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        },
        {
          id: "deliveries" as NavItem,
          label: "Delivery Orders",
          icon: ArrowUpRight,
          badge: pendingDeliveries > 0 ? pendingDeliveries : undefined,
          badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
        },
        { id: "transfers" as NavItem, label: "Internal Transfers", icon: ArrowLeftRight },
        { id: "adjustments" as NavItem, label: "Stock Adjustments", icon: ClipboardCheck },
        { id: "ledger" as NavItem, label: "Move History (Ledger)", icon: History },
        { id: "settings" as NavItem, label: "Warehouse Settings", icon: Settings },
      ]
    : [
        { id: "dashboard" as NavItem, label: "Floor Cockpit (Staff)", icon: Layers },
        { id: "transfers" as NavItem, label: "Rack Transfers", icon: ArrowLeftRight },
        { id: "adjustments" as NavItem, label: "Physical Count (Audit)", icon: ClipboardCheck },
        {
          id: "receipts" as NavItem,
          label: "Shelving (Inbound)",
          icon: ArrowDownLeft,
          badge: pendingReceipts > 0 ? pendingReceipts : undefined,
          badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
        },
        {
          id: "deliveries" as NavItem,
          label: "Pick & Pack (Outbound)",
          icon: ArrowUpRight,
          badge: pendingDeliveries > 0 ? pendingDeliveries : undefined,
          badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
        },
        { id: "products" as NavItem, label: "Item Shelf Locator", icon: Package },
        { id: "ledger" as NavItem, label: "Movement Ledger", icon: History },
      ];

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-zinc-200 px-5 dark:border-zinc-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-600/30">
          <Boxes className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
              StockSense
            </span>
            <span className="rounded bg-purple-100 px-1.5 py-0.2 text-[10px] font-bold text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
              Enterprise IMS
            </span>
          </div>
          <p className="text-[11px] text-zinc-500">Warehouse Operations</p>
        </div>
      </div>

      {/* Controls Bar: Currency & Theme Switcher */}
      <div className="px-3.5 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between gap-1.5">
        <button
          onClick={onToggleCurrency}
          className="flex-1 flex items-center justify-center gap-1 rounded-md border border-zinc-200 bg-white py-1 px-1.5 text-xs font-bold text-purple-700 hover:bg-purple-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-purple-300 transition"
          title="Toggle currency between INR and USD"
        >
          <span>{currency === "INR" ? "₹ INR" : "$ USD"}</span>
          <span className="text-[10px] text-zinc-400">⇄</span>
        </button>

        <button
          onClick={toggleTheme}
          title={mounted && theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex items-center justify-center h-7 w-7 rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition"
        >
          {!mounted ? (
            <span className="h-3.5 w-3.5" />
          ) : theme === "dark" ? (
            <Sun className="h-3.5 w-3.5 text-amber-400" />
          ) : (
            <Moon className="h-3.5 w-3.5 text-zinc-600" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 p-3">
        <div className="flex items-center justify-between px-3 mb-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            {isManager ? "Management Menu" : "Staff Operations"}
          </p>
          <span
            className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
              isManager
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
            }`}
          >
            {user?.role || "Guest"}
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? isManager
                    ? "bg-purple-600 text-white font-semibold shadow-xs"
                    : "bg-blue-600 text-white font-semibold shadow-xs"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-zinc-500"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive ? "bg-white text-purple-700" : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active Facility Tag */}
      <div className="m-3 rounded-lg border border-zinc-200 bg-zinc-50/80 p-2.5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          <Warehouse className="h-3.5 w-3.5 text-purple-600" />
          <span>{user?.warehouse || "Central Facility"}</span>
        </div>
        <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">
          {isManager ? "WH/Stock/Main-1" : "WH/Floor/Hub-N1"}
        </p>
      </div>

      {/* Profile & Auth Footer */}
      <div className="border-t border-zinc-200 p-3 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30">
        {user ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                    isManager
                      ? "bg-gradient-to-tr from-purple-600 to-indigo-500"
                      : "bg-gradient-to-tr from-blue-600 to-cyan-500"
                  }`}
                >
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="truncate">
                  <p className="truncate text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                    {user.name}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${
                      isManager ? "text-purple-600 dark:text-purple-400" : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Sign Out to Landing Page"
                className="rounded p-1 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={onOpenAuthModal}
              className="w-full text-center text-[10px] text-purple-600 dark:text-purple-400 hover:underline font-semibold"
            >
              Switch Account / Role ➔
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition"
          >
            <User className="h-4 w-4" />
            Sign In / Register
          </button>
        )}
      </div>
    </aside>
  );
}
