import React, { useState, useEffect, useCallback, useRef } from "react";

/* ══ GLOBAL CSS ═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{font-size:20px;-webkit-text-size-adjust:100%}
body{background:#F6EFE4;color:#26160F;font-family:'EB Garamond',serif;font-size:1.05rem;line-height:1.55}
img{max-width:100%}
::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#F6EFE4}::-webkit-scrollbar-thumb{background:#A32020}
input,select,textarea,button{outline:none;font-size:1rem}
button{cursor:pointer}
.spqr-card{overflow:hidden}.spqr-region-card{min-width:0}.spqr-region-head{display:flex;justify-content:space-between;gap:.6rem;align-items:flex-start;flex-wrap:wrap}.spqr-region-title{min-width:0;overflow-wrap:anywhere}.spqr-badge-wrap{max-width:100%;white-space:normal!important;overflow-wrap:anywhere;text-align:center}.spqr-field-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:.55rem}.spqr-military-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:.7rem}@media(max-width:900px){.spqr-military-grid{grid-template-columns:1fr}.spqr-field-grid{grid-template-columns:1fr}}
.election-table{width:100%;border-collapse:separate;border-spacing:0 .45rem}.election-table th{text-align:left;font-family:'Cinzel',serif;font-size:.72rem;letter-spacing:.08em;color:#7A4A18;text-transform:uppercase;padding:.25rem .4rem}.election-table td{background:#fff;padding:.55rem .45rem;border-top:1px solid #D6BFA3;border-bottom:1px solid #D6BFA3;vertical-align:top}.election-table td:first-child{border-left:1px solid #D6BFA3;border-radius:8px 0 0 8px}.election-table td:last-child{border-right:1px solid #D6BFA3;border-radius:0 8px 8px 0}.election-speech{white-space:pre-wrap;line-height:1.35;max-height:6.8rem;overflow:auto;font-size:.88rem;color:#3d2b20}.election-role-picker{display:grid;grid-template-columns:minmax(220px,420px);gap:.75rem;align-items:center}
@media(max-width:720px){html{font-size:17px}body{overflow-x:hidden}.spqr-shell{padding:0.65rem!important}.spqr-topbar{position:static!important;display:grid!important;grid-template-columns:1fr auto!important;grid-template-areas:"brand actions" "party actions"!important;gap:.22rem .45rem!important;padding:.45rem .55rem!important;align-items:start!important}.spqr-brand-season{grid-area:brand;flex-wrap:wrap!important;gap:.25rem!important}.spqr-party-center{grid-area:party;justify-self:start!important;text-align:left!important;max-width:100%!important}.spqr-top-actions{grid-area:actions;justify-content:flex-end!important;gap:.25rem!important;align-self:start!important;max-width:145px}.spqr-yearturn{font-size:.64rem!important;width:100%;text-align:right;white-space:normal}.spqr-player-name{font-size:.7rem!important;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.spqr-season-pill{font-size:.58rem!important;padding:.08rem .22rem!important;gap:.12rem!important;max-width:190px;overflow:hidden;text-overflow:ellipsis}.spqr-party-badge{font-size:.58rem!important;padding:.04rem .28rem!important;max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.spqr-tab-groups{position:static!important;top:auto!important}.spqr-tabs{position:static!important;top:auto!important}.spqr-senate-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:0.4rem}.spqr-modal{align-items:flex-start!important;padding:0.5rem!important}.spqr-modal-box{max-height:96vh!important;padding:1rem!important}.spqr-card-grid{grid-template-columns:1fr!important}.spqr-stat-grid{grid-template-columns:repeat(auto-fit,minmax(140px,1fr))!important}.spqr-resource-grid{grid-template-columns:1fr!important}.election-role-picker{grid-template-columns:1fr!important}.election-table,.election-table thead,.election-table tbody,.election-table tr,.election-table th,.election-table td{display:block;width:100%}.election-table thead{display:none}.election-table tr{margin-bottom:.65rem;border:1px solid #D6BFA3;border-radius:10px;background:#fff;padding:.45rem}.election-table td{border:none!important;border-radius:0!important;padding:.32rem .25rem}.election-table td:before{content:attr(data-label);display:block;font-family:'Cinzel',serif;color:#7A4A18;font-size:.66rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.1rem}.election-speech{font-size:.86rem!important;line-height:1.32!important;max-height:7.5rem!important;overflow:auto!important;background:#fffdf7;border:1px solid #E7D5BD;border-radius:8px;padding:.4rem}}
`;
const T={bg:"#F6EFE4",surf:"#FFF9EE",card:"#FFFFFF",border:"#D6BFA3",bhi:"#A32020",
  gold:"#B9872B",ghi:"#8C5F16",red:"#A32020",rhi:"#D63A2E",
  green:"#2F7D32",gre:"#46A04A",blue:"#284B7A",
  text:"#26160F",mut:"#4A382B",fnt:"#BFAE99"};
const RES={gold:{emoji:"🪙",name:"Gold",unit:"T",color:T.ghi},food:{emoji:"🌾",name:"Food",unit:"M",color:T.green},men:{emoji:"👥",name:"Manpower",unit:"men",color:T.blue}};
class ErrorBoundary extends React.Component{
  constructor(props){super(props);this.state={hasError:false,error:null};}
  static getDerivedStateFromError(error){return {hasError:true,error};}
  componentDidCatch(error,info){console.error("SPQR panel error",error,info);}
  render(){
    if(this.state.hasError){return <Card style={{borderLeft:`5px solid ${T.rhi}`,background:"#FFF1F1"}}><STit c="Panel Error Prevented" sub="The panel failed to render, but the app has not crashed. Refresh or contact the GM."/><div style={{color:T.rhi,fontFamily:"monospace",whiteSpace:"pre-wrap",fontSize:"0.8rem"}}>{String(this.state.error?.message||this.state.error||"Unknown error")}</div></Card>}
    return this.props.children;
  }
}

const CLASS_INFO={
  patrician:{emoji:"🏛️",label:"Patrician",color:"#7F1D1D",bg:"#FFF1F1",desc:"Old senatorial aristocracy and noble family influence."},
  plebeian:{emoji:"🌾",label:"Plebeian",color:"#2F7D32",bg:"#F0FFF4",desc:"Common citizens, farmers, artisans and popular political energy."},
  equestrian:{emoji:"🐎",label:"Equestrian",color:"#B7791F",bg:"#FFF7E6",desc:"Wealthy merchant/rider class, business, supply and practical influence."},
  novus:{emoji:"⭐",label:"Novus Homo",color:"#2563EB",bg:"#EFF6FF",desc:"A new man rising by merit, ambition and reputation."},
  ally:{emoji:"🤝",label:"Italian Ally",color:"#0E7490",bg:"#ECFEFF",desc:"Allied Italian background tied to Rome through loyalty and obligation."},
};
const classKey=cls=>String(cls||"").toLowerCase().replace(/[^a-z]/g,"");
const getClassInfo=cls=>{const k=classKey(cls);return CLASS_INFO[k]||CLASS_INFO[k.includes("patric")?"patrician":k.includes("pleb")?"plebeian":k.includes("equest")?"equestrian":k.includes("novus")?"novus":k.includes("ally")?"ally":"patrician"];};
const ClassBadge=({cls,sm})=>{const ci=getClassInfo(cls);return <span style={{display:"inline-block",background:ci.bg,border:`1px solid ${ci.color}`,color:ci.color,padding:sm?"0.04rem 0.35rem":"0.08rem 0.45rem",fontSize:sm?"0.72rem":"0.82rem",fontFamily:"'Cinzel',serif",letterSpacing:"0.05em",whiteSpace:"nowrap"}}>{ci.emoji} {ci.label}</span>;};

const CLASS_UPGRADES={
  plebeian:{to:"Equestrian",gold:800,food:100,label:"Rise from Plebeian to Equestrian"},
  novus:{to:"Equestrian",gold:700,food:80,label:"Enter the Equestrian Order"},
  ally:{to:"Equestrian",gold:900,food:120,label:"Gain Equestrian standing in Rome"},
  equestrian:{to:"Patrician",gold:1800,food:250,label:"Rise from Equestrian to Patrician"},
};
const nextClassUpgrade=cls=>CLASS_UPGRADES[classKey(cls)]||null;

/* ══ POSITIONS ════════════════════════════════════════════════════════════ */
const POS={
  consul_1:{emoji:"🦅",title:"Consul I",abbr:"COS I",color:"#B91C1C",bg:"#FFF1F1",
    desc:"Supreme magistrate of Rome. Commands the legions, leads the Senate and directs the Republic during war.",
    can:["🛡️ Submit one military order per turn","🏛️ Lead Senate policy and emergency debate","⚔️ Command active legions in the field","📜 Propose major war measures","🚫 Veto lesser magistrates when justified by office"],
    cannot:["👑 Act as king or ignore the Senate forever","⚖️ Declare war without political authority","💰 Spend the treasury without approval","♾️ Hold power permanently"]},
  consul_2:{emoji:"🦅",title:"Consul II",abbr:"COS II",color:"#B91C1C",bg:"#FFF1F1",
    desc:"Co-equal Consul sharing supreme authority with Consul I. Rome divides power to prevent tyranny.",
    can:["🛡️ Submit one military order per turn","⚔️ Command active legions","🏛️ Lead Senate debate with Consul I","🤝 Check or support the other Consul"],
    cannot:["👑 Rule alone","⚖️ Overrule the Senate by personal will","💰 Spend the treasury without approval","♾️ Hold power permanently"]},
  praetor_1:{emoji:"⚖️",title:"Praetor Urbanus",abbr:"PR I",color:"#7C3AED",bg:"#F5F0FF",
    desc:"Chief judicial magistrate of Rome. Oversees law, courts, civic order and administration inside the city.",
    can:["⚖️ Submit one legal or administrative order","🏛️ Govern Rome when Consuls are absent","📜 Propose legal and civic motions","🛡️ Command troops only if assigned"],
    cannot:["🦅 Override Consuls in military command","⚔️ Declare war independently","💰 Spend gold without authority"]},
  praetor_2:{emoji:"🌍",title:"Praetor Peregrinus",abbr:"PR II",color:"#7C3AED",bg:"#F5F0FF",
    desc:"Handles foreign citizens, allied disputes, provincial administration and matters beyond Rome itself.",
    can:["🌍 Submit one foreign or provincial order","🤝 Manage allied and non-citizen disputes","📜 Propose foreign affairs motions","🛡️ Command troops only if assigned"],
    cannot:["🦅 Override senior magistrates","⚔️ Command legions without authorization","💰 Spend provincial funds freely"]},
  quaestor_1:{emoji:"💰",title:"Quaestor I",abbr:"Q I",color:"#B7791F",bg:"#FFF7E6",
    desc:"Financial magistrate of the Republic. Shares responsibility for treasury, payments, supplies and military expenses.",
    can:["💰 Submit one treasury or supply order","📊 View income, stockpiles and costs","🧾 Propose taxes, payments and funding plans","⚔️ Organize legion pay and supply spending"],
    cannot:["⚔️ Command armies","👑 Override elected senior magistrates","💸 Spend unlimited gold without Senate authority"]},
  quaestor_2:{emoji:"💰",title:"Quaestor II",abbr:"Q II",color:"#B7791F",bg:"#FFF7E6",
    desc:"Financial magistrate of the Republic. Shares responsibility for treasury, payments, supplies and military expenses.",
    can:["💰 Submit one treasury or supply order","📊 View income, stockpiles and costs","🧾 Propose taxes, payments and funding plans","⚔️ Organize legion pay and supply spending"],
    cannot:["⚔️ Command armies","👑 Override elected senior magistrates","💸 Spend unlimited gold without Senate authority"]},
  aedile_1:{emoji:"🌾",title:"Aedile Curule",abbr:"AED",color:"#2F7D32",bg:"#F0FFF4",
    desc:"Manager of grain, food supply, public markets, city logistics and public order in Rome.",
    can:["🌾 Submit one food or logistics order","🏪 Regulate markets and grain distribution","👥 Manage city stability and public order","📜 Propose food and infrastructure motions"],
    cannot:["⚔️ Command legions","💰 Spend treasury independently","🌍 Decide foreign policy alone"]},
  tribune_1:{emoji:"🛡️",title:"Tribune I",abbr:"TR I",color:"#2563EB",bg:"#EFF6FF",
    desc:"Sacred protector of the plebs. Possesses veto power and protects citizens from abuse.",
    can:["🚫 Veto Senate motions when defending the plebs","🛡️ Intercede for citizens against abuse","📣 Propose plebeian motions","👥 Mobilize popular pressure"],
    cannot:["⚔️ Command armies in the field","👑 Act as king of the people","💰 Spend the treasury"]},
  tribune_2:{emoji:"🛡️",title:"Tribune II",abbr:"TR II",color:"#2563EB",bg:"#EFF6FF",
    desc:"Co-tribune sharing the sacred duty to protect the plebs and resist abusive power.",
    can:["🚫 Veto Senate motions when defending the plebs","🛡️ Protect plebeian citizens","📣 Propose plebeian motions","👥 Mobilize popular pressure"],
    cannot:["⚔️ Command armies","👑 Rule outside the law","💰 Spend the treasury"]},
  dictator_1:{emoji:"⚡",title:"Dictator",abbr:"DICT",color:"#7F1D1D",bg:"#FFF1F2",
    desc:"Emergency magistrate appointed only in the gravest crisis. Holds extraordinary authority for a limited mandate.",
    can:["⚡ Submit one emergency order","🛡️ Coordinate the full crisis response","⚔️ Direct military priorities during the emergency","⏳ Act quickly when Rome cannot wait"],
    cannot:["♾️ Hold office permanently","👑 Declare himself king","📜 Ignore the limited emergency mandate","🛡️ Abolish the Senate"]},
  magister_equitum_1:{emoji:"🐎",title:"Magister Equitum",abbr:"MAG EQ",color:"#0F766E",bg:"#ECFEFF",
    desc:"Master of Horse. Deputy to an emergency command, focused on cavalry, mobility and rapid military operations.",
    can:["🐎 Submit one cavalry or rapid response order","⚔️ Organize scouts, cavalry and mobile detachments","🛡️ Support the Dictator or Consuls in campaign logistics","📍 React to fast-moving threats"],
    cannot:["👑 Override the supreme magistrate","💰 Spend freely without approval","🏛️ Rule the Senate","♾️ Keep emergency command forever"]},

  praefectus_classis_1:{emoji:"🚢",title:"Praefectus Classis",abbr:"PR CL",color:"#0E7490",bg:"#ECFEFF",
    desc:"Commander and administrator of the Roman fleet. Oversees triremes, naval bases, coastal defence and sea supply.",
    can:["🚢 Submit one naval order per turn","⚓ Manage fleets, triremes and naval bases","🛡️ Protect sea routes and coastal provinces","📦 Support supply movement by sea"],
    cannot:["👑 Override the Consuls or Dictator","⚔️ Command land legions without appointment","💰 Spend the treasury freely","♾️ Hold naval authority permanently"]},
};

// Physical senate seating positions (col 0-8, row 0-6 on 9×7 grid)
const SEATS={consul_1:{c:4,r:0},consul_2:{c:4,r:1},dictator_1:{c:4,r:2},magister_equitum_1:{c:4,r:3},praefectus_classis_1:{c:4,r:4},praetor_1:{c:2,r:2},praetor_2:{c:6,r:2},quaestor_1:{c:1,r:4},quaestor_2:{c:7,r:4},aedile_1:{c:4,r:5},tribune_1:{c:2,r:6},tribune_2:{c:6,r:6}};

/* ══ GAME DATA ════════════════════════════════════════════════════════════ */
const DEF_GAME={session:1,sessionInSeason:1,year:218,season:"Winter",
  gold:1800,food:2800,pop:175000,
  legionUpkeep:125,legionFood:110,cavalryUpkeep:180,cavalryFood:140,fleetUpkeep:2,fleetFood:1,
  lgold:650,lfood:550,lpop:5000,lturns:2,
  cgold:420,cfood:260,cpop:2000,cturns:1,
  fgold:55,ffood:25,fpop:200,fturns:2,
  privateTaxGoldPct:10,privateTaxFoodPct:5,
  foodMarketStock:600,foodMarketPrice:2};

const DEF_LEGIONS=["I","II","III","IV"].map((id)=>
  ({id,name:`Legio ${id}`,str:5000,max:5000,status:"active",prog:0,location:"Roma",commander:"Unassigned"}));

const DEF_CAVALRY=[
  {id:"eq_1",name:"Equites Consulares",str:2000,max:2000,status:"active",location:"Roma",commander:"Unassigned"},
  {id:"eq_2",name:"Socii Equites",str:2000,max:2000,status:"active",location:"Capua",commander:"Unassigned"},
];

const DEF_FLEETS=[
  {id:"classis_romana",name:"Classis Romana",triremes:80,status:"active",location:"Ostia",commander:"Unassigned"},
];

const FORCE_TYPES=[
  {id:"roman_legion",type:"legion",emoji:"🛡️",name:"Roman Legion",men:5000,gold:650,food:550,turns:2,goldUpkeep:125,foodUpkeep:110,note:"Standard Roman citizen legion. Reliable and politically central."},
  {id:"socii_legion",type:"legion",emoji:"🤝",name:"Socii Legion",men:5000,gold:325,food:275,turns:2,goldUpkeep:63,foodUpkeep:55,note:"Same manpower as a Roman legion, but half cost/upkeep. Requires careful Socii relations and political management."},
  {id:"levy_legion",type:"legion",emoji:"🪖",name:"Levy Legion",men:5000,gold:520,food:550,turns:1,goldUpkeep:100,foodUpkeep:110,note:"20% cheaper gold cost/upkeep than a proper legion, same food burden. Lower quality until battle hardened."},
  {id:"socii_equites",type:"cavalry",emoji:"🐎",name:"Socii Equites",men:2000,gold:420,food:260,turns:1,goldUpkeep:180,foodUpkeep:140,note:"Standard allied cavalry unit."},
  {id:"gallic_aux",type:"cavalry",emoji:"🪓",name:"Cisalpine Gallic Auxiliaries",men:1000,gold:104,food:88,turns:1,goldUpkeep:20,foodUpkeep:18,note:"Roughly 16% of a legion cost due to smaller size, with an added discount. Cheap but potentially unreliable."},
  {id:"gallic_alae",type:"cavalry",emoji:"🐴",name:"Cisalpine Gallic Alae",men:500,gold:84,food:52,turns:1,goldUpkeep:36,foodUpkeep:28,note:"Quarter-strength cavalry, 20% cheaper than proportional Socii Equites. Fast, cheap, but reliability is uncertain."},
  {id:"trireme",type:"fleet",emoji:"🚢",name:"Trireme",men:200,gold:55,food:25,turns:2,goldUpkeep:2,foodUpkeep:1,note:"Each trireme requires 200 crew/soldiers and counts toward total manpower."},
];

const DEF_REGIONS=[
  {id:"latium",name:"Latium",capital:"Roma",pop:175000,bG:180,bF:140,s:"roman"},
  {id:"etruria",name:"Etruria",capital:"Arretium",pop:260000,bG:160,bF:110,s:"roman"},
  {id:"umbria",name:"Umbria",capital:"Spoletium",pop:150000,bG:105,bF:90,s:"roman"},
  {id:"picenum",name:"Picenum",capital:"Ancona",pop:120000,bG:90,bF:85,s:"roman"},
  {id:"samnium",name:"Samnium",capital:"Bovianum",pop:210000,bG:115,bF:105,s:"roman"},
  {id:"campania",name:"Campania",capital:"Capua",pop:360000,bG:260,bF:210,s:"roman"},
  {id:"apulia",name:"Apulia",capital:"Luceria",pop:220000,bG:130,bF:190,s:"roman"},
  {id:"lucania",name:"Lucania",capital:"Grumentum",pop:130000,bG:80,bF:115,s:"roman"},
  {id:"bruttium",name:"Bruttium",capital:"Consentia",pop:120000,bG:70,bF:105,s:"roman"},
  {id:"calabria",name:"Calabria",capital:"Tarentum",pop:170000,bG:95,bF:130,s:"roman"},
  {id:"sicilia",name:"Sicilia",capital:"Syracusae",pop:650000,bG:230,bF:310,s:"roman"},
  {id:"sardinia_corsica",name:"Sardinia et Corsica",capital:"Caralis",pop:300000,bG:110,bF:130,s:"roman"},
  {id:"gallia_cisalpina",name:"Gallia Cisalpina",capital:"Placentia",pop:420000,bG:55,bF:90,s:"contested"},
  {id:"illyria",name:"Illyrian Coast",capital:"Scodra",pop:90000,bG:50,bF:60,s:"contested"},
];
const RS={roman:{l:"Roman Control",c:"#40A030",m:1.0},contested:{l:"Contested",c:"#C8922A",m:0.5},
  sacked:{l:"Sacked",c:"#E05050",m:0.1},devastated:{l:"Devastated",c:"#CC6622",m:0.25},enemy:{l:"🐘 Carthaginian Control",c:"#880020",m:0.0}};

const DEF_BUSINESSES=[
  // Small / cheap businesses — designed so 35 senators can participate early
  {id:"market_stall",emoji:"🧺",name:"Market Stall",costGold:55,costFood:5,incomeGold:8,incomeFood:3,regionCaps:{latium:10,etruria:5,umbria:4,picenum:4,samnium:4,campania:9,apulia:5,lucania:3,bruttium:3,calabria:5,sicilia:8,sardinia_corsica:5,gallia_cisalpina:4,illyria:3}},
  {id:"small_workshop",emoji:"🔨",name:"Small Workshop",costGold:75,costFood:8,incomeGold:12,incomeFood:0,regionCaps:{latium:8,etruria:6,umbria:4,picenum:4,samnium:4,campania:7,apulia:4,lucania:3,bruttium:3,calabria:4,sicilia:5,sardinia_corsica:3,gallia_cisalpina:3,illyria:2}},
  {id:"fishing_boat",emoji:"🛶",name:"Fishing Boat",costGold:65,costFood:10,incomeGold:4,incomeFood:15,regionCaps:{picenum:5,campania:4,calabria:7,bruttium:5,sicilia:9,sardinia_corsica:8,illyria:4}},
  {id:"bakery",emoji:"🥖",name:"Bakery",costGold:85,costFood:15,incomeGold:8,incomeFood:10,regionCaps:{latium:7,etruria:4,umbria:3,picenum:3,samnium:3,campania:6,apulia:4,lucania:2,bruttium:2,calabria:4,sicilia:6,sardinia_corsica:3}},
  {id:"goat_herd",emoji:"🐐",name:"Goat Herd",costGold:70,costFood:8,incomeGold:3,incomeFood:16,regionCaps:{samnium:6,lucania:6,bruttium:6,umbria:4,apulia:4,sardinia_corsica:5,gallia_cisalpina:3}},
  {id:"small_vineyard",emoji:"🍇",name:"Small Vineyard",costGold:120,costFood:12,incomeGold:18,incomeFood:5,regionCaps:{latium:4,etruria:6,campania:6,apulia:3,calabria:3,sicilia:4}},

  // Medium businesses — standard senator investments
  {id:"olive_farm",emoji:"🫒",name:"Olive Estate",costGold:260,costFood:35,incomeGold:30,incomeFood:10,regionCaps:{latium:4,etruria:5,campania:5,apulia:4,calabria:4,sicilia:5,sardinia_corsica:3}},
  {id:"grain_estate",emoji:"🌾",name:"Grain Estate",costGold:230,costFood:25,incomeGold:13,incomeFood:45,regionCaps:{latium:4,campania:6,apulia:6,sicilia:8,sardinia_corsica:5,etruria:3,picenum:3}},
  {id:"fishery",emoji:"🐟",name:"Fishery",costGold:190,costFood:22,incomeGold:18,incomeFood:35,regionCaps:{picenum:4,calabria:5,bruttium:4,sicilia:6,sardinia_corsica:6,campania:3,illyria:3}},
  {id:"merchant_house",emoji:"🏺",name:"Merchant House",costGold:370,costFood:45,incomeGold:55,incomeFood:4,regionCaps:{latium:5,campania:5,calabria:3,sicilia:5,sardinia_corsica:3,picenum:2,illyria:2}},
  {id:"mine_contract",emoji:"⛏️",name:"Mining Contract",costGold:460,costFood:55,incomeGold:75,incomeFood:0,regionCaps:{etruria:3,samnium:3,sardinia_corsica:3,gallia_cisalpina:2,illyria:2}},
  {id:"pasture",emoji:"🐑",name:"Pasture Lands",costGold:210,costFood:30,incomeGold:22,incomeFood:32,regionCaps:{samnium:5,lucania:5,bruttium:5,sardinia_corsica:5,umbria:3,apulia:3}},
  {id:"timber_rights",emoji:"🌲",name:"Timber Rights",costGold:190,costFood:20,incomeGold:28,incomeFood:12,regionCaps:{etruria:4,umbria:4,samnium:3,lucania:4,bruttium:5,gallia_cisalpina:3,illyria:3}},

  // Large / elite investments — fewer slots, higher political value
  {id:"great_latifundium",emoji:"🏛️",name:"Great Latifundium",costGold:650,costFood:80,incomeGold:60,incomeFood:95,regionCaps:{campania:2,apulia:2,sicilia:3,latium:1,calabria:1,sardinia_corsica:1}},
  {id:"shipping_company",emoji:"🚢",name:"Major Shipping Company",costGold:520,costFood:55,incomeGold:90,incomeFood:22,regionCaps:{latium:2,campania:2,picenum:1,calabria:2,sicilia:3,sardinia_corsica:2,illyria:1}},
  {id:"banking_house",emoji:"🏦",name:"Banking House",costGold:800,costFood:20,incomeGold:135,incomeFood:0,regionCaps:{latium:2,campania:2,sicilia:1}},
  {id:"port_customs",emoji:"⚓",name:"Port Customs Rights",costGold:720,costFood:30,incomeGold:115,incomeFood:12,regionCaps:{latium:1,campania:1,picenum:1,calabria:1,sicilia:2,sardinia_corsica:1,illyria:1}},
  {id:"supply_contractor",emoji:"📦",name:"State Supply Contractor",costGold:600,costFood:100,incomeGold:75,incomeFood:60,regionCaps:{latium:1,campania:1,apulia:1,sicilia:1,sardinia_corsica:1}},
];
const BALANCED_BUSINESSES=DEF_BUSINESSES.map(b=>({...b,regionCaps:{...(b.regionCaps||{})}}));
const DEF_WEALTH={gold:160,food:80,householdGold:10,householdFood:10,debtGoldSince:null,debtFoodSince:null};
const CLASS_START_WEALTH={
  patrician:{gold:420,food:140,householdGold:10,householdFood:10},
  equestrian:{gold:330,food:100,householdGold:10,householdFood:10},
  plebeian:{gold:160,food:90,householdGold:10,householdFood:10},
  novus:{gold:220,food:80,householdGold:10,householdFood:10},
  ally:{gold:240,food:120,householdGold:10,householdFood:10},
};
const startingWealthForClass=cls=>({ ...DEF_WEALTH, ...(CLASS_START_WEALTH[classKey(cls)]||{}) });
const DEF_REP_RULES={
  starting:{patrician:60,equestrian:52,plebeian:42,novus:45,ally:44},
  boostActions:[
    {id:"temple_offering",emoji:"🏛️",name:"Temple Offering",costGold:40,costFood:0,gain:3,desc:"Public piety and visible offerings to the gods."},
    {id:"grain_charity",emoji:"🌾",name:"Grain Charity",costGold:70,costFood:40,gain:6,desc:"Distribute grain or aid to poorer citizens and clients."},
    {id:"veteran_gift",emoji:"🛡️",name:"Veteran Patronage",costGold:90,costFood:0,gain:8,desc:"Support veterans, wounded soldiers and military families."},
    {id:"public_games",emoji:"🎭",name:"Public Games",costGold:160,costFood:40,gain:12,desc:"Sponsor public spectacle, games and public goodwill."}
  ],
  slanderActions:[
    {id:"minor",emoji:"🗣️",name:"Forum Whisper Campaign",costGold:35,impact:5,desc:"Forum gossip, tavern talk and whispers among clients. Always launches successfully."},
    {id:"medium",emoji:"📜",name:"Organized Slander Campaign",costGold:85,impact:10,desc:"Paid informants, pamphlets, witnesses and coordinated rumours. Always launches successfully."},
    {id:"major",emoji:"🔥",name:"Major Scandal Campaign",costGold:180,impact:18,desc:"A large political attack that can ruin a candidate if believed. Always launches successfully."}
  ],
  counterActions:[
    {id:"minor_counter",emoji:"🛡️",name:"Small Counter-Campaign",costGold:50,remove:5,desc:"Speeches, denials and friendly clients defending your name."},
    {id:"major_counter",emoji:"⚖️",name:"Major Rehabilitation",costGold:130,remove:12,desc:"Public defense, witnesses, charity and pressure on the rumour network."}
  ]
};
const clampRep=n=>Math.max(0,Math.min(100,Math.round(Number(n||0))));
const defaultRepFor=player=>clampRep((DEF_REP_RULES.starting||{})[classKey(player?.charClass)]??45);
const repOf=(rep,player)=>({score:defaultRepFor(player),scandals:[],...((rep||{})[player?.id]||{})});
const repColor=score=>score>=70?T.green:score>=45?T.gold:score>=25?T.rhi:"#4B0000";
const activeScandalsFor=(rep,playerId)=>(((rep||{})[playerId]?.scandals)||[]).filter(s=>s.active!==false);
const addRepLog=async(entry)=>{const all=await db.get("spqr_replog")||[];all.push({id:Date.now().toString()+Math.random().toString(36).slice(2),ts:Date.now(),...entry});await db.set("spqr_replog",all.slice(-500));};

