import { NextResponse } from "next/server";
import { getWhatsAppStatus, initWhatsApp } from "@/lib/whatsapp-client";

export async function GET() {
  try {
    const statusInfo = getWhatsAppStatus();

    // Trigger connection/QR generation if disconnected
    if (statusInfo.status === "DISCONNECTED") {
      initWhatsApp();
    }

    return NextResponse.json({
      success: true,
      data: getWhatsAppStatus(),
    });
  } catch (error) {
    console.error("[WhatsApp Status API Error]", error);
    return NextResponse.json({ error: "تعذر جلب حالة الواتساب" }, { status: 500 });
  }
}
