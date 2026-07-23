import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { error: "يرجى تقديم رقم الهاتف وكلمة المرور" },
        { status: 400 }
      );
    }

    // Query user by phone
    const userList = await db.select().from(users).where(eq(users.phone, phone)).limit(1);

    if (userList.length === 0) {
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    const user = userList[0];

    // Response with User Profile & Role Info
    return NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        branchId: user.branchId,
      },
      token: `mock_jwt_token_${user.id}_${Date.now()}`,
    });
  } catch (error) {
    console.error("[Auth API Error]", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