const foodSaleRate=0.5;
const salaryFor=()=>({gold:0,food:0});
const addWealthLog=async(entry)=>{const all=await db.get("spqr_wealthlog")||[];all.push({id:Date.now().toString()+Math.random().toString(36).slice(2),ts:Date.now(),...entry});await db.set("spqr_wealthlog",all.slice(-500));};
const privateTaxRates=game=>({gold:Number(game?.privateTaxGoldPct??10),food:Number(game?.privateTaxFoodPct??5)});
const personalBalanceFor=(userId,role,assets,businesses,wealth,game={})=>{
  const gross=personalIncomeFor(userId,assets,businesses,game);
  const tax=privateTaxRates(game);
  const taxGold=Math.floor(gross.gold*tax.gold/100);
  const taxFood=Math.floor(gross.food*tax.food/100);
  const w=wealthOf(wealth,userId);
  const houseGold=Number(w.householdGold||0);
  const houseFood=Number(w.householdFood||0);
  return {gross,tax,taxGold,taxFood,salary:{gold:0,food:0},houseGold,houseFood,netGold:gross.gold-taxGold-houseGold,netFood:gross.food-taxFood-houseFood};
};
const partyOf=(parties,userId)=>(parties||[]).find(pt=>(pt.members||[]).includes(userId));
const PartyBadge=({party,sm})=>party?<span className="spqr-party-badge" style={{display:"inline-block",background:`${party.color||T.blue}18`,border:`1px solid ${party.color||T.blue}`,color:party.color||T.blue,padding:sm?"0.04rem 0.35rem":"0.08rem 0.45rem",fontSize:sm?"0.72rem":"0.82rem",fontFamily:"'Cinzel',serif",letterSpacing:"0.05em",whiteSpace:"nowrap",maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis"}}>{party.emoji||"🏛️"} {party.name}</span>:null;
const getBiz=(businesses,id)=>(businesses||DEF_BUSINESSES).find(b=>b.id===id)||DEF_BUSINESSES[0];
const getRegion=(regions,id)=>(regions||DEF_REGIONS).find(r=>r.id===id)||{id,name:id,capital:"Unknown"};
const personalIncomeFor=(userId,assets,businesses,game={})=> (assets||[]).filter(a=>a.ownerId===userId).reduce((acc,a)=>{const b=getBiz(businesses,a.typeId);acc.gold+=Number(b.incomeGold||0);acc.food+=effectiveFoodIncome(b.incomeFood,game);return acc;},{gold:0,food:0});
const totalPrivateTaxProjection=(players=[],assets=[],businesses=DEF_BUSINESSES,wealth={},game={})=>(players||[]).filter(Boolean).reduce((acc,p)=>{const b=personalBalanceFor(p.id,p.role,assets,businesses,wealth,game);acc.gold+=Number(b.taxGold||0);acc.food+=Number(b.taxFood||0);return acc;},{gold:0,food:0});
const normalizeAssetsList=(assets=[])=>{
  const seen=new Set();
  return (assets||[]).filter(Boolean).map((a,i)=>{
    let id=a.id||`asset_${Date.now()}_${i}_${Math.random().toString(36).slice(2)}`;
    if(seen.has(id))id=`${id}_${i}_${Math.random().toString(36).slice(2)}`;
    seen.add(id);
    return {...a,id};
  });
};

const ownedSlots=(assets,typeId,regionId)=>(assets||[]).filter(a=>a.typeId===typeId&&a.regionId===regionId).length;
const estateSlotDetails=(assets,typeId,regionId,players=[])=>{
  const owners=(assets||[]).filter(a=>a.typeId===typeId&&a.regionId===regionId).map(a=>{
    const p=(players||[]).find(x=>x.id===a.ownerId);
    return p?.latinName||a.ownerName||"Unknown";
  });
  return owners;
};
const debtSessionExpired=(since,currentSession)=>since&&Number(currentSession||0)>Number(since||0);
const wealthOf=(wealth,userId)=>({ ...DEF_WEALTH, ...((wealth||{})[userId]||{}) });
const addHistory=async(playerId,title,body,type="event")=>{const all=await db.get("spqr_history")||[];all.push({id:Date.now().toString()+Math.random().toString(36).slice(2),playerId,title,body,type,ts:Date.now()});await db.set("spqr_history",all.slice(-500));};

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
const SEASONS=["Spring","Early Summer","Late Summer","Autumn","Winter"];
const seasonIndex=season=>{const i=SEASONS.indexOf(season);return i>=0?i:(isWinterSeason(season)?SEASONS.indexOf("Winter"):0);};
const WINTER_FOOD_MOD=0.75;
const isWinterSeason=season=>String(season||"").toLowerCase().includes("winter");
const seasonFoodModifier=game=>isWinterSeason(game?.season)?WINTER_FOOD_MOD:1;
const seasonInfo=game=>{
  const season=game?.season||"Spring";
  if(isWinterSeason(season))return {emoji:"❄️",label:season,tone:"winter",color:"#2563EB",bg:"#EAF4FF",border:"#93C5FD",note:`Winter production: food output is reduced by ${Math.round((1-WINTER_FOOD_MOD)*100)}% this season.`};
  if(String(season).includes("Spring"))return {emoji:"🌱",label:season,tone:"spring",color:"#2F7D32",bg:"#F0FFF4",border:"#86EFAC",note:"Spring season: farms and markets recover normal food production."};
  if(String(season).includes("Summer"))return {emoji:"☀️",label:season,tone:"summer",color:"#B7791F",bg:"#FFF7E6",border:"#FACC15",note:"Summer season: normal harvest and trade conditions."};
  return {emoji:"🍂",label:season,tone:"autumn",color:"#9A3412",bg:"#FFF1E6",border:"#FDBA74",note:"Autumn season: normal production before winter pressure."};
};
const effectiveFoodIncome=(amount,game)=>Math.floor(Number(amount||0)*seasonFoodModifier(game));
const winterFoodMark=(incomeFood,game)=>isWinterSeason(game?.season)&&Number(incomeFood||0)>0?" ❄️":"";
const displayedFoodIncome=(incomeFood,game)=>effectiveFoodIncome(incomeFood,game);

/* ══ STORAGE & UTILS ══════════════════════════════════════════════════════ */
const db={
  async get(k,sh=true){try{const r=await window.storage.get(k,sh);return r?JSON.parse(r.value):null;}catch{return null;}},
  async set(k,v,sh=true){try{await window.storage.set(k,JSON.stringify(v),sh);return true;}catch{return false;}},
  async gP(k){return this.get(k,false);},
  async sP(k,v){return this.set(k,v,false);},
};
const sLab=g=>`${g.year} BC · ${g.season} · Turn ${g.session||1}`;
const normalizeElections=(multi,legacy)=>{
  const arr=Array.isArray(multi)?multi.filter(Boolean):[];
  if(legacy&&legacy.status!=="closed"&&!arr.some(e=>e.id===legacy.id))arr.push(legacy);
  return arr;
};
const fmt=n=>Number(n||0).toLocaleString();
const calcInc=(regs,game={})=>{let g=0,f=0;regs.forEach(r=>{const m=RS[r.s]?.m||0;g+=Number(r.bG||0)*m;f+=effectiveFoodIncome(Number(r.bF||0)*m,game);});return{gold:Math.floor(g),food:Math.floor(f)};};
const compress=(file,mx=600)=>new Promise(res=>{const c=document.createElement('canvas'),img=new Image(),u=URL.createObjectURL(file);img.onload=()=>{const s=Math.min(mx/img.width,mx/img.height,1);c.width=img.width*s;c.height=img.height*s;c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',0.75));};img.src=u;});
const pushN=async(title,body,forId="all")=>{const all=await db.get("spqr_n")||[];all.push({id:Date.now()+Math.random().toString(36).slice(2),title,body,for:forId,ts:Date.now()});await db.set("spqr_n",all.slice(-200));};

const activeLegions=legs=>(legs||[]).filter(l=>l.status==="active");
const activeFleets=fleets=>(fleets||[]).filter(f=>f.status==="active");
const fleetTriremes=fleets=>activeFleets(fleets).reduce((sum,f)=>sum+Number(f.triremes??f.ships??0),0);
const fleetCrew=fleets=>fleetTriremes(fleets)*200;
const forceTypeById=(types,id)=>(types||FORCE_TYPES).find(t=>t.id===id)||null;
const militaryBreakdown=(game,legions,cavalry,fleets,forceTypes=FORCE_TYPES)=>{
  const g={...DEF_GAME,...game};
  const activeLegs=activeLegions(legions||DEF_LEGIONS);
  const activeCav=activeCavalry(cavalry||DEF_CAVALRY);
  const triremes=fleetTriremes(fleets||DEF_FLEETS);
  const legionGold=activeLegs.reduce((sum,l)=>sum+Number(forceTypeById(forceTypes,l.typeId)?.goldUpkeep ?? g.legionUpkeep ?? 0),0);
  const legionFood=activeLegs.reduce((sum,l)=>sum+Number(forceTypeById(forceTypes,l.typeId)?.foodUpkeep ?? g.legionFood ?? 0),0);
  const cavalryGold=activeCav.reduce((sum,c)=>sum+Number(forceTypeById(forceTypes,c.typeId)?.goldUpkeep ?? g.cavalryUpkeep ?? 0),0);
  const cavalryFood=activeCav.reduce((sum,c)=>sum+Number(forceTypeById(forceTypes,c.typeId)?.foodUpkeep ?? g.cavalryFood ?? 0),0);
  const fleetType=forceTypeById(forceTypes,"trireme");
  const fleetGold=triremes*Number(fleetType?.goldUpkeep ?? g.fleetUpkeep ?? 0);
  const fleetFood=triremes*Number(fleetType?.foodUpkeep ?? g.fleetFood ?? 0);
  return {activeLegions:activeLegs.length,activeCavalry:activeCav.length,triremes,crew:triremes*200,legionGold,legionFood,cavalryGold,cavalryFood,fleetGold,fleetFood,totalGold:legionGold+cavalryGold+fleetGold,totalFood:legionFood+cavalryFood+fleetFood};
};
const activeCavalry=cavalry=>(cavalry||[]).filter(c=>c.status==="active");
const economySnapshot=(game,regions,legions,cavalry=DEF_CAVALRY,fleets=DEF_FLEETS)=>{
  const g={...DEF_GAME,...game};
  const inc=calcInc(regions||DEF_REGIONS,g);
  const act=activeLegions(legions||DEF_LEGIONS);
  const cav=activeCavalry(cavalry||DEF_CAVALRY);
  const triremes=fleetTriremes(fleets||DEF_FLEETS);
  const legionGoldUpkeep=act.length*(g.legionUpkeep||0);
  const legionFoodUpkeep=act.length*(g.legionFood||0);
  const cavalryGoldUpkeep=cav.length*(g.cavalryUpkeep||0);
  const cavalryFoodUpkeep=cav.length*(g.cavalryFood||0);
  const fleetGoldUpkeep=triremes*(g.fleetUpkeep||0);
  const fleetFoodUpkeep=triremes*(g.fleetFood||0);
  const upkeepG=legionGoldUpkeep+cavalryGoldUpkeep+fleetGoldUpkeep;
  const upkeepF=legionFoodUpkeep+cavalryFoodUpkeep+fleetFoodUpkeep;
  return {label:sLab(g),gold:g.gold||0,food:g.food||0,goldIncome:inc.gold,foodIncome:inc.food,legionGoldUpkeep,legionFoodUpkeep,cavalryGoldUpkeep,cavalryFoodUpkeep,fleetGoldUpkeep,fleetFoodUpkeep,goldUpkeep:upkeepG,foodUpkeep:upkeepF,netGold:inc.gold-upkeepG,netFood:inc.food-upkeepF,activeLegions:act.length,activeCavalry:cav.length,activeTriremes:triremes,ts:Date.now()};
};
const roleEntries=()=>Object.entries(POS).map(([key,pos])=>({key,...pos}));
const getPlayerName=(players,id)=>players.find(p=>p.id===id)?.latinName||"Unknown Senator";


/* ══ SHARED UI ════════════════════════════════════════════════════════════ */
const Lbl=({c})=><div style={{color:T.mut,fontSize:"0.9rem",letterSpacing:"0.14em",fontFamily:"'Cinzel',serif",marginBottom:"0.22rem",textTransform:"uppercase"}}>{c}</div>;
function Inp({label,value,onChange,type="text",placeholder="",rows,disabled}){
  const s={width:"100%",background:T.card,border:`1px solid ${T.border}`,color:T.text,padding:"0.42rem 0.6rem",fontFamily:"'EB Garamond',serif",fontSize:"1.05rem",opacity:disabled?0.6:1};
  return(<div style={{marginBottom:"0.8rem"}}>{label&&<Lbl c={label}/>}{rows?<textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{...s,resize:"vertical"}} disabled={disabled}/>:<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s} disabled={disabled}/>}</div>);
}
function Btn({children,onClick,v="gold",sm,full,disabled}){
  const vc={gold:{bg:T.gold,c:T.bg},red:{bg:T.red,c:"#ffcccc"},ghost:{bg:"transparent",c:T.mut},dark:{bg:T.card,c:T.text},green:{bg:T.green,c:"#fff"},blue:{bg:T.blue,c:"#fff"},crimson:{bg:"#6B1010",c:"#FFB0B0"}};
  const {bg,c}=vc[v]||vc.gold;
  return(<button onClick={onClick} disabled={disabled} style={{padding:sm?"0.26rem 0.55rem":"0.48rem 1rem",background:bg,color:c,border:`1px solid ${T.border}`,fontFamily:"'Cinzel',serif",fontSize:sm?"0.65rem":"0.74rem",letterSpacing:"0.08em",cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.45:1,width:full?"100%":"auto",fontWeight:600,whiteSpace:"nowrap"}}>{children}</button>);
}
const Card=({children,style={}})=><div className="spqr-card" style={{background:T.card,border:`1px solid ${T.border}`,padding:"0.9rem",marginBottom:"0.6rem",...style}}>{children}</div>;
const Badge=({c,color=T.gold,sm})=><span style={{display:"inline-block",background:`${color}22`,border:`1px solid ${color}`,color,padding:sm?"0.05rem 0.35rem":"0.08rem 0.45rem",fontSize:sm?"0.72rem":"0.82rem",fontFamily:"'Cinzel',serif",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{c}</span>;
const STit=({c,sub})=><div style={{marginBottom:"0.6rem"}}><div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"0.9rem",letterSpacing:"0.22em",borderBottom:`1px solid ${T.border}`,paddingBottom:"0.3rem",textTransform:"uppercase"}}>{c}</div>{sub&&<div style={{color:T.mut,fontSize:"0.9rem",marginTop:"0.25rem",fontStyle:"italic"}}>{sub}</div>}</div>;
const Row=({children,gap="0.4rem",wrap})=><div style={{display:"flex",gap,alignItems:"center",flexWrap:wrap?"wrap":"nowrap"}}>{children}</div>;
const Stat=({label,value,color=T.ghi})=><div style={{textAlign:"center",padding:"0.45rem 0.6rem",background:T.card,border:`1px solid ${T.border}`}}><div style={{fontSize:"1.55rem",fontFamily:"'Cinzel',serif",fontWeight:700,color}}>{value}</div><div style={{fontSize:"0.72rem",color:T.mut,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:"0.08rem"}}>{label}</div></div>;
const SeasonBanner=({game})=>{
  const info=seasonInfo(game||DEF_GAME);
  return <div style={{background:info.bg,border:`2px solid ${info.border}`,borderLeft:`8px solid ${info.color}`,padding:"0.75rem 0.9rem",marginBottom:"0.85rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem",flexWrap:"wrap"}}>
    <div><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:info.color,letterSpacing:"0.08em",fontSize:"1rem"}}>{info.emoji} {info.label} · Turn {(game||DEF_GAME).session||1}</div><div style={{color:T.mut,fontSize:"0.95rem"}}>{info.note}</div></div>
    {isWinterSeason(game?.season)&&<Badge c="❄️ FOOD PRODUCTION REDUCED" color={info.color}/>}
  </div>;
};
const SeasonPill=({game})=>{
  const g=game||DEF_GAME;
  const info=seasonInfo(g);
  return <span className="spqr-season-pill" title={info.note} style={{display:"inline-flex",alignItems:"center",gap:"0.35rem",background:info.bg,border:`1px solid ${info.border}`,color:info.color,padding:"0.22rem 0.5rem",fontFamily:"'Cinzel',serif",fontSize:"0.72rem",fontWeight:900,letterSpacing:"0.08em",whiteSpace:"nowrap"}}>
    <span>{info.emoji}</span><span>{info.label}</span><span>· Turn {g.session||1}</span>{isWinterSeason(g.season)&&<span>❄️ -25% Food</span>}
  </span>;
};
function Modal({title,children,onClose,wide}){return(<div className="spqr-modal" style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}><div className="spqr-modal-box" style={{background:T.surf,border:`1px solid ${T.bhi}`,padding:"1.5rem",width:"100%",maxWidth:wide?"760px":"520px",maxHeight:"90vh",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"1rem",alignItems:"center",gap:"1rem"}}><div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"1rem",letterSpacing:"0.18em"}}>{title}</div><button onClick={onClose} style={{background:"none",border:"none",color:T.mut,fontSize:"1.55rem"}}>✕</button></div>{children}</div></div>);}

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
              <div key={n.id} onClick={async()=>{const next=Array.from(new Set([...readIds,n.id]));await db.sP(`nr_${userId}`,next);setReadIds(next);setOpen(false);const txt=`${n.title||""} ${n.type||""}`.toLowerCase();let tab=txt.includes("election")?"elections":txt.includes("motion")||txt.includes("vote")?"voting":txt.includes("order")?"orders":txt.includes("market")||txt.includes("donation")||txt.includes("wealth")?"wealth":txt.includes("law")?"laws":txt.includes("death")||txt.includes("cemetery")?"cemetery":null;if(tab)window.dispatchEvent(new CustomEvent("spqr-nav",{detail:{tab}}));}} style={{padding:"0.5rem 0.75rem",borderBottom:`1px solid ${T.border}`,background:readIds.includes(n.id)?T.card:T.surf,cursor:"pointer"}}>
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
  const [history,setHistory]=useState([]);
  const [assets,setAssets]=useState([]);
  const [businesses,setBusinesses]=useState(DEF_BUSINESSES);
  const [wealth,setWealth]=useState({});
  const [parties,setParties]=useState([]);
  const [reputation,setReputation]=useState({});
  useEffect(()=>{(async()=>{
    setHistory(((await db.get("spqr_history"))||[]).filter(h=>h.playerId===player.id).sort((a,b)=>(b.ts||0)-(a.ts||0)).slice(0,12));
    setAssets(((await db.get("spqr_assets"))||[]).filter(a=>a.ownerId===player.id));
    setBusinesses((await db.get("spqr_biz"))||DEF_BUSINESSES);
    setWealth((await db.get("spqr_wealth"))||{});
    setParties((await db.get("spqr_parties"))||[]);
    setReputation((await db.get("spqr_reputation"))||{});
  })();},[player?.id]);
  if(!player)return null;
  const pos=player.role?POS[player.role]:null;
  const w=wealthOf(wealth,player.id);
  const inc=personalIncomeFor(player.id,assets,businesses);
  const party=partyOf(parties,player.id);
  const rep=repOf(reputation,player);
  const scandals=activeScandalsFor(reputation,player.id);
  return(
    <Modal title="SENATOR PROFILE" onClose={onClose} wide>
      <div style={{display:"flex",gap:"1rem",alignItems:"flex-start",flexWrap:"wrap"}}>
        {player.avatar?
          <img src={player.avatar} style={{width:160,height:160,objectFit:"cover",border:`3px solid ${pos?pos.color:T.bhi}`}} alt="Senator avatar"/>:
          <div style={{width:160,height:160,background:T.fnt,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",fontSize:"2rem",color:T.mut,border:`3px solid ${T.border}`}}>{player.latinName?.[0]||"?"}</div>}
        <div style={{flex:1,minWidth:220}}>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.35rem",fontWeight:800,color:T.ghi,marginBottom:"0.35rem"}}>{player.latinName}</div>
          <div style={{marginBottom:"0.45rem"}}><ClassBadge cls={player.charClass||"Senator"}/></div>
          {pos&&<div style={{marginBottom:"0.5rem"}}><Badge c={pos.title} color={pos.color}/></div>}
          {party&&<div style={{marginBottom:"0.5rem"}}><PartyBadge party={party}/></div>}
          <div style={{marginBottom:"0.5rem"}}><Badge c={`Reputation ${rep.score}/100`} color={repColor(rep.score)}/></div>
          {player.username&&<div style={{color:T.mut,marginBottom:"0.2rem"}}>Username: {player.username}</div>}
          {player.discord&&<div style={{color:"#7289DA",marginBottom:"0.2rem"}}>Discord: {player.discord}</div>}
          {player.joined&&<div style={{color:T.fnt}}>Enrolled: {new Date(player.joined).toLocaleDateString()}</div>}
          <div style={{marginTop:"0.7rem",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"0.45rem"}}>
            <Stat label="Personal Gold" value="Private" color={RES.gold.color}/>
            <Stat label="Personal Food" value="Private" color={RES.food.color}/>
            <Stat label="Estate Income" value="Private" color={T.gre}/>
            
            <Stat label="Household Upkeep" value="Private" color={T.rhi}/>
          </div>
          {pos&&<div style={{marginTop:"0.75rem",padding:"0.75rem",background:T.bg,border:`1px solid ${pos.color}55`,color:T.mut,lineHeight:1.55}}>{pos.desc}</div>}
        </div>
      </div>
      {scandals.length>0&&<Card style={{marginTop:"1rem",borderLeft:`5px solid ${T.rhi}`}}><STit c="Public Scandals"/>{scandals.map(sc=><div key={sc.id} style={{padding:"0.45rem",background:"#FFF1F1",border:`1px solid ${T.rhi}`,marginBottom:"0.4rem"}}>⚠️ {sc.text}<div style={{fontSize:"0.75rem",color:T.mut}}>Severity {sc.severity} · Source: {sc.sourceName||"Unknown / Anonymous"}</div></div>)}</Card>}
      {player.bio&&<Card style={{marginTop:"1rem"}}><STit c="Biography / Background"/><div style={{whiteSpace:"pre-wrap",lineHeight:1.65}}>{player.bio}</div></Card>}
      <Card style={{marginTop:"1rem"}}><STit c="Personal Estates"/>{assets.length===0?<div style={{color:T.mut,fontStyle:"italic"}}>No known estates or businesses.</div>:assets.map(a=>{const b=getBiz(businesses,a.typeId);return <div key={a.id} style={{display:"flex",justifyContent:"space-between",gap:".5rem",borderBottom:`1px solid ${T.border}`,padding:".35rem 0",flexWrap:"wrap"}}><b>{b.emoji} {b.name}</b><span style={{color:T.mut}}>{a.regionName||a.regionId} · income private</span></div>})}</Card>
      <Card><STit c="Personal History" sub="Offices held, donations, estate purchases and notable actions."/>{history.length===0?<div style={{color:T.mut,fontStyle:"italic"}}>No recorded history yet.</div>:history.map(h=><div key={h.id} style={{borderLeft:`3px solid ${T.gold}`,padding:"0.4rem 0.6rem",marginBottom:"0.45rem",background:T.bg}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:800,color:T.ghi}}>{h.title}</div><div style={{color:T.text,whiteSpace:"pre-wrap"}}>{h.body}</div><div style={{fontSize:"0.75rem",color:T.fnt}}>{new Date(h.ts).toLocaleString()}</div></div>)}</Card>
    </Modal>
  );
}

/* ══ SENATE SEATING MAP ═══════════════════════════════════════════════════ */
function SenateMap({players,onSelectPlayer,parties=[],activeMotion,onMotionClick}){
  const [hov,setHov]=useState(null);
  const [hovPos,setHovPos]=useState({x:0,y:0});
  const W=940,H=540,SZ=54;
  const cx=W/2;
  const roleToPlayer={};
  players.forEach(p=>{if(p.role)roleToPlayer[p.role]=p;});

  // Consuls sit in front of the Senate, separated on the magistrate dais.
  // Other magistrates sit on the lower/front benches; normal senators form the half-moon.
  // Only occupied regular seats are drawn; vacant magistrate seats remain visible.
  const roleSeats={
    consul_1:{x:cx-115,y:H-78,label:"Consul I"},
    consul_2:{x:cx+115,y:H-78,label:"Consul II"},
    dictator_1:{x:cx,y:H-78,label:"Dictator"},
    magister_equitum_1:{x:cx-245,y:H-130,label:"Mag. Equitum"},
    praefectus_classis_1:{x:cx+245,y:H-130,label:"Fleet"},
    aedile_1:{x:cx,y:H-142,label:"Aedile"},
    tribune_1:{x:cx-130,y:H-188,label:"Tribune I"},
    tribune_2:{x:cx+130,y:H-188,label:"Tribune II"},
    praetor_1:{x:cx-315,y:H-200,label:"Praetor I"},
    praetor_2:{x:cx+315,y:H-200,label:"Praetor II"},
    quaestor_1:{x:cx-220,y:H-250,label:"Quaestor I"},
    quaestor_2:{x:cx+220,y:H-250,label:"Quaestor II"},
  };

  const magistrateIds=new Set(Object.keys(roleSeats));
  const regulars=players.filter(p=>!p.role);

  const arcSeats=[];
  const arcCenterY=H-100;
  const rows=[
    {radius:390,count:20,start:205,end:335},
    {radius:325,count:18,start:209,end:331},
    {radius:262,count:14,start:215,end:325},
    {radius:200,count:10,start:225,end:315},
  ];
  let remaining=regulars.length;
  rows.forEach((row,rowIdx)=>{
    if(remaining<=0)return;
    const count=Math.min(row.count,remaining);
    for(let i=0;i<count;i++){
      const t=count===1?0.5:i/(count-1);
      const deg=row.start+(row.end-row.start)*t;
      const rad=deg*Math.PI/180;
      arcSeats.push({
        key:`arc_${rowIdx}_${i}`,
        x:cx+row.radius*Math.cos(rad),
        y:arcCenterY+row.radius*Math.sin(rad),
        row:rowIdx
      });
    }
    remaining-=count;
  });

  function seatStyle({x,y,bc,bg,pl}){
    return {position:"absolute",left:x-SZ/2,top:y-SZ/2,width:SZ,height:SZ,background:bg,border:`2px solid ${bc}`,boxSizing:"border-box",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"3px",overflow:"hidden",cursor:pl?"pointer":"default",boxShadow:pl?`0 2px 10px rgba(0,0,0,0.16)`:"none",borderRadius:"50%"};
  }
  function Seat({pl,posInfo,x,y,regular=false}){
    const seatParty=pl?partyOf(parties,pl.id):null;
    const color=seatParty?(seatParty.color||T.blue):(posInfo?posInfo.color:T.border);
    const bg=seatParty?`${color}22`:(posInfo?(pl?`${posInfo.color}22`:T.surf):(pl?`${T.text}08`:T.bg));
    const bc=seatParty?color:(posInfo?(pl?posInfo.color:posInfo.color+"66"):(pl?T.border:T.fnt));
    return <div
      onMouseEnter={e=>{const rect=e.currentTarget.getBoundingClientRect();setHovPos({x:rect.left+rect.width/2,y:rect.top});setHov({posInfo,player:pl,isRegular:regular,party:seatParty});}}
      onMouseLeave={()=>setHov(null)}
      onClick={()=>{setHov(null);if(pl&&onSelectPlayer)onSelectPlayer(pl);}}
      style={seatStyle({x,y,bc,bg,pl})}>
      {posInfo&&<div style={{fontFamily:"'Cinzel',serif",fontSize:"0.52rem",color:pl?posInfo.color:posInfo.color+"99",letterSpacing:"0.05em",lineHeight:1.1,marginBottom:2,textAlign:"center"}}>{posInfo.abbr}</div>}
      {pl?.avatar?<img src={pl.avatar} style={{width:regular?30:32,height:regular?30:32,objectFit:"cover",borderRadius:"50%",border:`2px solid ${color}`}} alt=""/>:
        pl?<div style={{width:regular?30:32,height:regular?30:32,background:`${color}22`,border:`1px solid ${color}`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.6rem",color,fontFamily:"'Cinzel',serif",fontWeight:800}}>{pl.latinName?.[0]||"?"}</div>:
        <div style={{fontSize:"0.62rem",color:posInfo?posInfo.color+"66":T.fnt,fontFamily:"'Cinzel',serif",textAlign:"center",lineHeight:1}}>{posInfo?"vacant":""}</div>}
      {pl&&<div style={{fontSize:"0.43rem",color:seatParty?color:T.mut,textAlign:"center",marginTop:1,lineHeight:1,fontFamily:"'Cinzel',serif",overflow:"hidden",maxWidth:"100%"}}>{pl.latinName?.split(" ").slice(-1)[0]}</div>}
      {seatParty&&<div title={seatParty.name} style={{position:"absolute",left:3,right:3,bottom:3,height:5,background:color,borderRadius:3}}/>}
    </div>;
  }

  return(
    <div className="spqr-senate-scroll" style={{position:"relative",userSelect:"none",overflowX:"auto",paddingBottom:"0.5rem"}}>
      <div style={{position:"relative",width:W,height:H,margin:"0 auto",minWidth:W,background:`radial-gradient(ellipse at 50% 86%, ${T.surf} 0%, ${T.bg} 46%, ${T.card} 100%)`,border:`2px solid ${T.bhi}`,borderRadius:"18px 18px 90px 90px",overflow:"hidden"}}>
        {/* Half-moon bench guides */}
        {rows.map((row,i)=>{const r=row.radius;return <div key={r} style={{position:"absolute",left:cx-r,top:arcCenterY-r,width:r*2,height:r*2,border:`1px solid ${i===0?T.bhi:T.border}`,borderBottom:"none",borderRadius:"50%",opacity:i===0?0.5:0.28,pointerEvents:"none"}}/>})}
        <div style={{position:"absolute",left:cx-135,top:H-174,width:270,height:112,border:`1px solid ${T.bhi}`,background:"rgba(255,255,255,0.45)",borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",fontFamily:"'Cinzel',serif",letterSpacing:"0.14em",color:T.ghi,fontSize:"0.72rem",lineHeight:1.4}}>Senate Floor<br/>Magistrate Dais</div>
        {activeMotion&&(()=>{const proposer=players.find(p=>p.id===activeMotion.byId);return <button onClick={()=>onMotionClick&&onMotionClick(activeMotion)} style={{position:"absolute",left:cx-68,top:H-292,width:136,minHeight:52,border:`1px solid ${T.gold}`,background:"#fff8ec",boxShadow:"0 3px 12px rgba(0,0,0,0.14)",fontFamily:"'Cinzel',serif",color:T.ghi,cursor:"pointer",padding:"0.28rem",zIndex:3,borderRadius:8}}>
          <div style={{fontSize:"0.42rem",letterSpacing:"0.1em",color:T.rhi,fontWeight:900,lineHeight:1.1}}>MOTION OPEN</div>
          <div style={{fontSize:"0.58rem",fontWeight:900,marginTop:"0.12rem",lineHeight:1.12,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{activeMotion.title}</div>
          <div style={{fontSize:"0.48rem",color:T.mut,marginTop:"0.1rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>By {proposer?.latinName||activeMotion.byName}</div>
        </button>})()}

        {/* Role seats */}
        {Object.entries(roleSeats).map(([role,pt])=>{
          const posInfo=POS[role];
          const holder=roleToPlayer[role]||null;
          return <Seat key={role} pl={holder} posInfo={posInfo} x={pt.x} y={pt.y}/>;
        })}

        {/* Regular half-moon senators */}
        {arcSeats.map((pt,idx)=>{
          const pl=regulars[idx];
          return pl?<Seat key={pt.key} pl={pl} regular x={pt.x} y={pt.y}/>:null;
        })}
      </div>
      {hov&&(hov.posInfo||hov.player)&&(
        <div style={{position:"fixed",left:hovPos.x,top:hovPos.y-8,transform:"translate(-50%,-100%)",zIndex:3000,pointerEvents:"none",background:T.card,border:`1px solid ${T.bhi}`,padding:"0.6rem 0.8rem",minWidth:210,maxWidth:270,boxShadow:"0 4px 24px rgba(0,0,0,0.25)"}}>
          {hov.posInfo&&<div style={{fontFamily:"'Cinzel',serif",color:hov.posInfo.color,fontSize:"0.75rem",fontWeight:800,marginBottom:"0.25rem"}}>{hov.posInfo.title}</div>}
          {hov.party&&<div style={{fontFamily:"'Cinzel',serif",color:hov.party.color||T.blue,fontSize:"0.72rem",marginBottom:"0.25rem"}}>{hov.party.emoji||"🏛️"} {hov.party.name}</div>}
          {hov.player&&(<>
            {hov.player.avatar&&<img src={hov.player.avatar} style={{width:48,height:48,objectFit:"cover",border:`1px solid ${T.bhi}`,marginBottom:"0.4rem",display:"block"}} alt=""/>}
            <div style={{fontFamily:"'Cinzel',serif",color:T.text,fontSize:"0.82rem",fontWeight:700}}>{hov.player.latinName}</div>
            <div style={{color:T.mut,fontSize:"0.75rem",marginTop:"0.15rem"}}>{hov.player.charClass}</div>
            {hov.player.discord&&<div style={{color:"#7289DA",fontSize:"0.8rem",marginTop:"0.15rem"}}>Discord: {hov.player.discord}</div>}
            {!hov.posInfo&&<div style={{color:T.fnt,fontSize:"0.7rem",marginTop:"0.15rem",fontStyle:"italic"}}>Senator</div>}
          </>)}
          {hov.posInfo&&!hov.player&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.9rem"}}>— Vacant —</div>}
        </div>
      )}
      <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginTop:"0.75rem",justifyContent:"center"}}>
        {Object.entries(POS).map(([k,p])=><span key={k} style={{display:"flex",alignItems:"center",gap:"0.2rem",fontSize:"0.65rem",color:p.color}}><span style={{width:8,height:8,background:`${p.color}44`,border:`1px solid ${p.color}`,display:"inline-block"}}/>{p.abbr}</span>)}
      </div>
    </div>
  );
}

/* ══ PLAYER PANELS ════════════════════════════════════════════════════════ */

function SenatePanel({players,D,onGoVote}){
  const parties=D.parties||[];
  const cfg=D.cfg||{};
  const [selected,setSelected]=useState(null);
  return(
    <div>
      {cfg.senateImage&&<div style={{marginBottom:"1rem",border:`1px solid ${T.bhi}`,overflow:"auto",maxHeight:"75vh",background:T.bg,borderRadius:8}}><img src={cfg.senateImage} style={{width:"100%",maxHeight:"75vh",objectFit:"contain",display:"block"}} alt="The Senate of Rome"/></div>}
      {!cfg.senateImage&&<div style={{marginBottom:"1rem",padding:"1.5rem",background:T.surf,border:`1px solid ${T.border}`,textAlign:"center",color:T.mut,fontStyle:"italic",fontSize:"1rem"}}>The Game Master has not yet posted a senate image.</div>}
      <Card>
        <STit c="Senate Seating" sub="Click a senator to open his profile. Only occupied senator seats are shown; vacant magistracies remain visible."/>
        <SenateMap players={players} parties={parties} onSelectPlayer={setSelected} activeMotion={(D.motions||[]).filter(m=>m.status==="voting").sort((a,b)=>String(a.created||a.id).localeCompare(String(b.created||b.id)))[0]} onMotionClick={()=>onGoVote&&onGoVote()}/>
        {(parties||[]).length>0&&<div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginTop:"0.55rem"}}>{(parties||[]).map(pt=><PartyBadge key={pt.id} party={pt} sm/>)}</div>}
      </Card>
      <Card>
        <STit c={`Enrolled Senators (${players.length})`}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"0.6rem"}}>
          {players.map(p=>{
            const pos=p.role?POS[p.role]:null;
            const ci=getClassInfo(p.charClass);
            return(
              <div key={p.id} onClick={()=>setSelected(p)} style={{display:"flex",gap:"0.75rem",alignItems:"center",padding:"0.65rem",background:ci.bg,border:`2px solid ${pos?pos.color:ci.color}`,borderLeft:`7px solid ${ci.color}`,cursor:"pointer"}}>
                {p.avatar?<img src={p.avatar} style={{width:54,height:54,objectFit:"cover",borderRadius:"50%",border:`2px solid ${pos?pos.color:ci.color}`,flexShrink:0}} alt=""/>:<div style={{width:54,height:54,background:`${ci.color}22`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.35rem",color:ci.color,fontFamily:"'Cinzel',serif",flexShrink:0}}>{ci.emoji}</div>}
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:"'Cinzel',serif",color:T.text,fontSize:"1.05rem",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.latinName}</div>
                  <div style={{display:"flex",gap:"0.35rem",alignItems:"center",flexWrap:"wrap",marginTop:"0.15rem"}}><ClassBadge cls={p.charClass} sm/>{p.discord&&<span style={{color:"#7289DA",fontSize:"0.85rem"}}>{p.discord}</span>}</div>
                  {pos&&<div style={{marginTop:"0.2rem"}}><Badge c={pos.title} color={pos.color} sm/></div>}
                  {partyOf(parties,p.id)&&<div style={{marginTop:"0.2rem"}}><PartyBadge party={partyOf(parties,p.id)} sm/></div>}
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
  const autoResolveMotionIfMajority=(motion,allPlayers)=>{
    const voterCount=(allPlayers||[]).length||0;
    const majority=Math.floor(voterCount/2)+1;
    const ayeCount=Object.values(motion.votes||{}).filter(v=>v==="yea").length;
    const nayCount=Object.values(motion.votes||{}).filter(v=>v==="nay").length;
    if(voterCount>0&&ayeCount>=majority){
      return {...motion,status:"passed",autoResolved:true,resolvedAt:new Date().toISOString(),resolvedBy:"automatic_majority",resultNote:`Automatically passed by majority: AYE ${ayeCount} / ${voterCount}.`};
    }
    if(voterCount>0&&nayCount>=majority){
      return {...motion,status:"failed",autoResolved:true,resolvedAt:new Date().toISOString(),resolvedBy:"automatic_majority",resultNote:`Automatically failed by majority: NAY ${nayCount} / ${voterCount}.`};
    }
    return motion;
  };
  const vote=async(motionId,choice)=>{
    const all=await db.get("spqr_m")||[];
    const m=all.find(x=>x.id===motionId);
    if(!m||m.status!=="voting")return;
    m.votes={...(m.votes||{})};
    if(choice==="withdraw"){delete m.votes[user.id];}
    else{m.votes[user.id]=choice;}
    const resolved=autoResolveMotionIfMajority(m,players);
    await db.set("spqr_m",all.map(x=>x.id===motionId?resolved:x));
    await pushN("Vote Updated",`${user.latinName} ${choice==="withdraw"?"withdrew his vote":`voted ${choice.toUpperCase()}`} on "${m.title}"`);
    if(resolved.status!=="voting"){
      await pushN("Motion Automatically Resolved",`"${resolved.title}" has been ${resolved.status.toUpperCase()} by Senate majority.`);
    }
    onRefresh();
  };
  const vetoMotion=async(motion)=>{
    if(!user.role||!["tribune_1","tribune_2"].includes(user.role)){setErr("Only Tribunes may veto motions.");return;}
    const g=await db.get("spqr_g")||DEF_GAME;const sess=sLab(g);const key=`${user.id}_${sess}`;
    const used=await db.get("spqr_vetoes")||{};
    if(used[key]){setErr("You have already used your veto this season.");return;}
    if(!confirm(`Veto and cancel motion: ${motion.title}?`))return;
    const all=await db.get("spqr_m")||[];
    await db.set("spqr_m",all.map(x=>x.id===motion.id?{...x,status:"vetoed",vetoedBy:user.id,vetoedByName:user.latinName,vetoedAt:new Date().toISOString()}:x));
    await db.set("spqr_vetoes",{...used,[key]:motion.id});
    await pushN("Tribunician Veto",`${user.latinName} has vetoed the motion: "${motion.title}".`);
    onRefresh();
  };
  const scol={pending:T.mut,voting:T.gold,passed:T.gre,failed:T.rhi,rejected:"#555",vetoed:T.rhi};
  const openAll=[...motions].filter(m=>m.status==="voting").sort((a,b)=>String(a.created||a.id).localeCompare(String(b.created||b.id)));
  const voting=openAll.slice(0,1);
  const queuedVoting=openAll.slice(1);
  const other=motions.filter(m=>m.status!=="voting").concat(queuedVoting.map(m=>({...m,status:"queued"})));
  return(
    <div>
      <Card>
        <STit c="Propose a Motion" sub={`Limit: one motion per senator per turn. Current turn: ${currSessionLabel}`}/>
        {motionLocked&&<div style={{padding:"0.65rem 0.8rem",background:"#1a1000",border:`1px solid ${T.gold}`,color:T.gold,fontFamily:"'Cinzel',serif",fontSize:"0.82rem",marginBottom:"0.75rem",lineHeight:1.5}}>
          ⚖ Motion already submitted this turn: <span style={{color:T.text}}>{myMotionThisTurn.title}</span>. You may propose another motion after the GM advances to the next turn.
        </div>}
        <Inp label="Motion Title" value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. Raise Legio VII immediately" disabled={motionLocked}/>
        <Inp label="Motion Text — be specific and persuasive" value={form.body} onChange={v=>setForm(f=>({...f,body:v}))} rows={3} disabled={motionLocked}/>
        {err&&<div style={{color:T.rhi,fontSize:"1.05rem",marginBottom:"0.5rem"}}>{err}</div>}
        {ok&&<div style={{color:T.gre,fontSize:"1.05rem",marginBottom:"0.5rem"}}>{ok}</div>}
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
                <div style={{display:"flex",gap:"0.35rem",alignItems:"center",flexWrap:"wrap"}}><Badge c="OPEN TO VOTE" color={T.gold}/>{["tribune_1","tribune_2"].includes(user.role)&&<Btn v="crimson" sm onClick={()=>vetoMotion(m)}>Tribune Veto</Btn>}</div>
              </div>
              <div style={{color:T.mut,fontSize:"0.9rem",fontFamily:"'Cinzel',serif",marginBottom:"0.4rem"}}>Proposed by {m.byName} · {m.session||""}</div>
              <div style={{fontSize:"0.88rem",lineHeight:1.5,color:T.text,marginBottom:"0.65rem"}}>{m.body}</div>
              <Row gap="0.5rem" wrap>
                <Btn v="green" sm disabled={myVote==="yea"} onClick={()=>vote(m.id,"yea")}>✓ AYE</Btn>
                <Btn v="crimson" sm disabled={myVote==="nay"} onClick={()=>vote(m.id,"nay")}>✗ NAY</Btn>
                {myVote&&<Btn v="ghost" sm onClick={()=>vote(m.id,"withdraw")}>Withdraw Vote</Btn>}
                {myVote&&<span style={{color:myVote==="yea"?T.gre:T.rhi,fontFamily:"'Cinzel',serif",fontSize:"0.8rem"}}>Current: {myVote.toUpperCase()}</span>}
              </Row>
              <div style={{marginTop:"0.5rem"}}>
                <button onClick={()=>setSelMotion(isSel?null:m.id)} style={{background:"none",border:"none",color:T.mut,fontSize:"0.9rem",cursor:"pointer",fontFamily:"'Cinzel',serif"}}>
                  {isSel?"▲ Hide tally":"▼ Show tally"} — AYE {yeas} · NAY {nays}
                </button>
                {isSel&&<VotingGrid motion={m} players={players}/>}
              </div>
            </Card>
          );
        })}
      </div>}
      {/* All other motions */}
      <Card>
        <STit c="All Motions" sub="Table view of pending, queued and concluded motions."/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:920,fontSize:"0.9rem"}}>
            <thead><tr style={{background:T.bg,color:T.gold,fontFamily:"'Cinzel',serif",textTransform:"uppercase",letterSpacing:"0.06em"}}>
              {['Status','Motion','Proposer','Session','Votes','Record'].map(h=><th key={h} style={{textAlign:"left",padding:"0.5rem",border:`1px solid ${T.border}`}}>{h}</th>)}
            </tr></thead>
            <tbody>{[...other].reverse().map(m=>{
              const isSel=selMotion===m.id;
              const yeas=Object.values(m.votes||{}).filter(v=>v==="yea").length;
              const nays=Object.values(m.votes||{}).filter(v=>v==="nay").length;
              return <React.Fragment key={m.id}>
                <tr style={{background:T.surf}}>
                  <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top"}}><Badge c={String(m.status||"").toUpperCase()} color={scol[m.status]||T.mut} sm/></td>
                  <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top",minWidth:300}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.text}}>{m.title}</div><div style={{color:T.mut,fontSize:"0.86rem",lineHeight:1.45,marginTop:"0.25rem"}}>{String(m.body||"").slice(0,240)}{String(m.body||"").length>240?"…":""}</div>{m.status==="queued"&&<div style={{color:T.gold,fontSize:"0.82rem",marginTop:"0.2rem"}}>Queued — another motion is currently active.</div>}{m.status==="rejected"&&<div style={{color:T.mut,fontSize:"0.82rem",marginTop:"0.2rem"}}>Rejected by GM — not put to vote.</div>}{m.status==="vetoed"&&<div style={{color:T.rhi,fontSize:"0.82rem",marginTop:"0.2rem"}}>Vetoed by {m.vetoedByName||"a Tribune"}</div>}</td>
                  <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top"}}>{m.byName||"Unknown"}</td>
                  <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top",color:T.mut}}>{m.session||""}</td>
                  <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top",fontFamily:"'Cinzel',serif"}}>AYE {yeas} · NAY {nays}{m.autoResolved?" · AUTO":""}</td>
                  <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top"}}>{(m.status==="passed"||m.status==="failed"||m.status==="voting")&&<button onClick={()=>setSelMotion(isSel?null:m.id)} style={{background:"none",border:"none",color:T.blue,cursor:"pointer",fontFamily:"'Cinzel',serif",fontWeight:900}}>{isSel?"▲ Hide":"▼ Show"}</button>}</td>
                </tr>
                {isSel&&<tr><td colSpan={6} style={{padding:"0.65rem",border:`1px solid ${T.border}`,background:T.card}}><VotingGrid motion={m} players={players}/></td></tr>}
              </React.Fragment>;
            })}</tbody>
          </table>
        </div>
      </Card>
      <Card>
        <STit c="Motion Registry" sub="Passed, failed, rejected and vetoed motions remain here as a permanent voting record."/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:760,fontSize:"0.9rem"}}>
            <thead><tr style={{background:T.bg,color:T.gold,fontFamily:"'Cinzel',serif",textTransform:"uppercase",letterSpacing:"0.06em"}}>{['Result','Motion','Proposer','Session','Votes / Notes'].map(h=><th key={h} style={{textAlign:"left",padding:"0.5rem",border:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{motions.filter(m=>["passed","failed","rejected","vetoed"].includes(m.status)).slice().reverse().map(m=>{
              const yeas=Object.values(m.votes||{}).filter(v=>v==="yea").length;
              const nays=Object.values(m.votes||{}).filter(v=>v==="nay").length;
              return <tr key={`reg-${m.id}`} style={{background:T.surf}}><td style={{padding:"0.5rem",border:`1px solid ${T.border}`}}><Badge c={String(m.status||"").toUpperCase()} color={scol[m.status]||T.mut} sm/></td><td style={{padding:"0.5rem",border:`1px solid ${T.border}`,fontFamily:"'Cinzel',serif",fontWeight:900}}>{m.title}</td><td style={{padding:"0.5rem",border:`1px solid ${T.border}`}}>{m.byName||"Unknown"}</td><td style={{padding:"0.5rem",border:`1px solid ${T.border}`,color:T.mut}}>{m.session||""}</td><td style={{padding:"0.5rem",border:`1px solid ${T.border}`}}>AYE {yeas} · NAY {nays}{m.vetoedByName?` · Vetoed by ${m.vetoedByName}`:""}{m.autoResolved?" · Auto-majority":""}</td></tr>
            })}</tbody>
          </table>
          {motions.filter(m=>["passed","failed","rejected","vetoed"].includes(m.status)).length===0&&<div style={{color:T.mut,fontStyle:"italic",padding:"0.6rem"}}>No concluded motions yet.</div>}
        </div>
      </Card>
      {motions.length===0&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.88rem"}}>No motions have been proposed yet.</div>}
    </div>
  );
}

function VotingGrid({motion,players}){
  if(!motion)return null;
  const votes=motion?.votes||{};
  const ayeCount=Object.values(votes).filter(v=>v==="yea").length;
  const nayCount=Object.values(votes).filter(v=>v==="nay").length;
  const notCount=(players||[]).length-Object.keys(votes).length;
  return <div style={{marginTop:"0.75rem"}}>
    <STit c="Senate Vote — Current Tallies"/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"0.45rem"}}>
      {(players||[]).map(p=>{
        const vote=votes[p.id];
        const posInfo=p.role?POS[p.role]:null;
        const isAye=vote==="yea";
        const isNay=vote==="nay";
        const ci=getClassInfo(p.charClass);
        const bg=isAye?"#EAF7EA":isNay?"#FBEAEA":"#FFFDF8";
        const bc=isAye?"#2E7D32":isNay?"#B91C1C":T.border;
        const fg=isAye?"#14532D":isNay?"#7F1D1D":T.text;
        const label=isAye?"✓ AYE":isNay?"✗ NAY":"—";
        return <div key={p.id} style={{background:bg,border:`1px solid ${bc}`,borderLeft:`5px solid ${bc}`,padding:"0.55rem 0.45rem",textAlign:"center",position:"relative",minHeight:86,boxShadow:isAye||isNay?"0 1px 4px rgba(0,0,0,0.08)":"none"}}>
          {posInfo&&<div style={{fontSize:"0.58rem",color:posInfo.color,fontFamily:"'Cinzel',serif",fontWeight:900,marginBottom:"0.18rem"}}>{posInfo.abbr}</div>}
          <div style={{fontSize:"0.78rem",color:T.text,fontFamily:"'Cinzel',serif",lineHeight:1.15,fontWeight:800,wordBreak:"break-word"}}>{(p.latinName||"Unknown Senator").split(" ").slice(0,2).join(" ")}</div>
          <div style={{fontSize:"0.62rem",color:ci.color,marginTop:"0.15rem",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ci.emoji} {p.charClass||"Senator"}</div>
          <div style={{marginTop:"0.32rem",fontSize:"0.82rem",fontWeight:900,color:fg,fontFamily:"'Cinzel',serif",letterSpacing:"0.04em"}}>{label}</div>
        </div>;
      })}
    </div>
    <div style={{display:"flex",gap:"1rem",marginTop:"0.65rem",fontSize:"0.85rem",color:T.mut,flexWrap:"wrap",fontFamily:"'Cinzel',serif"}}>
      <span style={{color:"#14532D",fontWeight:900}}>✓ AYE: {ayeCount}</span>
      <span style={{color:"#7F1D1D",fontWeight:900}}>✗ NAY: {nayCount}</span>
      <span style={{color:T.mut}}>⟳ NOT VOTED: {notCount}</span>
    </div>
  </div>;
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
          <div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"0.9rem",letterSpacing:"0.15em",marginBottom:"0.4rem",marginTop:"0.75rem",display:"flex",alignItems:"center",gap:"0.5rem"}}>
            {sess}{sess===currSess&&<Badge c="CURRENT SESSION" color={T.gold} sm/>}
          </div>
          {grouped[sess].map(o=>{
            const pos=o.role?POS[o.role]:null;
            const pl=players.find(p=>p.id===o.playerId);
            return(
              <Card key={o.id} style={{borderLeft:`3px solid ${pos?.color||T.fnt}`,marginBottom:"0.4rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.3rem"}}>
                  <div>
                    <span style={{fontFamily:"'Cinzel',serif",color:pos?.color||T.mut,fontSize:"0.9rem",fontWeight:700}}>{pos?.title||o.role}</span>
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

function MyOfficePanel({user,game,legions,cavalry=[],fleets=[],players,orders,deadline,onRefresh}){
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
  const isEmergency=role.startsWith("dictator")||role.startsWith("magister_equitum");
  const isAedile=role.startsWith("aedile");
  const [market,setMarket]=useState({foodMarketStock:Number(game.foodMarketStock||0),foodMarketPrice:Number(game.foodMarketPrice||2)});
  useEffect(()=>{setMarket({foodMarketStock:Number(game.foodMarketStock||0),foodMarketPrice:Number(game.foodMarketPrice||2)});},[game.foodMarketStock,game.foodMarketPrice]);
  const saveMarket=async()=>{const g=await db.get("spqr_g")||game||DEF_GAME;const ng={...g,foodMarketStock:Math.max(0,Number(market.foodMarketStock)||0),foodMarketPrice:Math.max(0,Number(market.foodMarketPrice)||0)};await db.set("spqr_g",ng);await addWealthLog({type:"market-control",session:sLab(ng),text:`${user.latinName} updated the Roman food market: ${ng.foodMarketStock}M available at ${ng.foodMarketPrice}T per 1M.`});await pushN("State Food Market Updated",`${user.latinName} updated the Roman food market: ${ng.foodMarketStock}M available at ${ng.foodMarketPrice}T per 1M.`);onRefresh&&onRefresh();};

  return(
    <div className="office-panel" style={{background:`linear-gradient(135deg, ${pos.bg||T.card} 0%, #FFFFFF 52%, ${pos.bg||T.card} 100%)`,border:`2px solid ${pos.color}`,borderTop:`10px solid ${pos.color}`,boxShadow:`inset 0 0 0 9999px ${pos.bg||T.bg}55, 0 0 0 1px ${pos.color}33`,padding:"1rem",minHeight:"70vh",borderRadius:"8px"}}>
      <style>{`.office-panel .spqr-card{background:${pos.bg||T.card} !important;border-color:${pos.color}66 !important;box-shadow:0 0 0 1px ${pos.color}22 inset;} .office-panel .spqr-card .spqr-title{color:${pos.color} !important;} .office-panel textarea,.office-panel input,.office-panel select{border-color:${pos.color}88 !important;}`}</style>
      {/* Position header */}
      <Card style={{borderLeft:`5px solid ${pos.color}`,background:pos.bg}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.5rem",marginBottom:"0.5rem"}}>
          <div style={{fontFamily:"'Cinzel',serif",color:pos.color,fontSize:"1.05rem",fontWeight:700}}>{pos.emoji||"🏛️"} {pos.title}</div>
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
      {(isConsul||isEmergency)&&(
        <Card>
          <STit c="Legion Status"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:"0.35rem"}}>
            {legions.map(l=>{
              const sc={active:T.blue,raising:T.gold,destroyed:T.rhi,unraised:T.fnt};
              return<div key={l.id} style={{display:"flex",justifyContent:"space-between",padding:"0.3rem 0.5rem",background:T.bg,border:`1px solid ${T.border}`,fontSize:"0.82rem"}}>
                <span>{l.name||`Legio ${l.id}`}<br/><small style={{color:T.mut}}>📍 {l.location||"Unknown"} · 🎖️ {l.commander||"Unassigned"}</small></span><span style={{color:sc[l.status]||T.mut}}>{l.status==="active"?`${fmt(l.str)} men`:l.status==="raising"?`Raising ${l.prog}/${game.lturns}t`:l.status.toUpperCase()}</span>
              </div>;
            })}
          </div>
        </Card>
      )}
      {role.startsWith("magister_equitum")&&(
        <Card>
          <STit c="Cavalry Detachments"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:"0.35rem"}}>
            {(cavalry||[]).map(c=><div key={c.id} style={{padding:"0.45rem 0.6rem",background:T.bg,border:`1px solid ${T.border}`,fontSize:"0.95rem"}}>
              <b style={{color:T.blue}}>🐎 {c.name}</b><br/>
              <span>{fmt(c.str||0)} riders · 📍 {c.location||"Unknown"}</span><br/>
              <small>🎖️ {c.commander||"Unassigned"} · 🏕️ {c.armyCommand||"Independent"}</small>
            </div>)}
          </div>
        </Card>
      )}

      {(isQuaestor)&&(
        <Card>
          <STit c="Treasury & State Food Market" sub="Both Quaestors may control how much state food is offered for sale and at what price. Changes are publicly recorded."/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"0.4rem"}}>
            <Stat label="🪙 State Gold" value={`${fmt(game.gold)}T`} color={RES.gold.color}/>
            <Stat label="🌾 State Food" value={`${fmt(game.food)}M`} color={RES.food.color}/>
            <Stat label="🌾 Food Market Available" value={`${fmt(game.foodMarketStock||0)}M`} color={RES.food.color}/>
            <Stat label="🪙 Market Price" value={`${fmt(game.foodMarketPrice||2)}T / 1M`} color={RES.gold.color}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"0.55rem",marginTop:"0.7rem",alignItems:"end"}}>
            <Inp label="🌾 Food Available for Sale" type="number" value={market.foodMarketStock} onChange={v=>setMarket({...market,foodMarketStock:v})}/>
            <Inp label="🪙 Price per 1M Food" type="number" value={market.foodMarketPrice} onChange={v=>setMarket({...market,foodMarketPrice:v})}/>
            <Btn onClick={saveMarket}>Save Market Rules</Btn>
          </div>
        </Card>
      )}
      {(isAedile||(role==="quaestor_2"))&&(
        <Card>
          <STit c="Food Supply"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"0.4rem"}}>
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
              ):<div style={{color:T.fnt,fontSize:"0.9rem",fontStyle:"italic"}}>No resolution recorded</div>}
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
  const [err,setErr]=useState("");
  const [identity,setIdentity]=useState({
    latinName:user.latinName||"",
    username:user.username||"",
    charClass:user.charClass||"Patrician",
    discord:user.discord||"",
    bio:user.bio||""
  });
  const fileRef=useRef();
  useEffect(()=>{
    setAv(user.avatar||null);
    setIdentity({latinName:user.latinName||"",username:user.username||"",charClass:user.charClass||"Patrician",discord:user.discord||"",bio:user.bio||""});
  },[user.id,user.avatar,user.latinName,user.username,user.charClass,user.discord]);

  const syncPlayerNameEverywhere=async(updatedUser)=>{
    const motions=await db.get("spqr_m")||[];
    if(motions.length){
      await db.set("spqr_m",motions.map(m=>m.byId===updatedUser.id?{...m,byName:updatedUser.latinName}:m));
    }
    const orders=await db.get("spqr_o")||[];
    if(orders.length){
      await db.set("spqr_o",orders.map(o=>o.playerId===updatedUser.id?{...o,playerName:updatedUser.latinName}:o));
    }
    const elections=await db.get("spqr_e")||[];
    if(elections.length){
      await db.set("spqr_e",elections.map(e=>({
        ...e,
        candidates:(e.candidates||[]).map(c=>c.playerId===updatedUser.id?{...c,name:updatedUser.latinName}:c)
      })));
    }
  };

  const saveIdentity=async()=>{
    setErr("");setMsg("");
    const latinName=identity.latinName.trim();
    const username=identity.username.trim();
    const discord=identity.discord.trim();
    if(!latinName){setErr("Character name cannot be empty.");return;}
    if(!username){setErr("Login username cannot be empty.");return;}
    const players=await db.get("spqr_p")||[];
    if(players.find(p=>p.id!==user.id&&p.username?.toLowerCase()===username.toLowerCase())){setErr("That login username is already taken.");return;}
    if(discord&&players.find(p=>p.id!==user.id&&p.discord?.toLowerCase()===discord.toLowerCase())){setErr("That Discord username is already linked to another senator.");return;}
    const updatedUser={...user,latinName,username,charClass:user.charClass||identity.charClass||"Patrician",discord,bio:identity.bio||""};
    await db.set("spqr_p",players.map(p=>p.id===user.id?updatedUser:p));
    await syncPlayerNameEverywhere(updatedUser);
    onUpdate&&onUpdate(updatedUser);
    setMsg("Profile updated.");setTimeout(()=>setMsg(""),3500);
  };

  const handleFile=async(e)=>{
    const f=e.target.files?.[0];if(!f)return;
    const b64=await compress(f,200);
    const players=await db.get("spqr_p")||[];
    const updatedUser={...user,avatar:b64};
    await db.set("spqr_p",players.map(p=>p.id===user.id?{...p,avatar:b64}:p));
    setAv(b64);setMsg("Avatar updated.");setTimeout(()=>setMsg(""),3000);
    onUpdate&&onUpdate(updatedUser);
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
            <button onClick={()=>fileRef.current.click()} style={{display:"block",marginTop:"0.4rem",background:"none",border:`1px solid ${T.border}`,color:T.mut,fontFamily:"'Cinzel',serif",fontSize:"0.72rem",padding:"0.3rem 0.45rem",cursor:"pointer",width:"100%",letterSpacing:"0.06em"}}>UPLOAD AVATAR</button>
            {msg&&<div style={{color:T.gre,fontSize:"0.9rem",marginTop:"0.2rem"}}>{msg}</div>}
            {err&&<div style={{color:T.rhi,fontSize:"0.9rem",marginTop:"0.2rem",maxWidth:180}}>{err}</div>}
          </div>
          <div style={{flex:1,minWidth:260}}>
            <div style={{fontFamily:"'Cinzel',serif",color:T.ghi,fontSize:"1.25rem",fontWeight:700,marginBottom:"0.25rem"}}>{user.latinName}</div>
            <div style={{color:T.mut,fontSize:"0.95rem"}}>{user.charClass}</div>
            {user.discord&&<div style={{color:"#7289DA",fontSize:"0.9rem",marginTop:"0.2rem"}}>Discord: {user.discord}</div>}
            <div style={{color:T.fnt,fontSize:"0.85rem",marginTop:"0.15rem"}}>Login: {user.username} · Enrolled: {new Date(user.joined).toLocaleDateString()}</div>
            {pos&&<div style={{marginTop:"0.5rem"}}><Badge c={pos.title} color={pos.color}/></div>}
          </div>
        </div>
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:"0.8rem",marginTop:"0.8rem"}}>
          <STit c="Edit Profile" sub="You can update your character name and login username here. If you forget your password, ask the Game Master to reset it."/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"0.6rem"}}>
            <Inp label="Character / Roman Name" value={identity.latinName} onChange={v=>setIdentity(f=>({...f,latinName:v}))}/>
            <Inp label="Login Username" value={identity.username} onChange={v=>setIdentity(f=>({...f,username:v}))}/>
            <div>
              <Lbl c="Class"/>
              <div style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"0.48rem 0.6rem",fontFamily:"'EB Garamond',serif",fontSize:"1.05rem",minHeight:"2.3rem"}}>
                <ClassBadge cls={user.charClass||"Plebeian"}/>
                <div style={{fontSize:"0.78rem",color:T.mut,marginTop:"0.25rem",lineHeight:1.25}}>Class is locked. Rise in status from <b>Personal Wealth → Class Advancement</b> by paying the required gold/food.</div>
              </div>
            </div>
            <Inp label="Discord Username" value={identity.discord} onChange={v=>setIdentity(f=>({...f,discord:v}))}/>
          </div>
          <Inp label="Biography / Background" value={identity.bio} onChange={v=>setIdentity(f=>({...f,bio:v}))} rows={5} placeholder="Family background, political ambitions, notable history, personality, loyalties..."/>
          <Btn onClick={saveIdentity}>💾 Save Profile Changes</Btn>
        </div>
      </Card>
      <Card>
        <STit c="Rules of the Senate"/>
        {["Every Senator may propose one motion per turn. The GM approves before it goes to vote.",
          "Each Senator votes once per motion. Votes cannot be changed once cast.",
          "Magistrates with positions may submit one set of sealed orders per session.",
          "The Tribune's veto is absolute. No magistrate can override it.",
          "Death is permanent. A fallen senator's seat becomes vacant.",
          "All office actions are public record. Resolutions are private to each office.",
          "Positions are re-elected according to the election system.",
          "If you forget your password, contact the Game Master for a reset."]
          .map((r,i)=><div key={i} style={{display:"flex",gap:"0.5rem",marginBottom:"0.4rem",fontSize:"1rem",lineHeight:1.5}}><span style={{color:T.gold,minWidth:"1.1rem"}}>{i+1}.</span>{r}</div>)}
      </Card>
    </div>
  );
}

