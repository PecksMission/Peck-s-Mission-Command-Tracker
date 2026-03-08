// education.js — Education / Reading page logic
// Every item (book, faith course, WGU course) is openable with description + notes.

const TAG_LABELS = {
  core:'Core Mission', clin:'Clinical', rec:'Recommended',
  vet:'Veteran', faith:'Faith', wgu:'WGU'
};

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
        <div id="bl-${c.k}">${renderBookList(c.k,tc)}</div>
        <div class="ar" style="padding:7px 17px;border-top:1px solid var(--rule-lt);">
          <input class="ai" id="ba-${c.k}" placeholder="Add to ${c.t}..." onkeydown="if(event.key==='Enter')addBook('${c.k}')"/>
          <button class="ab" style="font-size:9px;padding:5px 10px;" onclick="addBook('${c.k}')">Add</button>
        </div>
      </div>
    </div>`).join('');
}

function renderBookList(col, tc){
  if(!tc) tc={core:'bcore',rec:'brec',clin:'bclin',vet:'bvet',wgu:'bwgu',faith:'bfaith'};
  return S.books[col].map((b,i)=>{
    if(col==='wgu'){
      const stL={'not-started':'Not Started','in-progress':'In Progress','complete':'Complete'};
      const stCol={'not-started':'color:var(--muted-lt);border-color:var(--rule);','in-progress':'color:var(--gold);border-color:var(--gold);background:rgba(184,134,11,.07);','complete':'color:var(--green-lt);border-color:var(--green-lt);background:rgba(58,138,80,.07);'};
      return `<div class="br ${b.done?'done':''}" style="align-items:center;">
        <div class="bcb" onclick="togBook('${col}',${i})">${CK}</div>
        <div class="bi" onclick="togBook('${col}',${i})" style="flex:1;">
          <div class="bt">${b.title}</div>
          <div class="ba">Term ${b.term} &middot; ${b.cu} CU &middot; ${b.area}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
          <span style="font-family:var(--fn);font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:2px 6px;border:1px solid;${stCol[b.status||'not-started']}">${stL[b.status||'not-started']}</span>
          <button class="sec-drill" style="font-size:8px;padding:2px 7px;" onclick="event.stopPropagation();drillWGU(${i})">Open</button>
        </div>
      </div>`;
    }
    const hasDetail = b.desc || b.notes !== undefined;
    return `<div class="br ${b.done?'done':''}" style="align-items:center;">
      <div class="bcb" onclick="togBook('${col}',${i})">${CK}</div>
      <div class="bi" onclick="togBook('${col}',${i})" style="flex:1;">
        <div class="bt">${b.title}</div>
        <div class="ba">${b.author||''}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
        <span class="btg ${tc[b.tag]||''}">${b.tag}</span>
        ${hasDetail?`<button class="sec-drill" style="font-size:8px;padding:2px 7px;" onclick="event.stopPropagation();drillBook('${col}',${i})">Open</button>`:''}
      </div>
    </div>`;
  }).join('');
}

// ─── BOOK / FAITH COURSE DETAIL MODAL ────────────
function drillBook(col, i){
  const b = S.books[col][i];
  const tagLabel = TAG_LABELS[b.tag] || b.tag;
  const hasNotes = b.notes !== undefined;
  const typeName = col==='faith' ? 'Course' : 'Book';

  const body=`<div class="dm-section">

    <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:8px 14px;border:1px solid var(--rule);background:var(--white);" onclick="togBook('${col}',${i});drillBook('${col}',${i})">
        <div style="width:16px;height:16px;border:1.5px solid ${b.done?'var(--navy)':'var(--rule)'};background:${b.done?'var(--navy)':'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          ${b.done?'<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}
        </div>
        <span style="font-family:var(--fn);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${b.done?'var(--navy)':'var(--muted)'};">${b.done?'Completed — click to undo':'Mark as Complete'}</span>
      </div>
      <span style="font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:3px 9px;border:1px solid var(--rule);color:var(--muted);">${tagLabel}</span>
    </div>

    ${b.desc?`
    <div class="dm-sec-lbl">About This ${typeName}</div>
    <div style="font-family:var(--fs);font-size:14px;line-height:1.8;color:var(--ink-md);margin-bottom:20px;padding:14px 16px;background:var(--cream-dk);border-left:3px solid var(--navy);">${b.desc}</div>
    `:''}

    ${hasNotes?`
    <div class="dm-sec-lbl">My Notes</div>
    <textarea class="dm-notes" style="min-height:140px;font-size:13.5px;line-height:1.7;"
      placeholder="Key insights, quotes, connections to your mission, things to remember..."
      oninput="S.books['${col}'][${i}].notes=this.value">${b.notes||''}</textarea>
    <div style="font-family:var(--fn);font-size:9px;color:var(--muted-lt);margin-top:5px;letter-spacing:.05em;">Notes save automatically.</div>
    `:''}

  </div>`;

  const subtitle = col==='faith'
    ? `${tagLabel} · Faith Leadership Course`
    : `${b.author} · ${tagLabel}`;

  openDM(b.title, subtitle, body);
}

function togBook(c,i){
  S.books[c][i].done=!S.books[c][i].done;
  renderEdu();
}
function addBook(c){
  const i=document.getElementById('ba-'+c);
  if(!i||!i.value.trim())return;
  S.books[c].push({title:i.value.trim(),author:'Added manually',done:false,tag:'rec',notes:'',desc:''});
  i.value='';
  renderEdu();
}

// ─── WGU COURSE DETAIL MODAL ─────────────────────
function cycWGU(i){
  const c=S.books.wgu[i];
  const cyc={'not-started':'in-progress','in-progress':'complete','complete':'not-started'};
  c.status=cyc[c.status]||'not-started';
  renderEdu();
}

function drillWGU(i){
  const c=S.books.wgu[i];
  const stL={'not-started':'Not Started','in-progress':'In Progress','complete':'Complete'};
  const stCol={
    'not-started':'color:var(--muted-lt);border-color:var(--rule);',
    'in-progress':'color:var(--gold);border-color:var(--gold);background:rgba(184,134,11,.07);',
    'complete':'color:var(--green-lt);border-color:var(--green-lt);background:rgba(58,138,80,.07);'
  };
  const body=`<div class="dm-section">

    <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap;">
      <span style="font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:5px 12px;border:1px solid;cursor:pointer;${stCol[c.status||'not-started']}"
        onclick="cycWGU(${i});drillWGU(${i})">${stL[c.status||'not-started']} &mdash; click to advance</span>
      <span style="font-family:var(--fn);font-size:9px;color:var(--muted);padding:5px 10px;border:1px solid var(--rule-lt);background:var(--cream-dk);">Term ${c.term}</span>
      <span style="font-family:var(--fn);font-size:9px;color:var(--muted);padding:5px 10px;border:1px solid var(--rule-lt);background:var(--cream-dk);">${c.cu} Competency Units</span>
      <span style="font-family:var(--fn);font-size:9px;color:var(--muted);padding:5px 10px;border:1px solid var(--rule-lt);background:var(--cream-dk);">${c.area}</span>
    </div>

    <div class="dm-sec-lbl">Course Overview</div>
    <div style="font-family:var(--fs);font-size:14px;line-height:1.8;color:var(--ink-md);margin-bottom:20px;padding:14px 16px;background:var(--cream-dk);border-left:3px solid var(--navy);">${c.desc}</div>

    <div class="dm-sec-lbl">Competencies (${c.comp.length})</div>
    <div style="margin-bottom:20px;">
      ${c.comp.map(cp=>`
        <div style="font-family:var(--fs);font-size:13px;color:var(--ink-md);padding:9px 0 9px 16px;border-bottom:1px solid var(--rule-lt);line-height:1.5;position:relative;">
          <span style="position:absolute;left:0;top:11px;font-family:var(--fn);font-size:9px;font-weight:700;color:var(--muted-lt);">&#9679;</span>${cp}
        </div>`).join('')}
    </div>

    <div class="dm-sec-lbl">My Notes &amp; Study Prep</div>
    <textarea class="dm-notes" style="min-height:160px;font-size:13.5px;line-height:1.7;"
      placeholder="Study notes, key concepts, practice questions, exam prep, links to resources..."
      oninput="S.books.wgu[${i}].notes=this.value">${c.notes||''}</textarea>
    <div style="font-family:var(--fn);font-size:9px;color:var(--muted-lt);margin-top:5px;letter-spacing:.05em;">Notes save automatically.</div>

  </div>`;
  openDM(c.title, `WGU BSHA &middot; Term ${c.term} &middot; ${c.cu} CU &middot; ${c.area}`, body);
}

// ─── FULL LIST DRILL-DOWN ─────────────────────────
function drillBooks(col,title,sub){
  const books=S.books[col];
  const tc2={core:'bcore',rec:'brec',clin:'bclin',vet:'bvet',wgu:'bwgu',faith:'bfaith'};
  const done=books.filter(b=>b.done).length;
  let body=`<div class="dm-section">
    <div class="dm-sec-lbl">${done} completed / ${books.length} total</div>`;
  books.forEach((b,i)=>{
    if(col==='wgu'){
      const stL={'not-started':'Not Started','in-progress':'In Progress','complete':'Complete'};
      const stCol={'not-started':'color:var(--muted-lt);border-color:var(--rule);','in-progress':'color:var(--gold);border-color:var(--gold);','complete':'color:var(--green-lt);border-color:var(--green-lt);'};
      body+=`<div class="dm-book ${b.done?'done':''}" style="align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;gap:10px;flex:1;" onclick="togBook('${col}',${i});drillBooks('${col}','${title}','${sub}')">
          <div class="dm-cb">${b.done?'<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}</div>
          <div><div class="dm-bt">${b.title}</div><div class="dm-ba">Term ${b.term} &middot; ${b.cu} CU &middot; ${b.area}</div></div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
          <span style="font-family:var(--fn);font-size:8px;font-weight:700;padding:2px 6px;border:1px solid;${stCol[b.status||'not-started']}">${stL[b.status||'not-started']}</span>
          <button class="sec-drill" style="font-size:8px;" onclick="event.stopPropagation();drillWGU(${i})">Open</button>
        </div>
      </div>`;
    } else {
      body+=`<div class="dm-book ${b.done?'done':''}" style="align-items:center;">
        <div class="dm-cb" style="flex-shrink:0;margin-top:0;" onclick="togBook('${col}',${i});drillBooks('${col}','${title}','${sub}')">${b.done?'<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}</div>
        <div style="flex:1;" onclick="togBook('${col}',${i});drillBooks('${col}','${title}','${sub}')">
          <div class="dm-bt">${b.title}</div><div class="dm-ba">${b.author||''}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
          <span class="btg ${tc2[b.tag]||''}">${b.tag}</span>
          ${(b.desc||b.notes!==undefined)?`<button class="sec-drill" style="font-size:8px;" onclick="event.stopPropagation();drillBook('${col}',${i})">Open</button>`:''}
        </div>
      </div>`;
    }
  });
  body+=`<div class="dm-add" style="margin-top:10px;">
    <input class="dm-inp" id="dba-${col}" placeholder="Add title..." onkeydown="if(event.key==='Enter')dmAddBook('${col}','${title}','${sub}')"/>
    <button class="ab" onclick="dmAddBook('${col}','${title}','${sub}')">Add</button>
  </div></div>`;
  openDM(title,sub,body);
}

function dmAddBook(col,title,sub){
  const inp=document.getElementById('dba-'+col);
  if(!inp||!inp.value.trim())return;
  S.books[col].push({title:inp.value.trim(),author:'Added manually',done:false,tag:'rec',notes:'',desc:''});
  renderEdu();
  drillBooks(col,title,sub);
}
