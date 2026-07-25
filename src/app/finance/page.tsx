"use client";

import React, { useState, useEffect } from "react";
import { MetricCard } from "@/components/ui/metric-card";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/form-dialog";
import { DollarSign, ArrowUpRight, ArrowDownLeft, Plus, Wallet, Landmark, RefreshCw } from "lucide-react";

interface Transaction {
  id: string;
  action: string;
  entityName: string;
  entityId?: string;
  details?: { amount?: number | string; notes?: string; account?: string };
  createdAt?: string;
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: "مقبوضات",
    category: "إيراد صيانة",
    amount: "1000",
    account: "الخزينة الرئيسية",
    notes: "",
  });

  const fetchTransactions = async () => {
    setLoading(true);
    setIsError(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/finance", { signal: controller.signal });
      clearTimeout(timeoutId);
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data);
      } else {
        setIsError(true);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Failed to fetch financial transactions", err);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setDialogOpen(false);
        setFormData({ type: "مقبوضات", category: "إيراد صيانة", amount: "1000", account: "الخزينة الرئيسية", notes: "" });
        fetchTransactions();
      } else {
        alert(json.error || "تعذر ترحيل القيد المالي");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالنظام");
    } finally {
      setSubmitting(false);
    }
  };

  // Dynamic totals calculation
  const totalIncome = transactions
    .filter((t) => t.action === "مقبوضات" || t.action === "إيراد")
    .reduce((sum, t) => sum + Number(t.details?.amount || 0), 0);

  const totalExpense = transactions
    .filter((t) => t.action === "مصروفات تشغيل" || t.action === "مصروف")
    .reduce((sum, t) => sum + Number(t.details?.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  const columns: Column<Transaction>[] = [
    {
      header: "رقم القيد والتاريخ",
      cell: (t) => (
        <div>
          <span className="font-mono text-xs font-black text-blue-600">{t.id}</span>
          <p className="text-[11px] text-muted-foreground font-mono">
            {t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-US") : "اليوم"}
          </p>
        </div>
      ),
    },
    {
      header: "نوع الحركة والتصنيف",
      cell: (t) => (
        <div>
          <Badge variant={t.action === "مقبوضات" ? "success" : "destructive"}>{t.action}</Badge>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{t.entityName}</p>
        </div>
      ),
    },
    {
      header: "المبلغ (ج.م)",
      cell: (t) => {
        const amt = Number(t.details?.amount || 0);
        const isIncome = t.action === "مقبوضات" || t.action === "إيراد";
        return (
          <span className={`font-mono font-black text-sm ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
            {isIncome ? "+" : "-"}{amt.toLocaleString("en-US")} ج.م
          </span>
        );
      },
    },
    {
      header: "الحساب المالي",
      cell: (t) => (
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
          <Landmark className="h-3.5 w-3.5 text-blue-500" />
          <span>{t.details?.account || t.entityId || "الخزينة الرئيسية"}</span>
        </span>
      ),
    },
    {
      header: "البيان / الملاحظات",
      cell: (t) => <span>{t.details?.notes || "—"}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg">
            الدفتر المالي والخزينة
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            محرك القيود المزدوجة والمصروفات
          </h1>
          <p className="text-xs text-muted-foreground">
            تسجيل حركة المقبوضات والمدفوعات والمصروفات التشغيلية فورياً
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchTransactions} className="gap-2 text-xs">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </Button>
          <Button variant="emerald" onClick={() => setDialogOpen(true)} className="gap-2 text-xs font-bold">
            <Plus className="h-4 w-4" />
            <span>تسجيل حركة مالية جديدة</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MetricCard
          title="رصيد الخزينة الرئيسية الحالي"
          value={`${netBalance.toLocaleString("en-US")} ج.م`}
          description="السيولة النقذية المتاحة كاش"
          icon={Wallet}
          accentGradient="emerald"
        />
        <MetricCard
          title="إجمالي المقبوضات"
          value={`${totalIncome.toLocaleString("en-US")} ج.م`}
          description="إيراد صيانة + مبيعات المباشرة"
          icon={ArrowUpRight}
          accentGradient="blue"
        />
        <MetricCard
          title="إجمالي المصروفات والرواتب"
          value={`${totalExpense.toLocaleString("en-US")} ج.م`}
          description="إيجارات + مرتبات + أدوات ورشة"
          icon={ArrowDownLeft}
          accentGradient="amber"
        />
      </div>

      <CustomTable
        columns={columns}
        data={transactions}
        isLoading={loading}
        isError={isError}
        onRetry={fetchTransactions}
        emptyMessage="لا توجد قيود أو معاملات مالية مسجلة حالياً"
        emptyAction={
          <Button variant="emerald" onClick={() => setDialogOpen(true)} className="gap-2 text-xs mt-2">
            <Plus className="h-4 w-4" />
            <span>تسجيل أول حركة مالية</span>
          </Button>
        }
      />

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="تسجيل قيد مالي / سند جديد">
        <form onSubmit={handleCreateTransaction} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">نوع المعاملة *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
              >
                <option value="مقبوضات">مقبوضات (إيراد)</option>
                <option value="مصروفات تشغيل">مصروفات تشغيل (إيجار/مرتبات)</option>
                <option value="مدفوعات">مدفوعات للموردين</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">التصنيف *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="إيجار، صيانة، مرتبات..."
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">المبلغ (ج.م) *</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="1000"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">الحساب المالي (الخزينة/البنك) *</label>
              <select
                value={formData.account}
                onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
              >
                <option value="الخزينة الرئيسية">الخزينة الرئيسية</option>
                <option value="البنك الأهلي المصري">البنك الأهلي المصري</option>
                <option value="محفظة فودافون كاش">محفظة فودافون كاش</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">البيان والتفاصيل</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="سداد إيجار / شراء أدوات صيانة..."
              className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button variant="gradient" type="submit" disabled={submitting} className="text-xs">
              {submitting ? "جاري الحفظ..." : "ترحيل القيد المالي"}
            </Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
