// scenes-impactpath.jsx — Impact Path demo video scenes (35s, 8 shots, navy + gold)
// Sister piece; non-profit/impact tracking flavor.

const IP_PALETTE = {
  bg:      '#0a1429',
  bg2:     '#172e54',
  ink:     '#f6f1e6',
  dim:     '#9aa9c4',
  rule:    'rgba(255,255,255,0.10)',
  ruleHi:  'rgba(255,255,255,0.22)',
  surface: 'rgba(255,255,255,0.04)',
  surface2:'rgba(255,255,255,0.07)',
  accent:  '#e0b876',  // warm gold
  accent2: '#d6905b',  // amber
  cool:    '#7da9d4',  // cool counterpoint
  grn:     '#82c39a',
  hot:     '#e36b6b',
};

function IPBackground() {
  return (
    <div style={{
      position:'absolute', inset:0,
      background:`radial-gradient(ellipse at 70% 100%, ${IP_PALETTE.bg2} 0%, ${IP_PALETTE.bg} 65%)`,
    }}>
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize:'80px 80px',
      }}/>
    </div>
  );
}

function IPChrome({ page, activeNav, children }) {
  return (
    <div style={{
      position:'absolute', left:80, top:110, width:1760, height:880,
      background:'rgba(12,22,46,0.65)', borderRadius:14,
      border:`1px solid ${IP_PALETTE.rule}`,
      boxShadow:'0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      backdropFilter:'blur(8px)', overflow:'hidden', display:'flex',
      fontFamily:'Inter, system-ui, sans-serif', color:IP_PALETTE.ink,
    }}>
      <div style={{
        width:240, borderRight:`1px solid ${IP_PALETTE.rule}`,
        padding:'28px 18px', display:'flex', flexDirection:'column', gap:18,
        background:'rgba(255,255,255,0.02)',
      }}>
        <div style={{fontFamily:'Fraunces, serif', fontWeight:500, fontSize:24, letterSpacing:'-0.02em'}}>
          <span style={{color:IP_PALETTE.accent}}>◇</span> Impact Path
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:2}}>
          {['Overview','Goals','Outcomes','Reach','Stories','Funding','Reports','Settings'].map((n)=>(
            <div key={n} style={{
              padding:'9px 12px', borderRadius:6,
              background: n===activeNav ? 'rgba(224,184,118,0.13)' : 'transparent',
              color: n===activeNav ? IP_PALETTE.accent : IP_PALETTE.dim,
              fontSize:14, fontWeight: n===activeNav ? 500 : 400,
              borderLeft: n===activeNav ? `2px solid ${IP_PALETTE.accent}` : '2px solid transparent',
              display:'flex', alignItems:'center', gap:10,
            }}>
              <span style={{width:6,height:6,borderRadius:999,background:'currentColor',opacity:.6}}/>
              {n}
            </div>
          ))}
        </div>
      </div>
      <div style={{flex:1, display:'flex', flexDirection:'column', minWidth:0}}>
        <div style={{
          height:54, borderBottom:`1px solid ${IP_PALETTE.rule}`,
          display:'flex', alignItems:'center', padding:'0 24px', gap:14,
          background:'rgba(255,255,255,0.015)',
        }}>
          <div style={{fontFamily:'JetBrains Mono, monospace', fontSize:11, color:IP_PALETTE.dim, letterSpacing:'0.12em', textTransform:'uppercase'}}>
            {page}
          </div>
          <div style={{flex:1}}/>
          <div style={{fontFamily:'JetBrains Mono, monospace', fontSize:11, color:IP_PALETTE.dim, border:`1px solid ${IP_PALETTE.rule}`, padding:'5px 10px', borderRadius:5}}>FY 2026</div>
          <div style={{width:28, height:28, borderRadius:999, background:`linear-gradient(135deg, ${IP_PALETTE.accent}, ${IP_PALETTE.accent2})`}}/>
        </div>
        <div style={{flex:1, position:'relative', overflow:'hidden'}}>{children}</div>
      </div>
    </div>
  );
}

function IPCue({ tc, title, sub }) {
  return (
    <>
      <div style={{position:'absolute', left:80, top:40, fontFamily:'JetBrains Mono, monospace', fontSize:13, letterSpacing:'0.16em', color:IP_PALETTE.dim, textTransform:'uppercase'}}>
        <span style={{color:IP_PALETTE.accent}}>●</span> CLIP 03 · {tc}
      </div>
      <div style={{position:'absolute', right:80, top:34, fontFamily:'Fraunces, serif', fontSize:22, fontWeight:500, letterSpacing:'-0.01em', color:IP_PALETTE.ink, textAlign:'right'}}>
        {title}
        {sub && <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, letterSpacing:'0.1em', textTransform:'uppercase', marginTop:4}}>{sub}</div>}
      </div>
    </>
  );
}

