import { NextResponse } from "next/server";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET /api/finance (Fetch real transactions)
export async function GET() {
  try {
    const list = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(50);

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("[Finance GET Error]", error);
    return NextResponse.json({ error: "تعذر جلب المعاملات المالية" }, { status: 500 });
  }
}

// POST /api/finance (Post new real ledger transaction)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, category, amount, account, notes } = body;

    const id = `tx_${Date.now()}`;
    await db.insert(auditLogs).values({
      id,
      userId: "user-admin",
      action: type || "TRANSACTION",
      entityName: category || "FINANCE",
      entityId: account || "الخزينة الرئيسية",
      details: { amount, notes, account },
    });

    return NextResponse.json({
      success: true,
      message: "تم ترحيل القيد المالي حقيقياً لقاعدة البيانات",
    });
  } catch (error) {
    console.error("[Finance POST Error]", error);
    return NextResponse.json({ error: "تعذر ترحيل المعاملة المالية" }, { status: 500 });
  }
}
