#!/usr/bin/env node
// Merge scanner output into toolbox.json. Never edits overrides.json; hand-written text is kept.
// Usage: node merge.mjs   (reads scans/code.json and scans/chat.json if present)
import fs from 'fs';
const read=(f,d=null)=>fs.existsSync(f)?JSON.parse(fs.readFileSync(f,'utf8')):d;
const tb=read('toolbox.json'); if(!tb){console.error('toolbox.json not found');process.exit(1);}
const scans={code:read('scans/code.json'),chat:read('scans/chat.json')};
const ran=Object.keys(scans).filter(k=>scans[k]);
if(!ran.length){console.log('No scan files in scans/. Nothing to merge.');process.exit(0);}

const norm=n=>String(n).toLowerCase().trim().replace(/^\//,'').split(':').pop().replace(/[\s_-]+/g,' ');
const keysOf=o=>[o.name,...(o.aliases||[])].flatMap(n=>String(n).split(/,| \/ | → /)).map(norm).filter(Boolean);
const CAT={skill:'skills','local-skill':'local',plugin:'plugins',connector:'connectors',mcp:'connectors',local:'local'};
const CATNAME={skills:'New skills',plugins:'New plugins',connectors:'New connectors',local:'New on your Mac'};

// last run's NEW becomes normal
tb.groups.forEach(g=>g.items.forEach(i=>{if(i.status==='new')i.status='active';}));

// indexes: tracked tools, and tracked plugin groups
const itemIdx=new Map(), groupIdx=new Map();
tb.groups.forEach(g=>{
  if(g.cat==='plugins') keysOf(g).forEach(k=>groupIdx.set(k,g));
  g.items.forEach(i=>keysOf(i).forEach(k=>itemIdx.set(k,i)));
});

// what each scan saw. plugin-skill entries (skills bundled inside a plugin) are ignored on purpose
const seen=new Map();
ran.forEach(src=>(scans[src].items||[]).forEach(it=>{
  if(it.type==='plugin-skill') return;
  const k=(it.type==='plugin'?'P:':'I:')+norm(it.name);
  if(!seen.has(k))seen.set(k,{it,by:new Set()}); seen.get(k).by.add(src);
}));

let added=0, tracked=0, upgraded=0;
for(const [k,{it,by}] of seen){
  const nk=k.slice(2), bys=[...by];
  const hit = it.type==='plugin' ? groupIdx.get(nk) : itemIdx.get(nk);
  if(hit){
    hit.seenBy=bys; tracked++;
    // evidence rule: an unconfirmed single-side label that BOTH scans can see is really Both
    if(hit.platform && !hit.confirmed && hit.platform!=='both' && by.size===2){hit.platform='both';hit.confirmed=true;upgraded++;}
    continue;
  }
  const cat=CAT[it.type]||'skills';
  let g=tb.groups.find(x=>x.id==='new-'+cat);
  if(!g){g={id:'new-'+cat,cat,name:CATNAME[cat],blurb:'Found by a scan and not sorted into a group yet. Move each into the right group in toolbox.json.',items:[]};tb.groups.push(g);}
  let platform=it.platform, confirmed=false;
  if(!platform){
    if(by.size===2){platform='both';confirmed=true;}
    else if(ran.length===2&&by.has('code'))platform='code';
    else if(ran.length===2&&by.has('chat'))platform='chat';
    else platform='both';
  } else confirmed=!!it.evidence;
  g.items.push({name:it.name,platform,use:it.use||'New. Add a one-line use case.',confirmed,status:'new',seenBy:bys,auto:true});
  added++;
}

// auto-added tools that no scan saw this time (only checked when both sides ran)
let gone=0;
if(ran.length===2) tb.groups.forEach(g=>g.items.forEach(i=>{if(i.auto&&!seen.has('I:'+norm(i.name))&&!seen.has('P:'+norm(i.name))){i.status='unseen';gone++;}}));

tb.sources=tb.sources||{};
ran.forEach(s=>{tb.sources[s]=scans[s].scannedAt||new Date().toISOString().slice(0,10);});
tb.scanned=new Date().toISOString().slice(0,10);
fs.writeFileSync('toolbox.json',JSON.stringify(tb,null,1));
console.log(`Scans used: ${ran.join(', ')} | already tracked: ${tracked} (labels upgraded to Both: ${upgraded}) | new tools: ${added} | no longer seen: ${gone}`);
