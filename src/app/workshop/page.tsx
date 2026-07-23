"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wrench, CheckCircle, Clock, AlertTriangle, ArrowLeftRight, Save, UserCheck, PackagePlus } from "lucide-react";

type MaintenanceStatus = "NEW" | "INSPECTING" | "WAITING_PARTS" | "IN_REPAIR" | "READY" | "DELIVERED";

interface Ticket {
  id: string;
  ticketNo: string;
  device: string;
  customer: string;
  fault: string;
  status: MaintenanceStatus;
  engineer: string;
  cost: number;
  partsUsed: string[];
}

const statusColumns: { id: MaintenanceStatus; label: string; color: string }[] = [
  { id: "NEW", label: "أجهزة جديدة", color: "border-sky-500 text-sky-600 bg-sky-50 dark:bg-sky-950/40" },
  { id: "INSPECTING", label: "جاري الفحص", color: "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
  { id: "WAITING_PARTS", label: "انتظار قطع غيار", color: "border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/40" },
  { id: "IN_REPAIR", label: "جاري الإصلاح", color: "border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950/40" },
  { id: "READY", label: "جاهز للتسليم", color: "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
];

const initialTickets: Ticket[] = [
  {
    id: "1",
    ticketNo: "WO-1001",
    device: "iPhone 13 Pro Max",
    customer: "محمد عبد الرحمن",
    fault: "تغيير شاشة + فحص دائرة الشحن",
    status: "IN_REPAIR",
    engineer: "م. أحمد حسام",
    cost: 4500,
    partsUsed: ["شاشة iPhone 13 Pro OEM", "IC شحن"],
  },
  {
    id: "2",
    ticketNo: "WO-1002",
    device: "Samsung S22 Ultra",
    customer: "سارة محمود",
    fault: "تغيير باغة وسوكيت",
    status: "READY",
    engineer: "م. محمود طارق",
    cost: 2100,
    partsUsed: ["باغة S22 Ultra"],
  },
  {
    id: "3",
    ticketNo: "WO-1003",
    device: "iPad Air 5",
    customer: "شركة الفرسان",
    fault: "عطل دائرة الباور (IC)",
    status: "INSPECTING",
    engineer: "م. أحمد حسام",
    cost: 3200,
    partsUsed: [],
  },
];

export default function WorkshopPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(initialTickets[0]);

  const moveTicketStatus = (ticketId: string, newStatus: MaintenanceStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2.5 py-1 text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg">
            المرحلة 3: لوحة فحص الورشة للمهندسين
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            آلة حالات الصيانة (Maintenance State Machine)
          </h1>
          <p className="text-xs text-muted-foreground">
            تتبع ومراقبة سريان الصيانة من الاستلام وحتى التسليم النهائي للعميل
          </p>
        </div>
      </div>

      {/* State Machine Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusColumns.map((col) => {
          const colTickets = tickets.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="space-y-3">
              <div className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-between ${col.color}`}>
                <span>{col.label}</span>
                <span className="px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 font-mono text-[11px]">
                  {colTickets.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[300px]">
                {colTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:border-blue-500 ${
                      selectedTicket?.id === ticket.id ? "ring-2 ring-blue-500 shadow-md" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-extrabold text-blue-600">{ticket.ticketNo}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{ticket.engineer}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ticket.device}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">{ticket.fault}</p>

                    <div className="mt-3 pt-2 border-t flex items-center justify-between text-[11px]">
                      <span className="font-bold font-mono">{ticket.cost} ج.م</span>
                      <ArrowLeftRight className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Engineer Inspection & Spare Parts Desk */}
      {selectedTicket && (
        <Card className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-blue-600 text-sm">{selectedTicket.ticketNo}</span>
                <Badge variant="purple">{selectedTicket.status}</Badge>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                لوحة المهندس: {selectedTicket.device} ({selectedTicket.customer})
              </h2>
            </div>

            {/* Quick Status Changers */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={selectedTicket.status === "INSPECTING" ? "default" : "outline"}
                size="sm"
                onClick={() => moveTicketStatus(selectedTicket.id, "INSPECTING")}
              >
                جاري الفحص
              </Button>
              <Button
                variant={selectedTicket.status === "WAITING_PARTS" ? "default" : "outline"}
                size="sm"
                onClick={() => moveTicketStatus(selectedTicket.id, "WAITING_PARTS")}
              >
                انتظار قطع
              </Button>
              <Button
                variant={selectedTicket.status === "IN_REPAIR" ? "default" : "outline"}
                size="sm"
                onClick={() => moveTicketStatus(selectedTicket.id, "IN_REPAIR")}
              >
                جاري الإصلاح
              </Button>
              <Button
                variant={selectedTicket.status === "READY" ? "emerald" : "outline"}
                size="sm"
                onClick={() => moveTicketStatus(selectedTicket.id, "READY")}
              >
                جاهز للتسليم
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Parts Consumption */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <PackagePlus className="h-4 w-4 text-emerald-600" />
                <span>قطع الغيار المستهلكة من المخزن</span>
              </h3>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border space-y-2">
                {selectedTicket.partsUsed.length === 0 ? (
                  <p className="text-xs text-muted-foreground">لم يتم إضافة قطع غيار مستهلكة بعد</p>
                ) : (
                  selectedTicket.partsUsed.map((part, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b last:border-0">
                      <span>{part}</span>
                      <span className="font-mono text-emerald-600 font-bold">مخصوم تلقائياً من المخزون</span>
                    </div>
                  ))
                )}
                <Button variant="outline" size="sm" className="w-full mt-2 text-xs gap-1">
                  <PackagePlus className="h-3.5 w-3.5" />
                  <span>إضافة قطعة غيار من المخزن</span>
                </Button>
              </div>
            </div>

            {/* Engineer Cost & Commission Notes */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-blue-600" />
                <span>ملاحظات التكلفة ونسبة المهندس</span>
              </h3>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span>إجمالي تكلفة الصيانة للعميل:</span>
                  <span className="font-bold font-mono text-sm">{selectedTicket.cost} ج.م</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>نسبة أرباح المهندس المتوقعة (15%):</span>
                  <span className="font-bold font-mono text-emerald-600">{(selectedTicket.cost * 0.15).toFixed(0)} ج.م</span>
                </div>
                <textarea
                  rows={2}
                  placeholder="ملاحظات المهندس الفنية خلال الإصلاح..."
                  className="w-full p-2 text-xs rounded-lg border bg-slate-50 dark:bg-slate-900"
                />
                <Button variant="gradient" size="sm" className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  <span>حفظ التحديثات والتكلفة</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
