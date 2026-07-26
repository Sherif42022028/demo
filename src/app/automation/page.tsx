"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { MessageSquareShare, CheckCircle2, RefreshCw, Zap, WifiOff, Activity, QrCode } from "lucide-react";

export default function AutomationPage() {
  const [messages] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<"CONNECTED" | "CONNECTING" | "DISCONNECTED">("DISCONNECTED");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/whatsapp/status");
      const json = await res.json();
      if (json.success && json.data) {
        setConnectionStatus(json.data.status);
        if (json.data.qrDataUrl) {
          setQrDataUrl(json.data.qrDataUrl);
        } else if (json.data.status === "CONNECTED") {
          setQrDataUrl(null);
        }
      }
    } catch (err) {
      console.error("Failed to check WhatsApp status", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = connectionStatus === "CONNECTED";

  const filteredMessages = messages.filter((m) => {
    if (!m.time) return true;
    const date = new Date(m.time);
    if (fromDate && date < new Date(fromDate)) return false;
    if (toDate && date > new Date(toDate + "T23:59:59")) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-sm">
            الأتمتة والواتساب (WhatsApp Baileys Engine)
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            إشعارات الواتساب الحقيقية (Baileys Node.js Engine)
          </h1>
          <p className="text-xs text-muted-foreground">
            ربط حساب الواتساب الخاص بالمركز ومراقبة حالة المزامنة والرسائل الصادرة فورياً
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={isConnected ? "success" : "destructive"} className="gap-1.5 p-1.5 font-mono text-xs">
            {isConnected ? (
              <>
                <Zap className="h-4 w-4 text-emerald-600 animate-pulse" />
                <span>WhatsApp Connected (متصل حقيقياً)</span>
              </>
            ) : connectionStatus === "CONNECTING" ? (
              <>
                <Activity className="h-4 w-4 text-amber-600 animate-spin" />
                <span>WhatsApp Connecting (جاري المزامنة)</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-rose-600" />
                <span>WhatsApp Disconnected (غير متصل)</span>
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm rounded-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquareShare className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <span>سجل الرسائل والإشعارات الصادرة تلقائياً</span>
            </h3>

            <div className="flex items-center gap-2">
              <DatePicker value={fromDate} onChange={(v) => setFromDate(v)} />
              <DatePicker value={toDate} onChange={(v) => setToDate(v)} />
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground space-y-2">
              <p className="font-bold text-slate-600 dark:text-slate-300">لا توجد إشعارات مرسلة بالفترة المحددة</p>
              <p className="text-[11px]">
                سيتم توليد وإرسال إشعارات الواتساب تلقائياً للعميل عند قيامك باستلام جهاز جديد أو تعديل حالة الصيانة!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((m) => (
                <div key={m.id} className="p-3 rounded-sm border bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="flex items-center gap-2 font-bold">
                      <span className="font-sans">{m.customer}</span>
                      <span className="text-[11px] text-slate-400">({m.phone})</span>
                    </div>
                    <p className="text-muted-foreground font-sans mt-0.5">{m.type}</p>
                  </div>
                  <div className="text-left">
                    <Badge variant="success">{m.status}</Badge>
                    <p className="text-[10px] text-slate-400 mt-1">{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Dynamic Live QR Code Pairing & HealthCheck Card */}
        <Card className="p-6 bg-slate-50/50 dark:bg-slate-900 border space-y-4 text-center shadow-sm rounded-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5">
            <QrCode className="h-4 w-4" />
            <span>ربط وتفعيل الواتساب (Live QR Pair)</span>
          </h3>

          <div className="mx-auto min-h-[160px] w-full bg-white dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-sm flex flex-col items-center justify-center p-4 shadow-sm gap-2">
            {isConnected ? (
              <div className="space-y-2 py-4">
                <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  الحساب مرتبط ومفعل بنجاح!
                </p>
                <p className="text-[10px] font-mono text-slate-400">
                  جلسة العمل محفوظة ومزودة بالتجديد التلقائي
                </p>
              </div>
            ) : qrDataUrl ? (
              <div className="space-y-2">
                <img src={qrDataUrl} alt="WhatsApp QR Code" className="w-44 h-44 mx-auto border p-1 bg-white shadow-sm" />
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  امسح كود QR بأيقونة (الجهزة المرتبطة) في الواتساب
                </p>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <Activity className="h-10 w-10 text-slate-500 animate-spin mx-auto" />
                <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                  جاري بدء محرك Baileys وتوليد كود الـ QR...
                </p>
              </div>
            )}
          </div>

          <p className={`text-xs font-bold ${isConnected ? "text-emerald-600" : "text-amber-600"}`}>
            {isConnected ? "محرك Baileys جاهز لإرسال الإشعارات" : "يرجى ربط الجهاز لتفعيل الإرسال التلقائي"}
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={checkStatus}
            className="w-full gap-2 text-xs font-bold"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث حالة الاتصال</span>
          </Button>
        </Card>
      </div>
    </div>
  );
}