function LawsPanel({laws}){
  const list=(laws&&laws.length?laws:LAWS);
  const th={textAlign:"left",padding:"0.55rem",border:`1px solid ${T.border}`,background:T.bg,color:T.gold,fontFamily:"'Cinzel',serif",fontSize:"0.78rem",letterSpacing:"0.08em",textTransform:"uppercase"};
  const td={padding:"0.6rem",border:`1px solid ${T.border}`,verticalAlign:"top",lineHeight:1.55};
  return(
    <div>
      <Card style={{borderLeft:`3px solid ${T.gold}`}}>
        <STit c="Leges Romanae — Laws of the Roman Republic" sub="Table registry of active laws. Ignorance is no defence before the law."/>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",minWidth:760,fontSize:"0.95rem"}}>
            <thead><tr><th style={{...th,width:70}}>No.</th><th style={th}>Law</th><th style={th}>Text / Effect</th></tr></thead>
            <tbody>{list.map((l,i)=><tr key={i} style={{background:i%2?T.surf:T.card}}><td style={{...td,color:T.mut,fontFamily:"'Cinzel',serif",fontWeight:900}}>{i+1}</td><td style={{...td,color:T.gold,fontFamily:"'Cinzel',serif",fontWeight:900,minWidth:240}}>{l.t}</td><td style={{...td,color:T.text,whiteSpace:"pre-wrap"}}>{l.b}</td></tr>)}</tbody>
          </table>
        </div>
      </Card>
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


function EconomyGraph({history=[]}){
  const data=(history||[]).slice(-8);
  if(data.length===0)return <div style={{color:T.mut,fontStyle:"italic",fontSize:"1.05rem"}}>Economy history will appear after the GM advances at least one session.</div>;
  const maxGold=Math.max(1,...data.map(x=>Math.abs(x.netGold||0)));
  const maxFood=Math.max(1,...data.map(x=>Math.abs(x.netFood||0)));
  return(
    <div style={{display:"grid",gridTemplateColumns:`repeat(${data.length},minmax(58px,1fr))`,gap:"0.45rem",alignItems:"end",minHeight:210,padding:"0.75rem",background:T.bg,border:`1px solid ${T.border}`,overflowX:"auto"}}>
      {data.map((d,i)=>{
        const gh=Math.max(8,Math.round(Math.abs(d.netGold||0)/maxGold*130));
        const fh=Math.max(8,Math.round(Math.abs(d.netFood||0)/maxFood*130));
        return <div key={i} style={{textAlign:"center",minWidth:58}}>
          <div style={{height:150,display:"flex",alignItems:"flex-end",justifyContent:"center",gap:4}}>
            <div title={`Net gold ${d.netGold}`} style={{height:gh,width:18,background:(d.netGold||0)>=0?T.gold:T.rhi,border:`1px solid ${T.border}`}}/>
            <div title={`Net food ${d.netFood}`} style={{height:fh,width:18,background:(d.netFood||0)>=0?T.green:T.rhi,border:`1px solid ${T.border}`}}/>
          </div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.58rem",color:T.mut,marginTop:"0.35rem",lineHeight:1.2}}>{d.label}</div>
          <div style={{fontSize:"0.9rem",color:(d.netGold||0)>=0?T.ghi:T.rhi}}>{(d.netGold||0)>=0?"+":""}{d.netGold||0}T</div>
          <div style={{fontSize:"0.9rem",color:(d.netFood||0)>=0?T.green:T.rhi}}>{(d.netFood||0)>=0?"+":""}{d.netFood||0}M</div>
        </div>;
      })}
    </div>
  );
}


function ResourcesRegionsPanel({D,editable=false,onSave,onGameChange,onRegionsChange}){
  const g={...DEF_GAME,...(D.game||{})};
  const regs=D.regions||DEF_REGIONS;
  const legs=D.legions||DEF_LEGIONS;
  const inc=calcInc(regs,g);
  const mb=militaryBreakdown(g,legs,D.cavalry||DEF_CAVALRY,D.fleets||DEF_FLEETS,D.forceTypes||FORCE_TYPES);
  const privateTaxes=totalPrivateTaxProjection(D.players||[],D.assets||[],D.businesses||DEF_BUSINESSES,D.wealth||{},g);
  const totalGoldIncome=inc.gold+privateTaxes.gold;
  const totalFoodIncome=inc.food+privateTaxes.food;
  const netGold=totalGoldIncome-mb.totalGold;
  const netFood=totalFoodIncome-mb.totalFood;
  const goldStyle={color:RES.gold.color,fontFamily:"'Cinzel',serif",fontWeight:900};
  const foodStyle={color:RES.food.color,fontFamily:"'Cinzel',serif",fontWeight:900};
  const BalanceRow=({label,value,color=T.text,bold,emoji})=><div style={{display:"flex",justifyContent:"space-between",gap:"0.75rem",borderBottom:`1px solid ${T.border}`,padding:"0.42rem 0",fontSize:"1.08rem",alignItems:"center"}}><span style={{color:T.mut}}>{emoji&&<span style={{marginRight:"0.35rem"}}>{emoji}</span>}{label}</span><span style={{color,fontFamily:"'Cinzel',serif",fontWeight:bold?900:700}}>{value}</span></div>;
  const RaiseCard=({title,emoji,gold,food,pop,turns,note})=><div style={{background:T.surf,border:`1px solid ${T.border}`,padding:"0.85rem",borderLeft:`5px solid ${T.gold}`}}>
    <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.ghi,marginBottom:"0.45rem",fontSize:"1.05rem"}}>{emoji} {title}</div>
    <BalanceRow label="Gold cost" emoji={RES.gold.emoji} value={`${fmt(gold)}T`} color={RES.gold.color}/>
    <BalanceRow label="Food cost" emoji={RES.food.emoji} value={`${fmt(food)}M`} color={RES.food.color}/>
    <BalanceRow label="Manpower / crew" emoji={RES.men.emoji} value={fmt(pop)} color={RES.men.color}/>
    <BalanceRow label="Turns required" emoji="⏳" value={fmt(turns)} color={T.mut}/>
    {note&&<div style={{color:T.mut,fontSize:"0.9rem",marginTop:"0.4rem",fontStyle:"italic"}}>{note}</div>}
  </div>;
  return(
    <div>
      <Card style={{borderLeft:`4px solid ${T.red}`}}>
        <STit c="Economy of the Republic" sub="Balance sheet: stockpiles, income, military upkeep and net result per turn."/>
        <div className="spqr-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"0.55rem",marginBottom:"0.85rem"}}>
          <Stat label={`${RES.gold.emoji} Gold Stockpile`} value={`${fmt(g.gold)}T`} color={RES.gold.color}/>
          <Stat label={`${RES.food.emoji} Food Stockpile`} value={`${fmt(g.food)}M`} color={RES.food.color}/>
          <Stat label={`${RES.gold.emoji} Total Gold Income`} value={`+${fmt(totalGoldIncome)}T`} color={RES.gold.color}/>
          <Stat label={`${RES.food.emoji} Total Food Income`} value={`+${fmt(totalFoodIncome)}M`} color={RES.food.color}/>
          <Stat label={`${RES.gold.emoji} Total Gold Upkeep`} value={`-${fmt(mb.totalGold)}T`} color={T.rhi}/>
          <Stat label={`${RES.food.emoji} Total Food Upkeep`} value={`-${fmt(mb.totalFood)}M`} color={T.rhi}/>
          <Stat label={`${RES.gold.emoji} Net Gold / Turn`} value={`${netGold>=0?"+":""}${fmt(netGold)}T`} color={netGold>=0?RES.gold.color:T.rhi}/>
          <Stat label={`${RES.food.emoji} Net Food / Turn`} value={`${netFood>=0?"+":""}${fmt(netFood)}M`} color={netFood>=0?RES.food.color:T.rhi}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"0.75rem"}}>
          <div style={{background:T.surf,border:`1px solid ${T.border}`,padding:"0.9rem",borderLeft:`5px solid ${RES.gold.color}`}}>
            <STit c={`${RES.gold.emoji} Gold Balance`}/>
            <BalanceRow label="Starting stockpile" value={`${fmt(g.gold)}T`} color={RES.gold.color}/>
            <BalanceRow label="Provincial gold income" value={`+${fmt(inc.gold)}T`} color={RES.gold.color}/><BalanceRow label="Senator estate taxes" value={`+${fmt(privateTaxes.gold)}T`} color={RES.gold.color}/>
            <BalanceRow label="Legion upkeep" value={`-${fmt(mb.legionGold)}T`} color={T.rhi}/>
            <BalanceRow label="Cavalry upkeep" value={`-${fmt(mb.cavalryGold)}T`} color={T.rhi}/>
            <BalanceRow label="Fleet upkeep" value={`-${fmt(mb.fleetGold)}T`} color={T.rhi}/>
            <BalanceRow label="Total military upkeep" value={`-${fmt(mb.totalGold)}T`} color={T.rhi}/>
            <BalanceRow label="Net gold per turn" value={`${netGold>=0?"+":""}${fmt(netGold)}T`} color={netGold>=0?RES.gold.color:T.rhi} bold/>
          </div>
          <div style={{background:T.surf,border:`1px solid ${T.border}`,padding:"0.9rem",borderLeft:`5px solid ${RES.food.color}`}}>
            <STit c={`${RES.food.emoji} Food Balance`}/>
            <BalanceRow label="Starting stockpile" value={`${fmt(g.food)}M`} color={RES.food.color}/>
            <BalanceRow label="Provincial food income" value={`+${fmt(inc.food)}M`} color={RES.food.color}/><BalanceRow label="Senator estate taxes" value={`+${fmt(privateTaxes.food)}M`} color={RES.food.color}/>
            <BalanceRow label="Legion food upkeep" value={`-${fmt(mb.legionFood)}M`} color={T.rhi}/>
            <BalanceRow label="Cavalry food upkeep" value={`-${fmt(mb.cavalryFood)}M`} color={T.rhi}/>
            <BalanceRow label="Fleet food upkeep" value={`-${fmt(mb.fleetFood)}M`} color={T.rhi}/>
            <BalanceRow label="Total military upkeep" value={`-${fmt(mb.totalFood)}M`} color={T.rhi}/>
            <BalanceRow label="Net food per turn" value={`${netFood>=0?"+":""}${fmt(netFood)}M`} color={netFood>=0?RES.food.color:T.rhi} bold/>
          </div>
        </div>
      </Card>
      <Card>
        <STit c="Cost to Recruit / Build Forces" sub="Recruitment and construction costs before ongoing maintenance. Special allied and levy forces are cheaper but may create political or reliability risks."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:"0.65rem"}}>
          {(D.forceTypes||FORCE_TYPES).map(ft=><RaiseCard key={ft.id} title={ft.name} emoji={ft.emoji} gold={ft.gold} food={ft.food} pop={ft.men} turns={ft.turns} note={`${ft.note} Upkeep: ${ft.goldUpkeep}T / ${ft.foodUpkeep}M.`}/>) }
        </div>
      </Card>
      <Card>
        <STit c="Economy Trend" sub="Updated when the Game Master advances the session."/>
        <EconomyGraph history={D.econ||[]}/>
        <div style={{display:"flex",gap:"0.8rem",marginTop:"0.5rem",fontSize:"0.9rem",color:T.mut,flexWrap:"wrap"}}><span style={goldStyle}>■ {RES.gold.emoji} Gold net</span><span style={foodStyle}>■ {RES.food.emoji} Food net</span></div>
      </Card>
      <Card>
        <STit c="Provinces and Regional Income" sub="Capital, population, control and effective income are shown for every province."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"0.65rem"}}>
          {regs.map((r,i)=>{const st=RS[r.s]||RS.roman;return <div className="spqr-region-card" key={r.id||i} style={{background:T.surf,border:`1px solid ${st.c}`,padding:"0.8rem",minWidth:0}}>
            <div className="spqr-region-head" style={{marginBottom:"0.45rem"}}>
              <div className="spqr-region-title" style={{fontFamily:"'Cinzel',serif",fontWeight:800,color:T.text,fontSize:"1.05rem",lineHeight:1.15}}>{r.name}</div>
              <Badge c={st.l} color={st.c} sm/>
            </div>
            <div style={{fontSize:"1rem",color:T.mut}}>🏛️ Capital: <span style={{color:T.text}}>{r.capital||"Unknown"}</span></div>
            <div style={{fontSize:"1rem",color:T.mut}}>👥 Population: <span style={{color:T.text,fontFamily:"'Cinzel',serif"}}>{fmt(r.pop||0)}</span></div>
            <div style={{fontSize:"0.95rem",color:T.mut,marginTop:"0.25rem"}}>Base: <span style={goldStyle}>{fmt(r.bG)}T</span> / <span style={foodStyle}>{fmt(r.bF)}M</span></div>
            <div style={{fontFamily:"'Cinzel',serif",fontSize:"0.9rem",color:st.c,marginTop:"0.25rem"}}>Effective: <span style={{color:RES.gold.color}}>{fmt(Math.floor((r.bG||0)*st.m))}T</span> / <span style={{color:RES.food.color}}>{fmt(effectiveFoodIncome((r.bF||0)*st.m,g))}M{winterFoodMark((r.bF||0)*st.m,g)}</span></div>
          </div>})}
        </div>
      </Card>
    </div>
  );
}


function LegionsPublicPanel({D}){
  const legions=D.legions||DEF_LEGIONS;
  const cavalry=D.cavalry||DEF_CAVALRY;
  const fleets=D.fleets||DEF_FLEETS;
  const game={...DEF_GAME,...(D.game||{})};
  const sc={active:T.blue,raising:T.gold,destroyed:T.rhi,unraised:T.fnt,repairing:T.gold};
  const mb=militaryBreakdown(game,legions,cavalry,fleets);
  const activeLegs=activeLegions(legions);
  const activeCav=activeCavalry(cavalry);
  const legionMen=activeLegs.reduce((sum,l)=>sum+Number(l.str||0),0);
  const cavalryMen=activeCav.reduce((sum,c)=>sum+Number(c.str||0),0);
  const fleetMen=mb.crew;
  const totalMen=legionMen+cavalryMen+fleetMen;
  const UnitLine=({label,value,color=T.text})=><div style={{fontSize:"1.05rem",color:T.mut}}>{label}: <span style={{color}}>{value}</span></div>;
  const CostBox=({title,emoji,gold,food,men,turns,goldUpkeep,foodUpkeep,note})=><div style={{background:T.surf,border:`1px solid ${T.border}`,padding:"0.75rem",borderLeft:`5px solid ${T.gold}`}}>
    <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.ghi,marginBottom:"0.35rem"}}>{emoji} {title}</div>
    <UnitLine label={`${RES.gold.emoji} Raise Gold`} value={`${fmt(gold)}T`} color={RES.gold.color}/>
    <UnitLine label={`${RES.food.emoji} Raise Food`} value={`${fmt(food)}M`} color={RES.food.color}/>
    <UnitLine label="👥 Men / crew" value={fmt(men)} color={T.blue}/>
    <UnitLine label="⏳ Turns" value={fmt(turns)} color={T.mut}/>
    <UnitLine label="⚖️ Upkeep" value={`${fmt(goldUpkeep||0)}T / ${fmt(foodUpkeep||0)}M`} color={T.rhi}/>
    {note&&<div style={{marginTop:"0.35rem",fontSize:"0.88rem",color:T.mut,lineHeight:1.35}}>{note}</div>}
  </div>;
  return <div>
    <Card><STit c="Total Armed Forces" sub="Total manpower available across legions, cavalry and fleets."/>
      <div className="spqr-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"0.5rem"}}>
        <Stat label="🛡️ Legion Soldiers" value={fmt(legionMen)} color={T.blue}/>
        <Stat label="🐎 Cavalry Riders" value={fmt(cavalryMen)} color={T.blue}/>
        <Stat label="🚢 Fleet Crew" value={fmt(fleetMen)} color={T.blue}/>
        <Stat label="👥 Total Forces" value={fmt(totalMen)} color={T.ghi}/>
        <Stat label="Active Legions" value={mb.activeLegions}/>
        <Stat label="Cavalry Units" value={mb.activeCavalry} color={T.blue}/>
        <Stat label="Active Triremes" value={fmt(mb.triremes)} color={T.gold}/>
      </div>
    </Card>
    <Card><STit c="Cost to Recruit / Build" sub="Rome can now raise regular, allied, levy and unreliable auxiliary forces. Use politics carefully: cheap units may have diplomatic or reliability consequences."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"0.65rem"}}>
        {FORCE_TYPES.map(ft=><CostBox key={ft.id} title={ft.name} emoji={ft.emoji} gold={ft.gold} food={ft.food} men={ft.men} turns={ft.turns} goldUpkeep={ft.goldUpkeep} foodUpkeep={ft.foodUpkeep} note={ft.note}/>) }
      </div>
    </Card>
    <Card><STit c="Total Upkeep of the Armed Forces" sub="Maintenance cost paid each turn for all active forces."/>
      <div className="spqr-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"0.5rem"}}>
        <Stat label="🛡️ Legion Upkeep" value={`-${fmt(mb.legionGold)}T / ${fmt(mb.legionFood)}M`} color={T.rhi}/>
        <Stat label="🐎 Cavalry Upkeep" value={`-${fmt(mb.cavalryGold)}T / ${fmt(mb.cavalryFood)}M`} color={T.rhi}/>
        <Stat label="🚢 Fleet Upkeep" value={`-${fmt(mb.fleetGold)}T / ${fmt(mb.fleetFood)}M`} color={T.rhi}/>
        <Stat label={`${RES.gold.emoji} Total Gold Upkeep`} value={`-${fmt(mb.totalGold)}T`} color={T.rhi}/>
        <Stat label={`${RES.food.emoji} Total Food Upkeep`} value={`-${fmt(mb.totalFood)}M`} color={T.rhi}/>
      </div>
    </Card>
    <Card><STit c="Legions" sub="Each legion shows strength, stationed location and commander."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"0.6rem"}}>
        {legions.map((l,i)=><div key={`${l.id}-${i}`} style={{background:T.surf,border:`1px solid ${T.border}`,borderLeft:`5px solid ${sc[l.status]||T.border}`,padding:"0.75rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:"0.5rem",alignItems:"center",marginBottom:"0.4rem"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.text}}>🛡️ {l.name||`Legio ${l.id}`}</div><Badge c={(l.status||"active").toUpperCase()} color={sc[l.status]||T.mut} sm/></div>
          <UnitLine label="Strength" value={`${fmt(l.str||0)} / ${fmt(l.max||5000)}`}/>
          <UnitLine label="📍 Location" value={l.location||"Unknown"}/>
          <UnitLine label="🎖️ Commander" value={l.commander||"Unassigned"}/>
          {l.status==="raising"&&<div style={{marginTop:"0.35rem",color:T.gold}}>Raising progress: {l.prog||0}/{game?.lturns||DEF_GAME.lturns}</div>}
        </div>)}
      </div>
    </Card>
    <Card><STit c="Cavalry" sub="Cavalry units show strength, location and commander."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"0.6rem"}}>
        {cavalry.map((c,i)=><div key={`${c.id}-${i}`} style={{background:T.surf,border:`1px solid ${T.border}`,borderLeft:`5px solid ${T.blue}`,padding:"0.75rem"}}>
          <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.blue}}>🐎 {c.name}</div>
          <UnitLine label="Strength" value={`${fmt(c.str||0)} / ${fmt(c.max||0)}`}/>
          <UnitLine label="📍 Location" value={c.location||"Unknown"}/>
          <UnitLine label="🎖️ Commander" value={c.commander||"Unassigned"}/>
        </div>)}
      </div>
    </Card>
    <Card><STit c="Fleets" sub="Fleets show triremes, crew strength, location and commander."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"0.6rem"}}>
        {fleets.map((f,i)=>{const tri=Number(f.triremes??f.ships??0);return <div key={`${f.id}-${i}`} style={{background:T.surf,border:`1px solid ${T.border}`,borderLeft:`5px solid ${T.gold}`,padding:"0.75rem"}}>
          <div style={{display:"flex",justifyContent:"space-between",gap:"0.5rem",alignItems:"center",marginBottom:"0.35rem"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.ghi}}>🚢 {f.name}</div><Badge c={(f.status||"active").toUpperCase()} color={sc[f.status]||T.gold} sm/></div>
          <UnitLine label="Triremes" value={fmt(tri)}/>
          <UnitLine label="Crew / Strength" value={fmt(tri*200)}/>
          <UnitLine label="⚓ Location" value={f.location||"Unknown"}/>
          <UnitLine label="🎖️ Commander" value={f.commander||"Unassigned"}/>
        </div>})}
      </div>
    </Card>
  </div>;
}


