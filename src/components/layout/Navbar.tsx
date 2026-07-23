"use client";

import React from "react";
import Link from "next/link";
import { Search, Bell, Sun, Moon, Wrench, ShieldCheck, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  branchName?: string;
  activeRole?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  branchName = "الفرع الرئيسي - القاهرة",
  activeRole = "مدير النظام (Admin)",
}) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-6 backdrop-blur-md">
      {/* Search & Branch Indicator */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="بحث سريع (رقم الهاتف، IMEI، الفاتورة)..."
            className="w-full pr-9 pl-4 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
          <Wrench className="h-3.5 w-3.5" />
          <span>{branchName}</span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full text-slate-600 dark:text-slate-300"
        >
          {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-full text-slate-600 dark:text-slate-300">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        </Button>

        {/* User Login Profile Link */}
        <Link href="/login" className="flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-800 group hover:opacity-80 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">أحمد الموصلي</p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              <span>{activeRole}</span>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};
