import { db } from "./index";
import { branches, users, customers, inventory, workOrders, maintenanceLogs, auditLogs } from "./schema";

export async function resetDatabase() {
  console.log("🧹 Starting Complete Database Reset...");

  try {
    // 1. Delete all dependent child tables
    console.log("🗑️ Clearing Maintenance Logs...");
    await db.delete(maintenanceLogs);

    console.log("🗑️ Clearing Work Orders...");
    await db.delete(workOrders);

    console.log("🗑️ Clearing Inventory Items...");
    await db.delete(inventory);

    console.log("🗑️ Clearing Customers CRM...");
    await db.delete(customers);

    console.log("🗑️ Clearing Financial Audit Logs...");
    await db.delete(auditLogs);

    console.log("🗑️ Clearing Users...");
    await db.delete(users);

    console.log("🗑️ Clearing Branches...");
    await db.delete(branches);

    // 2. Insert ONLY Default Branch & Default Admin User for system login
    console.log("✨ Seeding Initial Default Main Branch & System Admin User...");

    await db.insert(branches).values({
      id: "branch-main",
      name: "الفرع الرئيسي",
      code: "BR-01",
      address: "المركز الرئيسي",
      phone: "01000000000",
      isActive: true,
    });

    await db.insert(users).values({
      id: "user-admin",
      branchId: "branch-main",
      name: "مدير النظام الرئيسي",
      phone: "01000000001",
      email: "admin@tproject.com",
      passwordHash: "hashed_admin_pass",
      role: "ADMIN",
      isActive: true,
    });

    console.log("✅ Database Reset Complete! 0 Work Orders, 0 Customers, 0 Inventory, 0 Finance Logs.");
    console.log("👤 Ready for client testing with Admin User: Phone 01000000001 / Password: 123456");
  } catch (error) {
    console.error("❌ Reset Error:", error);
  }
}

resetDatabase();