function MagistratesPanel({players=[]}){
  return <div>
    <Card><STit c="Magistrates and Roles" sub="Offices of the Roman Republic, current holders and responsibilities."/></Card>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"0.65rem"}}>
      {roleEntries().map(pos=>{const holder=players.find(p=>p.role===pos.key);return <Card key={pos.key} style={{borderLeft:`4px solid ${pos.color}`,background:pos.bg||T.card}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:"0.5rem",alignItems:"center",marginBottom:"0.35rem"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:pos.color}}>{pos.emoji||"🏛️"} {pos.title}</div><Badge c={pos.abbr} color={pos.color}/></div>
        <div style={{fontSize:"1.05rem",color:T.mut,lineHeight:1.45,marginBottom:"0.45rem"}}>{pos.desc}</div>
        <div style={{fontSize:"1.05rem",color:T.text}}>Holder: <span style={{fontFamily:"'Cinzel',serif",color:holder?T.ghi:T.rhi}}>{holder?holder.latinName:"Vacant"}</span></div>
      </Card>})}
    </div>
  </div>;
}

function ElectionRoleTabs({elections,selectedId,onSelect}){
  const active=(elections||[]).filter(e=>e&&e.status!=="closed");
  if(active.length===0)return null;
  const current=active.find(e=>e.id===selectedId)||active[0];
  const co=POS[current?.office]||{};
  return <Card style={{padding:"0.75rem",marginBottom:"0.75rem",borderLeft:`6px solid ${co.color||T.gold}`,background:"#fffdf7"}}>
    <div className="election-role-picker">
      <div>
        <Lbl c="Select Magistracy"/>
        <select value={current?.id||""} onChange={e=>onSelect(e.target.value)} style={{width:"100%",padding:"0.7rem 0.75rem",border:`2px solid ${co.color||T.gold}`,background:"#ffffff",color:T.text,fontFamily:"'Cinzel',serif",fontWeight:900,fontSize:"0.95rem",borderRadius:8}}>
          {active.map(e=>{const o=POS[e.office]||{};const candCount=(e.candidates||[]).length;const voteCount=Object.keys(e.votes||{}).length;return <option key={e.id} value={e.id}>{o.emoji||"🏛️"} {o.title||e.office} — {e.status}{e.status==="candidacy"?` · ${candCount} candidates`:` · ${voteCount} votes`}</option>})}
        </select>
      </div>
    </div>
  </Card>;
}


function ElectionVoteRecord({election,players,onSelect}){
  const candidates=election.candidates||[];
  const votes=election.votes||{};
  const groups={};
  candidates.forEach(c=>groups[c.playerId]=[]);
  Object.entries(votes).forEach(([voterId,candId])=>{
    if(!groups[candId])groups[candId]=[];
    const voter=players.find(p=>p.id===voterId);
    if(voter)groups[candId].push(voter);
  });
  return <Card style={{background:"#fffdf7",border:`1px solid ${T.border}`,marginTop:"0.6rem"}}>
    <STit c="Election Vote Record" sub="Visible only when expanded. Senators may still change or withdraw votes while voting is open."/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"0.55rem"}}>
      {candidates.map(c=>{const cp=players.find(p=>p.id===c.playerId);const voters=groups[c.playerId]||[];return <div key={c.playerId} style={{background:"#ffffff",border:`1px solid ${T.border}`,borderRadius:10,padding:"0.65rem"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.text,marginBottom:"0.35rem"}}>🏛️ {c.name||getPlayerName(players,c.playerId)} <span style={{color:T.gold}}>({voters.length})</span></div>
        {voters.length===0&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.9rem"}}>No votes yet.</div>}
        {voters.map(v=>{const ci=getClassInfo(v.charClass);return <button key={v.id} onClick={()=>onSelect&&onSelect(v)} style={{display:"block",width:"100%",textAlign:"left",marginBottom:"0.25rem",padding:"0.35rem 0.45rem",background:ci.bg,border:`1px solid ${ci.color}`,borderRadius:8,cursor:"pointer",color:T.text}}><span style={{fontFamily:"'Cinzel',serif",fontWeight:800,color:ci.color}}>{ci.emoji} {v.latinName}</span></button>})}
      </div>})}
    </div>
    <div style={{marginTop:"0.55rem",color:T.mut,fontSize:"0.88rem"}}>Not voted: <b>{Math.max(0,(players||[]).length-Object.keys(votes).length)}</b></div>
  </Card>;
}

function ElectionsPlayerPanel({user,D,onRefresh}){
  const elections=D.elections||normalizeElections(null,D.election);
  const players=D.players||[];
  const [speechBy,setSpeechBy]=useState({});
  const [selected,setSelected]=useState(null);
  const [showVotes,setShowVotes]=useState({});
  const active=elections.filter(e=>e&&e.status!=="closed");
  const [activeElectionId,setActiveElectionId]=useState(null);
  useEffect(()=>{if(active.length && (!activeElectionId || !active.some(e=>e.id===activeElectionId)))setActiveElectionId(active[0].id);},[active.length,activeElectionId]);
  if(active.length===0)return <Card><STit c="Elections"/><div style={{color:T.mut}}>No election is currently open.</div></Card>;
  const visibleElection=active.find(e=>e.id===activeElectionId)||active[0];
  const stand=async(election)=>{
    if(election.status!=="candidacy")return;
    const office=POS[election.office];
    if((election.candidates||[]).some(c=>c.playerId===user.id))return;
    const legacy=await db.get("spqr_election");
    let all=normalizeElections(await db.get("spqr_elections"),legacy);
    if(!all.some(e=>e.id===election.id))all=[...all,election];
    const speech=(speechBy[election.id]||"I present myself for this office in service of Rome.").trim();
    const candidate={playerId:user.id,name:user.latinName,discord:user.discord||"",charClass:user.charClass||"",speech,declaredAt:new Date().toISOString()};
    const updated=all.map(e=>{
      if(e.id!==election.id)return e;
      if((e.candidates||[]).some(c=>c.playerId===user.id))return e;
      return {...e,candidates:[...(e.candidates||[]),candidate]};
    });
    await db.set("spqr_elections",updated);
    await db.set("spqr_election",null);
    await pushN("Election Candidacy",`${user.latinName} stands for ${office?.title||"office"}.\n\nSpeech:\n${speech}`);
    setSpeechBy({...speechBy,[election.id]:""});
    onRefresh&&onRefresh();
  };
  const updateCandidacy=async(election)=>{
    const legacy=await db.get("spqr_election");let all=normalizeElections(await db.get("spqr_elections"),legacy);
    const speech=(speechBy[election.id]||"").trim();if(!speech)return;
    const updated=all.map(e=>e.id===election.id?{...e,candidates:(e.candidates||[]).map(c=>c.playerId===user.id?{...c,speech,editedAt:new Date().toISOString()}:c)}:e);
    await db.set("spqr_elections",updated);await db.set("spqr_election",null);await pushN("Election Candidacy Edited",`${user.latinName} edited his candidacy speech for ${POS[election.office]?.title||"office"}.`);onRefresh&&onRefresh();
  };
  const dropCandidacy=async(election)=>{
    if(!confirm("Withdraw your candidacy for this office?"))return;
    const legacy=await db.get("spqr_election");let all=normalizeElections(await db.get("spqr_elections"),legacy);
    const updated=all.map(e=>e.id===election.id?{...e,candidates:(e.candidates||[]).filter(c=>c.playerId!==user.id)}:e);
    await db.set("spqr_elections",updated);await db.set("spqr_election",null);await pushN("Election Candidacy Withdrawn",`${user.latinName} withdrew his candidacy for ${POS[election.office]?.title||"office"}.`);onRefresh&&onRefresh();
  };
  const vote=async(election,candidateId)=>{
    if(election.status!=="voting")return;
    const office=POS[election.office];
    const legacy=await db.get("spqr_election");
    let all=normalizeElections(await db.get("spqr_elections"),legacy);
    if(!all.some(e=>e.id===election.id))all=[...all,election];
    const updated=all.map(e=>{if(e.id!==election.id)return e;const votes={...(e.votes||{})};const voteTs={...(e.voteTs||{})};if(candidateId==="withdraw"){delete votes[user.id];delete voteTs[user.id];}else{votes[user.id]=candidateId;voteTs[user.id]=Date.now();}return {...e,votes,voteTs};});
    await db.set("spqr_elections",updated);
    await db.set("spqr_election",null);
    await pushN("Election Vote Updated",`${user.latinName} ${candidateId==="withdraw"?"withdrew his vote":"updated his vote"} in the election for ${office?.title||"office"}.`,"gm");
    onRefresh&&onRefresh();
  };
  return <div>
    <Card><STit c="Active Magistrate Elections" sub="Choose an office tab to view candidacies, speeches and votes for that role."/></Card>
    <ElectionRoleTabs elections={active} selectedId={visibleElection.id} onSelect={setActiveElectionId}/>
    {[visibleElection].map(election=>{
      const office=POS[election.office];
      const isCandidate=(election.candidates||[]).some(c=>c.playerId===user.id);
      const myVote=election.votes?.[user.id];
      const counts={};Object.values(election.votes||{}).forEach(id=>counts[id]=(counts[id]||0)+1);
      return <Card key={election.id} style={{borderLeft:`6px solid ${office?.color||T.gold}`,background:office?.bg||T.card}}>
        <STit c={`${office?.emoji||"🏛️"} Election: ${office?.title||election.office}`} sub={`Phase: ${election.status.toUpperCase()} · Round ${election.round||1}`}/>
        <div style={{color:T.mut,lineHeight:1.6,marginBottom:"0.65rem"}}>{election.status==="candidacy"?"Declare your candidacy before the GM opens voting.":"Vote for one candidate. Each senator has one vote for this office."}</div>
        {election.status==="candidacy"&&<div style={{marginBottom:"0.8rem"}}>{isCandidate?(()=>{const mine=(election.candidates||[]).find(c=>c.playerId===user.id);return <><div style={{color:T.gre,fontFamily:"'Cinzel',serif",marginBottom:"0.35rem"}}>✓ You are a candidate for this office. You may edit or withdraw before voting opens.</div><Inp label="Edit Candidacy Speech" value={speechBy[election.id]??mine?.speech??""} onChange={v=>setSpeechBy({...speechBy,[election.id]:v})} rows={3}/><Row gap="0.5rem" wrap><Btn sm onClick={()=>updateCandidacy(election)}>Save Speech</Btn><Btn v="crimson" sm onClick={()=>dropCandidacy(election)}>Withdraw Candidacy</Btn></Row></>})():<><Inp label="Short Speech" value={speechBy[election.id]||""} onChange={v=>setSpeechBy({...speechBy,[election.id]:v})} rows={3} placeholder="Fathers of the Senate..."/><Btn onClick={()=>stand(election)}>Stand for {office?.title||"Office"}</Btn></>}</div>}
        <STit c="Candidates" sub="Candidate list is displayed as a table. Vote record is hidden by default and can be expanded."/>
        {(election.candidates||[]).length===0&&<div style={{color:T.mut,fontStyle:"italic"}}>No candidates yet.</div>}
        {(election.candidates||[]).length>0&&<div style={{overflowX:"auto"}}>
          <table className="election-table">
            <thead><tr><th>Candidate</th><th>Class</th><th>Speech</th><th>Tally</th><th>Action</th></tr></thead>
            <tbody>{(election.candidates||[]).map(c=>{const cp=players.find(p=>p.id===c.playerId);return <tr key={c.playerId}>
              <td data-label="Candidate"><button onClick={()=>cp&&setSelected(cp)} style={{background:"none",border:"none",padding:0,cursor:cp?"pointer":"default",fontFamily:"'Cinzel',serif",fontWeight:900,color:cp?T.blue:T.text,fontSize:"0.9rem",textDecoration:cp?"underline":"none",lineHeight:1.2}}>{c.name||getPlayerName(players,c.playerId)}</button>{c.discord&&<div style={{color:"#5865F2",fontSize:"0.82rem"}}>{c.discord}</div>}</td>
              <td data-label="Class">{cp?<ClassBadge cls={cp.charClass} sm/>:<span style={{color:T.mut}}>{c.charClass||"—"}</span>}</td>
              <td data-label="Speech"><div className="election-speech" style={{color:T.mut}}>{c.speech||"No speech recorded."}</div></td>
              <td data-label="Votes"><span style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.ghi}}>{counts[c.playerId]||0}</span></td>
              <td data-label="Action">{election.status==="voting"&&<><Btn sm disabled={myVote===c.playerId} onClick={()=>vote(election,c.playerId)}>{myVote===c.playerId?"Current Vote":"Vote"}</Btn>{myVote===c.playerId&&<div style={{marginTop:"0.35rem"}}><Btn v="ghost" sm onClick={()=>vote(election,"withdraw")}>Withdraw</Btn></div>}</>}</td>
            </tr>})}</tbody>
          </table>
        </div>}
        {(election.candidates||[]).length>0&&<div style={{marginTop:"0.55rem"}}><button onClick={()=>setShowVotes({...showVotes,[election.id]:!showVotes[election.id]})} style={{background:"none",border:"none",color:T.blue,fontFamily:"'Cinzel',serif",fontWeight:900,cursor:"pointer",fontSize:"0.9rem"}}>{showVotes[election.id]?"▲ Hide vote record":"▼ Show vote record"}</button>{showVotes[election.id]&&<ElectionVoteRecord election={election} players={players} onSelect={setSelected}/>}</div>}
        {selected&&<SenatorProfileModal player={selected} onClose={()=>setSelected(null)}/>}
      </Card>;
    })}
  </div>;
}


function PersonalWealthPanel({user,D,onRefresh}){
  const [businesses,setBusinesses]=useState(DEF_BUSINESSES);
  const [assets,setAssets]=useState([]);
  const [wealth,setWealth]=useState({});
  const [donations,setDonations]=useState([]);
  const [wealthlog,setWealthlog]=useState([]);
  const [foodBuy,setFoodBuy]=useState("");
  const [transfer,setTransfer]=useState({to:"",kind:"gold",amount:""});
  const [propTransfer,setPropTransfer]=useState({});
  const [msg,setMsg]=useState("");
  const [buy,setBuy]=useState({typeId:"olive_farm",regionId:"latium"});
  const regions=D.regions||DEF_REGIONS;
  const load=useCallback(async()=>{const loadedBiz=(await db.get("spqr_biz"));setBusinesses((loadedBiz&&loadedBiz.length)?loadedBiz:DEF_BUSINESSES);setAssets(normalizeAssetsList((await db.get("spqr_assets"))||[]));setWealth((await db.get("spqr_wealth"))||{});setDonations((await db.get("spqr_donations"))||[]);setWealthlog((await db.get("spqr_wealthlog"))||[]);},[]);
  useEffect(()=>{load();},[load]);
  const myW=wealthOf(wealth,user.id);
  const myAssets=assets.filter(a=>a.ownerId===user.id);
  const bal=personalBalanceFor(user.id,user.role,assets,businesses,wealth,D.game||DEF_GAME);
  const otherPlayers=(D.players||[]).filter(p=>p.id!==user.id);
  const b=getBiz(businesses,buy.typeId); const reg=getRegion(regions,buy.regionId);
  const cap=Number((b.regionCaps||{})[buy.regionId]||0); const used=ownedSlots(assets,b.id,buy.regionId);
  const upgrade=nextClassUpgrade(user.charClass);
  const saveWealth=async(next)=>{await db.set("spqr_wealth",next);setWealth(next);};
  const changeClassByPayment=async()=>{
    const up=nextClassUpgrade(user.charClass);
    if(!up){setMsg("No class advancement is currently available for your class.");setTimeout(()=>setMsg(""),3000);return;}
    const w=wealthOf(wealth,user.id);
    if(Number(w.gold||0)<Number(up.gold||0)||Number(w.food||0)<Number(up.food||0)){setMsg(`You need ${up.gold}T gold and ${up.food}M food to rise to ${up.to}.`);setTimeout(()=>setMsg(""),4000);return;}
    if(!confirm(`Pay ${up.gold}T gold and ${up.food}M food to rise to ${up.to}?`))return;
    const nextWealth={...wealth,[user.id]:{...w,gold:Number(w.gold||0)-Number(up.gold||0),food:Number(w.food||0)-Number(up.food||0)}};
    const players=await db.get("spqr_p")||D.players||[];
    const nextPlayers=players.map(p=>p.id===user.id?{...p,charClass:up.to}:p);
    await db.set("spqr_wealth",nextWealth);
    await db.set("spqr_p",nextPlayers);
    setWealth(nextWealth);
    await addHistory(user.id,"Class Advancement",`${user.latinName} paid ${up.gold}T gold and ${up.food}M food to rise to ${up.to}.`,"class");
    await addWealthLog({type:"class-advancement",session:sLab(D.game||DEF_GAME),text:`${user.latinName} paid to rise socially to ${up.to}.`});
    await pushN("Class Advancement",`${user.latinName} has risen socially to ${up.to}.`);
    setMsg(`Class advancement completed: ${up.to}. Refreshing...`);
    onRefresh&&onRefresh();
    setTimeout(()=>setMsg(""),4000);
  };
  const byRegion=myAssets.reduce((acc,a)=>{const k=a.regionId||"unknown";(acc[k] ||= []).push(a);return acc;},{});
  const buyAsset=async()=>{const biz=getBiz(businesses,buy.typeId),region=getRegion(regions,buy.regionId),max=Number((biz.regionCaps||{})[buy.regionId]||0);if(max<=0){setMsg("This business is not available in that province.");return;}if(ownedSlots(assets,biz.id,buy.regionId)>=max){setMsg("No available slots remain for that business in this province.");return;}const w=wealthOf(wealth,user.id);if(w.gold<Number(biz.costGold||0)||w.food<Number(biz.costFood||0)){setMsg("Insufficient personal wealth to buy this property.");return;}const newAsset={id:Date.now().toString()+Math.random().toString(36).slice(2),ownerId:user.id,ownerName:user.latinName,typeId:biz.id,regionId:region.id,regionName:region.name,boughtAt:sLab(D.game||DEF_GAME),ts:Date.now()};const nextAssets=[...assets,newAsset];const nextWealth={...wealth,[user.id]:{...w,gold:w.gold-Number(biz.costGold||0),food:w.food-Number(biz.costFood||0)}};await db.set("spqr_assets",nextAssets);await saveWealth(nextWealth);await addHistory(user.id,`Bought ${biz.name}`,`${user.latinName} bought ${biz.name} in ${region.name}.`,`estate`);setAssets(nextAssets);setMsg("Property purchased.");onRefresh&&onRefresh();setTimeout(()=>setMsg(""),3000);};
  const sellAsset=async(asset)=>{const biz=getBiz(businesses,asset.typeId);if(!confirm(`Sell ${biz.name} in ${asset.regionName||asset.regionId}? You receive 60% of the original cost.`))return;const w=wealthOf(wealth,user.id);const refundG=Math.floor(Number(biz.costGold||0)*0.6),refundF=Math.floor(Number(biz.costFood||0)*0.6);const nextAssets=assets.filter(a=>a.id!==asset.id);const nextWealth={...wealth,[user.id]:{...w,gold:w.gold+refundG,food:w.food+refundF}};await db.set("spqr_assets",nextAssets);await saveWealth(nextWealth);await addHistory(user.id,`Sold ${biz.name}`,`${user.latinName} sold ${biz.name} in ${asset.regionName||asset.regionId}.`,`estate`);setAssets(nextAssets);setMsg("Property sold.");onRefresh&&onRefresh();setTimeout(()=>setMsg(""),3000);};
  const donate=async(kind)=>{const w=wealthOf(wealth,user.id);const raw=prompt(`How much ${kind==="gold"?"gold":"food"} do you want to donate to the Republic?`);const amt=Math.floor(Number(raw));if(!amt||amt<=0)return;if(w[kind]<amt){setMsg("You do not have enough personal resources.");return;}const g=await db.get("spqr_g")||DEF_GAME;const nextGame={...g,[kind]:(Number(g[kind]||0)+amt)};const nextWealth={...wealth,[user.id]:{...w,[kind]:w[kind]-amt}};const entry={id:Date.now().toString()+Math.random().toString(36).slice(2),playerId:user.id,playerName:user.latinName,kind,amount:amt,session:sLab(D.game||DEF_GAME),ts:Date.now()};await db.set("spqr_g",nextGame);await saveWealth(nextWealth);await db.set("spqr_donations",[...donations,entry].slice(-300));await addHistory(user.id,`Donation to the Republic`,`${user.latinName} donated ${amt}${kind==="gold"?"T gold":"M food"} to the state.`,`donation`);await pushN("Donation to the State",`${user.latinName} donated ${amt}${kind==="gold"?"T gold":"M food"} to the Republic.`);setDonations(d=>[...d,entry]);setMsg("Donation made to the state treasury.");onRefresh&&onRefresh();setTimeout(()=>setMsg(""),3000);};
  const sellFood=async()=>{const w=wealthOf(wealth,user.id);const raw=prompt(`How much food do you want to sell? Current rate: 1M food = ${foodSaleRate}T gold.`);const amt=Math.floor(Number(raw));if(!amt||amt<=0)return;if(w.food<amt){setMsg("You do not have enough personal food.");return;}const gold=Math.floor(amt*foodSaleRate);const next={...wealth,[user.id]:{...w,gold:w.gold+gold,food:w.food-amt}};await saveWealth(next);await addHistory(user.id,"Sold Food",`${user.latinName} sold ${amt}M food for ${gold}T gold.`,`wealth`);setMsg(`Sold ${amt}M food for ${gold}T gold.`);setTimeout(()=>setMsg(""),3000);};
  const buyFoodFromState=async()=>{const amt=Math.floor(Number(foodBuy));const g={...DEF_GAME,...(await db.get("spqr_g")||D.game||{})};const price=Number(g.foodMarketPrice??2);const stock=Math.max(0,Number(g.foodMarketStock??0));if(!amt||amt<=0){setMsg("Enter how much food to buy.");return;}if(amt>stock||amt>Number(g.food||0)){setMsg("The state market does not have that much food available.");return;}const cost=Math.ceil(amt*price);const w=wealthOf(wealth,user.id);if(w.gold<cost){setMsg(`You need ${cost}T gold to buy ${amt}M food.`);return;}const nextGame={...g,food:Number(g.food||0)-amt,gold:Number(g.gold||0)+cost,foodMarketStock:stock-amt};const nextWealth={...wealth,[user.id]:{...w,gold:w.gold-cost,food:w.food+amt}};const entry={type:"market",session:sLab(g),text:`${user.latinName} bought ${amt}M food from the Roman state market for ${cost}T gold.`};await db.set("spqr_g",nextGame);await saveWealth(nextWealth);await addWealthLog(entry);setWealthlog(wl=>[...wl,entry]);await addHistory(user.id,"Bought Food From State",entry.text,"wealth");setFoodBuy("");setMsg("Food bought from the state market and recorded publicly.");onRefresh&&onRefresh();setTimeout(()=>setMsg(""),3000);};
  const sendWealth=async()=>{const to=transfer.to,kind=transfer.kind,amt=Math.floor(Number(transfer.amount));if(!to||!amt||amt<=0){setMsg("Choose a recipient and amount.");return;}const fromW=wealthOf(wealth,user.id);if(fromW[kind]<amt){setMsg("You do not have enough personal resources.");return;}const toW=wealthOf(wealth,to);const recipient=(D.players||[]).find(p=>p.id===to);const next={...wealth,[user.id]:{...fromW,[kind]:fromW[kind]-amt},[to]:{...toW,[kind]:toW[kind]+amt}};await saveWealth(next);await addHistory(user.id,"Transfer Sent",`${user.latinName} sent ${amt}${kind==="gold"?"T gold":"M food"} to ${recipient?.latinName||"another senator"}.`,`wealth`);await addHistory(to,"Transfer Received",`${recipient?.latinName||"A senator"} received ${amt}${kind==="gold"?"T gold":"M food"} from ${user.latinName}.`,`wealth`);const entry={type:"transfer",session:sLab(D.game||DEF_GAME),text:`${user.latinName} transferred ${amt}${kind==="gold"?"T gold":"M food"} to ${recipient?.latinName||"another senator"}.`};await addWealthLog(entry);setWealthlog(w=>[...w,entry]);setTransfer({to:"",kind:"gold",amount:""});setMsg("Transfer completed and recorded publicly.");setTimeout(()=>setMsg(""),3000);};
  const sendProperty=async(asset)=>{const to=propTransfer[asset.id];if(!to){setMsg("Choose a recipient for the property.");return;}const recipient=(D.players||[]).find(p=>p.id===to);const biz=getBiz(businesses,asset.typeId);if(!confirm(`Transfer ${biz.name} in ${asset.regionName||asset.regionId} to ${recipient?.latinName}?`))return;const nextAssets=assets.map(a=>a.id===asset.id?{...a,ownerId:to,ownerName:recipient?.latinName||"Unknown"}:a);setAssets(nextAssets);await db.set("spqr_assets",nextAssets);await addHistory(user.id,"Property Transferred",`${user.latinName} transferred ${biz.name} in ${asset.regionName||asset.regionId} to ${recipient?.latinName||"another senator"}.`,`wealth`);await addHistory(to,"Property Received",`${recipient?.latinName||"A senator"} received ${biz.name} in ${asset.regionName||asset.regionId} from ${user.latinName}.`,`wealth`);const entry={type:"property",session:sLab(D.game||DEF_GAME),text:`${user.latinName} transferred ${biz.name} in ${asset.regionName||asset.regionId} to ${recipient?.latinName||"another senator"}.`};await addWealthLog(entry);setWealthlog(w=>[...w,entry]);setPropTransfer(x=>({...x,[asset.id]:""}));setMsg("Property transferred and recorded publicly.");setTimeout(()=>setMsg(""),3000);};
  return <div>
    {msg&&<div style={{padding:"0.55rem 0.8rem",background:"#F4FFF0",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.7rem"}}>{msg}</div>}
    <Card><STit c="Personal Wealth Balance" sub="Exact coin and food are private. Only you and the Game Master can see them."/>
      <div className="spqr-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.55rem"}}>
        <Stat label="🪙 Private Gold" value={`${fmt(myW.gold)}T`} color={myW.gold<0?T.rhi:RES.gold.color}/><Stat label="🌾 Private Food" value={`${fmt(myW.food)}M`} color={myW.food<0?T.rhi:RES.food.color}/><Stat label="Gross Estate Income" value={`🪙 +${fmt(bal.gross.gold)}T / 🌾 +${fmt(bal.gross.food)}M`} color={T.gre}/><Stat label="Taxes" value={`-${fmt(bal.taxGold)}T / -${fmt(bal.taxFood)}M`} color={T.rhi}/><Stat label="Household Upkeep" value={`-${fmt(bal.houseGold)}T / -${fmt(bal.houseFood)}M`} color={T.rhi}/><Stat label="Net per Season" value={`${bal.netGold>=0?"+":""}${fmt(bal.netGold)}T / ${bal.netFood>=0?"+":""}${fmt(bal.netFood)}M`} color={(bal.netGold+bal.netFood)>=0?T.gre:T.rhi}/>
      </div>
      <div style={{marginTop:"0.6rem",color:T.mut}}>Current private tax rate: 🪙 {bal.tax.gold}% / 🌾 {bal.tax.food}% of estate income.</div>
    </Card>
    <Card><STit c="Private Wealth Balance Sheet" sub="Your private economy for the current season. This information is private to you and the Game Master."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"0.75rem"}}>
        <div style={{border:`1px solid ${RES.gold.color}66`,background:"#FFF8E8",padding:"0.75rem"}}>
          <div style={{fontFamily:"'Cinzel',serif",letterSpacing:"0.12em",color:RES.gold.color,fontWeight:900,marginBottom:"0.45rem"}}>🪙 GOLD ACCOUNT</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"0.35rem",fontSize:"1rem"}}>
            <span>Current private gold</span><b style={{color:RES.gold.color}}>{fmt(myW.gold)}T</b>
            <span>Gross estate income</span><b style={{color:T.gre}}>+{fmt(bal.gross.gold)}T</b>
            <span>Estate tax</span><b style={{color:T.rhi}}>-{fmt(bal.taxGold)}T</b>
            <span>Household upkeep</span><b style={{color:T.rhi}}>-{fmt(bal.houseGold)}T</b>
            <span style={{borderTop:`1px solid ${T.border}`,paddingTop:"0.35rem",fontWeight:900}}>Net gold / season</span><b style={{borderTop:`1px solid ${T.border}`,paddingTop:"0.35rem",color:bal.netGold>=0?T.gre:T.rhi}}>{bal.netGold>=0?"+":""}{fmt(bal.netGold)}T</b>
          </div>
        </div>
        <div style={{border:`1px solid ${RES.food.color}66`,background:"#F4FFF0",padding:"0.75rem"}}>
          <div style={{fontFamily:"'Cinzel',serif",letterSpacing:"0.12em",color:RES.food.color,fontWeight:900,marginBottom:"0.45rem"}}>🌾 FOOD ACCOUNT</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:"0.35rem",fontSize:"1rem"}}>
            <span>Current private food</span><b style={{color:RES.food.color}}>{fmt(myW.food)}M</b>
            <span>Gross estate income</span><b style={{color:T.gre}}>+{fmt(bal.gross.food)}M</b>
            <span>Estate tax</span><b style={{color:T.rhi}}>-{fmt(bal.taxFood)}M</b>
            <span>Household upkeep</span><b style={{color:T.rhi}}>-{fmt(bal.houseFood)}M</b>
            <span style={{borderTop:`1px solid ${T.border}`,paddingTop:"0.35rem",fontWeight:900}}>Net food / season</span><b style={{borderTop:`1px solid ${T.border}`,paddingTop:"0.35rem",color:bal.netFood>=0?T.gre:T.rhi}}>{bal.netFood>=0?"+":""}{fmt(bal.netFood)}M</b>
          </div>
        </div>
      </div>
      <STit c="Property Income Summary"/>
      {myAssets.length===0?<div style={{color:T.mut,fontStyle:"italic"}}>No properties generating private income yet.</div>:<div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.95rem",minWidth:"760px"}}><thead><tr style={{background:T.bg,fontFamily:"'Cinzel',serif",color:T.mut}}>{["Province","Property Type","Assets","Gross Gold","Gross Food"].map(h=><th key={h} style={{textAlign:"left",padding:"0.45rem",border:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead><tbody>{Object.entries(myAssets.reduce((acc,a)=>{const biz=getBiz(businesses,a.typeId);const k=`${a.regionId||"unknown"}__${biz.id}`;if(!acc[k])acc[k]={region:a.regionName||getRegion(regions,a.regionId).name,biz,count:0,gold:0,food:0};acc[k].count+=1;acc[k].gold+=Number(biz.incomeGold||0);acc[k].food+=effectiveFoodIncome(biz.incomeFood,D.game||DEF_GAME);return acc;},{})).map(([k,row])=><tr key={k}><td style={{padding:"0.45rem",border:`1px solid ${T.border}`,fontWeight:800}}>{row.region}</td><td style={{padding:"0.45rem",border:`1px solid ${T.border}`}}>{row.biz.emoji} {row.biz.name}</td><td style={{padding:"0.45rem",border:`1px solid ${T.border}`}}>{row.count}</td><td style={{padding:"0.45rem",border:`1px solid ${T.border}`,color:RES.gold.color}}>+{row.gold}T</td><td style={{padding:"0.45rem",border:`1px solid ${T.border}`,color:RES.food.color}}>+{row.food}M</td></tr>)}</tbody></table></div>}
    </Card>
    <Card><STit c="Invest in Estates and Businesses" sub="Each province has limited slots. Senators can compete to control profitable assets."/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"0.6rem",alignItems:"end"}}><div><Lbl c="Business Type"/><select value={buy.typeId} onChange={e=>setBuy(x=>({...x,typeId:e.target.value}))} style={{width:"100%",padding:"0.48rem",border:`1px solid ${T.border}`,background:T.card}}>{businesses.map(b=><option key={b.id} value={b.id}>{b.emoji} {b.name}</option>)}</select></div><div><Lbl c="Province"/><select value={buy.regionId} onChange={e=>setBuy(x=>({...x,regionId:e.target.value}))} style={{width:"100%",padding:"0.48rem",border:`1px solid ${T.border}`,background:T.card}}>{regions.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></div><Btn onClick={buyAsset}>Buy Property</Btn></div><div style={{marginTop:"0.75rem",padding:"0.65rem",background:T.bg,border:`1px solid ${T.border}`}}><b>{b.emoji} {b.name}</b> in <b>{reg.name}</b><br/>Cost: 🪙 {b.costGold}T / 🌾 {b.costFood}M · Gross Income: 🪙 +{b.incomeGold}T / 🌾 +{displayedFoodIncome(b.incomeFood,D.game||DEF_GAME)}M{winterFoodMark(b.incomeFood,D.game||DEF_GAME)} · Slots: {used}/{cap}</div></Card>
    <Card><STit c="Estate Slots by Province" sub="See which businesses are available and which senators already control slots in each province."/><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.9rem",minWidth:"900px"}}><thead><tr style={{background:T.bg,color:T.mut,fontFamily:"'Cinzel',serif"}}><th style={{textAlign:"left",padding:"0.45rem",border:`1px solid ${T.border}`}}>Province</th>{businesses.map(bz=><th key={bz.id} style={{textAlign:"left",padding:"0.45rem",border:`1px solid ${T.border}`}}>{bz.emoji} {bz.name}</th>)}</tr></thead><tbody>{regions.map(r=><tr key={r.id}><td style={{padding:"0.45rem",border:`1px solid ${T.border}`,fontWeight:900}}>{r.name}</td>{businesses.map(bz=>{const max=Number((bz.regionCaps||{})[r.id]||0);const owners=estateSlotDetails(assets,bz.id,r.id,D.players||[]);return <td key={bz.id} style={{padding:"0.45rem",border:`1px solid ${T.border}`}}>{max<=0?<span style={{color:T.mut}}>Unavailable</span>:<><b>{owners.length}/{max}</b> occupied<br/>{owners.length?<span>{owners.join(", ")}</span>:<span style={{color:T.gre}}>Available</span>}{owners.length<max&&<div style={{color:T.gre,fontSize:"0.82rem"}}>Open slots: {max-owners.length}</div>}</>}</td>})}</tr>)}</tbody></table></div></Card>
    <Card><STit c="My Properties by Region"/>{myAssets.length===0?<div style={{color:T.mut,fontStyle:"italic"}}>You own no properties yet.</div>:Object.entries(byRegion).map(([regionId,list])=>{const r=getRegion(regions,regionId);const sum=list.reduce((a,x)=>{const biz=getBiz(businesses,x.typeId);a.g+=Number(biz.incomeGold||0);a.f+=effectiveFoodIncome(biz.incomeFood,D.game||DEF_GAME);return a;},{g:0,f:0});return <Card key={regionId} style={{borderLeft:`4px solid ${T.gold}`}}><STit c={r.name} sub={`Capital: ${r.capital||"Unknown"} · Gross income: 🪙 +${sum.g}T / 🌾 +${sum.f}M`}/>{list.map(a=>{const biz=getBiz(businesses,a.typeId);return <div key={a.id} style={{display:"grid",gridTemplateColumns:"minmax(220px,1fr) auto",gap:"0.5rem",alignItems:"center",padding:"0.55rem",border:`1px solid ${T.border}`,marginBottom:"0.45rem",background:T.bg}}><div><b>{biz.emoji} {biz.name}</b><div style={{color:T.mut}}>Income: 🪙 +{biz.incomeGold}T / 🌾 +{displayedFoodIncome(biz.incomeFood,D.game||DEF_GAME)}M{winterFoodMark(biz.incomeFood,D.game||DEF_GAME)}</div><Row gap="0.35rem" wrap><select value={propTransfer[a.id]||""} onChange={e=>setPropTransfer(x=>({...x,[a.id]:e.target.value}))} style={{padding:"0.32rem",border:`1px solid ${T.border}`,background:T.card}}><option value="">Transfer property to...</option>{otherPlayers.map(p=><option key={p.id} value={p.id}>{p.latinName}</option>)}</select><Btn v="dark" sm onClick={()=>sendProperty(a)}>Transfer</Btn></Row></div><Btn v="red" sm onClick={()=>sellAsset(a)}>Sell</Btn></div>})}</Card>})}</Card>
    {upgrade&&<Card><STit c="Class Advancement" sub="A senator may rise socially by paying the required private wealth. This is recorded in personal history."/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.55rem",alignItems:"end"}}><Stat label="Current Class" value={`${getClassInfo(user.charClass).emoji} ${getClassInfo(user.charClass).label}`}/><Stat label="Next Class" value={`${getClassInfo(upgrade.to).emoji} ${getClassInfo(upgrade.to).label}`} color={getClassInfo(upgrade.to).color}/><Stat label="Cost" value={`🪙 ${upgrade.gold}T / 🌾 ${upgrade.food}M`} color={T.rhi}/><Btn onClick={changeClassByPayment}>Pay & Rise</Btn></div></Card>}
    <Card><STit c="Buy Food From the Roman Market" sub="The market is controlled by the Roman state. The Quaestors/GM can limit market stock and price. All purchases are publicly recorded."/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.55rem",alignItems:"end"}}><Stat label="🌾 Market Food Available" value={`${fmt((D.game||{}).foodMarketStock??0)}M`} color={RES.food.color}/><Stat label="🪙 Price" value={`${fmt((D.game||{}).foodMarketPrice??2)}T / 1M`} color={RES.gold.color}/><Inp label="Food to Buy" type="number" value={foodBuy} onChange={setFoodBuy}/><Btn onClick={buyFoodFromState}>Buy Food</Btn></div></Card>
    <Card><STit c="Transfers, Donations and Food Sales"/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"0.5rem",alignItems:"end"}}><div><Lbl c="Recipient"/><select value={transfer.to} onChange={e=>setTransfer({...transfer,to:e.target.value})} style={{width:"100%",padding:"0.45rem",border:`1px solid ${T.border}`}}><option value="">Choose senator...</option>{otherPlayers.map(p=><option key={p.id} value={p.id}>{p.latinName}</option>)}</select></div><div><Lbl c="Resource"/><select value={transfer.kind} onChange={e=>setTransfer({...transfer,kind:e.target.value})} style={{width:"100%",padding:"0.45rem",border:`1px solid ${T.border}`}}><option value="gold">🪙 Gold</option><option value="food">🌾 Food</option></select></div><Inp label="Amount" type="number" value={transfer.amount} onChange={v=>setTransfer({...transfer,amount:v})}/><Btn onClick={sendWealth}>Send</Btn></div><Row gap="0.5rem" wrap><Btn onClick={()=>donate("gold")}>Donate 🪙 Gold to State</Btn><Btn onClick={()=>donate("food")}>Donate 🌾 Food to State</Btn><Btn v="dark" onClick={sellFood}>Sell Personal Food</Btn></Row></Card>
    <Card><STit c="Public Wealth Ledger" sub="Transfers, property transfers and state market purchases are public record."/>{wealthlog.slice(-20).reverse().map(e=><div key={e.id||e.ts} style={{padding:"0.35rem 0",borderBottom:`1px solid ${T.border}`}}>{e.session&&<b>{e.session}: </b>}{e.text}</div>)}{wealthlog.length===0&&<div style={{color:T.mut,fontStyle:"italic"}}>No wealth transactions recorded yet.</div>}</Card>
  </div>;
}

