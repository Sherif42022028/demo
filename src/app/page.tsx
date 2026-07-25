"use client";

import React, { useState, useEffect } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/form-dialog";
import {
  Wrench,
  QrCode,
  DollarSign,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Printer,
  RefreshCw,
  Filter,
} from "lucide-react";

interface WorkOrder {
  id: string;
  ticketNumber: string;
  customerName?: string;
  customerPhone?: string;
  deviceModel: string;
  reportedFault: string;
  status: "NEW" | "INSPECTING" | "WAITING_PARTS" | "IN_REPAIR" | "READY" | "DELIVERED" | "CANCELLED";
  estimatedCost: string | number;
  finalCost?: string | number;
  createdAt?: string;
}

const statusBadgeMap = {
  NEW: { label: "جديد", variant: "info" as const },
  INSPECTING: { label: "جاري الفحص", variant: "warning" as const },
  WAITING_PARTS: { label: "انتظار قطع", variant: "destructive" as const },
  IN_REPAIR: { label: "جاري الإصلاح", variant: "purple" as const },
  READY: { label: "جاهز للتسليم", variant: "success" as const },
  DELIVERED: { label: "تم التسليم", variant: "secondary" as const },
  CANCELLED: { label: "ملغى", variant: "outline" as const },
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deviceModel: "",
    imei: "",
    devicePassword: "",
    reportedFault: "",
    accessories: "جراب، شاحن",
    estimatedCost: "1500",
    depositPaid: "300",
  });

  const fetchOrders = async () => {
    setLoading(true);
    setIsError(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/work-orders", { signal: controller.signal });
      clearTimeout(timeoutId);
      const json = await res.json();
      if (json.success) {
        setOrders(json.data);
      } else {
        setIsError(true);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Failed to fetch live orders", err);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setDialogOpen(false);
        setFormData({
          customerName: "",
          customerPhone: "",
          deviceModel: "",
          imei: "",
          devicePassword: "",
          reportedFault: "",
          accessories: "جراب، شاحن",
          estimatedCost: "1500",
          depositPaid: "300",
        });
        fetchOrders();
      } else {
        alert(json.error || "تعذر حفظ الفاتورة");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالنظام");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customerName || "").includes(searchQuery) ||
      (order.ticketNumber || "").includes(searchQuery) ||
      (order.deviceModel || "").includes(searchQuery) ||
      (order.customerPhone || "").includes(searchQuery);

    const matchesStatus = selectedStatusFilter === "ALL" || order.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns: Column<WorkOrder>[] = [
    {
      header: "رقم الأمر",
      accessorKey: "ticketNumber",
      cell: (row) => (
        <span className="font-black text-blue-600 dark:text-blue-400 font-mono">
          {row.ticketNumber}
        </span>
      ),
    },
    {
      header: "العميل",
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{row.customerName || "عميل نقد"}</p>
          <p className="text-[11px] text-muted-foreground font-mono">{row.customerPhone || "—"}</p>
        </div>
      ),
    },
    {
      header: "الجهاز والعطل",
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200">{row.deviceModel}</p>
          <p className="text-xs text-muted-foreground">{row.reportedFault}</p>
        </div>
      ),
    },
    {
      header: "الحالة الحالية",
      cell: (row) => {
        const badgeInfo = statusBadgeMap[row.status] || { label: row.status, variant: "outline" as const };
        return <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>;
      },
    },
    {
      header: "التكلفة (ج.م)",
      cell: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-white font-mono">
          {Number(row.finalCost || row.estimatedCost).toLocaleString("en-US")} ج.م
        </span>
      ),
    },
    {
      header: "إجراءات",
      cell: () => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 text-xs gap-1"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>طباعة الإيصال</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 rounded-2xl text-white shadow-xl">
        <div>
          <h1 className="text-2xl font-black">أهلاً بك في نظام إدارة الصيانة والمبيعات 👋</h1>
          <p className="mt-1 text-xs text-blue-100 font-medium">
            جميع الحركات وأوامر الصيانة تُحفظ وتظهر فورياً عبر نظام المزامنة المباشر.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchOrders}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-2 text-xs"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث البيانات</span>
          </Button>
          <Button
            variant="emerald"
            size="lg"
            onClick={() => setDialogOpen(true)}
            className="gap-2 shadow-lg text-xs font-bold"
          >
            <Plus className="h-5 w-5" />
            <span>إضافة أمر صيانة جديد</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="إجمالي أوامر الصيانة"
          value={`${orders.length.toLocaleString("en-US")} أمر`}
          description="مسجلة في قاعدة بيانات النظام"
          icon={Wrench}
          accentGradient="blue"
        />
        <MetricCard
          title="إجمالي أرباح الصيانة"
          value={`${orders.reduce((sum, o) => sum + Number(o.finalCost || o.estimatedCost || 0), 0).toLocaleString("en-US")} ج.م`}
          description="مجموع قيم الصيانة المسجلة"
          icon={DollarSign}
          accentGradient="emerald"
        />
        <MetricCard
          title="الأجهزة قيد الصيانة"
          value={`${orders.filter((o) => o.status === "IN_REPAIR" || o.status === "INSPECTING" || o.status === "NEW").length.toLocaleString("en-US")} أجهزة`}
          description="في ورشة الصيانة الآن"
          icon={CheckCircle2}
          accentGradient="amber"
        />
        <MetricCard
          title="الأجهزة الجاهزة للتسليم"
          value={`${orders.filter((o) => o.status === "READY").length.toLocaleString("en-US")} أجهزة`}
          description="بانتظار استلام العميل"
          icon={AlertTriangle}
          accentGradient="purple"
        />
      </div>

      {/* Main Table Section with Search & Status Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">جدول أوامر الصيانة الرئيسي</h2>
            <p className="text-xs text-muted-foreground">تحديث لحظي لكافة حالات الأجهزة والمعاملات</p>
          </div>

          {/* Status Filter Selector */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="p-2 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-bold focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">جميع الحالات ({orders.length})</option>
              <option value="NEW">جديد ({orders.filter((o) => o.status === "NEW").length})</option>
              <option value="INSPECTING">جاري الفحص ({orders.filter((o) => o.status === "INSPECTING").length})</option>
              <option value="WAITING_PARTS">انتظار قطع ({orders.filter((o) => o.status === "WAITING_PARTS").length})</option>
              <option value="IN_REPAIR">جاري الإصلاح ({orders.filter((o) => o.status === "IN_REPAIR").length})</option>
              <option value="READY">جاهز للتسليم ({orders.filter((o) => o.status === "READY").length})</option>
              <option value="DELIVERED">تم التسليم ({orders.filter((o) => o.status === "DELIVERED").length})</option>
            </select>
          </div>
        </div>

        <CustomTable
          columns={columns}
          data={filteredOrders}
          isLoading={loading}
          isError={isError}
          onRetry={fetchOrders}
          onSearch={(q) => setSearchQuery(q)}
          searchPlaceholder="بحث برقم الأمر، اسم العميل، الهاتف، أو الموديل..."
          emptyMessage="لا توجد أوامر صيانة مسجلة حالياً"
          emptyAction={
            <Button variant="emerald" onClick={() => setDialogOpen(true)} className="gap-2 text-xs mt-2">
              <Plus className="h-4 w-4" />
              <span>إضافة أول أمر صيانة</span>
            </Button>
          }
        />
      </div>

      {/* Order Intake Modal */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="استلام جهاز صيانة جديد"
        description="سيتم إضافة بيانات العميل وأمر الصيانة مباشرة للسيستم"
        maxWidth="xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">اسم العميل *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="أحمد علي"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">رقم الهاتف *</label>
              <input
                type="text"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="01012345678"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">موديل الجهاز *</label>
              <input
                type="text"
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                placeholder="iPhone 14 Pro"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">الرقم التسلسلي (IMEI)</label>
              <input
                type="text"
                value={formData.imei}
                onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                placeholder="358xxxxxxxxxxxx"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">رمز القفل / الباسورد</label>
              <input
                type="text"
                value={formData.devicePassword}
                onChange={(e) => setFormData({ ...formData, devicePassword: e.target.value })}
                placeholder="1234"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">التكلفة التقديرية (ج.م) *</label>
              <input
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                placeholder="1500"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold mb-1">وصف العطل المعلن *</label>
              <textarea
                rows={2}
                value={formData.reportedFault}
                onChange={(e) => setFormData({ ...formData, reportedFault: e.target.value })}
                placeholder="الشاشة لا تعمل، توقف الجهاز فجأة..."
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="gradient" type="submit" disabled={submitting} className="gap-2 text-xs">
              <QrCode className="h-4 w-4" />
              <span>{submitting ? "جاري الحفظ..." : "حفظ أمر الصيانة"}</span>
            </Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
