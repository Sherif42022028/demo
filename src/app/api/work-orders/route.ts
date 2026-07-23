import { NextResponse } from "next/server";
import { db } from "@/db";
import { workOrders, customers, maintenanceLogs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

// GET /api/work-orders (Fetch live orders with customer details from Neon DB)
export async function GET() {
  try {
    const list = await db
      .select({
        id: workOrders.id,
        ticketNumber: workOrders.ticketNumber,
        deviceModel: workOrders.deviceModel,
        imei: workOrders.imei,
        devicePassword: workOrders.devicePassword,
        reportedFault: workOrders.reportedFault,
        accessories: workOrders.accessories,
        status: workOrders.status,
        estimatedCost: workOrders.estimatedCost,
        finalCost: workOrders.finalCost,
        depositPaid: workOrders.depositPaid,
        qrCodeUrl: workOrders.qrCodeUrl,
        createdAt: workOrders.createdAt,
        customerName: customers.name,
        customerPhone: customers.phone,
      })
      .from(workOrders)
      .leftJoin(customers, eq(workOrders.customerId, customers.id))
      .orderBy(desc(workOrders.createdAt));

    return NextResponse.json({
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("[Work Orders GET Error]", error);
    return NextResponse.json({ error: "تعذر جلب أوامر الصيانة" }, { status: 500 });
  }
}

// POST /api/work-orders (Real Intake Creation & Database Save)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      deviceModel,
      imei,
      devicePassword,
      reportedFault,
      accessories,
      estimatedCost,
      depositPaid,
    } = body;

    if (!customerName || !customerPhone || !deviceModel || !reportedFault) {
      return NextResponse.json({ error: "يرجى تعبئة الحقول الأساسية" }, { status: 400 });
    }

    // 1. Check or create Customer in Neon DB
    let customer = await db
      .select()
      .from(customers)
      .where(eq(customers.phone, customerPhone))
      .limit(1);

    let customerId = "";
    if (customer.length === 0) {
      customerId = `cust_${Date.now()}`;
      await db.insert(customers).values({
        id: customerId,
        branchId: "branch-main",
        name: customerName,
        phone: customerPhone,
      });
    } else {
      customerId = customer[0].id;
    }

    // 2. Insert Work Order Ticket
    const ticketNumber = `WO-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `wo_${Date.now()}`;

    const newTicket = await db
      .insert(workOrders)
      .values({
        id,
        ticketNumber,
        branchId: "branch-main",
        customerId,
        createdById: "user-admin",
        deviceModel,
        imei: imei || null,
        devicePassword: devicePassword || null,
        reportedFault,
        accessories: accessories || "لا يوجد",
        estimatedCost: String(estimatedCost || "0"),
        finalCost: String(estimatedCost || "0"),
        depositPaid: String(depositPaid || "0"),
        status: "NEW",
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketNumber}`,
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "تم حفظ أمر الصيانة حقيقياً في قاعدة البيانات Neon PostgreSQL",
      data: newTicket[0],
    });
  } catch (error) {
    console.error("[Work Orders POST Error]", error);
    return NextResponse.json({ error: "فشل حفظ الفاتورة في قاعدة البيانات" }, { status: 500 });
  }
}

// PUT /api/work-orders (Update Ticket Status Live)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, finalCost } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "معرف الفاتورة والحالة مطلوبان" }, { status: 400 });
    }

    const updated = await db
      .update(workOrders)
      .set({
        status,
        finalCost: finalCost ? String(finalCost) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(workOrders.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "تم تحديث حالة الجهاز حقيقياً",
      data: updated[0],
    });
  } catch (error) {
    console.error("[Work Orders PUT Error]", error);
    return NextResponse.json({ error: "تعذر تحديث حالة الصيانة" }, { status: 500 });
  }
}
