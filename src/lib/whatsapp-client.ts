import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcodeTerminal from "qrcode-terminal";
import QRCode from "qrcode";

let sock: ReturnType<typeof makeWASocket> | null = null;
let connectionStatus: "DISCONNECTED" | "CONNECTING" | "CONNECTED" = "DISCONNECTED";
let lastQrText: string | null = null;
let lastQrDataUrl: string | null = null;
let isInitializing = false;

export async function initWhatsApp() {
  if (connectionStatus === "CONNECTED" || isInitializing) {
    return;
  }

  isInitializing = true;
  connectionStatus = "CONNECTING";

  try {
    const { state, saveCreds } = await useMultiFileAuthState("whatsapp-auth");
    
    sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        lastQrText = qr;
        try {
          lastQrDataUrl = await QRCode.toDataURL(qr, { width: 250, margin: 2 });
        } catch (e) {
          console.error("Failed to generate QR data URL", e);
        }
        qrcodeTerminal.generate(qr, { small: true });
      }

      if (connection === "open") {
        console.log("[WhatsApp Baileys Engine] Successfully Connected!");
        connectionStatus = "CONNECTED";
        lastQrText = null;
        lastQrDataUrl = null;
        isInitializing = false;
      }

      if (connection === "close") {
        connectionStatus = "DISCONNECTED";
        isInitializing = false;
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        console.log(`[WhatsApp Baileys Engine] Connection closed. Reason: ${statusCode}, Reconnecting: ${shouldReconnect}`);
        
        if (shouldReconnect) {
          setTimeout(() => {
            initWhatsApp();
          }, 3000);
        }
      }
    });
  } catch (err) {
    console.error("[WhatsApp Baileys Initialization Error]", err);
    connectionStatus = "DISCONNECTED";
    isInitializing = false;
  }
}

export function getWhatsAppStatus() {
  return {
    status: connectionStatus,
    qrText: lastQrText,
    qrDataUrl: lastQrDataUrl,
  };
}

export async function sendRealWhatsAppMessage(phone: string, message: string) {
  // Ensure connection is initialized
  if (!sock || connectionStatus !== "CONNECTED") {
    await initWhatsApp();
  }

  if (!sock || connectionStatus !== "CONNECTED") {
    throw new Error("واتساب غير متصل حالياً. يرجى مسح كود QR من صفحة الأتمتة لربط الجهاز.");
  }

  // Format phone number to international WhatsApp JID (Defaulting to Egypt country code 20)
  let cleanedPhone = phone.replace(/\D/g, "");
  if (cleanedPhone.startsWith("0")) {
    cleanedPhone = `2${cleanedPhone}`;
  } else if (!cleanedPhone.startsWith("20") && cleanedPhone.length === 10) {
    cleanedPhone = `20${cleanedPhone}`;
  }

  const jid = `${cleanedPhone}@s.whatsapp.net`;
  const result = await sock.sendMessage(jid, { text: message });
  return { success: true, messageId: result?.key?.id };
}