function ABusinesses({D,onRefresh}){
  const [businesses,setBusinesses]=useState(DEF_BUSINESSES);
  const [assets,setAssets]=useState([]);
  const [wealth,setWealth]=useState({});
  const [donations,setDonations]=useState([]);
  const [game,setGame]=useState({...DEF_GAME,...(D.game||{})});
  const [msg,setMsg]=useState("");
  const players=D.players||[]; const regions=D.regions||DEF_REGIONS;
  useEffect(()=>{(async()=>{const loadedBiz=(await db.get("spqr_biz"));setBusinesses((loadedBiz&&loadedBiz.length)?loadedBiz:DEF_BUSINESSES);setAssets(normalizeAssetsList((await db.get("spqr_assets"))||[]));setWealth((await db.get("spqr_wealth"))||{});setDonations((await db.get("spqr_donations"))||[]);setGame({...DEF_GAME,...((await db.get("spqr_g"))||D.game||{})});})();},[D.game]);
  const saveGame=async(next=game)=>{await db.set("spqr_g",next);setGame(next);onRefresh&&onRefresh();};
  const addBiz=()=>setBusinesses(bs=>[...bs,{id:`business_${Date.now()}`,emoji:"🏺",name:"New Business",costGold:100,costFood:0,incomeGold:12,incomeFood:0,regionCaps:{}}]);
  const applyBalancedPreset=()=>{
    if(!confirm("Apply the balanced private economy preset? This changes business income/cost settings but does not delete existing properties."))return;
    setBusinesses(BALANCED_BUSINESSES.map(b=>({...b,regionCaps:{...(b.regionCaps||{})}})));
    setMsg("Balanced private economy preset loaded. Click Save Private Economy Rules to publish it.");
    setTimeout(()=>setMsg(""),4500);
  };
  const updBiz=(i,k,v)=>setBusinesses(bs=>bs.map((b,j)=>j===i?{...b,[k]:["costGold","costFood","incomeGold","incomeFood"].includes(k)?Number(v):v}:b));
  const updCap=(i,rid,v)=>setBusinesses(bs=>bs.map((b,j)=>j===i?{...b,regionCaps:{...(b.regionCaps||{}),[rid]:Number(v)||0}}:b));
  const save=async()=>{await db.set("spqr_biz",businesses);await saveGame(game);setMsg("Private wealth rules saved.");setTimeout(()=>setMsg(""),3000);};
  const setPlayerWealth=async(pid,k,v)=>{const w=wealthOf(wealth,pid);const next={...wealth,[pid]:{...w,[k]:Math.max(0,Number(v)||0)}};setWealth(next);await db.set("spqr_wealth",next);};
  const removeAsset=async(id)=>{if(!confirm("Remove this property from the senator?"))return;const next=assets.filter(a=>a.id!==id);setAssets(next);await db.set("spqr_assets",next);};
  const destroyAsset=async(asset)=>{const biz=getBiz(businesses,asset.typeId);const reason=prompt(`Reason for destroying ${biz.name} in ${asset.regionName||asset.regionId}?`,"Destroyed by war / Hannibal");if(reason===null)return;const next=assets.filter(a=>a.id!==asset.id);setAssets(next);await db.set("spqr_assets",next);await addHistory(asset.ownerId,"Property Destroyed",`${biz.name} in ${asset.regionName||asset.regionId} was destroyed. Reason: ${reason||"War damage"}.`,"estate_destroyed");setMsg("Property destroyed and recorded in senator history.");setTimeout(()=>setMsg(""),3000);};
  const donationTotal=(kind)=>donations.filter(d=>d.kind===kind).reduce((a,d)=>a+Number(d.amount||0),0);
  return <div>
    {msg&&<div style={{padding:"0.55rem 0.8rem",background:"#F4FFF0",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.7rem"}}>{msg}</div>}
    <Card><STit c="Private Economy Control" sub="Personal wealth is private from other players. This is the GM balance sheet for all senators."/><div className="spqr-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"0.5rem"}}><Stat label="Business Types" value={businesses.length}/><Stat label="Properties Owned" value={assets.length}/><Stat label="Gold Donated" value={`🪙 ${fmt(donationTotal("gold"))}T`} color={RES.gold.color}/><Stat label="Food Donated" value={`🌾 ${fmt(donationTotal("food"))}M`} color={RES.food.color}/></div><Row gap="0.5rem" wrap><Btn v="green" onClick={addBiz}>＋ Add Business Type</Btn><Btn v="dark" onClick={applyBalancedPreset}>⚖️ Load Balanced Preset</Btn><Btn onClick={save}>💾 Save Private Economy Rules</Btn></Row></Card>
    <Card><STit c="Taxes and State Food Market" sub="Quaestor actions can justify changing private estate taxes and the amount of state food available for sale."/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"0.6rem"}}><Inp label="🪙 Estate Gold Tax %" type="number" value={game.privateTaxGoldPct??10} onChange={v=>setGame({...game,privateTaxGoldPct:Number(v)||0})}/><Inp label="🌾 Estate Food Tax %" type="number" value={game.privateTaxFoodPct??5} onChange={v=>setGame({...game,privateTaxFoodPct:Number(v)||0})}/><Inp label="🌾 State Food Market Stock" type="number" value={game.foodMarketStock??0} onChange={v=>setGame({...game,foodMarketStock:Number(v)||0})}/><Inp label="🪙 Food Price (Gold per 1M)" type="number" value={game.foodMarketPrice??2} onChange={v=>setGame({...game,foodMarketPrice:Number(v)||0})}/></div><Row gap="0.5rem" wrap><Btn onClick={()=>saveGame(game)}>Save Market & Tax Rules</Btn></Row></Card>
    <Card><STit c="Senator Balance Sheet" sub="GM-only overview. Exact private wealth is hidden from other players. Edit wealth and household upkeep here."/><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.92rem",minWidth:"980px"}}><thead><tr style={{background:T.bg,color:T.mut,fontFamily:"'Cinzel',serif"}}>{["Senator","🪙 Gold","🌾 Food","Gross Estate","Tax","Household","Net / Season","Properties"].map(h=><th key={h} style={{textAlign:"left",padding:"0.45rem",border:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead><tbody>{players.map(p=>{const w=wealthOf(wealth,p.id);const bal=personalBalanceFor(p.id,p.role,assets,businesses,wealth,game);return <tr key={p.id}><td style={{padding:"0.45rem",border:`1px solid ${T.border}`,fontWeight:900}}>{p.latinName}</td><td style={{padding:"0.35rem",border:`1px solid ${T.border}`}}><input type="number" value={w.gold} onChange={e=>setPlayerWealth(p.id,"gold",e.target.value)} style={{width:"110px",padding:"0.28rem",color:RES.gold.color}}/></td><td style={{padding:"0.35rem",border:`1px solid ${T.border}`}}><input type="number" value={w.food} onChange={e=>setPlayerWealth(p.id,"food",e.target.value)} style={{width:"110px",padding:"0.28rem",color:RES.food.color}}/></td><td style={{padding:"0.45rem",border:`1px solid ${T.border}`,color:T.gre}}>+{bal.gross.gold}T / +{bal.gross.food}M</td><td style={{padding:"0.45rem",border:`1px solid ${T.border}`,color:T.rhi}}>-{bal.taxGold}T / -{bal.taxFood}M</td><td style={{padding:"0.35rem",border:`1px solid ${T.border}`}}><input title="Household Gold" type="number" value={w.householdGold} onChange={e=>setPlayerWealth(p.id,"householdGold",e.target.value)} style={{width:"72px",padding:"0.25rem"}}/> / <input title="Household Food" type="number" value={w.householdFood} onChange={e=>setPlayerWealth(p.id,"householdFood",e.target.value)} style={{width:"72px",padding:"0.25rem"}}/></td><td style={{padding:"0.45rem",border:`1px solid ${T.border}`,color:(bal.netGold+bal.netFood)>=0?T.gre:T.rhi}}>{bal.netGold>=0?"+":""}{bal.netGold}T / {bal.netFood>=0?"+":""}{bal.netFood}M</td><td style={{padding:"0.45rem",border:`1px solid ${T.border}`,textAlign:"center"}}>{assets.filter(a=>a.ownerId===p.id).length}</td></tr>})}</tbody></table></div></Card>
    <Card><STit c="Estate Slots Overview" sub="GM view of who owns each estate slot and what is still available for purchase."/><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.9rem",minWidth:"980px"}}><thead><tr style={{background:T.bg,color:T.mut,fontFamily:"\'Cinzel\',serif"}}><th style={{textAlign:"left",padding:"0.45rem",border:`1px solid ${T.border}`}}>Province</th>{businesses.map(bz=><th key={bz.id} style={{textAlign:"left",padding:"0.45rem",border:`1px solid ${T.border}`}}>{bz.emoji} {bz.name}</th>)}</tr></thead><tbody>{regions.map(r=><tr key={r.id}><td style={{padding:"0.45rem",border:`1px solid ${T.border}`,fontWeight:900}}>{r.name}</td>{businesses.map(bz=>{const max=Number((bz.regionCaps||{})[r.id]||0);const owners=estateSlotDetails(assets,bz.id,r.id,players);return <td key={bz.id} style={{padding:"0.45rem",border:`1px solid ${T.border}`}}>{max<=0?<span style={{color:T.mut}}>—</span>:<><b>{owners.length}/{max}</b><br/>{owners.length?owners.join(", "):<span style={{color:T.gre}}>Available</span>}{owners.length<max&&<div style={{color:T.gre,fontSize:"0.82rem"}}>Open: {max-owners.length}</div>}</>}</td>})}</tr>)}</tbody></table></div></Card>
    <Card><STit c="Business Types and Regional Limits"/>{businesses.map((b,i)=><Card key={b.id} style={{borderLeft:`4px solid ${T.gold}`}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"0.5rem"}}><Inp label="Emoji" value={b.emoji} onChange={v=>updBiz(i,"emoji",v)}/><Inp label="Name" value={b.name} onChange={v=>updBiz(i,"name",v)}/><Inp label="ID" value={b.id} onChange={v=>updBiz(i,"id",v)}/><Inp label="Cost Gold" type="number" value={b.costGold} onChange={v=>updBiz(i,"costGold",v)}/><Inp label="Cost Food" type="number" value={b.costFood} onChange={v=>updBiz(i,"costFood",v)}/><Inp label="Income Gold" type="number" value={b.incomeGold} onChange={v=>updBiz(i,"incomeGold",v)}/><Inp label="Income Food" type="number" value={b.incomeFood} onChange={v=>updBiz(i,"incomeFood",v)}/></div><STit c="Slots by Province"/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:"0.4rem"}}>{regions.map(r=><div key={r.id}><Lbl c={r.name}/><input type="number" value={(b.regionCaps||{})[r.id]||0} onChange={e=>updCap(i,r.id,e.target.value)} style={{width:"100%",padding:"0.35rem",border:`1px solid ${T.border}`}}/></div>)}</div></Card>)}</Card>
    <Card><STit c="All Properties"/>{assets.length===0?<div style={{color:T.mut,fontStyle:"italic"}}>No properties purchased yet.</div>:assets.map(a=>{const b=getBiz(businesses,a.typeId);return <div key={a.id} style={{display:"flex",justifyContent:"space-between",gap:"0.5rem",alignItems:"center",padding:"0.45rem",borderBottom:`1px solid ${T.border}`,flexWrap:"wrap"}}><span><b>{b.emoji} {b.name}</b> — {a.ownerName} — {a.regionName} · 🪙 +{b.incomeGold}T / 🌾 +{displayedFoodIncome(b.incomeFood,game||D.game||DEF_GAME)}M{winterFoodMark(b.incomeFood,game||D.game||DEF_GAME)}</span><Row gap="0.35rem" wrap><Btn v="red" sm onClick={()=>destroyAsset(a)}>Destroy / War Loss</Btn><Btn v="ghost" sm onClick={()=>removeAsset(a.id)}>Remove</Btn></Row></div>})}</Card>
    <Card><STit c="Donation Ledger"/>{donations.slice(-30).reverse().map(d=><div key={d.id} style={{padding:"0.35rem 0",borderBottom:`1px solid ${T.border}`}}>{d.kind==="gold"?"🪙":"🌾"} <b>{d.playerName}</b> donated {fmt(d.amount)} {d.kind} · {d.session}</div>)}{donations.length===0&&<div style={{color:T.mut,fontStyle:"italic"}}>No donations yet.</div>}</Card>
  </div>;
}

function PartiesPanel({user,D,onRefresh}){
  const [parties,setParties]=useState(D.parties||[]);
  const [form,setForm]=useState({name:"",emoji:"🏛️",color:"#A32020",platform:"",description:"",history:""});
  const [msg,setMsg]=useState("");
  useEffect(()=>{setParties(D.parties||[]);},[D.parties]);
  const players=D.players||[];
  const myParty=partyOf(parties,user.id);
  const invited=parties.filter(p=>(p.invites||[]).includes(user.id));
  const saveParties=async(next)=>{setParties(next);await db.set("spqr_parties",next);onRefresh&&onRefresh();};
  const patchMyParty=async(patch)=>{if(!myParty)return;await saveParties(parties.map(p=>p.id===myParty.id?{...p,...patch}:p));};
  const canEditMyParty=myParty&&(myParty.founderId===user.id||myParty.leaderId===user.id);
  const createParty=async()=>{
    if(myParty){setMsg("You are already in a political party.");return;}
    const name=form.name.trim();if(!name){setMsg("Party name required.");return;}
    const party={id:`party_${Date.now()}`,name,emoji:form.emoji||"🏛️",color:form.color||"#A32020",founderId:user.id,founderName:user.latinName,leaderId:user.id,leaderName:user.latinName,members:[user.id],invites:[],platform:form.platform||"",description:form.description||"",history:form.history||"",created:Date.now()};
    await saveParties([...parties,party]);
    await addHistory(user.id,"Founded Political Party",`${user.latinName} founded ${party.emoji} ${party.name}.`,`party`);
    setForm({name:"",emoji:"🏛️",color:"#A32020",platform:"",description:"",history:""});setMsg("Political party founded.");
  };
  const invite=async(pid)=>{if(!myParty||myParty.leaderId!==user.id)return;const next=parties.map(p=>p.id===myParty.id?{...p,invites:Array.from(new Set([...(p.invites||[]),pid]))}:p);await saveParties(next);const target=players.find(p=>p.id===pid);await pushN("Party Invitation",`${user.latinName} invited you to join ${myParty.name}.`,pid);setMsg(`Invitation sent to ${target?.latinName||"senator"}.`);};
  const chooseLeader=async(pid)=>{if(!myParty||myParty.founderId!==user.id)return;const target=players.find(p=>p.id===pid);if(!target)return;const next=parties.map(p=>p.id===myParty.id?{...p,leaderId:pid,leaderName:target.latinName}:p);await saveParties(next);await addHistory(pid,"Party Leadership",`${target.latinName} was appointed leader of ${myParty.name}.`,`party`);setMsg(`${target.latinName} is now party leader.`);};
  const accept=async(partyId)=>{if(myParty){setMsg("Leave your current party first.");return;}const next=parties.map(p=>p.id===partyId?{...p,members:Array.from(new Set([...(p.members||[]),user.id])),invites:(p.invites||[]).filter(id=>id!==user.id)}:p);await saveParties(next);const pt=next.find(p=>p.id===partyId);await addHistory(user.id,"Joined Political Party",`${user.latinName} joined ${pt?.emoji||"🏛️"} ${pt?.name||"a political party"}.`,`party`);setMsg("Party joined.");};
  const leave=async()=>{if(!myParty)return;if(!confirm(`Leave ${myParty.name}?`))return;let next=parties.map(p=>p.id===myParty.id?{...p,members:(p.members||[]).filter(id=>id!==user.id)}:p);if(myParty.leaderId===user.id){const remaining=(myParty.members||[]).filter(id=>id!==user.id);next=parties.map(p=>p.id===myParty.id?{...p,members:remaining,leaderId:remaining[0]||null,leaderName:players.find(x=>x.id===remaining[0])?.latinName||"Vacant"}:p);}next=next.filter(p=>(p.members||[]).length>0);await saveParties(next);await addHistory(user.id,"Left Political Party",`${user.latinName} left ${myParty.name}.`,`party`);setMsg("You left the party.");};
  return <div>
    {msg&&<Card style={{borderLeft:`3px solid ${T.gre}`}}><div style={{color:T.gre,fontFamily:"'Cinzel',serif"}}>{msg}</div></Card>}
    <Card><STit c="Political Parties" sub="Create blocs, invite senators and make political alignments visible in the Senate."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"0.6rem"}}>
        {parties.map(pt=><div key={pt.id} style={{border:`1px solid ${pt.color||T.border}`,borderLeft:`6px solid ${pt.color||T.blue}`,background:T.surf,padding:"0.75rem",borderRadius:10}}>
          <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:pt.color||T.blue,fontSize:"1.08rem"}}>{pt.emoji||"🏛️"} {pt.name}</div>
          <div style={{color:T.mut}}>Founder: {pt.founderName||pt.leaderName||"Unknown"}</div>
          <div style={{color:T.mut}}>Leader: {pt.leaderName||"Unknown"}</div>
          {pt.description&&<div style={{marginTop:"0.4rem",fontStyle:"italic",color:T.text,whiteSpace:"pre-wrap"}}>{pt.description}</div>}
          <div style={{marginTop:"0.4rem",whiteSpace:"pre-wrap"}}>{pt.platform||"No platform written."}</div>
          {pt.history&&<div style={{marginTop:"0.4rem",color:T.mut,whiteSpace:"pre-wrap"}}><b>History:</b> {pt.history}</div>}
          <div style={{marginTop:"0.45rem",color:T.mut}}>Members: {(pt.members||[]).map(id=>players.find(p=>p.id===id)?.latinName||"Unknown").join(", ")}</div>
        </div>)}
        {parties.length===0&&<div style={{color:T.mut,fontStyle:"italic"}}>No political parties have been founded yet.</div>}
      </div>
    </Card>
    {myParty?<Card style={{borderLeft:`7px solid ${myParty.color||T.blue}`}}><STit c="My Party"/><PartyBadge party={myParty}/><div style={{marginTop:"0.45rem",color:T.mut}}>Founder: {myParty.founderName||"Unknown"} · Leader: {myParty.leaderName||"Unknown"}</div><div style={{marginTop:"0.6rem"}}><Btn v="red" onClick={leave}>Leave Party</Btn></div>
      {canEditMyParty&&<div style={{marginTop:"0.8rem"}}><STit c="Party Identity — Leader / Founder Edit" sub="Party leaders and founders can edit the party public identity, platform, description and history."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.55rem"}}>
          <Inp label="Party Name" value={myParty.name||""} onChange={v=>patchMyParty({name:v})}/>
          <Inp label="Emoji" value={myParty.emoji||"🏛️"} onChange={v=>patchMyParty({emoji:v})}/>
          <Inp label="Color" value={myParty.color||"#A32020"} onChange={v=>patchMyParty({color:v})}/>
        </div>
        <Inp label="Short Description" value={myParty.description||""} onChange={v=>patchMyParty({description:v})} rows={2} placeholder="Short public description of the party."/>
        <Inp label="Platform / Program" value={myParty.platform||""} onChange={v=>patchMyParty({platform:v})} rows={4} placeholder="War policy, economy, plebeian rights, allies, Hannibal strategy..."/>
        <Inp label="Party History" value={myParty.history||""} onChange={v=>patchMyParty({history:v})} rows={4} placeholder="Origins, founders, traditions, scandals, victories, rivalries..."/>
      </div>}
      {myParty.founderId===user.id&&<div style={{marginTop:"0.8rem"}}><STit c="Founder Control — Choose Party Leader"/><div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>{(myParty.members||[]).map(id=>players.find(p=>p.id===id)).filter(Boolean).map(p=><Btn key={p.id} sm v={myParty.leaderId===p.id?"green":"dark"} onClick={()=>chooseLeader(p.id)}>{p.latinName}</Btn>)}</div></div>}
      {myParty.leaderId===user.id&&<div style={{marginTop:"0.8rem"}}><STit c="Invite Senators"/><div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>{players.filter(p=>p.id!==user.id&&!partyOf(parties,p.id)&&!(myParty.invites||[]).includes(p.id)).map(p=><Btn key={p.id} sm v="dark" onClick={()=>invite(p.id)}>Invite {p.latinName}</Btn>)}</div></div>}
    </Card>:
    <Card><STit c="Found a Political Party"/><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.55rem"}}><Inp label="Party Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))}/><Inp label="Emoji" value={form.emoji} onChange={v=>setForm(f=>({...f,emoji:v}))}/><Inp label="Color" value={form.color} onChange={v=>setForm(f=>({...f,color:v}))}/></div><Inp label="Short Description" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} rows={2}/><Inp label="Platform / Program" value={form.platform} onChange={v=>setForm(f=>({...f,platform:v}))} rows={4} placeholder="What does your party stand for? War policy, economy, plebeian rights, allies, Hannibal strategy..."/><Inp label="Party History" value={form.history} onChange={v=>setForm(f=>({...f,history:v}))} rows={4} placeholder="Origin story, founding families, political tradition..."/><Btn onClick={createParty}>Found Party</Btn></Card>}
    {invited.length>0&&<Card><STit c="Party Invitations"/>{invited.map(pt=><div key={pt.id} style={{display:"flex",justifyContent:"space-between",gap:"0.5rem",alignItems:"center",padding:"0.45rem",borderBottom:`1px solid ${T.border}`}}><PartyBadge party={pt}/><Btn sm onClick={()=>accept(pt.id)}>Accept</Btn></div>)}</Card>}
  </div>;
}



/* ══ COURTS / PRAETOR URBANUS ═══════════════════════════════════════════ */
const COURT_STATUSES=["Submitted","Accepted","Rejected","In Trial","Awaiting Ruling","Ruled","Escalated to Senate","Closed"];
const courtColor=status=>({Submitted:T.gold,Accepted:T.blue,Rejected:T.rhi,"In Trial":"#7C3AED","Awaiting Ruling":"#B7791F",Ruled:T.gre,"Escalated to Senate":T.red,Closed:T.mut}[status]||T.mut);
const caseTitle=(c)=>c?.title||`Case ${c?.id||""}`;

function CourtsPanel({user,D,onRefresh,isGM=false}){
  const players=D.players||[];
  const courts=Array.isArray(D.courts)?D.courts:[];
  const [form,setForm]=useState({title:"",accuserId:user?.id||"",accusedId:"",law:"",summary:"",evidence:"",request:""});
  const [filter,setFilter]=useState("all");
  const [edit,setEdit]=useState({});
  const isPraetor=user?.role==="praetor_1";
  const canAdmin=isGM||isPraetor;
  const pname=id=>players.find(p=>p.id===id)?.latinName||"Unknown";
  const saveCourts=async(next)=>{await db.set("spqr_courts",next);onRefresh&&onRefresh();};
  const submitCase=async()=>{
    if(!form.title.trim()||!form.accusedId||!form.summary.trim())return alert("Case title, accused senator and summary are required.");
    const me=players.find(p=>p.id===form.accuserId)||user;
    const acc=players.find(p=>p.id===form.accusedId);
    const nc={id:Date.now().toString()+Math.random().toString(36).slice(2),title:form.title.trim(),accuserId:form.accuserId,accuserName:me?.latinName||"Unknown",accusedId:form.accusedId,accusedName:acc?.latinName||"Unknown",law:form.law.trim(),summary:form.summary.trim(),evidence:form.evidence.trim(),request:form.request.trim(),status:"Submitted",praetorId:null,praetorName:null,threadLink:"",notes:"",ruling:"",punishment:"",created:Date.now(),updated:Date.now(),session:sLab(D.game||DEF_GAME)};
    const next=[...courts,nc];
    await saveCourts(next);
    await pushN("⚖️ Court Case Submitted",`${nc.accuserName} has submitted a case against ${nc.accusedName}: ${nc.title}`);
    await addHistory(form.accuserId,"Court Case Submitted",`Submitted ${nc.title} against ${nc.accusedName}.`,"court");
    await addHistory(form.accusedId,"Accused in Court",`${nc.accuserName} submitted ${nc.title}.`,"court");
    setForm({title:"",accuserId:user?.id||"",accusedId:"",law:"",summary:"",evidence:"",request:""});
  };
  const patchCase=async(id,patch,notice)=>{
    const next=courts.map(c=>c.id===id?{...c,...patch,updated:Date.now()}:c);
    await saveCourts(next);
    const c=next.find(x=>x.id===id);
    if(notice&&c)await pushN("⚖️ Court Case Updated",`${caseTitle(c)} is now ${c.status}.`);
  };
  const removeCase=async(id)=>{if(!confirm("Delete this court case?"))return;await saveCourts(courts.filter(c=>c.id!==id));};
  const assignPraetor=async(id)=>{await patchCase(id,{praetorId:user?.id||"gm",praetorName:user?.latinName||"Game Master"},false);};
  const filtered=courts.filter(c=>filter==="all"||c.status===filter).sort((a,b)=>(b.updated||0)-(a.updated||0));
  const rowStyle={padding:"0.45rem",border:`1px solid ${T.border}`,verticalAlign:"top"};
  return <div>
    <Card style={{borderLeft:`6px solid ${POS.praetor_1.color}`}}>
      <STit c="⚖️ Courts of Rome" sub="The app records official legal cases. The actual trial can happen in Discord threads; paste the thread link into the case record."/>
      <div style={{color:T.mut,lineHeight:1.55}}>The <b>Praetor Urbanus</b> may accept cases, create the Discord court thread, add the thread link, manage status and issue rulings. Submitted cases may be rewritten or withdrawn by the accuser before approval. The Game Master can control all cases.</div>
    </Card>
    <Card><STit c="Submit an Accusation / Legal Petition" sub="Senators may submit cases for review by the Praetor Urbanus."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"0.55rem"}}>
        <Inp label="Case Title" value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. Accusation of illegal treasury use"/>
        <div><Lbl c="Accuser"/><select value={form.accuserId} onChange={e=>setForm(f=>({...f,accuserId:e.target.value}))} disabled={!isGM} style={{width:"100%",padding:"0.45rem",background:T.card,border:`1px solid ${T.border}`}}>{players.map(p=><option key={p.id} value={p.id}>{p.latinName}</option>)}</select></div>
        <div><Lbl c="Accused"/><select value={form.accusedId} onChange={e=>setForm(f=>({...f,accusedId:e.target.value}))} style={{width:"100%",padding:"0.45rem",background:T.card,border:`1px solid ${T.border}`}}><option value="">Select senator</option>{players.filter(p=>p.id!==form.accuserId).map(p=><option key={p.id} value={p.id}>{p.latinName}</option>)}</select></div>
      </div>
      <Inp label="Law Allegedly Broken" value={form.law} onChange={v=>setForm(f=>({...f,law:v}))} placeholder="Law, decree or principle allegedly violated"/>
      <Inp label="Summary of Accusation" value={form.summary} onChange={v=>setForm(f=>({...f,summary:v}))} rows={3}/>
      <Inp label="Evidence / Witnesses" value={form.evidence} onChange={v=>setForm(f=>({...f,evidence:v}))} rows={2}/>
      <Inp label="Requested Ruling / Punishment" value={form.request} onChange={v=>setForm(f=>({...f,request:v}))} rows={2}/>
      <Btn onClick={submitCase}>Submit Case to Court</Btn>
    </Card>
    <Card><STit c="Court Case Registry" sub="Official legal archive of the Republic — table view for faster reading."/>
      <div style={{display:"flex",gap:"0.5rem",alignItems:"end",flexWrap:"wrap",marginBottom:"0.7rem"}}><div><Lbl c="Filter Status"/><select value={filter} onChange={e=>setFilter(e.target.value)} style={{padding:"0.45rem",background:T.card,border:`1px solid ${T.border}`}}><option value="all">All cases</option>{COURT_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div></div>
      {filtered.length===0&&<div style={{color:T.mut,fontStyle:"italic"}}>No court cases yet.</div>}
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",minWidth:1040,fontSize:"0.9rem"}}>
        <thead><tr style={{background:T.bg,color:T.gold,fontFamily:"'Cinzel',serif",textTransform:"uppercase",letterSpacing:"0.06em"}}>{['Status','Case','Accuser','Accused','Praetor','Session','Actions'].map(h=><th key={h} style={{textAlign:"left",padding:"0.5rem",border:`1px solid ${T.border}`}}>{h}</th>)}</tr></thead>
        <tbody>{filtered.map(c=>{const isEditing=!!edit[c.id];const local=edit[c.id]||c;const canEditOwnSubmitted=!isGM&&!isPraetor&&c.status==="Submitted"&&c.accuserId===user?.id;return <React.Fragment key={c.id}>
          <tr style={{background:T.surf}}>
            <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top"}}><Badge c={c.status} color={courtColor(c.status)}/></td>
            <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top",minWidth:300}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.text}}>{caseTitle(c)}</div><div style={{color:T.mut,fontSize:"0.86rem",lineHeight:1.4,marginTop:"0.25rem"}}>{String(c.summary||"").slice(0,180)}{String(c.summary||"").length>180?"…":""}</div>{c.threadLink&&<a href={c.threadLink} target="_blank" rel="noreferrer" style={{color:T.blue,fontSize:"0.85rem"}}>Open Discord court thread</a>}</td>
            <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top"}}>{c.accuserName||pname(c.accuserId)}</td>
            <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top"}}>{c.accusedName||pname(c.accusedId)}</td>
            <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top"}}>{c.praetorName||"Not assigned"}</td>
            <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top",color:T.mut}}>{c.session||""}</td>
            <td style={{padding:"0.5rem",border:`1px solid ${T.border}`,verticalAlign:"top"}}><Row gap="0.35rem" wrap>{(canAdmin||canEditOwnSubmitted)&&!isEditing&&<Btn sm onClick={()=>setEdit(e=>({...e,[c.id]:c}))}>{canEditOwnSubmitted?"Edit / Rewrite":"Manage"}</Btn>}{isPraetor&&!c.praetorId&&<Btn sm v="dark" onClick={()=>assignPraetor(c.id)}>Assign Self</Btn>}<Btn sm v="ghost" onClick={()=>setEdit(e=>({...e,[`view_${c.id}`]:!e[`view_${c.id}`]}))}>{edit[`view_${c.id}`]?"Hide":"View"}</Btn></Row></td>
          </tr>
          {(edit[`view_${c.id}`]||isEditing)&&<tr><td colSpan={7} style={{padding:"0.75rem",border:`1px solid ${T.border}`,background:T.card}}>
            {isEditing&&(canAdmin||canEditOwnSubmitted)?<div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"0.55rem"}}>
                <Inp label="Case Title" value={local.title||""} onChange={v=>setEdit(e=>({...e,[c.id]:{...local,title:v}}))}/>
                <div><Lbl c="Status"/><select value={local.status||"Submitted"} onChange={e=>setEdit(x=>({...x,[c.id]:{...local,status:e.target.value}}))} disabled={!canAdmin} style={{width:"100%",padding:"0.45rem",background:T.card,border:`1px solid ${T.border}`}}>{COURT_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                <Inp label="Discord Thread Link" value={local.threadLink||""} onChange={v=>setEdit(e=>({...e,[c.id]:{...local,threadLink:v}}))}/>
              </div>
              <Inp label="Law Broken" value={local.law||""} onChange={v=>setEdit(e=>({...e,[c.id]:{...local,law:v}}))}/>
              <Inp label="Summary" value={local.summary||""} onChange={v=>setEdit(e=>({...e,[c.id]:{...local,summary:v}}))} rows={3}/>
              <Inp label="Evidence / Witnesses" value={local.evidence||""} onChange={v=>setEdit(e=>({...e,[c.id]:{...local,evidence:v}}))} rows={2}/>
              <Inp label="Praetor Notes" value={local.notes||""} onChange={v=>setEdit(e=>({...e,[c.id]:{...local,notes:v}}))} rows={2}/>
              <Inp label="Final Ruling" value={local.ruling||""} onChange={v=>setEdit(e=>({...e,[c.id]:{...local,ruling:v}}))} rows={3}/>
              <Inp label="Punishment / Consequence" value={local.punishment||""} onChange={v=>setEdit(e=>({...e,[c.id]:{...local,punishment:v}}))} rows={2}/>
              <Row gap="0.45rem" wrap><Btn onClick={async()=>{const patch=(canAdmin?local:{...c,title:local.title,law:local.law,summary:local.summary,evidence:local.evidence,request:local.request,updated:Date.now()});await patchCase(c.id,patch,true);setEdit(e=>{const n={...e};delete n[c.id];return n;});}}>Save Case</Btn><Btn v="ghost" onClick={()=>setEdit(e=>{const n={...e};delete n[c.id];return n;})}>Cancel</Btn>{canEditOwnSubmitted&&<Btn v="crimson" onClick={async()=>{if(confirm("Withdraw this submitted case before review?")){await removeCase(c.id);}}}>Withdraw Case</Btn>}{isGM&&<Btn v="red" onClick={()=>removeCase(c.id)}>Delete</Btn>}</Row>
            </div>:<div style={{lineHeight:1.55}}>{c.law&&<div><b>Law:</b> {c.law}</div>}<div><b>Accusation:</b> {c.summary}</div>{c.evidence&&<div><b>Evidence:</b> {c.evidence}</div>}{c.request&&<div><b>Requested ruling:</b> {c.request}</div>}{c.notes&&<div><b>Praetor notes:</b> {c.notes}</div>}{c.ruling&&<div style={{marginTop:"0.35rem",padding:"0.45rem",background:"#F0FFF4",border:`1px solid ${T.gre}`}}><b>Ruling:</b> {c.ruling}</div>}{c.punishment&&<div style={{marginTop:"0.35rem",padding:"0.45rem",background:"#FFF1F1",border:`1px solid ${T.rhi}`}}><b>Punishment / consequence:</b> {c.punishment}</div>}</div>}
          </td></tr>}
        </React.Fragment>})}</tbody>
      </table></div>
    </Card>
  </div>;
}



