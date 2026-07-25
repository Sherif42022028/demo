import { NextResponse } from "next/server";
import { db } from "@/db";
import { branches } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET /api/branches (List all branches)
export async function GET() {
  try {
    const list = await db.select().from(branches).orderBy(desc(branches.createdAt));
    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("[Branches GET Error]", error);
    return NextResponse.json({ error: "تعذر جلب الفروع" }, { status: 500 });
  }
}

// POST /api/branches (Add new branch)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code, address, phone } = body;

    if (!name || !code) {
      return NextResponse.json({ error: "يرجى تقديم اسم الفرع وكود الفرع" }, { status: 400 });
    }

    const id = `branch_${Date.now()}`;
    const newBranch = await db
      .insert(branches)
      .values({
        id,
        name,
        code,
        address: address || "",
        phone: phone || "",
        isActive: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الفرع بنجاح",
      branch: newBranch[0],
    });
  } catch (error) {
    console.error("[Branches POST Error]", error);
    return NextResponse.json({ error: "تعذر إنشاء الفرع" }, { status: 500 });
  }
}
