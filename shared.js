// ═══════════════════════════════════════════════
//  shared.js  — Global state, data, utilities
// ═══════════════════════════════════════════════

const CK='<svg class="ck-svg" width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
let _id=500;

// ─── SHARED APP STATE ───────────────────────────
const S={
  tasks:{
    priority:[
      {id:1,text:'Publish "Stand In Front of Me" — Phase 1, Post 01',pr:'h',done:false},
      {id:2,text:'Answer every email in inbox — do not defer any',pr:'h',done:false},
      {id:3,text:'Check Mailchimp — confirm welcome email sequence is firing correctly',pr:'h',done:false},
      {id:4,text:'Post on Instagram + Facebook announcing Phase 1 launch today',pr:'m',done:false},
    ],
    content:[
      {id:5,text:'Write opening paragraph for "Manage the Pain First" (Post 02)',pr:'h',done:false},
      {id:6,text:'Pull exact Vanderbilt MyChart entries for Post 02 — MRI order, pain scores, medication log',pr:'h',done:false},
      {id:7,text:'Review Sapp\'s surgery-day timeline entries for Post 01 accuracy before publishing',pr:'m',done:false},
      {id:8,text:'Schedule all social posts for this week\'s published content (Buffer/Later)',pr:'m',done:false},
      {id:9,text:'Update content calendar status badges for any completed posts',pr:'l',done:false},
      {id:10,text:'Draft two headline options for Post 03 — "From the Other Side of the Table"',pr:'l',done:false},
    ],
    team:[
      {id:11,text:'Follow up with Jonah — mobile nav bug resolution status, ETA?',pr:'m',done:false},
      {id:12,text:'Send artist design brief: featured image template for Chart+Story posts',pr:'m',done:false},
      {id:13,text:'Confirm Jonah has correct OG/meta tags on all Phase 1 posts before publish',pr:'l',done:false},
    ],
    'outreach-daily':[
      {id:14,text:'Send cold outreach email to VP of Operations contact (Rank #1 interview)',pr:'h',done:false},
      {id:15,text:'Reach out to Barnes Jewish connection re: Medical Lab Scientist interview',pr:'h',done:false},
      {id:16,text:'Contact Patient Advocate Foundation — awareness partnership inquiry',pr:'m',done:false},
      {id:17,text:'Follow up on any pending interview requests with no reply yet',pr:'m',done:false},
    ],
    edu:[
      {id:18,text:'WGU — complete today\'s assigned module or assessment',pr:'m',done:false},
      {id:19,text:'Read 20 pages: current book from mission reading list',pr:'l',done:false},
    ]
  },
  teamTasks:{
    jonah:[
      {text:'Fix mobile navigation bug — hamburger menu broken on iOS Safari',done:false,meta:'Bug · Active'},
      {text:'Update OG title + description meta tags for all Phase 1 posts',done:false,meta:'SEO'},
      {text:'Verify Firebase real-time updates on surgery-day timeline page',done:false,meta:'Bug Check'},
      {text:'Confirm Google Analytics 4 property is tracking page views correctly',done:false,meta:'Analytics'},
      {text:'Optimize page load speed — target under 2 seconds on mobile',done:false,meta:'Performance'},
      {text:'Add inline email subscribe form below each blog post',done:false,meta:'Growth / CRO'},
      {text:'Audit all external links — verify nothing broken post-launch',done:false,meta:'QA'},
    ],
    marketer:[
      {text:'Build Phase 1 social amplification plan — IG, FB, Pinterest breakdown',done:false,meta:'Strategy'},
      {text:'Identify 20 patient advocacy orgs for cold outreach list',done:false,meta:'Outreach'},
      {text:'Draft outreach email template for patient advocacy org pitch',done:false,meta:'Copywriting'},
      {text:'Set up Instagram content posting schedule through end of Phase 1',done:false,meta:'Social'},
      {text:'Research 10 relevant healthcare + veteran podcasts to pitch',done:false,meta:'Podcast Outreach'},
      {text:'Build email list growth strategy — goal: 500 subscribers by Phase 1 end',done:false,meta:'Email'},
      {text:'Draft one-page press kit / media overview for pecksmission.com',done:false,meta:'PR'},
      {text:'Identify Pinterest strategy for patient advocacy + veteran content',done:false,meta:'Social'},
    ],
    artist:[
      {text:'Create featured image template for Chart+Story posts — 16:9 + 1:1',done:false,meta:'Design'},
      {text:'Design Phase 1 launch banner graphic for website header',done:false,meta:'Design'},
      {text:'Deliver social card templates — 1080×1080 and 1080×1920 Stories',done:false,meta:'Design'},
      {text:'Produce logo variations: favicon, dark background, light background',done:false,meta:'Brand'},
      {text:'Create interview series thumbnail template',done:false,meta:'Design'},
      {text:'Deliver brand style guide: fonts, colors, usage rules',done:false,meta:'Brand'},
      {text:'Optimize profile photo for all platforms — circle-safe crop',done:false,meta:'Assets'},
    ]
  },
  analytics:{
    months:['Mar 26','Apr 26','May 26','Jun 26','Jul 26','Aug 26','Sep 26','Oct 26','Nov 26','Dec 26','Jan 27','Feb 27'],
    metrics:[
      {key:'visitors',label:'Website Visitors',hint:'Total sessions / mo',cat:'web',monthly:['3000','','','','','','','','','','',''],notes:'First week ~3,000 — strong launch'},
      {key:'unique',label:'Unique Visitors',hint:'Unique users / mo',cat:'web',monthly:['','','','','','','','','','','',''],notes:''},
      {key:'toppost',label:'Top Post Views',hint:'Best single post views',cat:'web',monthly:['','','','','','','','','','','',''],notes:''},
      {key:'subs',label:'Email Subscribers',hint:'Mailchimp list total',cat:'email',monthly:['80','','','','','','','','','','',''],notes:'80+ in first week — exceptional early traction'},
      {key:'openrate',label:'Email Open Rate',hint:'% last campaign',cat:'email',monthly:['','','','','','','','','','','',''],notes:'Industry avg 20–25%. Aim for 40%+'},
      {key:'clickrate',label:'Email Click Rate',hint:'% last campaign',cat:'email',monthly:['','','','','','','','','','','',''],notes:'Industry avg 2–3%. Aim for 8%+'},
      {key:'ig',label:'Instagram Followers',hint:'Profile total',cat:'social',monthly:['','','','','','','','','','','',''],notes:''},
      {key:'igreach',label:'Instagram Reach',hint:'Accounts reached / mo',cat:'social',monthly:['','','','','','','','','','','',''],notes:''},
      {key:'fb',label:'Facebook Followers',hint:'Page followers total',cat:'social',monthly:['','','','','','','','','','','',''],notes:''},
      {key:'intdone',label:'Interviews Completed',hint:'Recorded this month',cat:'content',monthly:['','','','','','','','','','','',''],notes:'Goal: 52 over the year — ~4–5/mo'},
      {key:'postslive',label:'Posts Published',hint:'Live this month',cat:'content',monthly:['','','','','','','','','','','',''],notes:'Goal: ~5–6 posts/mo'},
      {key:'speakinq',label:'Speaking Inquiries',hint:'Inbound / outbound',cat:'speaking',monthly:['','','','','','','','','','','',''],notes:''},
    ],
  },
  crm:[
    {name:'Patient Advocate Foundation',cat:'Patient Advocacy Org',note:'National org — partnership + content collaboration',date:'—',status:'research'},
    {name:'National Patient Advocate Foundation (NPAF)',cat:'Patient Advocacy Org',note:'Policy-focused arm — op-ed or speaking opportunity',date:'—',status:'research'},
    {name:'Patients Rising',cat:'Patient Advocacy Org',note:'Medication access focus — good crossover audience',date:'—',status:'research'},
    {name:'Society for Participatory Medicine',cat:'Patient Advocacy Org',note:'Strong alignment with Osler argument',date:'—',status:'research'},
    {name:'Disabled American Veterans (DAV)',cat:'Veteran Org',note:'VSO interview connection + large audience reach',date:'—',status:'research'},
    {name:'VFW — Veterans of Foreign Wars',cat:'Veteran Org',note:'Large membership — content distribution potential',date:'—',status:'research'},
    {name:'American Legion',cat:'Veteran Org',note:'Agent Orange survivor network connection possible',date:'—',status:'research'},
    {name:'Team Red White & Blue',cat:'Veteran Org',note:'Younger veteran audience — strong social media presence',date:'—',status:'research'},
    {name:'Wounded Warrior Project',cat:'Veteran Org',note:'Major reach — speaking / advocacy collaboration',date:'—',status:'research'},
    {name:'Mission 22',cat:'Veteran Mental Health',note:'Veteran mental health + faith angle strong fit',date:'—',status:'research'},
    {name:'Stonebridge Bible Church — Nashville',cat:'Faith Community',note:'Home church — speaking + community amplification',date:'—',status:'research'},
    {name:'The Gospel Coalition',cat:'Faith Media',note:'Frankl + faith + suffering angle — strong content fit',date:'—',status:'research'},
    {name:'STAT News',cat:'Healthcare Media',note:'Top healthcare journalism outlet — patient advocacy angle',date:'—',status:'research'},
    {name:'KevinMD',cat:'Healthcare Blog',note:'High-traffic platform — submit op-ed',date:'—',status:'research'},
    {name:'MedPage Today',cat:'Healthcare Media',note:'Provider-facing — good for clinical credibility',date:'—',status:'research'},
    {name:'The Atlantic — Health Desk',cat:'General Media',note:'Long-form narrative fit — pitch "The Medic Who Became the Patient"',date:'—',status:'research'},
    {name:'NPR — Health Coverage',cat:'Public Radio',note:'Human interest angle — surgery day story is NPR-ready',date:'—',status:'research'},
    {name:'The Nocturnists Podcast',cat:'Healthcare Podcast',note:'Clinician storytelling — strong crossover fit',date:'—',status:'research'},
    {name:'Bedside Manner Podcast',cat:'Healthcare Podcast',note:'Patient-provider communication focus',date:'—',status:'research'},
    {name:'Fixing Healthcare Podcast',cat:'Healthcare Podcast',note:'System critique — Phase 3+7 content alignment',date:'—',status:'research'},
    {name:'Veteran On The Move',cat:'Veteran Podcast',note:'Veteran entrepreneur / advocacy audience',date:'—',status:'research'},
    {name:'Grunt Work Podcast',cat:'Veteran Podcast',note:'Mil-to-civilian transition — medic story fits well',date:'—',status:'research'},
    {name:'Patient Experience Institute (PXI)',cat:'Speaking / Conference',note:'Annual conference — submit speaker proposal',date:'—',status:'research'},
    {name:'HIMSS Global Conference',cat:'Speaking / Conference',note:'Health IT — Cerner/Epic post + documentation argument',date:'—',status:'research'},
    {name:'National Veterans Creative Arts Festival',cat:'Speaking / Veterans',note:'VA-affiliated arts + healing — faith angle strong',date:'—',status:'research'},
    {name:'American Association for Patient Experience (AAPEx)',cat:'Speaking / Conference',note:'Patient experience keynote opportunity',date:'—',status:'research'},
    {name:'Institute for Healthcare Improvement (IHI)',cat:'Healthcare Org',note:'Patient safety + quality — Osler argument alignment',date:'—',status:'research'},
    {name:'Beryl Institute',cat:'Healthcare Org',note:'Patient experience community — content partnership',date:'—',status:'research'},
    {name:'National Alliance for Mental Illness (NAMI)',cat:'Mental Health Org',note:'Medical trauma + phase 5 content angle',date:'—',status:'research'},
    {name:'Caregiver Action Network',cat:'Caregiver Org',note:'Phase 7 caregivers post — partnership + distribution',date:'—',status:'research'},
    {name:'Rare Disease Legislative Advocates (RDLA)',cat:'Patient Advocacy',note:'Rare disease interview + Phase 5 content',date:'—',status:'research'},
    {name:'Global Genes — Rare Disease Alliance',cat:'Patient Advocacy',note:'Large rare disease network — content distribution',date:'—',status:'research'},
    {name:'HealthStories Project',cat:'Patient Stories Media',note:'Patient narrative platform — strong content fit',date:'—',status:'research'},
    {name:'Costs of Care',cat:'Healthcare Org',note:'Medical billing transparency — Phase 3 alignment',date:'—',status:'research'},
    {name:'American College of Healthcare Executives (ACHE)',cat:'Healthcare Professional Org',note:'Admin audience — speaking + credibility building',date:'—',status:'research'},
    {name:'NEJM Catalyst',cat:'Healthcare Journal',note:'Healthcare delivery innovation — submit op-ed',date:'—',status:'research'},
    {name:'Health Affairs',cat:'Healthcare Policy Media',note:'Policy + admin — Phase 3 + 7 content',date:'—',status:'research'},
    {name:'Modern Healthcare',cat:'Healthcare Media',note:'Healthcare business — VP of Operations interview hook',date:'—',status:'research'},
    {name:'Doximity (DocsInProgress)',cat:'Healthcare Media',note:'Physician-facing platform — provider audience',date:'—',status:'research'},
    {name:'Christianity Today',cat:'Faith Media',note:'Faith + suffering + meaning-making — Frankl angle',date:'—',status:'research'},
    {name:'The Way Home Podcast (Carl Trueman)',cat:'Faith Podcast',note:'Christian worldview + culture — Phase 7 system critique',date:'—',status:'research'},
    {name:'Military.com',cat:'Veteran Media',note:'Large veteran readership — medic-as-patient story',date:'—',status:'research'},
    {name:'Task & Purpose',cat:'Veteran Media',note:'Younger veteran audience — strong social engagement',date:'—',status:'research'},
    {name:'We Are The Mighty',cat:'Veteran Media',note:'Veteran culture + healthcare + identity',date:'—',status:'research'},
    {name:'Vanderbilt University Medical Center — Communications',cat:'Healthcare Institution',note:'Surgery at Vanderbilt — pitch collaboration / editorial',date:'—',status:'research'},
  ]
};