function ReputationPanel({user,D,onRefresh}){
  const [rep,setRep]=useState(D.reputation||{});
  const [wealth,setWealth]=useState(D.wealth||{});
  const [rules,setRules]=useState(D.repRules||DEF_REP_RULES);
  const [msg,setMsg]=useState("");
  const [target,setTarget]=useState("");
  const [slanderId,setSlanderId]=useState("minor");
  const [accusation,setAccusation]=useState("");
  const [method,setMethod]=useState("Forum gossip and client networks");
  const [evidence,setEvidence]=useState("none");
  const [anon,setAnon]=useState(true);
  const meRep=repOf(rep,user);
  const w=wealthOf(wealth,user.id);
  const players=(D.players||[]).filter(p=>p.id!==user.id);
  const activeScandals=activeScandalsFor(rep,user.id);
  const saveRep=async(next)=>{setRep(next);await db.set("spqr_reputation",next);onRefresh&&onRefresh();};
  const saveWealthLocal=async(next)=>{setWealth(next);await db.set("spqr_wealth",next);onRefresh&&onRefresh();};
  const boost=async(action)=>{
    const cur=wealthOf(wealth,user.id);
    if(cur.gold<Number(action.costGold||0)||cur.food<Number(action.costFood||0)){setMsg("Insufficient private resources for this reputation action.");return;}
    const nextWealth={...wealth,[user.id]:{...cur,gold:cur.gold-Number(action.costGold||0),food:cur.food-Number(action.costFood||0)}};
    const nextRep={...rep,[user.id]:{...meRep,score:clampRep(meRep.score+Number(action.gain||0))}};
    await saveWealthLocal(nextWealth);await saveRep(nextRep);
    const text=`${user.latinName} spent ${action.costGold||0}T/${action.costFood||0}M on ${action.name} and gained +${action.gain} reputation.`;
    await addRepLog({type:"boost",playerId:user.id,playerName:user.latinName,session:sLab(D.game||DEF_GAME),text});
    await addHistory(user.id,"Reputation Increased",text,"reputation");
    setMsg("Reputation increased and recorded.");setTimeout(()=>setMsg(""),3000);
  };
  const doSlander=async()=>{
    const act=(rules.slanderActions||DEF_REP_RULES.slanderActions).find(a=>a.id===slanderId)||DEF_REP_RULES.slanderActions[0];
    const victim=(D.players||[]).find(p=>p.id===target);
    if(!victim){setMsg("Choose a target senator.");return;}
    if(!accusation.trim()){setMsg("Write the public rumour to spread.");return;}
    const cur=wealthOf(wealth,user.id);
    if(cur.gold<Number(act.costGold||0)){setMsg("Insufficient private gold for this slander campaign.");return;}
    const nextWealth={...wealth,[user.id]:{...cur,gold:cur.gold-Number(act.costGold||0)}};
    const victimRep=repOf(rep,victim);
    const scandal={
      id:Date.now().toString()+"_sl",active:true,text:accusation.trim(),
      severity:Number(act.impact||5),sourceId:anon?null:user.id,sourceName:anon?"Anonymous":user.latinName,
      method,evidence,ts:Date.now(),type:act.name||"Slander Campaign"
    };
    const nextRep={...rep,[victim.id]:{...victimRep,score:clampRep(victimRep.score-Number(act.impact||5)),scandals:[...(victimRep.scandals||[]),scandal]}};
    const text=`SLANDER SPREADS: ${victim.latinName} has been publicly marked by rumour: "${accusation.trim()}". Reputation -${act.impact}.`;
    await saveWealthLocal(nextWealth);
    await saveRep(nextRep);
    await addRepLog({type:"slander",outcome:"success",playerId:user.id,playerName:user.latinName,targetId:victim.id,targetName:victim.latinName,session:sLab(D.game||DEF_GAME),text,method,evidence,anonymous:anon,ts:Date.now()});
    await addHistory(user.id,"Slander Campaign Launched",`${user.latinName} launched a slander campaign against ${victim.latinName}: "${accusation.trim()}".`,"reputation");
    await addHistory(victim.id,"Slandered",text,"reputation");
    await pushN("Slander Campaign Started",`Your rumour against ${victim.latinName} has begun to spread.`,user.id);
    await pushN("You Have Been Slandered",`${victim.latinName}, a rumour has begun to circulate against you: "${accusation.trim()}"`,victim.id);
    await pushN("Rumour in the Forum",text,"all");
    alert("Successful slander: the rumour has started to spread.");
    setAccusation("");
    setMsg("Successful slander: the rumour has started to spread.");
    onRefresh&&onRefresh();
    setTimeout(()=>setMsg(""),6000);
  };
  const counter=async(scandal,act)=>{
    const cur=wealthOf(wealth,user.id);
    if(cur.gold<Number(act.costGold||0)){setMsg("Insufficient private gold for this counter-campaign.");return;}
    const remove=Number(act.remove||5);
    const updated=(meRep.scandals||[]).map(sc=>sc.id===scandal.id?{...sc,severity:Math.max(0,Number(sc.severity||0)-remove),active:(Number(sc.severity||0)-remove)>0}:sc);
    const scoreGain=Math.min(remove,Number(scandal.severity||remove));
    const nextRep={...rep,[user.id]:{...meRep,score:clampRep(meRep.score+scoreGain),scandals:updated}};
    const nextWealth={...wealth,[user.id]:{...cur,gold:cur.gold-Number(act.costGold||0)}};
    await saveWealthLocal(nextWealth);await saveRep(nextRep);
    const text=`${user.latinName} spent ${act.costGold}T on ${act.name} against scandal "${scandal.text}".`;
    await addRepLog({type:"counter",playerId:user.id,playerName:user.latinName,session:sLab(D.game||DEF_GAME),text});
    await addHistory(user.id,"Counter-Campaign",text,"reputation");
    setMsg("Counter-campaign applied.");setTimeout(()=>setMsg(""),3000);
  };
  return <div>
    <Card style={{borderLeft:`5px solid ${repColor(meRep.score)}`}}><STit c="Personal Reputation" sub="Reputation influences elections because senators can see scandals and use them in debate."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.55rem"}}><Stat label="Reputation" value={`${meRep.score}/100`} color={repColor(meRep.score)}/><Stat label="Active Scandals" value={activeScandals.length} color={activeScandals.length?T.rhi:T.gre}/><Stat label="Private Gold" value={`${fmt(w.gold)}T`} color={RES.gold.color}/></div>{msg&&<div style={{marginTop:"0.7rem",padding:"0.55rem",background:T.bg,border:`1px solid ${T.border}`}}>{msg}</div>}
    </Card>
    <Card><STit c="Increase Your Reputation" sub="Spend private wealth on public actions that improve your name."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:"0.55rem"}}>{(rules.boostActions||DEF_REP_RULES.boostActions).map(a=><div key={a.id} style={{background:T.surf,border:`1px solid ${T.border}`,padding:"0.7rem"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.ghi}}>{a.emoji} {a.name}</div><div style={{color:T.mut,fontSize:"0.88rem"}}>{a.desc}</div><div style={{margin:"0.35rem 0",fontWeight:800}}>Cost: {a.costGold||0}T / {a.costFood||0}M · Gain +{a.gain}</div><Btn sm onClick={()=>boost(a)}>Use Action</Btn></div>)}</div>
    </Card>
    <Card><STit c="Slander a Rival" sub="Spend private gold to lower another senator's reputation. The rumour becomes public if launched."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"0.6rem"}}><div><Lbl c="Target Senator"/><select value={target} onChange={e=>setTarget(e.target.value)} style={{width:"100%",padding:"0.5rem",border:`1px solid ${T.border}`}}><option value="">Choose target...</option>{players.map(p=><option key={p.id} value={p.id}>{p.latinName} · Rep {repOf(rep,p).score}</option>)}</select></div><div><Lbl c="Slander Type"/><select value={slanderId} onChange={e=>setSlanderId(e.target.value)} style={{width:"100%",padding:"0.5rem",border:`1px solid ${T.border}`}}>{(rules.slanderActions||DEF_REP_RULES.slanderActions).map(a=><option key={a.id} value={a.id}>{a.emoji} {a.name} — {a.costGold}T</option>)}</select></div></div>
      <Inp label="Public Rumour to Spread" value={accusation} onChange={setAccusation} rows={3} placeholder="Write exactly what you want people to hear, e.g. Gaius is hoarding grain while soldiers starve..."/>
      <Inp label="Method" value={method} onChange={setMethod} placeholder="Forum gossip, paid clients, anonymous pamphlets..."/>
      <Inp label="Evidence" value={evidence} onChange={setEvidence} placeholder="none / witness names / documents / public claim"/>
      <label style={{display:"flex",gap:"0.4rem",alignItems:"center",marginBottom:"0.6rem"}}><input type="checkbox" checked={anon} onChange={e=>setAnon(e.target.checked)}/> Attempt anonymously</label><div style={{fontSize:"0.85rem",color:T.mut,marginBottom:"0.5rem"}}>The text above is the public rumour/scandal that will appear publicly once the campaign is launched.</div><Btn v="crimson" onClick={doSlander}>Launch Slander Campaign</Btn>
    </Card>
    <Card><STit c="Defend Against Scandals" sub="Spend gold on counter-campaigns to reduce or remove public scandal markers."/>
      {activeScandals.length===0?<div style={{color:T.mut,fontStyle:"italic"}}>No active scandals.</div>:activeScandals.map(sc=><div key={sc.id} style={{background:"#FFF1F1",border:`1px solid ${T.rhi}`,padding:"0.65rem",marginBottom:"0.5rem"}}><b>⚠️ {sc.text}</b><div style={{color:T.mut}}>Severity: {sc.severity} · Source: {sc.sourceName||"Unknown / Anonymous"}</div><Row gap="0.4rem" wrap>{(rules.counterActions||DEF_REP_RULES.counterActions).map(a=><Btn key={a.id} sm v="dark" onClick={()=>counter(sc,a)}>{a.emoji} {a.name} ({a.costGold}T)</Btn>)}</Row></div>)}
    </Card>
    <Card><STit c="Public Reputation Marks" sub="Visible scandals and reputation pressures across the Senate."/>
      {(D.players||[]).map(p=>{const pr=repOf(rep,p);const sc=activeScandalsFor(rep,p.id);return sc.length?<div key={p.id} style={{borderLeft:`4px solid ${repColor(pr.score)}`,background:T.surf,padding:"0.55rem",marginBottom:"0.4rem"}}><b>{p.latinName}</b> — Reputation {pr.score}/100{sc.map(x=><div key={x.id} style={{color:T.rhi}}>⚠️ {x.text} <span style={{color:T.mut}}>(severity {x.severity})</span></div>)}</div>:null})}
    </Card>
  </div>;
}

function AReputation({D,onRefresh}){
  const [rep,setRep]=useState(D.reputation||{});
  const [rules,setRules]=useState(D.repRules||DEF_REP_RULES);
  const [log,setLog]=useState(D.replog||[]);
  useEffect(()=>{setRep(D.reputation||{});setRules(D.repRules||DEF_REP_RULES);setLog(D.replog||[]);},[D.reputation,D.repRules,D.replog]);
  const saveRules=async()=>{await db.set("spqr_rep_rules",rules);onRefresh&&onRefresh();};
  const saveRep=async(next)=>{setRep(next);await db.set("spqr_reputation",next);onRefresh&&onRefresh();};
  const updateAction=(group,i,k,v)=>{setRules(r=>({...r,[group]:(r[group]||[]).map((a,idx)=>idx===i?{...a,[k]:["costGold","costFood","gain","impact","remove"].includes(k)?Number(v):v}:a)}));};
  const closeScandal=async(pid,sid)=>{const p=(D.players||[]).find(x=>x.id===pid);const pr=repOf(rep,p);const next={...rep,[pid]:{...pr,scandals:(pr.scandals||[]).map(s=>s.id===sid?{...s,active:false}:s)}};await saveRep(next);};
  return <div>
    <Card><STit c="Reputation Control" sub="GM can edit scores, prices, reputation impact and active scandal marks. All slanders launch successfully."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"0.55rem"}}>{(D.players||[]).map(p=>{const pr=repOf(rep,p);return <div key={p.id} style={{background:T.surf,border:`1px solid ${T.border}`,borderLeft:`5px solid ${repColor(pr.score)}`,padding:"0.65rem"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900}}>{p.latinName}</div><Lbl c="Reputation Score"/><input type="number" value={pr.score} onChange={e=>saveRep({...rep,[p.id]:{...pr,score:clampRep(e.target.value)}})} style={{width:"100%",padding:"0.4rem",border:`1px solid ${T.border}`}}/>{activeScandalsFor(rep,p.id).map(sc=><div key={sc.id} style={{marginTop:"0.4rem",background:"#FFF1F1",border:`1px solid ${T.rhi}`,padding:"0.35rem"}}>⚠️ {sc.text}<br/><small>Severity {sc.severity}</small><br/><Btn sm v="ghost" onClick={()=>closeScandal(p.id,sc.id)}>Close Scandal</Btn></div>)}</div>})}</div>
    </Card>
    <Card><STit c="Reputation Economy Rules" sub="Edit costs and mechanical effects for reputation actions."/>
      {[["boostActions","Improve Reputation"],["slanderActions","Slander Actions"],["counterActions","Counter-Campaigns"]].map(([group,title])=><div key={group}><STit c={title}/>{(rules[group]||[]).map((a,i)=><div key={a.id} style={{background:T.surf,border:`1px solid ${T.border}`,padding:"0.55rem",marginBottom:"0.45rem"}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"0.4rem"}}>{["emoji","name","costGold","costFood","gain","impact","remove"].filter(k=>a[k]!==undefined).map(k=><div key={k}><Lbl c={k}/><input value={a[k]} onChange={e=>updateAction(group,i,k,e.target.value)} style={{width:"100%",padding:"0.35rem",border:`1px solid ${T.border}`}}/></div>)}</div><Inp label="Description" value={a.desc||""} onChange={v=>updateAction(group,i,"desc",v)}/></div>)}</div>)}<Btn onClick={saveRules}>Save Reputation Rules</Btn>
    </Card>
    <Card><STit c="Reputation Log"/>{log.slice().reverse().slice(0,80).map(e=><div key={e.id||e.ts} style={{borderBottom:`1px solid ${T.border}`,padding:"0.4rem 0"}}><b>{e.type}</b> — {e.text}<div style={{fontSize:"0.75rem",color:T.mut}}>{e.session||""} · {new Date(e.ts||Date.now()).toLocaleString()}</div></div>)}</Card>
  </div>;
}


function ForumPanel({D}){
  const [kind,setKind]=useState("all");
  const [q,setQ]=useState("");
  const repEvents=(D.replog||[]).map(e=>({
    id:e.id||e.ts||Math.random(),ts:e.ts||Date.now(),kind:e.type||"reputation",
    title:e.type==="slander"?"Rumour / Slander Campaign":e.type==="boost"?"Reputation Action":e.type==="counter"?"Counter-Campaign":"Reputation Event",
    text:e.text||"",session:e.session||"",color:e.type==="slander"?T.rhi:e.type==="boost"?T.gre:T.blue
  }));
  const wealthEvents=(D.wealthlog||[]).map(e=>({
    id:e.id||e.ts||Math.random(),ts:e.ts||Date.now(),kind:e.type||"wealth",
    title:e.type==="donation"?"Donation to the Republic":e.type==="market"?"State Food Market":e.type==="transfer"?"Private Transfer":e.type==="property"?"Property Transfer":"Economic Event",
    text:e.text||"",session:e.session||"",color:T.gold
  }));
  const electionEvents=(D.elections||[]).flatMap(el=>{
    const arr=[];
    if(el.status)arr.push({id:(el.id||Math.random())+"_status",ts:el.updatedAt||el.ts||0,kind:"election",title:`Election: ${POS[el.office]?.title||el.office||"Magistracy"}`,text:`Status: ${el.status}${el.winnerName?` · Winner: ${el.winnerName}`:""}`,session:el.session||"",color:T.blue});
    (el.candidates||[]).forEach(c=>arr.push({id:(el.id||"")+"_cand_"+(c.id||c.playerId||Math.random()),ts:c.ts||el.ts||0,kind:"election",title:"Election Candidacy",text:`${c.name||c.playerName||"A senator"} stood for ${POS[el.office]?.title||el.office||"office"}${c.speech?`: ${c.speech}`:""}`,session:el.session||"",color:T.blue}));
    return arr;
  });
  const motionEvents=(D.motions||[]).filter(m=>["passed","failed","rejected","vetoed"].includes(m.status)).map(m=>({
    id:m.id,ts:m.closedAt||m.ts||0,kind:"motion",title:`Motion ${String(m.status||"").toUpperCase()}`,text:`${m.title||"Untitled motion"} — proposed by ${m.proposerName||"Unknown"}`,session:m.session||"",color:m.status==="passed"?T.gre:m.status==="vetoed"?T.blue:T.rhi
  }));
  const events=[...repEvents,...wealthEvents,...electionEvents,...motionEvents].sort((a,b)=>(b.ts||0)-(a.ts||0));
  const kinds=["all","slander","boost","counter","wealth","election","motion"];
  const filtered=events.filter(e=>{
    const okKind=kind==="all"||e.kind===kind||(kind==="slander"&&e.title.toLowerCase().includes("slander"));
    const hay=`${e.title} ${e.text} ${e.session}`.toLowerCase();
    return okKind && (!q.trim()||hay.includes(q.trim().toLowerCase()));
  });
  return <Card><STit c="Forum Registry" sub="Public record of major political, economic and reputation events."/>
    <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",alignItems:"end",marginBottom:"0.75rem"}}>
      <div><Lbl c="Filter"/><select value={kind} onChange={e=>setKind(e.target.value)} style={{padding:"0.45rem",background:T.card,border:`1px solid ${T.border}`}}>{kinds.map(k=><option key={k} value={k}>{k==="all"?"All Events":k.charAt(0).toUpperCase()+k.slice(1)}</option>)}</select></div>
      <div style={{minWidth:260,flex:1}}><Lbl c="Search"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search senator, motion, rumour, donation..." style={{width:"100%",padding:"0.45rem",background:T.card,border:`1px solid ${T.border}`}}/></div>
      <Badge c={`${filtered.length} shown`} color={T.gold}/>
    </div>
    {filtered.length===0?<div style={{color:T.mut,fontStyle:"italic"}}>No public forum events match this filter.</div>:filtered.slice(0,200).map(e=><div key={e.id} style={{borderLeft:`5px solid ${e.color}`,background:T.surf,border:`1px solid ${T.border}`,padding:"0.65rem",marginBottom:"0.55rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:"0.5rem",flexWrap:"wrap"}}><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:e.color,letterSpacing:"0.05em"}}>{e.title}</div><Badge c={e.kind} color={e.color}/></div>
      <div style={{lineHeight:1.45}}>{e.text}</div>
      <div style={{fontSize:"0.78rem",color:T.mut,marginTop:"0.25rem"}}>{e.session||""}{e.ts?` · ${new Date(e.ts).toLocaleString()}`:""}</div>
    </div>)}
  </Card>;
}

/* ══ PLAYER APP ═══════════════════════════════════════════════════════════ */
function PlayerApp({user:initUser,onLogout}){
  const [tab,setTab]=useState("senate");
  const [group,setGroup]=useState("gov");
  const [user,setUser]=useState(initUser);
  const [D,setD]=useState({players:[],game:DEF_GAME,legions:DEF_LEGIONS,regions:DEF_REGIONS,motions:[],orders:[],deadline:null,cfg:{},laws:LAWS,econ:[],election:null,elections:[],cavalry:DEF_CAVALRY,fleets:DEF_FLEETS,businesses:DEF_BUSINESSES,assets:[],wealth:{},donations:[],history:[],parties:[],wealthlog:[],cemetery:[],forceTypes:FORCE_TYPES,courts:[],reputation:{},replog:[],repRules:DEF_REP_RULES});

  const refresh=useCallback(async()=>{
    const [players,game,legions,regions,motions,orders,deadline,cfg,laws,econ,election,elections,cavalry,fleets,businesses,assets,wealth,donations,history,parties,wealthlog,cemetery,forceTypes,courts,reputation,replog,repRules]=await Promise.all([
      db.get("spqr_p"),db.get("spqr_g"),db.get("spqr_l"),db.get("spqr_r"),
      db.get("spqr_m"),db.get("spqr_o"),db.get("spqr_deadline"),db.get("spqr_cfg"),db.get("spqr_laws"),db.get("spqr_econ"),db.get("spqr_election"),db.get("spqr_elections"),db.get("spqr_cav"),db.get("spqr_f"),db.get("spqr_biz"),db.get("spqr_assets"),db.get("spqr_wealth"),db.get("spqr_donations"),db.get("spqr_history"),db.get("spqr_parties"),db.get("spqr_wealthlog"),db.get("spqr_cemetery"),db.get("spqr_force_types"),db.get("spqr_courts"),db.get("spqr_reputation"),db.get("spqr_replog"),db.get("spqr_rep_rules")
    ]);
    const allElections=normalizeElections(elections,election);
    setD({players:players||[],game:game||DEF_GAME,legions:legions||DEF_LEGIONS,regions:regions||DEF_REGIONS,
      motions:motions||[],orders:orders||[],deadline:deadline||null,cfg:cfg||{},laws:laws||LAWS,econ:econ||[],election:election||null,elections:allElections,cavalry:cavalry||DEF_CAVALRY,fleets:fleets||DEF_FLEETS,businesses:(businesses&&businesses.length)?businesses:DEF_BUSINESSES,assets:assets||[],wealth:wealth||{},donations:donations||[],history:history||[],parties:parties||[],wealthlog:wealthlog||[],cemetery:cemetery||[],forceTypes:(forceTypes&&forceTypes.length)?forceTypes:FORCE_TYPES,courts:courts||[],reputation:reputation||{},replog:replog||[],repRules:repRules||DEF_REP_RULES});
    if(players){const me=players.find(p=>p.id===user.id);if(me)setUser(me);}
  },[user.id]);

  useEffect(()=>{refresh();const t=setInterval(refresh,20000);return()=>clearInterval(t);},[refresh]);
  useEffect(()=>{const h=e=>{if(e.detail?.tab)setTab(e.detail.tab);};window.addEventListener("spqr-nav",h);return()=>window.removeEventListener("spqr-nav",h);},[]);

  const pos=user.role?POS[user.role]:null;
  const votingCount=D.motions.filter(m=>m.status==="voting").length;
  const newResolutions=(D.orders||[]).filter(o=>o.playerId===user.id&&o.status==="resolved"&&!o.seenByPlayer).length;

  const currentParty=partyOf(D.parties||[],user.id);
  const GROUPS=[
    {key:"gov",label:"🏛️ Government",tone:"gov",tabs:[
      {k:"senate",l:"Senate"},{k:"voting",l:`Voting${votingCount>0?` (${votingCount})`:""}`},{k:"orders",l:"Orders"},{k:"resources",l:"Resources"},{k:"legions",l:"Legions"},{k:"magistrates",l:"Magistrates"},{k:"courts",l:"Courts"},{k:"elections",l:"Elections"},...(pos?[{k:"office",l:`${pos.abbr}`,tone:"office"}]:[])
    ]},
    {key:"personal",label:"👤 Personal",tone:"personal",tabs:[
      {k:"wealth",l:"Personal Wealth"},{k:"reputation",l:"Reputation"},{k:"forum",l:"Forum"},{k:"parties",l:"Parties"},{k:"character",l:"Character"}
    ]},
    {key:"records",label:"📜 Records",tone:"records",tabs:[
      {k:"cemetery",l:"Cemetery"},{k:"laws",l:"Laws"},{k:"map",l:"Map"}
    ]},
  ];
  const activeGroup=GROUPS.find(g=>g.key===group)||GROUPS[0];
  const activeTabs=activeGroup.tabs;
  const jumpTab=(next)=>{setTab(next);const found=GROUPS.find(g=>g.tabs.some(t=>t.k===next));if(found)setGroup(found.key);};
  const toneColor=tone=>tone==="personal"?"#2563EB":tone==="records"?"#5B21B6":tone==="office"?(pos?.color||T.gold):"#B45309";
  const toneBg=tone=>tone==="personal"?"#EAF2FF":tone==="records"?"#F3E8FF":tone==="office"?(pos?.bg||T.surf):"#FFF0D6";

  return(
    <div style={{minHeight:"100vh",background:T.bg}}>
      <style>{CSS}</style>
      <div className="spqr-topbar" style={{background:T.surf,borderBottom:`2px solid ${T.border}`,padding:"0.5rem 1rem",display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:"0.6rem",position:"sticky",top:0,zIndex:100}}>
        <div className="spqr-brand-season" style={{display:"flex",alignItems:"center",gap:"0.6rem",minWidth:0}}><div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"1rem",fontWeight:900,letterSpacing:"0.22em"}}>SPQR</div><SeasonPill game={D.game}/></div>
        <div className="spqr-party-center" style={{justifySelf:"center",textAlign:"center",minWidth:0}}>{currentParty?<PartyBadge party={currentParty}/>:<span className="spqr-party-badge" style={{fontFamily:"'Cinzel',serif",fontSize:"0.72rem",color:T.mut,letterSpacing:"0.08em"}}>No Political Party</span>}</div>
        <div className="spqr-top-actions" style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:"0.6rem",flexWrap:"wrap"}}>
          <span className="spqr-yearturn" style={{color:T.mut,fontSize:"0.75rem",fontFamily:"'Cinzel',serif"}}>{D.game.year} BC · Turn {D.game.session}</span>
          {pos&&<Badge c={pos.abbr} color={pos.color}/>} 
          <span className="spqr-player-name" style={{color:T.text,fontSize:"0.85rem",fontFamily:"'Cinzel',serif"}}>{user.latinName}</span>
          <NotifBell userId={user.id}/>
          <Btn v="ghost" sm onClick={refresh}>↺</Btn>
          <Btn v="ghost" sm onClick={onLogout}>Exit</Btn>
        </div>
      </div>
      <div className="spqr-tab-groups" style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:T.surf,overflowX:"auto",position:"sticky",top:"45px",zIndex:99}}>
        {GROUPS.map(g=><button key={g.key} onClick={()=>{setGroup(g.key); if(!g.tabs.some(t=>t.k===tab))setTab(g.tabs[0].k);}} style={{padding:"0.62rem 1.05rem",background:group===g.key?toneBg(g.tone):"transparent",color:group===g.key?toneColor(g.tone):T.mut,border:"none",borderTop:group===g.key?`3px solid ${toneColor(g.tone)}`:"3px solid transparent",fontFamily:"'Cinzel',serif",fontSize:"0.9rem",fontWeight:900,letterSpacing:"0.12em",whiteSpace:"nowrap",flexShrink:0}}>{g.label}</button>)}
      </div>
      <div className="spqr-tabs" style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:toneBg(activeGroup.tone),overflowX:"auto",position:"sticky",top:"92px",zIndex:98}}>
        {activeTabs.map(it=>{const tone=it.tone||activeGroup.tone;return <button key={it.k} onClick={()=>jumpTab(it.k)} style={{padding:"0.52rem 0.9rem",background:tab===it.k?"#fff":"transparent",color:tab===it.k?toneColor(tone):T.mut,border:"none",borderBottom:tab===it.k?`2px solid ${toneColor(tone)}`:"2px solid transparent",fontFamily:"'Cinzel',serif",fontSize:"0.86rem",letterSpacing:"0.08em",whiteSpace:"nowrap",flexShrink:0}}>{it.l}</button>})}
      </div>
      <div className="spqr-shell" style={{maxWidth:1120,margin:"0 auto",padding:"1rem"}}>
        <ErrorBoundary key={tab}>
        {tab==="senate"    &&<SenatePanel players={D.players} D={D} onGoVote={()=>setTab("voting")}/>}
        {tab==="voting"    &&<VotingPanel motions={D.motions} players={D.players} user={user} game={D.game} onRefresh={refresh}/>}
        {tab==="orders"    &&<OrdersPanel orders={D.orders} game={D.game} players={D.players}/>} 
        {tab==="resources" &&<ResourcesRegionsPanel D={D} editable={false}/>} 
        {tab==="legions"   &&<LegionsPublicPanel D={D}/>} 
        {tab==="magistrates"&&<MagistratesPanel players={D.players}/>} 
        {tab==="courts"&&<CourtsPanel user={user} D={D} onRefresh={refresh}/>} 
        {tab==="elections" &&<ElectionsPlayerPanel user={user} D={D} onRefresh={refresh}/>} 
        {tab==="office"    &&pos&&<MyOfficePanel user={user} game={D.game} legions={D.legions} cavalry={D.cavalry} fleets={D.fleets} players={D.players} orders={D.orders} deadline={D.deadline} onRefresh={refresh}/>}
        {tab==="wealth"    &&<PersonalWealthPanel user={user} D={D} onRefresh={refresh}/>}
        {tab==="reputation"&&<ReputationPanel user={user} D={D} onRefresh={refresh}/>}
        {tab==="forum"&&<ForumPanel D={D}/>}
        {tab==="parties"   &&<PartiesPanel user={user} D={D} onRefresh={refresh}/>}
        {tab==="cemetery" &&<CemeteryPanel cemetery={D.cemetery||[]} players={D.players||[]}/>}
        {tab==="character" &&<CharacterPanel user={user} onUpdate={setUser}/>}
        {tab==="laws"      &&<LawsPanel laws={D.laws}/>}
        {tab==="map"       &&<MapPanel cfg={D.cfg}/>}
        </ErrorBoundary>
      </div>
    </div>
  );
}

/* ══ ADMIN PANELS ═════════════════════════════════════════════════════════ */

function AOverview({D}){
  const [, setR]=useState(0);
  const activeLegs=(D.legions||[]).filter(l=>l.status==="active");
  const inc=D.regions?calcInc(D.regions,D.game||DEF_GAME):{gold:0,food:0};
  const upkeepG=activeLegs.length*(D.game?.legionUpkeep||80)+activeCavalry(D.cavalry||DEF_CAVALRY).length*(D.game?.cavalryUpkeep||DEF_GAME.cavalryUpkeep)+fleetTriremes(D.fleets||DEF_FLEETS)*(D.game?.fleetUpkeep||DEF_GAME.fleetUpkeep);
  const upkeepF=activeLegs.length*(D.game?.legionFood||60)+activeCavalry(D.cavalry||DEF_CAVALRY).length*(D.game?.cavalryFood||DEF_GAME.cavalryFood)+fleetTriremes(D.fleets||DEF_FLEETS)*(D.game?.fleetFood||DEF_GAME.fleetFood);
  const pendingMotions=(D.motions||[]).filter(m=>m.status==="pending");
  const newOrders=(D.orders||[]).filter(o=>o.status==="pending");
  const vacant=Object.keys(POS).filter(k=>!(D.players||[]).find(p=>p.role===k));
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:"0.5rem",marginBottom:"1rem"}}>
        <Stat label="Session" value={D.game?.session||1}/>
        <Stat label="Year" value={`${D.game?.year||218} BC`}/>
        <Stat label="Season" value={`${D.game?.season}`}/>
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

function CemeteryPanel({cemetery=[]}){
  return <div>
    <Card><STit c="Cemetery of the Republic" sub="Dead senators are recorded here with their class, offices and cause of death."/>
      {cemetery.length===0?<div style={{color:T.mut,fontStyle:"italic"}}>No senators have died yet.</div>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"0.7rem"}}>{cemetery.slice().sort((a,b)=>(b.deathTs||0)-(a.deathTs||0)).map(p=>{const ci=getClassInfo(p.charClass);return <Card key={p.id||p.deathTs} style={{borderLeft:`6px solid ${T.rhi}`,background:"#FFF1F1"}}><div style={{display:"flex",gap:"0.65rem",alignItems:"center"}}>{p.avatar?<img src={p.avatar} style={{width:70,height:70,borderRadius:"50%",objectFit:"cover",border:`2px solid ${T.rhi}`,filter:"grayscale(0.35)"}}/>:<div style={{width:70,height:70,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:`${ci.color}22`,fontSize:"1.7rem"}}>🕯️</div>}<div><div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.rhi,fontSize:"1.05rem"}}>{p.latinName}</div><ClassBadge cls={p.charClass} sm/><div style={{color:T.mut,fontSize:"0.9rem"}}>Died: {p.deathSession||"Unknown"}</div></div></div><div style={{marginTop:"0.6rem",borderTop:`1px solid ${T.border}`,paddingTop:"0.5rem"}}><b>Cause:</b> {p.cause||"Unknown"}</div>{p.biography&&<div style={{marginTop:"0.4rem",fontStyle:"italic",color:T.mut}}>{p.biography}</div>}</Card>})}</div>}
    </Card>
  </div>;
}

