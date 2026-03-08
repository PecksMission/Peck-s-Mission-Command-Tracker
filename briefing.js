// briefing.js — Daily Briefing page logic

function renderTasks(){
  const map={priority:'c-p',content:'c-c',team:'c-t','outreach-daily':'c-o',edu:'c-e'};
  Object.entries(map).forEach(([type,cid])=>{
    const el=document.getElementById('tl-'+type);
    const cnt=document.getElementById(cid);
    if(!el)return;
    const tasks=S.tasks[type];
    const rem=tasks.filter(t=>!t.done).length;
    if(cnt)cnt.textContent=rem+' remaining';
    el.innerHTML=tasks.length===0
      ?'<div class="empty">No tasks — add one below</div>'
      :tasks.map(t=>`
        <div class="tr ${t.done?'done':''}" data-id="${t.id}">
          <div class="tpb pr-${t.pr||'l'}"></div>
          <div class="tcb" onclick="toggleT('${type}',${t.id})">${CK}</div>
          <div class="tb" onclick="toggleT('${type}',${t.id})"><div class="tt">${t.text}</div>${t.note?`<div class="tn">${t.note}</div>`:''}</div>
          <span class="tdel" onclick="delT('${type}',${t.id})">✕</span>
        </div>`).join('');
    updateStats();
  });
}

function toggleT(type,id){
  const t=S.tasks[type].find(t=>t.id===id);
  if(t)t.done=!t.done;
  renderTasks();
}
function delT(type,id){
  S.tasks[type]=S.tasks[type].filter(t=>t.id!==id);
  renderTasks();
}
function addT(type){
  const inp=document.getElementById('ai-'+type);
  if(!inp||!inp.value.trim())return;
  S.tasks[type].push({id:++_id,text:inp.value.trim(),pr:'m',done:false});
  inp.value='';
  renderTasks();
}
function toggleComms(cell){
  cell.classList.toggle('cleared');
  const n=cell.querySelector('.cn');
  n.textContent=cell.classList.contains('cleared')?'✓':'Check';
}
