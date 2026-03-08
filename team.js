// team.js — Team Task Tracker page logic

function renderTeam(){
  const el=document.getElementById('tcols');
  if(!el)return;
  const mb=[
    {k:'jonah',n:'Jonah Sapp',r:'IT / Web',i:'JO'},
    {k:'marketer',n:'Marketer',r:'Marketing / Social',i:'MK'},
    {k:'artist',n:'Artist',r:'Design / Brand',i:'AR'}
  ];
  el.innerHTML=mb.map(m=>`
    <div class="tcol">
      <div class="tch">
        <div class="tca">${m.i}</div>
        <div><div class="tcn">${m.n}</div><div class="tcr">${m.r}</div></div>
      </div>
      <div id="tc-${m.k}">${S.teamTasks[m.k].map((t,i)=>`
        <div class="ttask ${t.done?'done':''}">
          <div class="ttcb" onclick="togTT('${m.k}',${i})">${CK}</div>
          <div style="flex:1;" onclick="togTT('${m.k}',${i})">
            <div class="ttt">${t.text}</div>
            ${t.meta?`<div class="ttm">${t.meta}</div>`:''}
          </div>
          <span class="ttd" onclick="delTT('${m.k}',${i})">✕</span>
        </div>`).join('')}</div>
      <div class="tadd">
        <input class="tainp" id="ta-${m.k}" placeholder="Add task for ${m.n}…" onkeydown="if(event.key==='Enter')addTT('${m.k}')"/>
        <button class="ab" style="font-size:9px;padding:5px 10px;" onclick="addTT('${m.k}')">Add</button>
      </div>
    </div>`).join('');
}

function togTT(m,i){S.teamTasks[m][i].done=!S.teamTasks[m][i].done;renderTeam();}
function delTT(m,i){S.teamTasks[m].splice(i,1);renderTeam();}
function addTT(m){
  const i=document.getElementById('ta-'+m);
  if(!i||!i.value.trim())return;
  S.teamTasks[m].push({text:i.value.trim(),done:false,meta:''});
  i.value='';
  renderTeam();
}
