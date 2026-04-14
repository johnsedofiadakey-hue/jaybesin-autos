import React from "react";
import { 
  FileText, Plus, Search, Printer, Download, User, 
  Ship, Package, DollarSign, ArrowRight, FilePlus2,
  Hash, ClipboardCheck
} from "lucide-react";
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
          title="Document & Invoice Manifest" 
          icon={FileText} 
        />

        {/* Global Action Strip */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {["Commercial Invoice", "Pro-Forma", "Customs Declaration", "Bill of Lading"].map(d => (
            <button 
              key={d} 
              className="btn-p" 
              style={{ padding: '10px 18px', fontSize: '12px', height: '44px' }}
              onClick={() => onGenerateInvoice(null, d)}
            >
              <FilePlus2 size={16} /> {d}
            </button>
          ))}
        </div>

        <div className="adm-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="section-label" style={{ padding: '24px 24px 0' }}>Manifest Registry</div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Identity Token</th>
                  <th>Order Reference</th>
                  <th>Consignee</th>
                  <th>Valuation</th>
                  <th>Status / Due</th>
                  <th style={{ textAlign: 'right' }}>Execution</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => { 
                  const no = invoiceNoFor(o, i); 
                  const hasInvoice = !!o.invoice;
                  return (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 800, color: 'var(--text)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Hash size={14} style={{ opacity: 0.3 }} /> {no}
                        </div>
                      </td>
                      <td style={{ fontSize: '11px', fontWeight: 600, opacity: 0.5 }}>{o.id}</td>
                      <td style={{ fontWeight: 700 }}>{o.customer}</td>
                      <td style={{ fontWeight: 800, color: 'var(--accent)' }}>{fmtUSD(o.invoice?.amount ?? o.amount)}</td>
                      <td>
                        <span style={{ 
                          fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                          padding: '4px 8px', borderRadius: '4px',
                          background: hasInvoice ? 'rgba(255,255,255,0.05)' : 'transparent',
                          border: `1px solid ${hasInvoice ? 'var(--border)' : 'transparent'}`,
                          color: hasInvoice ? 'var(--text)' : 'var(--text-dim)'
                        }}>
                          {o.invoice?.dueDate || "UNSET"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {hasInvoice ? (
                            <>
                              <button className="btn-p" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => onOpenInvoice(o, i, false)}>View Dossier</button>
                              <button className="btn-sm-ghost" style={{ padding: '6px 10px' }} onClick={() => onOpenInvoice(o, i, true)}><Printer size={14} /></button>
                            </>
                          ) : (
                            <button className="btn-sm-ghost" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => onGenerateInvoice(o.id)}>
                              Generate Protocol
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ); 
                })}
              </tbody>
            </table>
          </div>
          
          {orders.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 40px", background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ opacity: 0.1, marginBottom: '16px' }}><ClipboardCheck size={48} /></div>
              <div style={{ fontSize: "14px", color: "var(--text-dim)", fontWeight: 600 }}>Zero Transactional Data</div>
              <p style={{ opacity: 0.4, fontSize: '12px', marginTop: '4px' }}>Invoices will populate as orders are logged into the system.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
