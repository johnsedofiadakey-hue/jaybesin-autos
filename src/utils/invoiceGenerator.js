import { fmtUSD } from "./theme";

export function generateInvoiceHTML(order, settings, form) {
  const issueDate = new Date().toLocaleDateString('en-GB', { day: 'prev', month: 'long', year: 'numeric' });
  const dueDate = form.dueDate ? new Date(form.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "-";
  const amount = parseFloat(form.amount || order.amount || 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${form.number}</title>
  <style>
    body { font-family: 'Inter', -apple-system, sans-serif; color: #101828; margin: 0; padding: 40px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; border-bottom: 2px solid #F2F4F7; padding-bottom: 24px; }
    .logo-area { display: flex; align-items: center; gap: 12px; }
    .logo-box { width: 40px; height: 40px; background: #00E564; color: #000; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; }
    .brand-name { font-size: 24px; font-weight: 800; }
    .inv-details { text-align: right; }
    .inv-label { font-size: 12px; color: #667085; text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
    .inv-value { font-size: 14px; font-weight: 600; }
    
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 48px; }
    .billed-to { display: flex; flex-direction: column; gap: 4px; }
    .section-title { font-size: 12px; color: #667085; text-transform: uppercase; font-weight: 700; margin-bottom: 12px; border-bottom: 1px solid #EAECF0; padding-bottom: 8px; }
    
    table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    th { text-align: left; background: #F9FAFB; padding: 12px; font-size: 12px; text-transform: uppercase; color: #667085; border-bottom: 1px solid #EAECF0; }
    td { padding: 16px 12px; border-bottom: 1px solid #EAECF0; font-size: 14px; }
    
    .totals { margin-left: auto; width: 300px; }
    .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .grand-total { border-top: 2px solid #101828; margin-top: 8px; padding-top: 12px; font-size: 18px; font-weight: 800; color: #00E564; }
    
    .bank-details { background: #F9FAFB; border-radius: 12px; padding: 24px; margin-top: 48px; border: 1px solid #EAECF0; }
    .footer { margin-top: 64px; text-align: center; font-size: 11px; color: #667085; border-top: 1px solid #EAECF0; padding-top: 24px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">
      <div class="logo-box">J</div>
      <div class="brand-name">${settings.companyName || 'Jaybesin Autos'}</div>
    </div>
    <div class="inv-details">
      <div class="inv-label">Invoice Number</div>
      <div class="inv-value" style="color: #00E564; font-family: monospace; font-size: 18px;">${form.number}</div>
    </div>
  </div>

  <div class="grid">
    <div class="billed-to">
      <div class="section-title">Billed To</div>
      <div class="inv-value" style="font-size: 16px;">${order?.customer || "-"}</div>
      <div style="font-size: 13px; color: #475467;">${order?.email || ""}</div>
      <div style="font-size: 13px; color: #475467;">${order?.phone || ""}</div>
    </div>
    <div style="text-align: right">
      <div class="section-title">Payment Info</div>
      <div class="inv-label">Issue Date</div>
      <div class="inv-value" style="margin-bottom: 12px;">${issueDate}</div>
      <div class="inv-label">Due Date</div>
      <div class="inv-value" style="color: #D92D20;">${dueDate}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center">Qty</th>
        <th style="text-align: right">Unit Price</th>
        <th style="text-align: right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div style="font-weight: 700;">${order?.item || "Vehicle Import Service"}</div>
          <div style="font-size: 12px; color: #667085; margin-top: 4px;">Service Ref: ${order?.id || "N/A"}</div>
        </td>
        <td style="text-align: center">1</td>
        <td style="text-align: right">${fmtUSD(amount)}</td>
        <td style="text-align: right; font-weight: 700;">${fmtUSD(amount)}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal</span>
      <span>${fmtUSD(amount)}</span>
    </div>
    <div class="total-row grand-total">
      <span>Total (USD)</span>
      <span>${fmtUSD(amount)}</span>
    </div>
    </div>
  </div>

  <div class="bank-details">
    <div class="section-title">Bank Transfer Details</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; font-size: 13px;">
      <div>
        <div class="inv-label">Bank Name</div>
        <div class="inv-value">${settings.bankName || "Jaybesin Corporate Bank"}</div>
      </div>
      <div>
        <div class="inv-label">Account Name</div>
        <div class="inv-value">${settings.accName || "Jaybesin Autos Limited"}</div>
      </div>
      <div>
        <div class="inv-label">Account Number</div>
        <div class="inv-value" style="font-family: monospace; font-size: 15px;">${settings.accNo || "XXXX-XXXX-XXXX-XXXX"}</div>
      </div>
      <div>
        <div class="inv-label">Branch</div>
        <div class="inv-value">${settings.bankBranch || "Main Branch, Accra"}</div>
      </div>
    </div>
    <div style="margin-top: 16px; font-size: 11px; color: #667085; font-style: italic;">
      * Please use Invoice Number <strong>${form.number}</strong> as payment reference.
    </div>
  </div>

  <div class="footer">
    <div style="font-weight: 700; margin-bottom: 4px;">${settings.companyName || 'Jaybesin Autos Limited'}</div>
    <div>${settings.address || 'Accra, Ghana'} · ${settings.phone || ''} · ${settings.email || ''}</div>
    <div style="margin-top: 12px; opacity: 0.6;">This is a computer-generated document. No signature required.</div>
  </div>
</body>
</html>
  `;
}
