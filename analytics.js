// analytics.js — Platform Analytics page logic

function renderAnalytics(){
  const el=document.getElementById('ag');
  if(!el)return;
  const cats={web:'Web Traffic',email:'Email',social:'Social',content:'Content Output',speaking:'Speaking'};
  const months=S.analytics.months;
  const catKeys=[...new Set(S.analytics.metrics.map(m=>m.cat))];
  const postsLive=(S.analytics.metrics.find(m=>m.key==='postslive')?.monthly||[]).reduce((a,b)=>a+(parseInt(b)||0),0);
  const intsDone=(S.analytics.metrics.find(m=>m.key==='intdone')?.monthly||[]).reduce((a,b)=>a+(parseInt(b)||0),0);

  let html=`<div style="grid-column:1/-1;background:var(--navy);border:1px solid var(--rule);padding:11px 16px;display:flex;gap:28px;align-items:center;flex-wrap:wrap;margin-bottom:6px;">
    <div style="font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#8a9dbb;">2026–27 Year Overview</div>
    <div style="display:flex;gap:24px;flex-wrap:wrap;">
      <div><div style="font-family:var(--fd);font-size:22px;font-weight:700;color:var(--gold-lt);line-height:1;">${postsLive}</div><div style="font-family:var(--fn);font-size:9px;color:#8a9dbb;letter-spacing:.1em;text-transform:uppercase;">Posts Live</div></div>
      <div><div style="font-family:var(--fd);font-size:22px;font-weight:700;color:var(--gold-lt);line-height:1;">${intsDone}<span style="font-size:13px;color:#6a7a99;">/52</span></div><div style="font-family:var(--fn);font-size:9px;color:#8a9dbb;letter-spacing:.1em;text-transform:uppercase;">Interviews</div></div>
    </div>
  </div>`;

  catKeys.forEach(cat=>{
    const ms=S.analytics.metrics.filter(m=>m.cat===cat);
    html+=`<div style="grid-column:1/-1;overflow-x:auto;margin-bottom:8px;border:1px solid var(--rule);">
      <table style="width:100%;border-collapse:collapse;min-width:900px;">
        <thead><tr>
          <th style="background:var(--navy-mid);font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#9aadcc;padding:8px 12px;text-align:left;border-bottom:1px solid rgba(255,255,255,.12);white-space:nowrap;min-width:160px;">${cats[cat]||cat}</th>
          ${months.map(mo=>`<th style="background:var(--navy-mid);font-family:var(--fn);font-size:9px;color:#7a8faa;padding:6px 8px;text-align:center;border-bottom:1px solid rgba(255,255,255,.12);white-space:nowrap;min-width:68px;">${mo}</th>`).join('')}
          <th style="background:var(--navy-mid);font-family:var(--fn);font-size:9px;color:#7a8faa;padding:6px 10px;text-align:left;border-bottom:1px solid rgba(255,255,255,.12);min-width:140px;">Notes</th>
        </tr></thead>
        <tbody>${ms.map((m,ri)=>`<tr style="background:${ri%2===0?'var(--navy-deep)':'rgba(26,39,68,.65)'};">
          <td style="font-family:var(--fn);font-size:11px;color:var(--cream);padding:7px 12px;border-right:1px solid rgba(255,255,255,.06);">
            <div>${m.label}</div>
            <div style="font-size:9px;color:#6a7a99;margin-top:1px;">${m.hint}</div>
          </td>
          ${months.map((mo,mi)=>`<td style="padding:3px 4px;border-right:1px solid rgba(255,255,255,.04);text-align:center;">
            <input style="width:60px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);padding:4px 5px;font-family:var(--fn);font-size:11px;color:var(--cream);text-align:center;outline:none;transition:border-color .15s;"
              value="${m.monthly[mi]||''}" placeholder="—"
              oninput="upM2('${m.key}',${mi},this.value)"
              onfocus="this.style.borderColor='var(--gold)'"
              onblur="this.style.borderColor='rgba(255,255,255,.08)'"/>
          </td>`).join('')}
          <td style="padding:4px 8px;">
            <input style="width:100%;background:transparent;border:none;font-family:var(--fs);font-size:11px;font-style:italic;color:#8a9dbb;outline:none;"
              placeholder="Notes…" value="${m.notes||''}" oninput="upMnotes('${m.key}',this.value)"/>
          </td>
        </tr>`).join('')}</tbody>
      </table>
    </div>`;
  });

  el.innerHTML=html;
  el.style.gridColumn='1/-1';
}

function upM2(k,mi,v){
  const m=S.analytics.metrics.find(m=>m.key===k);
  if(m)m.monthly[mi]=v;
}
function upMnotes(k,v){
  const m=S.analytics.metrics.find(m=>m.key===k);
  if(m)m.notes=v;
}
