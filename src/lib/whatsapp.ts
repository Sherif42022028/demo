import { sendRealWhatsAppMessage } from "./whatsapp-client";

export interface WhatsAppPayload {
  phone: string;
  message: string;
  templateType: "INTAKE" | "REPAIR_READY" | "DEBT_REMINDER" | "RECEIPT";
}

export async function sendWhatsAppNotification(payload: WhatsAppPayload): Promise<{ success: boolean; messageId?: string }> {
  try {
    console.log(`[WhatsApp Real Engine] Dispatching ${payload.templateType} to ${payload.phone}`);
    const result = await sendRealWhatsAppMessage(payload.phone, payload.message);
    return {
      success: true,
      messageId: result.messageId || undefined,
    };
  } catch (error) {
    console.error("[WhatsApp Real Engine Error]", error);
    return { success: false };
  }
}
