"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/form-dialog";
import { Users, UserPlus, Phone, CreditCard, History, Search, FileSpreadsheet } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  creditLimit: number;
  balance: number; // positive = owes us, negative = overpaid
  totalOrders: number;
  lastDevice: string;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "محمد عبد الرحمن",
    phone: "01012345678",
    address: "مدينة نصر - القاهرة",
    creditLimit: 5000,
    balance: 1200,
    totalOrders: 4,
    lastDevice: "iPhone 13 Pro Max",
  },
  {
    id: "2",
    name: "سارة محمود",
    phone: "01198765432",
    address: "المعادي - القاهرة",
    creditLimit: 0,
    balance: 0,
    totalOrders: 2,
    lastDevice: "Samsung S22 Ultra",
  },
  {
    id: "3",
    name: "شركة الفرسان للتجارة (آجل)",
    phone: "01200001122",
    address: "وسط البلد - القاهرة",
    creditLimit: 25000,
    balance: 8500,
    totalOrders: 14,
    lastDevice: "iPad Air 5",
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = mockCustomers.filter(
    (c) => c.name.includes(search) || c.phone.includes(search) || c.lastDevice.includes(search)
  );

  const columns: Column<Customer>[] = [
    {
      header: "اسم العميل",
      cell: (c) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{c.name}</p>
          <p className="text-[11px] text-muted-foreground">{c.address}</p>
        </div>
      ),
    },
    {
      header: "رقم الهاتف",
      cell: (c) => <span className="font-mono text-xs font-bold">{c.phone}</span>,
    },
    {
      header: "عدد الصيانات",
      cell: (c) => <Badge variant="secondary">{c.totalOrders} أجهزة</Badge>,
    },
    {
      header: "الحد الائتماني (الآجل)",
      cell: (c) => (
        <span className="font-mono font-bold text-slate-600 dark:text-slate-400">
          {c.creditLimit > 0 ? `${c.creditLimit.toLocaleString("ar-EG")} ج.م` : "نقدي فقط"}
        </span>
      ),
    },
    {
      header: "رصيد الحساب المالي",
      cell: (c) => (
        <span className={`font-mono font-black ${c.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
          {c.balance > 0 ? `مستحق: ${c.balance.toLocaleString("ar-EG")} ج.م` : "خالي من الديون"}
        </span>
      ),
    },
    {
      header: "أحدث جهاز صيانة",
      accessorKey: "lastDevice",
    },
    {
      header: "إجراءات",
      cell: (c) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
            <FileSpreadsheet className="h-3.5 w-3.5 text-blue-600" />
            <span>كشف حساب</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg">
            المرحلة 1: وحدة إدارة العملاء CRM
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            سجل العملاء والحسابات الآجلة
          </h1>
          <p className="text-xs text-muted-foreground">
            البحث السريع بالرقم، مراجعة كشوفات الحساب والحد الائتماني وسجل الأجهزة
          </p>
        </div>

        <Button variant="emerald" onClick={() => setDialogOpen(true)} className="gap-2">
          <UserPlus className="h-4 w-4" />
          <span>إضافة عميل جديد</span>
        </Button>
      </div>

      <CustomTable
        columns={columns}
        data={filtered}
        onSearch={(q) => setSearch(q)}
        searchPlaceholder="بحث باسم العميل، الهاتف، أو الجهاز..."
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="إضافة عميل جديد"
        description="تسجيل بيانات العميل والحد الائتماني للمعاملات الآجلة"
      >
        <form onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold mb-1">اسم العميل بالكامل *</label>
            <input type="text" required placeholder="محمد علي" className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">رقم الهاتف الأساسي *</label>
            <input type="text" required placeholder="01012345678" className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">الحد الائتماني المعين (للحسابات الآجلة)</label>
            <input type="number" placeholder="5000" className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button variant="gradient" type="submit">حفظ العميل</Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
