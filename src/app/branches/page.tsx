"use client";

import React, { useState, useEffect } from "react";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/form-dialog";
import { Plus, MapPin, Phone, RefreshCw, Users } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
  });

  const fetchBranches = async () => {
    setLoading(true);
    setIsError(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/branches", { signal: controller.signal });
      clearTimeout(timeoutId);
      const json = await res.json();
      if (json.success) {
        setBranches(json.data);
      } else {
        setIsError(true);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Failed to fetch branches", err);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setDialogOpen(false);
        setFormData({ name: "", code: "", address: "", phone: "" });
        fetchBranches();
      } else {
        alert(json.error || "تعذر إنشاء الفرع");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالنظام");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: Column<Branch>[] = [
    {
      header: "كود واسم الفرع",
      cell: (b) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm border border-slate-300 dark:border-slate-700">
            {b.code}
          </span>
          <p className="font-bold text-slate-900 dark:text-slate-100 mt-1">{b.name}</p>
        </div>
      ),
    },
    {
      header: "العنوان والهاتف",
      cell: (b) => (
        <div className="space-y-0.5">
          <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span>{b.address || "بدون عنوان"}</span>
          </p>
          <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3 text-slate-400" />
            <span>{b.phone || "—"}</span>
          </p>
        </div>
      ),
    },
    {
      header: "المستخدمين والصلاحيات المخصصة",
      cell: () => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <Users className="h-4 w-4 text-slate-500" />
          <span className="font-bold">مدير، مهندس، استقبال</span>
        </div>
      ),
    },
    {
      header: "حالة الفرع",
      cell: (b) => (
        <Badge variant={b.isActive ? "success" : "destructive"}>
          {b.isActive ? "نشط ويعمل" : "مغلق مؤقتاً"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-sm">
            إدارة الفروع والصلاحيات
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            شجرة الفروع والمقرات والصلاحيات
          </h1>
          <p className="text-xs text-muted-foreground">
            تسجيل وتخصيص الفروع وتتبع صلاحيات الوصول لكل فرع ومقر صيانة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchBranches} className="gap-2 text-xs">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </Button>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة فرع جديد</span>
          </Button>
        </div>
      </div>

      <CustomTable
        columns={columns}
        data={branches}
        isLoading={loading}
        isError={isError}
        onRetry={fetchBranches}
        emptyMessage="لا توجد فروع مسجلة حالياً"
        emptyAction={
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs mt-2 font-bold"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة فرع جديد</span>
          </Button>
        }
      />

      {/* Add New Branch Dialog */}
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="إضافة فرع جديد">
        <form onSubmit={handleCreateBranch} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold mb-1">اسم الفرع *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="فرع الإسكندرية - سموحة"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">كود الفرع (Branch Code) *</label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="BR-02"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">العنوان</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="شارع سموحة الرئيسي"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">رقم الهاتف</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01112345678"
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
              {submitting ? "جاري الحفظ..." : "حفظ الفرع"}
            </Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
