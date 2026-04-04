import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Lock } from "lucide-react";

export function AdminLogin({ onLogin, onBack }) {
  const [c, setC] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const go = async () => {
    if (!c.email || !c.password) {
      setErr("Please enter email and password.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, c.email, c.password);
      if (onLogin) onLogin();
    } catch (e) {
      setErr("Incorrect credentials. Check Firebase Auth.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-glow" />
      {[300, 500, 700].map(s => (
        <div 
          key={s} 
          style={{ 
            position: "absolute", 
            width: s + "px", 
            height: s + "px", 
            borderRadius: "50%", 
            border: "1px solid color-mix(in srgb,var(--neon) 8%,transparent)", 
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%,-50%)" 
          }} 
        />
      ))}
      <div className="login-card">
        <button className="btn-sm btn-sm-ghost" style={{ marginBottom: "16px" }} onClick={onBack}>← Back</button>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ 
            width: "52px", 
            height: "52px", 
            borderRadius: "14px", 
            background: "var(--grad-neon)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 14px", 
            fontFamily: "Syne,sans-serif", 
            fontWeight: 800, 
            fontSize: "20px", 
            color: "var(--btn-text)" 
          }}>A</div>
          <div className="login-title">Admin <span style={{ color: "var(--neon)" }}>Portal</span></div>
          <div className="login-sub">Jaybesin Autos</div>
        </div>
        {err && <div className="alert al-er">{err}</div>}
        <div className="fg">
          <label className="lbl">Email</label>
          <input 
            className="inp" 
            type="email" 
            placeholder="admin@jaybesin.com" 
            value={c.email} 
            onChange={e => setC({ ...c, email: e.target.value })} 
          />
        </div>
        <div className="fg" style={{ marginBottom: "24px" }}>
          <label className="lbl">Password</label>
          <input 
            className="inp" 
            type="password" 
            placeholder="••••••••" 
            value={c.password} 
            onChange={e => setC({ ...c, password: e.target.value })} 
            onKeyDown={e => e.key === "Enter" && go()} 
          />
        </div>
        <button 
          className="btn-p" 
          style={{ width: "100%", justifyContent: "center", padding: "14px" }} 
          onClick={go} 
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In →"}
        </button>
        <div style={{ 
          textAlign: "center", 
          marginTop: "18px", 
          fontSize: "10px", 
          color: "var(--text3)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: 6 
        }}>
          <Lock size={11} strokeWidth={2} />Powered by Firebase Auth
        </div>
      </div>
    </div>
  );
}
