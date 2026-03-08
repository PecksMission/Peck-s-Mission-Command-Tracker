// education.js — Education / Reading page logic

function renderEdu(){
  const el=document.getElementById('ecols');
  if(!el)return;
  const tc={core:'bcore',rec:'brec',clin:'bclin',vet:'bvet',wgu:'bwgu',faith:'bfaith'};
  const GOAL=100;
  const allDone=Object.values(S.books).flat().filter(b=>b.done).length;
  const allTotal=Object.values(S.books).flat().length;
  const pct=Math.min(100,Math.round((allDone/GOAL)*100));

  const cols=[
    {k:'mission',t:'Mission Reading List',s:'Patient Advocacy · Faith · Veteran · Clinical'},
    {k:'wgu',t:'WGU · BSHA Coursework',s:'Bachelor of Science, Healthcare Administration · 110 CU · 9 Terms'},
    {k:'faith',t:'Faith Leadership Courses',s:'GoLife100 · GoLife200 · GoBusiness200 · Stonebridge'},
  ];

  el.innerHTML=`<div style="grid-column:span 3;background:var(--navy-deep);padding:11px 18px;display:flex;align-items:center;gap:20px;border-bottom:2px solid var(--gold);">
    <div>
      <div style="font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#8a9dbb;">Annual Reading Goal</div>
      <div style="font-family:var(--fd);font-size:26px;font-weight:700;color:var(--gold-lt);line-height:1;">${allDone} <span style="font-size:13px;color:#6a7a99;">/ ${GOAL} books</span></div>
    </div>
    <div style="flex:1;">
      <div style="height:6px;background:rgba(255,255,255,.08);border-radius:1px;">
        <div style="height:100%;width:${pct}%;background:var(--gold);transition:width .4s;"></div>
      </div>
      <div style="font-family:var(--fn);font-size:9px;color:#6a7a99;margin-top:4px;">${pct}% · ${GOAL-allDone} remaining · Counts all lists including WGU and Faith courses</div>
    </div>
    <div style="font-family:var(--fs);font-size:11px;font-style:italic;color:#6a7a99;">${allTotal} total tracked</div>
  </div>`+cols.map(c=>`
    <div class="ecol">
      <div class="ech sec-head" onclick="toggleSec(this)" style="cursor:pointer;display:flex;align-items:center;gap:10px;">
        <span class="sec-toggle" style="color:#9aadbb;font-size:11px;">▾</span>
        <div style="flex:1;"><div class="ect">${c.t}</div><div class="ecs">${c.s}</div></div>
        <button class="sec-drill" onclick="event.stopPropagation();drillBooks('${c.k}','${c.t}','${c.s}')" style="font-size:8px;">Full View</button>
      </div>
      <div class="sec-body" style="max-height:5000px;">
        <div id="bl-${c.k}">${S.books[c.k].map((b,i)=>`
          <div class="br ${b.done?'done':''}" onclick="togBook('${c.k}',${i})">
            <div class="bcb">${CK}</div>
            <div class="bi"><div class="bt">${b.title}</div><div class="ba">${b.author}</div></div>
            <span class="btg ${tc[b.tag]||''}">${b.tag}</span>
          </div>`).join('')}</div>
        <div class="ar" style="padding:7px 17px;border-top:1px solid var(--rule-lt);">
          <input class="ai" id="ba-${c.k}" placeholder="Add to ${c.t}…" onkeydown="if(event.key==='Enter')addBook('${c.k}')"/>
          <button class="ab" style="font-size:9px;padding:5px 10px;" onclick="addBook('${c.k}')">Add</button>
        </div>
      </div>
    </div>`).join('');
}

function togBook(c,i){
  S.books[c][i].done=!S.books[c][i].done;
  renderEdu();
}
function addBook(c){
  const i=document.getElementById('ba-'+c);
  if(!i||!i.value.trim())return;
  S.books[c].push({title:i.value.trim(),author:'Added manually',done:false,tag:'rec'});
  i.value='';
  renderEdu();
}

// ─── WGU COURSE FUNCTIONS ───
function cycWGU(i){
  const c=S.books.wgu[i];
  const cyc={'not-started':'in-progress','in-progress':'complete','complete':'not-started'};
  c.status=cyc[c.status]||'not-started';
  renderEdu();
}
function drillWGU(i){
  const c=S.books.wgu[i];
  const stL={'not-started':'Not Started','in-progress':'In Progress','complete':'Complete'};
  const stCol={'not-started':'color:var(--muted-lt);border-color:var(--rule);','in-progress':'color:var(--gold);border-color:var(--gold);','complete':'color:var(--green-lt);border-color:var(--green-lt);'};
  const body=`<div class="dm-section">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
      <span style="font-family:var(--fn);font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:4px 10px;border:1px solid;cursor:pointer;${stCol[c.status]}" onclick="cycWGU(${i});drillWGU(${i})">${stL[c.status]} — click to advance</span>
      <span style="font-family:var(--fn);font-size:9px;color:var(--muted);">Term ${c.term} · ${c.cu} Competency Units · ${c.area}</span>
    </div>
    <div class="dm-sec-lbl">About This Course</div>
    <div style="font-family:var(--fs);font-size:13.5px;line-height:1.65;color:var(--ink-md);margin-bottom:16px;">${c.desc}</div>
    <div class="dm-sec-lbl">Competencies (${c.comp.length})</div>
    <div style="margin-bottom:16px;">${c.comp.map(cp=>`<div style="font-family:var(--fs);font-size:12.5px;color:var(--ink-md);padding:6px 0;border-bottom:1px solid var(--rule-lt);line-height:1.4;"><span style="font-family:var(--fn);font-size:9px;font-weight:700;color:var(--muted-lt);margin-right:6px;">●</span>${cp}</div>`).join('')}</div>
    <div class="dm-sec-lbl">Notes &amp; Prep</div>
    <textarea class="dm-notes" placeholder="Study notes, links, key concepts, exam prep…" oninput="S.books.wgu[${i}].notes=this.value">${c.notes||''}</textarea>
  </div>`;
  openDM(c.title,`BSHA · Term ${c.term} · ${c.cu} CU · ${c.area}`,body);
}