function ASenators({D,onRefresh}){
  const [loginOpen,setLoginOpen]=useState(D.cfg?.loginOpen!==false);
  const [selected,setSelected]=useState(null);
  const [newPass,setNewPass]=useState({});
  const [adminMsg,setAdminMsg]=useState("");
  const [filterText,setFilterText]=useState("");
  const [classFilter,setClassFilter]=useState("all");
  const [roleFilter,setRoleFilter]=useState("all");
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
    if(pos){
      await pushN("Position Assigned",`You have been appointed ${pos.title}`,playerId);
      await addHistory(playerId,"Office Held",`${p?.latinName||"A senator"} was appointed ${pos.title}.`,"office");
    } else {
      await pushN("Position Removed","Your position has been removed by the GM",playerId);
      await addHistory(playerId,"Office Removed",`${p?.latinName||"A senator"} left office.`,"office");
    }
    onRefresh();
  };
  const removePlayer=async(playerId)=>{
    if(!confirm("Remove this senator permanently?"))return;
    const players=await db.get("spqr_p")||[];
    await db.set("spqr_p",players.filter(p=>p.id!==playerId));
    onRefresh();
  };

  const killPlayer=async(playerId)=>{
    const players=await db.get("spqr_p")||[];
    const target=players.find(p=>p.id===playerId);
    if(!target)return;
    const cause=prompt(`Cause of death for ${target.latinName}?`,"Died in service of the Republic");
    if(cause===null)return;
    const cemetery=await db.get("spqr_cemetery")||[];
    const grave={...target,role:null,dead:true,cause:cause||"Unknown",deathSession:sLab(D.game||DEF_GAME),deathTs:Date.now()};
    await db.set("spqr_cemetery",[...cemetery,grave]);
    await db.set("spqr_p",players.filter(p=>p.id!==playerId));
    await addHistory(playerId,"Death",`${target.latinName} died. Cause: ${cause||"Unknown"}.`,"death");
    await pushN("Death Notice",`${target.latinName} has died and has been entered into the cemetery of the Republic.`);
    onRefresh();
  };
  const resetPassword=async(playerId)=>{
    const pass=(newPass[playerId]||"").trim();
    if(!pass){setAdminMsg("Enter a new password first.");setTimeout(()=>setAdminMsg(""),3500);return;}
    if(pass.length<4){setAdminMsg("Password should be at least 4 characters.");setTimeout(()=>setAdminMsg(""),3500);return;}
    const players=await db.get("spqr_p")||[];
    const target=players.find(p=>p.id===playerId);
    await db.set("spqr_p",players.map(p=>p.id===playerId?{...p,password:pass}:p));
    setNewPass(x=>({...x,[playerId]:""}));
    setAdminMsg(`Password reset for ${target?.latinName||"senator"}. Give them the new password privately.`);
    setTimeout(()=>setAdminMsg(""),5000);
    onRefresh();
  };
  const toggleLogin=async()=>{
    const cfg=await db.get("spqr_cfg")||{};
    const next=!loginOpen;
    await db.set("spqr_cfg",{...cfg,loginOpen:next});
    setLoginOpen(next);
  };
  const allPlayers=(D.players||[]).filter(Boolean);
  const parties=(D.parties||[]).filter(Boolean);
  const filteredPlayers=allPlayers.filter(p=>{
    const q=filterText.trim().toLowerCase();
    const matchesText=!q||[p.latinName,p.username,p.discord,p.charClass,POS[p.role]?.title].filter(Boolean).some(v=>String(v).toLowerCase().includes(q));
    const matchesClass=classFilter==="all"||classKey(p.charClass)===classFilter;
    const matchesRole=roleFilter==="all"||(roleFilter==="none"?!p.role:p.role===roleFilter);
    return matchesText&&matchesClass&&matchesRole;
  });
  return(
    <div>
      <Card>
        <STit c="Registration Control"/>
        <Row>
          <div style={{flex:1,fontSize:"0.88rem",color:T.mut}}>New player registration is currently <span style={{color:loginOpen?T.gre:T.rhi,fontFamily:"'Cinzel',serif"}}>{loginOpen?"OPEN":"CLOSED"}</span></div>
          <Btn v={loginOpen?"red":"green"} sm onClick={toggleLogin}>{loginOpen?"🔒 Close Registrations":"🔓 Open Registrations"}</Btn>
        </Row>
      </Card>
      {adminMsg&&<Card style={{borderLeft:`3px solid ${T.gre}`}}><div style={{color:T.gre,fontFamily:"'Cinzel',serif"}}>{adminMsg}</div></Card>}
      <Card>
        <STit c="Senate Seating" sub="GM view: click any occupied seat to open the senator profile. Only occupied senator seats are shown; vacant magistracies remain visible."/>
        <SenateMap players={D.players||[]} parties={D.parties||[]} onSelectPlayer={setSelected}/>
        {(D.parties||[]).length>0&&<div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap",marginTop:"0.55rem"}}>{(D.parties||[]).map(pt=><PartyBadge key={pt.id} party={pt} sm/>)}</div>}
      </Card>
      <Card>
        <STit c="Senator Filters" sub="Find senators quickly by name, Discord, class or office."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"0.6rem",alignItems:"end"}}>
          <Inp label="Search" value={filterText} onChange={setFilterText} placeholder="Name, username, Discord, class, office..."/>
          <div><Lbl c="Class"/><select value={classFilter} onChange={e=>setClassFilter(e.target.value)} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"0.48rem 0.6rem",fontFamily:"'Cinzel',serif"}}><option value="all">All Classes</option>{Object.entries(CLASS_INFO).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.label}</option>)}</select></div>
          <div><Lbl c="Office"/><select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"0.48rem 0.6rem",fontFamily:"'Cinzel',serif"}}><option value="all">All Offices</option><option value="none">No Magistracy</option>{Object.entries(POS).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.title}</option>)}</select></div>
        </div>
        <div style={{color:T.mut,fontSize:"0.9rem"}}>Showing {filteredPlayers.length} of {allPlayers.length} senators.</div>
      </Card>
      <STit c={`Senator Roster (${filteredPlayers.length}/${allPlayers.length})`}/>
      {filteredPlayers.map(p=>{
        const pos=p.role?POS[p.role]:null;
        const ci=getClassInfo(p.charClass);
        return(
          <Card key={p.id} style={{borderLeft:`7px solid ${ci.color}`,background:ci.bg}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"0.5rem",marginBottom:"0.5rem"}}>
              <div style={{display:"flex",gap:"0.6rem",alignItems:"center"}}>
                {p.avatar?<img src={p.avatar} style={{width:42,height:42,objectFit:"cover",borderRadius:"50%",border:`2px solid ${pos?pos.color:ci.color}`}} alt=""/>:<div style={{width:42,height:42,background:`${ci.color}22`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",fontSize:"1.2rem",color:ci.color}}>{ci.emoji}</div>}
                <div>
                  <button onClick={()=>setSelected(p)} style={{background:"none",border:"none",padding:0,cursor:"pointer",fontFamily:"'Cinzel',serif",color:T.blue,fontWeight:800,fontSize:"1rem",textDecoration:"underline"}}>{p.latinName}</button>
                  <div style={{color:T.mut,fontSize:"0.75rem"}}>{p.username}</div>
                  <div style={{marginTop:"0.15rem"}}><ClassBadge cls={p.charClass} sm/></div>
                  {p.discord&&<div style={{color:"#7289DA",fontSize:"0.9rem"}}>{p.discord}</div>}
                </div>
              </div>
              <div style={{display:"flex",gap:"0.4rem",alignItems:"center",flexWrap:"wrap"}}>
                {pos&&<Badge c={pos.title} color={pos.color} sm/>}
                  {partyOf(parties,p.id)&&<div style={{marginTop:"0.18rem"}}><PartyBadge party={partyOf(parties,p.id)} sm/></div>}
                <Btn v="red" sm onClick={()=>killPlayer(p.id)}>Kill / Cemetery</Btn><Btn v="ghost" sm onClick={()=>removePlayer(p.id)}>Remove</Btn>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"0.6rem",alignItems:"end"}}>
              <div>
                <Lbl c="Assign Position"/>
                <select value={p.role||""} onChange={e=>assign(p.id,e.target.value||null)}
                  style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"0.48rem 0.6rem",fontFamily:"'Cinzel',serif",fontSize:"0.9rem",cursor:"pointer"}}>
                  <option value="">— No Position —</option>
                  {Object.entries(POS).map(([k,v])=><option key={k} value={k}>{v.title}</option>)}
                </select>
              </div>
              <div>
                <Lbl c="Reset Player Password"/>
                <div style={{display:"flex",gap:"0.4rem"}}>
                  <input type="text" value={newPass[p.id]||""} onChange={e=>setNewPass(x=>({...x,[p.id]:e.target.value}))} placeholder="New password" style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,color:T.text,padding:"0.48rem 0.6rem",fontFamily:"'EB Garamond',serif",fontSize:"1rem"}}/>
                  <Btn v="blue" sm onClick={()=>resetPassword(p.id)}>Reset</Btn>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
      {allPlayers.length===0&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.88rem"}}>No senators have enrolled.</div>}
      {allPlayers.length>0&&filteredPlayers.length===0&&<div style={{color:T.mut,fontStyle:"italic",fontSize:"0.88rem"}}>No senators match the current filters.</div>}
      {selected&&<SenatorProfileModal player={selected} onClose={()=>setSelected(null)}/>}
    </div>
  );
}

