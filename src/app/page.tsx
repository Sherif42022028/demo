"use client";

import React, { useState } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/form-dialog";
import {
  Wrench,
  QrCode,
  DollarSign,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
} from "lucide-react";

interface WorkOrderSummary {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  fault: string;
  engineer: string;
  status: "NEW" | "INSPECTING" | "IN_REPAIR" | "READY" | "DELIVERED";
  cost: number;
  date: string;
}

const mockOrders: WorkOrderSummary[] = [
  {
    id: "1",
    ticketNumber: "WO-1001",
    customerName: "محمد عبد الرحمن",
    customerPhone: "01012345678",
    deviceModel: "iPhone 13 Pro Max",
    fault: "تغيير شاشة + شحن",
    engineer: "م. أحمد حسام",
    status: "IN_REPAIR",
    cost: 4500,
    date: "2026-07-23",
  },
  {
    id: "2",
    ticketNumber: "WO-1002",
    customerName: "سارة محمود",
    customerPhone: "01198765432",
    deviceModel: "Samsung S22 Ultra",
    fault: "تغيير باغة وسوكيت",
    engineer: "م. محمود طارق",
    status: "READY",
    cost: 2100,
    date: "2026-07-23",
  },
  {
    id: "3",
    ticketNumber: "WO-1003",
    customerName: "شركة الفرسان للتجارة",
    customerPhone: "01200001122",
    deviceModel: "iPad Air 5",
    fault: "عطل دائرة الباور (IC)",
    engineer: "م. أحمد حسام",
    status: "NEW",
    cost: 3200,
    date: "2026-07-23",
  },
];

const statusBadgeMap = {
  NEW: { label: "جديد", variant: "info" as const },
  INSPECTING: { label: "جاري الفحص", variant: "warning" as const },
  IN_REPAIR: { label: "جاري الإصلاح", variant: "purple" as const },
  READY: { label: "جاهز للتسليم", variant: "success" as const },
  DELIVERED: { label: "تم التسليم", variant: "secondary" as const },
};

export default function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.customerName.includes(searchQuery) ||
      order.ticketNumber.includes(searchQuery) ||
      order.deviceModel.includes(searchQuery) ||
      order.customerPhone.includes(searchQuery)
  );

  const columns: Column<WorkOrderSummary>[] = [
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
          <p className="font-bold text-slate-900 dark:text-slate-100">{row.customerName}</p>
          <p className="text-[11px] text-muted-foreground font-mono">{row.customerPhone}</p>
        </div>
      ),
    },
    {
      header: "الجهاز والعطل",
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200">{row.deviceModel}</p>
          <p className="text-xs text-muted-foreground">{row.fault}</p>
        </div>
      ),
    },
    {
      header: "المهندس المسؤول",
      accessorKey: "engineer",
    },
    {
      header: "الحالة",
      cell: (row) => {
        const badgeInfo = statusBadgeMap[row.status];
        return <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>;
      },
    },
    {
      header: "التكلفة (ج.م)",
      cell: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-white font-mono">
          {row.cost.toLocaleString("ar-EG")} ج.م
        </span>
      ),
    },
    {
      header: "إجراءات",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
            <Printer className="h-3.5 w-3.5" />
            <span>طباعة</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600">
            تعديل
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
            متابعة فورية لأوامر الصيانة، حركة المخزون، والقيود المالية المزدوجة لكل الفروع.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="emerald"
            size="lg"
            onClick={() => setDialogOpen(true)}
            className="gap-2 shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>استلام جهاز جديد</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="أوامر الصيانة اليوم"
          value="24 جهاز"
          description="8 قيد الإصلاح | 6 جاهز"
          icon={Wrench}
          accentGradient="blue"
          trend={{ value: "12%+", isPositive: true }}
        />
        <MetricCard
          title="إجمالي مبيعات اليوم"
          value="18,450 ج.م"
          description="صيانة + مبيعات POS"
          icon={DollarSign}
          accentGradient="emerald"
          trend={{ value: "8%+", isPositive: true }}
        />
        <MetricCard
          title="الأجهزة المنتظرة للتسليم"
          value="9 أجهزة"
          description="بانتظار استلام العميل"
          icon={CheckCircle2}
          accentGradient="amber"
        />
        <MetricCard
          title="نقص المخزون (تحذير)"
          value="4 أصناف"
          description="وصلت للحد الأدنى"
          icon={AlertTriangle}
          accentGradient="purple"
        />
      </div>

      {/* Main Table & Maintenance Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">أحدث أوامر الصيانة</h2>
            <p className="text-xs text-muted-foreground">عرض الأجهزة المستلمة ومتابعة حالتها اللحظية</p>
          </div>
        </div>

        <CustomTable
          columns={columns}
          data={filteredOrders}
          onSearch={(q) => setSearchQuery(q)}
          searchPlaceholder="بحث برقم الأمر، العميل، الهاتف، أو الموديل..."
        />
      </div>

      {/* New Ticket Intake Modal Demo */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="استلام جهاز صيانة جديد (Work Order Intake)"
        description="تسجيل الفحص الأول، العطل المعلن، والملحقات مع توليد الـ QR Code"
        maxWidth="xl"
      >
        <form onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">اسم العميل</label>
              <input
                type="text"
                placeholder="أحمد علي"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">رقم الهاتف</label>
              <input
                type="text"
                placeholder="010xxxxxxx"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">موديل الجهاز</label>
              <input
                type="text"
                placeholder="iPhone 14 Pro"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">الرقم التسلسلي (IMEI)</label>
              <input
                type="text"
                placeholder="358xxxxxxxxxxxx"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold mb-1">العطل المعلن من العميل</label>
              <textarea
                rows={2}
                placeholder="الشاشة لا تعمل، توقف الجهاز فجأة بعد السقوط..."
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="gradient" type="submit" className="gap-2">
              <QrCode className="h-4 w-4" />
              <span>حفظ وطباعة إيصال الاستلام الحراري</span>
            </Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