// ─── YEAR AT A GLANCE DATA ───────────────────────
const YAG=[
  {q:'Q1 · Mar–May 2026',color:'var(--red)',items:[
    {text:'Surgery recovery + site launch',done:false},
    {text:'Publish Posts 01–12 (Phases 1–2)',done:false},
    {text:'First 4 interviews recorded',done:false},
    {text:'500 email subscribers',done:false},
    {text:'Begin WGU Term 1',done:false},
  ]},
  {q:'Q2 · Jun–Aug 2026',color:'var(--gold)',items:[
    {text:'Publish Posts 13–28 (Phases 2–3)',done:false},
    {text:'8 interviews recorded total',done:false},
    {text:'1,500 email subscribers',done:false},
    {text:'First speaking inquiry',done:false},
    {text:'WGU Term 2 complete',done:false},
  ]},
  {q:'Q3 · Sep–Nov 2026',color:'#3a8a50',items:[
    {text:'Publish Posts 29–44 (Phases 4–5)',done:false},
    {text:'20 interviews recorded total',done:false},
    {text:'3,000 email subscribers',done:false},
    {text:'First paid speaking engagement',done:false},
    {text:'WGU Term 3 complete',done:false},
  ]},
  {q:'Q4 · Dec 26–Feb 27',color:'#9aadcc',items:[
    {text:'Publish Posts 45–64 (Phases 6–7)',done:false},
    {text:'52 interviews recorded total',done:false},
    {text:'5,000 email subscribers',done:false},
    {text:'Book proposal drafted',done:false},
    {text:'WGU Term 4 complete',done:false},
  ]},
];

