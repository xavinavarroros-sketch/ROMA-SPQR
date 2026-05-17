import React, { useState, useEffect, useCallback, useRef } from "react";

/* ══ GLOBAL CSS ═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{font-size:18px;-webkit-text-size-adjust:100%}
body{background:#0A0804;color:#EEE0C0;font-family:'EB Garamond',serif;font-size:1rem;line-height:1.45}
img{max-width:100%}
::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#0A0804}::-webkit-scrollbar-thumb{background:#3A2810}
input,select,textarea,button{outline:none;font-size:1rem}
button{cursor:pointer}
@media(max-width:720px){html{font-size:17px}body{overflow-x:hidden}.spqr-shell{padding:0.65rem!important}.spqr-topbar{position:static!important}.spqr-tabs{position:static!important;top:auto!important}.spqr-senate-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:0.4rem}.spqr-modal{align-items:flex-start!important;padding:0.5rem!important}.spqr-modal-box{max-height:96vh!important;padding:1rem!important}.spqr-card-grid{grid-template-columns:1fr!important}.spqr-stat-grid{grid-template-columns:repeat(auto-fit,minmax(140px,1fr))!important}.spqr-resource-grid{grid-template-columns:1fr!important}}
`;
const T={bg:"#0A0804",surf:"#141008",card:"#1C1510",border:"#3A2810",bhi:"#5A4020",
  gold:"#C8922A",ghi:"#F0C040",red:"#8B1515",rhi:"#CC3030",
  green:"#2A7018",gre:"#50A030",blue:"#1A4880",
  text:"#EEE0C0",mut:"#907850",fnt:"#3A2810"};

/* ══ POSITIONS ════════════════════════════════════════════════════════════ */
const POS={
  consul_1:{title:"Consul I",abbr:"COS I",color:"#E05050",bg:"#1a0505",
    desc:"Supreme magistrate of Rome. Commands all legions and presides over the Senate with imperium maius.",
    can:["Submit one military order per session","Propose any Senate motion","Command all active legions","Declare war (requires Senate vote)","Veto any lesser magistrate's decision"],
    cannot:["Declare war alone without Senate","Serve more than one year","Raise legions without Senate vote","Re-take office for 10 years"]},
  consul_2:{title:"Consul II",abbr:"COS II",color:"#E05050",bg:"#1a0505",
    desc:"Co-equal supreme magistrate sharing command and authority with Consul I.",
    can:["Submit one military order per session","Propose any Senate motion","Command all active legions"],
    cannot:["Overrule Consul I without Senate","Serve more than one year","Re-take office for 10 years"]},
  praetor_1:{title:"Praetor Urbanus",abbr:"PR I",color:"#B060F0",bg:"#150820",
    desc:"Chief judicial magistrate. Governs Rome in the Consuls' absence. Administers law over citizens.",
    can:["Submit one administrative order per session","Govern Rome when Consuls are absent","Propose legal and civic motions","Command a legion if assigned by Consuls"],
    cannot:["Override Consular decisions","Declare war independently","Spend treasury without Senate authorization"]},
  praetor_2:{title:"Praetor Peregrinus",abbr:"PR II",color:"#B060F0",bg:"#150820",
    desc:"Oversees non-citizen affairs and outlying territories at the Senate's direction.",
    can:["Submit one provincial order per session","Propose foreign affairs motions","Manage non-citizen disputes"],
    cannot:["Override senior magistrates","Command legions without Consular authorization"]},
  censor_1:{title:"Censor I",abbr:"CEN I",color:"#9050D0",bg:"#120818",
    desc:"Guardian of the Roman census. Controls citizen rolls, social class, and the military levy.",
    can:["Submit one census order per session","Propose levy and recruitment motions","View full population data","Authorize raising legions (Senate vote required)"],
    cannot:["Raise legions unilaterally","Command armies in the field","Spend gold directly"]},
  censor_2:{title:"Censor II",abbr:"CEN II",color:"#9050D0",bg:"#120818",
    desc:"Co-censor overseeing public contracts, construction, and citizen conduct.",
    can:["Submit one civic order per session","Propose public works motions","Assist in levy and recruitment"],
    cannot:["Act alone on census matters","Command armies","Override Censor I"]},
  quaestor_1:{title:"Quaestor I",abbr:"Q I",color:"#D09020",bg:"#140e00",
    desc:"Keeper of the Treasury (Aerarium Saturni). No major expense moves without the Quaestor's seal.",
    can:["Submit one treasury order per session","Propose financial and tax motions","View full treasury and income data","Flag or challenge major expenditures"],
    cannot:["Spend gold without Senate authorization","Command legions","Override any senior magistrate"]},
  quaestor_2:{title:"Quaestor II",abbr:"Q II",color:"#D09020",bg:"#140e00",
    desc:"Military paymaster managing legion supply, payroll, and military expenditures.",
    can:["Submit one supply order per session","Propose military expenditure motions","View legion upkeep and supply costs"],
    cannot:["Command legions","Override Quaestor I","Access civilian treasury directly"]},
  aedile_1:{title:"Aedile Curule",abbr:"AED",color:"#40A030",bg:"#061406",
    desc:"Manager of Rome's grain supply and city logistics. If the grain runs out, Rome starves — the Aedile prevents that.",
    can:["Submit one logistics order per session","Propose food supply and market motions","Monitor food consumption across legions","Manage grain distribution to the city"],
    cannot:["Command legions","Access the gold treasury independently","Override financial magistrates"]},
  tribune_1:{title:"Tribune I",abbr:"TR I",color:"#4080C0",bg:"#060e18",
    desc:"Sacred protector of the plebs. Possesses absolute veto over any Senate motion. Their person is sacrosanct — inviolable.",
    can:["VETO any Senate motion — absolute, no override possible","Propose plebeian motions","Submit one order per session","Intercede to protect any citizen from magistrate abuse"],
    cannot:["Command armies in the field","Be overridden by any magistrate — not even Consuls","Be prosecuted or physically harmed while in office"]},
  tribune_2:{title:"Tribune II",abbr:"TR II",color:"#4080C0",bg:"#060e18",
    desc:"Co-tribune sharing the absolute veto power. Two tribunes acting together cannot be overridden by any force.",
    can:["VETO any Senate motion — absolute, no override possible","Propose plebeian motions","Submit one order per session","Protect any plebeian citizen"],
    cannot:["Command armies","Be overridden by any magistrate","Be prosecuted or harmed while in office"]},
};

// Physical senate seating positions (col 0-8, row 0-6 on 9×7 grid)
const SEATS={consul_1:{c:4,r:0},consul_2:{c:4,r:1},praetor_1:{c:3,r:2},praetor_2:{c:5,r:2},
  censor_1:{c:1,r:2},censor_2:{c:7,r:2},quaestor_1:{c:1,r:4},quaestor_2:{c:7,r:4},
  aedile_1:{c:4,r:4},tribune_1:{c:2,r:5},tribune_2:{c:6,r:5}};

/* ══ GAME DATA ════════════════════════════════════════════════════════════ */
const DEF_GAME={session:1,sessionInSeason:1,year:218,season:"Summer",
  gold:6000,food:5000,pop:175000,legionUpkeep:80,legionFood:60,lgold:400,lfood:200,lpop:5000,lturns:3};

const DEF_LEGIONS=["I","II","III","IV","V","VI","VII","VIII","IX","X"].map((id)=>
  ({id,name:`Legio ${id}`,str:5000,max:5000,status:"active",prog:0,location:"Roma"}));

const DEF_REGIONS=[
  {id:"latium",   name:"Latium",        bG:200,bF:150,s:"roman"},
  {id:"campania", name:"Campania",       bG:300,bF:200,s:"roman"},
  {id:"etruria",  name:"Etruria",        bG:180,bF:120,s:"roman"},
  {id:"samnium",  name:"Samnium",        bG:120,bF:100,s:"roman"},
  {id:"apulia",   name:"Apulia",         bG:150,bF:180,s:"roman"},
  {id:"calabria", name:"Calabria",       bG:100,bF:130,s:"roman"},
  {id:"bruttium", name:"Bruttium",       bG:80, bF:100,s:"roman"},
  {id:"lucania",  name:"Lucania",        bG:90, bF:120,s:"roman"},
  {id:"umbria",   name:"Umbria",         bG:120,bF:100,s:"roman"},
  {id:"picenum",  name:"Picenum",        bG:100,bF:80, s:"roman"},
  {id:"cisalpine",name:"Cisalpine Gaul", bG:50, bF:80, s:"contested"},
  {id:"sicily",   name:"Sicily",         bG:250,bF:300,s:"roman"},
  {id:"sardinia", name:"Sardinia",       bG:100,bF:120,s:"roman"},
];
const RS={roman:{l:"Roman Control",c:"#40A030",m:1.0},contested:{l:"Contested",c:"#C8922A",m:0.5},
  sacked:{l:"Sacked",c:"#E05050",m:0.1},devastated:{l:"Devastated",c:"#CC6622",m:0.25},enemy:{l:"Enemy Control",c:"#880020",m:0.0}};

const LAWS=[
  {t:"Lex Duodecim Tabularum (451 BC) — The Twelve Tables",b:"The foundation of Roman law. Citizens may not be punished without trial. All citizens are equal before these written laws. Justice must be seen, not merely administered in darkness."},
  {t:"Provocatio ad Populum — Right of Appeal",b:"Any Roman citizen facing execution or corporal punishment may appeal to the popular assembly. No magistrate possesses absolute power over a citizen's life without this process."},
  {t:"Sacrosanctitas Tribunorum — Sacrosanctity of Tribunes",b:"The tribunes of the plebs are sacrosanct. Their persons are inviolable by law and sacred oath. Any who raise a hand against a tribune may be killed by any citizen without penalty."},
  {t:"Lex Hortensia (287 BC) — Sovereignty of the Plebs",b:"Decisions of the plebeian assembly (plebiscita) bind all Roman citizens equally. The plebs are not subjects of the patricians — they are Rome, and their voice carries the force of law."},
  {t:"Collegium — The Principle of Joint Magistracy",b:"Every magistracy has two or more holders of equal power who may veto each other. The Republic is built on the prevention of sole rule. No Roman magistrate governs alone."},
  {t:"Annuitas — Annual Terms of Office",b:"All magistracies last exactly one year. Re-election to the same office is forbidden for ten years. This rule exists solely to prevent the accumulation of power that breeds tyranny."},
  {t:"De Bello et Pace — On War and Peace",b:"War may only be declared by the Senate and ratified by the Comitia Centuriata. Unauthorised military action by any magistrate is a capital offence against the Republic."},
  {t:"Lex de Imperio — The Grant of Command",b:"Military command (imperium) is granted by the Senate for specific campaigns only. A general must surrender his imperium upon returning to Rome. He who enters the city in arms is an enemy of the Republic."},
];

const ADMIN_PASS="SPQR_GM_218BC";
const SEASONS=["Spring","Summer","Autumn","Winter"];

/* ══ STORAGE & UTILS ══════════════════════════════════════════════════════ */
const db={
  async get(k,sh=true){try{const r=await window.storage.get(k,sh);return r?JSON.parse(r.value):null;}catch{return null;}},
  async set(k,v,sh=true){try{await window.storage.set(k,JSON.stringify(v),sh);return true;}catch{return false;}},
  async gP(k){return this.get(k,false);},
  async sP(k,v){return this.set(k,v,false);},
};
const sLab=g=>`${g.year} BC ${g.season} S${g.sessionInSeason}`;
const fmt=n=>Number(n||0).toLocaleString();
const calcInc=regs=>{let g=0,f=0;regs.forEach(r=>{const m=RS[r.s]?.m||0;g+=r.bG*m;f+=r.bF*m;});return{gold:Math.floor(g),food:Math.floor(f)};};
const compress=(file,mx=600)=>new Promise(res=>{const c=document.createElement('canvas'),img=new Image(),u=URL.createObjectURL(file);img.onload=()=>{const s=Math.min(mx/img.width,mx/img.height,1);c.width=img.width*s;c.height=img.height*s;c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',0.75));};img.src=u;});
const pushN=async(title,body,forId="all")=>{const all=await db.get("spqr_n")||[];all.push({id:Date.now()+Math.random().toString(36).slice(2),title,body,for:forId,ts:Date.now()});await db.set("spqr_n",all.slice(-200));};

/* ══ SHARED UI ════════════════════════════════════════════════════════════ */
const Lbl=({c})=><div style={{color:T.mut,fontSize:"0.68rem",letterSpacing:"0.14em",fontFamily:"'Cinzel',serif",marginBottom:"0.22rem",textTransform:"uppercase"}}>{c}</div>;
function Inp({label,value,onChange,type="text",placeholder="",rows,disabled}){
  const s={width:"100%",background:T.card,border:`1px solid ${T.border}`,color:T.text,padding:"0.42rem 0.6rem",fontFamily:"'EB Garamond',serif",fontSize:"0.95rem",opacity:disabled?0.6:1};
  return(<div style={{marginBottom:"0.8rem"}}>{label&&<Lbl c={label}/>}{rows?<textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{...s,resize:"vertical"}} disabled={disabled}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s} disabled={disabled}/>}</div>);
}
function Btn({children,onClick,v="gold",sm,full,disabled}){
  const vc={gold:{bg:T.gold,c:T.bg},red:{bg:T.red,c:"#ffcccc"},ghost:{bg:"transparent",c:T.mut},dark:{bg:T.card,c:T.text},green:{bg:T.green,c:"#fff"},blue:{bg:T.blue,c:"#fff"},crimson:{bg:"#6B1010",c:"#FFB0B0"}};
  const {bg,c}=vc[v]||vc.gold;
  return(<button onClick={onClick} disabled={disabled} style={{padding:sm?"0.26rem 0.55rem":"0.48rem 1rem",background:bg,color:c,border:`1px solid ${T.border}`,fontFamily:"'Cinzel',serif",fontSize:sm?"0.65rem":"0.74rem",letterSpacing:"0.08em",cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.45:1,width:full?"100%":"auto",fontWeight:600,whiteSpace:"nowrap"}}>{children}</button>);
}
const Card=({children,style={}})=><div style={{background:T.card,border:`1px solid ${T.border}`,padding:"0.9rem",marginBottom:"0.6rem",...style}}>{children}</div>;
const Badge=({c,color=T.gold,sm})=><span style={{display:"inline-block",background:`${color}22`,border:`1px solid ${color}`,color,padding:sm?"0.05rem 0.35rem":"0.08rem 0.45rem",fontSize:sm?"0.6rem":"0.66rem",fontFamily:"'Cinzel',serif",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{c}</span>;
const STit=({c,sub})=><div style={{marginBottom:"0.6rem"}}><div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"0.72rem",letterSpacing:"0.22em",borderBottom:`1px solid ${T.border}`,paddingBottom:"0.3rem",textTransform:"uppercase"}}>{c}</div>{sub&&<div style={{color:T.mut,fontSize:"0.78rem",marginTop:"0.25rem",fontStyle:"italic"}}>{sub}</div>}</div>;
const Row=({children,gap="0.4rem",wrap})=><div style={{display:"flex",gap,alignItems:"center",flexWrap:wrap?"wrap":"nowrap"}}>{children}</div>;
const Stat=({label,value,color=T.ghi})=><div style={{textAlign:"center",padding:"0.45rem 0.6rem",background:T.card,border:`1px solid ${T.border}`}}><div style={{fontSize:"1.3rem",fontFamily:"'Cinzel',serif",fontWeight:700,color}}>{value}</div><div style={{fontSize:"0.6rem",color:T.mut,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:"0.08rem"}}>{label}</div></div>;
function Modal({title,children,onClose,wide}){return(<div className="spqr-modal" style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}><div className="spqr-modal-box" style={{background:T.surf,border:`1px solid ${T.bhi}`,padding:"1.5rem",width:"100%",maxWidth:wide?"760px":"520px",maxHeight:"90vh",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"1rem",alignItems:"center",gap:"1rem"}}><div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"1rem",letterSpacing:"0.18em"}}>{title}</div><button onClick={onClose} style={{background:"none",border:"none",color:T.mut,fontSize:"1.3rem"}}>✕</button></div>{children}</div></div>);}

