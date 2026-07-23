import { pgTable, text, timestamp, boolean, integer, numeric, jsonb, pgEnum } from "drizzle-orm/pg-core";

// Role Enum for Granular RBAC
export const userRoleEnum = pgEnum("user_role", [
  "ADMIN",
  "ACCOUNTANT",
  "RECEPTIONIST",
  "ENGINEER",
  "INVENTORY_MANAGER"
]);

// Maintenance Status Enum
export const workOrderStatusEnum = pgEnum("work_order_status", [
  "NEW",                // جديد
  "INSPECTING",         // فحص
  "WAITING_PARTS",      // انتظار قطع غيار
  "IN_REPAIR",          // جاري الإصلاح
  "READY",              // جاهز للتسليم
  "DELIVERED",          // تم التسليم
  "CANCELLED"           // ملغى / غير قابل للإصلاح
]);

// 1. Branches Table (Multi-branch)
export const branches = pgTable("branches", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  address: text("address"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Users Table (RBAC Auth)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  branchId: text("branch_id").references(() => branches.id),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  email: text("email").unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").default("RECEPTIONIST").notNull(),
  commissionRate: numeric("commission_rate").default("0"), // نسبة المهندس/الموظف
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Customer CRM Table
export const customers = pgTable("customers", {
  id: text("id").primaryKey(),
  branchId: text("branch_id").references(() => branches.id),
  name: text("name").notNull(),
  phone: text("phone").notNull().unique(),
  altPhone: text("alt_phone"),
  address: text("address"),
  creditLimit: numeric("credit_limit").default("0"), // حد الائتمان للآجل
  currentBalance: numeric("current_balance").default("0"), // الرصيد الحالي (له/عليه)
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. Work Orders (أوامر الصيانة وتتبع الأجهزة)
export const workOrders = pgTable("work_orders", {
  id: text("id").primaryKey(), // e.g. WO-1001
  ticketNumber: text("ticket_number").notNull().unique(),
  branchId: text("branch_id").references(() => branches.id).notNull(),
  customerId: text("customer_id").references(() => customers.id).notNull(),
  engineerId: text("engineer_id").references(() => users.id),
  createdById: text("created_by_id").references(() => users.id).notNull(),
  
  deviceModel: text("device_model").notNull(),
  imei: text("imei"),
  devicePassword: text("device_password"),
  reportedFault: text("reported_fault").notNull(),
  accessories: text("accessories"), // الملحقات المرفقة
  photos: jsonb("photos").$type<string[]>().default([]), // صور قبل وبعد الصيانة
  
  status: workOrderStatusEnum("status").default("NEW").notNull(),
  estimatedCost: numeric("estimated_cost").default("0"),
  finalCost: numeric("final_cost").default("0"),
  depositPaid: numeric("deposit_paid").default("0"),
  sparePartsCost: numeric("spare_parts_cost").default("0"),
  engineerProfitShare: numeric("engineer_profit_share").default("0"),
  
  qrCodeUrl: text("qr_code_url"),
  notes: text("notes"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 5. Maintenance Inspection Logs (سجل الفحص والورشة)
export const maintenanceLogs = pgTable("maintenance_logs", {
  id: text("id").primaryKey(),
  workOrderId: text("work_order_id").references(() => workOrders.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  previousStatus: workOrderStatusEnum("previous_status"),
  newStatus: workOrderStatusEnum("new_status").notNull(),
  note: text("note"),
  partsUsed: jsonb("parts_used").$type<{ partId: string; name: string; qty: number; price: number }[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 6. Inventory & Spare Parts (المخزن والقطع للإصلاح)
export const inventory = pgTable("inventory", {
  id: text("id").primaryKey(),
  branchId: text("branch_id").references(() => branches.id).notNull(),
  name: text("name").notNull(),
  barcode: text("barcode").unique(),
  category: text("category").notNull(), // spare_part, accessory, device
  buyPrice: numeric("buy_price").notNull(),
  sellPrice: numeric("sell_price").notNull(),
  stockQty: integer("stock_qty").default(0).notNull(),
  minStockLevel: integer("min_stock_level").default(5).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 7. Audit Log (سجل العمليات والأمان)
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  action: text("action").notNull(), // CREATE, UPDATE, DELETE, LOGIN
  entityName: text("entity_name").notNull(), // WORK_ORDER, CUSTOMER, INVENTORY
  entityId: text("entity_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
