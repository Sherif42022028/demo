import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";

function getEncryptionKey(): Buffer {
  const envKey = process.env.DEVICE_PASSWORD_KEY;
  if (envKey && envKey.length === 64) {
    return Buffer.from(envKey, "hex");
  }
  // Derive a 32-byte key deterministically if DEVICE_PASSWORD_KEY is a plain string or unset
  return crypto.createHash("sha256").update(envKey || "tproject_device_password_secure_key_2026").digest();
}

/**
 * Encrypts plain text device password using AES-256-CBC.
 * Returns cipher text string formatted as "iv_hex:encrypted_hex".
 */
export function encryptDevicePassword(plainText: string | null | undefined): string | null {
  if (!plainText || !plainText.trim()) return null;
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
  } catch (error) {
    console.error("[Encryption Error]", error);
    return plainText;
  }
}

/**
 * Decrypts AES-256-CBC encrypted device password.
 * If the input is plain text (not in "iv:data" format) or decryption fails, returns stored text.
 */
export function decryptDevicePassword(storedText: string | null | undefined): string | null {
  if (!storedText || !storedText.trim()) return null;

  // Check if string matches iv:data format (both hex)
  const parts = storedText.split(":");
  if (parts.length !== 2 || parts[0].length !== 32) {
    // Legacy plain text password or unencrypted format
    return storedText;
  }

  try {
    const key = getEncryptionKey();
    const iv = Buffer.from(parts[0], "hex");
    const encryptedText = Buffer.from(parts[1], "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("[Decryption Error]", error);
    return storedText;
  }
}
