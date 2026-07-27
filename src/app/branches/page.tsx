"use client";

import React, { useState, useEffect } from "react";
import { CustomTable, Column } from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormDialog } from "@/components/ui/form-dialog";
import {
  Plus,
  MapPin,
  Phone,
  RefreshCw,
  Users,
  Building2,
  Wrench,
  ShieldCheck,
  UserPlus,
  Percent,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Branch {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  isActive: boolean;
}

interface UserItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: "ADMIN" | "ENGINEER" | "RECEPTIONIST" | "ACCOUNTANT" | "INVENTORY_MANAGER";
  commissionRate: string | number;
  isActive: boolean;
  branchId?: string;
  branchName?: string;
  branchCode?: string;
}

export default function BranchesAndUsersPage() {
  const [activeTab, setActiveTab] = useState<"branches" | "users">("users");

  // Branches State
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState(false);
  const [branchDialogOpen, setBranchDialogOpen] = useState(false);
  const [submittingBranch, setSubmittingBranch] = useState(false);
  const [branchFormData, setBranchFormData] = useState({
    name: "",
    code: "",
    address: "",
    phone: "",
  });

  // Users & Engineers State
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [submittingUser, setSubmittingUser] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userFormData, setUserFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: "ENGINEER",
    branchId: "branch-main",
    commissionRate: "15",
  });

  const fetchBranches = async () => {
    setBranchesLoading(true);
    setBranchesError(false);
    try {
      const res = await fetch("/api/branches");
      const json = await res.json();
      if (json.success) {
        setBranches(json.data);
      } else {
        setBranchesError(true);
      }
    } catch (err) {
      console.error("Failed to fetch branches", err);
      setBranchesError(true);
    } finally {
      setBranchesLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    setUsersError(false);
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      if (json.success) {
        setUsersList(json.data);
      } else {
        setUsersError(true);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
      setUsersError(true);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchUsers();
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBranch(true);
    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branchFormData),
      });

      const json = await res.json();
      if (json.success) {
        setBranchDialogOpen(false);
        setBranchFormData({ name: "", code: "", address: "", phone: "" });
        fetchBranches();
      } else {
        alert(json.error || "تعذر إنشاء الفرع");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالنظام");
    } finally {
      setSubmittingBranch(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUser(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userFormData),
      });

      const json = await res.json();
      if (json.success) {
        setUserDialogOpen(false);
        setUserFormData({
          name: "",
          phone: "",
          password: "",
          role: "ENGINEER",
          branchId: "branch-main",
          commissionRate: "15",
        });
        fetchUsers();
      } else {
        alert(json.error || "تعذر إنشاء حساب المستخدم");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالنظام");
    } finally {
      setSubmittingUser(false);
    }
  };

  const toggleUserActiveStatus = async (user: UserItem) => {
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        fetchUsers();
      } else {
        alert(json.error || "تعذر تغيير حالة المستخدم");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بالنظام");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge variant="destructive">مدير النظام (Admin)</Badge>;
      case "ENGINEER":
        return <Badge variant="purple">مهندس صيانة (Engineer)</Badge>;
      case "RECEPTIONIST":
        return <Badge variant="info">موظف استقبال</Badge>;
      case "ACCOUNTANT":
        return <Badge variant="success">محاسب مالي</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const branchColumns: Column<Branch>[] = [
    {
      header: "كود واسم الفرع",
      cell: (b) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-sm border border-slate-300 dark:border-slate-700">
            {b.code}
          </span>
          <p className="font-bold text-slate-900 dark:text-slate-100 mt-1">{b.name}</p>
        </div>
      ),
    },
    {
      header: "العنوان والهاتف",
      cell: (b) => (
        <div className="space-y-0.5">
          <p className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span>{b.address || "بدون عنوان"}</span>
          </p>
          <p className="text-[11px] font-mono text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3 text-slate-400" />
            <span>{b.phone || "—"}</span>
          </p>
        </div>
      ),
    },
    {
      header: "حالة الفرع",
      cell: (b) => (
        <Badge variant={b.isActive ? "success" : "destructive"}>
          {b.isActive ? "نشط ويعمل" : "مغلق مؤقتاً"}
        </Badge>
      ),
    },
  ];

  const filteredUsers = usersList.filter(
    (u) =>
      (u.name || "").includes(userSearch) ||
      (u.phone || "").includes(userSearch) ||
      (u.role || "").includes(userSearch)
  );

  const userColumns: Column<UserItem>[] = [
    {
      header: "اسم المهندس / الموظف",
      cell: (u) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100">{u.name}</p>
          <p className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span>{u.phone}</span>
          </p>
        </div>
      ),
    },
    {
      header: "الدور والصلاحيات",
      cell: (u) => getRoleBadge(u.role),
    },
    {
      header: "الفرع التابع له",
      cell: (u) => (
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          {u.branchName || "الفرع الرئيسي"}
        </span>
      ),
    },
    {
      header: "نسبة العمولة",
      cell: (u) => (
        <span className="font-mono font-bold text-emerald-600 flex items-center gap-1">
          <Percent className="h-3.5 w-3.5" />
          <span>{Number(u.commissionRate || 0)}%</span>
        </span>
      ),
    },
    {
      header: "حالة الحساب",
      cell: (u) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleUserActiveStatus(u)}
          className={`h-7 text-[11px] font-bold gap-1 ${
            u.isActive
              ? "text-emerald-700 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-50"
              : "text-rose-700 dark:text-rose-300 border-rose-300 hover:bg-rose-50"
          }`}
        >
          {u.isActive ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>حساب مفعل</span>
            </>
          ) : (
            <>
              <XCircle className="h-3.5 w-3.5 text-rose-600" />
              <span>حساب موقف</span>
            </>
          )}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-sm border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-sm">
            إدارة الفروع والمستخدمين
          </span>
          <h1 className="text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
            لوحة التحكم في الفروع وفريق العمل والمهندسين
          </h1>
          <p className="text-xs text-muted-foreground">
            إضافة وتخصيص صلاحيات المهندسين، نسب العمولات، وتسجيل الفروع المقرات
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              fetchBranches();
              fetchUsers();
            }}
            className="gap-2 text-xs"
          >
            <RefreshCw className="h-4 w-4" />
            <span>تحديث</span>
          </Button>

          {activeTab === "branches" ? (
            <Button
              onClick={() => setBranchDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-bold"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة فرع جديد</span>
            </Button>
          ) : (
            <Button
              onClick={() => setUserDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs font-bold"
            >
              <UserPlus className="h-4 w-4" />
              <span>إضافة مهندس / موظف جديد</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 font-mono">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-sm border transition-all ${
            activeTab === "users"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>فريق العمل والمهندسين ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("branches")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-sm border transition-all ${
            activeTab === "branches"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-sm"
              : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>شجرة الفروع والمقرات ({branches.length})</span>
        </button>
      </div>

      {/* Content Body based on Active Tab */}
      {activeTab === "users" ? (
        <CustomTable
          columns={userColumns}
          data={filteredUsers}
          isLoading={usersLoading}
          isError={usersError}
          onRetry={fetchUsers}
          onSearch={(q) => setUserSearch(q)}
          searchPlaceholder="بحث باسم المهندس، رقم الهاتف، أو الدور..."
          emptyMessage="لا يوجد مستخدمين أو مهندسين مسجلين حالياً"
          emptyAction={
            <Button
              onClick={() => setUserDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs mt-2 font-bold"
            >
              <UserPlus className="h-4 w-4" />
              <span>إضافة أول مهندس للنظام</span>
            </Button>
          }
        />
      ) : (
        <CustomTable
          columns={branchColumns}
          data={branches}
          isLoading={branchesLoading}
          isError={branchesError}
          onRetry={fetchBranches}
          emptyMessage="لا توجد فروع مسجلة حالياً"
          emptyAction={
            <Button
              onClick={() => setBranchDialogOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs mt-2 font-bold"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة فرع جديد</span>
            </Button>
          }
        />
      )}

      {/* Add New Branch Dialog */}
      <FormDialog open={branchDialogOpen} onOpenChange={setBranchDialogOpen} title="إضافة فرع جديد">
        <form onSubmit={handleCreateBranch} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold mb-1">اسم الفرع *</label>
            <input
              type="text"
              required
              value={branchFormData.name}
              onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
              placeholder="فرع الإسكندرية - سموحة"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">كود الفرع (Branch Code) *</label>
            <input
              type="text"
              required
              value={branchFormData.code}
              onChange={(e) => setBranchFormData({ ...branchFormData, code: e.target.value })}
              placeholder="BR-02"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">العنوان</label>
            <input
              type="text"
              value={branchFormData.address}
              onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
              placeholder="شارع سموحة الرئيسي"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">رقم الهاتف</label>
            <input
              type="text"
              value={branchFormData.phone}
              onChange={(e) => setBranchFormData({ ...branchFormData, phone: e.target.value })}
              placeholder="01112345678"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setBranchDialogOpen(false)}>إلغاء</Button>
            <Button
              type="submit"
              disabled={submittingBranch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              {submittingBranch ? "جاري الحفظ..." : "حفظ الفرع"}
            </Button>
          </div>
        </form>
      </FormDialog>

      {/* Add New User / Engineer Dialog */}
      <FormDialog open={userDialogOpen} onOpenChange={setUserDialogOpen} title="إضافة مهندس / موظف جديد بالنظام">
        <form onSubmit={handleCreateUser} className="space-y-4 py-2">
          <div>
            <label className="block text-xs font-bold mb-1">اسم الموظف / المهندس بالكامل *</label>
            <input
              type="text"
              required
              value={userFormData.name}
              onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
              placeholder="مهندس خالد عبد الرحمن"
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">رقم الهاتف (اسم الدخول) *</label>
              <input
                type="text"
                required
                value={userFormData.phone}
                onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                placeholder="01000000002"
                className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">كلمة المرور *</label>
              <input
                type="password"
                required
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">الدور والصلاحيات *</label>
              <select
                value={userFormData.role}
                onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-bold"
              >
                <option value="ENGINEER">مهندس صيانة (Engineer)</option>
                <option value="RECEPTIONIST">موظف استقبال (Receptionist)</option>
                <option value="ACCOUNTANT">محاسب مالي (Accountant)</option>
                <option value="ADMIN">مدير النظام (Admin)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">نسبة العمولة (%)</label>
              <input
                type="number"
                value={userFormData.commissionRate}
                onChange={(e) => setUserFormData({ ...userFormData, commissionRate: e.target.value })}
                placeholder="15"
                className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">الفرع التابع له</label>
            <select
              value={userFormData.branchId}
              onChange={(e) => setUserFormData({ ...userFormData, branchId: e.target.value })}
              className="w-full p-2.5 text-xs rounded-sm border bg-slate-50 dark:bg-slate-800"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" type="button" onClick={() => setUserDialogOpen(false)}>إلغاء</Button>
            <Button
              type="submit"
              disabled={submittingUser}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              {submittingUser ? "جاري الحفظ..." : "حفظ بيانات الحساب"}
            </Button>
          </div>
        </form>
      </FormDialog>
    </div>
  );
}
