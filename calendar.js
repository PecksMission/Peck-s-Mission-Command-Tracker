// calendar.js — Content Calendar page logic

function renderCal(){
  const b=document.getElementById('cal-body');
  if(!b)return;
  const bc={ch:'ct-ch',sl:'ct-sl',in:'ct-in',co:'ct-co'};
  const bl={ch:'Chart+Story',sl:'Solo',in:'Interview',co:'Collab'};
  const sc={planned:'st-pl',drafting:'st-dr',ready:'st-rd',live:'st-lv'};
  const sl={planned:'Planned',drafting:'Drafting',ready:'Ready',live:'Live'};
  let h='';
  CAL.forEach((ph,pi)=>{
    h+=`<div class="cph sec-head" onclick="toggleSec(this)" style="cursor:pointer;">
      <span class="sec-toggle" style="color:#9aadbb;">▾</span>
      <span class="cph-t">${ph.ph}</span>
      <span class="cph-s">${ph.posts.length} posts</span>
      <button class="sec-drill" onclick="event.stopPropagation();drillPhase(${pi})" style="margin-left:auto;">Phase Detail</button>
    </div>`;
    h+=`<div class="sec-body" style="max-height:6000px;"><table class="cal"><thead><tr>
      <th style="width:36px;">#</th><th style="width:90px;">Type</th>
      <th>Title &amp; Format / Guest</th><th style="width:86px;">Status</th>
    </tr></thead><tbody>`;
    ph.posts.forEach((p,i)=>{
      h+=`<tr data-t="${p.t}">
        <td style="font-family:var(--fn);font-size:10px;color:var(--muted-lt);">${p.n}</td>
        <td><span class="ctb ${bc[p.t]}">${bl[p.t]}</span></td>
        <td><div class="cal-ti">${p.ti}</div><div class="cal-gu">${p.gu}</div></td>
        <td><span class="stb ${sc[p.st]}" onclick="cycSt(${pi},${i},this)">${sl[p.st]}</span></td>
      </tr>`;
    });
    h+='</tbody></table></div>';
  });
  b.innerHTML=h;
}

function cycSt(pi,i,el){
  const nx={planned:'drafting',drafting:'ready',ready:'live',live:'planned'};
  const sc={planned:'st-pl',drafting:'st-dr',ready:'st-rd',live:'st-lv'};
  const sl={planned:'Planned',drafting:'Drafting',ready:'Ready',live:'Live'};
  CAL[pi].posts[i].st=nx[CAL[pi].posts[i].st];
  el.className='stb '+sc[CAL[pi].posts[i].st];
  el.textContent=sl[CAL[pi].posts[i].st];
  event.stopPropagation();
}

function filterCal(t,btn){
  document.querySelectorAll('.cfb').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#cal-body tr[data-t]').forEach(r=>{
    r.style.display=(t==='all'||r.dataset.t===t)?'':'none';
  });
}
