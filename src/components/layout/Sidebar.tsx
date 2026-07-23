"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  QrCode,
  Wrench,
  Users,
  PackageCheck,
  ShoppingCart,
  BookOpen,
  MessageSquareShare,
  BarChart3,
  Settings,
  Building2,
  ChevronLeft,
} from "lucide-react";

const navigationItems = [
  { name: "لوحة التحكم (Dashboard)", href: "/", icon: LayoutDashboard },
  { name: "استقبال الأجهزة (Intake)", href: "/intake", icon: QrCode },
  { name: "الورشة والصيانة (Workshop)", href: "/workshop", icon: Wrench },
  { name: "إدارة العملاء (CRM)", href: "/customers", icon: Users },
  { name: "المخزن وقطع الغيار", href: "/inventory", icon: PackageCheck },
  { name: "نقطة البيع (POS)", href: "/pos", icon: ShoppingCart },
  { name: "الدفتر المالي والخزينة", href: "/finance", icon: BookOpen },
  { name: "الواتساب والأتمتة", href: "/automation", icon: MessageSquareShare },
  { name: "التقارير والإحصائيات", href: "/reports", icon: BarChart3 },
  { name: "الفروع والصلاحيات", href: "/branches", icon: Building2 },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between h-screen sticky top-0 shadow-sm">
      <div>
        {/* App Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl shadow-lg shadow-blue-500/20">
              ERP
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 dark:text-white">نظام الصيانة</h1>
              <p className="text-[10px] text-muted-foreground font-semibold">تكنو صيانة POS v1.0</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-slate-500 dark:text-slate-400")} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronLeft className="h-4 w-4" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Settings Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <Settings className="h-4 w-4 text-slate-500" />
          <span>الإعدادات العامة</span>
        </Link>
      </div>
    </aside>
  );
};
