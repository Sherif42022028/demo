import { NextResponse } from "next/server";
import { db } from "@/db";
import { inventory } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET /api/inventory (List stock items)
export async function GET() {
  try {
    const items = await db
      .select()
      .from(inventory)
      .orderBy(desc(inventory.createdAt));

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("[Inventory GET Error]", error);
    return NextResponse.json(
      { error: "تعذر جلب أصناف المخزون" },
      { status: 500 }
    );
  }
}

// POST /api/inventory (Add new item or spare part)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, barcode, category, buyPrice, sellPrice, stockQty, minStockLevel, branchId } = body;

    const id = `item_${Date.now()}`;
    const newItem = await db.insert(inventory).values({
      id,
      branchId: branchId || "branch-main",
      name,
      barcode: barcode || `${Date.now()}`,
      category: category || "قطع غيار",
      buyPrice: String(buyPrice || "0"),
      sellPrice: String(sellPrice || "0"),
      stockQty: Number(stockQty || 0),
      minStockLevel: Number(minStockLevel || 5),
    }).returning();

    return NextResponse.json({
      success: true,
      message: "تم إضافة الصنف للمخزن بنجاح",
      item: newItem[0],
    });
  } catch (error) {
    console.error("[Inventory POST Error]", error);
    return NextResponse.json(
      { error: "تعذر إضافة الصنف لقاعدة البيانات" },
      { status: 500 }
    );
  }
}
