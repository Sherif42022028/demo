"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/form-dialog";
import { Building2, ArrowLeftRight, Plus, CheckCircle, ShieldCheck, MapPin, Phone } from "lucide-react";

interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  activeOrders: number;
  totalEngineers: number;
  isActive: boolean;
}

const mockBranches: Branch[] = [
  {
    id: "branch-main",
    name: "الفرع الرئيسي - القاهرة (وسط البلد)",
    code: "BR-01",
    address: "شارع شريف، وسط البلد، القاهرة",
    phone: "01012345678",
    activeOrders: 18,
    totalEngineers: 4,
    isActive: true,
  },
  {
    id: "branch-alex",
    name: "فرع الإسكندرية - سموحة",
    code: "BR-02",
    address: "ميدان علي بن أبي طالب، سموحة، الإسكندرية",
    phone: "01198765432",
    activeOrders: 9,
    totalEngineers: 2,
    isActive: true,
  },
  {
    id: "branch-giza",
    name: "فرع الجيزة - المهندسين",
    code: "BR-03",
    address: "شارع جامعة الدول العربية، المهندسين",
    phone: "01200003344",
    activeOrders: 12,
    totalEngineers: 3,
    isActive: true,
  },
];

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);

  const columns: Column<Branch>[] = [
    {
      header: "كود ورئيس الفرع",
      cell: (b) => (
        <div>
          <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
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
            <span>{b.address}</span>
          </p>
          <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3 text-slate-400" />
            <span>{b.phone}</span>
          </p>
        </div>
      ),
    },
    {
      header: "الأجهزة النشطة",
      cell: (b) => <Badge variant="purple">{b.activeOrders} أمر صيانة</Badge>,
    },
    {
      header: "عدد المهندسين",
      cell: (b) => <Badge variant="secondary">{b.totalEngineers} مهندسين</Badge>,
    },
    {
      header: "حالة الفرع",
      cell: (b) => (
        <Badge variant={b.isActive ? "success" : "destructive"}>
          {b.isActive ? "يعمل بكفاءة" : "مغلق مؤقتاً"}
        </Badge>
      ),
    },
    {
      header: "إجراءات",
      cell: () => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTransferDialogOpen(true)}
            className="h-8 text-xs gap-1"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-purple-600" />
            <span>نقل بيانات/قطع بين الفروع</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg">
            المرحلة 1: إدارة الفروع المتقدمة
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            شجرة الفروع وتحويلات البيانات (Multi-Branch Engine)
          </h1>
          <p className="text-xs text-muted-foreground">
            ربط وتحديد صلاحيات كل فرع وتحويل قطع الغيار أو الأجهزة بين الفروع
          </p>
        </div>

        <Button variant="emerald" onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>إضافة فرع جديد</span>
        </Button>
      </div>

      <CustomTable columns={columns} data={branches} />

      {/* Add New Branch Dialog */}
      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="إضافة فرع جديد للمؤسسة">
        <form onSubmit={(e) => { e.preventDefault(); setDialogOpen(false); }} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold mb-1">اسم الفرع *</label>
            <input type="text" required placeholder="فرع مدينة نصر" className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">كود الفرع (Branch Code) *</label>
            <input type="text" required placeholder="BR-04" className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">العنوان ورقم الهاتف</label>
            <input type="text" placeholder="شارع عباس العقاد - 010xxxxxxxx" className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button variant="gradient" type="submit">إنشاء الفرع</Button>
          </div>
        </form>
      </FormDialog>

      {/* Transfer between branches Dialog */}
      <FormDialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen} title="تحويل قطع غيار / أوامر صيانة بين الفروع">
        <form onSubmit={(e) => { e.preventDefault(); setTransferDialogOpen(false); }} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">من فرع (المصدر)</label>
              <select className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800">
                <option>الفرع الرئيسي - القاهرة</option>
                <option>فرع الإسكندرية</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">إلى فرع (الوجهة)</label>
              <select className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800">
                <option>فرع الجيزة - المهندسين</option>
                <option>فرع الإسكندرية</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">العنصر المحول (قطعة غيار / جهاز صيانة)</label>
            <input type="text" placeholder="شاشة iPhone 13 Pro (الكمية: 2)" className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setTransferDialogOpen(false)}>إلغاء</Button>
            <Button variant="emerald" type="submit" className="gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              <span>تأكيد التحويل والمزامنة اللحظية</span>
            </Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
