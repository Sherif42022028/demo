export interface ThermalReceiptData {
  ticketNumber?: string;
  customerName?: string;
  phone?: string;
  deviceModel?: string;
  imei?: string;
  fault?: string;
  estimatedCost?: string | number;
  deposit?: string | number;
  finalCost?: string | number;
  status?: string;
  storeName?: string;
  receiptFooter?: string;
  qrCodeUrl?: string;
}

export function printThermalReceipt(data: ThermalReceiptData) {
  const storeName = data.storeName || "مركز تكنو صيانة للأجهزة الذكية";
  const receiptFooter =
    data.receiptFooter || "شكراً لثقتكم بنا! الأجهزة تقع تحت الضمان لمدة 30 يومًا من تاريخ الاستلام.";
  const remaining = Math.max(
    0,
    Number(data.finalCost || data.estimatedCost || 0) - Number(data.deposit || 0)
  );

  const receiptHtml = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <title>إيصال ${data.ticketNumber || ""}</title>
      <style>
        @page { size: 80mm auto; margin: 0; }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 80mm;
          margin: 0;
          padding: 8px;
          color: #000;
          font-size: 12px;
          background: #fff;
        }
        .center { text-align: center; }
        .dashed { border-top: 1px dashed #000; margin: 6px 0; padding-top: 6px; }
        .row { display: flex; justify-content: space-between; }
        .bold { font-weight: bold; }
        img { display: block; margin: 8px auto; width: 80px; height: 80px; }
      </style>
    </head>
    <body>
      <div class="center">
        <div class="bold" style="font-size:14px;">${storeName}</div>
        <div>الفرع الرئيسي - القاهرة</div>
        <div>${new Date().toLocaleString("ar-EG")}</div>
      </div>
      <div class="dashed">
        ${data.ticketNumber ? `<div>رقم الفاتورة: ${data.ticketNumber}</div>` : ""}
        <div>العميل: ${data.customerName || "—"}</div>
        <div>الهاتف: ${data.phone || "—"}</div>
        <div>الجهاز: ${data.deviceModel || "—"}</div>
        ${data.imei ? `<div>IMEI: ${data.imei}</div>` : ""}
        <div>العطل: ${data.fault || "—"}</div>
      </div>
      <div class="dashed">
        <div class="row"><span>التكلفة التقديرية</span><span>${Number(data.estimatedCost || 0).toLocaleString("en-US")} ج.م</span></div>
        <div class="row"><span>عربون مدفوع</span><span>${Number(data.deposit || 0).toLocaleString("en-US")} ج.م</span></div>
        <div class="row bold"><span>المتبقي عند الاستلام</span><span>${remaining.toLocaleString("en-US")} ج.م</span></div>
      </div>
      ${data.qrCodeUrl ? `<img src="${data.qrCodeUrl}" />` : ""}
      <div class="center dashed" style="font-size:10px;">
        ${receiptFooter}
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=350,height=600");
  if (!printWindow) {
    alert("يرجى السماح بالنوافذ المنبثقة (Popups) لطباعة الإيصال");
    return;
  }
  printWindow.document.write(receiptHtml);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
