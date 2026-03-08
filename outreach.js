// outreach.js — Outreach CRM page logic

const CRMN={research:'pitched',pitched:'replied',replied:'confirmed',confirmed:'passed',passed:'research'};
const CRMC={research:'cs-rs',pitched:'cs-pi',replied:'cs-rp',confirmed:'cs-cf',passed:'cs-ps'};
const CRML={research:'Research',pitched:'Pitched',replied:'Replied',confirmed:'Confirmed',passed:'Passed'};

function renderCRM(){
  const b=document.getElementById('crm-body');
  if(!b)return;
  b.innerHTML=S.crm.map((c,i)=>`
    <tr onclick="cycCRM(${i})">
      <td><div class="crm-n">${c.name}</div><div class="crm-o">${c.note||''}</div></td>
      <td style="font-family:var(--fn);font-size:11px;color:var(--muted);">${c.cat}</td>
      <td style="font-family:var(--fn);font-size:11px;color:var(--muted);">${c.date}</td>
      <td><span class="cst ${CRMC[c.status]}">${CRML[c.status]}</span></td>
    </tr>`).join('');
}

function cycCRM(i){
  S.crm[i].status=CRMN[S.crm[i].status];
  S.crm[i].date=new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'});
  renderCRM();
}

function addCRM(){
  const nm=document.getElementById('crm-nm').value.trim();
  if(!nm)return;
  S.crm.push({
    name:nm,
    cat:document.getElementById('crm-ct').value.trim()||'General',
    note:document.getElementById('crm-no').value.trim(),
    date:'—',
    status:'research'
  });
  document.getElementById('crm-nm').value='';
  document.getElementById('crm-ct').value='';
  document.getElementById('crm-no').value='';
  renderCRM();
}