function ALegions({D,onRefresh}){
  const [legs,setLegs]=useState(null);
  const [cav,setCav]=useState(null);
  const [fleets,setFleets]=useState(null);
  const [forceTypes,setForceTypes]=useState(FORCE_TYPES);
  const [selectedForce,setSelectedForce]=useState("roman_legion");
  const [msg,setMsg]=useState("");
  useEffect(()=>{
    setLegs((D.legions||DEF_LEGIONS).map(l=>({name:l.name||`Legio ${l.id}`,max:l.max||5000,str:l.str??5000,commander:l.commander||"Unassigned",armyCommand:l.armyCommand||"Independent",...l})));
    setCav((D.cavalry||DEF_CAVALRY).map(c=>({commander:"Unassigned",...c})));
    setFleets((D.fleets||DEF_FLEETS).map(f=>({commander:"Unassigned",...f,triremes:Number(f.triremes??f.ships??0)})));
    setForceTypes((D.forceTypes&&D.forceTypes.length?D.forceTypes:FORCE_TYPES).map(t=>({...t})));
  },[D.legions,D.cavalry,D.fleets,D.forceTypes]);
  if(!legs||!cav||!fleets)return null;
  const updLeg=(i,k,v)=>setLegs(ls=>ls.map((l,j)=>j===i?{...l,[k]:(k==="str"||k==="max"||k==="prog")?Number(v):v}:l));
  const updCav=(i,k,v)=>setCav(ls=>ls.map((l,j)=>j===i?{...l,[k]:(k==="str"||k==="max")?Number(v):v}:l));
  const updFleet=(i,k,v)=>setFleets(ls=>ls.map((l,j)=>j===i?{...l,[k]:(k==="triremes")?Number(v):v}:l));
  const save=async()=>{await db.set("spqr_l",legs);await db.set("spqr_cav",cav);await db.set("spqr_f",fleets);await db.set("spqr_force_types",forceTypes);setMsg("Military forces saved.");onRefresh();setTimeout(()=>setMsg(""),2500);};
  const addLegion=()=>{const n=legs.length+1;setLegs(ls=>[...ls,{id:`${n}`,name:`Legio ${n}`,str:5000,max:5000,status:"active",prog:0,location:"Roma",commander:"Unassigned",armyCommand:"Independent"}]);};
  const addCav=()=>{const n=cav.length+1;setCav(ls=>[...ls,{id:`eq_${n}`,name:`Equites ${n}`,str:600,max:600,status:"active",location:"Roma",commander:"Unassigned",armyCommand:"Independent"}]);};
  const addFleet=()=>{const n=fleets.length+1;setFleets(ls=>[...ls,{id:`classis_${n}`,name:`Classis ${n}`,triremes:20,status:"active",location:"Ostia",commander:"Unassigned"}]);};
  const updForceType=(i,k,v)=>setForceTypes(ts=>ts.map((t,j)=>j===i?{...t,[k]:["men","gold","food","turns","goldUpkeep","foodUpkeep"].includes(k)?Number(v):v}:t));
  const addForceType=()=>setForceTypes(ts=>[...ts,{id:`force_${Date.now()}`,type:"legion",emoji:"⚔️",name:"New Force",men:1000,gold:100,food:100,turns:1,goldUpkeep:20,foodUpkeep:20,note:"Custom force type."}]);
  const removeForceType=i=>{if(confirm("Remove this force type? Existing units keep their saved data, but future recruitment will not use this type."))setForceTypes(ts=>ts.filter((_,j)=>j!==i));};
  const recruitSelected=async()=>{const ft=forceTypes.find(t=>t.id===selectedForce);if(!ft){setMsg("Select a force type first.");return;}const g=await db.get("spqr_g")||DEF_GAME;if(g.gold<ft.gold||g.food<ft.food||g.pop<ft.men){setMsg("Insufficient state resources/manpower for this force type.");return;}await db.set("spqr_g",{...g,gold:g.gold-ft.gold,food:g.food-ft.food,pop:g.pop-ft.men});if(ft.type==="fleet"){setFleets(ls=>[...ls,{id:`classis_${ls.length+1}`,typeId:ft.id,name:ft.name,triremes:1,status:"raising",location:"Ostia",commander:"Unassigned"}]);}else if(ft.type==="cavalry"){setCav(ls=>[...ls,{id:`cav_${ls.length+1}`,typeId:ft.id,name:ft.name,str:0,max:ft.men,status:"raising",location:"Roma",commander:"Unassigned"}]);}else{setLegs(ls=>[...ls,{id:`unit_${ls.length+1}`,typeId:ft.id,name:ft.name,str:0,max:ft.men,status:"raising",prog:0,location:"Roma",commander:"Unassigned"}]);}setMsg(`${ft.name} recruitment started. Save military data to keep the new unit.`);};
  const remove=(setter,i,label)=>{if(confirm(`Remove this ${label}?`))setter(ls=>ls.filter((_,j)=>j!==i));};
  const recruitNew=async()=>{
    const g=await db.get("spqr_g")||DEF_GAME;
    if(g.gold<g.lgold||g.food<g.lfood||g.pop<g.lpop){setMsg("Insufficient resources to recruit a new legion.");return;}
    await db.set("spqr_g",{...g,gold:g.gold-g.lgold,food:g.food-g.lfood,pop:g.pop-g.lpop});
    const n=legs.length+1;
    setLegs(ls=>[...ls,{id:`${n}`,name:`Legio ${n}`,str:0,max:5000,status:"raising",prog:0,location:"Roma",commander:"Unassigned",armyCommand:"Independent"}]);
    setMsg("New legion recruitment started. Save to keep it.");
  };
  const sc={active:T.blue,raising:T.gold,destroyed:T.rhi,unraised:T.fnt,repairing:T.gold};
  const field=(label,value,onChange,type="text")=><div><Lbl c={label}/><input type={type} value={value??""} onChange={e=>onChange(e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.35rem 0.5rem",fontSize:"1.05rem"}}/></div>;
  return(
    <div>
      {msg&&<div style={{padding:"0.55rem 0.8rem",background:"#0a1a0a",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.7rem",fontSize:"1rem"}}>{msg}</div>}
      <Card>
        <STit c="Military Control Panel" sub="Manage legions, cavalry, fleets, commanders, army commands and locations."/>
        <div style={{display:"grid",gridTemplateColumns:"minmax(240px,1fr) auto",gap:"0.5rem",alignItems:"end",marginBottom:"0.65rem"}}>
          <div><Lbl c="Recruit Force Type"/><select value={selectedForce} onChange={e=>setSelectedForce(e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.5rem"}}>{forceTypes.map(ft=><option key={ft.id} value={ft.id}>{ft.emoji} {ft.name} — {ft.men} men · {ft.gold}T/{ft.food}M</option>)}</select></div>
          <Btn v="green" onClick={recruitSelected}>＋ Recruit Selected</Btn>
        </div>
        <Row gap="0.5rem" wrap><Btn v="dark" onClick={addLegion}>＋ Add Legion Manually</Btn><Btn v="blue" onClick={addCav}>＋ Add Cavalry Manually</Btn><Btn onClick={addFleet}>＋ Add Fleet Manually</Btn><Btn onClick={save}>💾 Save Military Data</Btn></Row>
      </Card>
      <Card><STit c="Legions" sub="Assign commanders and army commands here."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:"0.6rem"}}>
          {legs.map((l,i)=><div key={`${l.id}-${i}`} style={{background:T.card,border:`1px solid ${T.border}`,borderLeft:`5px solid ${sc[l.status]||T.border}`,padding:"0.75rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:"0.5rem",alignItems:"center",marginBottom:"0.5rem",flexWrap:"wrap"}}><b style={{fontFamily:"'Cinzel',serif",color:T.text}}>🛡️ {l.name}</b><Btn v="red" sm onClick={()=>remove(setLegs,i,"legion")}>Remove</Btn></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"0.5rem"}}>
              {field("Legion ID",l.id,v=>updLeg(i,"id",v))}{field("Legion Name",l.name,v=>updLeg(i,"name",v))}<div><Lbl c="Force Type"/><select value={l.typeId||"roman_legion"} onChange={e=>updLeg(i,"typeId",e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.35rem 0.5rem"}}>{forceTypes.filter(ft=>ft.type==="legion").map(ft=><option key={ft.id} value={ft.id}>{ft.emoji} {ft.name}</option>)}</select></div>{field("Strength",l.str,v=>updLeg(i,"str",v),"number")}{field("Max Soldiers",l.max,v=>updLeg(i,"max",v),"number")}{field("Stationed Location",l.location,v=>updLeg(i,"location",v))}{field("Commander",l.commander,v=>updLeg(i,"commander",v))}{field("Progress",l.prog,v=>updLeg(i,"prog",v),"number")}
              <div><Lbl c="Status"/><select value={l.status} onChange={e=>updLeg(i,"status",e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:sc[l.status]||T.mut,padding:"0.35rem 0.5rem",fontFamily:"'Cinzel',serif"}}><option value="active">Active</option><option value="raising">Raising</option><option value="destroyed">Destroyed</option><option value="unraised">Unraised</option></select></div>
            </div>
          </div>)}
        </div>
      </Card>
      <Card><STit c="Cavalry" sub="Extra mobile units for reconnaissance, pursuit and Magister Equitum operations."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:"0.6rem"}}>
          {cav.map((c,i)=><div key={`${c.id}-${i}`} style={{background:T.card,border:`1px solid ${T.border}`,borderLeft:`5px solid ${T.blue}`,padding:"0.75rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:"0.5rem",alignItems:"center",marginBottom:"0.5rem",flexWrap:"wrap"}}><b style={{fontFamily:"'Cinzel',serif",color:T.blue}}>🐎 {c.name}</b><Btn v="red" sm onClick={()=>remove(setCav,i,"cavalry unit")}>Remove</Btn></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"0.5rem"}}>{field("Unit ID",c.id,v=>updCav(i,"id",v))}{field("Unit Name",c.name,v=>updCav(i,"name",v))}<div><Lbl c="Force Type"/><select value={c.typeId||"socii_equites"} onChange={e=>updCav(i,"typeId",e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.35rem 0.5rem"}}>{forceTypes.filter(ft=>ft.type==="cavalry").map(ft=><option key={ft.id} value={ft.id}>{ft.emoji} {ft.name}</option>)}</select></div>{field("Strength",c.str,v=>updCav(i,"str",v),"number")}{field("Max Riders",c.max,v=>updCav(i,"max",v),"number")}{field("Location",c.location,v=>updCav(i,"location",v))}{field("Commander",c.commander,v=>updCav(i,"commander",v))}</div>
          </div>)}
        </div>
      </Card>
      <Card><STit c="Fleets" sub="Manage Roman naval forces: triremes, location, crew strength and commanders."/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:"0.6rem"}}>
          {fleets.map((f,i)=><div key={`${f.id}-${i}`} style={{background:T.card,border:`1px solid ${T.border}`,borderLeft:`5px solid ${T.gold}`,padding:"0.75rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:"0.5rem",alignItems:"center",marginBottom:"0.5rem",flexWrap:"wrap"}}><b style={{fontFamily:"'Cinzel',serif",color:T.ghi}}>🚢 {f.name}</b><Btn v="red" sm onClick={()=>remove(setFleets,i,"fleet")}>Remove</Btn></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"0.5rem"}}>{field("Fleet ID",f.id,v=>updFleet(i,"id",v))}{field("Fleet Name",f.name,v=>updFleet(i,"name",v))}{field("Triremes",f.triremes??f.ships??0,v=>updFleet(i,"triremes",v),"number")}{field("Crew / Strength",Number(f.triremes??f.ships??0)*200,()=>{},"number")}{field("Base / Location",f.location,v=>updFleet(i,"location",v))}{field("Commander",f.commander,v=>updFleet(i,"commander",v))}<div><Lbl c="Status"/><select value={f.status} onChange={e=>updFleet(i,"status",e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,padding:"0.35rem 0.5rem"}}><option value="active">Active</option><option value="repairing">Repairing</option><option value="destroyed">Destroyed</option></select></div></div>
          </div>)}
        </div>
      </Card>

      <Card><STit c="Force Types, Costs, Upkeep and Descriptions" sub="Edit every recruitable unit type. These values are used for recruitment cards and projected upkeep when units have a force type assigned."/>
        <Row gap="0.5rem" wrap><Btn v="green" onClick={addForceType}>＋ Add Force Type</Btn><Btn onClick={save}>💾 Save Force Types</Btn></Row>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(360px,1fr))",gap:"0.6rem",marginTop:"0.65rem"}}>
          {forceTypes.map((ft,i)=><div key={ft.id+"-"+i} style={{background:T.card,border:`1px solid ${T.border}`,borderLeft:`5px solid ${ft.type==="legion"?T.red:ft.type==="cavalry"?T.blue:T.gold}`,padding:"0.75rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:"0.5rem",alignItems:"center",marginBottom:"0.5rem",flexWrap:"wrap"}}><b style={{fontFamily:"'Cinzel',serif",color:T.text}}>{ft.emoji} {ft.name}</b><Btn v="red" sm onClick={()=>removeForceType(i)}>Remove</Btn></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"0.45rem"}}>
              {field("ID",ft.id,v=>updForceType(i,"id",v))}{field("Emoji",ft.emoji,v=>updForceType(i,"emoji",v))}{field("Name",ft.name,v=>updForceType(i,"name",v))}
              <div><Lbl c="Category"/><select value={ft.type||"legion"} onChange={e=>updForceType(i,"type",e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.35rem 0.5rem"}}><option value="legion">Legion / Infantry</option><option value="cavalry">Cavalry / Auxilia</option><option value="fleet">Fleet / Trireme</option></select></div>
              {field("Men / Crew",ft.men,v=>updForceType(i,"men",v),"number")}{field("Gold Cost",ft.gold,v=>updForceType(i,"gold",v),"number")}{field("Food Cost",ft.food,v=>updForceType(i,"food",v),"number")}{field("Turns",ft.turns,v=>updForceType(i,"turns",v),"number")}{field("Gold Upkeep",ft.goldUpkeep,v=>updForceType(i,"goldUpkeep",v),"number")}{field("Food Upkeep",ft.foodUpkeep,v=>updForceType(i,"foodUpkeep",v),"number")}
            </div>
            <div style={{marginTop:"0.5rem"}}><Lbl c="Description / Reliability Notes"/><textarea value={ft.note||""} onChange={e=>updForceType(i,"note",e.target.value)} style={{width:"100%",minHeight:70,background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.45rem"}}/></div>
          </div>)}
        </div>
      </Card>
      <Btn onClick={save}>💾 Save Military Data</Btn>
    </div>
  );
}


function ABackupRestore({onRefresh}){
  const [msg,setMsg]=useState("");
  const fileRef=useRef();
  const keys=["spqr_g","spqr_l","spqr_r","spqr_p","spqr_m","spqr_o","spqr_deadline","spqr_cfg","spqr_laws","spqr_n","spqr_econ","spqr_election","spqr_elections","spqr_cav","spqr_f","spqr_biz","spqr_assets","spqr_wealth","spqr_donations","spqr_history","spqr_parties","spqr_cemetery","spqr_force_types"];
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
      {msg&&<div style={{padding:"0.45rem 0.7rem",background:"#0a1a0a",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.65rem",fontSize:"1.05rem"}}>{msg}</div>}
      <div style={{fontSize:"1.05rem",color:T.mut,lineHeight:1.5,marginBottom:"0.75rem"}}>
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
  const [regs,setRegs]=useState(null);
  const [confirmAdv,setConfirmAdv]=useState(false);
  const [msg,setMsg]=useState("");
  useEffect(()=>{setG({...DEF_GAME,...D.game});setRegs((D.regions||DEF_REGIONS).map(r=>({...r})));},[D.game,D.regions]);
  if(!g||!regs)return null;
  const inc=calcInc(regs,g);
  const activeLegs=activeLegions(D.legions||[]);
  const mb=militaryBreakdown(g,D.legions||DEF_LEGIONS,D.cavalry||DEF_CAVALRY,D.fleets||DEF_FLEETS,D.forceTypes||FORCE_TYPES);
  const upkeepG=mb.totalGold;
  const upkeepF=mb.totalFood;
  const privateTaxes=totalPrivateTaxProjection(D.players||[],D.assets||[],D.businesses||DEF_BUSINESSES,D.wealth||{},g);
  const totalGoldIncome=inc.gold+privateTaxes.gold;
  const totalFoodIncome=inc.food+privateTaxes.food;
  const snap=economySnapshot(g,regs,D.legions||DEF_LEGIONS,D.cavalry||DEF_CAVALRY,D.fleets||DEF_FLEETS);
  const updReg=(i,k,v)=>setRegs(rs=>rs.map((r,j)=>j===i?{...r,[k]:k==="s"?v:(k==="name"||k==="id"||k==="capital"?v:Number(v))}:r));
  const addRegion=()=>setRegs(rs=>[...rs,{id:`region_${Date.now()}`,name:"New Province",capital:"New Capital",pop:50000,bG:50,bF:50,s:"roman"}]);
  const delRegion=i=>{if(confirm("Delete this province/region?"))setRegs(rs=>rs.filter((_,j)=>j!==i));};
  const save=async()=>{await db.set("spqr_g",g);await db.set("spqr_r",regs);setMsg("Resources and regions saved.");onRefresh();setTimeout(()=>setMsg(""),2500);};
  const applyMaintenance=async()=>{
    if(!confirm(`Apply military maintenance now?\n\nGold: -${upkeepG}T\nFood: -${upkeepF}M\n\nThis subtracts Legion + Cavalry + Fleet upkeep from the current stockpile without advancing the turn.`))return;
    const ng={...g,gold:Math.max(0,Number(g.gold||0)-upkeepG),food:Math.max(0,Number(g.food||0)-upkeepF)};
    await db.set("spqr_g",ng);
    setG(ng);
    setMsg("Military maintenance applied to the stockpile.");
    await pushN("treasury","Military Maintenance Applied",`The treasury paid ${upkeepG}T and the granaries issued ${upkeepF}M for legions, cavalry and fleets.`);
    onRefresh();setTimeout(()=>setMsg(""),3000);
  };
  const doAdvance=async()=>{
    let {year,season,sessionInSeason,session,gold,food,pop,lturns}=g;
    gold=gold+inc.gold-upkeepG;
    food=food+inc.food-upkeepF;
    let newSess=1;
    let newSeason=season;let newYear=year;
    const idx=seasonIndex(season);const nIdx=(idx+1)%SEASONS.length;newSeason=SEASONS[nIdx];if(nIdx===0)newYear=year-1;
    session++;
    const legs=await db.get("spqr_l")||DEF_LEGIONS;
    const nl=legs.map(l=>{if(l.status==="raising"){const np=(l.prog||0)+1;if(np>=lturns)return{...l,status:"active",str:l.max||5000,max:l.max||5000,prog:0};return{...l,prog:np};}return l;});
    await db.set("spqr_l",nl);
    let ng={...g,gold:Math.max(0,gold),food:Math.max(0,food),pop,year:newYear,season:newSeason,sessionInSeason:newSess,session};
    const hist=await db.get("spqr_econ")||[];
    await db.set("spqr_econ",[...hist,economySnapshot(ng,regs,nl,D.cavalry||DEF_CAVALRY,D.fleets||DEF_FLEETS)].slice(-24));
    // Pay private estate/business income to senators once per advanced season.
    const businesses=(await db.get("spqr_biz"))||DEF_BUSINESSES;
    const assets=(await db.get("spqr_assets"))||[];
    const wealth=(await db.get("spqr_wealth"))||{};
    const players=(await db.get("spqr_p"))||[];
    const nextWealth={...wealth};
    let nextPlayers=[...players];
    const deadSenators=[];
    let totalTaxGold=0,totalTaxFood=0;
    for(const pl of players){
      let w=wealthOf(nextWealth,pl.id);
      if(Number(w.food||0)<0 && debtSessionExpired(w.debtFoodSince,g.session)){
        const cemetery=await db.get("spqr_cemetery")||[];
        const grave={...pl,role:null,dead:true,cause:"Starvation after failing to resolve a private food deficit.",deathSession:sLab(ng),deathTs:Date.now()};
        await db.set("spqr_cemetery",[...cemetery,grave]);
        nextPlayers=nextPlayers.filter(x=>x.id!==pl.id);
        delete nextWealth[pl.id];
        deadSenators.push(pl.latinName);
        await addHistory(pl.id,"Death by Starvation",`${pl.latinName} died after failing to resolve a private food deficit.`,"death");
        continue;
      }
      if(Number(w.gold||0)<0 && debtSessionExpired(w.debtGoldSince,g.session)){
        const upd={...pl,charClass:"Plebeian",role:null};
        nextPlayers=nextPlayers.map(x=>x.id===pl.id?upd:x);
        w={...w,gold:0,food:20,debtGoldSince:null,debtFoodSince:null,householdGold:10,householdFood:10};
        await addHistory(pl.id,"Bankruptcy and Social Collapse",`${pl.latinName} failed to resolve a private gold debt and fell to Plebeian status with 0T gold and 20M food.`,"wealth");
        await addWealthLog({type:"bankruptcy",session:sLab(ng),text:`${pl.latinName} failed to resolve debt and fell to Plebeian status.`});
      }
      const bal=personalBalanceFor(pl.id,pl.role,assets,businesses,{...nextWealth,[pl.id]:w},g);
      totalTaxGold+=bal.taxGold;
      totalTaxFood+=bal.taxFood;
      const goldAfter=Number(w.gold||0)+bal.netGold;
      const foodAfter=Number(w.food||0)+bal.netFood;
      nextWealth[pl.id]={...w,gold:goldAfter,food:foodAfter,
        debtGoldSince: goldAfter<0 ? (w.debtGoldSince||ng.session) : null,
        debtFoodSince: foodAfter<0 ? (w.debtFoodSince||ng.session) : null
      };
      if(goldAfter<0)await addHistory(pl.id,"Debt Warning",`${pl.latinName} is in negative gold. They have one turn to solve this debt or fall to Plebeian status.`,"wealth");
      if(foodAfter<0)await addHistory(pl.id,"Starvation Warning",`${pl.latinName} is in negative food. They have one turn to solve this or die of starvation.`,"wealth");
      if(bal.gross.gold||bal.gross.food||bal.houseGold||bal.houseFood){
        await addHistory(pl.id,"Private Wealth Balance",`Gross estates: ${bal.gross.gold}T/${bal.gross.food}M. Taxes: ${bal.taxGold}T/${bal.taxFood}M. Household upkeep: ${bal.houseGold}T/${bal.houseFood}M. Net: ${bal.netGold}T/${bal.netFood}M for ${sLab(ng)}.`,"wealth");
      }
    }
    if(deadSenators.length){
      await db.set("spqr_p",nextPlayers);
      await pushN("Deaths by Starvation",`${deadSenators.join(", ")} died after failing to solve private food deficits.`);
    }
    if(totalTaxGold||totalTaxFood){
      ng={...ng,gold:Math.max(0,Number(ng.gold||0)+totalTaxGold),food:Math.max(0,Number(ng.food||0)+totalTaxFood)};
      await pushN("Private Taxes Collected",`The Quaestores collected ${totalTaxGold}T and ${totalTaxFood}M from private estate income.`);
    }
    await db.set("spqr_wealth",nextWealth);
    await db.set("spqr_g",ng);
    const finalHist=await db.get("spqr_econ")||[];
    if(finalHist.length){await db.set("spqr_econ",[...finalHist.slice(0,-1),economySnapshot(ng,regs,nl,D.cavalry||DEF_CAVALRY,D.fleets||DEF_FLEETS)].slice(-24));}
    await db.set("spqr_deadline",null);
    setG(ng);setConfirmAdv(false);setMsg("Session advanced.");
    await pushN("session",`Session Advanced`,`The Senate enters ${newYear} BC ${newSeason} S${newSess}`);
    if(isWinterSeason(newSeason))await pushN("Winter Food Reduction",`The Republic has entered ${newSeason}. Food production from provinces and private estates is reduced by ${Math.round((1-WINTER_FOOD_MOD)*100)}%.`);
    onRefresh();setTimeout(()=>setMsg(""),3000);
  };
  const goBack=async()=>{
    if(!confirm("Go back one session? This changes only the calendar/session counter, not resources or orders."))return;
    let ng={...g};ng.session=Math.max(1,(ng.session||1)-1);
    const idx=seasonIndex(ng.season);const prev=(idx-1+SEASONS.length)%SEASONS.length;ng.season=SEASONS[prev];ng.sessionInSeason=1;if(idx===0)ng.year=(ng.year||218)+1;
    await db.set("spqr_g",ng);await db.set("spqr_deadline",null);setG(ng);setMsg("Went back one session.");onRefresh();setTimeout(()=>setMsg(""),3000);
  };
  const restartGame=async()=>{
    if(!confirm("Restart the campaign? This will reset resources, legions, regions, motions, orders, deadlines, elections and notifications. Senators and setup images/links are kept."))return;
    await db.set("spqr_g",DEF_GAME);await db.set("spqr_l",DEF_LEGIONS);await db.set("spqr_cav",DEF_CAVALRY);await db.set("spqr_f",DEF_FLEETS);await db.set("spqr_r",DEF_REGIONS);await db.set("spqr_m",[]);await db.set("spqr_o",[]);await db.set("spqr_deadline",null);await db.set("spqr_n",[]);await db.set("spqr_econ",[economySnapshot(DEF_GAME,DEF_REGIONS,DEF_LEGIONS,DEF_CAVALRY,DEF_FLEETS)]);await db.set("spqr_election",null);await db.set("spqr_elections",[]);await db.set("spqr_biz",DEF_BUSINESSES);await db.set("spqr_assets",[]);await db.set("spqr_wealth",{});await db.set("spqr_donations",[]);await db.set("spqr_wealthlog",[]);await db.set("spqr_history",[]);await db.set("spqr_parties",[]);
    setG(DEF_GAME);setRegs(DEF_REGIONS.map(r=>({...r})));setMsg("Game restarted.");onRefresh();setTimeout(()=>setMsg(""),3000);
  };
  return <div>
    {msg&&<div style={{padding:"0.55rem 0.8rem",background:"#F4FFF0",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.7rem",fontSize:"1rem"}}>{msg}</div>}
    <Card><STit c="Resources, Regions and Turn Control" sub="Economy and provinces are integrated. One campaign year has five seasons: Spring, Early Summer, Late Summer, Autumn and Winter. Winter automatically reduces food production."/>
      <div className="spqr-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"0.5rem",marginBottom:"0.75rem"}}>
        <Stat label="Session" value={g.session}/><Stat label="Season" value={`${g.season}`}/><Stat label="Year" value={`${g.year} BC`}/><Stat label="Net Gold" value={`${snap.netGold>=0?"+":""}${snap.netGold}T`} color={snap.netGold>=0?T.gre:T.rhi}/><Stat label="Net Food" value={`${snap.netFood>=0?"+":""}${snap.netFood}M`} color={snap.netFood>=0?T.gre:T.rhi}/>
      </div>
      <Row gap="0.5rem" wrap><Btn v="dark" onClick={()=>setConfirmAdv(true)}>▶ Advance Session</Btn><Btn v="ghost" onClick={goBack}>↩ Back One Turn</Btn><Btn v="red" onClick={restartGame}>⟲ Restart Game</Btn></Row>
    </Card>
    <ABackupRestore onRefresh={onRefresh}/>
    {confirmAdv&&<Modal title="ADVANCE SESSION — CONFIRM" onClose={()=>setConfirmAdv(false)}><div style={{marginBottom:"1rem"}}><STit c="Session Summary"/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"0.75rem"}}><Stat label="Current" value={sLab(g)}/><Stat label="After Advance" value={`${SEASONS[(seasonIndex(g.season)+1)%SEASONS.length]} · Turn ${(g.session||1)+1}`}/><Stat label="Gold Income" value={`+${totalGoldIncome}T`} color={T.gre}/><Stat label="Military Upkeep" value={`-${upkeepG}T`} color={T.rhi}/><Stat label="Food Income" value={`+${totalFoodIncome}M`} color={T.gre}/><Stat label="Military Food" value={`-${upkeepF}M`} color={T.rhi}/><Stat label="Gold After" value={`${fmt(Math.max(0,g.gold+totalGoldIncome-upkeepG))}T`}/><Stat label="Food After" value={`${fmt(Math.max(0,g.food+totalFoodIncome-upkeepF))}M`} color={T.green}/></div><div style={{color:T.mut,fontSize:"0.9rem",fontStyle:"italic"}}>Raising legions advance by 1 turn. Economy history will be updated.</div></div><Row gap="0.5rem"><Btn v="gold" onClick={doAdvance}>✓ Confirm — Advance Session</Btn><Btn v="ghost" onClick={()=>setConfirmAdv(false)}>Cancel</Btn></Row></Modal>}
    <ResourcesRegionsPanel D={{...D,game:g,regions:regs}}/>
    <Card><STit c="Military Upkeep Costs" sub="Edit upkeep for legions, cavalry and triremes. These are deducted from stockpiles when you advance the session or apply maintenance manually."/>
      <div className="spqr-stat-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.5rem",marginBottom:"0.75rem"}}>
        <Stat label="Active Legions" value={activeLegs.length} color={T.red}/>
        <Stat label="Active Cavalry Units" value={activeCavalry(D.cavalry||DEF_CAVALRY).length} color={T.gold}/>
        <Stat label="Active Triremes" value={fleetTriremes(D.fleets||DEF_FLEETS)} color={T.blue}/>
        <Stat label="Gold Maintenance" value={`-${fmt(upkeepG)}T`} color={T.rhi}/>
        <Stat label="Food Maintenance" value={`-${fmt(upkeepF)}M`} color={T.rhi}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"0.5rem",marginBottom:"0.75rem"}}>
        {[["legionUpkeep","Gold / Legion"],["legionFood","Food / Legion"],["cavalryUpkeep","Gold / Cavalry Unit"],["cavalryFood","Food / Cavalry Unit"],["fleetUpkeep","Gold / Trireme"],["fleetFood","Food / Trireme"]].map(([k,l])=><div key={k}><Lbl c={l}/><input type="number" value={g[k]} onChange={e=>setG(x=>({...x,[k]:Number(e.target.value)}))} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.48rem 0.6rem",fontSize:"1.12rem"}}/></div>)}
      </div>
      <Row gap="0.5rem" wrap><Btn onClick={save}>💾 Save Maintenance Costs</Btn><Btn v="red" onClick={applyMaintenance}>− Apply Maintenance Now</Btn></Row>
    </Card>
    <Card><STit c="Edit Stockpile and Raising Costs"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"0.5rem",marginBottom:"0.75rem"}}>{[["gold","Gold Stockpile"],["food","Food Stockpile"],["pop","Population"],["lgold","Gold to Raise Legion"],["lfood","Food to Raise Legion"],["lpop","Men to Raise Legion"],["lturns","Turns to Raise Legion"],["cgold","Gold to Raise Cavalry"],["cfood","Food to Raise Cavalry"],["cpop","Riders to Raise Cavalry"],["cturns","Turns to Raise Cavalry"],["fgold","Gold per Trireme"],["ffood","Food per Trireme"],["fpop","Crew per Trireme"],["fturns","Turns to Build Fleet"]].map(([k,l])=><div key={k}><Lbl c={l}/><input type="number" value={g[k]} onChange={e=>setG(x=>({...x,[k]:Number(e.target.value)}))} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.48rem 0.6rem",fontSize:"1.12rem"}}/></div>)}</div>
      <Btn onClick={save}>💾 Save Stockpile and Regions</Btn>
    </Card>
    <Card><STit c="Edit Provinces / Regions"/><Row gap="0.5rem" wrap><Btn v="green" onClick={addRegion}>＋ Add Province</Btn><Btn onClick={save}>💾 Save</Btn></Row></Card>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"0.55rem"}}>{regs.map((r,i)=>{const st=RS[r.s]||RS.roman;return <Card key={r.id||i} style={{borderLeft:`4px solid ${st.c}`}}><Inp label="Province Name" value={r.name} onChange={v=>updReg(i,"name",v)}/><Inp label="Capital" value={r.capital||""} onChange={v=>updReg(i,"capital",v)}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.4rem"}}><div><Lbl c="Population"/><input type="number" value={r.pop||0} onChange={e=>updReg(i,"pop",e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.35rem"}}/></div><div><Lbl c="Base Gold"/><input type="number" value={r.bG} onChange={e=>updReg(i,"bG",e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.35rem"}}/></div><div><Lbl c="Base Food"/><input type="number" value={r.bF} onChange={e=>updReg(i,"bF",e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.35rem"}}/></div></div><div style={{marginTop:"0.5rem"}}><Lbl c="Control"/><select value={r.s} onChange={e=>updReg(i,"s",e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${st.c}`,color:T.text,padding:"0.4rem"}}>{Object.entries(RS).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select></div><div style={{marginTop:"0.5rem",color:st.c,fontFamily:"'Cinzel',serif"}}>Effective: {Math.floor((r.bG||0)*st.m)}T / {Math.floor((r.bF||0)*st.m)}M</div><div style={{marginTop:"0.5rem"}}><Btn v="red" sm onClick={()=>delRegion(i)}>Delete Province</Btn></div></Card>})}</div>
  </div>;
}

function ARegions({D,onRefresh}){
  const [regs,setRegs]=useState(null);
  const [msg,setMsg]=useState("");
  useEffect(()=>{setRegs((D.regions||DEF_REGIONS).map(r=>({...r})));},[D.regions]);
  if(!regs)return null;
  const upd=(i,k,v)=>setRegs(rs=>rs.map((r,j)=>j===i?{...r,[k]:isNaN(Number(v))&&k!=="s"?v:k==="s"?v:Number(v)}:r));
  const save=async()=>{await db.set("spqr_r",regs);setMsg("Saved.");onRefresh();setTimeout(()=>setMsg(""),2500);};
  const g={...DEF_GAME,...(D.game||{})};
  const inc=calcInc(regs,g);
  const privateTaxes=totalPrivateTaxProjection(D.players||[],D.assets||[],D.businesses||DEF_BUSINESSES,D.wealth||{},g);
  const totalGoldIncome=inc.gold+privateTaxes.gold;
  const totalFoodIncome=inc.food+privateTaxes.food;
  return(
    <div>
      {msg&&<div style={{padding:"0.4rem 0.75rem",background:"#0a1a0a",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.6rem",fontSize:"0.85rem"}}>{msg}</div>}
      <Card>
        <STit c="Projected Income from Regions"/>
        <Row gap="0.75rem">
          <Stat label="Provincial Gold Income" value={`+${fmt(inc.gold)}T`} color={T.gre}/><Stat label="Senator Tax Income" value={`+${fmt(privateTaxes.gold)}T`} color={RES.gold.color}/><Stat label="Total Gold Income" value={`+${fmt(totalGoldIncome)}T`} color={RES.gold.color}/>
          <Stat label="Provincial Food Income" value={`+${fmt(inc.food)}M`} color="#A0D060"/><Stat label="Senator Tax Income" value={`+${fmt(privateTaxes.food)}M`} color={RES.food.color}/><Stat label="Total Food Income" value={`+${fmt(totalFoodIncome)}M`} color={RES.food.color}/>
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
                  <div key={k}><Lbl c={l}/><input type="number" value={r[k]} onChange={e=>upd(i,k,e.target.value)} style={{width:"100%",background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.2rem 0.35rem",fontSize:"0.9rem"}}/></div>
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
    if(status==="voting"&&all.some(x=>x.id!==id&&x.status==="voting")){alert("Only one motion may be open to vote at a time. Conclude the current open motion first.");return;}
    await db.set("spqr_m",all.map(x=>x.id===id?{...x,status}:x));
    if(status==="voting"&&m)await pushN("motion_open",`Motion Open to Vote`,`"${m.title}" is now open for a Senate vote.`);
    if((status==="passed"||status==="failed")&&m)await pushN("motion_result",`Motion ${status.toUpperCase()}`,`"${m.title}" has ${status}.`);
    onRefresh();
  };
  const vetoMotion=async(motion)=>{
    if(!user.role||!["tribune_1","tribune_2"].includes(user.role)){setErr("Only Tribunes may veto motions.");return;}
    const g=await db.get("spqr_g")||DEF_GAME;const sess=sLab(g);const key=`${user.id}_${sess}`;
    const used=await db.get("spqr_vetoes")||{};
    if(used[key]){setErr("You have already used your veto this season.");return;}
    if(!confirm(`Veto and cancel motion: ${motion.title}?`))return;
    const all=await db.get("spqr_m")||[];
    await db.set("spqr_m",all.map(x=>x.id===motion.id?{...x,status:"vetoed",vetoedBy:user.id,vetoedByName:user.latinName,vetoedAt:new Date().toISOString()}:x));
    await db.set("spqr_vetoes",{...used,[key]:motion.id});
    await pushN("Tribunician Veto",`${user.latinName} has vetoed the motion: "${motion.title}".`);
    onRefresh();
  };
  const scol={pending:T.mut,voting:T.gold,passed:T.gre,failed:T.rhi,rejected:"#555",vetoed:T.rhi};
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
          <div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"0.9rem",letterSpacing:"0.15em",marginBottom:"0.4rem",marginTop:"0.75rem",display:"flex",gap:"0.5rem",alignItems:"center"}}>
            {sess}{sess===currSess&&<Badge c="CURRENT" color={T.gold} sm/>}
          </div>
          {grouped[sess].map(o=>{
            const pos=o.role?POS[o.role]:null;
            return(
              <Card key={o.id} style={{borderLeft:`3px solid ${pos?.color||T.fnt}`,marginBottom:"0.4rem"}}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:"0.4rem",marginBottom:"0.35rem"}}>
                  <div>
                    <span style={{fontFamily:"'Cinzel',serif",color:pos?.color||T.mut,fontWeight:700,fontSize:"0.9rem"}}>{pos?.title||o.role}</span>
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


function AElections({D,onRefresh}){
  const elections=D.elections||normalizeElections(null,D.election);
  const [office,setOffice]=useState("consul_1");
  const [msg,setMsg]=useState("");
  const [selected,setSelected]=useState(null);
  const [showVotes,setShowVotes]=useState({});
  const players=D.players||[];
  const active=elections.filter(e=>e&&e.status!=="closed");
  const [activeElectionId,setActiveElectionId]=useState(null);
  useEffect(()=>{if(active.length && (!activeElectionId || !active.some(e=>e.id===activeElectionId)))setActiveElectionId(active[0].id);},[active.length,activeElectionId]);
  const visibleElection=active.find(e=>e.id===activeElectionId)||active[0];
  const saveElections=async(next)=>{await db.set("spqr_elections",next);await db.set("spqr_election",null);};
  const start=async()=>{
    if(active.some(e=>e.office===office&&e.status!=="closed")){setMsg("There is already an active election for this office.");return;}
    const e={id:Date.now().toString()+"_"+office,status:"candidacy",office,session:sLab(D.game||DEF_GAME),candidates:[],votes:{},round:1,openedAt:new Date().toISOString()};
    await saveElections([...elections.filter(x=>x.status!=="closed"),e]);
    await pushN("Election Opened",`Candidacies are now open for ${POS[office]?.title||office}.`);
    setMsg("Election candidacy phase opened.");onRefresh();
  };
  const updateElection=async(id,patch)=>{
    const all=await db.get("spqr_elections")||active;
    const updated=all.map(e=>e.id===id?{...e,...patch}:e);
    await saveElections(updated);onRefresh();
  };
  const openVoting=async(election)=>{
    if((election.candidates||[]).length<1){setMsg("There are no candidates yet for this office.");return;}
    await updateElection(election.id,{status:"voting",votes:{}});
    await pushN("Election Voting Open",`Voting has opened for ${POS[election.office]?.title||election.office}.`);
    setMsg("Voting phase opened.");
  };
  const closeElection=async(election)=>{
    const counts={};Object.values(election.votes||{}).forEach(id=>counts[id]=(counts[id]||0)+1);
    const cands=election.candidates||[];
    if(cands.length===0){setMsg("No candidates. Election removed.");await saveElections(active.filter(e=>e.id!==election.id));onRefresh();return;}
    const max=Math.max(0,...cands.map(c=>counts[c.playerId]||0));
    const winners=cands.filter(c=>(counts[c.playerId]||0)===max);
    if(winners.length!==1 || max===0){
      const fresh={...election,status:"candidacy",candidates:[],votes:{},round:(election.round||1)+1,draw:true};
      await saveElections(active.map(e=>e.id===election.id?fresh:e));
      await pushN("Election Draw",`The election for ${POS[election.office]?.title||election.office} ended in a draw. Candidacies reopen.`);
      setMsg("Draw or no votes. This election has restarted with a new candidacy phase.");onRefresh();return;
    }
    const winner=winners[0];
    const updatedPlayers=players.map(p=>{
      if(p.role===election.office&&p.id!==winner.playerId)return{...p,role:null};
      if(p.id===winner.playerId)return{...p,role:election.office};
      return p;
    });
    await db.set("spqr_p",updatedPlayers);
    const closed={...election,status:"closed",winnerId:winner.playerId,winnerName:winner.name,closedAt:new Date().toISOString()};
    await saveElections(active.map(e=>e.id===election.id?closed:e));
    await pushN("Election Result",`${winner.name} has been elected ${POS[election.office]?.title||election.office}.`);
    setMsg(`${winner.name} elected and assigned to ${POS[election.office]?.title||election.office}.`);onRefresh();
  };
  const cancel=async(election)=>{if(!confirm(`Cancel the election for ${POS[election.office]?.title||election.office}?`))return;await saveElections(active.filter(e=>e.id!==election.id));setMsg("Election cancelled.");onRefresh();};
  return <div>
    {msg&&<div style={{padding:"0.55rem 0.8rem",background:"#F4FFF0",border:`1px solid ${T.gre}`,color:T.gre,marginBottom:"0.7rem"}}>{msg}</div>}
    <Card><STit c="Magistrate Election Control" sub="You can open several elections at the same time, one per magistracy. Each office has its own candidacy, voting and result."/>
      <Row gap="0.5rem" wrap><select value={office} onChange={e=>setOffice(e.target.value)} style={{background:T.surf,border:`1px solid ${T.border}`,color:T.text,padding:"0.45rem",fontFamily:"'Cinzel',serif"}}>{Object.entries(POS).map(([k,v])=><option key={k} value={k}>{v.emoji||"🏛️"} {v.title}</option>)}</select><Btn v="green" onClick={start}>Open Another Candidacy</Btn></Row>
    </Card>
    {active.length===0&&<Card><div style={{color:T.mut,fontStyle:"italic"}}>No active elections. Open candidacy for any magistracy above.</div></Card>}
    {active.length>0&&<ElectionRoleTabs elections={active} selectedId={visibleElection.id} onSelect={setActiveElectionId}/>}
    {visibleElection&&[visibleElection].map(election=>{
      const officeInfo=POS[election.office];
      const counts={};Object.values(election.votes||{}).forEach(id=>counts[id]=(counts[id]||0)+1);
      return <Card key={election.id} style={{borderLeft:`6px solid ${officeInfo?.color||T.gold}`,background:officeInfo?.bg||T.card}}>
        <Row gap="0.5rem" wrap><Badge c={`${officeInfo?.emoji||"🏛️"} ${officeInfo?.title||election.office} — ${election.status.toUpperCase()} — Round ${election.round||1}`} color={officeInfo?.color||T.gold}/>{election.status==="candidacy"&&<Btn onClick={()=>openVoting(election)}>Open Voting Phase</Btn>}{election.status==="voting"&&<Btn v="green" onClick={()=>closeElection(election)}>Close & Assign Winner</Btn>}<Btn v="red" onClick={()=>cancel(election)}>Cancel</Btn></Row>
        <STit c="Candidates" sub="Candidate table with speeches. Vote record is hidden by default and can be expanded."/>
        {(election.candidates||[]).length===0&&<div style={{color:T.mut,fontStyle:"italic"}}>No candidates yet.</div>}
        {(election.candidates||[]).length>0&&<div style={{overflowX:"auto"}}>
          <table className="election-table">
            <thead><tr><th>Candidate</th><th>Class</th><th>Speech</th><th>Tally</th></tr></thead>
            <tbody>{(election.candidates||[]).map(c=>{const cp=players.find(p=>p.id===c.playerId);return <tr key={c.playerId}>
              <td data-label="Candidate"><button onClick={()=>cp&&setSelected(cp)} style={{background:"none",border:"none",padding:0,cursor:cp?"pointer":"default",fontFamily:"'Cinzel',serif",fontWeight:900,color:cp?T.blue:T.text,fontSize:"0.9rem",textDecoration:cp?"underline":"none",lineHeight:1.2}}>{c.name||getPlayerName(players,c.playerId)}</button>{c.discord&&<div style={{color:"#5865F2",fontSize:"0.82rem"}}>{c.discord}</div>}</td>
              <td data-label="Class">{cp?<ClassBadge cls={cp.charClass} sm/>:<span style={{color:T.mut}}>{c.charClass||"—"}</span>}</td>
              <td data-label="Speech"><div className="election-speech" style={{color:T.mut}}>{c.speech||"No speech recorded."}</div></td>
              <td data-label="Votes"><span style={{fontFamily:"'Cinzel',serif",fontSize:"1.15rem",fontWeight:900,color:T.ghi}}>{counts[c.playerId]||0}</span></td>
            </tr>})}</tbody>
          </table>
        </div>}
        {(election.candidates||[]).length>0&&<div style={{marginTop:"0.55rem"}}><button onClick={()=>setShowVotes({...showVotes,[election.id]:!showVotes[election.id]})} style={{background:"none",border:"none",color:T.blue,fontFamily:"'Cinzel',serif",fontWeight:900,cursor:"pointer",fontSize:"0.9rem"}}>{showVotes[election.id]?"▲ Hide vote record":"▼ Show vote record"}</button>{showVotes[election.id]&&<ElectionVoteRecord election={election} players={players} onSelect={setSelected}/>}</div>}
        {selected&&<SenatorProfileModal player={selected} onClose={()=>setSelected(null)}/>}
      </Card>;
    })}
  </div>;
}

/* ══ ADMIN APP ════════════════════════════════════════════════════════════ */

function AParties({D,onRefresh}){
  const parties=D.parties||[];const players=D.players||[];
  const save=async(next)=>{await db.set("spqr_parties",next);onRefresh&&onRefresh();};
  const removeParty=async(id)=>{if(!confirm("Delete this political party?"))return;await save(parties.filter(p=>p.id!==id));};
  const patchParty=async(id,patch)=>{await save(parties.map(p=>p.id===id?{...p,...patch}:p));};
  const setLeader=async(pt,pid)=>{const pl=players.find(p=>p.id===pid);if(!pl)return;await patchParty(pt.id,{leaderId:pid,leaderName:pl.latinName});await addHistory(pid,"Party Leadership",`${pl.latinName} was appointed leader of ${pt.name} by the Game Master.`,`party`);};
  const addMember=async(pt,pid)=>{const pl=players.find(p=>p.id===pid);if(!pl)return;const currentParty=partyOf(parties,pid);let next=parties.map(p=>p.id===pt.id?{...p,members:Array.from(new Set([...(p.members||[]),pid])),invites:(p.invites||[]).filter(x=>x!==pid)}:p);if(currentParty&&currentParty.id!==pt.id){next=next.map(p=>p.id===currentParty.id?{...p,members:(p.members||[]).filter(x=>x!==pid)}:p);}await db.set("spqr_parties",next);await addHistory(pid,"Party Membership",`${pl.latinName} was assigned to ${pt.name} by the Game Master.`,`party`);onRefresh&&onRefresh();};
  const removeMember=async(pt,pid)=>{const pl=players.find(p=>p.id===pid);let remaining=(pt.members||[]).filter(id=>id!==pid);let patch={members:remaining};if(pt.leaderId===pid){patch.leaderId=remaining[0]||null;patch.leaderName=players.find(p=>p.id===remaining[0])?.latinName||"Vacant";}await patchParty(pt.id,patch);if(pl)await addHistory(pid,"Party Membership",`${pl.latinName} was removed from ${pt.name} by the Game Master.`,`party`);};
  return <div><Card><STit c="Political Parties — Game Master Control" sub="The Game Master can control all party identity, leaders, members, descriptions, histories and political platforms."/>{parties.length===0&&<div style={{color:T.mut,fontStyle:"italic"}}>No parties yet.</div>}<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"0.7rem"}}>{parties.map(pt=><Card key={pt.id} style={{border:`1px solid ${pt.color||T.border}`,borderLeft:`6px solid ${pt.color||T.blue}`}}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"0.45rem"}}><Inp label="Name" value={pt.name||""} onChange={v=>patchParty(pt.id,{name:v})}/><Inp label="Emoji" value={pt.emoji||"🏛️"} onChange={v=>patchParty(pt.id,{emoji:v})}/><Inp label="Color" value={pt.color||"#A32020"} onChange={v=>patchParty(pt.id,{color:v})}/></div><Inp label="Short Description" value={pt.description||""} onChange={v=>patchParty(pt.id,{description:v})} rows={2}/><Inp label="Platform" value={pt.platform||""} onChange={v=>patchParty(pt.id,{platform:v})} rows={3}/><Inp label="Party History" value={pt.history||""} onChange={v=>patchParty(pt.id,{history:v})} rows={3}/><div style={{color:T.mut,marginBottom:"0.35rem"}}>Founder: {pt.founderName||pt.leaderName||"Unknown"}</div><div><Lbl c="Leader"/><select value={pt.leaderId||""} onChange={e=>setLeader(pt,e.target.value)} style={{width:"100%",padding:"0.45rem",border:`1px solid ${T.border}`,background:T.card}}><option value="">Vacant</option>{(pt.members||[]).map(id=>players.find(p=>p.id===id)).filter(Boolean).map(p=><option key={p.id} value={p.id}>{p.latinName}</option>)}</select></div><STit c="Members"/><div style={{display:"flex",gap:"0.35rem",flexWrap:"wrap",marginBottom:"0.5rem"}}>{(pt.members||[]).map(id=>players.find(p=>p.id===id)).filter(Boolean).map(p=><span key={p.id} style={{border:`1px solid ${T.border}`,padding:"0.18rem 0.35rem",background:T.bg}}>{p.latinName} <button onClick={()=>removeMember(pt,p.id)} style={{border:"none",background:"transparent",color:T.rhi,cursor:"pointer"}}>×</button></span>)}</div><div><Lbl c="Add Member"/><select defaultValue="" onChange={e=>{if(e.target.value){addMember(pt,e.target.value);e.target.value="";}}} style={{width:"100%",padding:"0.45rem",border:`1px solid ${T.border}`,background:T.card}}><option value="">Choose senator...</option>{players.filter(p=>!(pt.members||[]).includes(p.id)).map(p=><option key={p.id} value={p.id}>{p.latinName}</option>)}</select></div><div style={{marginTop:"0.6rem"}}><Btn v="red" sm onClick={()=>removeParty(pt.id)}>Delete Party</Btn></div></Card>)}</div></Card></div>;
}


function ARegistry({D}){
  const [q,setQ]=useState("");
  const [pid,setPid]=useState("all");
  const [kind,setKind]=useState("all");
  const players=D.players||[];
  const pname=id=>players.find(p=>p.id===id)?.latinName||players.find(p=>p.id===id)?.username||"Unknown Senator";
  const pclass=id=>players.find(p=>p.id===id)?.charClass||"";
  const events=[];
  (D.history||[]).forEach(h=>events.push({id:`h-${h.id}`,ts:h.ts||0,playerId:h.playerId,kind:h.type||"history",title:h.title||"History",body:h.body||"",source:"Personal History"}));
  (D.orders||[]).forEach(o=>events.push({id:`o-${o.id}`,ts:o.ts||0,playerId:o.playerId,kind:"order",title:`Order submitted — ${o.role||"Office"}`,body:o.text||"",session:o.session,source:"Orders"}));
  (D.motions||[]).forEach(m=>events.push({id:`m-${m.id}`,ts:m.ts||0,playerId:m.playerId,kind:"motion",title:`Motion ${m.status?`(${m.status})`:""}`,body:`${m.title||"Untitled motion"}${m.text?`\n\n${m.text}`:""}`,session:m.session,source:"Motions"}));
  (D.donations||[]).forEach(d=>events.push({id:`d-${d.id}`,ts:d.ts||0,playerId:d.playerId,kind:"donation",title:"Donation to the Republic",body:`Donated ${d.amount}${d.kind==="gold"?"T gold":"M food"} to the state.`,session:d.session,source:"Donations"}));
  (D.wealthlog||[]).forEach(w=>events.push({id:`w-${w.id||w.ts}`,ts:w.ts||0,playerId:w.playerId||null,kind:w.type||"wealth",title:"Public wealth ledger",body:w.text||"",session:w.session,source:"Wealth Ledger"}));
  (D.elections||[]).forEach(e=>{
    (e.candidates||[]).forEach(c=>events.push({id:`ec-${e.id}-${c.playerId}`,ts:c.ts||e.ts||0,playerId:c.playerId,kind:"election",title:`Candidacy — ${POS[e.office]?.title||e.office}`,body:c.speech||"No speech recorded.",source:"Elections"}));
    Object.entries(e.votes||{}).forEach(([voter,cand])=>events.push({id:`ev-${e.id}-${voter}`,ts:e.voteTs?.[voter]||e.updatedAt||e.ts||0,playerId:voter,kind:"vote",title:`Vote cast — ${POS[e.office]?.title||e.office}`,body:`Voted for ${pname(cand)}.`,source:"Elections"}));
  });
  const kinds=Array.from(new Set(events.map(e=>e.kind))).sort();
  const filtered=events.sort((a,b)=>(b.ts||0)-(a.ts||0)).filter(e=>{
    const text=`${pname(e.playerId)} ${pclass(e.playerId)} ${e.kind} ${e.title} ${e.body} ${e.session||""} ${e.source||""}`.toLowerCase();
    if(pid!=="all"&&e.playerId!==pid)return false;
    if(kind!=="all"&&e.kind!==kind)return false;
    if(q&& !text.includes(q.toLowerCase()))return false;
    return true;
  });
  const bySenator={};events.forEach(e=>{if(!e.playerId)return;bySenator[e.playerId]=(bySenator[e.playerId]||0)+1;});
  const top=Object.entries(bySenator).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const exportCSV=()=>{
    const rows=[["Date","Senator","Class","Type","Title","Session","Source","Details"],...filtered.map(e=>[new Date(e.ts||0).toLocaleString(),pname(e.playerId),pclass(e.playerId),e.kind,e.title,e.session||"",e.source||"",String(e.body||"").replace(/\n/g," ")])];
    const csv=rows.map(r=>r.map(x=>`"${String(x??"").replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`rome-yes-gm-registry-${Date.now()}.csv`;a.click();URL.revokeObjectURL(url);
  };
  return <div>
    <Card><STit c="Game Master Registry" sub="A searchable ledger of what every senator has done: offices, orders, motions, votes, wealth actions, donations, estates, party actions, warnings and deaths."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0.55rem",marginBottom:"0.7rem"}}>
        <Stat label="Total records" value={events.length}/><Stat label="Senators tracked" value={Object.keys(bySenator).length}/><Stat label="Filtered results" value={filtered.length}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"minmax(220px,2fr) minmax(180px,1fr) minmax(160px,1fr) auto",gap:"0.5rem",alignItems:"end"}}>
        <Inp label="Search registry" value={q} onChange={setQ} placeholder="name, office, order, donation, party, estate..."/>
        <div><Lbl c="Senator"/><select value={pid} onChange={e=>setPid(e.target.value)} style={{width:"100%",padding:"0.45rem",background:T.card,border:`1px solid ${T.border}`}}><option value="all">All senators</option>{players.map(p=><option key={p.id} value={p.id}>{p.latinName}</option>)}</select></div>
        <div><Lbl c="Type"/><select value={kind} onChange={e=>setKind(e.target.value)} style={{width:"100%",padding:"0.45rem",background:T.card,border:`1px solid ${T.border}`}}><option value="all">All types</option>{kinds.map(k=><option key={k} value={k}>{k}</option>)}</select></div>
        <Btn onClick={exportCSV}>Export CSV</Btn>
      </div>
    </Card>
    <Card><STit c="Most Active Senators" sub="Quick activity count based on recorded actions."/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:"0.45rem"}}>{top.map(([id,count])=>{const p=players.find(x=>x.id===id);const ci=getClassInfo(p?.charClass);return <div key={id} style={{padding:"0.5rem",border:`1px solid ${ci.color}`,background:ci.bg,display:"flex",justifyContent:"space-between",gap:"0.6rem"}}><b style={{color:ci.color}}>{ci.emoji} {pname(id)}</b><span>{count} records</span></div>})}{top.length===0&&<div style={{color:T.mut,fontStyle:"italic"}}>No registry entries yet.</div>}</div>
    </Card>
    <Card><STit c="Chronological Registry" sub="Newest actions first. Use filters above to inspect a specific senator or type of action."/>
      <div style={{display:"grid",gap:"0.45rem"}}>{filtered.slice(0,300).map(e=>{const p=players.find(x=>x.id===e.playerId);const ci=getClassInfo(p?.charClass);const color=e.kind==="death"?T.rhi:e.kind==="donation"?T.gre:e.kind==="order"?T.blue:e.kind==="motion"?T.gold:e.kind==="vote"?"#6D28D9":ci.color;return <div key={e.id} style={{border:`1px solid ${T.border}`,borderLeft:`5px solid ${color}`,background:T.surf,padding:"0.55rem 0.7rem"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:"0.6rem",flexWrap:"wrap",alignItems:"center"}}><div><Badge c={e.kind} color={color} sm/> <b style={{fontFamily:"'Cinzel',serif",color:color}}>{e.playerId?pname(e.playerId):"Public / State"}</b>{p&&<span style={{marginLeft:"0.35rem"}}><ClassBadge cls={p.charClass} sm/></span>}</div><span style={{color:T.fnt,fontSize:"0.78rem"}}>{e.ts?new Date(e.ts).toLocaleString():"No date"}</span></div>
        <div style={{fontFamily:"'Cinzel',serif",fontWeight:900,color:T.ghi,marginTop:"0.25rem"}}>{e.title}</div>
        {e.session&&<div style={{fontSize:"0.8rem",color:T.mut}}>Session: {e.session} · Source: {e.source}</div>}
        <div style={{whiteSpace:"pre-wrap",lineHeight:1.45,marginTop:"0.25rem"}}>{e.body}</div>
      </div>})}{filtered.length===0&&<div style={{color:T.mut,fontStyle:"italic"}}>No registry entries match the current filters.</div>}</div>
    </Card>
  </div>;
}

function AdminApp({onLogout}){
  const [tab,setTab]=useState("overview");
  const [group,setGroup]=useState("gov");
  const [D,setD]=useState({players:[],game:DEF_GAME,legions:DEF_LEGIONS,regions:DEF_REGIONS,motions:[],orders:[],deadline:null,cfg:{},laws:LAWS,econ:[],election:null,elections:[],cavalry:DEF_CAVALRY,fleets:DEF_FLEETS,businesses:DEF_BUSINESSES,assets:[],wealth:{},donations:[],history:[],parties:[],wealthlog:[],cemetery:[],forceTypes:FORCE_TYPES,courts:[],reputation:{},replog:[],repRules:DEF_REP_RULES});

  const refresh=useCallback(async()=>{
    const [players,game,legions,regions,motions,orders,deadline,cfg,laws,econ,election,elections,cavalry,fleets,businesses,assets,wealth,donations,history,parties,wealthlog,cemetery,forceTypes,courts,reputation,replog,repRules]=await Promise.all([
      db.get("spqr_p"),db.get("spqr_g"),db.get("spqr_l"),db.get("spqr_r"),
      db.get("spqr_m"),db.get("spqr_o"),db.get("spqr_deadline"),db.get("spqr_cfg"),db.get("spqr_laws"),db.get("spqr_econ"),db.get("spqr_election"),db.get("spqr_elections"),db.get("spqr_cav"),db.get("spqr_f"),db.get("spqr_biz"),db.get("spqr_assets"),db.get("spqr_wealth"),db.get("spqr_donations"),db.get("spqr_history"),db.get("spqr_parties"),db.get("spqr_wealthlog"),db.get("spqr_cemetery"),db.get("spqr_force_types"),db.get("spqr_courts"),db.get("spqr_reputation"),db.get("spqr_replog"),db.get("spqr_rep_rules")
    ]);
    const allElections=normalizeElections(elections,election);
    setD({players:players||[],game:game||DEF_GAME,legions:legions||DEF_LEGIONS,
      regions:regions||DEF_REGIONS,motions:motions||[],orders:orders||[],deadline:deadline||null,cfg:cfg||{},laws:laws||LAWS,econ:econ||[],election:election||null,elections:allElections,cavalry:cavalry||DEF_CAVALRY,fleets:fleets||DEF_FLEETS,businesses:(businesses&&businesses.length)?businesses:DEF_BUSINESSES,assets:assets||[],wealth:wealth||{},donations:donations||[],history:history||[],parties:parties||[],wealthlog:wealthlog||[],cemetery:cemetery||[],forceTypes:(forceTypes&&forceTypes.length)?forceTypes:FORCE_TYPES,courts:courts||[],reputation:reputation||{},replog:replog||[],repRules:repRules||DEF_REP_RULES});
  },[]);

  useEffect(()=>{refresh();const t=setInterval(refresh,20000);return()=>clearInterval(t);},[refresh]);

  const pendM=(D.motions||[]).filter(m=>m.status==="pending").length;
  const newO=(D.orders||[]).filter(o=>o.status==="pending").length;
  const openE=(D.elections||[]).filter(e=>e.status!=="closed").length;
  const GROUPS=[
    {key:"gov",label:"🏛️ Government",tone:"gov",tabs:[
      {k:"overview",l:"Overview"},{k:"senators",l:"Senators"},{k:"resources",l:"Resources"},{k:"regions",l:"Regions"},{k:"legions",l:"Armed Forces"},{k:"magistrates",l:"Magistrates"},{k:"courts",l:"Courts"},{k:"elections",l:`Elections${openE?` (${openE})`:""}`},{k:"motions",l:`Motions${pendM?` (${pendM})`:""}`},{k:"orders",l:`Orders${newO?` (${newO})`:""}`}
    ]},
    {key:"personal",label:"👤 Personal / Politics",tone:"personal",tabs:[
      {k:"businesses",l:"Private Wealth"},{k:"reputation",l:"Reputation"},{k:"parties",l:"Parties"},{k:"registry",l:"Registry"}
    ]},
    {key:"records",label:"📜 Records / Setup",tone:"records",tabs:[
      {k:"cemetery",l:"Cemetery"},{k:"laws",l:"Laws"},{k:"setup",l:"Setup & Media"}
    ]},
  ];
  const activeGroup=GROUPS.find(g=>g.key===group)||GROUPS[0];
  const activeTabs=activeGroup.tabs;
  const toneColor=tone=>tone==="personal"?"#2563EB":tone==="records"?"#5B21B6":"#B45309";
  const toneBg=tone=>tone==="personal"?"#EAF2FF":tone==="records"?"#F3E8FF":"#FFF0D6";
  const chooseGroup=(g)=>{setGroup(g.key); if(!g.tabs.some(t=>t.k===tab))setTab(g.tabs[0].k);};

  return(
    <div style={{minHeight:"100vh",background:T.bg}}>
      <style>{CSS}</style>
      <div className="spqr-topbar" style={{background:"#0A0600",borderBottom:`2px solid ${T.red}`,padding:"0.5rem 1rem",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.4rem",position:"sticky",top:0,zIndex:100}}>
        <Row gap="0.6rem" wrap><div style={{fontFamily:"'Cinzel',serif",color:T.gold,fontSize:"1rem",fontWeight:900,letterSpacing:"0.22em"}}>SPQR</div><SeasonPill game={D.game}/><Badge c="GM PANEL" color={T.rhi}/></Row>
        <Row gap="0.5rem" wrap>
          <span style={{color:T.mut,fontSize:"0.75rem",fontFamily:"'Cinzel',serif"}}>{D.game.year} BC · Turn {D.game.session}</span>
          <NotifBell userId="gm"/>
          <Btn v="ghost" sm onClick={refresh}>↺</Btn>
          <Btn v="ghost" sm onClick={onLogout}>Exit Panel</Btn>
        </Row>
      </div>
      <div className="spqr-tabs" style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:T.surf,overflowX:"auto",position:"sticky",top:"45px",zIndex:99}}>
        {GROUPS.map(g=><button key={g.key} onClick={()=>chooseGroup(g)} style={{padding:"0.62rem 1.05rem",background:group===g.key?toneBg(g.tone):"transparent",color:group===g.key?toneColor(g.tone):T.mut,border:"none",borderTop:group===g.key?`3px solid ${toneColor(g.tone)}`:"3px solid transparent",fontFamily:"'Cinzel',serif",fontSize:"0.9rem",fontWeight:900,letterSpacing:"0.12em",whiteSpace:"nowrap",flexShrink:0}}>{g.label}</button>)}
      </div>
      <div className="spqr-tabs" style={{display:"flex",borderBottom:`1px solid ${T.border}`,background:toneBg(activeGroup.tone),overflowX:"auto",position:"sticky",top:"92px",zIndex:98}}>
        {activeTabs.map(it=><button key={it.k} onClick={()=>setTab(it.k)} style={{padding:"0.55rem 0.9rem",background:tab===it.k?T.card:"transparent",color:tab===it.k?toneColor(activeGroup.tone):T.mut,border:"none",borderBottom:tab===it.k?`3px solid ${toneColor(activeGroup.tone)}`:"3px solid transparent",fontFamily:"'Cinzel',serif",fontSize:"0.86rem",letterSpacing:"0.08em",whiteSpace:"nowrap",flexShrink:0}}>{it.l}</button>)}
      </div>
      <div className="spqr-shell" style={{maxWidth:1180,margin:"0 auto",padding:"1rem"}}>
        <ErrorBoundary key={tab}>
        {tab==="overview"  &&<AOverview D={D}/>} 
        {tab==="senators"  &&<ASenators D={D} onRefresh={refresh}/>} 
        {tab==="resources" &&<AResources D={D} onRefresh={refresh}/>} 
        {tab==="regions"   &&<ARegions D={D} onRefresh={refresh}/>} 
        {tab==="legions"   &&<ALegions D={D} onRefresh={refresh}/>} 
        {tab==="magistrates"&&<MagistratesPanel players={D.players}/>} 
        {tab==="courts"&&<CourtsPanel user={{id:"gm",latinName:"Game Master",role:"praetor_1"}} D={D} onRefresh={refresh} isGM/>} 
        {tab==="elections" &&<AElections D={D} onRefresh={refresh}/>} 
        {tab==="motions"   &&<AMotions D={D} onRefresh={refresh}/>} 
        {tab==="orders"    &&<AOrders D={D} onRefresh={refresh}/>} 
        {tab==="businesses"&&<ABusinesses D={D} onRefresh={refresh}/>} 
        {tab==="reputation"&&<AReputation D={D} onRefresh={refresh}/>} 
        {tab==="parties"   &&<AParties D={D} onRefresh={refresh}/>} 
        {tab==="registry"  &&<ARegistry D={D}/>} 
        {tab==="cemetery"&&<CemeteryPanel cemetery={D.cemetery||[]} players={D.players||[]}/>} 
        {tab==="laws"      &&<ALaws D={D} onRefresh={refresh}/>} 
        {tab==="setup"     &&<ASetup D={D} onRefresh={refresh}/>} 
        </ErrorBoundary>
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
    const wealth=await db.get("spqr_wealth")||{};
    await db.set("spqr_wealth",{...wealth,[np.id]:startingWealthForClass(np.charClass)});
    const reps=await db.get("spqr_reputation")||{};
    await db.set("spqr_reputation",{...reps,[np.id]:{score:defaultRepFor(np),scandals:[]}});
    await addHistory(np.id,"Entered the Senate",`${np.latinName} registered as a ${np.charClass}.`,"profile");
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
          <div style={{color:T.fnt,fontSize:"0.72rem",letterSpacing:"0.3em",marginTop:"0.2rem",fontFamily:"'Cinzel',serif"}}>218 BC · THE SENATE AT WAR</div>
        </div>

        <div style={{background:T.surf,border:`1px solid ${T.border}`,padding:"1.5rem",boxShadow:`0 0 120px rgba(200,146,42,0.06)`}}>
          {/* Mode tabs */}
          <div style={{display:"flex",border:`1px solid ${T.border}`,marginBottom:"1.25rem",overflow:"hidden"}}>
            {[["login","Senator Login"],["register","Enroll"],["admin","GM"]].map(([m,l])=>(
              <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"0.42rem 0.25rem",background:mode===m?T.gold:"transparent",color:mode===m?T.bg:T.mut,border:"none",fontFamily:"'Cinzel',serif",fontSize:"0.72rem",letterSpacing:"0.1em",cursor:"pointer"}}>
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
                <select value={f.cls} onChange={e=>setF(x=>({...x,cls:e.target.value}))} style={{width:"100%",background:T.card,border:`1px solid ${T.border}`,color:T.text,padding:"0.42rem 0.6rem",fontFamily:"'EB Garamond',serif",fontSize:"1.05rem"}}>
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
          db.set("spqr_cav",DEF_CAVALRY),
          db.set("spqr_f",DEF_FLEETS),
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
