// scenes.jsx — Alpis Fusion CRM demo video scenes
// Each scene is a <Sprite> spanning its timeline window.
// All scenes share the portfolio palette via CSS vars on the stage.

const PALETTE = {
  bg:    '#faf6ef',   // warm cream page
  ink:   '#1b1a17',   // dark ink
  dim:   '#6b665c',   // muted
  rule:  '#e5dfcf',   // hairlines
  accent:'#2f8f83',   // portfolio teal (CRM/dashboard dev aesthetic)
  accent2:'#d97757',  // warm terracotta secondary
  soft:  '#f0e9d8',   // soft card
  grn:   '#4a8a5c',
  hot:   '#c85a3f',
};

// ---------- Shared chrome ----------
function AppChrome({ page, activeNav, children, tint }) {
  return (
    <div style={{
      position:'absolute', left:80, top:110, width:1760, height:880,
      background:'#fff', borderRadius:10,
      boxShadow:'0 30px 80px rgba(27,26,23,0.18), 0 2px 0 rgba(27,26,23,0.06)',
      border:`1px solid ${PALETTE.rule}`, overflow:'hidden', display:'flex',
      fontFamily:'Inter, system-ui, sans-serif', color:PALETTE.ink,
    }}>
      {/* Sidebar */}
      <div style={{
        width:260, background:PALETTE.soft, borderRight:`1px solid ${PALETTE.rule}`,
        padding:'28px 20px', display:'flex', flexDirection:'column', gap:22,
      }}>
        <div style={{fontFamily:'Fraunces, serif', fontWeight:600, fontSize:28, letterSpacing:'-0.02em'}}>
          <em style={{color:PALETTE.accent, fontStyle:'italic'}}>Alpis</em> Fusion
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:4}}>
          {['Dashboard','Clienți','Pipeline','Bookings','Facturare','Automatizări','Rapoarte','Setări'].map((n,i)=>(
            <div key={n} style={{
              padding:'10px 12px', borderRadius:6,
              background: n===activeNav ? PALETTE.ink : 'transparent',
              color: n===activeNav ? PALETTE.bg : PALETTE.ink,
              fontSize:15, fontWeight:500,
              display:'flex', alignItems:'center', gap:10,
            }}>
              <span style={{width:8,height:8,borderRadius:2,background:'currentColor',opacity:.75}}/>
              {n}
            </div>
          ))}
        </div>
      </div>
      {/* Main */}
      <div style={{flex:1, display:'flex', flexDirection:'column', minWidth:0, background:tint||'#fff'}}>
        <div style={{
          height:58, borderBottom:`1px solid ${PALETTE.rule}`,
          display:'flex', alignItems:'center', padding:'0 24px', gap:14,
          background:'#fcfbf7',
        }}>
          <div style={{fontFamily:'JetBrains Mono, monospace', fontSize:12, color:PALETTE.dim, letterSpacing:'0.08em', textTransform:'uppercase'}}>
            {page}
          </div>
          <div style={{flex:1}}/>
          <div style={{
            fontFamily:'JetBrains Mono, monospace', fontSize:12, color:PALETTE.dim,
            border:`1px solid ${PALETTE.rule}`, padding:'6px 12px', borderRadius:6,
            display:'flex', gap:8, alignItems:'center', background:'#fff',
          }}>
            <span style={{color:PALETTE.ink}}>⌘K</span>
            <span>Search everything…</span>
          </div>
          <div style={{width:32, height:32, borderRadius:999, background:PALETTE.ink}}/>
        </div>
        <div style={{flex:1, position:'relative', overflow:'hidden'}}>{children}</div>
      </div>
    </div>
  );
}

// ---------- Timecode / cue ----------
function Cue({ tc, title, sub }) {
  return (
    <>
      <div style={{
        position:'absolute', left:80, top:40,
        fontFamily:'JetBrains Mono, monospace', fontSize:14, letterSpacing:'0.14em',
        color:PALETTE.dim, textTransform:'uppercase',
      }}>
        <span style={{color:PALETTE.accent2}}>●</span> REC · {tc}
      </div>
      <div style={{
        position:'absolute', right:80, top:34,
        fontFamily:'Fraunces, serif', fontSize:22, fontWeight:500, letterSpacing:'-0.01em',
        color:PALETTE.ink, textAlign:'right',
      }}>
        {title}
        {sub && <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, letterSpacing:'0.1em', textTransform:'uppercase', marginTop:4}}>{sub}</div>}
      </div>
    </>
  );
}

// ---------- Cursor ----------
function Cursor({ x, y, clicking=false }) {
  return (
    <div style={{position:'absolute', left:x, top:y, pointerEvents:'none', zIndex:50,
      transform:'translate(-4px,-2px)', filter:'drop-shadow(0 3px 6px rgba(0,0,0,0.25))'}}>
      <svg width="28" height="34" viewBox="0 0 12 14">
        <path d="M1 1 L1 11 L4 8 L7 13 L9 12 L6 7 L10 7 Z" fill={PALETTE.ink} stroke="#fff" strokeWidth="0.6"/>
      </svg>
      {clicking && (
        <div style={{
          position:'absolute', left:-10, top:-4, width:28, height:28, borderRadius:999,
          border:`2px solid ${PALETTE.accent}`, opacity:0.6,
          animation:'click-ping 0.5s ease-out',
        }}/>
      )}
    </div>
  );
}

