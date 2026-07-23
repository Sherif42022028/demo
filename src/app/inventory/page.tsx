"use client";

import React, { useState, useEffect } from "react";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/form-dialog";
import { PackagePlus, Barcode, AlertTriangle, RefreshCw } from "lucide-react";

interface Item {
  id: string;
  name: string;
  barcode?: string;
  category: string;
  buyPrice: string | number;
  sellPrice: string | number;
  stockQty: number;
  minStockLevel: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    barcode: "",
    category: "قطعة غيار",
    buyPrice: "1000",
    sellPrice: "1500",
    stockQty: "10",
    minStockLevel: "3",
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inventory");
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        setDialogOpen(false);
        setFormData({
          name: "",
          barcode: "",
          category: "قطعة غيار",
          buyPrice: "1000",
          sellPrice: "1500",
          stockQty: "10",
          minStockLevel: "3",
        });
        fetchInventory();
      } else {
        alert(json.error || "تعذر إضافة الصنف");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بقاعدة البيانات");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = items.filter(
    (i) =>
      (i.name || "").includes(search) ||
      (i.barcode || "").includes(search) ||
      (i.category || "").includes(search)
  );

  const columns: Column<Item>[] = [
    {
      header: "اسم الصنف",
      cell: (i) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{i.name}</p>
          <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Barcode className="h-3 w-3" />
            <span>{i.barcode || "بدون باركود"}</span>
          </p>
        </div>
      ),
    },
    {
      header: "التصنيف",
      cell: (i) => <Badge variant={i.category === "قطعة غيار" ? "purple" : "info"}>{i.category}</Badge>,
    },
    {
      header: "سعر الشراء",
      cell: (i) => <span className="font-mono text-xs">{Number(i.buyPrice).toLocaleString("ar-EG")} ج.م</span>,
    },
    {
      header: "سعر البيع",
      cell: (i) => <span className="font-mono font-bold text-emerald-600">{Number(i.sellPrice).toLocaleString("ar-EG")} ج.م</span>,
    },
    {
      header: "الكمية المتاحة",
      cell: (i) => {
        const isLow = Number(i.stockQty) <= Number(i.minStockLevel);
        return (
          <div className="flex items-center gap-2">
            <span className={`font-mono font-extrabold text-sm ${isLow ? "text-rose-600" : "text-slate-900 dark:text-white"}`}>
              {i.stockQty} قطعة
            </span>
            {isLow && (
              <span className="px-1.5 py-0.5 text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-600 rounded flex items-center gap-1 font-bold">
                <AlertTriangle className="h-3 w-3" />
                <span>نقص مخزون</span>
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg">
            المخزون المباشر (Neon Database Inventory)
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            كارت الأصناف وقطع الغيار والإكسسوارات
          </h1>
          <p className="text-xs text-muted-foreground">
            إضافة الصنف والقطع تحفظ فورياً في Neon PostgreSQL مع دعم الباركود
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchInventory} className="gap-2 text-xs">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </Button>
          <Button variant="emerald" onClick={() => setDialogOpen(true)} className="gap-2 text-xs">
            <PackagePlus className="h-4 w-4" />
            <span>إضافة صنف جديد</span>
          </Button>
        </div>
      </div>

      <CustomTable
        columns={columns}
        data={filtered}
        isLoading={loading}
        onSearch={(q) => setSearch(q)}
        searchPlaceholder="بحث باسم الصنف، الباركود، أو التصنيف..."
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="إضافة قطعة / صنف جديد لقاعدة البيانات"
        description="سيتم التخصيص والمحافظة المباشرة في Neon PostgreSQL"
      >
        <form onSubmit={handleCreateItem} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold mb-1">اسم الصنف / القطعة *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="شاشة iPhone 14 Pro Max"
              className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">الباركود</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="693847291048"
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">التصنيف</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
              >
                <option value="قطعة غيار">قطعة غيار</option>
                <option value="إكسسوار">إكسسوار</option>
                <option value="جهاز صيانة">جهاز صيانة</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">سعر الشراء (ج.م) *</label>
              <input
                type="number"
                required
                value={formData.buyPrice}
                onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">سعر البيع (ج.م) *</label>
              <input
                type="number"
                required
                value={formData.sellPrice}
                onChange={(e) => setFormData({ ...formData, sellPrice: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">الكمية الأولية بالمخزن *</label>
              <input
                type="number"
                required
                value={formData.stockQty}
                onChange={(e) => setFormData({ ...formData, stockQty: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">حد الخطر / التنبيه *</label>
              <input
                type="number"
                required
                value={formData.minStockLevel}
                onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>إلغاء</Button>
            <Button variant="gradient" type="submit" disabled={submitting}>
              {submitting ? "جاري الحفظ..." : "حفظ الصنف في Neon DB"}
            </Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