// =====================================================================
// SCENE 1 — Title (0–4s)
// =====================================================================
function IPScene1() {
  const { localTime, duration } = useSprite();
  const t = Math.min(1, localTime/0.9);
  const sub = Math.max(0, Math.min(1,(localTime-0.7)/0.7));
  const exit = localTime > duration-0.6 ? Math.min(1,(localTime-(duration-0.6))/0.6) : 0;
  return (
    <div style={{position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:1-exit}}>
      <div style={{
        fontFamily:'JetBrains Mono,monospace', fontSize:13, color:IP_PALETTE.accent,
        letterSpacing:'0.3em', textTransform:'uppercase',
        opacity:t, transform:`translateY(${(1-t)*8}px)`, marginBottom:22,
      }}>CLIP 03 · 35s</div>
      <div style={{
        fontFamily:'Fraunces, serif', fontSize:160, fontWeight:400,
        letterSpacing:'-0.04em', color:IP_PALETTE.ink, lineHeight:1, textAlign:'center',
        opacity:t, transform:`translateY(${(1-t)*16}px)`, whiteSpace:'nowrap',
      }}>
        Impact <em style={{color:IP_PALETTE.accent, fontStyle:'italic', fontWeight:500}}>Path</em>
      </div>
      <div style={{
        fontFamily:'JetBrains Mono,monospace', fontSize:14, color:IP_PALETTE.dim,
        letterSpacing:'0.2em', textTransform:'uppercase', marginTop:24,
        opacity:sub, transform:`translateY(${(1-sub)*8}px)`,
        display:'flex', gap:24, alignItems:'center',
      }}>
        <span>outcome tracking</span>
        <span style={{width:4,height:4,borderRadius:999,background:IP_PALETTE.dim}}/>
        <span>for organizations that change lives</span>
      </div>
    </div>
  );
}

