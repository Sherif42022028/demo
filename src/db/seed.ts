import { db } from "./index";
import { branches, users } from "./schema";

export async function seedDatabase() {
  console.log("🌱 Initializing Database Structure & Demo Users...");

  try {
    // 1. Seed Main Branch
    await db.insert(branches).values({
      id: "branch-main",
      name: "الفرع الرئيسي",
      code: "BR-01",
      address: "المركز الرئيسي - وسط البلد",
      phone: "01000000000",
      isActive: true,
    }).onConflictDoNothing();

    // 2. Seed Admin User
    await db.insert(users).values({
      id: "user-admin",
      branchId: "branch-main",
      name: "مدير النظام الرئيسي",
      phone: "01000000001",
      email: "admin@techno.com",
      passwordHash: "123456",
      role: "ADMIN",
      commissionRate: "0",
      isActive: true,
    }).onConflictDoNothing();

    // 3. Seed Demo Engineer User
    await db.insert(users).values({
      id: "user-engineer-1",
      branchId: "branch-main",
      name: "مهندس خالد عبد الرحمن",
      phone: "01000000002",
      email: "khaled@techno.com",
      passwordHash: "123456",
      role: "ENGINEER",
      commissionRate: "15",
      isActive: true,
    }).onConflictDoNothing();

    // 4. Seed Demo Receptionist User
    await db.insert(users).values({
      id: "user-receptionist-1",
      branchId: "branch-main",
      name: "سارة أحمد (استقبال)",
      phone: "01012345678",
      email: "sara@techno.com",
      passwordHash: "123456",
      role: "RECEPTIONIST",
      commissionRate: "0",
      isActive: true,
    }).onConflictDoNothing();

    // 5. Seed Demo Accountant User
    await db.insert(users).values({
      id: "user-accountant-1",
      branchId: "branch-main",
      name: "محمود حسني (محاسب مالي)",
      phone: "01200001122",
      email: "mahmoud@techno.com",
      passwordHash: "123456",
      role: "ACCOUNTANT",
      commissionRate: "0",
      isActive: true,
    }).onConflictDoNothing();

    console.log("✅ Initial System Setup Completed!");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  }
}

seedDatabase();
