"use client";

import React, { useState, useEffect } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, TrendingUp, DollarSign, PieChart, RefreshCw } from "lucide-react";

export default function ReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [finance, setFinance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [resOrders, resInv, resFin] = await Promise.all([
        fetch("/api/work-orders").then((r) => r.json()),
        fetch("/api/inventory").then((r) => r.json()),
        fetch("/api/finance").then((r) => r.json()),
      ]);

      if (resOrders.success) setOrders(resOrders.data);
      if (resInv.success) setInventory(resInv.data);
      if (resFin.success) setFinance(resFin.data);
    } catch (err) {
      console.error("Failed to fetch report data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const totalMaintenanceRevenue = orders.reduce(
    (sum, o) => sum + Number(o.finalCost || o.estimatedCost || 0),
    0
  );

  const totalFinanceIncome = finance
    .filter((f) => f.action === "مقبوضات" || f.action === "إيراد")
    .reduce((sum, f) => sum + Number(f.details?.amount || 0), 0);

  const totalFinanceExpense = finance
    .filter((f) => f.action === "مصروفات تشغيل" || f.action === "مصروف")
    .reduce((sum, f) => sum + Number(f.details?.amount || 0), 0);

  const netProfit = totalMaintenanceRevenue + totalFinanceIncome - totalFinanceExpense;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg">
            التقارير المالية والتحليلات (Neon Live Analytics)
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            تقرير الأرباح والخسائر والتحليلات الهيكلية
          </h1>
          <p className="text-xs text-muted-foreground">
            حساب ديناميكي ومباشر لنتائج الأعمال من قاعدة بيانات Neon PostgreSQL
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchReportData} className="gap-2 text-xs">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث التقارير</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>تصدير Excel</span>
          </Button>
          <Button variant="gradient" size="sm" className="gap-2 text-xs">
            <FileText className="h-4 w-4" />
            <span>تحميل PDF</span>
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          title="صافي الأرباح"
          value={`${netProfit.toLocaleString("ar-EG")} ج.م`}
          description="مجموع الإيرادات مطروحاً منها المصروفات"
          icon={TrendingUp}
          accentGradient="emerald"
        />
        <MetricCard
          title="عدد أصناف المخزون المسجلة"
          value={`${inventory.length} أصناف`}
          description="قطع غيار وإكسسوارات في PostgreSQL"
          icon={PieChart}
          accentGradient="blue"
        />
        <MetricCard
          title="إجمالي إيراد أوامر الصيانة"
          value={`${totalMaintenanceRevenue.toLocaleString("ar-EG")} ج.م`}
          description="مجموع قيم الصيانة الحالية"
          icon={DollarSign}
          accentGradient="purple"
        />
      </div>

      {/* Breakdown Table Card */}
      <Card className="p-6 space-y-4 bg-white dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-3">
          بيان الأرباح والخسائر الفعلي (Profit & Loss Breakdown)
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between py-2 border-b">
            <span className="font-bold text-slate-700 dark:text-slate-300">إجمالي إيراد أوامر الصيانة:</span>
            <span className="font-bold text-emerald-600">+ {totalMaintenanceRevenue.toLocaleString("ar-EG")} ج.م</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-bold text-slate-700 dark:text-slate-300">إجمالي مقبوضات الدفتر المالي:</span>
            <span className="font-bold text-emerald-600">+ {totalFinanceIncome.toLocaleString("ar-EG")} ج.م</span>
          </div>
          <div className="flex justify-between py-2 border-b text-rose-600">
            <span>خصم: المصروفات والرواتب التشغيلية:</span>
            <span className="font-bold">- {totalFinanceExpense.toLocaleString("ar-EG")} ج.م</span>
          </div>
          <div className="flex justify-between py-3 pt-4 border-t-2 text-sm bg-slate-50 dark:bg-slate-800/80 px-4 rounded-xl">
            <span className="font-extrabold text-slate-900 dark:text-white">صافي الربح النهائي (Net Profit):</span>
            <span className="font-black text-emerald-600 text-base">
              {netProfit >= 0 ? `+ ${netProfit.toLocaleString("ar-EG")} ج.م` : `- ${Math.abs(netProfit).toLocaleString("ar-EG")} ج.م`}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
