"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Phone, ShieldCheck, Wrench, UserCheck, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("01000000001");
  const [password, setPassword] = useState("123456");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      // Save token & user in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // Redirect to dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.message || "بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  const quickRoles = [
    { role: "ADMIN", label: "مدير النظام (Admin)", phone: "01000000001" },
    { role: "ENGINEER", label: "مهندس الصيانة", phone: "01000000002" },
    { role: "RECEPTIONIST", label: "موظف الاستقبال", phone: "01012345678" },
    { role: "ACCOUNTANT", label: "المحاسب المالي", phone: "01200001122" },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl shadow-xl shadow-blue-500/20">
            ERP
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            تسجيل الدخول - نظام تكنو صيانة POS
          </h1>
          <p className="text-xs text-muted-foreground">
            أدخل بيانات الاعتماد أو اختر دوراً سريعاً للمعاينة التجريبية
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 space-y-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                رقم الهاتف (Phone Number) *
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full pr-9 pl-3 py-2.5 text-xs font-mono rounded-xl border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                كلمة المرور (Password) *
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-9 pl-3 py-2.5 text-xs font-mono rounded-xl border bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <Button variant="gradient" type="submit" className="w-full h-11 text-xs gap-2" disabled={loading}>
              {loading ? (
                <span>جاري المصادقة...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>دخول النظام الحقيقي</span>
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="pt-4 border-t space-y-3">
            <p className="text-[11px] font-bold text-slate-500 text-center uppercase tracking-wider">
              اختيار دور سريع للمعاينة التجريبية (Demo Accounts)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickRoles.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => {
                    setRole(r.role);
                    setPhone(r.phone);
                  }}
                  className={`p-2 rounded-lg border text-right text-xs font-bold transition-all ${
                    phone === r.phone
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <p className="font-extrabold">{r.label}</p>
                  <p className="text-[10px] font-mono text-slate-400">{r.phone}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
