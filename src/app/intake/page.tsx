"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Printer, Camera, ShieldCheck, Phone, User, Smartphone, Lock, AlertCircle, FileText } from "lucide-react";

export default function IntakePage() {
  const [ticketNo] = useState("WO-1004");
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    altPhone: "",
    deviceModel: "",
    imei: "",
    password: "",
    fault: "",
    accessories: "جراب، كارت ميموري",
    estimatedCost: "1500",
    deposit: "500",
    engineer: "م. أحمد حسام",
  });

  const [printSuccess, setPrintSuccess] = useState(false);

  const handlePrintReceipt = () => {
    // Thermal Print Simulation via Web-Serial / Direct ESC-POS Protocol
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg">
              المرحلة 2: استقبال الأجهزة
            </span>
            <span className="text-xs font-mono font-bold text-slate-400"># {ticketNo}</span>
          </div>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            نموذج استلام جهاز صيانة (Work Order Intake)
          </h1>
          <p className="text-xs text-muted-foreground">
            تسجيل كافة مواصفات وتفاصيل عطل الجهاز مع توليد كود QR والطباعة الحرارية المباشرة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="emerald" onClick={handlePrintReceipt} className="gap-2">
            <Printer className="h-4 w-4" />
            <span>طباعة الإيصال الحراري فورياً</span>
          </Button>
        </div>
      </div>

      {printSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>تم إرسال أمر الطباعة إلى المكبس/الطابعة الحرارية (Thermal Printer ESC/POS) بنجاح!</span>
          </div>
          <span className="text-xs font-mono font-extrabold text-emerald-600">BaudRate: 9600</span>
        </div>
      )}

      {/* Main Intake Form & Thermal Preview split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Intake Form (2 cols) */}
        <Card className="lg:col-span-2 p-6 space-y-6">
          {/* Customer CRM section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span>بيانات العميل (Customer CRM)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">اسم العميل *</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="مثال: علي حسن محمود"
                    className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">رقم الهاتف *</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01012345678"
                    className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Device & Fault details */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-purple-600" />
              <span>تفاصيل الجهاز والعطل (Device Specifications)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">موديل الجهاز *</label>
                <input
                  type="text"
                  value={formData.deviceModel}
                  onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                  placeholder="مثال: Samsung Galaxy S23 Ultra"
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
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
                <label className="block text-xs font-semibold mb-1">كلمة مرور/رمز القفل</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="1234 أو نمط Z"
                    className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">الملحقات المستلمة</label>
                <input
                  type="text"
                  value={formData.accessories}
                  onChange={(e) => setFormData({ ...formData, accessories: e.target.value })}
                  placeholder="جراب، شاحن، كارت ميموري..."
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">وصف العطل المعلن *</label>
                <textarea
                  rows={3}
                  value={formData.fault}
                  onChange={(e) => setFormData({ ...formData, fault: e.target.value })}
                  placeholder="لا يشحن، توقف لمس الشاشة، تهنيج عند فتح الكاميرا..."
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Photo Media Upload Placeholder */}
          <div className="pt-4 border-t space-y-2">
            <label className="block text-xs font-semibold">صور الجهاز وحالته قبل الفحص (Media Upload)</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 rounded-xl text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <Camera className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-xs text-muted-foreground font-medium">
                اضغط هنا لالتقاط أو رفع صور خدوش وشاشة الجهاز قبل الاستلام
              </p>
            </div>
          </div>
        </Card>

        {/* Thermal Ticket Preview Side Card */}
        <Card className="p-6 bg-amber-50/50 dark:bg-slate-900 border-amber-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>معاينة إيصال الحراري 80mm</span>
            </h3>
            <span className="text-[10px] font-mono bg-amber-200 dark:bg-amber-950 px-2 py-0.5 rounded text-amber-900 dark:text-amber-300">
              ESC/POS
            </span>
          </div>

          {/* Receipt Content */}
          <div className="bg-white text-slate-900 p-4 rounded-xl shadow-inner font-mono text-xs space-y-3 border dir-rtl">
            <div className="text-center border-b pb-2">
              <h2 className="font-extrabold text-sm">مركز تكنو صيانة للأجهزة</h2>
              <p className="text-[10px] text-slate-500">الفرع الرئيسي - 01012345678</p>
              <p className="text-[11px] font-bold mt-1">إيصال استلام رقم: {ticketNo}</p>
            </div>

            <div className="space-y-1 text-[11px]">
              <p>العميل: {formData.customerName || "محمد علي"}</p>
              <p>الهاتف: {formData.phone || "01012345678"}</p>
              <p>الجهاز: {formData.deviceModel || "iPhone 13 Pro"}</p>
              <p>العطل: {formData.fault || "تغيير شاشة"}</p>
              <p>الباسورد: {formData.password || "لا يوجد"}</p>
            </div>

            <div className="border-t pt-2 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>التكلفة التقديرية:</span>
                <span className="font-bold">{formData.estimatedCost} ج.م</span>
              </div>
              <div className="flex justify-between">
                <span>المدفوع (عربون):</span>
                <span className="font-bold text-emerald-600">{formData.deposit} ج.م</span>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="pt-2 text-center border-t">
              <div className="mx-auto h-24 w-24 bg-slate-900 text-white flex items-center justify-center rounded-lg p-2 font-mono text-[9px] break-all">
                [QR Code: {ticketNo}]
              </div>
              <p className="text-[9px] text-slate-400 mt-1">امسح الكود لتتبع حالة الصيانة اونلاين</p>
            </div>
          </div>

          <Button variant="gradient" onClick={handlePrintReceipt} className="w-full gap-2">
            <Printer className="h-4 w-4" />
            <span>تأكيد الحفظ وحساب العربون</span>
          </Button>
        </Card>
      </div>
    </div>
  );
}
