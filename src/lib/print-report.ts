export interface ReportPrintData {
  storeName?: string;
  fromDate?: string;
  toDate?: string;
  totalMaintenanceRevenue: number;
  totalFinanceIncome: number;
  totalFinanceExpense: number;
  netProfit: number;
  inventoryCount: number;
  statusBreakdown?: { status: string; count: number; revenue: number }[];
}

export function printReportDocument(data: ReportPrintData) {
  const storeName = data.storeName || "مركز تكنو صيانة للأجهزة الذكية";
  const dateStr = new Date().toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const periodText =
    data.fromDate || data.toDate
      ? `الفترة: من ${data.fromDate || "البداية"} إلى ${data.toDate || "تاريخه"}`
      : "جميع الفترات المالية حتى تاريخه";

  const statusRowsHtml = (data.statusBreakdown || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.status}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.count.toLocaleString("en-US")}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: left; font-family: monospace; font-weight: bold;">${item.revenue.toLocaleString("en-US")} ج.م</td>
      </tr>
    `
    )
    .join("");

  const reportHtml = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <title>تقرير الأرباح والخسائر - ${storeName}</title>
      <style>
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 20px;
          background: #fff;
          font-size: 13px;
          line-height: 1.5;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #10b981;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }
        .header h1 {
          font-size: 18px;
          margin: 0;
          color: #0f172a;
        }
        .header p {
          font-size: 11px;
          color: #64748b;
          margin: 2px 0 0 0;
        }
        .meta-info {
          display: flex;
          justify-content: space-between;
          background: #f8fafc;
          padding: 10px 15px;
          border-radius: 4px;
          font-size: 11px;
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .metric-box {
          border: 1px solid #cbd5e1;
          padding: 12px;
          border-radius: 4px;
          background: #f8fafc;
        }
        .metric-title {
          font-size: 11px;
          color: #64748b;
          margin-bottom: 4px;
        }
        .metric-value {
          font-size: 16px;
          font-weight: bold;
          color: #0f172a;
          font-family: monospace;
        }
        .metric-value.profit {
          color: #059669;
        }
        .section-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #0f172a;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 4px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
        }
        th {
          background: #f1f5f9;
          text-align: right;
          padding: 8px;
          font-size: 11px;
          font-weight: bold;
          color: #475569;
          border-bottom: 2px solid #cbd5e1;
        }
        .summary-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        .net-profit-row {
          background: #ecfdf5;
          font-weight: bold;
          font-size: 14px;
        }
        .net-profit-row td {
          border-top: 2px solid #10b981;
          border-bottom: 2px solid #10b981;
          color: #047857;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 10px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>${storeName}</h1>
          <p>تقرير الأرباح والخسائر والتحليلات الهيكلية الرسمية</p>
        </div>
        <div style="text-align: left;">
          <span style="background:#ecfdf5; color:#047857; padding:4px 8px; border-radius:4px; font-weight:bold; font-size:11px;">تقرير رسمي معتمد</span>
        </div>
      </div>

      <div class="meta-info">
        <span><strong>تاريخ الطباعة:</strong> ${dateStr}</span>
        <span><strong>نطاق التقرير:</strong> ${periodText}</span>
      </div>

      <div class="metrics-grid">
        <div class="metric-box">
          <div class="metric-title">صافي الأرباح النهائي</div>
          <div class="metric-value profit">${data.netProfit >= 0 ? `+ ${data.netProfit.toLocaleString("en-US")} ج.م` : `- ${Math.abs(data.netProfit).toLocaleString("en-US")} ج.م`}</div>
        </div>
        <div class="metric-box">
          <div class="metric-title">إجمالي إيراد الصيانة</div>
          <div class="metric-value">${data.totalMaintenanceRevenue.toLocaleString("en-US")} ج.م</div>
        </div>
        <div class="metric-box">
          <div class="metric-title">أصناف المخزون</div>
          <div class="metric-value">${data.inventoryCount.toLocaleString("en-US")} أصناف</div>
        </div>
      </div>

      <div class="section-title">بيان الأرباح والخسائر الفعلي (Profit & Loss Breakdown)</div>
      <table class="summary-table">
        <thead>
          <tr>
            <th>البيان المالي</th>
            <th style="text-align: left;">القيمة (ج.م)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>إجمالي إيراد أوامر الصيانة (Maintenance Revenue)</td>
            <td style="text-align: left; font-family: monospace; font-weight: bold; color: #059669;">+ ${data.totalMaintenanceRevenue.toLocaleString("en-US")} ج.م</td>
          </tr>
          <tr>
            <td>إجمالي مقبوضات الدفتر المالي والخزينة (Financial Receipts)</td>
            <td style="text-align: left; font-family: monospace; font-weight: bold; color: #059669;">+ ${data.totalFinanceIncome.toLocaleString("en-US")} ج.م</td>
          </tr>
          <tr>
            <td>خصم: المصروفات والرواتب التشغيلية (Operating Expenses)</td>
            <td style="text-align: left; font-family: monospace; font-weight: bold; color: #e11d48;">- ${data.totalFinanceExpense.toLocaleString("en-US")} ج.م</td>
          </tr>
          <tr class="net-profit-row">
            <td>صافي الربح النهائي (Net Profit)</td>
            <td style="text-align: left; font-family: monospace;">${data.netProfit >= 0 ? `+ ${data.netProfit.toLocaleString("en-US")} ج.م` : `- ${Math.abs(data.netProfit).toLocaleString("en-US")} ج.م`}</td>
          </tr>
        </tbody>
      </table>

      ${
        data.statusBreakdown && data.statusBreakdown.length > 0
          ? `
        <div class="section-title">توزيع إيرادات الصيانة حسب حالات الأجهزة</div>
        <table>
          <thead>
            <tr>
              <th>الحالة الحالية</th>
              <th style="text-align: center;">عدد الأجهزة</th>
              <th style="text-align: left;">إجمالي قيمة الإيراد</th>
            </tr>
          </thead>
          <tbody>
            ${statusRowsHtml}
          </tbody>
        </table>
      `
          : ""
      }

      <div class="footer">
        تم استخراج هذا التقرير آلياً من نظام إدارة الصيانة والـ POS — ${storeName}
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=850,height=1100");
  if (!printWindow) {
    alert("يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة وتصدير التقرير كـ PDF");
    return;
  }
  printWindow.document.write(reportHtml);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