// =====================================================================
// SCENE 2 — Goals dashboard (4–8s)
// =====================================================================
function IPScene2() {
  const { localTime } = useSprite();
  const goals = [
    {k:'Lives reached',     v:14820, target:18000, suf:'',    delay:0.2},
    {k:'Programs delivered',v:62,    target:80,    suf:'',    delay:0.5},
    {k:'Funds deployed',    v:842,   target:1200,  suf:'k €', delay:0.8},
  ];
  return (
    <>
      <IPCue tc="00:04 → 00:08" title="Goals" sub="Where we are vs. where we said"/>
      <IPChrome page="Goals · FY 2026 Q2" activeNav="Goals">
        <div style={{padding:32, height:'100%', display:'flex', flexDirection:'column', gap:22}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18}}>
            {goals.map((g,i)=>{
              const a = Math.max(0, Math.min(1,(localTime-g.delay)/0.5));
              const fill = Math.min(1, Math.max(0,(localTime-g.delay-0.2)/1.2));
              const pct = (g.v/g.target);
              const ringPct = pct * fill;
              return (
                <div key={i} style={{
                  border:`1px solid ${IP_PALETTE.rule}`, borderRadius:12, padding:24,
                  background:IP_PALETTE.surface,
                  opacity:a, transform:`translateY(${(1-a)*10}px)`,
                  display:'flex', gap:20, alignItems:'center',
                }}>
                  {/* Ring */}
                  <div style={{position:'relative', width:96, height:96}}>
                    <svg width="96" height="96" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke={IP_PALETTE.rule} strokeWidth="6"/>
                      <circle cx="50" cy="50" r="42" fill="none"
                        stroke={IP_PALETTE.accent} strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={`${ringPct*263.9} 263.9`}
                        transform="rotate(-90 50 50)"/>
                    </svg>
                    <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Fraunces,serif', fontSize:22, fontWeight:500, color:IP_PALETTE.accent}}>
                      {Math.round(ringPct*100)}%
                    </div>
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>{g.k}</div>
                    <div style={{fontFamily:'Fraunces,serif', fontSize:38, fontWeight:500, letterSpacing:'-0.02em', color:IP_PALETTE.ink, lineHeight:1.1, marginTop:6}}>
                      {Math.round(g.v*fill).toLocaleString()}{g.suf}
                    </div>
                    <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, marginTop:4}}>
                      target {g.target.toLocaleString()}{g.suf}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{flex:1, border:`1px solid ${IP_PALETTE.rule}`, borderRadius:12, background:IP_PALETTE.surface, padding:24, display:'flex', flexDirection:'column', gap:14}}>
            <div style={{display:'flex', alignItems:'center', gap:14}}>
              <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>Progress · 12 month trail</div>
              <div style={{flex:1}}/>
              <div style={{display:'flex', gap:12, fontFamily:'JetBrains Mono,monospace', fontSize:10, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.08em'}}>
                <span><span style={{display:'inline-block', width:10, height:2, background:IP_PALETTE.accent, marginRight:6, verticalAlign:'middle'}}/>actual</span>
                <span><span style={{display:'inline-block', width:10, height:2, background:IP_PALETTE.dim, marginRight:6, verticalAlign:'middle'}}/>target</span>
              </div>
            </div>
            <svg viewBox="0 0 600 180" preserveAspectRatio="none" style={{width:'100%', flex:1}}>
              {/* horizontal grid */}
              {[0,45,90,135,180].map(y=>(
                <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
              ))}
              {/* target dashed */}
              <line x1="0" y1="60" x2="600" y2="40" stroke={IP_PALETTE.dim} strokeWidth="1" strokeDasharray="4 4"/>
              {/* actual */}
              <path d={ipGoalLine(localTime)} fill="none" stroke={IP_PALETTE.accent} strokeWidth="2.5"/>
              <path d={ipGoalArea(localTime)} fill={IP_PALETTE.accent} opacity="0.18"/>
            </svg>
          </div>
        </div>
      </IPChrome>
    </>
  );
}
function ipGoalLine(localTime){
  const reveal = Math.min(1,(localTime-0.5)/2.0);
  const pts = [];
  for (let i=0;i<=12;i++){
    const x = i*50;
    const y = 130 - (Math.sin(i*0.5)*8 + i*4);
    pts.push([x,y]);
  }
  const cut = Math.floor(pts.length * reveal);
  return pts.slice(0,Math.max(2,cut+1)).map((p,i)=>(i===0?'M':'L')+p[0]+' '+p[1]).join(' ');
}
function ipGoalArea(localTime){
  const line = ipGoalLine(localTime);
  const reveal = Math.min(1,(localTime-0.5)/2.0);
  const x = Math.floor(12 * reveal) * 50;
  return line + ` L ${x} 180 L 0 180 Z`;
}

// =====================================================================
// SCENE 3 — Outcomes timeline (8–13s)
// =====================================================================
function IPScene3() {
  const { localTime } = useSprite();
  const milestones = [
    {x:8,   t:'Q4 2025', label:'Pilot · 3 villages',     done:true,  d:0.2},
    {x:22,  t:'Jan 2026', label:'Curriculum delivered',  done:true,  d:0.6},
    {x:36,  t:'Feb 2026', label:'500 learners enrolled', done:true,  d:1.0},
    {x:50,  t:'Mar 2026', label:'First cohort complete', done:true,  d:1.4},
    {x:64,  t:'Apr 2026', label:'Outcome assessment',    done:true,  d:1.8},
    {x:78,  t:'May 2026', label:'Scale to district',     done:false, d:2.2},
    {x:92,  t:'Q3 2026',  label:'1 800 lives reached',   done:false, d:2.6},
  ];
  return (
    <>
      <IPCue tc="00:08 → 00:13" title="Outcomes timeline" sub="Each milestone, evidence attached"/>
      <IPChrome page="Outcomes · Education program" activeNav="Outcomes">
        <div style={{padding:32, height:'100%', display:'flex', flexDirection:'column', gap:24}}>
          <div style={{display:'flex', gap:14, alignItems:'baseline'}}>
            <div style={{fontFamily:'Fraunces,serif', fontSize:30, fontWeight:500, letterSpacing:'-0.02em'}}>Education in rural Banat</div>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>program · 18 month arc</div>
          </div>

          <div style={{flex:1, position:'relative', padding:'40px 0'}}>
            {/* Track */}
            <div style={{position:'absolute', left:'4%', right:'4%', top:'50%', height:3, background:IP_PALETTE.rule, borderRadius:999, transform:'translateY(-50%)'}}/>
            <div style={{
              position:'absolute', left:'4%', top:'50%', height:3,
              background:`linear-gradient(90deg, ${IP_PALETTE.accent2}, ${IP_PALETTE.accent})`,
              width:`calc(${Math.min(64, Math.max(0,(localTime-0.2)*16))}% - 0px)`,
              transform:'translateY(-50%)', borderRadius:999,
              transition:'width 0.05s linear',
            }}/>

            {milestones.map((m,i)=>{
              const a = Math.max(0, Math.min(1,(localTime-m.d)/0.45));
              const dotColor = m.done ? IP_PALETTE.accent : IP_PALETTE.dim;
              const aboveBelow = i%2===0 ? -1 : 1;
              return (
                <div key={i} style={{
                  position:'absolute', left:`calc(4% + ${m.x}% * 0.92)`, top:'50%', transform:'translate(-50%,-50%)',
                  opacity:a,
                }}>
                  <div style={{
                    width:18, height:18, borderRadius:999,
                    background: m.done ? IP_PALETTE.accent : IP_PALETTE.bg,
                    border:`2px solid ${dotColor}`,
                    boxShadow: m.done ? `0 0 0 4px rgba(224,184,118,0.18)` : 'none',
                  }}/>
                  <div style={{
                    position:'absolute', left:'50%', transform:`translateX(-50%) translateY(${aboveBelow<0?'-100%':'30%'})`,
                    top: aboveBelow<0 ? -16 : 30,
                    width:170, textAlign:'center',
                  }}>
                    <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4}}>{m.t}</div>
                    <div style={{fontSize:13, color: m.done ? IP_PALETTE.ink : IP_PALETTE.dim, lineHeight:1.3, fontWeight: m.done?500:400}}>{m.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14}}>
            {[
              ['Verified outcomes', '5 / 7'],
              ['Evidence attached', '23 docs'],
              ['Avg time to milestone','18 days'],
              ['Confidence', 'High'],
            ].map(([k,v],i)=>{
              const a = Math.max(0, Math.min(1,(localTime-3.0-i*0.1)/0.4));
              return (
                <div key={i} style={{
                  border:`1px solid ${IP_PALETTE.rule}`, borderRadius:8, padding:'12px 14px',
                  background:IP_PALETTE.surface, opacity:a, transform:`translateY(${(1-a)*6}px)`,
                }}>
                  <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em'}}>{k}</div>
                  <div style={{fontFamily:'Fraunces,serif', fontSize:22, fontWeight:500, letterSpacing:'-0.01em', marginTop:4}}>{v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </IPChrome>
    </>
  );
}

// =====================================================================
// SCENE 4 — Reach map / dot grid (13–18s)
// =====================================================================
function IPScene4() {
  const { localTime } = useSprite();
  // 24x14 grid representing beneficiaries; light up over time
  const cols = 28, rows = 14;
  const total = cols*rows;
  const target = 312; // active dots (out of 392)
  const lit = Math.min(target, Math.floor(localTime/3.5 * target));
  const seed = (i) => (Math.sin(i*12.9898) * 43758.5453) % 1;
  const dotOrder = React.useMemo(() => {
    return Array.from({length:total}, (_,i)=>i).sort((a,b)=>Math.abs(seed(a)) - Math.abs(seed(b)));
  }, [total]);
  const litSet = new Set(dotOrder.slice(0, lit));
  return (
    <>
      <IPCue tc="00:13 → 00:18" title="Reach" sub="Each dot · one life touched"/>
      <IPChrome page="Reach · this quarter" activeNav="Reach">
        <div style={{padding:32, height:'100%', display:'flex', gap:28}}>
          <div style={{flex:1, display:'flex', flexDirection:'column', gap:20}}>
            <div style={{display:'flex', gap:18, alignItems:'baseline'}}>
              <div style={{fontFamily:'Fraunces,serif', fontSize:96, fontWeight:500, letterSpacing:'-0.03em', color:IP_PALETTE.accent, lineHeight:1}}>
                {(lit*47).toLocaleString()}
              </div>
              <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:12, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.14em'}}>lives reached this quarter</div>
            </div>
            <div style={{
              flex:1, padding:24, border:`1px solid ${IP_PALETTE.rule}`, borderRadius:12,
              background:IP_PALETTE.surface, display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <div style={{
                display:'grid', gridTemplateColumns:`repeat(${cols}, 1fr)`,
                gap:7, width:'100%',
              }}>
                {Array.from({length:total}).map((_,i)=>{
                  const on = litSet.has(i);
                  return (
                    <div key={i} style={{
                      width:'100%', aspectRatio:'1/1', borderRadius:999,
                      background: on ? IP_PALETTE.accent : 'rgba(255,255,255,0.06)',
                      transform: on ? 'scale(1)' : 'scale(0.7)',
                      transition:'background 0.2s, transform 0.2s',
                    }}/>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{width:340, display:'flex', flexDirection:'column', gap:14}}>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>By region</div>
            {[
              ['Banat',     6420, 0.42],
              ['Maramureș', 3870, 0.26],
              ['Moldova',   2940, 0.20],
              ['Bucovina',  1414, 0.09],
              ['Other',      420, 0.03],
            ].map(([nm,ct,frac],i)=>{
              const a = Math.max(0, Math.min(1,(localTime-0.4-i*0.18)/0.45));
              return (
                <div key={i} style={{
                  border:`1px solid ${IP_PALETTE.rule}`, borderRadius:8,
                  padding:'12px 14px', background:IP_PALETTE.surface,
                  opacity:a, transform:`translateX(${(1-a)*-16}px)`,
                }}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                    <span style={{fontSize:14, fontWeight:500}}>{nm}</span>
                    <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:12, color:IP_PALETTE.accent}}>{ct.toLocaleString()}</span>
                  </div>
                  <div style={{height:3, background:IP_PALETTE.rule, borderRadius:999, marginTop:8, overflow:'hidden'}}>
                    <div style={{height:'100%', width:`${frac*100*a}%`, background:IP_PALETTE.accent, transition:'width 0.05s linear'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </IPChrome>
    </>
  );
}

// =====================================================================
// SCENE 5 — Stories (18–23s)
// =====================================================================
function IPScene5() {
  const { localTime } = useSprite();
  const stories = [
    {who:'Ana M.', age:14, place:'Lugoj', quote:'I stayed in school. Now I tutor the younger ones.', d:0.0},
    {who:'David P.', age:11, place:'Caransebeș', quote:'My mother said: keep going. So I did.', d:1.4},
    {who:'Iana C.', age:16, place:'Reșița', quote:'I want to be a vet. The library is small but it is mine.', d:2.8},
  ];
  return (
    <>
      <IPCue tc="00:18 → 00:23" title="Stories" sub="The data, in voices"/>
      <IPChrome page="Stories · 47 collected" activeNav="Stories">
        <div style={{padding:40, height:'100%', display:'flex', flexDirection:'column', gap:24}}>
          <div style={{display:'flex', alignItems:'baseline', gap:16}}>
            <div style={{fontFamily:'Fraunces,serif', fontSize:32, fontWeight:500, letterSpacing:'-0.02em'}}>Voices · spring cohort</div>
            <div style={{flex:1}}/>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>3 of 47 · pinned</div>
          </div>
          <div style={{flex:1, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, alignContent:'start'}}>
            {stories.map((s,i)=>{
              const a = Math.max(0, Math.min(1,(localTime-s.d)/0.7));
              return (
                <div key={i} style={{
                  border:`1px solid ${IP_PALETTE.ruleHi}`, borderRadius:14,
                  padding:'28px 26px', background:IP_PALETTE.surface2,
                  opacity:a, transform:`translateY(${(1-a)*16}px) rotateX(${(1-a)*-12}deg)`,
                  transformOrigin:'top center',
                  display:'flex', flexDirection:'column', gap:18,
                  minHeight:340,
                }}>
                  {/* photo placeholder */}
                  <div style={{
                    aspectRatio:'4/3', borderRadius:8,
                    background:`repeating-linear-gradient(45deg, rgba(224,184,118,0.18) 0 8px, rgba(224,184,118,0.08) 8px 16px)`,
                    border:`1px solid ${IP_PALETTE.rule}`,
                    display:'flex', alignItems:'flex-end', padding:12,
                    fontFamily:'JetBrains Mono,monospace', fontSize:10,
                    color:IP_PALETTE.dim, letterSpacing:'0.1em', textTransform:'uppercase',
                  }}>portrait · {s.who.toLowerCase()}</div>
                  <div style={{
                    fontFamily:'Fraunces,serif', fontSize:22, fontWeight:400,
                    fontStyle:'italic', color:IP_PALETTE.ink, lineHeight:1.4,
                    letterSpacing:'-0.01em',
                  }}>
                    <span style={{color:IP_PALETTE.accent, fontSize:32, lineHeight:0, position:'relative', top:8, marginRight:4}}>“</span>
                    {s.quote}
                  </div>
                  <div style={{marginTop:'auto', display:'flex', gap:14, alignItems:'center'}}>
                    <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em'}}>
                      {s.who} · {s.age} · {s.place}
                    </div>
                    <div style={{flex:1}}/>
                    <div style={{
                      fontFamily:'JetBrains Mono,monospace', fontSize:10, color:IP_PALETTE.accent,
                      letterSpacing:'0.1em', textTransform:'uppercase',
                      border:`1px solid ${IP_PALETTE.accent}`, padding:'2px 8px', borderRadius:3,
                    }}>verified</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </IPChrome>
    </>
  );
}

// =====================================================================
// SCENE 6 — Funding (23–28s)
// =====================================================================
function IPScene6() {
  const { localTime } = useSprite();
  const months = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'];
  const data = [
    {raised:62, spent:48},
    {raised:88, spent:72},
    {raised:140, spent:104},
    {raised:96, spent:118},
    {raised:124, spent:96},
    {raised:172, spent:142},
    {raised:138, spent:128},
    {raised:184, spent:148},
  ];
  const max = 200;
  return (
    <>
      <IPCue tc="00:23 → 00:28" title="Funding" sub="Where money came from, where it went"/>
      <IPChrome page="Funding · 8 month view" activeNav="Funding">
        <div style={{padding:32, height:'100%', display:'flex', gap:28}}>
          <div style={{flex:1, display:'flex', flexDirection:'column', gap:18}}>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14}}>
              {[
                ['Raised YTD', '€842k', '+18% YoY', IP_PALETTE.accent],
                ['Deployed',   '€716k', '85% efficiency', IP_PALETTE.grn],
                ['Reserve',    '€126k', '~3 months runway', IP_PALETTE.cool],
              ].map(([l,v,d,c],i)=>{
                const a = Math.max(0, Math.min(1,(localTime-i*0.12)/0.4));
                return (
                  <div key={i} style={{border:`1px solid ${IP_PALETTE.rule}`, borderRadius:10, padding:'14px 16px', background:IP_PALETTE.surface, opacity:a, transform:`translateY(${(1-a)*8}px)`}}>
                    <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>{l}</div>
                    <div style={{fontFamily:'Fraunces,serif', fontSize:30, fontWeight:500, letterSpacing:'-0.02em', marginTop:4}}>{v}</div>
                    <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:c, marginTop:4}}>{d}</div>
                  </div>
                );
              })}
            </div>
            <div style={{flex:1, border:`1px solid ${IP_PALETTE.rule}`, borderRadius:12, background:IP_PALETTE.surface, padding:24, display:'flex', flexDirection:'column', gap:12}}>
              <div style={{display:'flex', alignItems:'baseline', gap:14}}>
                <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>Raised vs deployed · monthly · k €</div>
                <div style={{flex:1}}/>
                <div style={{display:'flex', gap:14, fontFamily:'JetBrains Mono,monospace', fontSize:10, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.08em'}}>
                  <span><span style={{display:'inline-block', width:10, height:10, background:IP_PALETTE.accent, marginRight:6, verticalAlign:'middle', borderRadius:2}}/>raised</span>
                  <span><span style={{display:'inline-block', width:10, height:10, background:IP_PALETTE.cool, marginRight:6, verticalAlign:'middle', borderRadius:2}}/>deployed</span>
                </div>
              </div>
              <div style={{flex:1, display:'flex', alignItems:'stretch', gap:10, minHeight:0}}>
                {data.map((d,i)=>{
                  const grow = Math.max(0, Math.min(1,(localTime-0.5-i*0.1)/0.45));
                  return (
                    <div key={i} style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div style={{flex:1, width:'100%', display:'flex', alignItems:'flex-end', gap:3, minHeight:0}}>
                        <div style={{flex:1, height:`${(d.raised/max)*100*grow}%`, background:`linear-gradient(180deg, ${IP_PALETTE.accent}, ${IP_PALETTE.accent2})`, borderRadius:'3px 3px 0 0', transition:'height 0.05s linear'}}/>
                        <div style={{flex:1, height:`${(d.spent/max)*100*grow}%`, background:IP_PALETTE.cool, opacity:0.85, borderRadius:'3px 3px 0 0', transition:'height 0.05s linear'}}/>
                      </div>
                      <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:IP_PALETTE.dim, letterSpacing:'0.04em', marginTop:8, height:14}}>{months[i]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{width:340, display:'flex', flexDirection:'column', gap:12}}>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>Top sources</div>
            {[
              ['EU EduFund',     '€312k', 0.37, IP_PALETTE.accent],
              ['Private donors', '€224k', 0.27, IP_PALETTE.cool],
              ['Soros Found.',   '€146k', 0.17, IP_PALETTE.grn],
              ['Corporate',       '€98k', 0.12, IP_PALETTE.accent2],
              ['Recurring',       '€62k', 0.07, IP_PALETTE.warm],
            ].map(([nm,v,frac,c],i)=>{
              const a = Math.max(0, Math.min(1,(localTime-0.6-i*0.16)/0.5));
              return (
                <div key={i} style={{
                  border:`1px solid ${IP_PALETTE.rule}`, borderRadius:8, padding:'10px 14px',
                  background:IP_PALETTE.surface, opacity:a, transform:`translateX(${(1-a)*-12}px)`,
                  display:'flex', flexDirection:'column', gap:6,
                }}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                    <span style={{fontSize:13}}>{nm}</span>
                    <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:12, color:IP_PALETTE.accent}}>{v}</span>
                  </div>
                  <div style={{height:3, background:IP_PALETTE.rule, borderRadius:999, overflow:'hidden'}}>
                    <div style={{height:'100%', width:`${frac*100*a}%`, background:c, transition:'width 0.05s linear'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </IPChrome>
    </>
  );
}

// =====================================================================
// SCENE 7 — Report builder (28–32s)
// =====================================================================
function IPScene7() {
  const { localTime } = useSprite();
  const sections = [
    {label:'Cover',           t:0.0},
    {label:'Executive summary',t:0.4},
    {label:'Goals & progress', t:0.8},
    {label:'Outcomes',         t:1.2},
    {label:'Reach & regions',  t:1.6},
    {label:'Stories',          t:2.0},
    {label:'Financials',       t:2.4},
  ];
  return (
    <>
      <IPCue tc="00:28 → 00:32" title="Reports" sub="Funder-ready in one click"/>
      <IPChrome page="Reports · Q2 funder report" activeNav="Reports">
        <div style={{padding:32, height:'100%', display:'flex', gap:28}}>
          {/* Sidebar — assembling sections */}
          <div style={{width:340, display:'flex', flexDirection:'column', gap:8}}>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:6}}>Report sections</div>
            {sections.map((s,i)=>{
              const a = Math.max(0, Math.min(1,(localTime-s.t)/0.35));
              return (
                <div key={i} style={{
                  border:`1px solid ${a===1?IP_PALETTE.accent:IP_PALETTE.rule}`,
                  borderRadius:8, padding:'12px 14px',
                  background: a===1 ? 'rgba(224,184,118,0.08)' : IP_PALETTE.surface,
                  opacity:a, transform:`translateX(${(1-a)*-14}px)`,
                  display:'flex', alignItems:'center', gap:12,
                }}>
                  <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, width:18}}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{fontSize:13, flex:1}}>{s.label}</span>
                  <span style={{
                    width:14, height:14, borderRadius:3,
                    background: a>0.95 ? IP_PALETTE.accent : 'transparent',
                    border:`1px solid ${a>0.95?IP_PALETTE.accent:IP_PALETTE.rule}`,
                    color:IP_PALETTE.bg, fontSize:10, display:'flex', alignItems:'center', justifyContent:'center',
                  }}>{a>0.95?'✓':''}</span>
                </div>
              );
            })}
            {localTime > 2.8 && (
              <div style={{
                marginTop:14, padding:'14px 16px',
                background:IP_PALETTE.accent, color:IP_PALETTE.bg,
                borderRadius:8, fontFamily:'JetBrains Mono,monospace',
                fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase',
                fontWeight:600, textAlign:'center',
                opacity: Math.min(1,(localTime-2.8)/0.5),
                boxShadow:'0 8px 24px rgba(224,184,118,0.25)',
              }}>Generate PDF →</div>
            )}
          </div>
          {/* Preview document */}
          <div style={{flex:1, display:'flex', justifyContent:'center', alignItems:'center'}}>
            <div style={{
              width:540, aspectRatio:'210/297', background:'#f6f1e6', color:'#1c1f2c',
              borderRadius:6, boxShadow:'0 30px 60px rgba(0,0,0,0.45)',
              padding:'42px 44px', display:'flex', flexDirection:'column', gap:14,
              transform:`translateY(${Math.max(0,(0.4-localTime)*20)}px)`, opacity: Math.min(1, localTime/0.4),
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:`1px solid #d5cebd`, paddingBottom:14}}>
                <div style={{fontFamily:'Fraunces,serif', fontWeight:500, fontSize:22, letterSpacing:'-0.02em'}}>
                  <span style={{color:IP_PALETTE.accent2}}>◇</span> Impact Path
                  <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#75705f', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4, fontWeight:400}}>Q2 · 2026 funder report</div>
                </div>
                <div style={{textAlign:'right', fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#75705f'}}>
                  <div style={{textTransform:'uppercase', letterSpacing:'0.1em'}}>EDU.RO/2026/Q2</div>
                  <div style={{marginTop:3}}>30.04.2026</div>
                </div>
              </div>
              <div style={{fontFamily:'Fraunces,serif', fontSize:30, fontWeight:500, letterSpacing:'-0.02em', lineHeight:1.15, marginTop:6}}>
                14 820 lives.<br/>5 of 7 outcomes<br/>verified.
              </div>
              {/* Reveal sections in document as they assemble */}
              {localTime > 0.5 && <div style={{fontSize:10, color:'#75705f', lineHeight:1.5, fontFamily:'Inter,sans-serif', opacity: Math.min(1,(localTime-0.5)/0.4)}}>
                In Q2, we expanded the Banat education program to three new villages, completed the first cohort, and verified outcomes against pre-program baselines.
              </div>}
              {localTime > 1.2 && <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginTop:6, opacity: Math.min(1,(localTime-1.2)/0.4)}}>
                {[['82%','goal'],['€842k','raised'],['+18%','vs Y'] ].map(([v,k],j)=>(
                  <div key={j} style={{border:'1px solid #d5cebd', borderRadius:4, padding:'8px 10px'}}>
                    <div style={{fontFamily:'Fraunces,serif', fontSize:18, fontWeight:600, letterSpacing:'-0.01em'}}>{v}</div>
                    <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:8, color:'#75705f', textTransform:'uppercase', letterSpacing:'0.1em'}}>{k}</div>
                  </div>
                ))}
              </div>}
              {localTime > 2.0 && <div style={{height:60, background:`repeating-linear-gradient(90deg, #d5cebd 0 6px, #f6f1e6 6px 12px)`, borderRadius:4, marginTop:6, opacity: Math.min(1,(localTime-2.0)/0.4)}}/>}
              {localTime > 2.6 && <div style={{fontSize:9, color:'#75705f', fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.08em', textTransform:'uppercase', marginTop:'auto', borderTop:'1px solid #d5cebd', paddingTop:10, opacity: Math.min(1,(localTime-2.6)/0.4)}}>
                Page 1 of 14 · Verified · Signed by board
              </div>}
            </div>
          </div>
        </div>
      </IPChrome>
    </>
  );
}

// =====================================================================
// SCENE 8 — End card (32–35s)
// =====================================================================
function IPScene8() {
  const { localTime } = useSprite();
  const fade = Math.min(1, localTime/0.5);
  return (
    <div style={{
      position:'absolute', inset:0, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', opacity:fade,
    }}>
      <div style={{
        fontFamily:'Fraunces, serif', fontSize:130, fontWeight:400,
        letterSpacing:'-0.04em', color:IP_PALETTE.ink, lineHeight:1, textAlign:'center', whiteSpace:'nowrap',
      }}>
        Impact <em style={{color:IP_PALETTE.accent, fontStyle:'italic', fontWeight:500}}>Path</em>
      </div>
      <div style={{width:60, height:1, background:IP_PALETTE.rule, margin:'28px 0'}}/>
      <div style={{
        fontFamily:'JetBrains Mono,monospace', fontSize:13, color:IP_PALETTE.dim,
        letterSpacing:'0.24em', textTransform:'uppercase',
        display:'flex', gap:18, alignItems:'center',
      }}>
        <span>35s</span>
        <span style={{width:3,height:3,borderRadius:999,background:IP_PALETTE.dim}}/>
        <span>CLIP 03</span>
        <span style={{width:3,height:3,borderRadius:999,background:IP_PALETTE.dim}}/>
        <span style={{color:IP_PALETTE.accent}}>End</span>
      </div>
    </div>
  );
}

function IPTimelineHUD() {
  const { time, duration } = useTimeline();
  const pct = (time/duration)*100;
  const marks = [0,4,8,13,18,23,28,32,35];
  return (
    <div style={{position:'absolute', left:80, bottom:40, right:80, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none'}}>
      <div style={{display:'flex', justifyContent:'space-between', fontFamily:'JetBrains Mono,monospace', fontSize:11, color:IP_PALETTE.dim, letterSpacing:'0.1em'}}>
        <span>{ipFmt(time)} / {ipFmt(duration)}</span>
        <span>CLIP 03 · IMPACT PATH · 35s</span>
      </div>
      <div style={{position:'relative', height:3, background:'rgba(255,255,255,0.10)', borderRadius:999}}>
        <div style={{position:'absolute', left:0, top:0, bottom:0, width:pct+'%', background:IP_PALETTE.accent, borderRadius:999}}/>
        {marks.map((m,i)=>(
          <div key={i} style={{position:'absolute', left:(m/duration)*100+'%', top:-2, width:1, height:7, background:IP_PALETTE.dim, opacity:0.5}}/>
        ))}
      </div>
    </div>
  );
}
function ipFmt(s){const m=Math.floor(s/60);const sec=Math.floor(s%60);const ms=Math.floor((s%1)*100);return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(ms).padStart(2,'0')}`}

function ImpactPathVideo() {
  return (
    <>
      <IPBackground/>
      <Sprite start={0}  end={4}>  <IPScene1/> </Sprite>
      <Sprite start={4}  end={8}>  <IPScene2/> </Sprite>
      <Sprite start={8}  end={13}> <IPScene3/> </Sprite>
      <Sprite start={13} end={18}> <IPScene4/> </Sprite>
      <Sprite start={18} end={23}> <IPScene5/> </Sprite>
      <Sprite start={23} end={28}> <IPScene6/> </Sprite>
      <Sprite start={28} end={32}> <IPScene7/> </Sprite>
      <Sprite start={32} end={35}> <IPScene8/> </Sprite>
      <IPTimelineHUD/>
    </>
  );
}

Object.assign(window, { ImpactPathVideo, IP_PALETTE });
