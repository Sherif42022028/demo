import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET /api/customers (List customers)
export async function GET() {
  try {
    const list = await db.select().from(customers).orderBy(desc(customers.createdAt));

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("[Customers GET Error]", error);
    return NextResponse.json({ error: "تعذر جلب العملاء" }, { status: 500 });
  }
}

// POST /api/customers (Add customer)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, altPhone, address, creditLimit, notes, branchId } = body;

    const id = `cust_${Date.now()}`;
    const newCustomer = await db
      .insert(customers)
      .values({
        id,
        branchId: branchId || "branch-main",
        name,
        phone,
        altPhone,
        address,
        creditLimit: String(creditLimit || "0"),
        notes,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "تم تسجيل العميل بنجاح",
      customer: newCustomer[0],
    });
  } catch (error) {
    console.error("[Customers POST Error]", error);
    return NextResponse.json({ error: "تعذر تسجيل العميل" }, { status: 500 });
  }
}
