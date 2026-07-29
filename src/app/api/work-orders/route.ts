import { NextResponse } from "next/server";
import { db } from "@/db";
import { workOrders, customers, auditLogs } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import QRCode from "qrcode";
import { encryptDevicePassword, decryptDevicePassword } from "@/lib/encryption";

// GET /api/work-orders (Fetch live orders with customer details & optional pagination)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const page = pageParam ? parseInt(pageParam, 10) : null;
    const limit = limitParam ? parseInt(limitParam, 10) : null;

    let baseQuery = db
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
        deliveredAt: workOrders.deliveredAt,
        createdAt: workOrders.createdAt,
        customerName: customers.name,
        customerPhone: customers.phone,
      })
      .from(workOrders)
      .leftJoin(customers, eq(workOrders.customerId, customers.id))
      .orderBy(desc(workOrders.createdAt));

    let list;
    if (page && limit && page > 0 && limit > 0) {
      const offset = (page - 1) * limit;
      list = await baseQuery.limit(limit).offset(offset);
    } else {
      list = await baseQuery;
    }

    const decryptedList = list.map((item) => ({
      ...item,
      devicePassword: decryptDevicePassword(item.devicePassword),
    }));

    return NextResponse.json({
      success: true,
      data: decryptedList,
      ...(page && limit ? { pagination: { page, limit } } : {}),
    });
  } catch (error) {
    console.error("[Work Orders GET Error]", error);
    return NextResponse.json({ error: "تعذر جلب أوامر الصيانة" }, { status: 500 });
  }
}

// POST /api/work-orders (Creation with automatic deposit ledger entry)
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

    // 1. Check or create Customer
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

    // Generate Local Offline QR Code Data URI (Base64)
    const qrCodeUrl = await QRCode.toDataURL(ticketNumber, { width: 150, margin: 1 });

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
        devicePassword: encryptDevicePassword(devicePassword),
        reportedFault,
        accessories: accessories || "لا يوجد",
        estimatedCost: String(estimatedCost || "0"),
        finalCost: String(estimatedCost || "0"),
        depositPaid: String(depositPaid || "0"),
        status: "NEW",
        qrCodeUrl,
      })
      .returning();

    // 3. Automatic Journal Entry for Deposit Paid
    const depVal = Number(depositPaid || 0);
    if (depVal > 0) {
      await db.insert(auditLogs).values({
        id: `tx_dep_${Date.now()}`,
        userId: "user-admin",
        action: "مقبوضات",
        entityName: `عربون صيانة - أمر ${ticketNumber}`,
        entityId: id,
        details: {
          amount: depVal,
          notes: `عربون استلام جهاز ${deviceModel} للعميل ${customerName}`,
          account: "الخزينة الرئيسية",
          sourceType: "WORK_ORDER_DEPOSIT",
          sourceId: ticketNumber,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "تم حفظ أمر الصيانة بنجاح في النظام",
      data: newTicket[0],
    });
  } catch (error) {
    console.error("[Work Orders POST Error]", error);
    return NextResponse.json({ error: "فشل حفظ الفاتورة في قاعدة البيانات" }, { status: 500 });
  }
}

// PUT /api/work-orders (Update Ticket Status with Automatic Financial Ledger Entry)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, finalCost } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "معرف الفاتورة والحالة مطلوبان" }, { status: 400 });
    }

    // Fetch existing ticket before update
    const existing = await db
      .select()
      .from(workOrders)
      .where(eq(workOrders.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: "أمر الصيانة غير موجود" }, { status: 404 });
    }

    const ticket = existing[0];
    const prevStatus = ticket.status;

    const updated = await db
      .update(workOrders)
      .set({
        status,
        finalCost: finalCost ? String(finalCost) : ticket.finalCost,
        deliveredAt: status === "DELIVERED" ? (ticket.deliveredAt || new Date()) : ticket.deliveredAt,
        updatedAt: new Date(),
      })
      .where(eq(workOrders.id, id))
      .returning();

    // Automatically post financial journal entry when ticket becomes READY or DELIVERED
    if ((status === "READY" || status === "DELIVERED") && prevStatus !== "READY" && prevStatus !== "DELIVERED") {
      const totalCost = Number(finalCost || ticket.finalCost || ticket.estimatedCost || 0);
      const deposit = Number(ticket.depositPaid || 0);
      const remainingCost = Math.max(0, totalCost - deposit);

      if (remainingCost > 0) {
        await db.insert(auditLogs).values({
          id: `tx_wo_${Date.now()}`,
          userId: "user-admin",
          action: "مقبوضات",
          entityName: `إيراد صيانة - أمر ${ticket.ticketNumber}`,
          entityId: id,
          details: {
            amount: remainingCost,
            notes: `تحصيل متبقي تكلفة صيانة جهاز ${ticket.deviceModel}`,
            account: "الخزينة الرئيسية",
            sourceType: "WORK_ORDER_REVENUE",
            sourceId: ticket.ticketNumber,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث حالة الجهاز بنجاح وتم ترحيل القيد المالي",
      data: updated[0],
    });
  } catch (error) {
    console.error("[Work Orders PUT Error]", error);
    return NextResponse.json({ error: "تعذر تحديث حالة الصيانة" }, { status: 500 });
  }
}
