import React, { useRef } from "react";

export function ImgUp({ images = [], onChange, label = "Upload Images", multiple = true, single = false }) {
  const ref = useRef();
  
  const handle = (e) => {
    Array.from(e.target.files).forEach(f => {
      const r = new FileReader();
      r.onload = ev => {
        if (single) onChange([ev.target.result]);
        else onChange(prev => [...(prev || []), ev.target.result]);
      };
      r.readAsDataURL(f);
    });
    e.target.value = "";
  };
  
  const remove = (i) => {
    if (typeof onChange === 'function') {
      onChange((images || []).filter((_, idx) => idx !== i));
    }
  };

  return (
    <div>
      <label className="lbl">{label}</label>
      <div className="img-zone" onClick={() => ref.current.click()}>
        <input ref={ref} type="file" accept="image/*" multiple={multiple && !single} onChange={handle} />
        <div style={{ fontSize: "24px", marginBottom: "6px" }}>📁</div>
        <div style={{ fontSize: "12px", color: "var(--text2)" }}>Click to {images?.length ? "add more " : ""}upload</div>
      </div>
      {images && images.length > 0 && (
        <div className="img-thumbs">
          {images.map((src, i) => (
            <div key={i} className="img-thumb">
              <img src={src} alt="" />
              <button className="img-thumb-del" onClick={e => { e.stopPropagation(); remove(i) }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