// ---------- KPI tile ----------
function KPI({ label, value, delta, deltaColor, highlight, sparkSeed=0 }) {
  const bars = Array.from({length:22},(_,i)=> 30 + ((Math.sin(i*1.3 + sparkSeed)*0.5+0.5) * 70));
  return (
    <div style={{
      border:`1px solid ${highlight?PALETTE.ink:PALETTE.rule}`, borderRadius:8,
      padding:'16px 18px', background: highlight ? '#fffbea' : '#fff',
      display:'flex', flexDirection:'column', gap:8, minHeight:118,
      outline: highlight ? `2px solid ${PALETTE.ink}` : 'none',
      outlineOffset: highlight ? '-1px' : 0,
      transition:'all .3s',
    }}>
      <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, letterSpacing:'0.1em', textTransform:'uppercase'}}>{label}</div>
      <div style={{fontFamily:'Fraunces,serif', fontSize:36, fontWeight:500, letterSpacing:'-0.02em', lineHeight:1}}>{value}</div>
      <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:deltaColor||PALETTE.grn}}>{delta}</div>
      <div style={{display:'flex', alignItems:'flex-end', gap:2, height:22, marginTop:'auto'}}>
        {bars.map((b,i)=> <div key={i} style={{flex:1, height:`${b}%`, background:PALETTE.accent, opacity:.55, borderRadius:1}}/>)}
      </div>
    </div>
  );
}

