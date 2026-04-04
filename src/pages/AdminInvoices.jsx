import React from "react";
import { FileText, Plus, Search, Printer, Download, User, Ship, Package, DollarSign } from "lucide-react";
import { AdminHeader } from "../components/admin/AdminHeader";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { fmtUSD } from "../utils/theme";

export function AdminInvoices({ 
  orders = [], 
  onGenerateInvoice, 
  onOpenInvoice, 
  onLogout, 
  settings = {} 
}) {
  const invoiceNoFor = (o, i) => o.invoice?.number || `INV-${new Date().getFullYear()}-${1000 + i}`;

  return (
    <div className="adm-wrap">
      <AdminSidebar onLogout={onLogout} settings={settings} />
      
      <main className="adm-main">
        <AdminHeader 
          title="Invoices & Documents" 
          icon={FileText} 
          onAction={() => onGenerateInvoice(null)}
          actionLabel="Create Global Invoice"
        />

        <div style={{ display: "flex", gap: "10px", marginBottom: "24px", flexWrap: "wrap" }}>
          {["Commercial Invoice", "Pro-Forma", "Customs Declaration", "Bill of Lading"].map(d => (
            <button 
              key={d} 
              className="btn-sm btn-sm-ghost" 
              onClick={() => onGenerateInvoice(null, d)}
            >
              <Plus size={12} /> {d}
            </button>
          ))}
        </div>

        <div className="adm-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => { 
                  const no = invoiceNoFor(o, i); 
                  return (
                    <tr key={o.id}>
                      <td style={{ color: "var(--neon)", fontFamily: "monospace", fontWeight: 700 }}>{no}</td>
                      <td style={{ fontSize: "11px", color: "var(--text3)" }}>{o.id}</td>
                      <td style={{ color: "var(--text)", fontWeight: 600 }}>{o.customer}</td>
                      <td style={{ color: "var(--neon2)", fontWeight: 800 }}>{fmtUSD(o.invoice?.amount ?? o.amount)}</td>
                      <td>{o.invoice?.dueDate || "-"}</td>
                      <td style={{ display: "flex", gap: "8px" }}>
                        {o.invoice ? (
                          <>
                            <button className="btn-sm btn-sm-neon" onClick={() => onOpenInvoice(o, i, false)}>View</button>
                            <button className="btn-sm btn-sm-ghost" onClick={() => onOpenInvoice(o, i, true)}><Printer size={12} /></button>
                          </>
                        ) : (
                          <button className="btn-sm btn-sm-ghost" onClick={() => onGenerateInvoice(o.id)}>Generate</button>
                        )}
                      </td>
                    </tr>
                  ); 
                })}
              </tbody>
            </table>
          </div>
          
          {orders.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px", opacity: 0.5 }}>
              No orders found to generate invoices.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
