import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, branches } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET /api/users (List all users with branch details & auto-seed demo users if empty)
export async function GET() {
  try {
    let list = await db
      .select({
        id: users.id,
        name: users.name,
        phone: users.phone,
        email: users.email,
        role: users.role,
        commissionRate: users.commissionRate,
        isActive: users.isActive,
        createdAt: users.createdAt,
        branchId: users.branchId,
        branchName: branches.name,
        branchCode: branches.code,
      })
      .from(users)
      .leftJoin(branches, eq(users.branchId, branches.id))
      .orderBy(desc(users.createdAt));

    // Auto seed demo users if list is empty or missing engineers
    if (list.length <= 1) {
      await db.insert(branches).values({
        id: "branch-main",
        name: "الفرع الرئيسي",
        code: "BR-01",
        address: "المركز الرئيسي - وسط البلد",
        phone: "01000000000",
        isActive: true,
      }).onConflictDoNothing();

      await db.insert(users).values([
        {
          id: "user-admin",
          branchId: "branch-main",
          name: "مدير النظام الرئيسي",
          phone: "01000000001",
          email: "admin@techno.com",
          passwordHash: "123456",
          role: "ADMIN",
          commissionRate: "0",
          isActive: true,
        },
        {
          id: "user-engineer-1",
          branchId: "branch-main",
          name: "مهندس خالد عبد الرحمن",
          phone: "01000000002",
          email: "khaled@techno.com",
          passwordHash: "123456",
          role: "ENGINEER",
          commissionRate: "15",
          isActive: true,
        },
        {
          id: "user-receptionist-1",
          branchId: "branch-main",
          name: "سارة أحمد (استقبال)",
          phone: "01012345678",
          email: "sara@techno.com",
          passwordHash: "123456",
          role: "RECEPTIONIST",
          commissionRate: "0",
          isActive: true,
        },
        {
          id: "user-accountant-1",
          branchId: "branch-main",
          name: "محمود حسني (محاسب مالي)",
          phone: "01200001122",
          email: "mahmoud@techno.com",
          passwordHash: "123456",
          role: "ACCOUNTANT",
          commissionRate: "0",
          isActive: true,
        },
      ]).onConflictDoNothing();

      list = await db
        .select({
          id: users.id,
          name: users.name,
          phone: users.phone,
          email: users.email,
          role: users.role,
          commissionRate: users.commissionRate,
          isActive: users.isActive,
          createdAt: users.createdAt,
          branchId: users.branchId,
          branchName: branches.name,
          branchCode: branches.code,
        })
        .from(users)
        .leftJoin(branches, eq(users.branchId, branches.id))
        .orderBy(desc(users.createdAt));
    }

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("[Users GET Error]", error);
    return NextResponse.json({ error: "تعذر جلب قائمة المستخدمين والمهندسين" }, { status: 500 });
  }
}

// POST /api/users (Create a new user or engineer)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, password, role, branchId, commissionRate, email } = body;

    if (!name || !phone || !role) {
      return NextResponse.json({ error: "يرجى تعبئة الحقول الأساسية (الاسم، الهاتف، والدور)" }, { status: 400 });
    }

    // Check if phone already exists
    const existing = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "رقم الهاتف مسجل بالفعل لمستخدم آخر" }, { status: 400 });
    }

    const id = `usr_${Date.now()}`;
    const newUser = await db
      .insert(users)
      .values({
        id,
        branchId: branchId || "branch-main",
        name,
        phone,
        email: email || null,
        passwordHash: password || "123456",
        role: role || "ENGINEER",
        commissionRate: String(commissionRate || "0"),
        isActive: true,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "تم حفظ المستخدم/المهندس بنجاح بالنظام",
      user: newUser[0],
    });
  } catch (error) {
    console.error("[Users POST Error]", error);
    return NextResponse.json({ error: "تعذر تسجيل المستخدم بجدول البيانات" }, { status: 500 });
  }
}

// PUT /api/users (Toggle active status or update user details)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, isActive, commissionRate, role, branchId } = body;

    if (!id) {
      return NextResponse.json({ error: "معرف المستخدم مطلوب" }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isActive === "boolean") updateData.isActive = isActive;
    if (commissionRate !== undefined) updateData.commissionRate = String(commissionRate);
    if (role) updateData.role = role;
    if (branchId) updateData.branchId = branchId;

    const updated = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "تم تحديث بيانات المستخدم/المهندس بنجاح",
      user: updated[0],
    });
  } catch (error) {
    console.error("[Users PUT Error]", error);
    return NextResponse.json({ error: "تعذر تحديث حالة المستخدم" }, { status: 500 });
  }
}
