import React, { useState } from "react";

export default function SearchBox({ onSearch, disabled }) {
  const [t, setT] = useState("");
  return (
    <div>
      <input value={t} onChange={e=>setT(e.target.value)} placeholder="Search images..." style={{width:"80%", padding:8}} />
      <button disabled={disabled} onClick={()=>{ onSearch(t); }} style={{marginLeft:8}}>Search</button>
      {!disabled && <div style={{color:"#777", marginTop:6}}>Login to use search</div>}
    </div>
  );
}
