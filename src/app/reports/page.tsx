"use client";

import React from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileSpreadsheet, FileText, Download, TrendingUp, DollarSign, PieChart, ShieldAlert } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg">
            المرحلة 7: التقارير المالية والنسخ الاحتياطي
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            تقرير الأرباح والخسائر والتحليلات الهيكلية (Profit & Loss Analytics)
          </h1>
          <p className="text-xs text-muted-foreground">
            تصدير البيانات والتقارير الشاملة بصيغ PDF و Excel مع الدقة المالية المزدوجة
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>تصدير لـ Excel</span>
          </Button>
          <Button variant="gradient" size="sm" className="gap-2 text-xs">
            <FileText className="h-4 w-4" />
            <span>تحميل تقرير PDF</span>
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          title="صافي الأرباح لهذا الشهر"
          value="68,400 ج.م"
          description="بعد خصم تكلفة القطع والمصروفات"
          icon={TrendingUp}
          accentGradient="emerald"
          trend={{ value: "14.2%+", isPositive: true }}
        />
        <MetricCard
          title="أكثر الأعطال تكراراً"
          value="تغيير الشاشات (42%)"
          description="تليها مشاكل الباور والد الشحن"
          icon={PieChart}
          accentGradient="blue"
        />
        <MetricCard
          title="نسبة تحصيل الديون الآجلة"
          value="88.5%"
          description="معدل ملتزم وممتاز للتجار"
          icon={DollarSign}
          accentGradient="purple"
        />
      </div>

      {/* Breakdown Table Card */}
      <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-3">
          بيان الأرباح والخسائر المختصر (Profit & Loss Breakdown)
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between py-2 border-b">
            <span className="font-bold text-slate-700 dark:text-slate-300">إجمالي إيراد الصيانة:</span>
            <span className="font-bold text-emerald-600">+ 112,000 ج.م</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-bold text-slate-700 dark:text-slate-300">إجمالي مبيعات الإكسسوارات (POS):</span>
            <span className="font-bold text-emerald-600">+ 30,000 ج.م</span>
          </div>
          <div className="flex justify-between py-2 border-b text-rose-600">
            <span>خصم: تكلفة قطع الغيار المباشرة:</span>
            <span className="font-bold">- 39,100 ج.م</span>
          </div>
          <div className="flex justify-between py-2 border-b text-rose-600">
            <span>خصم: عمولات وأرباح المهندسين المستحقة:</span>
            <span className="font-bold">- 10,000 ج.م</span>
          </div>
          <div className="flex justify-between py-2 border-b text-rose-600">
            <span>خصم: المصروفات التشغيلية (إيجار، رواتب، كهرباء):</span>
            <span className="font-bold">- 24,500 ج.م</span>
          </div>
          <div className="flex justify-between py-3 pt-4 border-t-2 text-sm bg-slate-50 dark:bg-slate-800/80 px-4 rounded-xl">
            <span className="font-extrabold text-slate-900 dark:text-white">صافي الربح النهائي (Net Profit):</span>
            <span className="font-black text-emerald-600 text-base">+ 68,400 ج.م</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
