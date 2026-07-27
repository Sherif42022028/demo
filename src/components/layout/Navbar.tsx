"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, Sun, Moon, Wrench, ShieldCheck, LogIn, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Branch {
  id: string;
  name: string;
  code: string;
}

interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  role: string;
}

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("branch-main");
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check logged in user from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    } else {
      // Default fallback for demo/review
      setUser({
        name: "أحمد الموصلي",
        phone: "01000000001",
        role: "ADMIN",
      });
    }

    // 2. Fetch branches for dynamic dropdown
    const fetchBranches = async () => {
      try {
        const res = await fetch("/api/branches");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data.length > 0) {
            setBranches(json.data);
            setIsConnected(true);
          }
        } else {
          setIsConnected(false);
        }
      } catch (err) {
        setIsConnected(false);
      }
    };

    fetchBranches();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setUserMenuOpen(false);
    router.push("/login");
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "مدير النظام";
      case "ENGINEER":
        return "مهندس صيانة";
      case "RECEPTIONIST":
        return "موظف استقبال";
      case "ACCOUNTANT":
        return "محاسب مالي";
      default:
        return role || "مستخدم";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-5 backdrop-blur-md select-none">
      {/* Search & Dynamic Branch Dropdown */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="بحث سريع (رقم الهاتف، IMEI، أمر الصيانة)..."
            className="w-full pr-9 pl-3 py-1.5 text-xs font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-sm focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
        </div>

        {/* Industrial Branch Dropdown */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-sm border border-slate-200 dark:border-slate-700">
          <Wrench className="h-3.5 w-3.5 text-slate-500" />
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-transparent border-none text-xs font-bold focus:outline-none cursor-pointer text-slate-900 dark:text-white"
          >
            {branches.length > 0 ? (
              branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {b.name} ({b.code})
                </option>
              ))
            ) : (
              <option value="branch-main" className="bg-white dark:bg-slate-900">الفرع الرئيسي (BR-01)</option>
            )}
          </select>
        </div>

        {/* System Connection Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-bold">
          <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-600 animate-pulse" : "bg-rose-600"}`} />
          <span className={isConnected ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}>
            {isConnected ? "النظام متصل" : "غير متصل"}
          </span>
        </div>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-sm text-slate-600 dark:text-slate-300 h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-sm text-slate-600 dark:text-slate-300 h-9 w-9 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-white dark:ring-slate-900" />
        </Button>

        {/* Auth User Section */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 pr-2 border-r border-slate-200 dark:border-slate-800 group hover:opacity-90 transition-opacity"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-mono font-bold text-xs shadow-sm">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>{user.name}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono font-bold">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>{getRoleLabel(user.role)}</span>
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 rounded-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md py-1.5 z-50 animate-in fade-in">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{user.phone}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-right text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-between"
                >
                  <span>تسجيل الخروج</span>
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login">
            <Button className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-sm h-9">
              <LogIn className="h-4 w-4" />
              <span>تسجيل الدخول</span>
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};
