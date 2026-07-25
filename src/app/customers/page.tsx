"use client";

import React, { useState, useEffect } from "react";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/ui/form-dialog";
import { UserPlus, FileSpreadsheet, RefreshCw, Printer } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  altPhone?: string;
  address?: string;
  creditLimit: string | number;
  currentBalance?: string | number;
}

export default function CustomersPage() {
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "DEBT" | "CASH">("ALL");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    altPhone: "",
    address: "",
    creditLimit: "5000",
  });

  const fetchCustomers = async () => {
    setLoading(true);
    setIsError(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/customers", { signal: controller.signal });
      clearTimeout(timeoutId);
      const json = await res.json();
      if (json.success) {
        setCustomersList(json.data);
      } else {
        setIsError(true);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Failed to fetch customers", err);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setDialogOpen(false);
        setFormData({ name: "", phone: "", altPhone: "", address: "", creditLimit: "5000" });
        fetchCustomers();
      } else {
        alert(json.error || "تعذر إضافة العميل");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالنظام");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = customersList.filter((c) => {
    const matchesSearch =
      (c.name || "").includes(search) ||
      (c.phone || "").includes(search) ||
      (c.address || "").includes(search);

    const bal = Number(c.currentBalance || 0);
    const matchesFilter =
      filterType === "ALL" ||
      (filterType === "DEBT" && bal > 0) ||
      (filterType === "CASH" && bal <= 0);

    return matchesSearch && matchesFilter;
  });

  const columns: Column<Customer>[] = [
    {
      header: "اسم العميل",
      cell: (c) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{c.name}</p>
          <p className="text-[11px] text-muted-foreground">{c.address || "لا يوجد عنوان"}</p>
        </div>
      ),
    },
    {
      header: "رقم الهاتف",
      cell: (c) => <span className="font-mono text-xs font-bold">{c.phone}</span>,
    },
    {
      header: "الحد الائتماني (الآجل)",
      cell: (c) => (
        <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
          {Number(c.creditLimit) > 0 ? `${Number(c.creditLimit).toLocaleString("en-US")} ج.م` : "نقدي فقط"}
        </span>
      ),
    },
    {
      header: "رصيد الحساب المالي",
      cell: (c) => {
        const bal = Number(c.currentBalance || 0);
        return (
          <span className={`font-mono font-bold ${bal > 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {bal > 0 ? `مستحق: ${bal.toLocaleString("en-US")} ج.م` : "خالي من الديون"}
          </span>
        );
      },
    },
    {
      header: "إجراءات",
      cell: (c) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStatementCustomer(c)}
          className="h-8 text-xs gap-1 font-bold text-slate-800 dark:text-slate-200"
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          <span>كشف حساب</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-sm">
            سجل حسابات العملاء (CRM)
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            إدارة حسابات العملاء والمعاملات الآجلة
          </h1>
          <p className="text-xs text-muted-foreground">
            تسجيل بيانات العملاء ومراجعة كشوفات الحسابات والحدود الائتمانية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchCustomers} className="gap-2 text-xs">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </Button>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-bold"
          >
            <UserPlus className="h-4 w-4" />
            <span>إضافة عميل جديد</span>
          </Button>
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 dir-rtl font-mono">
        <button
          onClick={() => setFilterType("ALL")}
          className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all border ${
            filterType === "ALL"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100"
              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
          }`}
        >
          جميع العملاء ({customersList.length})
        </button>

        <button
          onClick={() => setFilterType("DEBT")}
          className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all border ${
            filterType === "DEBT"
              ? "bg-rose-600 text-white border-rose-600"
              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
          }`}
        >
          عملاء عليهم مديونية ({customersList.filter((c) => Number(c.currentBalance || 0) > 0).length})
        </button>

        <button
          onClick={() => setFilterType("CASH")}
          className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-all border ${
            filterType === "CASH"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
          }`}
        >
          عملاء نقدي فقط ({customersList.filter((c) => Number(c.currentBalance || 0) <= 0).length})
        </button>
      </div>

      <CustomTable
        columns={columns}
        data={filtered}
        isLoading={loading}
        isError={isError}
        onRetry={fetchCustomers}
        onSearch={(q) => setSearch(q)}
        searchPlaceholder="بحث باسم العميل، الهاتف، أو العنوان..."
        emptyMessage="لا يوجد عملاء مسجلين بهذه الفئة"
        emptyAction={
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs mt-2 font-bold"
          >
            <UserPlus className="h-4 w-4" />
            <span>إضافة أول عميل</span>
          </Button>
        }
      />

      {/* Add Customer Modal */}
      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="إضافة عميل جديد"
        description="سيتم حفظ بيانات العميل وحسابه المالي في السيستم"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold mb-1">اسم العميل بالكامل *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="محمد علي"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">رقم الهاتف الأساسي *</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01012345678"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">العنوان</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="القاهرة - مدينة نصر"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">الحد الائتماني للمعاملات الآجلة (ج.م)</label>
            <input
              type="number"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              placeholder="5000"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              {submitting ? "جاري الحفظ..." : "حفظ العميل"}
            </Button>
          </div>
        </form>
      </FormDialog>

      {/* Customer Account Statement Modal */}
      {statementCustomer && (
        <FormDialog
          open={!!statementCustomer}
          onOpenChange={() => setStatementCustomer(null)}
          title={`كشف حساب مالي تفصيلي: ${statementCustomer.name}`}
          maxWidth="lg"
        >
          <div className="space-y-4 py-2 font-mono text-xs dir-rtl">
            <div className="p-4 rounded-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">اسم العميل:</span>
                <strong className="text-slate-900 dark:text-white font-sans">{statementCustomer.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">رقم الهاتف:</span>
                <strong>{statementCustomer.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">الحد الائتماني:</span>
                <span>{Number(statementCustomer.creditLimit).toLocaleString("en-US")} ج.م</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-sm">
                <span>رصيد المديونية المستحق:</span>
                <span className={Number(statementCustomer.currentBalance || 0) > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                  {Number(statementCustomer.currentBalance || 0).toLocaleString("en-US")} ج.م
                </span>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-sm p-3 bg-white dark:bg-slate-900 text-[11px] space-y-2">
              <p className="font-bold font-sans text-slate-700 dark:text-slate-300 border-b pb-1">سجل آخر المعاملات المسجلة:</p>
              <div className="flex justify-between py-1 border-b">
                <span>فتح كشف حساب جديد - رصيد افتتاحي</span>
                <span className="text-emerald-600 font-bold">+ 0 ج.م</span>
              </div>
              {Number(statementCustomer.currentBalance || 0) > 0 && (
                <div className="flex justify-between py-1 border-b text-rose-600 font-bold">
                  <span>أمر صيانة آجل مستحق</span>
                  <span>+ {Number(statementCustomer.currentBalance).toLocaleString("en-US")} ج.م</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => setStatementCustomer(null)}>إلغاء</Button>
              <Button
                size="sm"
                onClick={() => window.print()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-bold"
              >
                <Printer className="h-4 w-4" />
                <span>طباعة كشف الحساب</span>
              </Button>
            </div>
          </div>
        </FormDialog>
      )}
    </div>
  );
}
