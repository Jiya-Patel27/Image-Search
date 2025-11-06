import React from "react";

export default function Grid({ results = [], selected, toggleSelect }) {
  const cols = 4;
  const cellWidth = `${100/cols}%`;
  return (
    <div style={{display:"flex", flexWrap:"wrap", marginTop:12}}>
      {results.map(item => (
        <div key={item.id} style={{width: cellWidth, padding:6, boxSizing:"border-box"}}>
          <div style={{position:"relative"}}>
            <img src={item.thumb} alt={item.alt || ""} style={{width:"100%", borderRadius:6}} />
            <input type="checkbox"
              checked={selected.has(item.id)}
              onChange={()=>toggleSelect(item.id)}
              style={{position:"absolute", top:8, left:8, transform:"scale(1.3)"}}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