// ─── CLOCK / DATE ───────────────────────────────
function tick(){
  const n=new Date(),h=n.getHours(),m=String(n.getMinutes()).padStart(2,'0'),ap=h>=12?'PM':'AM';
  const clk=document.getElementById('clk');
  if(clk)clk.textContent=`${h%12||12}:${m} ${ap}`;
  const dy=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const mo=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const lbl=`${dy[n.getDay()]} · ${mo[n.getMonth()]} ${n.getDate()}, ${n.getFullYear()}`;
  const todayLbl=document.getElementById('today-lbl');
  if(todayLbl)todayLbl.textContent=lbl;
  const dd=document.getElementById('dd');
  if(dd)dd.textContent=n.getDate();
  const df=document.getElementById('df');
  if(df)df.textContent=`${dy[n.getDay()]} · ${mo[n.getMonth()]} ${n.getFullYear()}`;
}

// ─── LOGIN ───────────────────────────────────────
const PW="Samps0n2001$&@";
let USERS=["joe","peck"];

function doLogin(){
  const u=document.getElementById("l-user").value.trim().toLowerCase();
  const p=document.getElementById("l-pass").value;
  const e=document.getElementById("lerr");
  if(!u){e.textContent="Enter a username.";return;}
  if(!USERS.includes(u)){e.textContent="Username not recognized.";return;}
  if(p!==PW){e.textContent="Incorrect password.";return;}
  document.getElementById("login-screen").classList.add("hidden");
  sessionStorage.setItem("pm_auth","1");
  e.textContent="";
}
function openUsers(){renderUserList();document.getElementById("users-modal").classList.add("open");}
function closeUsers(){document.getElementById("users-modal").classList.remove("open");}
function renderUserList(){
  document.getElementById("user-list").innerHTML=USERS.map((u,i)=>`<div class="user-row"><span class="user-name">${u}</span>${USERS.length>1?`<button class="user-del" onclick="delUser(${i})">Remove</button>`:""}</div>`).join("");
}
function addUser(){
  const inp=document.getElementById("new-user");
  const v=inp.value.trim().toLowerCase();
  if(!v||USERS.includes(v))return;
  USERS.push(v);inp.value="";renderUserList();
}
function delUser(i){if(USERS.length<=1)return;USERS.splice(i,1);renderUserList();}
function checkAuth(){
  if(sessionStorage.getItem("pm_auth")==="1"){
    const ls=document.getElementById("login-screen");
    if(ls)ls.classList.add("hidden");
  }
}
function signOut(){
  sessionStorage.removeItem("pm_auth");
  const ls=document.getElementById("login-screen");
  if(ls)ls.classList.remove("hidden");
}

