import { NextResponse } from "next/server";
import { db } from "@/db";
import { workOrders } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET /api/work-orders (List all maintenance tickets)
export async function GET() {
  try {
    const orders = await db
      .select()
      .from(workOrders)
      .orderBy(desc(workOrders.createdAt))
      .limit(50);

    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("[Work Orders GET Error]", error);
    return NextResponse.json(
      { error: "تعذر جلب أوامر الصيانة من قاعدة البيانات" },
      { status: 500 }
    );
  }
}

// POST /api/work-orders (Create new work order intake ticket)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      branchId,
      customerId,
      createdById,
      deviceModel,
      imei,
      devicePassword,
      reportedFault,
      accessories,
      estimatedCost,
      depositPaid,
    } = body;

    const ticketNumber = `WO-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `wo_${Date.now()}`;

    const newOrder = await db.insert(workOrders).values({
      id,
      ticketNumber,
      branchId: branchId || "branch-main",
      customerId: customerId || "cust-demo",
      createdById: createdById || "user-reception",
      deviceModel,
      imei,
      devicePassword,
      reportedFault,
      accessories,
      estimatedCost: String(estimatedCost || "0"),
      depositPaid: String(depositPaid || "0"),
      status: "NEW",
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketNumber}`,
    }).returning();

    return NextResponse.json({
      success: true,
      message: "تم تسجيل أمر الصيانة وتوليد كود QR بنجاح",
      workOrder: newOrder[0],
    });
  } catch (error) {
    console.error("[Work Orders POST Error]", error);
    return NextResponse.json(
      { error: "تعذر حفظ أمر الصيانة في قاعدة البيانات" },
      { status: 500 }
    );
  }
}
