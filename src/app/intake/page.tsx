"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, User, Smartphone, FileText, CheckCircle2 } from "lucide-react";

export default function IntakePage() {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    deviceModel: "",
    imei: "",
    password: "",
    fault: "",
    accessories: "جراب، كارت ميموري",
    estimatedCost: "1500",
    deposit: "500",
  });

  const [submitting, setSubmitting] = useState(false);
  const [savedTicket, setSavedTicket] = useState<{ ticketNumber: string; qrCodeUrl: string } | null>(null);

  const handleSubmitIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/work-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerPhone: formData.phone,
          deviceModel: formData.deviceModel,
          imei: formData.imei,
          devicePassword: formData.password,
          reportedFault: formData.fault,
          accessories: formData.accessories,
          estimatedCost: formData.estimatedCost,
          depositPaid: formData.deposit,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSavedTicket({
          ticketNumber: json.data.ticketNumber,
          qrCodeUrl: json.data.qrCodeUrl,
        });
      } else {
        alert(json.error || "تعذر حفظ الفاتورة");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالنظام");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg">
              استقبال الأجهزة والطلبات
            </span>
          </div>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            نموذج استلام جهاز جديد
          </h1>
          <p className="text-xs text-muted-foreground">
            تسجيل بيانات الجهاز والعميل وتوليد إيصال حراري وكود QR للعميل
          </p>
        </div>
      </div>

      {savedTicket && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>تم حفظ الفاتورة بنجاح في النظام برقم: <strong className="font-mono text-base underline">{savedTicket.ticketNumber}</strong></span>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1 text-xs">
            <Printer className="h-3.5 w-3.5" />
            <span>طباعة الإيصال الحراري</span>
          </Button>
        </div>
      )}

      {/* Main Intake Form */}
      <form onSubmit={handleSubmitIntake} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-6 bg-white dark:bg-slate-900">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span>1. بيانات العميل</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">اسم العميل *</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="مثال: علي حسن محمود"
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">رقم الهاتف *</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01012345678"
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-purple-600" />
              <span>2. مواصفات الجهاز والعطل</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">موديل الجهاز *</label>
                <input
                  type="text"
                  value={formData.deviceModel}
                  onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                  placeholder="Samsung S23 Ultra / iPhone 13"
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">الرقم التسلسلي (IMEI)</label>
                <input
                  type="text"
                  value={formData.imei}
                  onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                  placeholder="359281048102948"
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">رمز القفل / الباسورد</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="1234"
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">التكلفة التقديرية (ج.م) *</label>
                <input
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  placeholder="1500"
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 font-mono"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">وصف العطل المعلن *</label>
                <textarea
                  rows={3}
                  value={formData.fault}
                  onChange={(e) => setFormData({ ...formData, fault: e.target.value })}
                  placeholder="لا يشحن، توقف لمس الشاشة..."
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Thermal Receipt Preview */}
        <Card className="p-6 bg-amber-50/50 dark:bg-slate-900 border-amber-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>الإيصال الحراري المستهدف</span>
            </h3>
          </div>

          <div className="bg-white text-slate-900 p-4 rounded-xl shadow-inner font-mono text-xs space-y-3 border dir-rtl">
            <div className="text-center border-b pb-2">
              <h2 className="font-extrabold text-sm">مركز تكنو صيانة للأجهزة</h2>
              <p className="text-[10px] text-slate-500">الفرع الرئيسي</p>
              {savedTicket && (
                <p className="text-[11px] font-bold text-blue-600 mt-1">رقم الفاتورة: {savedTicket.ticketNumber}</p>
              )}
            </div>

            <div className="space-y-1 text-[11px]">
              <p>العميل: {formData.customerName || "أحمد علي"}</p>
              <p>الهاتف: {formData.phone || "01012345678"}</p>
              <p>الجهاز: {formData.deviceModel || "iPhone 14"}</p>
              <p>العطل: {formData.fault || "تغيير شاشة"}</p>
            </div>

            <div className="border-t pt-2 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>التكلفة التقديرية:</span>
                <span className="font-bold">{Number(formData.estimatedCost || 0).toLocaleString("en-US")} ج.م</span>
              </div>
            </div>
          </div>

          <Button variant="emerald" type="submit" disabled={submitting} className="w-full gap-2 py-3 text-xs">
            <Printer className="h-4 w-4" />
            <span>{submitting ? "جاري الحفظ..." : "حفظ المعاملة وتوليد الإيصال"}</span>
          </Button>
        </Card>
      </form>
    </div>
  );
}
