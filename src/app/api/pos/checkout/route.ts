import { NextResponse } from "next/server";
import { db } from "@/db";
import { inventory, auditLogs } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// POST /api/pos/checkout (Process POS Sale & Create Automatic Financial Ledger Entry)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, paymentMethod } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "سلة المبيعات فارغة" }, { status: 400 });
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + Number(item.price) * Number(item.qty),
      0
    );

    // 1. Deduct Stock Quantities for each item
    for (const item of items) {
      await db
        .update(inventory)
        .set({
          stockQty: sql`${inventory.stockQty} - ${item.qty}`,
          updatedAt: new Date(),
        })
        .where(eq(inventory.id, item.id));
    }

    // 2. Insert Automatic Financial Journal Entry
    const receiptId = `POS-${Math.floor(1000 + Math.random() * 9000)}`;
    const txId = `tx_pos_${Date.now()}`;

    await db.insert(auditLogs).values({
      id: txId,
      userId: "user-admin",
      action: "مقبوضات",
      entityName: `مبيعات POS (${receiptId})`,
      entityId: receiptId,
      details: {
        amount: totalAmount,
        notes: `بيع عدد ${items.length} أصناف من شاشة الكاشير`,
        account: paymentMethod === "فيزا" ? "البنك الأهلي المصري" : "الخزينة الرئيسية",
        sourceType: "POS_SALE",
        sourceId: receiptId,
        itemsCount: items.length,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم ترحيل الفاتورة وتحديث المخزون والقيود المالية بنجاح",
      receiptId,
      totalAmount,
    });
  } catch (error) {
    console.error("[POS Checkout POST Error]", error);
    return NextResponse.json({ error: "فشل ترحيل الفاتورة" }, { status: 500 });
  }
}
