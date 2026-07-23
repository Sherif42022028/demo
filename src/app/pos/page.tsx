"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Barcode, Trash2, Plus, Minus, CreditCard, Printer, DollarSign } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([
    { id: "1", name: "شاحن انكر 65W Fast", price: 950, qty: 1 },
    { id: "2", name: "كابل لايتنينج انكر الأصلي", price: 250, qty: 2 },
  ]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg">
            المرحلة 5: واجهة البيع المباشر POS
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            شاشة نقطة البيع (Direct POS Cashier)
          </h1>
          <p className="text-xs text-muted-foreground">
            دعم قارئ الباركود (HID Barcode Event Listener)، بيع الإكسسوارات والخصم الفوري من الخزينة
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Products Grid (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Barcode className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="مسح الباركود أو البحث باسم المنتج..."
              className="w-full pr-10 pl-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold shadow-sm"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { id: "1", name: "شاحن انكر 65W Fast", price: 950 },
              { id: "2", name: "كابل لايتنينج انكر", price: 250 },
              { id: "3", name: "جراب سيليكون آيفون 14", price: 150 },
              { id: "4", name: "سماعة بلوتوث Joyroom", price: 650 },
              { id: "5", name: "إستيكر حماية 9D آيفون", price: 80 },
              { id: "6", name: "كارت ميموري 64GB SanDisk", price: 220 },
            ].map((prod) => (
              <Card
                key={prod.id}
                onClick={() => {
                  setCart((prev) => {
                    const exists = prev.find((x) => x.id === prod.id);
                    if (exists) {
                      return prev.map((x) => (x.id === prod.id ? { ...x, qty: x.qty + 1 } : x));
                    }
                    return [...prev, { ...prod, qty: 1 }];
                  });
                }}
                className="p-4 cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all text-center space-y-2 bg-white dark:bg-slate-900"
              >
                <div className="mx-auto h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  POS
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{prod.name}</h4>
                <p className="text-xs font-mono font-extrabold text-emerald-600">{prod.price} ج.م</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Order Checkout Cart */}
        <Card className="p-6 space-y-6 bg-white dark:bg-slate-900 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-emerald-600" />
                <span>سلة المبيعات الحالية</span>
              </h3>
              <span className="text-xs font-mono font-bold text-slate-400">{cart.length} أصناف</span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-[11px] font-mono text-emerald-600">{item.price} ج.م × {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-bold font-mono px-1">{item.qty}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQty(item.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-slate-600 dark:text-slate-400">الإجمالي النهائي:</span>
              <span className="text-xl font-black font-mono text-emerald-600">{total.toLocaleString("ar-EG")} ج.م</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="emerald" className="gap-2">
                <DollarSign className="h-4 w-4" />
                <span>دفع كاش</span>
              </Button>
              <Button variant="gradient" className="gap-2">
                <CreditCard className="h-4 w-4" />
                <span>شبكة / فيزا</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
