import React from "react";

export default function TopSearches({ top = [], onClickTerm = ()=>{} }) {
  return (
    <div style={{background:"#f6f6f6", padding:12, borderRadius:6, marginTop:12}}>
      <strong>Top Searches:</strong>
      {top.length === 0 ? <span style={{marginLeft:8}}>No top searches yet</span> : (
        <div style={{display:"flex", gap:8, marginTop:8}}>
          {top.map(t => (
            <button key={t.term} onClick={()=>onClickTerm(t.term)} style={{padding:"6px 10px"}}>
              {t.term} ({t.count})
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
