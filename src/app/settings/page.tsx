"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Printer,
  MessageSquare,
  Database,
  Building,
  Save,
  CheckCircle2,
  HardDrive,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "printer" | "whatsapp" | "backup">("general");
  const [saved, setSaved] = useState(false);

  // Form State
  const [settings, setSettings] = useState({
    storeName: "مركز تكنو صيانة للأجهزة الذكية",
    phone: "01012345678",
    address: "شارع شريف - وسط البلد - القاهرة",
    taxNo: "394-102-482",
    receiptFooter: "شكراً لثقتكم بنا! الأجهزة تقع تحت الضمان لمدة 30 يوماً من تاريخ الاستلام.",
    
    // Thermal Printer
    paperSize: "80mm",
    printerType: "WEB_SERIAL",
    baudRate: "9600",
    autoPrintOnIntake: true,

    // WhatsApp API
    whatsappInstanceId: "inst_demo_98210",
    whatsappApiKey: "ak_live_891280381023810",
    sendIntakeMsg: true,
    sendReadyMsg: true,

    // Backup
    autoBackupFrequency: "DAILY",
  });

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header with Unified Primary Save Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-16 z-30">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg">
              الإعدادات العامة بالنظام
            </span>
          </div>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            إعدادات المؤسسة، الطباعة الحرارية، والواتساب
          </h1>
          <p className="text-xs text-muted-foreground">
            تخصيص البيانات المطبوعة على الإيصالات وتكوين محرك الطباعة والربط السحابي
          </p>
        </div>

        <Button variant="emerald" onClick={() => handleSave()} className="gap-2 font-bold text-xs shadow-md">
          <Save className="h-4 w-4" />
          <span>حفظ التغييرات</span>
        </Button>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>تم حفظ جميع إعدادات الصفحة وتحديث محرك الطباعة والواتساب بنجاح!</span>
          </div>
        </div>
      )}

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "general"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Building className="h-4 w-4" />
          <span>بيانات المركز والإيصال</span>
        </button>

        <button
          onClick={() => setActiveTab("printer")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "printer"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Printer className="h-4 w-4" />
          <span>الطباعة الحرارية (Thermal Printer)</span>
        </button>

        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "whatsapp"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>ربط WhatsApp API</span>
        </button>

        <button
          onClick={() => setActiveTab("backup")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "backup"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Database className="h-4 w-4" />
          <span>النسخ الاحتياطي والأمان</span>
        </button>
      </div>

      {/* Settings Form Content */}
      <form onSubmit={handleSave}>
        {activeTab === "general" && (
          <Card className="p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="text-sm font-bold border-b pb-3 text-slate-900 dark:text-white">
              البيانات الرئيسية للمركز (تظهر أعلى وأسفل الفواتير والإيصالات)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">اسم المركز / المحل *</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">رقم هاتف التواصل للإيصال *</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">الرقم الضريبي (إن وجد)</label>
                <input
                  type="text"
                  value={settings.taxNo}
                  onChange={(e) => setSettings({ ...settings, taxNo: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">عنوان الفرع الرئيسي</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1">نص الشروط المطبوعة أسفل الإيصال</label>
                <textarea
                  rows={3}
                  value={settings.receiptFooter}
                  onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </Card>
        )}

        {activeTab === "printer" && (
          <Card className="p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="text-sm font-bold border-b pb-3 text-slate-900 dark:text-white">
              إعدادات الطابعة الحرارية Direct ESC/POS Thermal Printer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">مقاس ورق الطابعة الحرارية</label>
                <select
                  value={settings.paperSize}
                  onChange={(e) => setSettings({ ...settings, paperSize: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800"
                >
                  <option value="80mm">80mm (مقاس ستاندرد واسع)</option>
                  <option value="58mm">58mm (مقاس صغير)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">معدل نقل بيانات المنفذ (BaudRate)</label>
                <select
                  value={settings.baudRate}
                  onChange={(e) => setSettings({ ...settings, baudRate: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 font-mono"
                >
                  <option value="9600">9600 (افتراضي)</option>
                  <option value="19200">19200</option>
                  <option value="115200">115200 (سريع جداً)</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoPrintOnIntake}
                    onChange={(e) => setSettings({ ...settings, autoPrintOnIntake: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span>طباعة الإيصال فورياً عند إتمام خطوة استلام الجهاز بدون فتح نافذة الطباعة</span>
                </label>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "whatsapp" && (
          <Card className="p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="text-sm font-bold border-b pb-3 text-slate-900 dark:text-white">
              إعدادات حساب واتساب للأتمتة التلقائية (WhatsApp Evolution/WPP API)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">معرف الجلسة (Instance ID)</label>
                <input
                  type="text"
                  value={settings.whatsappInstanceId}
                  onChange={(e) => setSettings({ ...settings, whatsappInstanceId: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">مفتاح API الخاص بالخدمة (API Key)</label>
                <input
                  type="password"
                  value={settings.whatsappApiKey}
                  onChange={(e) => setSettings({ ...settings, whatsappApiKey: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div className="md:col-span-2 space-y-2 pt-2 border-t">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sendIntakeMsg}
                    onChange={(e) => setSettings({ ...settings, sendIntakeMsg: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                  />
                  <span>إرسال رسالة واتساب أوتوماتيكية للعميل عند استلام الجهاز بها رابط كود QR للتتبع</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sendReadyMsg}
                    onChange={(e) => setSettings({ ...settings, sendReadyMsg: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                  />
                  <span>إرسال رسالة واتساب أوتوماتيكية للعميل فور تغيّر حالة الجهاز إلى "جاهز للتسليم"</span>
                </label>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "backup" && (
          <Card className="p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
            <h3 className="text-sm font-bold border-b pb-3 text-slate-900 dark:text-white">
              إدارة النسخ الاحتياطي لقواعد البيانات والربط السحابي
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border bg-slate-50 dark:bg-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">تحميل نسخة احتياطية فورية (.sql / .enc)</h4>
                  <p className="text-[11px] text-muted-foreground">تصدير جميع الفواتير والعملاء وأوامر الصيانة بحالة مشفرة</p>
                </div>
                <Button variant="gradient" size="sm" type="button" className="gap-2 text-xs font-bold">
                  <HardDrive className="h-4 w-4" />
                  <span>تصدير نسخة الآن</span>
                </Button>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">معدل النسخ التلقائي السحابي</label>
                <select
                  value={settings.autoBackupFrequency}
                  onChange={(e) => setSettings({ ...settings, autoBackupFrequency: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border bg-slate-50 dark:bg-slate-800"
                >
                  <option value="HOURLY">كل ساعة</option>
                  <option value="DAILY">يومياً عند منتصف الليل (موصى به)</option>
                  <option value="WEEKLY">أسبوعياً</option>
                </select>
              </div>
            </div>
          </Card>
        )}
      </form>
    </div>
  );
}
