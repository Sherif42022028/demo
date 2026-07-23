// Neon Data API REST Client Helper
const NEON_DATA_API_BASE = process.env.NEON_DATA_API_URL || "https://ep-icy-dream-axnybwns.apirest.c-4.us-east-2.aws.neon.tech/neondb/rest/v1";

export async function fetchNeonRestEndpoint(table: string) {
  try {
    const response = await fetch(`${NEON_DATA_API_BASE}/${table}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Neon Data API Error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[Neon Data API Client Error - ${table}]`, error);
    return null;
  }
}
