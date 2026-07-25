import { NextResponse } from "next/server";
import { db } from "@/db";
import { orgSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/settings - Fetch singleton org settings row or create default if not exists
export async function GET() {
  try {
    let row = await db.select().from(orgSettings).where(eq(orgSettings.id, "singleton")).limit(1);
    if (row.length === 0) {
      row = await db.insert(orgSettings).values({ id: "singleton" }).returning();
    }
    return NextResponse.json({ success: true, data: row[0] });
  } catch (error) {
    console.error("[Settings GET Error]", error);
    return NextResponse.json({ error: "تعذر جلب الإعدادات" }, { status: 500 });
  }
}

// PUT /api/settings - Update singleton org settings row
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    delete body.id; // Prevent modifying id
    delete body.whatsappApiKey; // Never save sensitive API key through this API route

    let existing = await db.select().from(orgSettings).where(eq(orgSettings.id, "singleton")).limit(1);
    let updated;

    if (existing.length === 0) {
      updated = await db
        .insert(orgSettings)
        .values({ id: "singleton", ...body, updatedAt: new Date() })
        .returning();
    } else {
      updated = await db
        .update(orgSettings)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(orgSettings.id, "singleton"))
        .returning();
    }

    return NextResponse.json({
      success: true,
      message: "تم حفظ الإعدادات بنجاح في قاعدة البيانات",
      data: updated[0],
    });
  } catch (error) {
    console.error("[Settings PUT Error]", error);
    return NextResponse.json({ error: "تعذر حفظ الإعدادات" }, { status: 500 });
  }
}
