import React from "react";

export default function History({ history = [], onClickTerm = ()=>{} }) {
  return (
    <div>
      <h3>Your Search History</h3>
      {history.length === 0 ? <div>No history</div> : (
        <ul style={{paddingLeft:16}}>
          {history.map((h, idx) => (
            <li key={idx} style={{marginBottom:8}}>
              <a style={{cursor:"pointer", color:"#0366d6"}} onClick={()=>onClickTerm(h.term)}>{h.term}</a>
              <div style={{fontSize:11, color:"#666"}}>{new Date(h.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
