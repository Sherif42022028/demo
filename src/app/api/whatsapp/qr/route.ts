import { NextResponse } from "next/server";
import { getWhatsAppStatus } from "@/lib/whatsapp-client";

export async function GET() {
  try {
    const { qrDataUrl, status } = getWhatsAppStatus();

    if (status === "CONNECTED") {
      return NextResponse.json({
        success: true,
        connected: true,
        message: "حساب الواتساب متصل بالفعل",
      });
    }

    if (!qrDataUrl) {
      return NextResponse.json({
        success: false,
        message: "جاري تجهيز كود QR من خادم الواتساب، انتظر لحظة...",
      });
    }

    return NextResponse.json({
      success: true,
      qrDataUrl,
    });
  } catch (error) {
    console.error("[WhatsApp QR API Error]", error);
    return NextResponse.json({ error: "تعذر توليد كود الـ QR" }, { status: 500 });
  }
}
