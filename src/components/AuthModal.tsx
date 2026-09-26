"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/inventory";
import { registeredUsers } from "@/data/mockData";
import { X, Lock, Mail, User, ShieldCheck, KeyRound, ArrowLeft, Users } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot_email" | "forgot_otp">("login");
  const [email, setEmail] = useState("syedmoazam101@gmail.com");
  const [password, setPassword] = useState("password123");
  const [name, setName] = useState("Syed Moazam");
  const [role, setRole] = useState<"Inventory Manager" | "Warehouse Staff">("Inventory Manager");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  // Quick switch user
  const handleQuickSelectUser = (u: UserProfile) => {
    setEmail(u.email);
    setName(u.name);
    setRole(u.role);
    setPassword("password123");
    onLoginSuccess(u);
    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is in registered team users
    const matched = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (matched) {
      onLoginSuccess(matched);
    } else {
      onLoginSuccess({
        name: name || "Warehouse User",
        email,
        role,
        warehouse: "Central Warehouse (WH/Stock)",
      });
    }

    onClose();
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setMode("forgot_otp");
    setNotification("Verification OTP code: 4 8 2 9 1 0 (sent to " + email + ")");
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification("Password successfully updated! You can now log in.");
    setMode("login");
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) return;
    const newArr = [...otp];
    newArr[index] = val;
    setOtp(newArr);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              {mode === "login" && "Sign In to StockSense"}
              {mode === "signup" && "Create Warehouse Account"}
              {mode === "forgot_email" && "Reset Password via OTP"}
              {mode === "forgot_otp" && "Enter 6-Digit OTP"}
            </h3>
            <p className="text-xs text-zinc-500">Role-Based Inventory Access</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {notification && (
          <div className="mt-3 rounded-lg bg-emerald-50 p-2.5 text-xs text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {notification}
          </div>
        )}

        {/* Quick Team Sign-In */}
        {mode === "login" && (
          <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/50 p-3 dark:border-purple-900/50 dark:bg-purple-950/30">
            <p className="text-[11px] font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Users className="h-3.5 w-3.5 text-purple-600" />
              Quick 1-Click Team Member Login:
            </p>
            <div className="mt-2 space-y-1.5">
              {registeredUsers.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => handleQuickSelectUser(u)}
                  className="w-full flex items-center justify-between rounded-lg bg-white p-2 text-left text-xs shadow-xs hover:border-purple-400 hover:bg-purple-50/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition border border-zinc-200 dark:border-zinc-800"
                >
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{u.name}</span>
                    <span className="ml-1 text-[11px] text-zinc-400">({u.email})</span>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                      u.role === "Inventory Manager"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                    }`}
                  >
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1. Login / Sign Up Form */}
        {(mode === "login" || mode === "signup") && (
          <form onSubmit={handleLogin} className="mt-4 space-y-3.5">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    const typedEmail = e.target.value;
                    setEmail(typedEmail);
                    const found = registeredUsers.find(
                      (u) => u.email.toLowerCase() === typedEmail.toLowerCase()
                    );
                    if (found) {
                      setName(found.name);
                      setRole(found.role);
                    }
                  }}
                  placeholder="user@stocksense.com"
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setNotification(null);
                      setMode("forgot_email");
                    }}
                    className="text-xs text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Forgot Password? (OTP)
                  </button>
                )}
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
            </div>

            {/* Target Role selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Target Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "Inventory Manager" | "Warehouse Staff")}
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="Inventory Manager">Inventory Manager (Full Inbound/Outbound Control)</option>
                <option value="Warehouse Staff">Warehouse Staff (Picking, Shelving & Transfers)</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-purple-700 transition"
            >
              <ShieldCheck className="h-4 w-4" />
              {mode === "login" ? `Sign In as ${name || "User"}` : "Register Account"}
            </button>

            <div className="pt-2 text-center text-xs text-zinc-500">
              {mode === "login" ? (
                <span>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-semibold text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Register here
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </form>
        )}

        {/* 2. OTP Reset - Step 1: Enter Email */}
        {mode === "forgot_email" && (
          <form onSubmit={handleSendOTP} className="mt-4 space-y-4">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Enter your registered warehouse email address. We will generate and send a 6-digit one-time password (OTP).
            </p>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 font-mono text-xs"
                />
              </div>
            </div>

            {/* Quick Pick email */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {registeredUsers.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  onClick={() => setEmail(u.email)}
                  className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {u.email}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("login")}
                className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-purple-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-purple-700 transition"
              >
                <KeyRound className="h-3.5 w-3.5" /> Send Reset OTP
              </button>
            </div>
          </form>
        )}

        {/* 3. OTP Reset - Step 2: Enter 6 Digit OTP */}
        {mode === "forgot_otp" && (
          <form onSubmit={handleVerifyOTP} className="mt-4 space-y-4">
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Enter the 6-digit OTP code below to verify identity for <strong className="text-purple-600">{email}</strong>:
            </p>

            <div className="flex justify-between gap-1.5">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={otp[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="h-11 w-11 text-center font-mono text-lg font-bold rounded-lg border border-zinc-200 bg-zinc-50 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
                className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-purple-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("forgot_email")}
                className="flex items-center gap-1 rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </button>
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Verify & Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