// ---------- Dashboard view (reusable) ----------
function DashboardView({ hoveredKPI=-1, revealRows=4 }) {
  return (
    <div style={{padding:28, height:'100%', display:'flex', flexDirection:'column', gap:18}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16}}>
        <KPI label="Venit Q2"    value="€284.5k" delta="▲ +12.4%" highlight={hoveredKPI===0} sparkSeed={0.2}/>
        <KPI label="Deals activ" value="47"      delta="▲ +3"     highlight={hoveredKPI===1} sparkSeed={1.1}/>
        <KPI label="Rata conv."  value="23.8%"   delta="▲ +1.2%"  highlight={hoveredKPI===2} sparkSeed={2.4}/>
        <KPI label="Booking/zi"  value="18"      delta="▼ −2" deltaColor={PALETTE.hot} highlight={hoveredKPI===3} sparkSeed={3.7}/>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16, flex:1, minHeight:0}}>
        <div style={{border:`1px solid ${PALETTE.rule}`, borderRadius:8, padding:16, background:'#fff', display:'flex', flexDirection:'column', gap:8}}>
          <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, letterSpacing:'0.1em', textTransform:'uppercase'}}>Revenue · 30 zile</div>
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{width:'100%', flex:1, minHeight:0}}>
            <path d={generatePath(31)} fill={PALETTE.accent} fillOpacity="0.18" stroke="none"/>
            <path d={generateLine(31)} fill="none" stroke={PALETTE.ink} strokeWidth="0.4" vectorEffect="non-scaling-stroke"/>
          </svg>
        </div>
        <div style={{border:`1px solid ${PALETTE.rule}`, borderRadius:8, padding:16, background:'#fff', display:'flex', flexDirection:'column', gap:6}}>
          <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6}}>Live activity</div>
          {[
            ['11:02','Deal #482 won · €12.4k'],
            ['10:58','Booking creat · Popescu'],
            ['10:51','Invoice #INV-2041 sent'],
            ['10:47','Lead adăugat · A. Dumitru'],
            ['10:39','Email deschis · 3 clienți'],
          ].slice(0,revealRows).map(([t,e],i)=>(
            <div key={i} style={{display:'flex', gap:10, alignItems:'baseline', fontSize:13, padding:'4px 0', borderBottom:`1px dashed ${PALETTE.rule}`}}>
              <span style={{width:8,height:8,borderRadius:999,background:PALETTE.grn,display:'inline-block'}}/>
              <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, minWidth:42}}>{t}</span>
              <span>{e}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function generateLine(n){
  const pts=[];let y=22;
  for(let i=0;i<n;i++){y += (Math.sin(i*0.7)+Math.cos(i*1.3))*1.2; y = Math.max(6, Math.min(36, y)); pts.push([i*(100/(n-1)), y]);}
  return pts.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
}
function generatePath(n){ return generateLine(n) + ' L 100 40 L 0 40 Z'; }

// ---------- Scene 1: Dashboard idle (0–4s) ----------
function Scene1() {
  const { localTime, duration } = useSprite();
  return (
    <>
      <Cue tc="00:00 → 00:04" title="Prima respirație" sub="Dashboard · idle · 4s"/>
      <AppChrome page="Dashboard · Q2 2026" activeNav="Dashboard">
        <DashboardView hoveredKPI={-1} revealRows={Math.min(5, 1 + Math.floor(localTime*1.3))}/>
      </AppChrome>
    </>
  );
}

// ---------- Scene 2: Hover KPI (4–6s) ----------
function Scene2() {
  const { localTime } = useSprite();
  const cx = interpolate([0, 1.2],[1500, 520], Easing.easeInOutCubic)(localTime);
  const cy = interpolate([0, 1.2],[700, 260],  Easing.easeInOutCubic)(localTime);
  const showTip = localTime > 1.0;
  return (
    <>
      <Cue tc="00:04 → 00:06" title="Hover KPI" sub="Venit Q2 · breakdown"/>
      <AppChrome page="Dashboard · Q2 2026" activeNav="Dashboard">
        <DashboardView hoveredKPI={localTime>0.9 ? 0 : -1} revealRows={5}/>
        {showTip && (
          <div style={{
            position:'absolute', left:190, top:320, width:360, zIndex:20,
            background:PALETTE.ink, color:PALETTE.bg, borderRadius:8, padding:'14px 16px',
            boxShadow:'0 18px 40px rgba(0,0,0,0.25)',
            opacity: Math.min(1,(localTime-1.0)*5),
            transform:`translateY(${Math.max(0,(1.3-localTime)*8)}px)`,
          }}>
            <div style={{fontFamily:'Fraunces,serif', fontWeight:600, fontSize:18}}>Venit Q2 · €284.5k</div>
            <div style={{fontSize:12, color:'#c8b37a', marginTop:2, fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.06em'}}>BREAKDOWN PE PRODUSE</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr auto', gap:'4px 14px', marginTop:10, fontSize:13, fontFamily:'JetBrains Mono,monospace'}}>
              <span>Fusion Pro</span><span>€182.4k</span>
              <span>Fusion Lite</span><span>€72.1k</span>
              <span>Add-ons</span><span>€30.0k</span>
            </div>
          </div>
        )}
      </AppChrome>
      <Cursor x={cx} y={cy}/>
    </>
  );
}

// ---------- Scene 3: Command palette (6–10s) ----------
function Scene3() {
  const { localTime } = useSprite();
  // typing "clien" over 1.6s starting at t=0.4
  const txt = 'clien';
  const typeStart = 0.5;
  const typed = localTime < typeStart ? 0 : Math.min(txt.length, Math.floor((localTime-typeStart)/0.3));
  const paletteIn = Math.min(1, Math.max(0, localTime/0.35));
  return (
    <>
      <Cue tc="00:06 → 00:10" title="Command palette" sub="⌘K · Power user"/>
      <AppChrome page="Dashboard · ⌘K" activeNav="Dashboard" tint="rgba(27,26,23,0.02)">
        <div style={{opacity:0.5, filter:'saturate(0.7)'}}>
          <DashboardView hoveredKPI={-1} revealRows={5}/>
        </div>
        {/* overlay */}
        <div style={{
          position:'absolute', inset:0, background:'rgba(27,26,23,0.32)', backdropFilter:'blur(2px)',
          display:'flex', justifyContent:'center', paddingTop:110, opacity:paletteIn,
        }}>
          <div style={{
            width:720, background:'#fff', borderRadius:10, overflow:'hidden',
            boxShadow:'0 40px 80px rgba(0,0,0,0.35)',
            transform:`translateY(${(1-paletteIn)*16}px)`,
          }}>
            <div style={{padding:'18px 20px', borderBottom:`1px solid ${PALETTE.rule}`, display:'flex', alignItems:'center', gap:12}}>
              <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:20, color:PALETTE.ink, letterSpacing:'0.02em'}}>
                {txt.slice(0, typed)}
                <span style={{display:'inline-block', width:2, height:22, background:PALETTE.ink, marginLeft:2, verticalAlign:'middle', animation:'caret 1s step-end infinite'}}/>
              </span>
              <div style={{flex:1}}/>
              <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:12, color:PALETTE.dim, border:`1px solid ${PALETTE.rule}`, padding:'4px 10px', borderRadius:6}}>⌘K</div>
            </div>
            {[
              ['Go to Clienți', '↵ enter', true],
              ['Creează client nou', '⌘N', false],
              ['Filtru: clienți inactivi', 'F', false],
              ['Export: clienți .csv', '⌘E', false],
            ].map(([label,hint,on],i)=>(
              <div key={i} style={{
                padding:'16px 20px', borderBottom:`1px solid ${PALETTE.rule}`,
                display:'flex', alignItems:'center', gap:12,
                background: on && typed>=txt.length ? PALETTE.ink : '#fff',
                color:   on && typed>=txt.length ? PALETTE.bg  : PALETTE.ink,
              }}>
                <span style={{width:20, height:20, background:on&&typed>=txt.length?PALETTE.accent:PALETTE.soft, borderRadius:4}}/>
                <span style={{fontSize:15, fontWeight: on?500:400}}>{label}</span>
                <span style={{flex:1}}/>
                <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:12, opacity:0.7}}>{hint}</span>
              </div>
            ))}
          </div>
        </div>
      </AppChrome>
      {/* keycap flash */}
      {localTime < 0.6 && (
        <div style={{
          position:'absolute', right:120, top:140,
          display:'flex', gap:6, opacity: Math.max(0, 1-localTime/0.6),
          transform:`scale(${1 + localTime*0.3})`,
        }}>
          {['⌘','K'].map((k,i)=>(
            <div key={i} style={{
              fontFamily:'JetBrains Mono,monospace', fontSize:28, fontWeight:600,
              background:'#fff', border:`2px solid ${PALETTE.ink}`, borderRadius:8,
              padding:'8px 14px', boxShadow:'0 4px 0 0 '+PALETTE.ink, color:PALETTE.ink,
            }}>{k}</div>
          ))}
        </div>
      )}
    </>
  );
}

