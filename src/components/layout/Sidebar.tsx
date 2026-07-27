"use client";

import React, { useState } from "react";
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
  Lock,
  Cpu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface NavGroup {
  title: string;
  items: {
    name: string;
    href: string;
    icon: React.ElementType;
  }[];
}

const navigationGroups: NavGroup[] = [
  {
    title: "العمليات التشغيلية",
    items: [
      { name: "لوحة التحكم الرئيسية", href: "/", icon: LayoutDashboard },
      { name: "استقبال الأجهزة", href: "/intake", icon: QrCode },
      { name: "الورشة والصيانة", href: "/workshop", icon: Wrench },
      { name: "نقطة البيع (POS)", href: "/pos", icon: ShoppingCart },
    ],
  },
  {
    title: "المخازن والمالية",
    items: [
      { name: "المخزن وقطع الغيار", href: "/inventory", icon: PackageCheck },
      { name: "الدفتر المالي والخزينة", href: "/finance", icon: BookOpen },
      { name: "التقارير والإحصائيات", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "الإدارة والنظام",
    items: [
      { name: "إدارة العملاء", href: "/customers", icon: Users },
      { name: "الواتساب والأتمتة", href: "/automation", icon: MessageSquareShare },
      { name: "الفروع والصلاحيات", href: "/branches", icon: Building2 },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between h-screen sticky top-0 shadow-sm transition-all duration-300 z-40 select-none",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div>
        {/* App Header Logo & Toggle Button */}
        <div className="flex h-16 items-center justify-between px-3.5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-lg shadow-sm">
              <Cpu className="h-5 w-5 text-emerald-500" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h1 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">تكنو صيانة</h1>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">نظام ERP & POS</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
          >
            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)]">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {!isCollapsed && (
                <h2 className="px-3 pt-2 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {group.title}
                </h2>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-sm px-3 py-2 text-xs font-bold transition-all duration-150 relative group",
                      isActive
                        ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {/* Active Right Accent Line */}
                    {isActive && (
                      <span className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-sm" />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-emerald-400 dark:text-emerald-600"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                      )}
                    />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Settings & Auth Footer */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <Link
          href="/login"
          title={isCollapsed ? "حساب المستخدم والتسجيل" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-sm px-3 py-2 text-xs font-bold transition-all",
            pathname === "/login"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          <Lock className="h-4 w-4 shrink-0 text-slate-500" />
          {!isCollapsed && <span className="truncate">حساب المستخدم والتسجيل</span>}
        </Link>

        <Link
          href="/settings"
          title={isCollapsed ? "الإعدادات العامة" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-sm px-3 py-2 text-xs font-bold transition-all relative",
            pathname === "/settings"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          )}
        >
          {pathname === "/settings" && (
            <span className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-sm" />
          )}
          <Settings className="h-4 w-4 shrink-0 text-slate-500" />
          {!isCollapsed && <span className="truncate">الإعدادات العامة</span>}
        </Link>
      </div>
    </aside>
  );
};
