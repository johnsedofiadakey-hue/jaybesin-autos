/**
 * hex → rgba helper
 * @param {string} hex 
 * @param {number} a alpha (0-1)
 * @returns {string} rgba string
 */
export const ha = (hex, a) => {
  if (!hex || hex.length < 7) return `rgba(0,0,0,${a})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
};

export const fmtUSD = (n) => n ? `$${Number(n).toLocaleString()}` : "Price on Request";
export const fmtGHS = (n, rate) => n ? `GH₵ ${(n * rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "";