// ---------- Scene 4: Clients list + hover card (10–14s) ----------
function Scene4() {
  const { localTime } = useSprite();
  const hv = localTime > 0.7;
  const cardIn = Math.max(0, Math.min(1,(localTime-1.0)/0.4));
  const cx = interpolate([0,1.1],[1650,900], Easing.easeInOutCubic)(localTime);
  const cy = interpolate([0,1.1],[200,380], Easing.easeInOutCubic)(localTime);
  const clients = [
    ['AD','A. Dumitru', 82, 'active'],
    ['MP','Maria Popescu', 94, 'active'],
    ['IS','I. Stan', 61, 'warm'],
    ['CI','C. Ilie', 44, 'warm'],
    ['RE','R. Enache', 78, 'active'],
    ['VM','V. Munteanu', 52, 'warm'],
    ['LG','L. Georgescu', 88, 'active'],
  ];
  return (
    <>
      <Cue tc="00:10 → 00:14" title="Hover preview client" sub="Scoring · programări"/>
      <AppChrome page="Clienți · 1 247 înreg." activeNav="Clienți">
        <div style={{padding:28, height:'100%', display:'flex', flexDirection:'column', gap:14}}>
          <div style={{display:'flex', gap:12}}>
            <div style={{border:`1px solid ${PALETTE.rule}`, borderRadius:6, padding:'10px 14px', fontFamily:'JetBrains Mono,monospace', fontSize:13, color:PALETTE.dim, background:'#fff', flex:1}}>Filter: toți clienții</div>
            <div style={{background:PALETTE.ink, color:PALETTE.bg, borderRadius:6, padding:'10px 16px', fontSize:13, fontWeight:500}}>+ Client nou</div>
          </div>
          <div style={{border:`1px solid ${PALETTE.rule}`, borderRadius:8, background:'#fff', flex:1, overflow:'hidden'}}>
            <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr 100px 80px', padding:'12px 18px', background:PALETTE.soft, fontFamily:'JetBrains Mono,monospace', fontSize:11, textTransform:'uppercase', color:PALETTE.dim, letterSpacing:'0.1em'}}>
              <span>Nume</span><span>Companie</span><span>Responsabil</span><span>Scor</span><span>St.</span>
            </div>
            {clients.map(([in_,nm,sc,st],i)=>(
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'2fr 1fr 1fr 100px 80px',
                padding:'14px 18px', borderBottom:`1px solid ${PALETTE.rule}`,
                fontSize:14, alignItems:'center',
                background: i===1 && hv ? '#fffbea' : '#fff',
              }}>
                <span style={{display:'flex', gap:10, alignItems:'center'}}>
                  <span style={{width:26, height:26, borderRadius:999, background:PALETTE.ink, color:PALETTE.accent, fontFamily:'Fraunces,serif', fontWeight:600, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center'}}>{in_}</span>
                  {nm}
                </span>
                <span style={{color:PALETTE.dim, fontSize:13}}>Popescu SRL</span>
                <span style={{color:PALETTE.dim, fontSize:13}}>A. Dumitru</span>
                <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:13}}>{sc}</span>
                <span><span style={{display:'inline-block', width:10, height:10, borderRadius:999, background: st==='active'?PALETTE.grn:'#d6a84e'}}/></span>
              </div>
            ))}
          </div>
        </div>
        {cardIn > 0 && (
          <div style={{
            position:'absolute', right:80, top:240, width:460, zIndex:30,
            background:'#fff', border:`1.5px solid ${PALETTE.ink}`, borderRadius:10,
            padding:22, boxShadow:'0 24px 60px rgba(0,0,0,0.22)',
            opacity: cardIn, transform:`translateY(${(1-cardIn)*10}px)`,
          }}>
            <div style={{display:'flex', gap:14, alignItems:'center'}}>
              <div style={{width:52, height:52, borderRadius:999, background:PALETTE.ink, color:PALETTE.accent, fontFamily:'Fraunces,serif', fontSize:20, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center'}}>MP</div>
              <div>
                <div style={{fontFamily:'Fraunces,serif', fontSize:22, fontWeight:600, letterSpacing:'-0.01em'}}>Maria Popescu</div>
                <div style={{fontSize:12, color:PALETTE.dim, fontFamily:'JetBrains Mono,monospace', textTransform:'uppercase', letterSpacing:'0.06em'}}>Popescu Retail SRL · Cluj</div>
              </div>
              <div style={{marginLeft:'auto', background:PALETTE.accent, color:'#fff', fontFamily:'JetBrains Mono,monospace', fontSize:13, padding:'4px 10px', borderRadius:4, fontWeight:600}}>94</div>
            </div>
            <div style={{marginTop:14, display:'flex', flexDirection:'column', gap:8}}>
              {[['Ultimă interacțiune','Azi · 09:41'],['Programări viitoare','3 · next Vi'],['Deal pipeline','€18.2k · Negotiation'],['NPS','9 / 10']].map(([k,v],i)=>(
                <div key={i} style={{display:'flex', justifyContent:'space-between', fontSize:13, color:PALETTE.dim, paddingBottom:6, borderBottom:`1px dashed ${PALETTE.rule}`}}>
                  <span>{k}</span><span style={{color:PALETTE.ink, fontFamily:'JetBrains Mono,monospace'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </AppChrome>
      <Cursor x={cx} y={cy}/>
    </>
  );
}

// ---------- Scene 5: Detail panel (14–18s) ----------
function Scene5() {
  const { localTime } = useSprite();
  const slide = Math.min(1, localTime/0.6);
  const panelX = interpolate([0,1],[1200,0], Easing.easeOutCubic)(slide);
  return (
    <>
      <Cue tc="00:14 → 00:18" title="Detail panel" sub="Timeline · Deals · Mesaje"/>
      <AppChrome page="Clienți / Maria Popescu" activeNav="Clienți">
        <div style={{padding:28, opacity:0.5, filter:'brightness(0.95)'}}>
          {/* faded list behind */}
          <div style={{border:`1px solid ${PALETTE.rule}`, borderRadius:8, background:'#fff', overflow:'hidden'}}>
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} style={{padding:'16px 18px', borderBottom:`1px solid ${PALETTE.rule}`, height:22}}/>
            ))}
          </div>
        </div>
        <div style={{
          position:'absolute', right:0, top:0, bottom:0, width:780,
          background:'#fff', borderLeft:`2px solid ${PALETTE.ink}`,
          boxShadow:'-20px 0 60px rgba(0,0,0,0.15)', padding:28,
          transform:`translateX(${panelX}px)`,
          display:'flex', flexDirection:'column', gap:18,
        }}>
          <div style={{display:'flex', gap:16, alignItems:'center'}}>
            <div style={{width:64, height:64, borderRadius:999, background:PALETTE.ink, color:PALETTE.accent, fontFamily:'Fraunces,serif', fontSize:24, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center'}}>MP</div>
            <div>
              <div style={{fontFamily:'Fraunces,serif', fontSize:30, fontWeight:500, letterSpacing:'-0.02em'}}>Maria Popescu</div>
              <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:12, color:PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.08em'}}>Popescu Retail SRL · Cluj · CUI RO12345678</div>
            </div>
            <div style={{marginLeft:'auto', background:PALETTE.accent, color:'#fff', padding:'6px 12px', borderRadius:4, fontFamily:'JetBrains Mono,monospace', fontSize:14, fontWeight:600}}>94</div>
          </div>
          <div style={{display:'flex', gap:24, fontFamily:'JetBrains Mono,monospace', fontSize:12, color:PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em', borderBottom:`1px solid ${PALETTE.rule}`, paddingBottom:8}}>
            <span style={{color:PALETTE.ink, borderBottom:`2px solid ${PALETTE.ink}`, paddingBottom:8, marginBottom:-9}}>Timeline</span>
            <span>Deals</span><span>Mesaje</span><span>Docs</span><span>Facturi</span>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:16, paddingLeft:20, borderLeft:`1.5px dashed ${PALETTE.rule}`, marginLeft:6, flex:1, overflow:'hidden'}}>
            {[
              ['azi · 09:41','Email deschis: „Ofertă Q2 — follow-up”'],
              ['ieri · 16:02','Booking creat · Consult. Vi 14:00'],
              ['Lu · 11:15','Deal avansat → Negotiation · €18.2k'],
              ['sâm. trecut','NPS 9/10 — „răspuns rapid, soluție curată.”'],
              ['mar. 18','Factură INV-2019 plătită · €2 840'],
            ].slice(0, Math.min(5, 1 + Math.floor(localTime*1.5))).map(([t,e],i)=>(
              <div key={i} style={{position:'relative', fontSize:14, lineHeight:1.5, opacity: Math.min(1,(localTime- (0.6+i*0.25))*3)}}>
                <div style={{position:'absolute', left:-28, top:5, width:11, height:11, borderRadius:999, background:PALETTE.accent, border:`2px solid ${PALETTE.ink}`}}/>
                <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.08em'}}>{t}</div>
                <div>{e}</div>
              </div>
            ))}
          </div>
        </div>
      </AppChrome>
    </>
  );
}

// ---------- Scene 6+7: Kanban drag (18–26s) ----------
// (Merges shot 6 keyboard jump + shot 7 kanban drag)
function Scene6() {
  const { localTime, duration } = useSprite();
  // keypress flash first 0.8s; then pipeline visible; drag from 2.0s to 5.5s
  const keycapT = localTime < 1.2 ? Math.max(0, 1 - localTime/1.2) : 0;
  const dragStart = 2.2, dragEnd = 5.5;
  const dragP = clamp((localTime-dragStart)/(dragEnd-dragStart), 0, 1);
  const dragging = localTime > dragStart && localTime < dragEnd + 0.3;
  // column x positions within pipeline area (relative to chrome content area width ~1500)
  const col0x = 40, col1x = 390;
  const cardY = 90;
  const cardX = interpolate([0,1],[col0x, col1x], Easing.easeInOutCubic)(dragP);
  const cardLift = Math.sin(dragP*Math.PI) * 14;

  const cols = [
    ['Lead', 12, [['Vodamar SRL','€4.2k · A.D.'], ['NordLogic','€2.1k · M.P.']]],
    ['Contacted', 8, [['Delta Farm','€7.6k · L.G.'], ['Altis','€3.0k · I.S.']]],
    ['Negotiation', 5, [['Popescu Retail','€18.2k · M.P.'], ['Munteanu & Co','€9.8k · V.M.']]],
    ['Won', 14, [['Enache Imp.','€12.4k · R.E.'], ['Ilie Tehnic','€5.1k · C.I.']]],
  ];

  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  return (
    <>
      <Cue tc="00:18 → 00:26" title="Kanban · Drag deal" sub="Lead → Contacted"/>
      <AppChrome page="Pipeline · Q2" activeNav="Pipeline">
        <div style={{padding:28, height:'100%', display:'flex', flexDirection:'column', gap:16}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, flex:1, minHeight:0}}>
            {cols.map(([nm,ct,cards],ci)=>(
              <div key={ci} style={{background:PALETTE.soft, border:`1px solid ${PALETTE.rule}`, borderRadius:8, padding:12, display:'flex', flexDirection:'column', gap:10}}>
                <div style={{display:'flex', justifyContent:'space-between', fontFamily:'JetBrains Mono,monospace', fontSize:11, textTransform:'uppercase', letterSpacing:'0.1em', color:PALETTE.dim}}>
                  <b style={{color:PALETTE.ink}}>{nm}</b><span>{ct}</span>
                </div>
                {ci===0 && (
                  <div style={{
                    background:'#fff', border:`1px solid ${PALETTE.rule}`, borderRadius:6, padding:10,
                    opacity: dragging ? 0.0 : 1,
                    height: dragging ? 58 : 'auto',
                    borderStyle: dragging ? 'dashed' : 'solid',
                  }}>
                    {!dragging && <>
                      <div style={{fontSize:13, fontWeight:500}}>Vodamar SRL</div>
                      <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, marginTop:4}}>€4.2k · A.D.</div>
                    </>}
                  </div>
                )}
                {cards.map(([n,s],i)=>(
                  <div key={i} style={{background:'#fff', border:`1px solid ${PALETTE.rule}`, borderRadius:6, padding:10}}>
                    <div style={{fontSize:13, fontWeight:500}}>{n}</div>
                    <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, marginTop:4}}>{s}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* dragged card */}
        {dragging && (
          <div style={{
            position:'absolute',
            left: 28 + cardX,
            top: 140 + cardY - cardLift,
            width:320,
            background:'#fff', border:`1.5px solid ${PALETTE.accent}`, borderRadius:6, padding:12,
            boxShadow:'0 22px 40px rgba(0,0,0,0.25)',
            transform:'rotate(-2deg)',
            zIndex:30,
          }}>
            <div style={{fontSize:14, fontWeight:500}}>Vodamar SRL</div>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.accent, marginTop:4}}>Lead → Contacted</div>
          </div>
        )}
      </AppChrome>
      {/* keycap flash P */}
      {keycapT > 0 && (
        <div style={{
          position:'absolute', left:960, top:120, transform:`translate(-50%, -50%) scale(${1+keycapT*0.4})`,
          opacity:keycapT,
        }}>
          <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:36, fontWeight:700,
            background:'#fff', border:`3px solid ${PALETTE.ink}`, borderRadius:10,
            padding:'12px 22px', boxShadow:'0 6px 0 0 '+PALETTE.ink, color:PALETTE.ink,
          }}>P</div>
        </div>
      )}
    </>
  );
}

// ---------- Scene 8: Booking conflict (26–30s) ----------
function Scene8() {
  const { localTime } = useSprite();
  const showConflict = localTime > 1.4;
  const flash = showConflict && Math.sin((localTime-1.4)*6) > 0;
  return (
    <>
      <Cue tc="00:26 → 00:30" title="Booking · conflict detection" sub="⚠ Diferențiator"/>
      <AppChrome page="Bookings / Nou" activeNav="Bookings">
        <div style={{padding:32, display:'flex', gap:24, height:'100%'}}>
          <div style={{flex:1, background:'#fff', border:`1px solid ${PALETTE.rule}`, borderRadius:10, padding:28, display:'flex', flexDirection:'column', gap:16}}>
            <div style={{fontFamily:'Fraunces,serif', fontSize:26, fontWeight:500, letterSpacing:'-0.02em'}}>Creează booking</div>
            {[
              ['Client','Maria Popescu'],
              ['Dată','Vi · 24.04.2026'],
              ['Interval','14:00 → 15:00'],
              ['Responsabil','A. Dumitru'],
              ['Locație','Cluj HQ · Sala 2'],
            ].map(([l,v],i)=>(
              <div key={i} style={{opacity: Math.min(1, localTime*1.8 - i*0.18)}}>
                <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4}}>{l}</div>
                <div style={{border:`1px solid ${PALETTE.rule}`, borderRadius:6, padding:'10px 14px', fontSize:15, background:'#fafaf5'}}>{v}</div>
              </div>
            ))}
            {showConflict && (
              <div style={{
                marginTop:'auto', background:'#fff1ec', border:`1.5px solid ${PALETTE.hot}`, borderRadius:8,
                padding:'14px 18px', display:'flex', gap:14, alignItems:'flex-start',
                boxShadow: flash ? `0 0 0 6px rgba(200,90,63,0.18)` : '0 0 0 0 transparent',
                transition:'box-shadow .2s', opacity: Math.min(1,(localTime-1.4)*3),
                transform:`translateY(${Math.max(0,(1.6-localTime)*8)}px)`,
              }}>
                <div style={{fontFamily:'Fraunces,serif', fontSize:28, fontWeight:700, color:PALETTE.hot, lineHeight:1}}>⚠</div>
                <div style={{fontSize:13, lineHeight:1.5, color:'#7a2d1c'}}>
                  <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, textTransform:'uppercase', letterSpacing:'0.1em', fontWeight:600, marginBottom:4}}>Conflict de timp</div>
                  A. Dumitru are deja <b>Consult. Stan</b> la 14:30 – 15:30.
                  <div style={{marginTop:6, color:PALETTE.ink}}>Sugestie: <b>15:45</b> · sau altă persoană.</div>
                </div>
              </div>
            )}
          </div>
          <div style={{width:440, background:PALETTE.soft, border:`1px solid ${PALETTE.rule}`, borderRadius:10, padding:20, display:'flex', flexDirection:'column', gap:10}}>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em'}}>Calendar · A. Dumitru · Vi</div>
            {Array.from({length:10}).map((_,i)=>{
              const hr = 9+i;
              const isConflict = hr===14 || hr===15;
              const isNew = hr===14;
              return (
                <div key={i} style={{display:'flex', gap:10, alignItems:'center', fontSize:13, fontFamily:'JetBrains Mono,monospace'}}>
                  <span style={{color:PALETTE.dim, width:42}}>{String(hr).padStart(2,'0')}:00</span>
                  <div style={{flex:1, height:20, background:'#fff', border:`1px solid ${PALETTE.rule}`, borderRadius:3, position:'relative'}}>
                    {hr===10 && <div style={{position:'absolute', inset:2, background:PALETTE.accent, opacity:0.25, borderRadius:2}}/>}
                    {isConflict && <div style={{position:'absolute', inset:2, background: isNew && showConflict ? 'repeating-linear-gradient(45deg,'+PALETTE.hot+' 0 6px, #fff1ec 6px 12px)' : PALETTE.accent+'44', borderRadius:2, border: isNew && showConflict ? `1.5px solid ${PALETTE.hot}`:'none'}}/>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AppChrome>
    </>
  );
}

// ---------- Scene 9: Invoice (30–34s) ----------
function Scene9() {
  const { localTime } = useSprite();
  // Paper slides up from bottom at t=0.3
  const paperIn = Math.min(1, Math.max(0,(localTime-0.3)/0.6));
  const paperY = interpolate([0,1],[400, 0], Easing.easeOutCubic)(paperIn);
  const linesVisible = Math.min(5, Math.floor((localTime-0.9)*4));
  return (
    <>
      <Cue tc="00:30 → 00:34" title="Factură end-to-end" sub="PDF · Print preview"/>
      <AppChrome page="Facturare · Print preview" activeNav="Facturare" tint="#d9d2c0">
        <div style={{height:'100%', padding:'40px 0', display:'flex', justifyContent:'center', alignItems:'center', position:'relative'}}>
          <div style={{
            width:620, aspectRatio:'210/297', background:'#fff',
            boxShadow:'0 40px 80px rgba(0,0,0,0.25), 0 0 0 1px '+PALETTE.rule,
            padding:'40px 44px', display:'flex', flexDirection:'column', gap:14,
            transform:`translateY(${paperY}px)`, opacity:paperIn,
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:`1px solid ${PALETTE.rule}`, paddingBottom:14}}>
              <div style={{fontFamily:'Fraunces,serif', fontWeight:600, fontSize:22, letterSpacing:'-0.02em'}}>
                <em style={{color:PALETTE.accent}}>Alpis</em> Fusion
                <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4, fontStyle:'normal'}}>CRM · Facturare</div>
              </div>
              <div style={{textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim}}>
                <div style={{textTransform:'uppercase', letterSpacing:'0.1em'}}>FACTURĂ</div>
                <div style={{fontSize:18, color:PALETTE.ink, fontWeight:600, margin:'4px 0'}}>INV-2042</div>
                <div>22.04.2026</div>
              </div>
            </div>
            <div style={{fontSize:12, lineHeight:1.5, color:PALETTE.dim}}>
              <b style={{color:PALETTE.ink}}>Popescu Retail SRL</b> · Cluj-Napoca<br/>
              CUI RO 12345678 · J12/456/2019<br/>
              Str. Eroilor 42, 400124
            </div>
            <div style={{marginTop:8}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 60px 80px', fontFamily:'JetBrains Mono,monospace', fontSize:10, color:PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.08em', borderBottom:`1px solid ${PALETTE.ink}`, paddingBottom:6, marginBottom:8}}>
                <span>Descriere</span><span>Cant.</span><span style={{textAlign:'right'}}>Total</span>
              </div>
              {[
                ['Consultanță Vi 14:00', '1', '€180.00'],
                ['Fusion Pro · lună',     '1', '€49.00'],
                ['Add-on Reporting',      '1', '€19.00'],
                ['Setup onboarding',      '1', '€0.00'],
                ['TVA 19%',               '', '€47.12'],
              ].slice(0, linesVisible).map(([d,q,v],i)=>(
                <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 60px 80px', fontFamily:'JetBrains Mono,monospace', fontSize:12, padding:'6px 0', borderBottom:`1px dotted ${PALETTE.rule}`}}>
                  <span>{d}</span><span>{q}</span><span style={{textAlign:'right'}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:'auto', display:'flex', justifyContent:'space-between', borderTop:`2px solid ${PALETTE.ink}`, paddingTop:10, fontFamily:'Fraunces,serif', fontSize:22, fontWeight:600}}>
              <span>Total</span><span>€295.12</span>
            </div>
          </div>
          {paperIn > 0.8 && (
            <div style={{position:'absolute', right:100, bottom:120, display:'flex', gap:10, opacity: Math.min(1,(paperIn-0.8)*5)}}>
              <div style={{background:PALETTE.ink, color:PALETTE.bg, fontFamily:'JetBrains Mono,monospace', fontSize:13, padding:'10px 18px', borderRadius:6, letterSpacing:'0.06em', textTransform:'uppercase'}}>Print PDF ↓</div>
              <div style={{background:'#fff', border:`1px solid ${PALETTE.ink}`, fontFamily:'JetBrains Mono,monospace', fontSize:13, padding:'10px 18px', borderRadius:6, color:PALETTE.ink, textTransform:'uppercase', letterSpacing:'0.06em'}}>Trimite email</div>
            </div>
          )}
        </div>
      </AppChrome>
    </>
  );
}

// ---------- Scene 10: Flow builder (34–38s) ----------
function Scene10() {
  const { localTime } = useSprite();
  const nodes = [
    {x:140, y:180, label:'Client nou', kind:'trg',  t:0.0},
    {x:440, y:340, label:'Email welcome', kind:'mid', t:0.5},
    {x:760, y:180, label:'Booking',       kind:'mid', t:1.0},
    {x:1080,y:340, label:'Reminder 24h',  kind:'mid', t:1.5},
    {x:1380,y:180, label:'Factură auto',  kind:'out', t:2.0},
  ];
  return (
    <>
      <Cue tc="00:34 → 00:38" title="Flow builder vizual" sub="Client → Email → Booking → Factură"/>
      <AppChrome page="Automatizări / Flow #4" activeNav="Automatizări">
        <div style={{
          position:'absolute', inset:0,
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(27,26,23,0.15) 1px, transparent 1px)`,
          backgroundSize: '20px 20px', background:`#faf6e8 radial-gradient(circle at 1px 1px, rgba(27,26,23,0.12) 1px, transparent 1px) 0 0/20px 20px`,
        }}>
          <svg viewBox="0 0 1620 560" style={{position:'absolute', inset:0, width:'100%', height:'100%'}} preserveAspectRatio="xMidYMid meet">
            {[[0,1],[1,2],[2,3],[3,4]].map(([a,b],i)=>{
              const na = nodes[a], nb = nodes[b];
              const drawT = clamp2((localTime - 0.2 - i*0.4)/0.45, 0, 1);
              const pathLen = 600;
              return (
                <path key={i}
                  d={`M ${na.x+90} ${na.y} C ${na.x+220} ${na.y}, ${nb.x-130} ${nb.y}, ${nb.x} ${nb.y}`}
                  fill="none" stroke={PALETTE.ink} strokeWidth="2"
                  strokeDasharray={pathLen}
                  strokeDashoffset={pathLen*(1-drawT)}
                />
              );
            })}
          </svg>
          {nodes.map((n,i)=>{
            const appear = clamp2((localTime - n.t)/0.3, 0, 1);
            const color = n.kind==='trg' ? PALETTE.accent2 : n.kind==='out' ? PALETTE.grn : PALETTE.accent;
            return (
              <div key={i} style={{
                position:'absolute', left:n.x, top:n.y,
                transform:`translate(-50%,-50%) scale(${0.85 + 0.15*appear})`,
                opacity:appear,
                background:'#fff', border:`2px solid ${PALETTE.ink}`, borderRadius:8,
                padding:'12px 18px', display:'flex', alignItems:'center', gap:10,
                boxShadow:`0 4px 0 0 ${PALETTE.ink}`,
                fontFamily:'JetBrains Mono,monospace', fontSize:14, textTransform:'uppercase', letterSpacing:'0.04em',
              }}>
                <span style={{width:10, height:10, borderRadius:3, background:color}}/>
                {n.label}
              </div>
            );
          })}
          <div style={{position:'absolute', left:40, top:20, fontFamily:'JetBrains Mono,monospace', fontSize:12, textTransform:'uppercase', letterSpacing:'0.1em', color:PALETTE.dim}}>
            Flow: <b style={{color:PALETTE.ink}}>Client nou → Facturare</b>
          </div>
        </div>
      </AppChrome>
    </>
  );
  function clamp2(v,a,b){return Math.max(a,Math.min(b,v));}
}

// ---------- Scene 11: Return to dashboard + end card (38–40s) ----------
function Scene11() {
  const { localTime, duration } = useSprite();
  const fade = localTime > 1.2 ? Math.min(1,(localTime-1.2)/0.8) : 0;
  return (
    <>
      <Cue tc="00:38 → 00:40" title="Loop · fade out" sub="Ciclu complet"/>
      <AppChrome page="Dashboard · loop" activeNav="Dashboard">
        <div style={{opacity: 1-fade*0.6}}>
          <DashboardView hoveredKPI={-1} revealRows={5}/>
        </div>
      </AppChrome>
      <div style={{
        position:'absolute', inset:0, background:PALETTE.bg,
        opacity:fade, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      }}>
        <div style={{fontFamily:'Fraunces,serif', fontSize:110, fontWeight:400, letterSpacing:'-0.035em', color:PALETTE.ink}}>
          <em style={{color:PALETTE.accent, fontStyle:'italic'}}>Alpis</em> Fusion CRM
        </div>
        <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:14, color:PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.2em', marginTop:16}}>
          40s · CLIP 01 · END
        </div>
      </div>
    </>
  );
}

// Timeline progress bar overlay
function TimelineHUD() {
  const { time, duration } = useTimeline();
  const pct = (time/duration)*100;
  const marks = [0,4,6,10,14,18,20,26,30,34,38,40];
  return (
    <div style={{
      position:'absolute', left:80, bottom:40, right:80,
      display:'flex', flexDirection:'column', gap:8, pointerEvents:'none',
    }}>
      <div style={{display:'flex', justifyContent:'space-between', fontFamily:'JetBrains Mono,monospace', fontSize:11, color:PALETTE.dim, letterSpacing:'0.1em'}}>
        <span>{fmt(time)} / {fmt(duration)}</span>
        <span>CLIP 01 · DEMO REEL · 40s</span>
      </div>
      <div style={{position:'relative', height:4, background:PALETTE.rule, borderRadius:999}}>
        <div style={{position:'absolute', left:0, top:0, bottom:0, width:pct+'%', background:PALETTE.ink, borderRadius:999}}/>
        {marks.map((m,i)=>(
          <div key={i} style={{position:'absolute', left:(m/duration)*100+'%', top:-2, width:1, height:8, background:PALETTE.dim, opacity:0.5}}/>
        ))}
      </div>
    </div>
  );
  function fmt(s){const m=Math.floor(s/60);const sec=Math.floor(s%60);const ms=Math.floor((s%1)*100);return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(ms).padStart(2,'0')}`}
}

// Root scene composition
function Video() {
  return (
    <>
      <style>{`
        @keyframes click-ping { 0%{transform:scale(0.4); opacity:0.8} 100%{transform:scale(1.6); opacity:0} }
        @keyframes caret { 50%{opacity:0} }
      `}</style>
      <Sprite start={0}  end={4}>  <Scene1/>  </Sprite>
      <Sprite start={4}  end={6}>  <Scene2/>  </Sprite>
      <Sprite start={6}  end={10}> <Scene3/>  </Sprite>
      <Sprite start={10} end={14}> <Scene4/>  </Sprite>
      <Sprite start={14} end={18}> <Scene5/>  </Sprite>
      <Sprite start={18} end={26}> <Scene6/>  </Sprite>
      <Sprite start={26} end={30}> <Scene8/>  </Sprite>
      <Sprite start={30} end={34}> <Scene9/>  </Sprite>
      <Sprite start={34} end={38}> <Scene10/> </Sprite>
      <Sprite start={38} end={40}> <Scene11/> </Sprite>
      <TimelineHUD/>
    </>
  );
}

Object.assign(window, { Video, PALETTE });
