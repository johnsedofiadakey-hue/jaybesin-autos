import React, { useState } from "react";
import { X, Save, Upload, Trash2, Car, Zap, Wrench } from "lucide-react";
import { ImgUp } from "../common/ImgUp";
import { Tgl } from "../common/Tgl";
import { fmtUSD } from "../../utils/theme";

export function VehicleModal({ vehicle, onSave, onClose }) {
  const [newV, setNewV] = useState(vehicle || { 
    brand: "", model: "", year: new Date().getFullYear(), fuel: "Electric", 
    type: "SUV", drivetrain: "AWD", price: "", duties: "", totalGhana: "", 
    description: "", specs: {}, images: [], logo: null, featured: false, showPrice: true 
  });

  return (
    <div className="mo" onClick={onClose}>
      <div className="mo-box" style={{ maxWidth: "800px" }} onClick={e => e.stopPropagation()}>
        <div className="mo-hd">
          <div className="mo-title">{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</div>
          <button className="btn-sm btn-sm-ghost" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mo-body">
          <div className="frow">
            <div className="fg"><label className="lbl">Brand</label><input className="inp" placeholder="e.g. Xiaomi" value={newV.brand} onChange={e => setNewV({ ...newV, brand: e.target.value })} /></div>
            <div className="fg"><label className="lbl">Model</label><input className="inp" placeholder="e.g. SU7" value={newV.model} onChange={e => setNewV({ ...newV, model: e.target.value })} /></div>
          </div>
          <div className="frow">
            <div className="fg"><label className="lbl">Year</label><input className="inp" type="number" value={newV.year} onChange={e => setNewV({ ...newV, year: +e.target.value })} /></div>
            <div className="fg"><label className="lbl">Vehicle Type</label>
              <select className="inp" value={newV.type} onChange={e => setNewV({ ...newV, type: e.target.value })}>
                {["Saloon", "SUV", "4x4", "Hatchback", "MPV", "Pickup"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="frow">
            <div className="fg"><label className="lbl">Fuel Type</label>
              <select className="inp" value={newV.fuel} onChange={e => setNewV({ ...newV, fuel: e.target.value })}>
                {["Electric", "Hybrid", "Gasoline", "Diesel"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="fg"><label className="lbl">Drivetrain</label>
              <select className="inp" value={newV.drivetrain} onChange={e => setNewV({ ...newV, drivetrain: e.target.value })}>
                {["2WD", "AWD", "4WD", "RWD"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="frow">
            <div className="fg"><label className="lbl">FOB Price (USD)</label><input className="inp" type="number" value={newV.price} onChange={e => setNewV({ ...newV, price: e.target.value })} /></div>
            <div className="fg"><label className="lbl">Ghana Duties (USD)</label><input className="inp" type="number" value={newV.duties} onChange={e => setNewV({ ...newV, duties: e.target.value })} /></div>
          </div>
          <div className="fg"><label className="lbl">Total Ghana Price (USD)</label><input className="inp" type="number" value={newV.totalGhana} onChange={e => setNewV({ ...newV, totalGhana: e.target.value })} /></div>
          <div className="fg"><label className="lbl">Description</label><textarea className="inp" rows={3} value={newV.description} onChange={e => setNewV({ ...newV, description: e.target.value })} /></div>
          
          <ImgUp 
            label="Vehicle Photos (Multiple)" 
            images={newV.images || []} 
            onChange={imgs => setNewV({ ...newV, images: imgs })} 
            multiple 
          />
          
          <div style={{ display: "flex", gap: "20px", marginTop: "16px" }}>
            <Tgl on={newV.featured} onChange={() => setNewV({ ...newV, featured: !newV.featured })} label="Feature on Homepage" />
            <Tgl on={newV.showPrice} onChange={() => setNewV({ ...newV, showPrice: !newV.showPrice })} label="Show Price Publicly" />
          </div>
        </div>
        <div className="mo-ft">
          <button className="btn-sm btn-sm-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-p" onClick={() => onSave(newV)}>Save Vehicle →</button>
        </div>
      </div>
    </div>
  );
}

export function InvoiceModal({ order, settings, onSave, onClose }) {
  const [form, setForm] = useState({ 
    number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: order?.amount || 0,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    notes: "Professional vehicle sourcing from China. Shipping, clearing, and delivery included."
  });

  return (
    <div className="mo" onClick={onClose}>
      <div className="mo-box" style={{ maxWidth: "500px" }} onClick={e => e.stopPropagation()}>
        <div className="mo-hd">
          <div className="mo-title">Generate Invoice</div>
          <button className="btn-sm btn-sm-ghost" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="mo-body" style={{ display: "grid", gap: 14 }}>
          <div className="fg"><label className="lbl">Customer</label><input className="inp" value={order?.customer} disabled /></div>
          <div className="frow">
            <div className="fg"><label className="lbl">Document #</label><input className="inp" value={form.number} onChange={e => setForm({...form, number: e.target.value})} /></div>
            <div className="fg"><label className="lbl">Amount (USD)</label><input className="inp" type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} /></div>
          </div>
          <div className="fg"><label className="lbl">Due Date</label><input className="inp" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
          <div className="fg"><label className="lbl">Notes / Payment Terms</label><textarea className="inp" rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
        </div>
        <div className="mo-ft">
          <button className="btn-sm btn-sm-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-p" onClick={() => onSave(form)}>Save & Generate →</button>
        </div>
      </div>
    </div>
  );
}
