"use client";

import React, { useState } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/form-dialog";
import { BookOpen, DollarSign, ArrowUpRight, ArrowDownLeft, Plus, Wallet, FileText, Landmark } from "lucide-react";

interface Transaction {
  id: string;
  refNo: string;
  type: "مقبوضات" | "مدفوعات" | "مصروفات تشغيل";
  category: string; // إيجار، مرتبات، مبيعات POS، صيانة
  amount: number;
  account: string; // الخزينة الرئيسية، البنك الأهلي
  notes: string;
  date: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    refNo: "TX-901",
    type: "مقبوضات",
    category: "إيراد أمر صيانة WO-1001",
    amount: 4500,
    account: "الخزينة الرئيسية",
    notes: "تحصيل كاش من محمد عبد الرحمن",
    date: "2026-07-23",
  },
  {
    id: "2",
    refNo: "TX-902",
    type: "مصروفات تشغيل",
    category: "إيجار الفرع الرئيسي",
    amount: 12000,
    account: "البنك الأهلي",
    notes: "سداد إيجار شهر يوليو 2026",
    date: "2026-07-22",
  },
  {
    id: "3",
    refNo: "TX-903",
    type: "مقبوضات",
    category: "مبيعات POS إكسسوارات",
    amount: 1450,
    account: "الخزينة الرئيسية",
    notes: "بيع شواحن وكوابل أنكر",
    date: "2026-07-23",
  },
];

export default function FinancePage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const columns: Column<Transaction>[] = [
    {
      header: "رقم القيد والتاريخ",
      cell: (t) => (
        <div>
          <span className="font-mono text-xs font-black text-blue-600">{t.refNo}</span>
          <p className="text-[11px] text-muted-foreground font-mono">{t.date}</p>
        </div>
      ),
    },
    {
      header: "نوع الحركة والتصنيف",
      cell: (t) => (
        <div>
          <Badge variant={t.type === "مقبوضات" ? "success" : "destructive"}>{t.type}</Badge>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{t.category}</p>
        </div>
      ),
    },
    {
      header: "المبلغ (ج.م)",
      cell: (t) => (
        <span className={`font-mono font-black text-sm ${t.type === "مقبوضات" ? "text-emerald-600" : "text-rose-600"}`}>
          {t.type === "مقبوضات" ? "+" : "-"}{t.amount.toLocaleString("ar-EG")} ج.م
        </span>
      ),
    },
    {
      header: "الحساب المالي",
      cell: (t) => (
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
          <Landmark className="h-3.5 w-3.5 text-blue-500" />
          <span>{t.account}</span>
        </span>
      ),
    },
    {
      header: "البيان / الملاحظات",
      accessorKey: "notes",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg">
            المرحلة 5: الدفتر المالي والخزينة
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            محرك القيود المزدوجة والمصروفات (Double-Entry Ledger Engine)
          </h1>
          <p className="text-xs text-muted-foreground">
            تسجيل حركة المقبوضات والمدفوعات وإيجارات الفروع ومرتبات المهندسين فورياً
          </p>
        </div>

        <Button variant="emerald" onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>تسجيل حركة مالية جديدة</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          title="رصيد الخزينة الرئيسية الحالي"
          value="48,250 ج.م"
          description="السيولة النقذية المتاحة كاش"
          icon={Wallet}
          accentGradient="emerald"
        />
        <MetricCard
          title="إجمالي مقبوضات الشهر"
          value="142,000 ج.م"
          description="إيراد صيانة + مبيعات POS"
          icon={ArrowUpRight}
          accentGradient="blue"
        />
        <MetricCard
          title="إجمالي المصروفات والرواتب"
          value="34,500 ج.م"
          description="إيجارات + مرتبات + أدوات ورشة"
          icon={ArrowDownLeft}
          accentGradient="amber"
        />
      </div>

      <CustomTable columns={columns} data={mockTransactions} />

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="تسجيل قيد مالي / سند جديد">
        <form onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">نوع المعاملة *</label>
              <select className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800">
                <option>مقبوضات (إيراد)</option>
                <option>مصروفات تشغيل (إيجار/مرتبات)</option>
                <option>مدفوعات للموردين</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">المبلغ (ج.م) *</label>
              <input type="number" required placeholder="1000" className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">الحساب المالي (الخزينة/البنك) *</label>
            <select className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800">
              <option>الخزينة الرئيسية</option>
              <option>البنك الأهلي المصري</option>
              <option>محفظة فودافون كاش</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">البيان والتفاصيل</label>
            <textarea rows={2} placeholder="سداد إيجار / شراء أدوات صيانة..." className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button variant="gradient" type="submit">ترحيل القيد المالي</Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