/* ══ NOTIFICATION BELL ════════════════════════════════════════════════════ */
function NotifBell({userId}){
  const [notifs,setNotifs]=useState([]);
  const [readIds,setReadIds]=useState([]);
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  const load=useCallback(async()=>{
    const all=await db.get("spqr_n")||[];
    const rd=await db.gP(`nr_${userId}`)||[];
    setNotifs(all.filter(n=>n.for==="all"||n.for===userId).reverse().slice(0,30));
    setReadIds(rd);
  },[userId]);
  useEffect(()=>{load();const t=setInterval(load,15000);return()=>clearInterval(t);},[load]);
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[]);
  const markAll=async()=>{await db.sP(`nr_${userId}`,notifs.map(n=>n.id));setReadIds(notifs.map(n=>n.id));};
  const unread=notifs.filter(n=>!readIds.includes(n.id)).length;
  const typeIcon={motion_open:"⚖",motion_result:"📜",order_resolved:"🦅",session:"📅",deadline:"⏳"};
  return(
    <div ref={ref} style={{position:"relative"}}>
      <button onClick={()=>{setOpen(o=>!o);load();}} style={{background:"none",border:"none",color:T.text,fontSize:"1.1rem",position:"relative",padding:"0.2rem 0.3rem"}}>
        🔔{unread>0&&<span style={{position:"absolute",top:-2,right:-2,background:T.rhi,color:"#fff",fontSize:"0.55rem",borderRadius:"50%",width:15,height:15,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",fontWeight:700}}>{unread>9?"9+":unread}</span>}
      </button>
      {open&&(
        <div style={{position:"absolute",right:0,top:"calc(100% + 4px)",width:310,background:T.card,border:`1px solid ${T.bhi}`,zIndex:1500,boxShadow:"0 8px 32px rgba(0,0,0,0.6)"}}>
          <div style={{padding:"0.5rem 0.75rem",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Cinzel',serif",fontSize:"0.66rem",color:T.gold,letterSpacing:"0.14em"}}>NOTIFICATIONS</span>
            <button onClick={markAll} style={{background:"none",border:"none",color:T.mut,fontSize:"0.7rem",cursor:"pointer"}}>Mark all read</button>
          </div>
          <div style={{maxHeight:300,overflowY:"auto"}}>
            {notifs.length===0&&<div style={{padding:"1rem",color:T.mut,textAlign:"center",fontSize:"0.85rem"}}>No notifications yet</div>}
            {notifs.map(n=>(
              <div key={n.id} style={{padding:"0.5rem 0.75rem",borderBottom:`1px solid ${T.border}`,background:readIds.includes(n.id)?T.card:T.surf}}>
                <div style={{fontSize:"0.8rem",color:T.text,marginBottom:"0.15rem"}}><span style={{marginRight:"0.35rem"}}>{typeIcon[n.type]||"•"}</span>{n.title}</div>
                <div style={{fontSize:"0.75rem",color:T.mut,lineHeight:1.4}}>{n.body}</div>
                <div style={{fontSize:"0.62rem",color:T.fnt,marginTop:"0.15rem"}}>{new Date(n.ts).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function SenatorProfileModal({player,onClose}){
  if(!player)return null;
  const pos=player.role?POS[player.role]:null;
  return(
    <Modal title="SENATOR PROFILE" onClose={onClose} wide>
      <div style={{display:"flex",gap:"1rem",alignItems:"flex-start",flexWrap:"wrap"}}>
        {player.avatar?
          <img src={player.avatar} style={{width:160,height:160,objectFit:"cover",border:`3px solid ${pos?pos.color:T.bhi}`}} alt="Senator avatar"/>:
          <div style={{width:160,height:160,background:T.fnt,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",fontSize:"2rem",color:T.mut,border:`3px solid ${T.border}`}}>{player.latinName?.[0]||"?"}</div>}
        <div style={{flex:1,minWidth:220}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.35rem",fontWeight:800,color:T.ghi,marginBottom:"0.35rem"}}>{player.latinName}</div>
          <div style={{fontSize:"1rem",color:T.text,marginBottom:"0.35rem"}}>{player.charClass||"Senator"}</div>
          {pos&&<div style={{marginBottom:"0.5rem"}}><Badge c={pos.title} color={pos.color}/></div>}
          {player.username&&<div style={{color:T.mut,marginBottom:"0.2rem"}}>Username: {player.username}</div>}
          {player.discord&&<div style={{color:"#7289DA",marginBottom:"0.2rem"}}>Discord: {player.discord}</div>}
          {player.joined&&<div style={{color:T.fnt}}>Enrolled: {new Date(player.joined).toLocaleDateString()}</div>}
          {pos&&<div style={{marginTop:"0.75rem",padding:"0.75rem",background:T.bg,border:`1px solid ${pos.color}55`,color:T.mut,lineHeight:1.55}}>{pos.desc}</div>}
        </div>
      </div>
    </Modal>
  );
}

/* ══ SENATE SEATING MAP ═══════════════════════════════════════════════════ */
function SenateMap({players,onSelectPlayer}){
  const [hov,setHov]=useState(null);
  const [hovPos,setHovPos]=useState({x:0,y:0});
  const COLS=9,ROWS=7,SZ=64;
  // Map role key to seat position
  const seatToRole={};
  Object.entries(SEATS).forEach(([role,{c,r}])=>{seatToRole[`${c}_${r}`]=role;});
  // Map role to player
  const roleToPlayer={};
  players.forEach(p=>{if(p.role)roleToPlayer[p.role]=p;});
  // Regular senators (no role) fill remaining seats top-left to bottom-right
  const regularSeats=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const key=`${c}_${r}`;
    if(!seatToRole[key]){
      // skip center area (roughly)
      if(r>=3&&r<=5&&c>=3&&c<=5&&!(c===4&&r===4))continue;
      regularSeats.push({c,r,key});
    }
  }
  const regulars=players.filter(p=>!p.role);
  const hovPlayer=hov&&(hov.player||null);
  return(
    <div className="spqr-senate-scroll" style={{position:"relative",userSelect:"none"}}>
      <div style={{display:"grid",gridTemplateColumns:`repeat(${COLS},${SZ}px)`,gridTemplateRows:`repeat(${ROWS},${SZ}px)`,gap:2,background:T.border,border:`2px solid ${T.bhi}`,width:"fit-content",margin:"0 auto",minWidth:`${COLS*SZ+16}px`}}>
        {Array.from({length:ROWS},(_,r)=>Array.from({length:COLS},(_,c)=>{
          const key=`${c}_${r}`;
          const role=seatToRole[key];
          const posInfo=role?POS[role]:null;
          const holder=role?roleToPlayer[role]:null;
          // Regular senator seat?
          const regIdx=regularSeats.findIndex(s=>s.key===key);
          const regPlayer=regIdx>=0?regulars[regIdx]:null;
          const isEmpty=!role&&!regPlayer;
          // Center table area (skip render)
          if(!role&&regIdx<0&&r>=3&&r<=5&&c>=3&&c<=5&&!(c===4&&r===4))
            return<div key={key} style={{background:"#0a0600",border:"none"}}/>;

          const bg=posInfo?(holder?`${posInfo.color}33`:T.surf):regPlayer?`${T.text}08`:T.bg;
          const bc=posInfo?(holder?posInfo.color:posInfo.color+"44"):regPlayer?T.border:T.fnt;
          return(
            <div key={key}
              onMouseEnter={e=>{
                const rect=e.target.getBoundingClientRect();
                setHovPos({x:rect.left+rect.width/2,y:rect.top});
                setHov({role,posInfo,player:holder||regPlayer,isRegular:!role});
              }}
              onMouseLeave={()=>setHov(null)}
              onClick={()=>{const pl=holder||regPlayer;if(pl&&onSelectPlayer)onSelectPlayer(pl);}}
              style={{background:bg,border:`1px solid ${bc}`,position:"relative",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"3px",overflow:"hidden",cursor:(holder||regPlayer)?"pointer":"default"}}>
              {posInfo&&(
                <>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.5rem",color:holder?posInfo.color:posInfo.color+"88",textAlign:"center",letterSpacing:"0.05em",lineHeight:1.2,marginBottom:2}}>{posInfo.abbr}</div>
                  {holder?.avatar&&<img src={holder.avatar} style={{width:30,height:30,objectFit:"cover",borderRadius:"50%",border:`1px solid ${posInfo.color}`}} alt=""/>}
                  {!holder&&<div style={{fontSize:"0.6rem",color:posInfo.color+"66",fontFamily:"'Cinzel',serif",textAlign:"center",lineHeight:1}}>vacant</div>}
                  {holder&&!holder.avatar&&<div style={{width:30,height:30,background:`${posInfo.color}33`,border:`1px solid ${posInfo.color}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.55rem",color:posInfo.color,fontFamily:"'Cinzel',serif"}}>{holder.latinName?.[0]||"?"}</div>}
                </>
              )}
              {!posInfo&&regPlayer&&(
                <>
                  {regPlayer.avatar?<img src={regPlayer.avatar} style={{width:28,height:28,objectFit:"cover",borderRadius:"50%",border:`1px solid ${T.border}`}} alt=""/>:
                  <div style={{width:28,height:28,background:T.fnt,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.5rem",color:T.mut,fontFamily:"'Cinzel',serif"}}>{regPlayer.latinName?.[0]||"?"}</div>}
                  <div style={{fontSize:"0.42rem",color:T.mut,textAlign:"center",marginTop:1,lineHeight:1,fontFamily:"'Cinzel',serif",overflow:"hidden",maxWidth:"100%"}}>{regPlayer.latinName?.split(" ").slice(-1)[0]}</div>
                </>
              )}
              {isEmpty&&<div style={{width:"100%",height:"100%",opacity:0.15,background:`repeating-linear-gradient(45deg,${T.fnt},${T.fnt} 1px,transparent 1px,transparent 8px)`}}/>}
            </div>
          );
        }))}
      </div>
      {/* Hover tooltip */}
      {hov&&(hov.posInfo||hov.player)&&(
        <div style={{position:"fixed",left:hovPos.x,top:hovPos.y-8,transform:"translate(-50%,-100%)",zIndex:3000,pointerEvents:"none",background:T.card,border:`1px solid ${T.bhi}`,padding:"0.6rem 0.8rem",minWidth:200,maxWidth:250,boxShadow:"0 4px 24px rgba(0,0,0,0.7)"}}>
          {hov.posInfo&&<div style={{fontFamily:"'Cinzel',serif",color:hov.posInfo.color,fontSize:"0.75rem",fontWeight:700,marginBottom:"0.25rem"}}>{hov.posInfo.title}</div>}
          {hov.player&&(
            <>
              {hov.player.avatar&&<img src={hov.player.avatar} style={{width:48,height:48,objectFit:"cover",border:`1px solid ${T.bhi}`,marginBottom:"0.4rem",display:"block"}} alt=""/>}
              <div style={{fontFamily:"'Cinzel',serif",color:T.text,fontSize:"0.82rem",fontWeight:600}}>{hov.player.latinName}</div>
              <div style={{color:T.mut,fontSize:"0.75rem",marginTop:"0.15rem"}}>{hov.player.charClass}</div>
              {hov.player.discord&&<div style={{color:"#7289DA",fontSize:"0.72rem",marginTop:"0.15rem"}}>Discord: {hov.player.discord}</div>}
              {!hov.posInfo&&<div style={{color:T.fnt,fontSize:"0.7rem",marginTop:"0.15rem",fontStyle:"italic"}}>Senator</div>}
            </>
          )}
          {hov.posInfo&&!hov.player&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.78rem"}}>— Vacant —</div>}
        </div>
      )}
      <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginTop:"0.75rem",justifyContent:"center"}}>
        {Object.entries(POS).map(([k,p])=><span key={k} style={{display:"flex",alignItems:"center",gap:"0.2rem",fontSize:"0.65rem",color:p.color}}><span style={{width:8,height:8,background:`${p.color}44`,border:`1px solid ${p.color}`,display:"inline-block"}}/>{ p.abbr}</span>)}
      </div>
    </div>
  );
}

/* ══ VOTING GRID ══════════════════════════════════════════════════════════ */
function VotingGrid({motion,players}){
  if(!motion)return null;
  return(
    <div style={{marginTop:"0.75rem"}}>
      <STit c="Senate Vote — Current Tallies"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:4}}>
        {players.map(p=>{
          const vote=motion.votes?.[p.id];
          const posInfo=p.role?POS[p.role]:null;
          const bg=vote==="yea"?"#102510":vote==="nay"?"#200808":T.card;
          const bc=vote==="yea"?T.gre:vote==="nay"?T.rhi:T.border;
          return(
            <div key={p.id} style={{background:bg,border:`1px solid ${bc}`,padding:"0.4rem",textAlign:"center",position:"relative"}}>
              {posInfo&&<div style={{fontSize:"0.5rem",color:posInfo.color,fontFamily:"'Cinzel',serif",marginBottom:"0.15rem"}}>{posInfo.abbr}</div>}
              <div style={{fontSize:"0.7rem",color:T.text,fontFamily:"'Cinzel',serif",lineHeight:1.2}}>{p.latinName.split(" ").slice(0,2).join(" ")}</div>
              <div style={{marginTop:"0.25rem",fontSize:"0.8rem",fontWeight:700,color:vote==="yea"?T.gre:vote==="nay"?T.rhi:T.fnt}}>{vote?vote.toUpperCase():"—"}</div>
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",gap:"1rem",marginTop:"0.5rem",fontSize:"0.78rem",color:T.mut}}>
        <span style={{color:T.gre}}>✓ YEA: {Object.values(motion.votes||{}).filter(v=>v==="yea").length}</span>
        <span style={{color:T.rhi}}>✗ NAY: {Object.values(motion.votes||{}).filter(v=>v==="nay").length}</span>
        <span>⟳ NOT VOTED: {players.length-Object.keys(motion.votes||{}).length}</span>
      </div>
    </div>
  );
}

/* ══ PLAYER PANELS ════════════════════════════════════════════════════════ */

function SenatePanel({players,D}){
  const cfg=D.cfg||{};
  const [selected,setSelected]=useState(null);
  return(
    <div>
      {cfg.senateImage&&<div style={{marginBottom:"1rem",border:`1px solid ${T.bhi}`,overflow:"auto",maxHeight:"75vh",background:T.bg,borderRadius:8}}><img src={cfg.senateImage} style={{width:"100%",maxHeight:"75vh",objectFit:"contain",display:"block"}} alt="The Senate of Rome"/></div>}
      {!cfg.senateImage&&<div style={{marginBottom:"1rem",padding:"1.5rem",background:T.surf,border:`1px solid ${T.border}`,textAlign:"center",color:T.mut,fontStyle:"italic",fontSize:"1rem"}}>The Game Master has not yet posted a senate image.</div>}
      <Card>
        <STit c="Curia Julia — Senate Seating" sub="Click a senator to open his profile. On mobile, scroll the seating map sideways."/>
        <SenateMap players={players} onSelectPlayer={setSelected}/>
      </Card>
      <Card>
        <STit c={`Enrolled Senators (${players.length})`}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"0.6rem"}}>
          {players.map(p=>{
            const pos=p.role?POS[p.role]:null;
            return(
              <div key={p.id} onClick={()=>setSelected(p)} style={{display:"flex",gap:"0.75rem",alignItems:"center",padding:"0.65rem",background:T.bg,border:`1px solid ${pos?pos.color+"66":T.fnt}`,cursor:"pointer"}}>
                {p.avatar?<img src={p.avatar} style={{width:54,height:54,objectFit:"cover",borderRadius:"50%",border:`2px solid ${pos?pos.color:T.border}`,flexShrink:0}} alt=""/>:<div style={{width:54,height:54,background:`${pos?pos.color:T.fnt}33`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",color:pos?pos.color:T.mut,fontFamily:"'Cinzel',serif",flexShrink:0}}>{p.latinName?.[0]||"?"}</div>}
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:"'Cinzel',serif",color:T.text,fontSize:"0.95rem",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.latinName}</div>
                  <div style={{color:T.mut,fontSize:"0.85rem"}}>{p.charClass}{p.discord&&<span style={{color:"#7289DA",marginLeft:"0.4rem"}}>{p.discord}</span>}</div>
                  {pos&&<Badge c={pos.title} color={pos.color} sm/>}
                </div>
              </div>
            );
          })}
          {players.length===0&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"1rem"}}>No senators have enrolled yet.</div>}
        </div>
      </Card>
      {selected&&<SenatorProfileModal player={selected} onClose={()=>setSelected(null)}/>} 
    </div>
  );
}

function VotingPanel({motions,players,user,game,onRefresh}){
  const [form,setForm]=useState({title:"",body:""});
  const [err,setErr]=useState("");const [ok,setOk]=useState("");
  const [selMotion,setSelMotion]=useState(null);
  const gForTurnLabel = game || DEF_GAME;
  const currSessionLabel = (()=>{try{return sLab(gForTurnLabel);}catch{return "";}})();
  const myMotionThisTurn=motions.find(m=>m.byId===user.id&&m.session===currSessionLabel);
  const motionLocked=!!myMotionThisTurn;
  const propose=async()=>{
    if(motionLocked){setErr(`You have already proposed one motion this turn (${currSessionLabel}). Wait until the GM advances the turn.`);return;}
    if(!form.title.trim()||!form.body.trim()){setErr("Title and motion text are required.");return;}
    const g=await db.get("spqr_g")||DEF_GAME;
    const all=await db.get("spqr_m")||[];
    const liveSession=sLab(g);
    if(all.find(m=>m.byId===user.id&&m.session===liveSession)){setErr(`You have already proposed one motion this turn (${liveSession}).`);return;}
    const nm={id:Date.now().toString(),byId:user.id,byName:user.latinName,title:form.title,body:form.body,status:"pending",votes:{},created:new Date().toISOString(),session:liveSession};
    await db.set("spqr_m",[...all,nm]);
    await pushN("Motion Proposed",`${user.latinName} has proposed: "${form.title}"` ,"gm");
    setForm({title:"",body:""});setErr("");setOk("Motion submitted — awaiting GM approval. You cannot propose another motion until the next turn.");
    onRefresh();setTimeout(()=>setOk(""),4000);
  };
  const vote=async(motionId,choice)=>{
    const all=await db.get("spqr_m")||[];
    const m=all.find(x=>x.id===motionId);
    if(!m||m.votes[user.id]){return;}
    m.votes[user.id]=choice;
    await db.set("spqr_m",all.map(x=>x.id===motionId?m:x));
    await pushN("Vote Cast",`${user.latinName} voted ${choice.toUpperCase()} on "${m.title}"`);
    onRefresh();
  };
  const scol={pending:T.mut,voting:T.gold,passed:T.gre,failed:T.rhi,rejected:"#555"};
  const voting=motions.filter(m=>m.status==="voting");
  const other=motions.filter(m=>m.status!=="voting");
  return(
    <div>
      <Card>
        <STit c="Propose a Motion" sub={`Limit: one motion per senator per turn. Current turn: ${currSessionLabel}`}/>
        {motionLocked&&<div style={{padding:"0.65rem 0.8rem",background:"#1a1000",border:`1px solid ${T.gold}`,color:T.gold,fontFamily:"'Cinzel',serif",fontSize:"0.82rem",marginBottom:"0.75rem",lineHeight:1.5}}>
          ⚖ Motion already submitted this turn: <span style={{color:T.text}}>{myMotionThisTurn.title}</span>. You may propose another motion after the GM advances to the next turn.
        </div>}
        <Inp label="Motion Title" value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. Raise Legio VII immediately" disabled={motionLocked}/>
        <Inp label="Motion Text — be specific and persuasive" value={form.body} onChange={v=>setForm(f=>({...f,body:v}))} rows={3} disabled={motionLocked}/>
        {err&&<div style={{color:T.rhi,fontSize:"0.95rem",marginBottom:"0.5rem"}}>{err}</div>}
        {ok&&<div style={{color:T.gre,fontSize:"0.95rem",marginBottom:"0.5rem"}}>{ok}</div>}
        <Btn onClick={propose} disabled={motionLocked}>{motionLocked?"Motion Already Submitted This Turn":"Submit to GM for Approval"}</Btn>
      </Card>
      {/* Active votes */}
      {voting.length>0&&<div>
        <STit c={`Open Votes (${voting.length})`}/>
        {voting.map(m=>{
          const myVote=m.votes?.[user.id];
          const isSel=selMotion===m.id;
          const yeas=Object.values(m.votes||{}).filter(v=>v==="yea").length;
          const nays=Object.values(m.votes||{}).filter(v=>v==="nay").length;
          return(
            <Card key={m.id} style={{borderLeft:`3px solid ${T.gold}`}}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.35rem"}}>
                <div style={{fontFamily:"'Cinzel',serif",color:T.text,fontWeight:600}}>{m.title}</div>
                <Badge c="OPEN TO VOTE" color={T.gold}/>
              </div>
              <div style={{color:T.mut,fontSize:"0.72rem",fontFamily:"'Cinzel',serif",marginBottom:"0.4rem"}}>Proposed by {m.byName} · {m.session||""}</div>
              <div style={{fontSize:"0.88rem",lineHeight:1.5,color:T.text,marginBottom:"0.65rem"}}>{m.body}</div>
              {!myVote?<Row gap="0.5rem"><Btn v="green" sm onClick={()=>vote(m.id,"yea")}>✓ AYE</Btn><Btn v="crimson" sm onClick={()=>vote(m.id,"nay")}>✗ NAY</Btn></Row>
                :<div style={{color:myVote==="yea"?T.gre:T.rhi,fontFamily:"'Cinzel',serif",fontSize:"0.8rem"}}>You voted {myVote.toUpperCase()}</div>}
              <div style={{marginTop:"0.5rem"}}>
                <button onClick={()=>setSelMotion(isSel?null:m.id)} style={{background:"none",border:"none",color:T.mut,fontSize:"0.72rem",cursor:"pointer",fontFamily:"'Cinzel',serif"}}>
                  {isSel?"▲ Hide tally":"▼ Show tally"} — AYE {yeas} · NAY {nays}
                </button>
                {isSel&&<VotingGrid motion={m} players={players}/>}
              </div>
            </Card>
          );
        })}
      </div>}
      {/* All other motions */}
      <STit c="All Motions"/>
      {[...other].reverse().map(m=>{
        const isSel=selMotion===m.id;
        const yeas=Object.values(m.votes||{}).filter(v=>v==="yea").length;
        const nays=Object.values(m.votes||{}).filter(v=>v==="nay").length;
        return(
          <Card key={m.id} style={{borderLeft:`3px solid ${scol[m.status]||T.fnt}`}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.35rem"}}>
              <div style={{fontFamily:"'Cinzel',serif",color:T.text,fontWeight:600,fontSize:"0.88rem"}}>{m.title}</div>
              <Badge c={m.status.toUpperCase()} color={scol[m.status]||T.mut} sm/>
            </div>
            <div style={{color:T.mut,fontSize:"0.7rem",fontFamily:"'Cinzel',serif",marginBottom:"0.3rem"}}>By {m.byName} · {m.session||""}</div>
            <div style={{fontSize:"0.85rem",lineHeight:1.5,color:T.text,marginBottom:"0.4rem"}}>{m.body}</div>
            {m.status==="pending"&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.78rem"}}>Awaiting GM review…</div>}
            {m.status==="passed"&&<div style={{color:T.gre,fontFamily:"'Cinzel',serif",fontSize:"0.78rem"}}>✓ PASSED — AYE {yeas} · NAY {nays}</div>}
            {m.status==="failed"&&<div style={{color:T.rhi,fontFamily:"'Cinzel',serif",fontSize:"0.78rem"}}>✗ FAILED — AYE {yeas} · NAY {nays}</div>}
            {m.status==="rejected"&&<div style={{color:"#666",fontSize:"0.78rem"}}>Rejected by GM — not put to vote</div>}
            {(m.status==="passed"||m.status==="failed")&&<button onClick={()=>setSelMotion(isSel?null:m.id)} style={{background:"none",border:"none",color:T.mut,fontSize:"0.7rem",cursor:"pointer",marginTop:"0.3rem"}}>
              {isSel?"▲ Hide":"▼ Show vote record"}</button>}
            {isSel&&<VotingGrid motion={m} players={players}/>}
          </Card>
        );
      })}
      {motions.length===0&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.88rem"}}>No motions have been proposed yet.</div>}
    </div>
  );
}

function OrdersPanel({orders,game,players}){
  // Group by session label
  const grouped={};
  orders.forEach(o=>{const k=o.session||"Unknown";if(!grouped[k])grouped[k]=[];grouped[k].push(o);});
  const sessions=Object.keys(grouped).sort().reverse();
  const currSess=sLab(game);
  const roleColor=role=>POS[role]?.color||T.mut;
  return(
    <div>
      <STit c="Public Record of Office Actions" sub="All submitted orders are public record. Resolutions are private to each office."/>
      {sessions.length===0&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.88rem"}}>No orders have been submitted yet.</div>}
      {sessions.map(sess=>(
        <div key={sess}>
          <div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"0.72rem",letterSpacing:"0.15em",marginBottom:"0.4rem",marginTop:"0.75rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
            {sess}{sess===currSess&&<Badge c="CURRENT SESSION" color={T.gold} sm/>}
          </div>
          {grouped[sess].map(o=>{
            const pos=o.role?POS[o.role]:null;
            const pl=players.find(p=>p.id===o.playerId);
            return(
              <Card key={o.id} style={{borderLeft:`3px solid ${pos?.color||T.fnt}`,marginBottom:"0.4rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.3rem"}}>
                  <div>
                    <span style={{fontFamily:"'Cinzel',serif",color:pos?.color||T.mut,fontSize:"0.78rem",fontWeight:700}}>{pos?.title||o.role}</span>
                    <span style={{color:T.mut,fontSize:"0.75rem",marginLeft:"0.5rem"}}>— {o.playerName}</span>
                  </div>
                  <Badge c={o.status==="resolved"?"RESOLVED":o.status==="deadline_missed"?"MISSED":"PENDING"} color={o.status==="resolved"?T.gre:o.status==="deadline_missed"?T.rhi:T.gold} sm/>
                </div>
                <div style={{fontSize:"0.88rem",lineHeight:1.5,color:T.text,background:T.bg,padding:"0.4rem 0.6rem",border:`1px solid ${T.fnt}`,whiteSpace:"pre-wrap"}}>{o.text}</div>
              </Card>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function MyOfficePanel({user,game,legions,players,orders,deadline,onRefresh}){
  const role=user.role;
  const pos=POS[role];
  const [text,setText]=useState("");
  const [sent,setSent]=useState(false);
  const [err,setErr]=useState("");
  if(!pos)return<div style={{color:T.mut,fontStyle:"italic"}}>You have not been assigned a position.</div>;

  const currSess=sLab(game);
  const myOrders=orders.filter(o=>o.role===role);
  const thisSession=myOrders.find(o=>o.session===currSess);
  const pastOrders=myOrders.filter(o=>o.session!==currSess).sort((a,b)=>b.session?.localeCompare(a.session||"")||0);

  const deadlineDate=deadline?.deadline?new Date(deadline.deadline):null;
  const deadlinePassed=deadlineDate&&deadlineDate<new Date();
  const deadlineClosed=deadline?.status==="closed";
  const canSubmit=!thisSession&&!deadlineClosed;

  const submit=async()=>{
    if(!text.trim()){setErr("Orders cannot be empty.");return;}
    const all=await db.get("spqr_o")||[];
    const o={id:Date.now().toString(),playerId:user.id,playerName:user.latinName,role,roleName:pos.title,text:text.trim(),session:currSess,status:"pending",resolution:null,resolutionImage:null,created:new Date().toISOString()};
    await db.set("spqr_o",[...all,o]);
    await pushN("Order Submitted",`${pos.title} (${user.latinName}) has submitted orders for ${currSess}`,"gm");
    await pushN("Orders Filed",`Your orders as ${pos.title} have been filed for ${currSess}`,user.id);
    setText("");setSent(true);setErr("");onRefresh();
  };

  const isConsul=role.startsWith("consul");
  const isQuaestor=role.startsWith("quaestor");
  const isCensor=role.startsWith("censor");
  const isAedile=role.startsWith("aedile");

  return(
    <div>
      {/* Position header */}
      <Card style={{borderLeft:`3px solid ${pos.color}`,background:pos.bg}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.5rem",marginBottom:"0.5rem"}}>
          <div style={{fontFamily:"'Cinzel',serif",color:pos.color,fontSize:"1.05rem",fontWeight:700}}>{pos.title}</div>
          <Badge c={pos.abbr} color={pos.color}/>
        </div>
        <div style={{fontSize:"0.9rem",color:T.mut,lineHeight:1.6,marginBottom:"0.75rem"}}>{pos.desc}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
          <div>
            <STit c="Powers — What You Can Do"/>
            {pos.can.map((p,i)=><div key={i} style={{display:"flex",gap:"0.4rem",marginBottom:"0.3rem",fontSize:"0.82rem",lineHeight:1.4}}><span style={{color:pos.color,flexShrink:0}}>✓</span><span style={{color:T.text}}>{p}</span></div>)}
          </div>
          <div>
            <STit c="Limits — What You Cannot Do"/>
            {pos.cannot.map((p,i)=><div key={i} style={{display:"flex",gap:"0.4rem",marginBottom:"0.3rem",fontSize:"0.82rem",lineHeight:1.4}}><span style={{color:T.rhi,flexShrink:0}}>✗</span><span style={{color:T.mut}}>{p}</span></div>)}
          </div>
        </div>
      </Card>

      {/* Relevant data pane */}
      {(isConsul||isCensor)&&(
        <Card>
          <STit c="Legion Status"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"0.35rem"}}>
            {legions.map(l=>{
              const sc={active:T.blue,raising:T.gold,destroyed:T.rhi,unraised:T.fnt};
              return<div key={l.id} style={{display:"flex",justifyContent:"space-between",padding:"0.3rem 0.5rem",background:T.bg,border:`1px solid ${T.border}`,fontSize:"0.82rem"}}>
                <span>{l.name||`Legio ${l.id}`}</span><span style={{color:sc[l.status]||T.mut}}>{l.status==="active"?`${fmt(l.str)} men`:l.status==="raising"?`Raising ${l.prog}/${game.lturns}t`:l.status.toUpperCase()}</span>
              </div>;
            })}
          </div>
        </Card>
      )}
      {(isQuaestor)&&(
        <Card>
          <STit c="Treasury"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"0.4rem"}}>
            <Stat label="Gold" value={`${fmt(game.gold)}T`}/>
            <Stat label="Legion Upkeep" value={`-${fmt(legions.filter(l=>l.status==="active").length*game.legionUpkeep)}T`} color={T.rhi}/>
            <Stat label="Net / Session" value={`${legions.filter(l=>l.status==="active").length*game.legionUpkeep>0?"—":"+"}${fmt(Math.abs(0))}`} color={T.mut}/>
          </div>
        </Card>
      )}
      {(isAedile||(role==="quaestor_2"))&&(
        <Card>
          <STit c="Food Supply"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"0.4rem"}}>
            <Stat label="Food" value={`${fmt(game.food)}M`} color="#A0D060"/>
            <Stat label="Legion Consumption" value={`-${fmt(legions.filter(l=>l.status==="active").length*game.legionFood)}M`} color={T.rhi}/>
            <Stat label="Population" value={fmt(game.pop)} color={T.mut}/>
          </div>
        </Card>
      )}

      {/* Deadline */}
      <Card>
        <STit c={`Submit Orders — ${currSess}`}/>
        {deadline?.deadline&&(
          <div style={{marginBottom:"0.75rem",padding:"0.5rem 0.75rem",background:deadlineClosed?"#200808":deadlinePassed?"#1a1000":"#0a1000",border:`1px solid ${deadlineClosed?T.rhi:deadlinePassed?T.gold:T.gre}`}}>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.75rem",color:deadlineClosed?T.rhi:deadlinePassed?T.gold:T.gre}}>
              {deadlineClosed?"⛔ DEADLINE CLOSED — Order submission ended":deadlinePassed?"⏳ DEADLINE PASSED — awaiting GM closure":`⏰ DEADLINE: ${new Date(deadline.deadline).toLocaleString()}`}
            </div>
          </div>
        )}
        {thisSession?(
          <div>
            <div style={{padding:"0.6rem",background:"#0a1a0a",border:`1px solid ${T.gre}`,color:T.gre,fontSize:"0.82rem",fontFamily:"'Cinzel',serif",marginBottom:"0.75rem"}}>
              ✓ Orders filed for {currSess}
            </div>
            <div style={{fontSize:"0.88rem",lineHeight:1.5,color:T.text,background:T.bg,padding:"0.5rem 0.75rem",border:`1px solid ${T.fnt}`,whiteSpace:"pre-wrap",marginBottom:"0.5rem"}}>{thisSession.text}</div>
            {thisSession.status==="resolved"&&thisSession.resolution&&(
              <div style={{marginTop:"0.75rem",padding:"0.6rem 0.75rem",background:"#0a0a1a",border:`1px solid #4060C0`}}>
                <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.7rem",color:"#8090D0",letterSpacing:"0.1em",marginBottom:"0.4rem"}}>GM RESOLUTION</div>
                <div style={{fontSize:"0.9rem",lineHeight:1.6,color:T.text,whiteSpace:"pre-wrap"}}>{thisSession.resolution}</div>
                {thisSession.resolutionImage&&<div style={{marginTop:"0.5rem"}}><a href={thisSession.resolutionImage} target="_blank" rel="noreferrer" style={{color:"#8090D0",fontSize:"0.8rem"}}>📎 View attached map/image</a></div>}
              </div>
            )}
            {thisSession.status==="pending"&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.8rem",marginTop:"0.4rem"}}>Awaiting GM resolution…</div>}
          </div>
        ):(
          <div>
            {canSubmit?(
              <>
                <div style={{fontSize:"0.85rem",color:T.mut,marginBottom:"0.6rem",fontStyle:"italic"}}>You may submit one set of orders per session. They will be visible to all senators as public record. The GM will resolve privately.</div>
                <Inp value={text} onChange={setText} rows={5} placeholder={`Write your orders as ${pos.title} for ${currSess}…\n\nBe specific about what you intend to do, which legions/resources are involved, and what outcome you seek.`}/>
                {err&&<div style={{color:T.rhi,fontSize:"0.85rem",marginBottom:"0.5rem"}}>{err}</div>}
                {sent&&<div style={{color:T.gre,fontSize:"0.85rem",marginBottom:"0.5rem"}}>Orders filed successfully.</div>}
                <Btn onClick={submit} disabled={!text.trim()}>🦅 Seal & Submit Orders</Btn>
              </>
            ):(
              <div style={{padding:"0.6rem 0.75rem",background:"#200808",border:`1px solid ${T.rhi}`,color:T.rhi,fontSize:"0.85rem",fontFamily:"'Cinzel',serif"}}>
                {deadlineClosed?"⛔ Order submission has been closed by the GM for this session.":"⏰ Deadline has passed. You did not file orders this session."}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Private resolution history */}
      {pastOrders.length>0&&(
        <Card>
          <STit c="Private Archive — Your Past Resolutions"/>
          {pastOrders.map(o=>(
            <div key={o.id} style={{marginBottom:"0.75rem",padding:"0.6rem",background:T.bg,border:`1px solid ${T.border}`}}>
              <div style={{fontFamily:"'Cinzel',serif",color:T.mut,fontSize:"0.7rem",marginBottom:"0.3rem"}}>{o.session}</div>
              <div style={{fontSize:"0.85rem",color:T.mut,marginBottom:"0.4rem",whiteSpace:"pre-wrap"}}>{o.text}</div>
              {o.resolution?(
                <div style={{padding:"0.4rem 0.6rem",background:"#0a0a1a",border:`1px solid #4060C0`}}>
                  <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.65rem",color:"#8090D0",letterSpacing:"0.1em",marginBottom:"0.25rem"}}>GM RESOLUTION</div>
                  <div style={{fontSize:"0.85rem",color:T.text,whiteSpace:"pre-wrap"}}>{o.resolution}</div>
                  {o.resolutionImage&&<a href={o.resolutionImage} target="_blank" rel="noreferrer" style={{color:"#8090D0",fontSize:"0.75rem",display:"block",marginTop:"0.25rem"}}>📎 Attached image/map</a>}
                </div>
              ):<div style={{color:T.fnt,fontSize:"0.78rem",fontStyle:"italic"}}>No resolution recorded</div>}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function CharacterPanel({user,onUpdate}){
  const [av,setAv]=useState(user.avatar||null);
  const [msg,setMsg]=useState("");
  const fileRef=useRef();
  const handleFile=async(e)=>{
    const f=e.target.files?.[0];if(!f)return;
    const b64=await compress(f,200);
    const players=await db.get("spqr_p")||[];
    await db.set("spqr_p",players.map(p=>p.id===user.id?{...p,avatar:b64}:p));
    setAv(b64);setMsg("Avatar updated.");setTimeout(()=>setMsg(""),3000);
    onUpdate&&onUpdate({...user,avatar:b64});
  };
  const pos=user.role?POS[user.role]:null;
  return(
    <div>
      <Card style={{borderLeft:`3px solid ${pos?pos.color:T.gold}`}}>
        <STit c="My Character"/>
        <div style={{display:"flex",gap:"1rem",alignItems:"flex-start",flexWrap:"wrap",marginBottom:"0.75rem"}}>
          <div style={{flexShrink:0}}>
            {av?<img src={av} style={{width:140,height:140,objectFit:"cover",border:`2px solid ${pos?pos.color:T.bhi}`}} alt="Avatar"/>:
            <div style={{width:140,height:140,background:T.fnt,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${T.border}`,fontFamily:"'Cinzel',serif",color:T.mut,fontSize:"2rem"}}>{user.latinName?.[0]||"?"}</div>}
            <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" style={{display:"none"}}/>
            <button onClick={()=>fileRef.current.click()} style={{display:"block",marginTop:"0.4rem",background:"none",border:`1px solid ${T.border}`,color:T.mut,fontFamily:"'Cinzel',serif",fontSize:"0.62rem",padding:"0.2rem 0.4rem",cursor:"pointer",width:"100%",letterSpacing:"0.06em"}}>UPLOAD AVATAR</button>
            {msg&&<div style={{color:T.gre,fontSize:"0.72rem",marginTop:"0.2rem"}}>{msg}</div>}
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Cinzel',serif",color:T.ghi,fontSize:"1.1rem",fontWeight:700,marginBottom:"0.25rem"}}>{user.latinName}</div>
            <div style={{color:T.mut,fontSize:"0.85rem"}}>{user.charClass}</div>
            {user.discord&&<div style={{color:"#7289DA",fontSize:"0.82rem",marginTop:"0.2rem"}}>Discord: {user.discord}</div>}
            <div style={{color:T.fnt,fontSize:"0.75rem",marginTop:"0.15rem"}}>Enrolled: {new Date(user.joined).toLocaleDateString()}</div>
            {pos&&<div style={{marginTop:"0.5rem"}}><Badge c={pos.title} color={pos.color}/></div>}
          </div>
        </div>
      </Card>
      <Card>
        <STit c="Rules of the Senate"/>
        {["Every Senator may propose a motion. The GM approves before it goes to vote.",
          "Each Senator votes once per motion. Votes cannot be changed once cast.",
          "Magistrates with positions may submit one set of sealed orders per session.",
          "The Tribune's veto is absolute. No magistrate can override it.",
          "Death is permanent. A fallen senator's seat becomes vacant.",
          "All office actions are public record. Resolutions are private to each office.",
          "Positions are re-elected every year. Current year ends in Winter S2.",
          "Senate motions require GM approval before going to vote."]
          .map((r,i)=><div key={i} style={{display:"flex",gap:"0.5rem",marginBottom:"0.4rem",fontSize:"0.88rem",lineHeight:1.5}}><span style={{color:T.gold,minWidth:"1.1rem"}}>{i+1}.</span>{r}</div>)}
      </Card>
    </div>
  );
}

function LawsPanel({laws}){
  const list=(laws&&laws.length?laws:LAWS);
  return(
    <div>
      <Card style={{borderLeft:`3px solid ${T.gold}`}}>
        <STit c="Leges Romanae — Laws of the Roman Republic"/>
        <div style={{fontSize:"1rem",color:T.mut,marginBottom:"0.75rem",lineHeight:1.6}}>These laws govern the Republic and all who hold office within it. Ignorance is no defence before the law.</div>
      </Card>
      {list.map((l,i)=>(
        <Card key={i}>
          <div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"1rem",fontWeight:800,marginBottom:"0.45rem"}}>{l.t}</div>
          <div style={{fontSize:"1.05rem",lineHeight:1.7,color:T.text,whiteSpace:"pre-wrap"}}>{l.b}</div>
        </Card>
      ))}
    </div>
  );
}

function MapPanel({cfg}){
  return(
    <div>
      <Card>
        <STit c="War Map" sub="The GM can upload a campaign map image or add an external Legendkeeper link."/>
        {cfg?.mapImage&&(
          <div style={{marginBottom:"1rem",border:`1px solid ${T.bhi}`,background:T.bg,padding:"0.35rem",overflow:"auto"}}>
            <img src={cfg.mapImage} style={{width:"100%",maxHeight:"78vh",objectFit:"contain",display:"block"}} alt="Campaign map"/>
          </div>
        )}
        {cfg?.legendkeeperUrl&&(
          <a href={cfg.legendkeeperUrl} target="_blank" rel="noreferrer"
            style={{display:"inline-block",padding:"0.7rem 1.2rem",background:T.gold,color:T.bg,fontFamily:"'Cinzel',serif",fontSize:"0.9rem",letterSpacing:"0.1em",textDecoration:"none",fontWeight:800,marginBottom:"0.75rem"}}>
            🗺 Open Campaign Map on Legendkeeper
          </a>
        )}
        {!cfg?.mapImage&&!cfg?.legendkeeperUrl&&(
          <div style={{color:T.mut,fontStyle:"italic",fontSize:"1rem"}}>The Game Master has not yet uploaded or linked the campaign map.</div>
        )}
      </Card>
    </div>
  );
}

/* ══ PLAYER APP ═══════════════════════════════════════════════════════════ */
function PlayerApp({user:initUser,onLogout}){
  const [tab,setTab]=useState("senate");
  const [user,setUser]=useState(initUser);
  const [D,setD]=useState({players:[],game:DEF_GAME,legions:DEF_LEGIONS,motions:[],orders:[],deadline:null,cfg:{},laws:LAWS});

  const refresh=useCallback(async()=>{
    const [players,game,legions,motions,orders,deadline,cfg,laws]=await Promise.all([
      db.get("spqr_p"),db.get("spqr_g"),db.get("spqr_l"),
      db.get("spqr_m"),db.get("spqr_o"),db.get("spqr_deadline"),db.get("spqr_cfg"),db.get("spqr_laws")
    ]);
    setD({players:players||[],game:game||DEF_GAME,legions:legions||DEF_LEGIONS,
      motions:motions||[],orders:orders||[],deadline:deadline||null,cfg:cfg||{},laws:laws||LAWS});
    if(players){const me=players.find(p=>p.id===user.id);if(me)setUser(me);}
  },[user.id]);

  useEffect(()=>{refresh();const t=setInterval(refresh,20000);return()=>clearInterval(t);},[refresh]);

  const pos=user.role?POS[user.role]:null;
  const votingCount=D.motions.filter(m=>m.status==="voting").length;
  const newResolutions=(D.orders||[]).filter(o=>o.playerId===user.id&&o.status==="resolved"&&!o.seenByPlayer).length;

  const TABS=[
    {k:"senate",l:"Senate"},
    {k:"voting",l:`Voting${votingCount>0?` (${votingCount})`:""}`},
    {k:"orders",l:"Orders"},
    ...(pos?[{k:"office",l:`${pos.abbr}`}]:[]),
    {k:"character",l:"Character"},
    {k:"laws",l:"Laws"},
    {k:"map",l:"Map"},
  ];

  return(
    <div style={{minHeight:"100vh",background:T.bg}}>
      <style>{CSS}</style>
      <div className="spqr-topbar" style={{background:T.surf,borderBottom:`2px solid ${T.border}`,padding:"0.5rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.4rem",position:"sticky",top:0,zIndex:100}}>
        <div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"1rem",fontWeight:900,letterSpacing:"0.22em"}}>SPQR</div>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap"}}>
          <span style={{color:T.mut,fontSize:"0.75rem",fontFamily:"'Cinzel',serif"}}>{D.game.year} BC · {D.game.season} S{D.game.sessionInSeason}</span>
          {pos&&<Badge c={pos.abbr} color={pos.color}/>}
          <span style={{color:T.text,fontSize:"0.85rem",fontFamily:"'Cinzel',serif"}}>{user.latinName}</span>
          <NotifBell userId={user.id}/>
          <Btn v="ghost" sm onClick={refresh}>↺</Btn>
          <Btn v="ghost" sm onClick={onLogout}>Exit</Btn>
        </div>
      </div>
      <div className="spqr-tabs" style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:T.surf,overflowX:"auto",position:"sticky",top:"45px",zIndex:99}}>
        {TABS.map(({k,l})=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"0.55rem 0.9rem",background:tab===k?T.card:"transparent",color:tab===k?T.gold:T.mut,border:"none",borderBottom:tab===k?`2px solid ${T.gold}`:"2px solid transparent",fontFamily:"'Cinzel',serif",fontSize:"0.68rem",letterSpacing:"0.1em",whiteSpace:"nowrap",flexShrink:0}}>
            {l}
          </button>
        ))}
      </div>
      <div className="spqr-shell" style={{maxWidth:1120,margin:"0 auto",padding:"1rem"}}>
        {tab==="senate"    &&<SenatePanel players={D.players} D={D}/>}
        {tab==="voting"    &&<VotingPanel motions={D.motions} players={D.players} user={user} game={D.game} onRefresh={refresh}/>}
        {tab==="orders"    &&<OrdersPanel orders={D.orders} game={D.game} players={D.players}/>}
        {tab==="office"    &&pos&&<MyOfficePanel user={user} game={D.game} legions={D.legions} players={D.players} orders={D.orders} deadline={D.deadline} onRefresh={refresh}/>}
        {tab==="character" &&<CharacterPanel user={user} onUpdate={setUser}/>}
        {tab==="laws"      &&<LawsPanel laws={D.laws}/>}
        {tab==="map"       &&<MapPanel cfg={D.cfg}/>}
      </div>
    </div>
  );
}

/* ══ ADMIN PANELS ═════════════════════════════════════════════════════════ */

function AOverview({D}){
  const [, setR]=useState(0);
  const activeLegs=(D.legions||[]).filter(l=>l.status==="active");
  const inc=D.regions?calcInc(D.regions):{gold:0,food:0};
  const upkeepG=activeLegs.length*(D.game?.legionUpkeep||80);
  const upkeepF=activeLegs.length*(D.game?.legionFood||60);
  const pendingMotions=(D.motions||[]).filter(m=>m.status==="pending");
  const newOrders=(D.orders||[]).filter(o=>o.status==="pending");
  const vacant=Object.keys(POS).filter(k=>!(D.players||[]).find(p=>p.role===k));
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"0.5rem",marginBottom:"1rem"}}>
        <Stat label="Session" value={D.game?.session||1}/>
        <Stat label="Year" value={`${D.game?.year||218} BC`}/>
        <Stat label="Season" value={`${D.game?.season} S${D.game?.sessionInSeason}`}/>
        <Stat label="Gold" value={`${fmt(D.game?.gold)}T`}/>
        <Stat label="Food" value={`${fmt(D.game?.food)}M`} color="#A0D060"/>
        <Stat label="Population" value={fmt(D.game?.pop)} color={T.mut}/>
        <Stat label="Active Legions" value={activeLegs.length} color={T.blue}/>
        <Stat label="Senators" value={(D.players||[]).length}/>
        <Stat label="Vacant Posts" value={vacant.length} color={vacant.length>0?T.rhi:T.gre}/>
        <Stat label="Pending Motions" value={pendingMotions.length} color={pendingMotions.length>0?T.gold:T.mut}/>
        <Stat label="Unresolved Orders" value={newOrders.length} color={newOrders.length>0?T.gold:T.mut}/>
        <Stat label="Net Gold/Sess" value={`${inc.gold-upkeepG>=0?"+":""}${inc.gold-upkeepG}`} color={inc.gold-upkeepG>=0?T.gre:T.rhi}/>
      </div>
    </div>
  );
}

function ASenators({D,onRefresh}){
  const [loginOpen,setLoginOpen]=useState(D.cfg?.loginOpen!==false);
  const [selected,setSelected]=useState(null);
  const assign=async(playerId,role)=>{
    const players=await db.get("spqr_p")||[];
    const updated=players.map(p=>{
      if(p.role===role&&p.id!==playerId)return{...p,role:null};
      if(p.id===playerId)return{...p,role:role||null};
      return p;
    });
    await db.set("spqr_p",updated);
    const p=updated.find(x=>x.id===playerId);
    const pos=role?POS[role]:null;
    if(pos)await pushN("Position Assigned",`You have been appointed ${pos.title}`,playerId);
    else await pushN("Position Removed","Your position has been removed by the GM",playerId);
    onRefresh();
  };
  const removePlayer=async(playerId)=>{
    if(!confirm("Remove this senator permanently?"))return;
    const players=await db.get("spqr_p")||[];
    await db.set("spqr_p",players.filter(p=>p.id!==playerId));
    onRefresh();
  };
  const toggleLogin=async()=>{
    const cfg=await db.get("spqr_cfg")||{};
    const next=!loginOpen;
    await db.set("spqr_cfg",{...cfg,loginOpen:next});
    setLoginOpen(next);
  };
  return(
    <div>
      <Card>
        <STit c="Registration Control"/>
        <Row>
          <div style={{flex:1,fontSize:"0.88rem",color:T.mut}}>New player registration is currently <span style={{color:loginOpen?T.gre:T.rhi,fontFamily:"'Cinzel',serif"}}>{loginOpen?"OPEN":"CLOSED"}</span></div>
          <Btn v={loginOpen?"red":"green"} sm onClick={toggleLogin}>{loginOpen?"🔒 Close Registrations":"🔓 Open Registrations"}</Btn>
        </Row>
      </Card>
      <Card>
        <STit c="Curia Julia — Senate Seating" sub="GM view: click any occupied seat to open the senator profile."/>
        <SenateMap players={D.players||[]} onSelectPlayer={setSelected}/>
      </Card>
      <STit c={`Senator Roster (${(D.players||[]).length})`}/>
      {(D.players||[]).map(p=>{
        const pos=p.role?POS[p.role]:null;
        return(
          <Card key={p.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"0.5rem",marginBottom:"0.5rem"}}>
              <div style={{display:"flex",gap:"0.6rem",alignItems:"center"}}>
                {p.avatar?<img src={p.avatar} style={{width:36,height:36,objectFit:"cover",borderRadius:"50%",border:`1px solid ${pos?pos.color:T.border}`}} alt=""/>:<div style={{width:36,height:36,background:T.fnt,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",color:T.mut}}>{p.latinName?.[0]||"?"}</div>}
                <div>
                  <div style={{fontFamily:"'Cinzel',serif",color:T.text,fontWeight:600}}>{p.latinName}</div>
                  <div style={{color:T.mut,fontSize:"0.75rem"}}>{p.username} · {p.charClass}</div>
                  {p.discord&&<div style={{color:"#7289DA",fontSize:"0.72rem"}}>{p.discord}</div>}
                </div>
              </div>
              <div style={{display:"flex",gap:"0.4rem",alignItems:"center",flexWrap:"wrap"}}>
                {pos&&<Badge c={pos.title} color={pos.color} sm/>}
                <Btn v="red" sm onClick={()=>removePlayer(p.id)}>Remove</Btn>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
              <Lbl c="Assign Position"/>
              <select value={p.role||""} onChange={e=>assign(p.id,e.target.value||null)}
                style={{background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"0.28rem 0.5rem",fontFamily:"'Cinzel',serif",fontSize:"0.68rem",cursor:"pointer",flex:1}}>
                <option value="">— No Position —</option>
                {Object.entries(POS).map(([k,v])=><option key={k} value={k}>{v.title}</option>)}
              </select>
            </div>
          </Card>
        );
      })}
      {(D.players||[]).length===0&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.88rem"}}>No senators have enrolled.</div>}
      {selected&&<SenatorProfileModal player={selected} onClose={()=>setSelected(null)}/>}
    </div>
  );
}

function ALegions({D,onRefresh}){
  const [legs,setLegs]=useState(null);
  const [msg,setMsg]=useState("");
  useEffect(()=>{setLegs((D.legions||DEF_LEGIONS).map(l=>({name:l.name||`Legio ${l.id}`,max:l.max||5000,str:l.str??5000,...l})));},[D.legions]);
  if(!legs)return null;
  const upd=(i,k,v)=>setLegs(ls=>ls.map((l,j)=>j===i?{...l,[k]:(k==="str"||k==="max"||k==="prog")?Number(v):v}:l));
  const save=async()=>{await db.set("spqr_l",legs);setMsg("Saved.");onRefresh();setTimeout(()=>setMsg(""),2500);};
  const addLegion=()=>{const n=legs.length+1;setLegs(ls=>[...ls,{id:`${n}`,name:`Legio ${n}`,str:5000,max:5000,status:"active",prog:0,location:"Roma"}]);};
  const removeLegion=(i)=>{if(confirm("Remove this legion?"))setLegs(ls=>ls.filter((_,j)=>j!==i));};
  const raiseExisting=async(i)=>{
    const g=await db.get("spqr_g")||DEF_GAME;
    if(g.gold<g.lgold||g.food<g.lfood||g.pop<g.lpop){setMsg("Insufficient resources to raise a legion.");return;}
    await db.set("spqr_g",{...g,gold:g.gold-g.lgold,food:g.food-g.lfood,pop:g.pop-g.lpop});
    setLegs(ls=>ls.map((l,j)=>j===i?{...l,status:"raising",prog:0,str:0,max:l.max||5000,location:l.location||"Roma"}:l));
    setMsg("Raising started.");
  };
  const recruitNew=async()=>{
    const g=await db.get("spqr_g")||DEF_GAME;
    if(g.gold<g.lgold||g.food<g.lfood||g.pop<g.lpop){setMsg("Insufficient resources to recruit a new legion.");return;}
    await db.set("spqr_g",{...g,gold:g.gold-g.lgold,food:g.food-g.lfood,pop:g.pop-g.lpop});
    const n=legs.length+1;
    setLegs(ls=>[...ls,{id:`${n}`,name:`Legio ${n}`,str:0,max:5000,status:"raising",prog:0,location:"Roma"}]);
    setMsg("New legion recruitment started. Save to keep it.");
  };
  const sc={active:T.blue,raising:T.gold,destroyed:T.rhi,unraised:T.fnt};
  return(
    <div>
      {msg&&<div style={{padding:"0.55rem 0.8rem",background:"#0a1a0a",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.7rem",fontSize:"1rem"}}>{msg}</div>}
      <Card>
        <STit c="Legion Recruitment" sub="Legions are 5,000 soldiers by default. There is no hard limit; add or recruit as many as the campaign needs."/>
        <Row gap="0.5rem" wrap>
          <Btn v="green" onClick={recruitNew}>＋ Recruit New Legion</Btn>
          <Btn v="dark" onClick={addLegion}>＋ Add Legion Manually</Btn>
          <Btn onClick={save}>💾 Save Legion Data</Btn>
        </Row>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"0.6rem",marginBottom:"0.75rem"}}>
        {legs.map((l,i)=>(
          <div key={`${l.id}-${i}`} style={{background:T.card,border:`1px solid ${T.border}`,padding:"0.75rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem",gap:"0.5rem",flexWrap:"wrap"}}>
              <span style={{fontFamily:"'Cinzel',serif",color:T.text,fontWeight:800,fontSize:"1rem"}}>{l.name||`Legio ${l.id}`}</span>
              <div style={{display:"flex",gap:"0.35rem",alignItems:"center",flexWrap:"wrap"}}>
                <select value={l.status} onChange={e=>upd(i,"status",e.target.value)} style={{background:T.bg,border:`1px solid ${T.border}`,color:sc[l.status]||T.mut,padding:"0.25rem 0.4rem",fontFamily:"'Cinzel',serif",fontSize:"0.78rem"}}>
                  <option value="active">Active</option><option value="raising">Raising</option><option value="destroyed">Destroyed</option><option value="unraised">Unraised</option>
                </select>
                {(l.status==="destroyed"||l.status==="unraised")&&<Btn v="green" sm onClick={()=>raiseExisting(i)}>Raise</Btn>}
                <Btn v="red" sm onClick={()=>removeLegion(i)}>Remove</Btn>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.4rem"}}>
              {[ ["Legion ID","id","text"],["Legion Name","name","text"],["Strength","str","number"],["Max Soldiers","max","number"],["Location","location","text"],["Progress","prog","number"] ].map(([lb,k,type])=>(
                <div key={k}><Lbl c={lb}/><input type={type} value={l[k]??""} onChange={e=>upd(i,k,e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.35rem 0.5rem",fontSize:"0.95rem"}}/></div>
              ))}
            </div>
            {l.status==="raising"&&<div style={{marginTop:"0.45rem",fontSize:"0.9rem",color:T.gold}}>Progress: {l.prog||0}/{D.game?.lturns||3} turns. When finished, it becomes active at 5,000 soldiers.</div>}
          </div>
        ))}
      </div>
      <Btn onClick={save}>💾 Save Legion Data</Btn>
    </div>
  );
}


function ABackupRestore({onRefresh}){
  const [msg,setMsg]=useState("");
  const fileRef=useRef();
  const keys=["spqr_g","spqr_l","spqr_r","spqr_p","spqr_m","spqr_o","spqr_deadline","spqr_cfg","spqr_laws","spqr_n"];
  const exportData=async()=>{
    const data={version:1,exportedAt:new Date().toISOString(),keys:{}};
    for(const k of keys){data.keys[k]=await db.get(k);}
    const label=data.keys.spqr_g?sLab({...DEF_GAME,...data.keys.spqr_g}).replace(/[^a-zA-Z0-9]+/g,"-"):"game";
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`rome-yes-backup-${label}-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMsg("Backup exported. Keep the JSON file safe before updating GitHub/Railway.");
    setTimeout(()=>setMsg(""),5000);
  };
  const importData=async(e)=>{
    const f=e.target.files?.[0];
    if(!f)return;
    try{
      const text=await f.text();
      const data=JSON.parse(text);
      const payload=data.keys||data;
      if(!payload.spqr_g&&!payload.spqr_p&&!payload.spqr_m)throw new Error("This does not look like a ROME-YES backup file.");
      if(!confirm("Import this backup? This will replace the current shared game data for all players."))return;
      for(const k of keys){
        if(Object.prototype.hasOwnProperty.call(payload,k))await db.set(k,payload[k]);
      }
      setMsg("Backup imported successfully. Refreshing game data...");
      onRefresh&&onRefresh();
      setTimeout(()=>setMsg(""),5000);
    }catch(err){
      setMsg(`Import failed: ${err.message||err}`);
      setTimeout(()=>setMsg(""),6000);
    }finally{
      if(fileRef.current)fileRef.current.value="";
    }
  };
  return(
    <Card style={{borderLeft:`3px solid ${T.blue}`}}>
      <STit c="Backup / Restore Game Data" sub="Use this before uploading new GitHub changes. It protects senators, motions, orders, laws, legions, resources, map and settings."/>
      {msg&&<div style={{padding:"0.45rem 0.7rem",background:"#0a1a0a",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.65rem",fontSize:"0.95rem"}}>{msg}</div>}
      <div style={{fontSize:"0.95rem",color:T.mut,lineHeight:1.5,marginBottom:"0.75rem"}}>
        Export a backup before every major update. If anything disappears after a redeploy, import the JSON file here to restore the shared game.
      </div>
      <input type="file" ref={fileRef} onChange={importData} accept="application/json,.json" style={{display:"none"}}/>
      <Row gap="0.5rem" wrap>
        <Btn v="blue" onClick={exportData}>⬇ Export Backup</Btn>
        <Btn v="dark" onClick={()=>fileRef.current.click()}>⬆ Import Backup</Btn>
      </Row>
    </Card>
  );
}

function AResources({D,onRefresh}){
  const [g,setG]=useState(null);
  const [confirmAdv,setConfirmAdv]=useState(false);
  const [msg,setMsg]=useState("");
  useEffect(()=>{setG({...DEF_GAME,...D.game});},[D.game]);
  if(!g)return null;

  const regs=D.regions||DEF_REGIONS;
  const inc=calcInc(regs);
  const activeLegs=(D.legions||[]).filter(l=>l.status==="active");
  const upkeepG=activeLegs.length*g.legionUpkeep;
  const upkeepF=activeLegs.length*g.legionFood;

  const save=async()=>{await db.set("spqr_g",g);setMsg("Saved.");onRefresh();setTimeout(()=>setMsg(""),2500);};
  const doAdvance=async()=>{
    const seasons=["Spring","Summer","Autumn","Winter"];
    let {year,season,sessionInSeason,session,gold,food,pop,legionUpkeep,legionFood,lgold,lfood,lpop,lturns}=g;
    // Apply income / upkeep
    gold=gold+inc.gold-upkeepG;
    food=food+inc.food-upkeepF;
    // Advance session
    let newSess=sessionInSeason+1;
    let newSeason=season;let newYear=year;
    if(newSess>2){
      newSess=1;
      const idx=seasons.indexOf(season);
      const nIdx=(idx+1)%4;
      newSeason=seasons[nIdx];
      if(nIdx===0)newYear=year-1; // Winter -> Spring = new year
    }
    session++;
    // Tick raising legions
    const legs=await db.get("spqr_l")||DEF_LEGIONS;
    const nl=legs.map(l=>{
      if(l.status==="raising"){
        const np=l.prog+1;
        if(np>=lturns)return{...l,status:"active",str:l.max||5000,max:l.max||5000,prog:0};
        return{...l,prog:np};
      }
      return l;
    });
    await db.set("spqr_l",nl);
    const ng={...g,gold:Math.max(0,gold),food:Math.max(0,food),pop,year:newYear,season:newSeason,sessionInSeason:newSess,session};
    await db.set("spqr_g",ng);
    await db.set("spqr_deadline",null);
    setG(ng);setConfirmAdv(false);setMsg("Session advanced.");
    await pushN("session",`Session Advanced`,`The Senate enters ${newYear} BC ${newSeason} S${newSess}`);
    onRefresh();setTimeout(()=>setMsg(""),3000);
  };


  const goBack=async()=>{
    if(!confirm("Go back one session? This changes only the calendar/session counter, not resources or orders."))return;
    let ng={...g};
    ng.session=Math.max(1,(ng.session||1)-1);
    if((ng.sessionInSeason||1)>1){ng.sessionInSeason=1;}
    else{
      const idx=SEASONS.indexOf(ng.season);
      const prev=(idx-1+SEASONS.length)%SEASONS.length;
      ng.season=SEASONS[prev];
      ng.sessionInSeason=2;
      if(ng.season==="Winter")ng.year=(ng.year||218)+1;
    }
    await db.set("spqr_g",ng);
    await db.set("spqr_deadline",null);
    setG(ng);setMsg("Went back one session.");onRefresh();setTimeout(()=>setMsg(""),3000);
  };
  const restartGame=async()=>{
    if(!confirm("Restart the campaign? This will reset resources, legions, regions, motions, orders, deadlines and notifications. Senators and setup images/links are kept."))return;
    await db.set("spqr_g",DEF_GAME);
    await db.set("spqr_l",DEF_LEGIONS);
    await db.set("spqr_r",DEF_REGIONS);
    await db.set("spqr_m",[]);
    await db.set("spqr_o",[]);
    await db.set("spqr_deadline",null);
    await db.set("spqr_n",[]);
    setG(DEF_GAME);setMsg("Game restarted.");onRefresh();setTimeout(()=>setMsg(""),3000);
  };
  return(
    <div>
      {msg&&<div style={{padding:"0.4rem 0.75rem",background:"#0a1a0a",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.6rem",fontSize:"0.85rem"}}>{msg}</div>}
      <Card>
        <STit c="Current Session"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"0.4rem",marginBottom:"0.75rem"}}>
          <Stat label="Session" value={g.session}/>
          <Stat label="Season" value={`${g.season} S${g.sessionInSeason}`}/>
          <Stat label="Year" value={`${g.year} BC`}/>
          <Stat label="Net Gold/Sess" value={`${inc.gold-upkeepG>=0?"+":""}${inc.gold-upkeepG}`} color={inc.gold-upkeepG>=0?T.gre:T.rhi}/>
        </div>
        <Row gap="0.5rem" wrap><Btn v="dark" onClick={()=>setConfirmAdv(true)}>▶ Advance Session</Btn><Btn v="ghost" onClick={goBack}>↩ Back One Turn</Btn><Btn v="red" onClick={restartGame}>⟲ Restart Game</Btn></Row>
      </Card>
      <ABackupRestore onRefresh={onRefresh}/>
      {confirmAdv&&(
        <Modal title="ADVANCE SESSION — CONFIRM" onClose={()=>setConfirmAdv(false)}>
          <div style={{marginBottom:"1rem"}}>
            <STit c="Session Summary"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.75rem"}}>
              <Stat label="Current" value={sLab(g)}/>
              <Stat label="After Advance" value={`${g.sessionInSeason===2?(SEASONS[(SEASONS.indexOf(g.season)+1)%4]+` S1`):g.season+` S2`}`}/>
              <Stat label="Gold Income" value={`+${inc.gold}T`} color={T.gre}/>
              <Stat label="Legion Upkeep" value={`-${upkeepG}T`} color={T.rhi}/>
              <Stat label="Food Income" value={`+${inc.food}M`} color="#A0D060"/>
              <Stat label="Legion Food" value={`-${upkeepF}M`} color={T.rhi}/>
              <Stat label="Gold After" value={`${fmt(Math.max(0,g.gold+inc.gold-upkeepG))}T`}/>
              <Stat label="Food After" value={`${fmt(Math.max(0,g.food+inc.food-upkeepF))}M`} color="#A0D060"/>
            </div>
            <div style={{color:T.mut,fontSize:"0.82rem",fontStyle:"italic",marginBottom:"0.75rem"}}>Raising legions will advance by 1 turn. The deadline for current session will be cleared.</div>
          </div>
          <Row gap="0.5rem">
            <Btn v="gold" onClick={doAdvance}>✓ Confirm — Advance Session</Btn>
            <Btn v="ghost" onClick={()=>setConfirmAdv(false)}>Cancel</Btn>
          </Row>
        </Modal>
      )}
      <Card>
        <STit c="Resources"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"0.4rem",marginBottom:"0.75rem"}}>
          {[["gold","Gold (Talents)","number"],["food","Food (Modii)","number"],["pop","Population","number"]].map(([k,l,t])=>(
            <div key={k}><Lbl c={l}/><input type={t} value={g[k]} onChange={e=>setG(x=>({...x,[k]:Number(e.target.value)}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"0.3rem 0.5rem",fontFamily:"'Cinzel',serif",fontSize:"0.85rem"}}/></div>
          ))}
        </div>
        <STit c="Cost to Raise a Legion"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"0.4rem",marginBottom:"0.75rem"}}>
          {[["lgold","Gold"],["lfood","Food"],["lpop","Population"],["lturns","Turns"]].map(([k,l])=>(
            <div key={k}><Lbl c={l}/><input type="number" value={g[k]} onChange={e=>setG(x=>({...x,[k]:Number(e.target.value)}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"0.3rem 0.5rem",fontSize:"0.82rem"}}/></div>
          ))}
        </div>
        <STit c="Per-Legion Upkeep per Session"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.4rem",marginBottom:"0.75rem"}}>
          {[["legionUpkeep","Gold per Legion"],["legionFood","Food per Legion"]].map(([k,l])=>(
            <div key={k}><Lbl c={l}/><input type="number" value={g[k]} onChange={e=>setG(x=>({...x,[k]:Number(e.target.value)}))} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"0.3rem 0.5rem",fontSize:"0.82rem"}}/></div>
          ))}
        </div>
        <Btn onClick={save}>💾 Save Resources</Btn>
      </Card>
    </div>
  );
}

function ARegions({D,onRefresh}){
  const [regs,setRegs]=useState(null);
  const [msg,setMsg]=useState("");
  useEffect(()=>{setRegs((D.regions||DEF_REGIONS).map(r=>({...r})));},[D.regions]);
  if(!regs)return null;
  const upd=(i,k,v)=>setRegs(rs=>rs.map((r,j)=>j===i?{...r,[k]:isNaN(Number(v))&&k!=="s"?v:k==="s"?v:Number(v)}:r));
  const save=async()=>{await db.set("spqr_r",regs);setMsg("Saved.");onRefresh();setTimeout(()=>setMsg(""),2500);};
  const inc=calcInc(regs);
  return(
    <div>
      {msg&&<div style={{padding:"0.4rem 0.75rem",background:"#0a1a0a",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.6rem",fontSize:"0.85rem"}}>{msg}</div>}
      <Card>
        <STit c="Projected Income from Regions"/>
        <Row gap="0.75rem">
          <Stat label="Total Gold Income" value={`+${fmt(inc.gold)}T`} color={T.gre}/>
          <Stat label="Total Food Income" value={`+${fmt(inc.food)}M`} color="#A0D060"/>
        </Row>
      </Card>
      <STit c="Region Status"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"0.4rem"}}>
        {regs.map((r,i)=>{
          const st=RS[r.s]||RS.roman;
          return(
            <div key={r.id} style={{background:T.card,border:`1px solid ${T.border}`,padding:"0.6rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.4rem",flexWrap:"wrap",gap:"0.3rem"}}>
                <span style={{fontFamily:"'Cinzel',serif",color:T.text,fontWeight:600,fontSize:"0.85rem"}}>{r.name}</span>
                <select value={r.s} onChange={e=>upd(i,"s",e.target.value)}
                  style={{background:T.bg,border:`1px solid ${st.c}`,color:st.c,padding:"0.15rem 0.35rem",fontFamily:"'Cinzel',serif",fontSize:"0.65rem",cursor:"pointer"}}>
                  {Object.entries(RS).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}
                </select>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.3rem"}}>
                {[["bG","Base Gold"],["bF","Base Food"]].map(([k,l])=>(
                  <div key={k}><Lbl c={l}/><input type="number" value={r[k]} onChange={e=>upd(i,k,e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.2rem 0.35rem",fontSize:"0.78rem"}}/></div>
                ))}
                <div style={{textAlign:"center",paddingTop:"0.4rem"}}>
                  <Lbl c="Effective"/>
                  <div style={{fontFamily:"'Cinzel',serif",color:st.c,fontSize:"0.75rem"}}>{Math.floor(r.bG*st.m)}T / {Math.floor(r.bF*st.m)}M</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:"0.75rem"}}><Btn onClick={save}>💾 Save Regions</Btn></div>
    </div>
  );
}

function AMotions({D,onRefresh}){
  const resolve=async(id,status)=>{
    const all=await db.get("spqr_m")||[];
    const m=all.find(x=>x.id===id);
    await db.set("spqr_m",all.map(x=>x.id===id?{...x,status}:x));
    if(status==="voting"&&m)await pushN("motion_open",`Motion Open to Vote`,`"${m.title}" is now open for a Senate vote.`);
    if((status==="passed"||status==="failed")&&m)await pushN("motion_result",`Motion ${status.toUpperCase()}`,`"${m.title}" has ${status}.`);
    onRefresh();
  };
  const scol={pending:T.mut,voting:T.gold,passed:T.gre,failed:T.rhi,rejected:"#555"};
  return(
    <div>
      <STit c="Senate Motions"/>
      {(D.motions||[]).length===0&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.88rem"}}>No motions yet.</div>}
      {[...(D.motions||[])].reverse().map(m=>{
        const yeas=Object.values(m.votes||{}).filter(v=>v==="yea").length;
        const nays=Object.values(m.votes||{}).filter(v=>v==="nay").length;
        return(
          <Card key={m.id} style={{borderLeft:`3px solid ${scol[m.status]||T.fnt}`}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.35rem"}}>
              <div style={{fontFamily:"'Cinzel',serif",color:T.text,fontWeight:600,fontSize:"0.88rem"}}>{m.title}</div>
              <Badge c={m.status.toUpperCase()} color={scol[m.status]||T.mut} sm/>
            </div>
            <div style={{color:T.mut,fontSize:"0.7rem",marginBottom:"0.4rem",fontFamily:"'Cinzel',serif"}}>By {m.byName} · {m.session||""}</div>
            <div style={{fontSize:"0.88rem",lineHeight:1.5,color:T.text,marginBottom:"0.5rem"}}>{m.body}</div>
            {m.status==="voting"&&<div style={{color:T.mut,fontSize:"0.8rem",marginBottom:"0.4rem"}}>Votes: AYE {yeas} · NAY {nays} · Total {Object.keys(m.votes||{}).length}</div>}
            <Row gap="0.4rem" wrap>
              {m.status==="pending"&&<><Btn v="green" sm onClick={()=>resolve(m.id,"voting")}>✓ Open to Vote</Btn><Btn v="crimson" sm onClick={()=>resolve(m.id,"rejected")}>✗ Reject</Btn></>}
              {m.status==="voting"&&<><Btn v="green" sm onClick={()=>resolve(m.id,"passed")}>✓ Pass</Btn><Btn v="red" sm onClick={()=>resolve(m.id,"failed")}>✗ Fail</Btn><Btn v="ghost" sm onClick={()=>resolve(m.id,"pending")}>← Reopen</Btn></>}
              {["passed","failed","rejected"].includes(m.status)&&<Btn v="ghost" sm onClick={()=>resolve(m.id,"pending")}>← Reset</Btn>}
            </Row>
          </Card>
        );
      })}
    </div>
  );
}

function AOrders({D,onRefresh}){
  const [resForm,setResForm]=useState(null); // {orderId, text, imgUrl}
  const [deadline,setDeadline]=useState(D.deadline?.deadline||"");
  const [dlMsg,setDlMsg]=useState("");

  const grouped={};
  (D.orders||[]).forEach(o=>{const k=o.session||"?";if(!grouped[k])grouped[k]=[];grouped[k].push(o);});
  const sessions=Object.keys(grouped).sort().reverse();
  const currSess=sLab(D.game||DEF_GAME);

  const submitRes=async()=>{
    if(!resForm)return;
    const all=await db.get("spqr_o")||[];
    const o=all.find(x=>x.id===resForm.orderId);
    if(!o)return;
    const updated={...o,status:"resolved",resolution:resForm.text,resolutionImage:resForm.imgUrl||null};
    await db.set("spqr_o",all.map(x=>x.id===resForm.orderId?updated:x));
    await pushN("order_resolved",`Resolution from the GM`,`Your orders as ${o.roleName} for ${o.session} have been resolved.`,o.playerId);
    setResForm(null);onRefresh();
  };

  const setDeadlineDb=async()=>{
    if(!deadline){await db.set("spqr_deadline",null);setDlMsg("Deadline cleared.");onRefresh();return;}
    await db.set("spqr_deadline",{deadline,status:"open",session:currSess});
    await pushN("deadline",`Order Deadline Set`,`The GM has set a deadline of ${new Date(deadline).toLocaleString()} for ${currSess}.`);
    setDlMsg("Deadline set.");onRefresh();setTimeout(()=>setDlMsg(""),2500);
  };

  const closeDeadline=async()=>{
    // Mark all un-submitted offices as missed for current session
    const all=await db.get("spqr_o")||[];
    const players=await db.get("spqr_p")||[];
    const roleHolders=players.filter(p=>p.role);
    const newOrders=[...all];
    roleHolders.forEach(p=>{
      const already=all.find(o=>o.session===currSess&&o.role===p.role);
      if(!already){
        const pos=POS[p.role];
        newOrders.push({id:Date.now()+Math.random().toString(36).slice(2),playerId:p.id,playerName:p.latinName,role:p.role,roleName:pos?.title||p.role,text:"[No orders filed — deadline missed]",session:currSess,status:"deadline_missed",resolution:null,resolutionImage:null,created:new Date().toISOString()});
        pushN("deadline",`Deadline Missed`,`Your orders as ${pos?.title||p.role} were not filed before the deadline.`,p.id);
      }
    });
    await db.set("spqr_o",newOrders);
    await db.set("spqr_deadline",{...D.deadline,status:"closed"});
    onRefresh();setDlMsg("Deadline closed. Missing offices marked.");
  };

  const posColor=role=>POS[role]?.color||T.mut;

  return(
    <div>
      {/* Deadline control */}
      <Card>
        <STit c="Order Deadline"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:"0.4rem",alignItems:"end"}}>
          <div><Lbl c="Set Deadline (date & time)"/><input type="datetime-local" value={deadline} onChange={e=>setDeadline(e.target.value)} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"0.3rem 0.5rem",fontSize:"0.85rem"}}/></div>
          <Btn sm onClick={setDeadlineDb}>Set Deadline</Btn>
          <Btn v="red" sm onClick={closeDeadline} disabled={!D.deadline?.deadline}>Close & Mark Missed</Btn>
        </div>
        {dlMsg&&<div style={{color:T.gre,fontSize:"0.82rem",marginTop:"0.4rem"}}>{dlMsg}</div>}
        {D.deadline?.deadline&&(
          <div style={{marginTop:"0.5rem",fontSize:"0.82rem",color:D.deadline.status==="closed"?T.rhi:T.gold}}>
            Current deadline: {new Date(D.deadline.deadline).toLocaleString()} · Status: {D.deadline.status}
          </div>
        )}
      </Card>

      {/* Orders by session */}
      {sessions.map(sess=>(
        <div key={sess}>
          <div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"0.72rem",letterSpacing:"0.15em",marginBottom:"0.4rem",marginTop:"0.75rem",display:"flex",gap:"0.5rem",alignItems:"center"}}>
            {sess}{sess===currSess&&<Badge c="CURRENT" color={T.gold} sm/>}
          </div>
          {grouped[sess].map(o=>{
            const pos=o.role?POS[o.role]:null;
            return(
              <Card key={o.id} style={{borderLeft:`3px solid ${pos?.color||T.fnt}`,marginBottom:"0.4rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.35rem"}}>
                  <div>
                    <span style={{fontFamily:"'Cinzel',serif",color:pos?.color||T.mut,fontWeight:700,fontSize:"0.78rem"}}>{pos?.title||o.role}</span>
                    <span style={{color:T.mut,fontSize:"0.75rem",marginLeft:"0.5rem"}}>— {o.playerName}</span>
                  </div>
                  <Badge c={o.status==="resolved"?"RESOLVED":o.status==="deadline_missed"?"MISSED":"PENDING"} color={o.status==="resolved"?T.gre:o.status==="deadline_missed"?T.rhi:T.gold} sm/>
                </div>
                <div style={{fontSize:"0.88rem",lineHeight:1.5,color:T.text,background:T.bg,padding:"0.4rem 0.6rem",border:`1px solid ${T.fnt}`,marginBottom:"0.4rem",whiteSpace:"pre-wrap"}}>{o.text}</div>
                {o.resolution&&(
                  <div style={{padding:"0.4rem 0.6rem",background:"#0a0a1a",border:`1px solid #4060C0`,marginBottom:"0.4rem",fontSize:"0.82rem",color:"#A0B0E0",whiteSpace:"pre-wrap"}}><span style={{fontFamily:"'Cinzel',serif",fontSize:"0.65rem",letterSpacing:"0.1em",display:"block",marginBottom:"0.2rem"}}>GM RESOLUTION:</span>{o.resolution}</div>
                )}
                {o.status!=="deadline_missed"&&(
                  <Btn sm v="dark" onClick={()=>setResForm({orderId:o.id,text:o.resolution||"",imgUrl:o.resolutionImage||""})}>
                    {o.status==="resolved"?"✎ Edit Resolution":"✍ Resolve This Order"}
                  </Btn>
                )}
              </Card>
            );
          })}
        </div>
      ))}
      {sessions.length===0&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.88rem"}}>No orders submitted yet.</div>}

      {/* Resolution modal */}
      {resForm&&(
        <Modal title="RESOLVE ORDER" onClose={()=>setResForm(null)} wide>
          <div style={{fontSize:"0.88rem",color:T.mut,marginBottom:"0.75rem",fontStyle:"italic"}}>Write the outcome of this order. Only the office holder will see this resolution.</div>
          <Inp label="Resolution Text" value={resForm.text} onChange={v=>setResForm(f=>({...f,text:v}))} rows={6} placeholder="Describe what happened as a result of these orders…"/>
          <Inp label="Attach Image / Map URL (optional)" value={resForm.imgUrl} onChange={v=>setResForm(f=>({...f,imgUrl:v}))} placeholder="https://…"/>
          <Row gap="0.5rem">
            <Btn v="gold" onClick={submitRes}>✓ Submit Resolution</Btn>
            <Btn v="ghost" onClick={()=>setResForm(null)}>Cancel</Btn>
          </Row>
        </Modal>
      )}
    </div>
  );
}

function ALaws({D,onRefresh}){
  const [laws,setLaws]=useState((D.laws&&D.laws.length?D.laws:LAWS).map(x=>({...x})));
  const [msg,setMsg]=useState("");
  useEffect(()=>{setLaws((D.laws&&D.laws.length?D.laws:LAWS).map(x=>({...x})));},[D.laws]);
  const upd=(i,k,v)=>setLaws(ls=>ls.map((l,j)=>j===i?{...l,[k]:v}:l));
  const add=()=>setLaws(ls=>[...ls,{t:"New Roman Law",b:"Write the text of the law here."}]);
  const del=i=>{if(confirm("Delete this law?"))setLaws(ls=>ls.filter((_,j)=>j!==i));};
  const save=async()=>{await db.set("spqr_laws",laws);setMsg("Laws saved.");onRefresh();setTimeout(()=>setMsg(""),2500);};
  const reset=async()=>{if(!confirm("Reset laws to the default Roman laws?"))return;await db.set("spqr_laws",LAWS);setLaws(LAWS.map(x=>({...x})));setMsg("Laws reset.");onRefresh();};
  return(
    <div>
      {msg&&<div style={{padding:"0.55rem 0.8rem",background:"#0a1a0a",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.7rem",fontSize:"1rem"}}>{msg}</div>}
      <Card>
        <STit c="Laws Editor" sub="These laws appear in the player Laws tab."/>
        <Row gap="0.5rem" wrap><Btn v="green" onClick={add}>＋ Add New Law</Btn><Btn onClick={save}>💾 Save Laws</Btn><Btn v="ghost" onClick={reset}>Reset Defaults</Btn></Row>
      </Card>
      {laws.map((l,i)=>(
        <Card key={i}>
          <Inp label={`Law ${i+1} Title`} value={l.t} onChange={v=>upd(i,"t",v)}/>
          <Inp label="Law Text" value={l.b} onChange={v=>upd(i,"b",v)} rows={4}/>
          <Btn v="red" sm onClick={()=>del(i)}>Delete Law</Btn>
        </Card>
      ))}
      <Btn onClick={save}>💾 Save Laws</Btn>
    </div>
  );
}

function ASetup({D,onRefresh}){
  const [cfg,setCfg]=useState({...(D.cfg||{})});
  const [msg,setMsg]=useState("");
  const mapRef=useRef();
  useEffect(()=>{setCfg({...(D.cfg||{})});},[D.cfg]);
  const save=async()=>{await db.set("spqr_cfg",cfg);setMsg("Settings saved.");onRefresh();setTimeout(()=>setMsg(""),2500);};
  const handleMap=async(e)=>{
    const f=e.target.files?.[0];if(!f)return;
    const b64=await compress(f,1800);
    setCfg(c=>({...c,mapImage:b64}));
    setMsg("Map uploaded. Click Save Settings to publish it.");
  };
  return(
    <div>
      {msg&&<div style={{padding:"0.5rem 0.8rem",background:"#0a1a0a",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.7rem",fontSize:"1rem"}}>{msg}</div>}
      <Card>
        <STit c="Senate Tab — Header Image"/>
        <div style={{fontSize:"1rem",color:T.mut,marginBottom:"0.75rem"}}>Paste a public image URL. Players will see this image at the top of the Senate tab.</div>
        <Inp label="Senate Image URL" value={cfg.senateImage||""} onChange={v=>setCfg(c=>({...c,senateImage:v}))} placeholder="https://… (a painting of the Roman Senate)"/>
        {cfg.senateImage&&<div style={{marginBottom:"0.75rem",border:`1px solid ${T.bhi}`,overflow:"auto",maxHeight:"60vh",background:T.bg,borderRadius:8}}><img src={cfg.senateImage} style={{width:"100%",maxHeight:"60vh",objectFit:"contain",display:"block"}} alt="Preview" onError={()=>{}}/></div>}
      </Card>
      <Card>
        <STit c="Campaign Map" sub="Upload an actual map image for the Map tab. You can also keep a Legendkeeper link."/>
        <input type="file" ref={mapRef} onChange={handleMap} accept="image/*" style={{display:"none"}}/>
        <Row gap="0.5rem" wrap><Btn v="dark" onClick={()=>mapRef.current.click()}>⬆ Upload Map Image</Btn>{cfg.mapImage&&<Btn v="red" onClick={()=>setCfg(c=>({...c,mapImage:null}))}>Remove Uploaded Map</Btn>}</Row>
        {cfg.mapImage&&<div style={{marginTop:"0.75rem",border:`1px solid ${T.bhi}`,background:T.bg,padding:"0.35rem",maxHeight:380,overflow:"auto"}}><img src={cfg.mapImage} style={{width:"100%",objectFit:"contain"}} alt="Map preview"/></div>}
        <div style={{marginTop:"0.75rem"}}><Inp label="Legendkeeper URL" value={cfg.legendkeeperUrl||""} onChange={v=>setCfg(c=>({...c,legendkeeperUrl:v}))} placeholder="https://app.legendkeeper.com/…"/></div>
      </Card>
      <Btn onClick={save}>💾 Save Settings</Btn>
    </div>
  );
}

/* ══ ADMIN APP ════════════════════════════════════════════════════════════ */
function AdminApp({onLogout}){
  const [tab,setTab]=useState("overview");
  const [D,setD]=useState({players:[],game:DEF_GAME,legions:DEF_LEGIONS,regions:DEF_REGIONS,motions:[],orders:[],deadline:null,cfg:{},laws:LAWS});

  const refresh=useCallback(async()=>{
    const [players,game,legions,regions,motions,orders,deadline,cfg,laws]=await Promise.all([
      db.get("spqr_p"),db.get("spqr_g"),db.get("spqr_l"),db.get("spqr_r"),
      db.get("spqr_m"),db.get("spqr_o"),db.get("spqr_deadline"),db.get("spqr_cfg"),db.get("spqr_laws")
    ]);
    setD({players:players||[],game:game||DEF_GAME,legions:legions||DEF_LEGIONS,
      regions:regions||DEF_REGIONS,motions:motions||[],orders:orders||[],deadline:deadline||null,cfg:cfg||{},laws:laws||LAWS});
  },[]);

  useEffect(()=>{refresh();const t=setInterval(refresh,20000);return()=>clearInterval(t);},[refresh]);

  const pendM=(D.motions||[]).filter(m=>m.status==="pending").length;
  const newO=(D.orders||[]).filter(o=>o.status==="pending").length;

  const TABS=[
    {k:"overview",l:"Overview"},
    {k:"senators",l:`Senators (${(D.players||[]).length})`},
    {k:"legions",l:"Legions"},
    {k:"resources",l:"Resources"},
    {k:"regions",l:"Regions"},
    {k:"motions",l:`Motions${pendM?` (${pendM})`:""}`},
    {k:"orders",l:`Orders${newO?` (${newO})`:""}`},
    {k:"laws",l:"Laws"},
    {k:"setup",l:"Setup"},
  ];

  return(
    <div style={{minHeight:"100vh",background:T.bg}}>
      <style>{CSS}</style>
      <div className="spqr-topbar" style={{background:"#0A0600",borderBottom:`2px solid ${T.red}`,padding:"0.5rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.4rem",position:"sticky",top:0,zIndex:100}}>
        <Row gap="0.6rem"><div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"1rem",fontWeight:900,letterSpacing:"0.22em"}}>SPQR</div><Badge c="GM PANEL" color={T.rhi}/></Row>
        <Row gap="0.5rem">
          <span style={{color:T.mut,fontSize:"0.75rem",fontFamily:"'Cinzel',serif"}}>{D.game.year} BC · {D.game.season} S{D.game.sessionInSeason}</span>
          <NotifBell userId="gm"/>
          <Btn v="ghost" sm onClick={refresh}>↺</Btn>
          <Btn v="ghost" sm onClick={onLogout}>Exit Panel</Btn>
        </Row>
      </div>
      <div className="spqr-tabs" style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:T.surf,overflowX:"auto",position:"sticky",top:"45px",zIndex:99}}>
        {TABS.map(({k,l})=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"0.55rem 0.9rem",background:tab===k?T.card:"transparent",color:tab===k?T.gold:T.mut,border:"none",borderBottom:tab===k?`2px solid ${T.gold}`:"2px solid transparent",fontFamily:"'Cinzel',serif",fontSize:"0.68rem",letterSpacing:"0.1em",whiteSpace:"nowrap",flexShrink:0}}>
            {l}
          </button>
        ))}
      </div>
      <div className="spqr-shell" style={{maxWidth:1180,margin:"0 auto",padding:"1rem"}}>
        {tab==="overview"  &&<AOverview D={D}/>}
        {tab==="senators"  &&<ASenators D={D} onRefresh={refresh}/>}
        {tab==="legions"   &&<ALegions D={D} onRefresh={refresh}/>}
        {tab==="resources" &&<AResources D={D} onRefresh={refresh}/>}
        {tab==="regions"   &&<ARegions D={D} onRefresh={refresh}/>}
        {tab==="motions"   &&<AMotions D={D} onRefresh={refresh}/>}
        {tab==="orders"    &&<AOrders D={D} onRefresh={refresh}/>}
        {tab==="laws"      &&<ALaws D={D} onRefresh={refresh}/>}
        {tab==="setup"     &&<ASetup D={D} onRefresh={refresh}/>}
      </div>
    </div>
  );
}

/* ══ LOGIN ════════════════════════════════════════════════════════════════ */
function LoginScreen({onLogin,onAdmin}){
  const [mode,setMode]=useState("login");
  const [f,setF]=useState({u:"",p:"",lat:"",cls:"Patrician",discord:"",ap:""});
  const [err,setErr]=useState("");const [loading,setLoading]=useState(false);
  const set=k=>v=>setF(x=>({...x,[k]:v}));

  const doLogin=async()=>{
    setLoading(true);setErr("");
    const ps=await db.get("spqr_p")||[];
    const p=ps.find(x=>x.username.toLowerCase()===f.u.toLowerCase()&&x.password===f.p);
    setLoading(false);
    if(!p)return setErr("Unknown senator or incorrect password.");
    onLogin(p);
  };
  const doReg=async()=>{
    if(!f.u||!f.p||!f.lat){setErr("All fields are required.");return;}
    if(!f.discord){setErr("Discord username is required to prevent duplicate accounts.");return;}
    setLoading(true);setErr("");
    const cfg=await db.get("spqr_cfg")||{};
    if(cfg.loginOpen===false){setLoading(false);setErr("Registration is currently closed by the Game Master.");return;}
    const ps=await db.get("spqr_p")||[];
    if(ps.find(x=>x.username.toLowerCase()===f.u.toLowerCase())){setLoading(false);setErr("That username is already taken.");return;}
    if(ps.find(x=>x.discord?.toLowerCase()===f.discord.toLowerCase())){setLoading(false);setErr("A senator with that Discord account already exists.");return;}
    const np={id:Date.now().toString(),username:f.u,password:f.p,latinName:f.lat,charClass:f.cls,discord:f.discord,role:null,avatar:null,joined:new Date().toISOString()};
    await db.set("spqr_p",[...ps,np]);
    setLoading(false);onLogin(np);
  };
  const doAdmin=()=>{if(f.ap===ADMIN_PASS)onAdmin();else setErr("Incorrect GM password.");};

  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:400}}>
        {/* Title */}
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:"3.5rem",fontWeight:900,color:T.gold,letterSpacing:"0.35em",textShadow:`0 0 80px rgba(200,146,42,0.35)`,lineHeight:1}}>SPQR</div>
          <div style={{color:T.mut,fontSize:"0.65rem",letterSpacing:"0.45em",marginTop:"0.5rem",fontFamily:"'Cinzel',serif"}}>SENATUS POPULUSQUE ROMANUS</div>
          <div style={{color:T.fnt,fontSize:"0.6rem",letterSpacing:"0.3em",marginTop:"0.2rem",fontFamily:"'Cinzel',serif"}}>218 BC · THE SENATE AT WAR</div>
        </div>

        <div style={{background:T.surf,border:`1px solid ${T.border}`,padding:"1.5rem",boxShadow:`0 0 120px rgba(200,146,42,0.06)`}}>
          {/* Mode tabs */}
          <div style={{display:"flex",border:`1px solid ${T.border}`,marginBottom:"1.25rem",overflow:"hidden"}}>
            {[["login","Senator Login"],["register","Enroll"],["admin","GM"]].map(([m,l])=>(
              <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"0.42rem 0.25rem",background:mode===m?T.gold:"transparent",color:mode===m?T.bg:T.mut,border:"none",fontFamily:"'Cinzel',serif",fontSize:"0.6rem",letterSpacing:"0.1em",cursor:"pointer"}}>
                {l}
              </button>
            ))}
          </div>

          {err&&<div style={{background:"#180606",border:`1px solid ${T.red}`,color:"#f09090",padding:"0.45rem 0.65rem",fontSize:"0.85rem",marginBottom:"0.9rem"}}>{err}</div>}

          {mode==="login"&&(
            <>
              <Inp label="Username" value={f.u} onChange={set("u")}/>
              <Inp label="Password" type="password" value={f.p} onChange={set("p")}/>
              <Btn full onClick={doLogin} disabled={loading}>{loading?"…":"Enter the Senate"}</Btn>
            </>
          )}
          {mode==="register"&&(
            <>
              <Inp label="Username" value={f.u} onChange={set("u")} placeholder="your login name"/>
              <Inp label="Password" type="password" value={f.p} onChange={set("p")}/>
              <Inp label="Latin Name (e.g. Marcus Tullius Cicero)" value={f.lat} onChange={set("lat")}/>
              <Inp label="Discord Username (required — prevents duplicate accounts)" value={f.discord} onChange={set("discord")} placeholder="your_discord_name"/>
              <div style={{marginBottom:"0.8rem"}}>
                <Lbl c="Social Class"/>
                <select value={f.cls} onChange={e=>setF(x=>({...x,cls:e.target.value}))} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,color:T.text,padding:"0.42rem 0.6rem",fontFamily:"'EB Garamond',serif",fontSize:"0.95rem"}}>
                  <option>Patrician</option><option>Plebeian</option><option>Equestrian</option>
                </select>
                <div style={{fontSize:"0.75rem",color:T.mut,marginTop:"0.3rem",lineHeight:1.4}}>
                  Patrician — old aristocracy · Plebeian — common citizen · Equestrian — wealthy merchant class
                </div>
              </div>
              <Btn full onClick={doReg} disabled={loading}>{loading?"…":"Join the Senate of Rome"}</Btn>
            </>
          )}
          {mode==="admin"&&(
            <>
              <div style={{color:T.mut,fontSize:"0.82rem",marginBottom:"0.75rem",fontStyle:"italic"}}>Game Master access. Enter the GM password.</div>
              <Inp label="GM Password" type="password" value={f.ap} onChange={set("ap")}/>
              <Btn full v="dark" onClick={doAdmin}>Access Control Panel</Btn>
            </>
          )}
        </div>
        <div style={{textAlign:"center",marginTop:"1rem",color:T.fnt,fontSize:"0.65rem",fontFamily:"'Cinzel',serif",letterSpacing:"0.12em"}}>
          ANNO DOMINI MCCXVIII A.U.C.
        </div>
      </div>
    </div>
  );
}

/* ══ ROOT ═════════════════════════════════════════════════════════════════ */
export default function App(){
  const [user,setUser]=useState(null);
  const [isAdmin,setIsAdmin]=useState(false);
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    (async()=>{
      const g=await db.get("spqr_g");
      if(!g){
        await Promise.all([
          db.set("spqr_g",DEF_GAME),
          db.set("spqr_l",DEF_LEGIONS),
          db.set("spqr_r",DEF_REGIONS),
          db.set("spqr_p",[]),
          db.set("spqr_m",[]),
          db.set("spqr_o",[]),
          db.set("spqr_n",[]),
          db.set("spqr_cfg",{loginOpen:true,senateImage:null,legendkeeperUrl:null}),
        ]);
      }
      setReady(true);
    })();
  },[]);

  if(!ready)return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0A0804",fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"1rem",letterSpacing:"0.3em"}}>
      <style>{CSS}</style>
      SPQR — Initialising…
    </div>
  );

  if(!user&&!isAdmin)return<LoginScreen onLogin={setUser} onAdmin={()=>setIsAdmin(true)}/>;
  if(isAdmin)return<AdminApp onLogout={()=>setIsAdmin(false)}/>;
  return<PlayerApp user={user} onLogout={()=>setUser(null)}/>;
}
