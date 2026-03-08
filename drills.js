// drills.js — Detail modal drill-down functions

// ─── BRIEFING TASK DRILL-DOWN ───
function drillTask(type,label){
  const tasks=S.tasks[type];
  const prL={h:'High',m:'Med',l:'Low'};
  let body=`<div class="dm-section">
    <div class="dm-sec-lbl">${label} — ${tasks.filter(t=>!t.done).length} remaining / ${tasks.length} total</div>`;
  body+=tasks.map((t,i)=>`
    <div class="dm-task ${t.done?'done':''}" onclick="dmToggleT('${type}',${t.id})">
      <div class="dm-cb">${t.done?'<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}</div>
      <div style="flex:1;">
        <div class="dm-tt">${t.text}</div>
        ${t.note?`<div style="font-family:var(--fs);font-size:11px;font-style:italic;color:var(--muted-lt);margin-top:2px;">${t.note}</div>`:''}
      </div>
      <span class="dm-pri ${t.pr||'l'}">${prL[t.pr||'l']}</span>
    </div>`).join('');
  body+=`<div class="dm-add" style="margin-top:10px;">
    <input class="dm-inp" id="dma-${type}" placeholder="Add task…" onkeydown="if(event.key==='Enter')dmAddT('${type}','${label}')"/>
    <button class="ab" onclick="dmAddT('${type}','${label}')">Add</button>
  </div></div>`;
  openDM(label,'Daily Briefing · Task Lane Detail',body);
}

function dmToggleT(type,id){
  const t=S.tasks[type].find(t=>t.id===id);
  if(t)t.done=!t.done;
  renderTasks();
  const lbl={priority:'Priority',content:'Content',team:'Team','outreach-daily':'Outreach',edu:'Education'};
  drillTask(type,lbl[type]||type);
}

function dmAddT(type,label){
  const inp=document.getElementById('dma-'+type);
  if(!inp||!inp.value.trim())return;
  S.tasks[type].push({id:++_id,text:inp.value.trim(),pr:'m',done:false});
  renderTasks();
  drillTask(type,label);
}

// ─── CALENDAR PHASE DRILL-DOWN ───
function drillPhase(pi){
  const ph=CAL[pi];
  const bc={ch:'ct-ch',sl:'ct-sl',in:'ct-in',co:'ct-co'};
  const bl={ch:'Chart+Story',sl:'Solo',in:'Interview',co:'Collab'};
  const sc={planned:'st-pl',drafting:'st-dr',ready:'st-rd',live:'st-lv'};
  const sl={planned:'Planned',drafting:'Drafting',ready:'Ready',live:'Live'};
  const live=ph.posts.filter(p=>p.st==='live').length;
  let body=`<div class="dm-section"><div class="dm-sec-lbl">${ph.posts.length} posts · ${live} live · click status to advance</div>`;
  ph.posts.forEach((p,i)=>{
    body+=`<div class="dm-post">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <span class="dm-post-n">#${p.n}</span>
        <span class="ctb ${bc[p.t]}" style="font-size:8px;">${bl[p.t]}</span>
        <span class="stb ${sc[p.st]}" onclick="cycSt(${pi},${i},this);drillPhase(${pi})" style="margin-left:auto;">${sl[p.st]}</span>
      </div>
      <div class="dm-post-t">${p.ti}</div>
      <div class="dm-post-g">${p.gu}</div>
    </div>`;
  });
  body+='</div>';
  openDM(ph.ph,'Content Calendar · Phase Detail',body);
}

// ─── INTERVIEW DRILL-DOWN ───
function drillInt(i){
  const iv=S.interviews[i];
  const IN2={outreach:'is-ou',confirmed:'is-co',scheduled:'is-sc',recorded:'is-re',published:'is-pu'};
  const IL2={outreach:'Outreach',confirmed:'Confirmed',scheduled:'Scheduled',recorded:'Recorded',published:'Published'};
  let body=`<div class="dm-section">
    <div class="dm-sec-lbl">Rank #${String(iv.rank).padStart(2,'0')} · <span class="ist ${IN2[iv.status]}" onclick="cycInt(${i},this,event);drillInt(${i})" style="cursor:pointer;">${IL2[iv.status]}</span> · Phase ${iv.phase}</div>
    <div class="dm-int">
      <div class="dm-int-name">${iv.guest}</div>
      <div class="dm-int-topic">${iv.topic}</div>
      ${iv.questions.length>0?`<div class="dm-sec-lbl" style="margin-top:10px;">Interview Questions</div><div class="dm-int-qs">${iv.questions.map(q=>`<div class="dm-q">${q}</div>`).join('')}</div>`:''}
      <div class="dm-sec-lbl" style="margin-top:10px;">Prep Notes &amp; Scheduling</div>
      <textarea class="dm-notes" placeholder="Contact info, scheduling notes, follow-ups, prep ideas…" oninput="S.interviews[${i}].notes=this.value;const ta=document.querySelectorAll('.pr-notes')[${i}];if(ta)ta.value=this.value">${iv.notes}</textarea>
    </div>
  </div>`;
  openDM(iv.guest,'Interview Pipeline · Full Detail',body);
}

// ─── EDUCATION / BOOK DRILL-DOWN ───
function drillBooks(col,title,sub){
  const books=S.books[col];
  const tc2={core:'bcore',rec:'brec',clin:'bclin',vet:'bvet',wgu:'bwgu',faith:'bfaith'};
  const done=books.filter(b=>b.done).length;
  let body=`<div class="dm-section">
    <div class="dm-sec-lbl">${done} completed / ${books.length} total</div>`;
  books.forEach((b,i)=>{
    body+=`<div class="dm-book ${b.done?'done':''}" onclick="togBook('${col}',${i});drillBooks('${col}','${title}','${sub}')">
      <div class="dm-cb" style="flex-shrink:0;margin-top:3px;">${b.done?'<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}</div>
      <div style="flex:1;"><div class="dm-bt">${b.title}</div><div class="dm-ba">${b.author}</div></div>
      <span class="btg ${tc2[b.tag]||''}">${b.tag}</span>
    </div>`;
  });
  body+=`<div class="dm-add" style="margin-top:10px;">
    <input class="dm-inp" id="dba-${col}" placeholder="Add title…" onkeydown="if(event.key==='Enter')dmAddBook('${col}','${title}','${sub}')"/>
    <button class="ab" onclick="dmAddBook('${col}','${title}','${sub}')">Add</button>
  </div></div>`;
  openDM(title,sub,body);
}

function dmAddBook(col,title,sub){
  const inp=document.getElementById('dba-'+col);
  if(!inp||!inp.value.trim())return;
  S.books[col].push({title:inp.value.trim(),author:'Added manually',done:false,tag:'rec'});
  renderEdu();
  drillBooks(col,title,sub);
}
