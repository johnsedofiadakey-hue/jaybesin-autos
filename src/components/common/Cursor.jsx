import React, { useState, useEffect, useRef } from "react";

export function Cursor() {
  const c = useRef(), r = useRef();
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const mv = e => {
      if (c.current) {
        c.current.style.left = e.clientX + "px";
        c.current.style.top = e.clientY + "px";
      }
      if (r.current) {
        r.current.style.left = e.clientX + "px";
        r.current.style.top = e.clientY + "px";
      }
    };
    
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a') || target.style.cursor === 'pointer') {
        setHov(true);
      } else {
        setHov(false);
      }
    };

    document.addEventListener("mousemove", mv);
    document.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      document.removeEventListener("mousemove", mv);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      <div className="cur" ref={c} />
      <div className={`cur-ring${hov ? " hov" : ""}`} ref={r} />
    </>
  );
}
