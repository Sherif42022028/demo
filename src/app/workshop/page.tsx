"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TicketTag } from "@/components/ui/ticket-tag";
import { ArrowLeftRight, RefreshCw, Search, CheckCircle2, AlertCircle, PackageCheck } from "lucide-react";

type MaintenanceStatus = "NEW" | "INSPECTING" | "WAITING_PARTS" | "IN_REPAIR" | "READY" | "DELIVERED";

interface Ticket {
  id: string;
  ticketNumber: string;
  deviceModel: string;
  customerName?: string;
  reportedFault: string;
  status: MaintenanceStatus;
  estimatedCost: string | number;
  finalCost?: string | number;
  deliveredAt?: string;
}

const statusColumns: { id: MaintenanceStatus; label: string; color: string }[] = [
  { id: "NEW", label: "أجهزة جديدة", color: "border-slate-300 text-slate-700 bg-slate-100 dark:bg-slate-800" },
  { id: "INSPECTING", label: "جاري الفحص", color: "border-amber-300 text-amber-800 bg-amber-50 dark:bg-amber-950" },
  { id: "WAITING_PARTS", label: "انتظار قطع غيار", color: "border-rose-300 text-rose-800 bg-rose-50 dark:bg-rose-950" },
  { id: "IN_REPAIR", label: "جاري الإصلاح", color: "border-purple-300 text-purple-800 bg-purple-50 dark:bg-purple-950" },
  { id: "READY", label: "جاهز للتسليم", color: "border-emerald-300 text-emerald-800 bg-emerald-50 dark:bg-emerald-950" },
  { id: "DELIVERED", label: "تم التسليم للعميل", color: "border-blue-300 text-blue-800 bg-blue-50 dark:bg-blue-950" },
];

export default function WorkshopPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchWorkshopTickets = async () => {
    setLoading(true);
    setIsError(false);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch("/api/work-orders", { signal: controller.signal });
      clearTimeout(timeoutId);
      const json = await res.json();
      if (json.success) {
        setTickets(json.data);
        if (json.data.length > 0 && !selectedTicket) {
          setSelectedTicket(json.data[0]);
        }
      } else {
        setIsError(true);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Failed to fetch tickets", err);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshopTickets();
  }, []);

  const moveTicketStatus = async (ticketId: string, newStatus: MaintenanceStatus) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/work-orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticketId, status: newStatus }),
      });

      const json = await res.json();
      if (json.success) {
        setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
        );
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      } else {
        alert(json.error || "تعذر تعديل حالة الجهاز");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالنظام");
    } finally {
      setUpdating(false);
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      (t.deviceModel || "").includes(search) ||
      (t.ticketNumber || "").includes(search) ||
      (t.customerName || "").includes(search) ||
      (t.reportedFault || "").includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-sm">
            لوحة ورشة الفحص والإصلاح
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            شاشة تتبع حالات الصيانة والأجهزة
          </h1>
          <p className="text-xs text-muted-foreground">
            إدارة وتحديث حالات صيانة الأجهزة وحساب تكاليف الإصلاح وتسليم الأجهزة للعملاء
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchWorkshopTickets} className="gap-2 text-xs">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>تحديث اللوحة</span>
          </Button>
        </div>
      </div>

      {/* Search Bar for Workshop Board */}
      <div className="relative w-full max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث في الورشة برقم الأمر، اسم العميل، أو الموديل..."
          className="w-full pr-9 pl-4 py-2 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm shadow-sm focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Error Retry Banner */}
      {isError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-sm text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>تعذر الاتصال بخادم الورشة، يرجى المحاولة مرة أخرى.</span>
          </div>
          <Button variant="outline" size="sm" onClick={fetchWorkshopTickets} className="gap-1 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>إعادة المحاولة</span>
          </Button>
        </div>
      )}

      {/* State Machine Board Grid (6 Columns including DELIVERED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {statusColumns.map((col) => {
          const colTickets = filteredTickets.filter((t) => t.status === col.id);
          return (
            <div key={col.id} className="space-y-3">
              <div className={`p-2.5 rounded-sm border font-bold text-xs flex items-center justify-between ${col.color}`}>
                <span>{col.label}</span>
                <span className="px-2 py-0.5 rounded-sm bg-white dark:bg-slate-900 font-mono text-[11px]">
                  {colTickets.length.toLocaleString("en-US")}
                </span>
              </div>

              <div className="space-y-3 min-h-[250px] bg-slate-50/50 dark:bg-slate-900/30 p-2 rounded-sm border border-dashed border-slate-200 dark:border-slate-800">
                {loading ? (
                  <div className="py-8 text-center text-xs text-slate-400 animate-pulse font-mono">جاري التحميل...</div>
                ) : colTickets.length === 0 ? (
                  <div className="py-12 text-center text-[11px] text-slate-400 font-medium">لا توجد أجهزة</div>
                ) : (
                  colTickets.map((ticket) => (
                    <Card
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className={`p-3.5 cursor-pointer transition-all duration-200 hover:border-slate-400 rounded-sm ${
                        selectedTicket?.id === ticket.id ? "ring-2 ring-emerald-500 shadow-md border-emerald-500" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <TicketTag number={ticket.ticketNumber} />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ticket.deviceModel}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">{ticket.reportedFault}</p>

                      <div className="mt-3 pt-2 border-t flex items-center justify-between text-[11px]">
                        <span className="font-bold font-mono">
                          {Number(ticket.finalCost || ticket.estimatedCost).toLocaleString("en-US")} ج.م
                        </span>
                        <ArrowLeftRight className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Engineer Inspection & Status Action Desk */}
      {selectedTicket && (
        <Card className="p-6 space-y-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm rounded-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <TicketTag number={selectedTicket.ticketNumber} />
                <Badge variant={selectedTicket.status === "DELIVERED" ? "info" : "purple"}>
                  {selectedTicket.status === "DELIVERED" ? "تم التسليم للعميل ✅" : selectedTicket.status}
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                لوحة فحص وتحديث الجهاز: {selectedTicket.deviceModel} ({selectedTicket.customerName || "عميل نقد"})
              </h2>
            </div>

            {/* Status Action Buttons with DELIVERED Option */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { status: "INSPECTING" as const, label: "جاري الفحص" },
                { status: "WAITING_PARTS" as const, label: "انتظار قطع" },
                { status: "IN_REPAIR" as const, label: "جاري الإصلاح" },
                { status: "READY" as const, label: "جاهز للتسليم" },
                { status: "DELIVERED" as const, label: "تم التسليم للعميل ✅", isDeliveredBtn: true },
              ].map((btn) => {
                const isActive = selectedTicket.status === btn.status;
                return (
                  <Button
                    key={btn.status}
                    type="button"
                    disabled={updating}
                    onClick={() => moveTicketStatus(selectedTicket.id, btn.status)}
                    className={`text-xs gap-1.5 transition-all font-bold ${
                      isActive
                        ? btn.isDeliveredBtn
                          ? "bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2 shadow-md hover:bg-blue-700"
                          : "bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2 shadow-md hover:bg-emerald-700"
                        : btn.isDeliveredBtn
                        ? "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 hover:bg-blue-100"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    }`}
                  >
                    {isActive && <CheckCircle2 className="h-4 w-4 text-white" />}
                    {btn.isDeliveredBtn && !isActive && <PackageCheck className="h-4 w-4" />}
                    <span>{btn.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
