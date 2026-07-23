"use client";

import React, { useState } from "react";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackagePlus, Barcode, AlertTriangle, ArrowUpDown, Tag } from "lucide-react";

interface Item {
  id: string;
  name: string;
  barcode: string;
  category: "قطعة غيار" | "إكسسوار" | "جهاز صيانة";
  buyPrice: number;
  sellPrice: number;
  stockQty: number;
  minStock: number;
}

const mockInventory: Item[] = [
  {
    id: "1",
    name: "شاشة iPhone 13 Pro OEM Full",
    barcode: "693847291048",
    category: "قطعة غيار",
    buyPrice: 3200,
    sellPrice: 4200,
    stockQty: 3,
    minStock: 5,
  },
  {
    id: "2",
    name: "باغة Samsung S22 Ultra Original",
    barcode: "693847291049",
    category: "قطعة غيار",
    buyPrice: 450,
    sellPrice: 850,
    stockQty: 12,
    minStock: 3,
  },
  {
    id: "3",
    name: "شاحن انكر Anker 65W Fast Charger",
    barcode: "693847291050",
    category: "إكسسوار",
    buyPrice: 600,
    sellPrice: 950,
    stockQty: 2,
    minStock: 6,
  },
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const filtered = mockInventory.filter(
    (i) => i.name.includes(search) || i.barcode.includes(search) || i.category.includes(search)
  );

  const columns: Column<Item>[] = [
    {
      header: "اسم الصنف",
      cell: (i) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{i.name}</p>
          <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Barcode className="h-3 w-3" />
            <span>{i.barcode}</span>
          </p>
        </div>
      ),
    },
    {
      header: "التصنيف",
      cell: (i) => (
        <Badge variant={i.category === "قطعة غيار" ? "purple" : "info"}>{i.category}</Badge>
      ),
    },
    {
      header: "سعر الشراء",
      cell: (i) => <span className="font-mono text-xs">{i.buyPrice} ج.م</span>,
    },
    {
      header: "سعر البيع",
      cell: (i) => <span className="font-mono font-bold text-emerald-600">{i.sellPrice} ج.م</span>,
    },
    {
      header: "الكمية المتاحة",
      cell: (i) => {
        const isLow = i.stockQty <= i.minStock;
        return (
          <div className="flex items-center gap-2">
            <span className={`font-mono font-extrabold text-sm ${isLow ? "text-rose-600" : "text-slate-900 dark:text-white"}`}>
              {i.stockQty} قطعة
            </span>
            {isLow && (
              <span className="px-1.5 py-0.5 text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-600 rounded flex items-center gap-1 font-bold">
                <AlertTriangle className="h-3 w-3" />
                <span>حد أدنى</span>
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: "إجراءات",
      cell: () => (
        <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600">
          تعديل الكمية
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg">
            المرحلة 4: كارت الأصناف والمخزن
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            المخزون وقطع الغيار والمشتريات
          </h1>
          <p className="text-xs text-muted-foreground">
            تنبيهات الحد الأدنى والخصم التلقائي عند الاستخدام في ورشة الصيانة
          </p>
        </div>

        <Button variant="emerald" className="gap-2">
          <PackagePlus className="h-4 w-4" />
          <span>إضافة صنف جديد</span>
        </Button>
      </div>

      <CustomTable
        columns={columns}
        data={filtered}
        onSearch={(q) => setSearch(q)}
        searchPlaceholder="بحث اسم القطعة، الباركود، أو التصنيف..."
      />
    </div>
  );
}
