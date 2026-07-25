import { db } from "./index";
import { workOrders, auditLogs } from "./schema";
import { eq } from "drizzle-orm";

export async function reconcileFinancialLedger() {
  console.log("🔄 Starting Financial Reconciliation & Ledger Backfill...");

  try {
    const allTickets = await db.select().from(workOrders);
    console.log(`📋 Found ${allTickets.length} Work Orders to inspect.`);

    let reconciledCount = 0;

    for (const ticket of allTickets) {
      // 1. Deposit Check
      const deposit = Number(ticket.depositPaid || 0);
      if (deposit > 0) {
        const existingDepositTx = await db
          .select()
          .from(auditLogs)
          .where(eq(auditLogs.entityId, ticket.id));

        const hasDepositTx = existingDepositTx.some(
          (tx: any) => tx.details?.sourceType === "WORK_ORDER_DEPOSIT"
        );

        if (!hasDepositTx) {
          await db.insert(auditLogs).values({
            id: `tx_dep_rec_${ticket.id}`,
            userId: "user-admin",
            action: "مقبوضات",
            entityName: `عربون صيانة - أمر ${ticket.ticketNumber}`,
            entityId: ticket.id,
            details: {
              amount: deposit,
              notes: `عربون صيانة جهاز ${ticket.deviceModel}`,
              account: "الخزينة الرئيسية",
              sourceType: "WORK_ORDER_DEPOSIT",
              sourceId: ticket.ticketNumber,
            },
          });
          reconciledCount++;
        }
      }

      // 2. Final / Remaining Revenue Check for READY/DELIVERED status
      if (ticket.status === "READY" || ticket.status === "DELIVERED") {
        const total = Number(ticket.finalCost || ticket.estimatedCost || 0);
        const remaining = Math.max(0, total - deposit);

        if (remaining > 0) {
          const existingTxs = await db
            .select()
            .from(auditLogs)
            .where(eq(auditLogs.entityId, ticket.id));

          const hasRevenueTx = existingTxs.some(
            (tx: any) => tx.details?.sourceType === "WORK_ORDER_REVENUE"
          );

          if (!hasRevenueTx) {
            await db.insert(auditLogs).values({
              id: `tx_wo_rec_${ticket.id}`,
              userId: "user-admin",
              action: "مقبوضات",
              entityName: `إيراد صيانة - أمر ${ticket.ticketNumber}`,
              entityId: ticket.id,
              details: {
                amount: remaining,
                notes: `تسوية متبقي صيانة جهاز ${ticket.deviceModel}`,
                account: "الخزينة الرئيسية",
                sourceType: "WORK_ORDER_REVENUE",
                sourceId: ticket.ticketNumber,
              },
            });
            reconciledCount++;
          }
        }
      }
    }

    console.log(`✅ Financial Reconciliation Complete! Backfilled ${reconciledCount} missing journal entries.`);
  } catch (error) {
    console.error("❌ Reconciliation Error:", error);
  }
}

reconcileFinancialLedger();
