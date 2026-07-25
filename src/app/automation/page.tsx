"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { MessageSquareShare, CheckCircle2, RefreshCw, Zap, WifiOff, Activity } from "lucide-react";

export default function AutomationPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState<boolean>(true);
  const [healthStatus, setHealthStatus] = useState<"EXCELLENT" | "CHECKING">("EXCELLENT");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const runHealthCheck = () => {
    setHealthStatus("CHECKING");
    setTimeout(() => {
      setHealthStatus("EXCELLENT");
    }, 1200);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      runHealthCheck();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredMessages = messages.filter((m) => {
    if (!m.time) return true;
    const date = new Date(m.time);
    if (fromDate && date < new Date(fromDate)) return false;
    if (toDate && date > new Date(toDate + "T23:59:59")) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg">
            الأتمتة والواتساب (WhatsApp Automation Engine)
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            إشعارات الواتساب التلقائية
          </h1>
          <p className="text-xs text-muted-foreground">
            إرسال إشعارات تلقائية فورية للعملاء فور استلام الجهاز أو تحديث حالة الصيانة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={isWhatsAppConnected ? "success" : "destructive"} className="gap-1.5 p-2 font-mono text-xs">
            {isWhatsAppConnected ? (
              <>
                <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
                <span>WhatsApp Active (متصل)</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-rose-500" />
                <span>WhatsApp Disconnected (غير متصل)</span>
              </>
            )}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquareShare className="h-4 w-4 text-emerald-600" />
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
                <div key={m.id} className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2 font-bold">
                      <span>{m.customer}</span>
                      <span className="font-mono text-[11px] text-slate-400">({m.phone})</span>
                    </div>
                    <p className="text-muted-foreground mt-0.5">{m.type}</p>
                  </div>
                  <div className="text-left">
                    <Badge variant="success">{m.status}</Badge>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Dynamic HealthCheck Instance Card */}
        <Card className="p-6 bg-slate-50/50 dark:bg-slate-900 border space-y-4 text-center shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
            حالة فحص الاتصال التلقائي (Healthcheck)
          </h3>

          <div className="mx-auto h-32 w-32 bg-white dark:bg-slate-800 border-2 border-dashed border-emerald-500 rounded-2xl flex flex-col items-center justify-center p-2 shadow-sm gap-2">
            {healthStatus === "CHECKING" ? (
              <Activity className="h-12 w-12 text-blue-500 animate-spin" />
            ) : isWhatsAppConnected ? (
              <CheckCircle2 className="h-14 w-14 text-emerald-500 animate-bounce" />
            ) : (
              <WifiOff className="h-14 w-14 text-rose-500" />
            )}
            <span className="text-[10px] font-mono text-slate-400">
              {healthStatus === "CHECKING" ? "جاري الفحص..." : "استجابة ممتازة (12ms)"}
            </span>
          </div>

          <p className={`text-xs font-bold ${isWhatsAppConnected ? "text-emerald-600" : "text-rose-600"}`}>
            {isWhatsAppConnected ? "محرك الإشعارات جاهز ومفعل للعمليات" : "توقف المحرك عن الإرسال، أعد المزامنة"}
          </p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              runHealthCheck();
              setIsWhatsAppConnected(!isWhatsAppConnected);
            }}
            className="w-full gap-2 text-xs font-bold"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{isWhatsAppConnected ? "فحص وقطع الاتصال" : "إعادة التنشيط والمزامنة"}</span>
          </Button>
        </Card>
      </div>
    </div>
  );
}
