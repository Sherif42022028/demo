"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquareShare, Send, CheckCircle2, QrCode, RefreshCw, Zap, Bell } from "lucide-react";

export default function AutomationPage() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      phone: "01012345678",
      customer: "محمد عبد الرحمن",
      type: "استلام جهاز WO-1001",
      status: "تم الإرسال",
      time: "2026-07-23 14:30",
    },
    {
      id: "2",
      phone: "01198765432",
      customer: "سارة محمود",
      type: "إشعار جاهزية التسليم WO-1002",
      status: "تم التسليم",
      time: "2026-07-23 15:10",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg">
            المرحلة 6: الأتمتة والواتساب
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            ربط WhatsApp API والمزامنة اللحظية (Realtime Engine)
          </h1>
          <p className="text-xs text-muted-foreground">
            إرسال إشعارات تلقائية فورية للعملاء فور استلام الجهاز أو انتهاء الصيانة أو تذكيرات الأقساط
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="gap-1.5 p-2 font-mono">
            <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
            <span>WhatsApp Connected (Active)</span>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-4 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b pb-3">
            <MessageSquareShare className="h-4 w-4 text-emerald-600" />
            <span>سجل الرسائل والإشعارات الصادرة تلقائياً</span>
          </h3>

          <div className="space-y-3">
            {messages.map((m) => (
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
        </Card>

        {/* QR Code Connect Instance */}
        <Card className="p-6 bg-slate-50/50 dark:bg-slate-900 border space-y-4 text-center">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
            حالة جلسة الواتساب (WhatsApp Instance)
          </h3>

          <div className="mx-auto h-32 w-32 bg-white dark:bg-slate-800 border-2 border-dashed border-emerald-500 rounded-2xl flex items-center justify-center p-2 shadow-sm">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-bounce" />
          </div>

          <p className="text-xs font-bold text-emerald-600">
            الجلسة متصلة ويعمل المحرك اللحظي عبر WebSockets
          </p>

          <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>إعادة التنشيط والمزامنة</span>
          </Button>
        </Card>
      </div>
    </div>
  );
}
