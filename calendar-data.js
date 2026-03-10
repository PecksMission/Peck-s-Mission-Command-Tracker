import { useState, useMemo, useEffect, useRef } from "react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600;1,700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400;1,600&family=Source+Sans+3:wght@400;600;700&display=swap');
:root{
  --navy:#1a2744;--navy-deep:#111b33;--navy-mid:#243058;
  --red:#9c1f28;--red-lt:#c0272f;
  --cream:#f5f0e8;--cream-dk:#ede8db;
  --rule:#c8b99a;--rule-lt:#ddd3c0;
  --ink:#1a1714;--ink-md:#3d3530;
  --muted:#6b5f52;--muted-lt:#9a8f84;
  --white:#faf7f2;
  --gold:#b8860b;--gold-lt:#d4a017;
  --green:#2d6b3f;--green-lt:#3a8a50;
  --fd:'Playfair Display',Georgia,serif;
  --fs:'Source Serif 4',Georgia,serif;
  --fn:'Source Sans 3',Helvetica,sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:var(--cream);color:var(--ink);font-family:var(--fs);font-size:15px;line-height:1.65;}

/* UTIL BAR */
.util-bar{background:var(--navy-deep);padding:0 32px;height:36px;display:flex;align-items:center;justify-content:space-between;}
.ul{font-family:var(--fn);font-size:11px;color:#9aadcc;letter-spacing:.03em;margin-right:18px;}
.save-badge{font-family:var(--fn);font-size:10px;letter-spacing:.08em;color:#6a7a99;font-style:italic;transition:color .3s;}
.save-badge.saved{color:var(--green-lt);}

/* MASTHEAD */
.masthead{background:var(--navy);padding:20px 32px 0;border-bottom:3px solid var(--red);position:relative;}
.masthead::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--gold);}
.mh-inner{max-width:1200px;margin:0 auto;display:flex;align-items:flex-end;justify-content:space-between;padding-bottom:16px;flex-wrap:wrap;gap:14px;}
.mh-brand{display:flex;align-items:flex-end;gap:18px;}
.mh-seal{width:62px;height:62px;border:2px solid rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.05);flex-shrink:0;}
.mh-seal-txt{font-family:var(--fd);font-size:21px;font-weight:900;color:var(--gold-lt);}
.mh-eyebrow{font-family:var(--fn);font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-lt);margin-bottom:4px;}
.mh-title{font-family:var(--fd);font-size:clamp(22px,3vw,36px);font-weight:700;color:#fff;letter-spacing:-.01em;line-height:1.05;}
.mh-sub{font-family:var(--fs);font-size:13px;font-style:italic;color:#9aadcc;margin-top:4px;}
.mh-stats{display:flex;gap:22px;flex-wrap:wrap;}
.ms{text-align:right;}
.ms-num{font-family:var(--fd);font-size:26px;font-weight:700;color:#fff;line-height:1;}
.ms-num.gold{color:var(--gold-lt);}
.ms-lbl{font-family:var(--fn);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:#6a7a99;margin-top:2px;}

/* STICKY TOOLBAR — nav + filter bar combined */
.sticky-bar{position:sticky;top:0;z-index:200;background:var(--navy-mid);border-bottom:1px solid rgba(255,255,255,.08);}
.pnav-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;overflow-x:auto;scrollbar-width:none;padding:0 32px;}
.pnav-inner::-webkit-scrollbar{display:none;}
.ni{background:none;border:none;cursor:pointer;font-family:var(--fn);font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#8a9dbb;padding:11px 13px;border-bottom:3px solid transparent;margin-bottom:-1px;white-space:nowrap;transition:all .15s;}
.ni:hover{color:#c8d8ee;}
.ni.active{color:#fff;border-bottom-color:var(--red-lt);}
.filter-bar{background:var(--navy-deep);border-bottom:1px solid rgba(255,255,255,.05);padding:7px 32px;}
.filter-inner{max-width:1200px;margin:0 auto;display:flex;gap:5px;align-items:center;flex-wrap:wrap;}
.cfb{background:transparent;border:1px solid rgba(255,255,255,.12);cursor:pointer;font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:#8a9dbb;padding:3px 11px;transition:all .15s;white-space:nowrap;}
.cfb:hover{border-color:rgba(255,255,255,.3);color:#c8d8ee;}
.cfb.active{background:var(--red-lt);border-color:var(--red-lt);color:#fff;}
.cfb-div{width:1px;height:16px;background:rgba(255,255,255,.1);margin:0 4px;}
.collapse-all-btn{margin-left:auto;background:none;border:1px solid rgba(255,255,255,.12);cursor:pointer;font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:#8a9dbb;padding:3px 11px;transition:all .15s;}
.collapse-all-btn:hover{color:#c8d8ee;border-color:rgba(255,255,255,.3);}

/* PAGE */
.cw{max-width:1200px;margin:0 auto;padding:20px 32px 80px;}

/* MONTH DIVIDER */
.month-div{display:flex;align-items:center;gap:14px;padding:22px 0 8px;}
.month-line{flex:1;height:1px;background:var(--rule);}
.month-tag{font-family:var(--fd);font-size:17px;font-weight:700;font-style:italic;color:var(--navy);padding:0 4px;white-space:nowrap;}

/* WEEK BLOCK */
.week-block{margin-bottom:14px;border:1px solid var(--rule);animation:fadeIn .15s ease both;}
.week-header{background:var(--navy);padding:7px 16px;display:flex;align-items:center;gap:12px;border-bottom:2px solid var(--red);cursor:pointer;user-select:none;}
.week-header:hover{background:var(--navy-mid);}
.wh-toggle{font-size:11px;color:#6a7a99;transition:transform .2s;flex-shrink:0;line-height:1;}
.wh-toggle.collapsed{transform:rotate(-90deg);}
.wh-num{font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#6a7a99;}
.wh-range{font-family:var(--fd);font-size:13px;font-weight:600;color:#fff;font-style:italic;}
.wh-phase{margin-left:auto;font-family:var(--fn);font-size:8px;font-weight:700;letter-spacing:.11em;text-transform:uppercase;color:var(--gold-lt);background:rgba(255,255,255,.06);padding:3px 9px;border:1px solid rgba(255,255,255,.1);}
.wh-summary{font-family:var(--fs);font-size:11px;font-style:italic;color:#8a9dbb;margin-left:8px;}

/* COLLAPSIBLE BODY */
.week-body{overflow:hidden;transition:max-height .22s ease;}
.week-body.open{max-height:600px;}
.week-body.closed{max-height:0;}

/* DAY GRID */
.week-grid{display:grid;grid-template-columns:1fr 1fr 1fr;}
.day-col{border-right:1px solid var(--rule);background:var(--white);}
.day-col:last-child{border-right:none;}
.day-head{background:var(--cream-dk);border-bottom:1px solid var(--rule);padding:6px 14px;display:flex;align-items:center;justify-content:space-between;}
.dh-label{font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.17em;text-transform:uppercase;color:var(--muted);}
.dh-date{font-family:var(--fn);font-size:10px;color:var(--muted-lt);}

/* TYPE BADGES */
.ctb{display:inline-block;font-family:var(--fn);font-size:8px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;padding:2px 6px;border:1px solid;}
.ct-sl{color:var(--ink-md);border-color:var(--rule);background:var(--cream-dk);}
.ct-in{color:var(--green);border-color:var(--green);background:rgba(45,107,63,.06);}
.ct-ch{color:var(--navy);border-color:var(--navy);background:rgba(26,39,68,.06);}
.ct-co{color:var(--gold);border-color:var(--gold);background:rgba(184,134,11,.06);}

/* VIEW MODE */
.post-card{padding:11px 14px;cursor:pointer;position:relative;}
.post-card:hover{background:var(--cream-dk);}
.post-card:hover .edit-hint{opacity:1;}
.edit-hint{position:absolute;top:8px;right:10px;font-family:var(--fn);font-size:8px;color:var(--muted-lt);letter-spacing:.06em;text-transform:uppercase;opacity:0;transition:opacity .15s;pointer-events:none;}
.pc-meta{display:flex;align-items:center;gap:7px;margin-bottom:5px;}
.pc-num{font-family:var(--fd);font-size:18px;font-weight:700;color:var(--rule);line-height:1;}
.pc-title{font-family:var(--fs);font-size:13px;color:var(--ink);line-height:1.4;margin-bottom:3px;}
.pc-guide{font-family:var(--fs);font-size:11px;font-style:italic;color:var(--muted);line-height:1.4;}

/* STATUS BADGE */
.status-badge{font-family:var(--fn);font-size:8px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;padding:2px 6px;border:1px solid;cursor:pointer;margin-left:auto;user-select:none;transition:all .12s;}
.st-planned{color:var(--muted-lt);border-color:var(--rule-lt);}
.st-drafting{color:var(--gold);border-color:var(--gold);background:rgba(184,134,11,.07);}
.st-ready{color:var(--navy);border-color:var(--navy);background:rgba(26,39,68,.07);}
.st-live{color:var(--green-lt);border-color:var(--green-lt);background:rgba(58,138,80,.07);}

/* EDIT MODE */
.edit-card{padding:11px 14px;background:var(--cream-dk);border-top:2px solid var(--navy);animation:slideDown .15s ease both;}
.edit-row{margin-bottom:8px;}
.edit-lbl{font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--muted);margin-bottom:3px;}
.edit-inp{width:100%;background:var(--white);border:1px solid var(--rule);padding:6px 9px;font-family:var(--fs);font-size:13px;color:var(--ink);outline:none;resize:none;line-height:1.45;}
.edit-inp:focus{border-color:var(--navy);}
.edit-inp::placeholder{color:var(--muted-lt);font-style:italic;}
.edit-num-inp{width:56px;background:var(--white);border:1px solid var(--rule);padding:5px 8px;font-family:var(--fd);font-size:16px;font-weight:700;color:var(--ink-md);outline:none;text-align:center;}
.edit-num-inp:focus{border-color:var(--navy);}
.edit-actions{display:flex;gap:6px;margin-top:10px;align-items:center;}
.btn-save{background:var(--navy);border:none;color:#fff;font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;padding:6px 14px;cursor:pointer;}
.btn-save:hover{background:var(--navy-deep);}
.btn-cancel{background:none;border:1px solid var(--rule);color:var(--muted);font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;padding:6px 12px;cursor:pointer;}
.btn-cancel:hover{border-color:var(--muted);color:var(--ink);}
.status-select{background:var(--white);border:1px solid var(--rule);padding:4px 8px;font-family:var(--fn);font-size:10px;color:var(--ink);outline:none;cursor:pointer;}
.status-select:focus{border-color:var(--navy);}

/* THURSDAY */
.thu-area{padding:10px 14px;}
.thu-lbl{font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--muted-lt);margin-bottom:5px;}
.thu-inp{width:100%;background:transparent;border:none;border-bottom:1px solid var(--rule-lt);padding:5px 0;font-family:var(--fs);font-size:13px;color:var(--ink);outline:none;resize:none;min-height:34px;font-style:italic;line-height:1.5;}
.thu-inp:focus{border-bottom-color:var(--navy);}
.thu-inp::placeholder{color:var(--muted-lt);}

/* FRIDAY LOCKED */
.fri-locked{padding:14px;text-align:center;}
.fri-lock-txt{font-family:var(--fn);font-size:9px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--rule);}
.fri-lock-sub{font-family:var(--fs);font-size:10px;font-style:italic;color:var(--rule-lt);margin-top:2px;}
.day-complete{padding:12px 14px;font-family:var(--fs);font-size:11px;font-style:italic;color:var(--rule);}

/* HIDDEN by type filter */
.day-col.filtered{display:none;}
.day-col.filtered-dim .post-card{opacity:.22;pointer-events:none;}
.day-col.filtered-dim .thu-area{opacity:.22;pointer-events:none;}

@keyframes fadeIn{from{opacity:0;transform:translateY(-4px);}to{opacity:1;transform:translateY(0);}}
@keyframes slideDown{from{opacity:0;max-height:0;}to{opacity:1;max-height:400px;}}
`;

/* ── HELPERS ── */
function addDays(d,n){const r=new Date(d);r.setDate(r.getDate()+n);return r;}
function fmt(d){return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});}
function fmtMonth(d){return d.toLocaleDateString("en-US",{month:"long",year:"numeric"});}

const W1_MON           = new Date("2026-03-09T12:00:00");
const INTERVIEWS_START = new Date("2026-04-03T12:00:00");
const STATUSES         = ["planned","drafting","ready","live"];

const WEEKS = Array.from({length:52},(_,i)=>{
  const mon=addDays(W1_MON,i*7);
  return{num:i+1,mon,tue:addDays(mon,1),thu:addDays(mon,3),fri:addDays(mon,4)};
});

const PHASES=[
  "Phase 1","Phase 2","Phase 2","Phase 2","Phase 2","Phase 2","Phase 2",
  "Phase 3","Phase 3","Phase 3","Phase 4","Phase 4",
  "Phase 5","Phase 5","Phase 5","Phase 5","Phase 5","Phase 5","Phase 5",
  "Phase 6","Phase 6","Phase 6","Phase 6","Phase 6","Phase 6","Phase 6",
  "Phase 7","Phase 7","Phase 7","Phase 7","Phase 7","Phase 7","Phase 7","Phase 7",
];

const DEFAULT_SL=[
  {n:"08",t:"sl",ti:"The Thorn I Got to Have Removed",gu:"Solo · 2 Corinthians 12:9 expansion · theological center of the site",st:"planned"},
  {n:"10",t:"sl",ti:"What You're Wearing Tells Me Everything",gu:"Solo · Provider appearance / dress code · appearance is communication",st:"planned"},
  {n:"11",t:"sl",ti:"The Way You Talk to Me Matters More Than What You Say",gu:"Solo · Provider voice + tone · Dad's 7/38/55 framework",st:"planned"},
  {n:"14",t:"sl",ti:"What the Walker Taught Me That the Bench Never Could",gu:"Solo · Roy Benavidez · Fort Sam Houston · recovery as training",st:"planned"},
  {n:"16",t:"sl",ti:"The Gospel According to a Vision Test",gu:"Solo · Easter card moment · Surgery Day · faith without performance",st:"planned"},
  {n:"18",t:"sl",ti:"Patch Adams Was Right — And He Was Missing Something",gu:"Solo · Patch Adams + medic-to-patient arc · where he was right, what he missed",st:"planned"},
  {n:"20",t:"sl",ti:"What the Chart Can't Capture",gu:"Solo · Chart synthesis · official vs full record · where patients get lost",st:"planned"},
  {n:"22",t:"sl",ti:"What Cerner Knows That Epic Doesn't — And Vice Versa",gu:"Solo · NP Cerner-to-Epic transition · documentation systems shape care",st:"planned"},
  {n:"24",t:"sl",ti:"The Artillery Man's Diagnosis",gu:"Solo · Field artillery soldier companion · Doc vs Band-Aid argument",st:"planned"},
  {n:"26",t:"sl",ti:"What We Owe the People Who Signed the Blank Check",gu:"Solo · Veteran healthcare · bridge from system critique to veteran stakes",st:"planned"},
  {n:"29",t:"sl",ti:"The Mission Behind the Mission",gu:"Solo · pecksmission.com origin + faith · Patch Adams + Frankl + Benavidez + 2 Cor · closing statement",st:"planned"},
  {n:"30",t:"sl",ti:"They Worked Next to Me and Still Didn't Believe It",gu:"Solo · Colleagues + diagnosis disbelief · disbelief as clinical failure",st:"planned"},
  {n:"31",t:"sl",ti:"What Misdiagnosis Actually Costs",gu:"Solo · Structural argument · physical, financial, psychological cost",st:"planned"},
  {n:"33",t:"sl",ti:"The Patient Who Knew Too Much",gu:"Solo · Clinical training as patient — double-edged sword",st:"planned"},
  {n:"34",t:"sl",ti:"25 Years Is Not a Fluke — It's a Pattern",gu:"Solo · Diagnostic delay · system built for clear presentations",st:"planned"},
  {n:"36",t:"sl",ti:"You Don't Look Sick",gu:"Solo · Invisible illness · burden of proof falls on the patient",st:"planned"},
  {n:"37",t:"sl",ti:"The Difference Between a Symptom and a Story",gu:"Solo · Medicine's diagnostic language · what gets lost in translation",st:"planned"},
  {n:"39",t:"sl",ti:"The Field Sobriety Test I Failed Stone Cold Sober",gu:"Solo · Military + neurological symptoms · failed test, blowing zeros · compressed brainstem",st:"planned"},
  {n:"40",t:"sl",ti:"What Osler Knew That We Keep Forgetting",gu:"Solo · Osler / system critique · 100+ years and still",st:"planned"},
  {n:"42",t:"sl",ti:"What Your Voice Does to Me Before Your Words Do Anything",gu:"Solo · 7/38/55 framework · Dad's model · Surgery Day moments · clinical case for vocal delivery",st:"planned"},
  {n:"43",t:"sl",ti:"What You're Wearing When You Walk in the Room",gu:"Solo · Provider appearance · Part Two version",st:"planned"},
  {n:"45",t:"sl",ti:"Continuity Is a Person, Not a Protocol",gu:"Solo · Shift change · Matt's name on the board · what continuity actually means",st:"planned"},
  {n:"46",t:"sl",ti:"The Language of Medicine Was Never Written for Patients",gu:"Solo · Medical literacy · patient navigation · system designed for providers",st:"planned"},
  {n:"48",t:"sl",ti:"How to Advocate for Yourself When Nobody Is Listening",gu:"Solo · Practical patient advocacy · specific moves that work · caregivers share this",st:"planned"},
  {n:"50",t:"sl",ti:"What Happens in the Break Room Ends Up at the Bedside",gu:"Solo · Care culture · culture is set between patients, not in the mission statement",st:"planned"},
  {n:"51",t:"sl",ti:"Pain Is Not a Number",gu:"Solo · 1–10 pain scale as documentation tool, not a clinical one · what it costs to translate lived pain",st:"planned"},
  {n:"53",t:"sl",ti:"The Chart Is the Official Version. It Is Not the Full Version.",gu:"Solo · Chart synthesis · accurate vs complete · where patients get lost",st:"planned"},
  {n:"54",t:"sl",ti:"What the Documentation System Rewards — And What It Punishes",gu:"Solo · EHR incentive structures · tool changes workflow · workflow changes care",st:"planned"},
  {n:"56",t:"sl",ti:"What the Second Opinion Actually Costs",gu:"Solo · Patient trust · emotional and social cost of telling the system you don't trust it",st:"planned"},
  {n:"57",t:"sl",ti:"The Caregiver Nobody Asked About",gu:"Solo · Sapp + family in the waiting room · what caregivers go through that the system has no language for",st:"planned"},
  {n:"59",t:"sl",ti:"What We Owe the People Who Signed the Blank Check",gu:"Solo · Veteran healthcare · Part Two version · your combat medic background earns the right",st:"planned"},
  {n:"60",t:"sl",ti:"The Medic Who Became the Patient",gu:"Solo · Full identity arc · what transferred from training · what had to be unlearned · walker as starting line",st:"planned"},
  {n:"62",t:"sl",ti:"The Combat Medic Training Gap",gu:"Solo · 68W pipeline · civilian healthcare transition · what it costs when the training stops at the field",st:"planned"},
  {n:"63",t:"sl",ti:"What Comes After the Chart",gu:"Solo · Discharge + post-hospitalization · recovery is not a clinical event, it's a human one",st:"planned"},
];

const DEFAULT_IN=[
  {n:"06",t:"in",ti:"The Medical Lab Scientist — The Person You'll Never Meet",gu:"Medical Lab Scientist · Barnes Jewish, St. Louis",st:"planned"},
  {n:"12",t:"in",ti:"The CVICU Nurse — What We See That You Don't",gu:"CVICU Nurse · shared floor, two vantage points",st:"planned"},
  {n:"15",t:"in",ti:"The Float Nurse — A Hospital Seen From Every Floor",gu:"Float Nurse · care culture variation across units",st:"planned"},
  {n:"17",t:"in",ti:"The Ultrasound Tech — The Invisible Clinician",gu:"Ultrasound Technician · trained silence · what the note misses",st:"planned"},
  {n:"19",t:"in",ti:"The Nurse Who Had Cancer — The Floor and the Bed",gu:"Nurse with Cancer · years giving care, then receiving it",st:"planned"},
  {n:"21",t:"in",ti:"The PA — What Makes a Good Doc",gu:"Physician's Assistant · inside the clinical system · Osler gap",st:"planned"},
  {n:"23",t:"in",ti:"The Combat Medic Drill Sergeant — What We Built and What We Left Out",gu:"68W Combat Medic Drill Sergeant · origin post",st:"planned"},
  {n:"25",t:"in",ti:"The VP of Operations — Where the System Breaks and Why",gu:"VP of Operations · Level 1 Trauma Hospital · operational diagnosis",st:"planned"},
  {n:"27",t:"in",ti:"The VSO — What the VA Doesn't Tell You",gu:"Veteran Service Officer · VSA claim denials · patient advocacy",st:"planned"},
  {n:"32",t:"in",ti:"Business Development, Vanderbilt — The Institutional View of the Gap",gu:"Leader of Business Development · Vanderbilt University Medical Center",st:"planned"},
  {n:"35",t:"in",ti:"Emergency Physician — The First Five Minutes",gu:"Emergency Physician · triage of humanity before triage of medicine",st:"planned"},
  {n:"38",t:"in",ti:"Neurologist — What the Imaging Misses",gu:"Neurologist · structural vs experiential · decade before the scan",st:"planned"},
  {n:"41",t:"in",ti:"Rare Disease Patient Advocate — When the System Has No Template",gu:"Rare Disease Patient Advocate · surviving a system not built for your condition",st:"planned"},
  {n:"44",t:"in",ti:"Float Nurse — A Hospital Seen From Every Floor",gu:"Float Nurse · Part Two appearance",st:"planned"},
  {n:"47",t:"in",ti:"Patient Experience Officer — What the Scores Don't Capture",gu:"Patient Experience Officer / Director · HCAHPS measures satisfaction, not humanity",st:"planned"},
  {n:"49",t:"in",ti:"Hospital Chaplain — The Room Nobody Thinks to Enter",gu:"Hospital Chaplain · spiritual layer the system has no language for",st:"planned"},
  {n:"52",t:"in",ti:"Nurse Who Became the Patient — The Floor and the Bed",gu:"Nurse with Personal Medical Crisis · Part Two version · what changed in practice",st:"planned"},
  {n:"55",t:"in",ti:"VP of Operations, Level 1 Trauma — Where the System Breaks and Why",gu:"VP of Operations · Level 1 Trauma · Part Two version",st:"planned"},
  {n:"58",t:"in",ti:"PA — What Makes a Good Provider, From Inside the System",gu:"Physician's Assistant · Part Two version",st:"planned"},
  {n:"61",t:"in",ti:"VSO — What the VA Doesn't Tell You",gu:"Veteran Service Officer · Part Two version",st:"planned"},
  {n:"64",t:"in",ti:"Combat Medic Drill Sergeant — What We Built and What We Left Out",gu:"Combat Medic DS · Part Two version · final interview on the calendar",st:"planned"},
];

/* ── EDITABLE POST CARD ── */
function PostCard({post, typeLabel, onSave}){
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState({...post});
  const statusCls={planned:"st-planned",drafting:"st-drafting",ready:"st-ready",live:"st-live"};
  const typeCls={sl:"ct-sl",in:"ct-in",ch:"ct-ch",co:"ct-co"};

  const cycleStatus=e=>{
    e.stopPropagation();
    const idx=STATUSES.indexOf(post.st);
    onSave({...post,st:STATUSES[(idx+1)%STATUSES.length]});
  };
  const save=()=>{onSave(draft);setEditing(false);};
  const cancel=()=>{setDraft({...post});setEditing(false);};

  if(editing) return(
    <div className="edit-card">
      <div className="edit-row" style={{display:"flex",gap:8,alignItems:"flex-end"}}>
        <div>
          <div className="edit-lbl">Post #</div>
          <input className="edit-num-inp" value={draft.n} onChange={e=>setDraft(p=>({...p,n:e.target.value}))}/>
        </div>
        <div style={{flex:1}}>
          <div className="edit-lbl">Status</div>
          <select className="status-select" value={draft.st} onChange={e=>setDraft(p=>({...p,st:e.target.value}))}>
            {STATUSES.map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div className="edit-row">
        <div className="edit-lbl">Title</div>
        <textarea className="edit-inp" rows={2} value={draft.ti} onChange={e=>setDraft(p=>({...p,ti:e.target.value}))}/>
      </div>
      <div className="edit-row">
        <div className="edit-lbl">Guide / Notes</div>
        <textarea className="edit-inp" rows={2} value={draft.gu} onChange={e=>setDraft(p=>({...p,gu:e.target.value}))}/>
      </div>
      <div className="edit-actions">
        <button className="btn-save" onClick={save}>Save</button>
        <button className="btn-cancel" onClick={cancel}>Cancel</button>
      </div>
    </div>
  );

  return(
    <div className="post-card" onClick={()=>setEditing(true)}>
      <span className="edit-hint">click to edit</span>
      <div className="pc-meta">
        <span className={`ctb ${typeCls[post.t]||"ct-sl"}`}>{typeLabel}</span>
        <span className="pc-num">{post.n}</span>
        <span className={`status-badge ${statusCls[post.st]||"st-planned"}`}
          onClick={cycleStatus} title="Click to cycle status">
          {post.st}
        </span>
      </div>
      <div className="pc-title">{post.ti}</div>
      <div className="pc-guide">{post.gu}</div>
    </div>
  );
}

/* ── MAIN ── */
export default function App(){
  const [slPosts,setSlPosts]   = useState(DEFAULT_SL);
  const [inPosts,setInPosts]   = useState(DEFAULT_IN);
  const [thuNotes,setThuNotes] = useState({});
  const [filterMonth,setFilterMonth] = useState("all");
  const [typeFilter,setTypeFilter]   = useState("all"); // all | sl | thu | in
  const [collapsed,setCollapsed]     = useState({});    // { weekNum: bool }
  const [allCollapsed,setAllCollapsed] = useState(false);
  const [saveStatus,setSaveStatus]   = useState("idle");
  const saveTimer = useRef(null);

  /* Load */
  useEffect(()=>{
    async function load(){
      try{
        const sl  = await window.storage.get("cal_sl");
        const inp = await window.storage.get("cal_in");
        const thu = await window.storage.get("cal_thu");
        const col = await window.storage.get("cal_col");
        if(sl)  setSlPosts(JSON.parse(sl.value));
        if(inp) setInPosts(JSON.parse(inp.value));
        if(thu) setThuNotes(JSON.parse(thu.value));
        if(col) setCollapsed(JSON.parse(col.value));
      }catch(_){}
    }
    load();
  },[]);

  /* Save */
  async function persist(sl,inp,thu,col){
    setSaveStatus("saving");
    try{
      await window.storage.set("cal_sl",  JSON.stringify(sl));
      await window.storage.set("cal_in",  JSON.stringify(inp));
      await window.storage.set("cal_thu", JSON.stringify(thu));
      await window.storage.set("cal_col", JSON.stringify(col));
      setSaveStatus("saved");
      clearTimeout(saveTimer.current);
      saveTimer.current=setTimeout(()=>setSaveStatus("idle"),2500);
    }catch(_){setSaveStatus("idle");}
  }

  const updateSl=(wi,u)=>{const n=slPosts.map((p,i)=>i===wi?u:p);setSlPosts(n);persist(n,inPosts,thuNotes,collapsed);};
  const updateIn=(ii,u)=>{const n=inPosts.map((p,i)=>i===ii?u:p);setInPosts(n);persist(slPosts,n,thuNotes,collapsed);};
  const updateThu=(wn,v)=>{const n={...thuNotes,[wn]:v};setThuNotes(n);persist(slPosts,inPosts,n,collapsed);};

  const toggleWeek=wn=>{
    const n={...collapsed,[wn]:!collapsed[wn]};
    setCollapsed(n);
    persist(slPosts,inPosts,thuNotes,n);
  };
  const toggleAll=()=>{
    const next=!allCollapsed;
    setAllCollapsed(next);
    const n={};
    WEEKS.forEach(w=>{n[w.num]=next;});
    setCollapsed(n);
    persist(slPosts,inPosts,thuNotes,n);
  };

  /* Interview map */
  const inMap=useMemo(()=>{
    let idx=0;const m={};
    WEEKS.forEach(w=>{
      if(w.fri>=INTERVIEWS_START&&idx<inPosts.length)
        m[w.num]={post:inPosts[idx],idx:idx++};
    });
    return m;
  },[inPosts]);

  const months=useMemo(()=>[...new Set(WEEKS.map(w=>fmtMonth(w.mon)))],[]);

  /* Stats */
  const liveTue=slPosts.filter(p=>p.st==="live").length;
  const thuFilled=Object.values(thuNotes).filter(v=>v.trim()).length;

  /* Which day cols to dim/hide based on type filter */
  // all=show all, sl=highlight tue, thu=highlight thu, in=highlight fri
  const dimTue = typeFilter==="thu"||typeFilter==="in";
  const dimThu = typeFilter==="sl"||typeFilter==="in";
  const dimFri = typeFilter==="sl"||typeFilter==="thu";

  return(
    <>
      <style>{STYLE}</style>

      {/* UTIL BAR */}
      <div className="util-bar">
        <div>
          <span className="ul">pecksmission.com</span>
          <span className="ul">Content Operations</span>
        </div>
        <span className={`save-badge${saveStatus==="saved"?" saved":""}`}>
          {saveStatus==="saving"?"Saving…":saveStatus==="saved"?"✓ Saved":"All changes auto-saved"}
        </span>
      </div>

      {/* MASTHEAD */}
      <div className="masthead">
        <div className="mh-inner">
          <div className="mh-brand">
            <div className="mh-seal"><span className="mh-seal-txt">PM</span></div>
            <div>
              <div className="mh-eyebrow">Content Calendar · Year One</div>
              <div className="mh-title">52-Week Publishing Schedule</div>
              <div className="mh-sub">Mar 10, 2026 – Mar 6, 2027 &nbsp;·&nbsp; Tue · Thu · Fri</div>
            </div>
          </div>
          <div className="mh-stats">
            <div className="ms"><div className="ms-num">52</div><div className="ms-lbl">Weeks</div></div>
            <div className="ms"><div className="ms-num gold">{slPosts.length}</div><div className="ms-lbl">Tue · Posts</div></div>
            <div className="ms"><div className="ms-num gold">{liveTue}</div><div className="ms-lbl">Tue · Live</div></div>
            <div className="ms"><div className="ms-num gold">{inPosts.length}</div><div className="ms-lbl">Fri · Interviews</div></div>
            <div className="ms"><div className="ms-num gold">{thuFilled}</div><div className="ms-lbl">Thu · Decided</div></div>
          </div>
        </div>
      </div>

      {/* STICKY BAR — month nav + type filter */}
      <div className="sticky-bar">
        {/* Month nav */}
        <div style={{borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          <div className="pnav-inner">
            <button className={"ni"+(filterMonth==="all"?" active":"")} onClick={()=>setFilterMonth("all")}>All</button>
            {months.map(m=>(
              <button key={m} className={"ni"+(filterMonth===m?" active":"")} onClick={()=>setFilterMonth(m)}>
                {m.split(" ")[0]} '{m.split(" ")[1].slice(2)}
              </button>
            ))}
          </div>
        </div>
        {/* Type filter */}
        <div className="filter-bar">
          <div className="filter-inner">
            <span style={{fontFamily:"var(--fn)",fontSize:9,fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",color:"#6a7a99",marginRight:4}}>Show:</span>
            {[
              {val:"all", label:"All Posts"},
              {val:"sl",  label:"Tuesday · Solo"},
              {val:"thu", label:"Thursday"},
              {val:"in",  label:"Friday · Interview"},
            ].map(f=>(
              <button key={f.val} className={"cfb"+(typeFilter===f.val?" active":"")} onClick={()=>setTypeFilter(f.val)}>
                {f.label}
              </button>
            ))}
            <div className="cfb-div"/>
            <button className="collapse-all-btn" onClick={toggleAll}>
              {allCollapsed?"Expand All":"Collapse All"}
            </button>
          </div>
        </div>
      </div>

      <div className="cw">
        {WEEKS.map((week,wi)=>{
          const monthLabel=fmtMonth(week.mon);
          if(filterMonth!=="all"&&filterMonth!==monthLabel)return null;
          const showDiv=wi===0||fmtMonth(WEEKS[wi-1].mon)!==monthLabel;
          const slPost=slPosts[wi]||null;
          const friData=inMap[week.num]||null;
          const friEnabled=week.fri>=INTERVIEWS_START;
          const phase=PHASES[wi]||"";
          const isOpen=!collapsed[week.num];

          /* Summary line shown when collapsed */
          const thuVal=(thuNotes[week.num]||"").trim();
          const summaryParts=[];
          if(slPost) summaryParts.push(`${slPost.n} · ${slPost.ti.slice(0,28)}…`);
          if(thuVal) summaryParts.push("Thu: "+thuVal.slice(0,24)+(thuVal.length>24?"…":""));
          if(friData) summaryParts.push("IN #"+friData.post.n);

          return(
            <div key={week.num}>
              {showDiv&&(
                <div className="month-div">
                  <div className="month-line"/>
                  <div className="month-tag">{monthLabel}</div>
                  <div className="month-line"/>
                </div>
              )}
              <div className="week-block">
                {/* HEADER — click to collapse */}
                <div className="week-header" onClick={()=>toggleWeek(week.num)}>
                  <span className={`wh-toggle${isOpen?"":" collapsed"}`}>▾</span>
                  <span className="wh-num">Week {week.num}</span>
                  <span className="wh-range">{fmt(week.tue)} – {fmt(week.fri)}</span>
                  {!isOpen&&summaryParts.length>0&&(
                    <span className="wh-summary">{summaryParts[0]}</span>
                  )}
                  {phase&&<span className="wh-phase">{phase}</span>}
                </div>

                {/* COLLAPSIBLE BODY */}
                <div className={`week-body ${isOpen?"open":"closed"}`}>
                  <div className="week-grid">

                    {/* TUESDAY */}
                    <div className={`day-col${dimTue?" filtered-dim":""}`}>
                      <div className="day-head">
                        <span className="dh-label">Tuesday</span>
                        <span className="dh-date">{fmt(week.tue)}</span>
                      </div>
                      {slPost
                        ?<PostCard key={slPost.n+wi} post={slPost} typeLabel="SL" onSave={u=>updateSl(wi,u)}/>
                        :<div className="day-complete">All solo posts published.</div>
                      }
                    </div>

                    {/* THURSDAY */}
                    <div className={`day-col${dimThu?" filtered-dim":""}`}>
                      <div className="day-head">
                        <span className="dh-label">Thursday</span>
                        <span className="dh-date">{fmt(week.thu)}</span>
                      </div>
                      <div className="thu-area">
                        <div className="thu-lbl">Your decision this week</div>
                        <textarea
                          className="thu-inp"
                          rows={3}
                          placeholder="What do you want to post Thursday?"
                          value={thuNotes[week.num]||""}
                          onChange={e=>updateThu(week.num,e.target.value)}
                        />
                      </div>
                    </div>

                    {/* FRIDAY */}
                    <div className={`day-col${dimFri?" filtered-dim":""}`}>
                      <div className="day-head">
                        <span className="dh-label">Friday</span>
                        <span className="dh-date">{fmt(week.fri)}</span>
                      </div>
                      {!friEnabled
                        ?<div className="fri-locked">
                            <div className="fri-lock-txt">Starts April 3</div>
                            <div className="fri-lock-sub">Interviews begin Apr 3, 2026</div>
                          </div>
                        :friData
                          ?<PostCard key={friData.post.n+week.num} post={friData.post} typeLabel="IN" onSave={u=>updateIn(friData.idx,u)}/>
                          :<div className="day-complete">All interviews published.</div>
                      }
                    </div>

                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