// ─── NAVIGATION ──────────────────────────────────
function nav(id,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ni,.ul').forEach(b=>b.classList.remove('active'));
  const pg=document.getElementById('page-'+id);
  if(pg)pg.classList.add('active');
  if(btn&&btn.classList)btn.classList.add('active');
}

// ─── COLLAPSE / EXPAND ───────────────────────────
function toggleSec(headEl){
  headEl.classList.toggle('collapsed');
  const body=headEl.nextElementSibling;
  if(body&&body.classList.contains('sec-body'))body.classList.toggle('collapsed');
}

// ─── DETAIL MODAL ────────────────────────────────
function openDM(title,sub,bodyHTML){
  document.getElementById('dm-title').textContent=title;
  document.getElementById('dm-sub').textContent=sub;
  document.getElementById('dm-body').innerHTML=bodyHTML;
  document.getElementById('dm').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeDM(){
  document.getElementById('dm').classList.remove('open');
  document.body.style.overflow='';
}

// ─── TASK HELPERS ────────────────────────────────
function updateStats(){
  const all=Object.values(S.tasks).flat();
  const done=document.getElementById('s-done');
  const rem=document.getElementById('s-rem');
  if(done)done.textContent=all.filter(t=>t.done).length;
  if(rem)rem.textContent=all.filter(t=>!t.done).length;
}

// ─── YAG TOGGLE ──────────────────────────────────
function togYAG(qi,ii){YAG[qi].items[ii].done=!YAG[qi].items[ii].done;renderYAG();}

function renderYAG(){
  const el=document.getElementById('yag-body');if(!el)return;
  el.innerHTML=YAG.map((q,qi)=>`
    <div style="margin-bottom:12px;">
      <div style="font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${q.color};margin-bottom:5px;padding-bottom:4px;border-bottom:1px solid var(--rule-lt);">${q.q}</div>
      ${q.items.map((it,ii)=>`<div style="display:flex;align-items:flex-start;gap:7px;padding:4px 0;cursor:pointer;" onclick="togYAG(${qi},${ii})">
        <div style="width:13px;height:13px;border:1.5px solid ${it.done?'var(--navy)':'var(--rule)'};background:${it.done?'var(--navy)':'transparent'};flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;">
          ${it.done?'<svg width="8" height="7" viewBox="0 0 8 7"><path d="M1 3.5L3 5.5L7 1" stroke="#fff" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>':''}
        </div>
        <div style="font-family:var(--fs);font-size:11.5px;color:${it.done?'var(--muted-lt)':'var(--ink-md)'};${it.done?'text-decoration:line-through;':''};line-height:1.3;">${it.text}</div>
      </div>`).join('')}
    </div>`).join('');
}
