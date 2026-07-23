import { db } from "./index";
import { branches, users, customers, inventory, workOrders } from "./schema";

export async function seedDatabase() {
  console.log("🌱 Starting Database Seeding...");

  try {
    // 1. Seed Main Branch
    await db.insert(branches).values({
      id: "branch-main",
      name: "الفرع الرئيسي - القاهرة (وسط البلد)",
      code: "BR-01",
      address: "شارع شريف، القاهرة",
      phone: "01012345678",
      isActive: true,
    }).onConflictDoNothing();

    // 2. Seed Users
    await db.insert(users).values({
      id: "user-admin",
      branchId: "branch-main",
      name: "أحمد الموصلي (مدير النظام)",
      phone: "01000000001",
      email: "admin@tproject.com",
      passwordHash: "hashed_admin_pass",
      role: "ADMIN",
      isActive: true,
    }).onConflictDoNothing();

    await db.insert(users).values({
      id: "user-engineer-1",
      branchId: "branch-main",
      name: "م. أحمد حسام",
      phone: "01000000002",
      email: "engineer1@tproject.com",
      passwordHash: "hashed_eng_pass",
      role: "ENGINEER",
      commissionRate: "15",
      isActive: true,
    }).onConflictDoNothing();

    // 3. Seed Demo Customers
    await db.insert(customers).values({
      id: "cust-demo-1",
      branchId: "branch-main",
      name: "محمد عبد الرحمن",
      phone: "01012345678",
      address: "مدينة نصر - القاهرة",
      creditLimit: "5000",
      currentBalance: "1200",
    }).onConflictDoNothing();

    // 4. Seed Inventory Parts
    await db.insert(inventory).values({
      id: "item-screen-13pro",
      branchId: "branch-main",
      name: "شاشة iPhone 13 Pro OEM Full",
      barcode: "693847291048",
      category: "قطعة غيار",
      buyPrice: "3200",
      sellPrice: "4200",
      stockQty: 8,
      minStockLevel: 3,
    }).onConflictDoNothing();

    console.log("✅ Database Seeding Completed Successfully!");
  } catch (error) {
    console.error("❌ Seeding Error:", error);
  }
}

// Execute if run directly via tsx
seedDatabase();
