"use client";

import React, { useState, useEffect } from "react";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/form-dialog";
import { UserPlus, FileSpreadsheet, RefreshCw } from "lucide-react";

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
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
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
    try {
      const res = await fetch("/api/customers");
      const json = await res.json();
      if (json.success) {
        setCustomersList(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch customers", err);
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
      alert("حدث خطأ أثناء الاتصال بقاعدة البيانات");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = customersList.filter(
    (c) =>
      (c.name || "").includes(search) ||
      (c.phone || "").includes(search) ||
      (c.address || "").includes(search)
  );

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
          {Number(c.creditLimit) > 0 ? `${Number(c.creditLimit).toLocaleString("ar-EG")} ج.م` : "نقدي فقط"}
        </span>
      ),
    },
    {
      header: "رصيد الحساب المالي",
      cell: (c) => {
        const bal = Number(c.currentBalance || 0);
        return (
          <span className={`font-mono font-black ${bal > 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {bal > 0 ? `مستحق: ${bal.toLocaleString("ar-EG")} ج.م` : "خالي من الديون"}
          </span>
        );
      },
    },
    {
      header: "إجراءات",
      cell: () => (
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
          <FileSpreadsheet className="h-3.5 w-3.5 text-blue-600" />
          <span>كشف حساب</span>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg">
            سجل العملاء المباشر (Neon Database CRM)
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            إدارة حسابات العملاء والمعاملات الآجلة
          </h1>
          <p className="text-xs text-muted-foreground">
            تسجيل العملاء يحفظ فورياً في Neon PostgreSQL ومراجعة كشوفات الحساب
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchCustomers} className="gap-2 text-xs">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </Button>
          <Button variant="emerald" onClick={() => setDialogOpen(true)} className="gap-2 text-xs">
            <UserPlus className="h-4 w-4" />
            <span>إضافة عميل حقيقي</span>
          </Button>
        </div>
      </div>

      <CustomTable
        columns={columns}
        data={filtered}
        isLoading={loading}
        onSearch={(q) => setSearch(q)}
        searchPlaceholder="بحث باسم العميل، الهاتف، أو العنوان..."
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="إضافة عميل جديد لقاعدة البيانات"
        description="سيتم الحفظ المباشر في قاعدة بيانات Neon PostgreSQL"
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
              className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
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
              className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">العنوان</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="القاهرة - مدينة نصر"
              className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">الحد الائتماني للمعاملات الآجلة (ج.م)</label>
            <input
              type="number"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              placeholder="5000"
              className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button variant="gradient" type="submit" disabled={submitting}>
              {submitting ? "جاري الحفظ..." : "حفظ العميل في Neon DB"}
            </Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
