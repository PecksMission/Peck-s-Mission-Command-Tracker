// interviews.js — Interview Pipeline page logic

const IN={outreach:'is-ou',confirmed:'is-co',scheduled:'is-sc',recorded:'is-re',published:'is-pu'};
const IL={outreach:'Outreach',confirmed:'Confirmed',scheduled:'Scheduled',recorded:'Recorded',published:'Published'};
const INX={outreach:'confirmed',confirmed:'scheduled',scheduled:'recorded',recorded:'published',published:'outreach'};

function renderInt(){
  const b=document.getElementById('it-body');
  if(!b)return;
  let h='';
  S.interviews.forEach((iv,i)=>{
    h+=`<tr class="im" onclick="togPrep(${i})">
      <td><div class="ir">${String(iv.rank).padStart(2,'0')}</div></td>
      <td><div class="ig">${iv.guest}</div><div class="ito">${iv.topic}</div></td>
      <td><div class="iph">${iv.phase}</div></td>
      <td><span class="ist ${IN[iv.status]}" onclick="cycInt(${i},this,event)">${IL[iv.status]}</span></td>
      <td style="text-align:center;">
        <span style="color:var(--muted-lt);font-size:13px;cursor:pointer;" onclick="togPrep(${i})">▾</span>
        <button class="sec-drill" style="margin-left:4px;" onclick="event.stopPropagation();drillInt(${i})">Detail</button>
      </td>
    </tr>
    <tr class="ipr" id="pr-${i}">
      <td colspan="5"><div class="ipr-in">
        <div class="pr-lbl">Suggested Interview Questions</div>
        <div style="margin-bottom:9px;">${iv.questions.length>0
          ?iv.questions.map(q=>`<div class="pr-q">${q}</div>`).join('')
          :'<div style="font-family:var(--fs);font-size:12px;font-style:italic;color:var(--muted-lt);padding:4px 0;">No questions yet — add notes below.</div>'
        }</div>
        <div class="pr-lbl">Your Prep Notes</div>
        <textarea class="pr-notes" placeholder="Add scheduling details, contact info, prep notes, follow-up reminders…" oninput="S.interviews[${i}].notes=this.value">${iv.notes}</textarea>
      </div></td>
    </tr>`;
  });
  b.innerHTML=h;
}

function togPrep(i){
  document.getElementById('pr-'+i).classList.toggle('open');
}
function cycInt(i,el,e){
  e.stopPropagation();
  S.interviews[i].status=INX[S.interviews[i].status];
  el.className='ist '+IN[S.interviews[i].status];
  el.textContent=IL[S.interviews[i].status];
}
function addInt(){
  const g=document.getElementById('ng').value.trim();
  if(!g)return;
  S.interviews.push({
    rank:S.interviews.length+1,
    guest:g,
    topic:document.getElementById('nt').value.trim()||'—',
    phase:document.getElementById('nph').value.trim()||'TBD',
    status:'outreach',
    notes:document.getElementById('nn').value.trim(),
    questions:[]
  });
  document.getElementById('ng').value='';
  document.getElementById('nt').value='';
  document.getElementById('nph').value='';
  document.getElementById('nn').value='';
  renderInt();
}
