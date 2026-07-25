import { db } from "./index";
import { branches, users } from "./schema";

export async function seedDatabase() {
  console.log("🌱 Initializing Database Structure...");

  try {
    // 1. Seed Main Branch
    await db.insert(branches).values({
      id: "branch-main",
      name: "الفرع الرئيسي",
      code: "BR-01",
      address: "المركز الرئيسي",
      phone: "01000000000",
      isActive: true,
    }).onConflictDoNothing();

    // 2. Seed Admin User
    await db.insert(users).values({
      id: "user-admin",
      branchId: "branch-main",
      name: "مدير النظام الرئيسي",
      phone: "01000000001",
      email: "admin@tproject.com",
      passwordHash: "hashed_admin_pass",
      role: "ADMIN",
      isActive: true,
    }).onConflictDoNothing();

    console.log("✅ Initial System Setup Completed!");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  }
}

seedDatabase();
