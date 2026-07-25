"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TicketTag } from "@/components/ui/ticket-tag";
import { Printer, User, Smartphone, FileText, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { printThermalReceipt } from "@/lib/print-receipt";

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

  const [orgSettings, setOrgSettings] = useState({
    storeName: "مركز تكنو صيانة للأجهزة الذكية",
    receiptFooter: "شكراً لثقتكم بنا! الأجهزة تقع تحت الضمان لمدة 30 يومًا من تاريخ الاستلام.",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [savedTicket, setSavedTicket] = useState<{ ticketNumber: string; qrCodeUrl: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setOrgSettings({
            storeName: json.data.storeName || "مركز تكنو صيانة للأجهزة الذكية",
            receiptFooter: json.data.receiptFooter || "شكراً لثقتكم بنا! الأجهزة تقع تحت الضمان لمدة 30 يومًا من تاريخ الاستلام.",
          });
        }
      })
      .catch((err) => console.error("Failed to load org settings for intake thermal receipt", err));
  }, []);

  const handlePrint = () => {
    printThermalReceipt({
      ticketNumber: savedTicket?.ticketNumber,
      customerName: formData.customerName,
      phone: formData.phone,
      deviceModel: formData.deviceModel,
      imei: formData.imei,
      fault: formData.fault,
      estimatedCost: formData.estimatedCost,
      deposit: formData.deposit,
      storeName: orgSettings.storeName,
      receiptFooter: orgSettings.receiptFooter,
      qrCodeUrl: savedTicket?.qrCodeUrl,
    });
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-sm">
              استقبال الأجهزة والطلبات
            </span>
          </div>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            نموذج استلام جهاز جديد (Live Intake)
          </h1>
          <p className="text-xs text-muted-foreground">
            تسجيل بيانات الجهاز والعميل ومطابقة الإيصال الحراري لحظياً مع الكتابة
          </p>
        </div>
      </div>

      {savedTicket && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 rounded-sm text-emerald-900 dark:text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="flex items-center gap-1">
              تم حفظ الفاتورة بنجاح في النظام برقم: <TicketTag number={savedTicket.ticketNumber} />
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1 text-xs font-bold">
            <Printer className="h-3.5 w-3.5" />
            <span>طباعة الإيصال الحراري</span>
          </Button>
        </div>
      )}

      {/* Main Intake Form with Realtime Preview */}
      <form onSubmit={handleSubmitIntake} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-6 bg-white dark:bg-slate-900 shadow-sm rounded-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="h-4 w-4 text-slate-500" />
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
                  className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
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
                  className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-slate-500" />
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
                  className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
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
                  className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">رمز القفل / الباسورد</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••"
                    className="w-full pr-3 pl-9 py-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  <span>بيانات القفل مشفّرة ومحمية</span>
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">التكلفة التقديرية (ج.م) *</label>
                <input
                  type="number"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                  placeholder="1500"
                  className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">المبلغ المدفوع (عربون)</label>
                <input
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                  placeholder="500"
                  className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">الملحقات المرفقة</label>
                <input
                  type="text"
                  value={formData.accessories}
                  onChange={(e) => setFormData({ ...formData, accessories: e.target.value })}
                  placeholder="جراب، كارت ميموري"
                  className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">وصف العطل المعلن *</label>
                <textarea
                  rows={2}
                  value={formData.fault}
                  onChange={(e) => setFormData({ ...formData, fault: e.target.value })}
                  placeholder="لا يشحن، توقف لمس الشاشة..."
                  className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Live Thermal Receipt Preview Card */}
        <Card className="p-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm rounded-sm">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>معاينة الإيصال الحراري (Live Preview)</span>
            </h3>
          </div>

          <div className="bg-white text-slate-900 p-4 rounded-sm shadow-inner font-mono text-xs space-y-3 border dir-rtl">
            <div className="text-center border-b pb-2">
              <h2 className="font-extrabold text-sm">{orgSettings.storeName}</h2>
              <p className="text-[10px] text-slate-500">الفرع الرئيسي</p>
              {savedTicket ? (
                <div className="mt-1 flex justify-center">
                  <TicketTag number={savedTicket.ticketNumber} />
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 mt-0.5">معاينة لحظية أثناء الكتابة...</p>
              )}
            </div>

            <div className="space-y-1 text-[11px]">
              <p><span className="text-slate-400">العميل:</span> <strong className="text-slate-800">{formData.customerName || "—"}</strong></p>
              <p><span className="text-slate-400">الهاتف:</span> <strong className="text-slate-800">{formData.phone || "—"}</strong></p>
              <p><span className="text-slate-400">الجهاز:</span> <strong className="text-slate-800">{formData.deviceModel || "—"}</strong></p>
              {formData.imei && <p><span className="text-slate-400">IMEI:</span> <strong>{formData.imei}</strong></p>}
              <p><span className="text-slate-400">العطل:</span> <strong>{formData.fault || "—"}</strong></p>
              <p><span className="text-slate-400">الملحقات:</span> <span>{formData.accessories || "لا يوجد"}</span></p>
            </div>

            <div className="border-t pt-2 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>التكلفة التقديرية:</span>
                <span className="font-bold">{Number(formData.estimatedCost || 0).toLocaleString("en-US")} ج.م</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>المدفوع (عربون):</span>
                <span className="font-bold">{Number(formData.deposit || 0).toLocaleString("en-US")} ج.م</span>
              </div>
              <div className="flex justify-between text-slate-900 border-t pt-1 font-extrabold">
                <span>المتبقي عند الاستلام:</span>
                <span>{Math.max(0, Number(formData.estimatedCost || 0) - Number(formData.deposit || 0)).toLocaleString("en-US")} ج.م</span>
              </div>
            </div>
          </div>

          <Button variant="emerald" type="submit" disabled={submitting} className="w-full gap-2 py-3 text-xs font-bold">
            <Printer className="h-4 w-4" />
            <span>{submitting ? "جاري الحفظ..." : "حفظ المعاملة وتوليد الإيصال"}</span>
          </Button>
        </Card>
      </form>
    </div>
  );
}
