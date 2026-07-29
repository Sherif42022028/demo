"use client";

import React, { useState, useEffect } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { FileSpreadsheet, FileText, TrendingUp, DollarSign, PieChart as PieIcon, RefreshCw, BarChart2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function ReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [finance, setFinance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Date Range Filter State
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

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

  // Filter orders by date if set
  const filteredOrders = orders.filter((o) => {
    if (!o.createdAt) return true;
    const date = new Date(o.createdAt);
    if (fromDate && date < new Date(fromDate)) return false;
    if (toDate && date > new Date(toDate + "T23:59:59")) return false;
    return true;
  });

  const totalMaintenanceRevenue = filteredOrders.reduce(
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

  // Chart Data Calculations
  const statusLabels: Record<string, string> = {
    NEW: "جديد",
    INSPECTING: "جاري الفحص",
    WAITING_PARTS: "انتظار قطع",
    IN_REPAIR: "جاري الإصلاح",
    READY: "جاهز للتسليم",
    DELIVERED: "تم التسليم",
  };

  const statusChartData = Object.keys(statusLabels).map((statusKey) => {
    const matching = filteredOrders.filter((o) => o.status === statusKey);
    const revenue = matching.reduce((sum, o) => sum + Number(o.finalCost || o.estimatedCost || 0), 0);
    return {
      status: statusLabels[statusKey],
      revenue,
      count: matching.length,
    };
  });

  const pieChartData = [
    { name: "إيراد الصيانة", value: totalMaintenanceRevenue, color: "#10b981" },
    { name: "مقبوضات مالية", value: totalFinanceIncome, color: "#3b82f6" },
    { name: "مصروفات تشغيل", value: totalFinanceExpense, color: "#f43f5e" },
  ].filter((item) => item.value > 0);

  const exportToExcel = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      "البيان,المبلغ (ج.م)\n" +
      `إجمالي إيراد الصيانة,${totalMaintenanceRevenue}\n` +
      `إجمالي مقبوضات الدفتر المالي,${totalFinanceIncome}\n` +
      `خصم المصروفات والرواتب,${totalFinanceExpense}\n` +
      `صافي الربح النهائي,${netProfit}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `تقرير_الأرباح_والخسائر_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-sm">
            التقارير المالية والتحليلات
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            تقرير الأرباح والخسائر والتحليلات الهيكلية
          </h1>
          <p className="text-xs text-muted-foreground">
            حسابات وقوائم مالية شاملة لنتائج الأعمال
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchReportData} className="gap-2 text-xs">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel} className="gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            <FileSpreadsheet className="h-4 w-4" />
            <span>تصدير CSV</span>
          </Button>
          <Button
            size="sm"
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-bold"
          >
            <FileText className="h-4 w-4" />
            <span>تحميل PDF</span>
          </Button>
        </div>
      </div>

      {/* Date Range Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <DatePicker label="من تاريخ:" value={fromDate} onChange={(v) => setFromDate(v)} />
        <DatePicker label="إلى تاريخ:" value={toDate} onChange={(v) => setToDate(v)} />

        {(fromDate || toDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setFromDate(""); setToDate(""); }}
            className="text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 mt-4 sm:mt-0"
          >
            إلغاء الفلتر
          </Button>
        )}
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="صافي الأرباح"
          value={`${netProfit.toLocaleString("en-US")} ج.م`}
          description="مجموع الإيرادات مطروحاً منها المصروفات"
          icon={TrendingUp}
        />
        <MetricCard
          title="عدد أصناف المخزون المسجلة"
          value={`${inventory.length.toLocaleString("en-US")} أصناف`}
          description="قطع غيار وإكسسوارات مسجلة بالمخزن"
          icon={PieIcon}
        />
        <MetricCard
          title="إجمالي إيراد أوامر الصيانة"
          value={`${totalMaintenanceRevenue.toLocaleString("en-US")} ج.م`}
          description="مجموع قيم الصيانة بالمجمل"
          icon={DollarSign}
        />
      </div>

      {/* Interactive Recharts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Revenue by Maintenance Status */}
        <Card className="p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm rounded-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
            <BarChart2 className="h-4 w-4 text-emerald-500" />
            <span>توزيع الإيرادات حسب حالة أوامر الصيانة (ج.م)</span>
          </h3>
          <div className="h-[250px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString("en-US")} ج.م`, "الإيراد"]}
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "4px", color: "#fff", fontSize: "12px" }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart: Financial Distribution */}
        <Card className="p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm rounded-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
            <PieIcon className="h-4 w-4 text-blue-500" />
            <span>الهيكل المالي لنسب الإيرادات والمصروفات</span>
          </h3>
          <div className="h-[250px] w-full pt-2">
            {pieChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                لا توجد بيانات مالية للعرض حالياً
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString("en-US")} ج.م`, "المبلغ"]}
                    contentStyle={{ backgroundColor: "#0f172a", borderRadius: "4px", color: "#fff", fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Breakdown Table Card */}
      <Card className="p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm rounded-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b pb-3">
          بيان الأرباح والخسائر الفعلي (Profit & Loss Breakdown)
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between py-2 border-b">
            <span className="font-bold text-slate-700 dark:text-slate-300">إجمالي إيراد أوامر الصيانة:</span>
            <span className="font-bold text-emerald-600">+ {totalMaintenanceRevenue.toLocaleString("en-US")} ج.م</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-bold text-slate-700 dark:text-slate-300">إجمالي مقبوضات الدفتر المالي:</span>
            <span className="font-bold text-emerald-600">+ {totalFinanceIncome.toLocaleString("en-US")} ج.م</span>
          </div>
          <div className="flex justify-between py-2 border-b text-rose-600">
            <span>خصم: المصروفات والرواتب التشغيلية:</span>
            <span className="font-bold">- {totalFinanceExpense.toLocaleString("en-US")} ج.م</span>
          </div>
          <div className="flex justify-between py-3 pt-4 border-t-2 text-sm bg-slate-50 dark:bg-slate-800/80 px-4 rounded-sm border border-slate-200 dark:border-slate-700">
            <span className="font-extrabold text-slate-900 dark:text-white">صافي الربح النهائي (Net Profit):</span>
            <span className="font-bold text-emerald-600 text-base">
              {netProfit >= 0 ? `+ ${netProfit.toLocaleString("en-US")} ج.م` : `- ${Math.abs(netProfit).toLocaleString("en-US")} ج.م`}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
