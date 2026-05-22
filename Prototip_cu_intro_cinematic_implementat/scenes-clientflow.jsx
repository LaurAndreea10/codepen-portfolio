// scenes-clientflow.jsx — ClientFlow demo video scenes (30s, 8 shots, navy)
// Sister piece to scenes.jsx; shares Stage + Sprite architecture.

const CF_PALETTE = {
  bg:      '#0a1429',
  bg2:     '#142848',
  ink:     '#f4f6fb',
  dim:     '#8a9bbd',
  rule:    'rgba(255,255,255,0.10)',
  ruleHi:  'rgba(255,255,255,0.20)',
  surface: 'rgba(255,255,255,0.04)',
  surface2:'rgba(255,255,255,0.07)',
  accent:  '#5fb4d4',  // cyan
  accent2: '#7d9eff',  // periwinkle
  warm:    '#e0b876',  // warm highlight
  grn:     '#6fcf97',
  hot:     '#e36b6b',
};

// ---------- Background ----------
function CFBackground() {
  return (
    <div style={{
      position:'absolute', inset:0,
      background:`radial-gradient(ellipse at 30% 0%, ${CF_PALETTE.bg2} 0%, ${CF_PALETTE.bg} 60%)`,
    }}>
      {/* subtle grid */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:`linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
        backgroundSize:'60px 60px',
      }}/>
    </div>
  );
}

// ---------- App chrome (dark glass) ----------
function CFChrome({ page, activeNav, children }) {
  return (
    <div style={{
      position:'absolute', left:80, top:110, width:1760, height:880,
      background:'rgba(12,22,46,0.65)', borderRadius:14,
      border:`1px solid ${CF_PALETTE.rule}`,
      boxShadow:'0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)',
      backdropFilter:'blur(8px)', overflow:'hidden', display:'flex',
      fontFamily:'Inter, system-ui, sans-serif', color:CF_PALETTE.ink,
    }}>
      <div style={{
        width:240, borderRight:`1px solid ${CF_PALETTE.rule}`,
        padding:'28px 18px', display:'flex', flexDirection:'column', gap:18,
        background:'rgba(255,255,255,0.02)',
      }}>
        <div style={{fontFamily:'Fraunces, serif', fontWeight:500, fontSize:24, letterSpacing:'-0.02em'}}>
          <span style={{color:CF_PALETTE.accent}}>◐</span> ClientFlow
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:2}}>
          {['Inbox','Clients','Threads','Segments','Pipeline','Schedule','Reports','Settings'].map((n)=>(
            <div key={n} style={{
              padding:'9px 12px', borderRadius:6,
              background: n===activeNav ? 'rgba(95,180,212,0.14)' : 'transparent',
              color: n===activeNav ? CF_PALETTE.accent : CF_PALETTE.dim,
              fontSize:14, fontWeight: n===activeNav ? 500 : 400,
              borderLeft: n===activeNav ? `2px solid ${CF_PALETTE.accent}` : '2px solid transparent',
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
          height:54, borderBottom:`1px solid ${CF_PALETTE.rule}`,
          display:'flex', alignItems:'center', padding:'0 24px', gap:14,
          background:'rgba(255,255,255,0.015)',
        }}>
          <div style={{fontFamily:'JetBrains Mono, monospace', fontSize:11, color:CF_PALETTE.dim, letterSpacing:'0.12em', textTransform:'uppercase'}}>
            {page}
          </div>
          <div style={{flex:1}}/>
          <div style={{
            fontFamily:'JetBrains Mono, monospace', fontSize:11, color:CF_PALETTE.dim,
            border:`1px solid ${CF_PALETTE.rule}`, padding:'5px 10px', borderRadius:5,
          }}>⌘K · Search</div>
          <div style={{width:28, height:28, borderRadius:999, background:`linear-gradient(135deg, ${CF_PALETTE.accent}, ${CF_PALETTE.accent2})`}}/>
        </div>
        <div style={{flex:1, position:'relative', overflow:'hidden'}}>{children}</div>
      </div>
    </div>
  );
}

// ---------- Cue ----------
function CFCue({ tc, title, sub }) {
  return (
    <>
      <div style={{
        position:'absolute', left:80, top:40,
        fontFamily:'JetBrains Mono, monospace', fontSize:13, letterSpacing:'0.16em',
        color:CF_PALETTE.dim, textTransform:'uppercase',
      }}>
        <span style={{color:CF_PALETTE.accent}}>●</span> CLIP 02 · {tc}
      </div>
      <div style={{
        position:'absolute', right:80, top:34,
        fontFamily:'Fraunces, serif', fontSize:22, fontWeight:500, letterSpacing:'-0.01em',
        color:CF_PALETTE.ink, textAlign:'right',
      }}>
        {title}
        {sub && <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim, letterSpacing:'0.1em', textTransform:'uppercase', marginTop:4}}>{sub}</div>}
      </div>
    </>
  );
}

// ---------- Cursor ----------
function CFCursor({ x, y }) {
  return (
    <div style={{position:'absolute', left:x, top:y, pointerEvents:'none', zIndex:50,
      transform:'translate(-4px,-2px)', filter:'drop-shadow(0 3px 8px rgba(0,0,0,0.5))'}}>
      <svg width="26" height="32" viewBox="0 0 12 14">
        <path d="M1 1 L1 11 L4 8 L7 13 L9 12 L6 7 L10 7 Z" fill="#fff" stroke={CF_PALETTE.bg} strokeWidth="0.6"/>
      </svg>
    </div>
  );
}

// =====================================================================
// SCENE 1 — Opening title (0–3s)
// =====================================================================
function CFScene1() {
  const { localTime, duration } = useSprite();
  const t = Math.min(1, localTime/0.8);
  const sub = Math.max(0, Math.min(1, (localTime-0.6)/0.7));
  const exit = localTime > duration-0.6 ? Math.min(1,(localTime-(duration-0.6))/0.6) : 0;
  return (
    <>
      <div style={{
        position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', opacity:1-exit,
      }}>
        <div style={{
          fontFamily:'JetBrains Mono,monospace', fontSize:13, color:CF_PALETTE.accent,
          letterSpacing:'0.3em', textTransform:'uppercase',
          opacity:t, transform:`translateY(${(1-t)*8}px)`, marginBottom:20,
        }}>CLIP 02 · 30s</div>
        <div style={{
          fontFamily:'Fraunces, serif', fontSize:160, fontWeight:400,
          letterSpacing:'-0.04em', color:CF_PALETTE.ink, lineHeight:1,
          opacity:t, transform:`translateY(${(1-t)*16}px)`,
        }}>
          Client<em style={{color:CF_PALETTE.accent, fontStyle:'italic', fontWeight:500}}>Flow</em>
        </div>
        <div style={{
          fontFamily:'JetBrains Mono,monospace', fontSize:14, color:CF_PALETTE.dim,
          letterSpacing:'0.2em', textTransform:'uppercase', marginTop:24,
          opacity:sub, transform:`translateY(${(1-sub)*8}px)`,
          display:'flex', gap:24, alignItems:'center',
        }}>
          <span>relationship CRM</span>
          <span style={{width:4,height:4,borderRadius:999,background:CF_PALETTE.dim}}/>
          <span>built for closeness, not volume</span>
        </div>
      </div>
    </>
  );
}

// =====================================================================
// SCENE 2 — Inbox (3–7s)
// =====================================================================
function CFScene2() {
  const { localTime } = useSprite();
  const items = [
    ['MK','Mira Kovač','Re: Q3 retainer renewal','11:42','unread'],
    ['JS','Jules Saint-Pierre','Notes from yesterday','11:21',''],
    ['DA','Daniel Akande','New brief for spring deck','10:58','unread'],
    ['LI','Lior Ben-Ami','Thanks — moving forward','10:31',''],
    ['NV','Nia Vasquez','Proposal feedback v3','09:47','unread'],
    ['PK','Petros Karras','Re: site walkthrough','09:12',''],
    ['RT','Rina Tanaka','Quick question on scope','Yest',''],
  ];
  return (
    <>
      <CFCue tc="00:03 → 00:07" title="Inbox" sub="One thread per relationship"/>
      <CFChrome page="Inbox · 23 unread" activeNav="Inbox">
        <div style={{padding:24, height:'100%', display:'flex', flexDirection:'column', gap:14}}>
          <div style={{display:'flex', gap:10}}>
            {['All','Unread','Starred','Mentions','Awaiting reply'].map((f,i)=>(
              <div key={f} style={{
                padding:'7px 14px', borderRadius:999, fontSize:12,
                fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.04em',
                background: i===1 ? CF_PALETTE.accent : 'transparent',
                color: i===1 ? CF_PALETTE.bg : CF_PALETTE.dim,
                border: `1px solid ${i===1 ? CF_PALETTE.accent : CF_PALETTE.rule}`,
              }}>{f}</div>
            ))}
            <div style={{flex:1}}/>
            <div style={{
              padding:'7px 14px', borderRadius:6, fontSize:12,
              fontFamily:'JetBrains Mono,monospace', color:CF_PALETTE.dim,
              border:`1px solid ${CF_PALETTE.rule}`,
            }}>sort: latest ↓</div>
          </div>
          <div style={{
            border:`1px solid ${CF_PALETTE.rule}`, borderRadius:10, flex:1, overflow:'hidden',
            background:CF_PALETTE.surface,
          }}>
            {items.map(([in_,nm,sub,tm,st],i)=>{
              const appear = Math.max(0, Math.min(1, (localTime - 0.15 - i*0.12)/0.4));
              const unread = st==='unread';
              return (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:16,
                  padding:'18px 22px', borderBottom:`1px solid ${CF_PALETTE.rule}`,
                  opacity:appear, transform:`translateY(${(1-appear)*8}px)`,
                  background: unread ? 'rgba(95,180,212,0.04)' : 'transparent',
                }}>
                  <span style={{
                    width:8, height:8, borderRadius:999,
                    background: unread ? CF_PALETTE.accent : 'transparent',
                  }}/>
                  <span style={{
                    width:36, height:36, borderRadius:999,
                    background:`linear-gradient(135deg, ${CF_PALETTE.accent2}, ${CF_PALETTE.accent})`,
                    fontFamily:'Fraunces,serif', fontSize:13, fontWeight:600,
                    display:'flex', alignItems:'center', justifyContent:'center', color:CF_PALETTE.bg,
                  }}>{in_}</span>
                  <span style={{width:200, fontWeight: unread?500:400, fontSize:15}}>{nm}</span>
                  <span style={{flex:1, color:unread?CF_PALETTE.ink:CF_PALETTE.dim, fontSize:14, fontWeight:unread?500:400}}>{sub}</span>
                  <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim}}>{tm}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CFChrome>
    </>
  );
}

// =====================================================================
// SCENE 3 — Client profile (7–11s)
// =====================================================================
function CFScene3() {
  const { localTime } = useSprite();
  const slide = Math.min(1, localTime/0.6);
  const panelX = interpolate([0,1],[1200,0], Easing.easeOutCubic)(slide);
  // Relationship strength meter fills from 0 to 78
  const meter = Math.min(78, Math.max(0, (localTime-1.0) * 60));
  return (
    <>
      <CFCue tc="00:07 → 00:11" title="Client profile" sub="Strength · history · context"/>
      <CFChrome page="Clients / Mira Kovač" activeNav="Clients">
        <div style={{padding:24, opacity:0.35}}>
          {/* faded list */}
          {Array.from({length:7}).map((_,i)=>(
            <div key={i} style={{height:48, borderBottom:`1px solid ${CF_PALETTE.rule}`}}/>
          ))}
        </div>
        <div style={{
          position:'absolute', right:0, top:0, bottom:0, width:820,
          background:'rgba(10,20,41,0.92)', borderLeft:`1px solid ${CF_PALETTE.ruleHi}`,
          boxShadow:'-30px 0 60px rgba(0,0,0,0.4)', padding:32,
          transform:`translateX(${panelX}px)`,
          display:'flex', flexDirection:'column', gap:22,
        }}>
          <div style={{display:'flex', gap:18, alignItems:'center'}}>
            <div style={{
              width:72, height:72, borderRadius:999,
              background:`linear-gradient(135deg, ${CF_PALETTE.accent2}, ${CF_PALETTE.accent})`,
              fontFamily:'Fraunces,serif', fontSize:26, fontWeight:600, color:CF_PALETTE.bg,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>MK</div>
            <div>
              <div style={{fontFamily:'Fraunces,serif', fontSize:34, fontWeight:500, letterSpacing:'-0.02em'}}>Mira Kovač</div>
              <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4}}>Studio Atelier · Zagreb · since 2023</div>
            </div>
            <div style={{marginLeft:'auto', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4}}>
              <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:CF_PALETTE.dim, letterSpacing:'0.1em', textTransform:'uppercase'}}>Strength</div>
              <div style={{fontFamily:'Fraunces,serif', fontSize:32, fontWeight:500, color:CF_PALETTE.accent, letterSpacing:'-0.02em'}}>{Math.round(meter)}</div>
            </div>
          </div>
          {/* Meter */}
          <div>
            <div style={{height:6, borderRadius:999, background:CF_PALETTE.rule, overflow:'hidden'}}>
              <div style={{height:'100%', width:`${meter}%`, background:`linear-gradient(90deg, ${CF_PALETTE.accent2}, ${CF_PALETTE.accent})`, transition:'width 0.1s linear'}}/>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginTop:6, fontFamily:'JetBrains Mono,monospace', fontSize:10, color:CF_PALETTE.dim, letterSpacing:'0.08em', textTransform:'uppercase'}}>
              <span>Cold</span><span>Warm</span><span>Engaged</span><span>Champion</span>
            </div>
          </div>
          {/* Tabs */}
          <div style={{display:'flex', gap:24, fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em', borderBottom:`1px solid ${CF_PALETTE.rule}`, paddingBottom:10}}>
            <span style={{color:CF_PALETTE.ink, borderBottom:`2px solid ${CF_PALETTE.accent}`, paddingBottom:11, marginBottom:-11}}>Overview</span>
            <span>History</span><span>Threads</span><span>Files</span><span>Notes</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
            {[
              ['Last touch','2 days ago'],
              ['Open thread','Q3 retainer renewal'],
              ['Lifetime','€42 600'],
              ['Reply rate','94%'],
              ['Avg cadence','9 days'],
              ['Anniversary','Jun 14'],
            ].map(([k,v],i)=>{
              const a = Math.max(0, Math.min(1,(localTime-0.8-i*0.08)/0.35));
              return (
                <div key={i} style={{
                  border:`1px solid ${CF_PALETTE.rule}`, borderRadius:8, padding:'12px 14px',
                  background:CF_PALETTE.surface, opacity:a, transform:`translateY(${(1-a)*6}px)`,
                }}>
                  <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:CF_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em'}}>{k}</div>
                  <div style={{fontSize:18, fontFamily:'Fraunces,serif', fontWeight:500, marginTop:4, letterSpacing:'-0.01em'}}>{v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CFChrome>
    </>
  );
}

// =====================================================================
// SCENE 4 — Segments (11–15s)
// =====================================================================
function CFScene4() {
  const { localTime } = useSprite();
  const segments = [
    ['Champions',         24, CF_PALETTE.grn],
    ['Recurring retainer',18, CF_PALETTE.accent],
    ['Quarterly check-in',31, CF_PALETTE.accent2],
    ['Re-engage',         12, CF_PALETTE.warm],
    ['Lapsed',             7, CF_PALETTE.hot],
    ['Cold',              19, CF_PALETTE.dim],
  ];
  const total = segments.reduce((a,b)=>a+b[1],0);
  let acc = 0;
  return (
    <>
      <CFCue tc="00:11 → 00:15" title="Segments" sub="Living groups, not static lists"/>
      <CFChrome page="Segments · auto-grouped" activeNav="Segments">
        <div style={{padding:32, height:'100%', display:'flex', gap:28}}>
          <div style={{flex:1, display:'flex', flexDirection:'column', gap:14}}>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>Distribution · 111 clients</div>
            {/* Stacked bar */}
            <div style={{display:'flex', height:28, borderRadius:6, overflow:'hidden', border:`1px solid ${CF_PALETTE.rule}`}}>
              {segments.map(([nm,ct,c],i)=>{
                const a = Math.max(0, Math.min(1, (localTime-0.2-i*0.15)/0.5));
                return (
                  <div key={i} style={{
                    width:`${(ct/total)*100*a}%`, background:c, transition:'width 0.05s linear',
                  }}/>
                );
              })}
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:12}}>
              {segments.map(([nm,ct,c],i)=>{
                const a = Math.max(0, Math.min(1,(localTime-0.5-i*0.12)/0.35));
                return (
                  <div key={i} style={{
                    display:'flex', alignItems:'center', gap:14,
                    padding:'10px 14px', borderRadius:8,
                    border:`1px solid ${CF_PALETTE.rule}`, background:CF_PALETTE.surface,
                    opacity:a, transform:`translateX(${(1-a)*-12}px)`,
                  }}>
                    <span style={{width:10, height:10, borderRadius:3, background:c}}/>
                    <span style={{fontSize:14, flex:1}}>{nm}</span>
                    <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:13, color:CF_PALETTE.dim}}>{ct} clients</span>
                    <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim, width:48, textAlign:'right'}}>{Math.round(ct/total*100)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{width:480, display:'flex', flexDirection:'column', gap:14}}>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>Auto rule · Re-engage</div>
            <div style={{
              border:`1px solid ${CF_PALETTE.ruleHi}`, borderRadius:10, padding:20,
              background:CF_PALETTE.surface2, fontFamily:'JetBrains Mono,monospace', fontSize:13, lineHeight:1.7,
            }}>
              <div style={{color:CF_PALETTE.dim}}>WHEN</div>
              <div><span style={{color:CF_PALETTE.accent}}>last_touch</span> &gt; <span style={{color:CF_PALETTE.warm}}>45 days</span></div>
              <div style={{color:CF_PALETTE.dim, marginTop:10}}>AND</div>
              <div><span style={{color:CF_PALETTE.accent}}>strength</span> &gt; <span style={{color:CF_PALETTE.warm}}>40</span></div>
              <div style={{color:CF_PALETTE.dim, marginTop:10}}>THEN</div>
              <div><span style={{color:CF_PALETTE.grn}}>add_to_segment</span>(<span style={{color:CF_PALETTE.warm}}>"Re-engage"</span>)</div>
            </div>
            <div style={{
              border:`1px solid ${CF_PALETTE.rule}`, borderRadius:10, padding:'14px 18px',
              background:CF_PALETTE.surface, fontSize:13, color:CF_PALETTE.dim,
            }}>
              <span style={{color:CF_PALETTE.accent}}>↻</span> Recomputed every hour · 12 entered, 4 left this week
            </div>
          </div>
        </div>
      </CFChrome>
    </>
  );
}

// =====================================================================
// SCENE 5 — Conversation thread (15–19s)
// =====================================================================
function CFScene5() {
  const { localTime } = useSprite();
  const msgs = [
    {who:'them', text:'Mind sending over the latest deck?', t:0.0},
    {who:'me',   text:'On its way — also pinging Lior on copy.', t:0.6},
    {who:'them', text:'Perfect. Tomorrow 10am still good?', t:1.2},
    {who:'me',   text:'Yes — pushed Daniel to 2pm.', t:1.8},
  ];
  // typing the next message
  const typingStart = 2.6;
  const typeFull = "Bringing the spring brief too — gives us context.";
  const typed = localTime < typingStart ? '' : typeFull.slice(0, Math.min(typeFull.length, Math.floor((localTime-typingStart)/0.045)));
  return (
    <>
      <CFCue tc="00:15 → 00:19" title="Threads" sub="Email · iMessage · IG — one place"/>
      <CFChrome page="Threads / Mira Kovač" activeNav="Threads">
        <div style={{height:'100%', display:'flex'}}>
          <div style={{
            width:280, borderRight:`1px solid ${CF_PALETTE.rule}`,
            display:'flex', flexDirection:'column', background:'rgba(255,255,255,0.015)',
          }}>
            {[
              ['MK','Mira Kovač','Q3 retainer renewal',true],
              ['JS','Jules S-P','Yesterday notes',false],
              ['DA','Daniel Akande','Spring deck',false],
              ['LI','Lior Ben-Ami','Moving forward',false],
            ].map(([in_,nm,sub,active],i)=>(
              <div key={i} style={{
                padding:'14px 18px', borderBottom:`1px solid ${CF_PALETTE.rule}`,
                display:'flex', gap:12, alignItems:'center',
                background:active?'rgba(95,180,212,0.08)':'transparent',
                borderLeft:active?`2px solid ${CF_PALETTE.accent}`:'2px solid transparent',
              }}>
                <span style={{width:30, height:30, borderRadius:999, background:`linear-gradient(135deg,${CF_PALETTE.accent2},${CF_PALETTE.accent})`, color:CF_PALETTE.bg, fontFamily:'Fraunces,serif', fontWeight:600, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center'}}>{in_}</span>
                <div style={{minWidth:0, flex:1}}>
                  <div style={{fontSize:13, fontWeight:active?500:400}}>{nm}</div>
                  <div style={{fontSize:11, color:CF_PALETTE.dim, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{flex:1, display:'flex', flexDirection:'column'}}>
            <div style={{
              padding:'14px 24px', borderBottom:`1px solid ${CF_PALETTE.rule}`,
              display:'flex', alignItems:'center', gap:12,
            }}>
              <span style={{width:32, height:32, borderRadius:999, background:`linear-gradient(135deg,${CF_PALETTE.accent2},${CF_PALETTE.accent})`, color:CF_PALETTE.bg, fontFamily:'Fraunces,serif', fontWeight:600, fontSize:12, display:'flex', alignItems:'center', justifyContent:'center'}}>MK</span>
              <div>
                <div style={{fontSize:14, fontWeight:500}}>Mira Kovač</div>
                <div style={{fontSize:11, color:CF_PALETTE.dim, fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.06em'}}>Q3 retainer renewal · 4 messages</div>
              </div>
              <div style={{flex:1}}/>
              <div style={{
                fontFamily:'JetBrains Mono,monospace', fontSize:10, color:CF_PALETTE.accent,
                letterSpacing:'0.1em', textTransform:'uppercase',
                border:`1px solid ${CF_PALETTE.accent}`, padding:'4px 10px', borderRadius:4,
              }}>via gmail</div>
            </div>
            <div style={{flex:1, padding:'24px 32px', display:'flex', flexDirection:'column', gap:14, overflow:'hidden'}}>
              {msgs.map((m,i)=>{
                const a = Math.max(0, Math.min(1,(localTime-m.t)/0.4));
                if (a<=0) return null;
                const isMe = m.who==='me';
                return (
                  <div key={i} style={{
                    alignSelf: isMe?'flex-end':'flex-start', maxWidth:'70%',
                    background: isMe?CF_PALETTE.accent:CF_PALETTE.surface2,
                    color: isMe?CF_PALETTE.bg:CF_PALETTE.ink,
                    padding:'12px 16px', borderRadius:16,
                    borderBottomRightRadius: isMe?4:16,
                    borderBottomLeftRadius: isMe?16:4,
                    border:`1px solid ${isMe?CF_PALETTE.accent:CF_PALETTE.rule}`,
                    fontSize:15, opacity:a, transform:`translateY(${(1-a)*8}px)`,
                  }}>{m.text}</div>
                );
              })}
            </div>
            {/* Composer */}
            <div style={{padding:'14px 24px', borderTop:`1px solid ${CF_PALETTE.rule}`, background:'rgba(255,255,255,0.02)'}}>
              <div style={{
                border:`1px solid ${localTime>typingStart?CF_PALETTE.accent:CF_PALETTE.rule}`, borderRadius:10,
                padding:'12px 16px', minHeight:48,
                background:'rgba(0,0,0,0.2)', display:'flex', alignItems:'center', gap:10,
              }}>
                <span style={{fontSize:15, color:CF_PALETTE.ink, flex:1}}>
                  {typed}
                  {localTime>typingStart && <span style={{display:'inline-block', width:2, height:18, background:CF_PALETTE.accent, marginLeft:2, verticalAlign:'middle', animation:'cf-caret 1s step-end infinite'}}/>}
                  {!typed && <span style={{color:CF_PALETTE.dim}}>Reply…</span>}
                </span>
                <span style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim}}>↵ send</span>
              </div>
            </div>
          </div>
        </div>
      </CFChrome>
    </>
  );
}

// =====================================================================
// SCENE 6 — Pipeline funnel (19–23s)
// =====================================================================
function CFScene6() {
  const { localTime } = useSprite();
  const stages = [
    ['Reaching out',  68, CF_PALETTE.dim],
    ['In conversation',42, CF_PALETTE.accent2],
    ['Proposal sent', 24, CF_PALETTE.accent],
    ['Negotiating',   11, CF_PALETTE.warm],
    ['Won',            7, CF_PALETTE.grn],
  ];
  return (
    <>
      <CFCue tc="00:19 → 00:23" title="Pipeline" sub="Stages, conversion, gentle nudges"/>
      <CFChrome page="Pipeline · this quarter" activeNav="Pipeline">
        <div style={{padding:32, height:'100%', display:'flex', flexDirection:'column', gap:18}}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14}}>
            {[
              ['Active conversations','152','+12 this week', CF_PALETTE.accent],
              ['Conversion','17%','+2.4% MoM', CF_PALETTE.grn],
              ['Avg cycle','21 days','-3 days', CF_PALETTE.warm],
            ].map(([l,v,d,c],i)=>{
              const a = Math.max(0, Math.min(1,(localTime-i*0.15)/0.4));
              return (
                <div key={i} style={{
                  border:`1px solid ${CF_PALETTE.rule}`, borderRadius:10, padding:'16px 18px',
                  background:CF_PALETTE.surface,
                  opacity:a, transform:`translateY(${(1-a)*8}px)`,
                }}>
                  <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:10, color:CF_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.12em'}}>{l}</div>
                  <div style={{fontFamily:'Fraunces,serif', fontSize:34, fontWeight:500, letterSpacing:'-0.02em', marginTop:6, color:CF_PALETTE.ink}}>{v}</div>
                  <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:c, marginTop:4}}>{d}</div>
                </div>
              );
            })}
          </div>
          <div style={{flex:1, display:'flex', flexDirection:'column', gap:10, justifyContent:'center'}}>
            {stages.map(([nm,ct,c],i)=>{
              const a = Math.max(0, Math.min(1,(localTime-0.6-i*0.18)/0.45));
              const max = stages[0][1];
              const w = (ct/max) * 100;
              return (
                <div key={i} style={{display:'flex', alignItems:'center', gap:18}}>
                  <div style={{width:170, fontFamily:'JetBrains Mono,monospace', fontSize:12, color:CF_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.08em', textAlign:'right'}}>{nm}</div>
                  <div style={{flex:1, height:46, position:'relative'}}>
                    <div style={{
                      width:`${w*a}%`, height:'100%',
                      background:`linear-gradient(90deg, ${c}88, ${c})`,
                      border:`1px solid ${c}`,
                      borderRadius:6, display:'flex', alignItems:'center', justifyContent:'flex-end',
                      padding:'0 14px', transition:'width 0.08s linear',
                    }}>
                      <span style={{fontFamily:'Fraunces,serif', fontSize:20, fontWeight:600, color:CF_PALETTE.bg}}>{Math.round(ct*a)}</span>
                    </div>
                  </div>
                  <div style={{width:80, fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim}}>
                    {i<stages.length-1 ? `→ ${Math.round(stages[i+1][1]/ct*100)}%` : 'closed'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CFChrome>
    </>
  );
}

// =====================================================================
// SCENE 7 — Schedule (23–27s)
// =====================================================================
function CFScene7() {
  const { localTime } = useSprite();
  const days = ['Mon','Tue','Wed','Thu','Fri'];
  const events = [
    {d:0, h:10, dur:1, t:'Mira · sync',     c:CF_PALETTE.accent,  delay:0.2},
    {d:1, h: 9, dur:1.5, t:'Jules · review', c:CF_PALETTE.accent2, delay:0.5},
    {d:2, h:14, dur:2,   t:'Daniel · brief', c:CF_PALETTE.warm,    delay:0.8},
    {d:3, h:11, dur:1,   t:'Lior · catchup', c:CF_PALETTE.grn,     delay:1.1},
    {d:4, h:15, dur:1,   t:'Petros · call',  c:CF_PALETTE.accent,  delay:1.4},
  ];
  // New event being placed
  const newEvent = {d:0, h:13, dur:1, t:'Nia · proposal'};
  const placeT = Math.max(0, Math.min(1,(localTime-2.0)/0.6));
  return (
    <>
      <CFCue tc="00:23 → 00:27" title="Schedule" sub="Suggested slots from cadence"/>
      <CFChrome page="Schedule · this week" activeNav="Schedule">
        <div style={{padding:24, height:'100%', display:'flex', flexDirection:'column', gap:14}}>
          <div style={{display:'flex', gap:14, alignItems:'center'}}>
            <div style={{fontFamily:'Fraunces,serif', fontSize:24, fontWeight:500, letterSpacing:'-0.02em'}}>April 27 — May 1</div>
            <div style={{flex:1}}/>
            <div style={{fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim, padding:'6px 12px', border:`1px solid ${CF_PALETTE.rule}`, borderRadius:6}}>← week →</div>
          </div>
          <div style={{flex:1, display:'grid', gridTemplateColumns:'60px repeat(5,1fr)', gap:1, background:CF_PALETTE.rule, border:`1px solid ${CF_PALETTE.rule}`, borderRadius:8, overflow:'hidden'}}>
            <div style={{background:CF_PALETTE.bg}}/>
            {days.map((d,i)=>(
              <div key={i} style={{background:'rgba(255,255,255,0.02)', padding:'10px 14px', fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim, textTransform:'uppercase', letterSpacing:'0.1em'}}>{d}</div>
            ))}
            {Array.from({length:8}).map((_,row)=>{
              const hr = 9+row;
              return (
                <React.Fragment key={row}>
                  <div style={{background:CF_PALETTE.bg, padding:'8px 10px', fontFamily:'JetBrains Mono,monospace', fontSize:10, color:CF_PALETTE.dim, textAlign:'right'}}>{String(hr).padStart(2,'0')}:00</div>
                  {days.map((_,col)=>(
                    <div key={col} style={{background:'rgba(255,255,255,0.015)', minHeight:60, position:'relative'}}/>
                  ))}
                </React.Fragment>
              );
            })}
          </div>
        </div>
        {/* events overlay */}
        <div style={{position:'absolute', left:24+60, right:24, top:24+38+24+30, bottom:24, display:'grid', gridTemplateColumns:'repeat(5,1fr)', pointerEvents:'none'}}>
          {events.map((e,i)=>{
            const a = Math.max(0, Math.min(1,(localTime-e.delay)/0.4));
            const top = (e.h-9) * 60.7;
            const h = e.dur * 60.7;
            return (
              <div key={i} style={{position:'relative', gridColumn:e.d+1}}>
                <div style={{
                  position:'absolute', top, left:6, right:6, height:h,
                  background:`linear-gradient(180deg, ${e.c}99, ${e.c}66)`,
                  borderLeft:`3px solid ${e.c}`, borderRadius:6,
                  padding:'8px 10px',
                  opacity:a, transform:`translateY(${(1-a)*6}px)`,
                  fontSize:12, color:CF_PALETTE.ink,
                }}>{e.t}</div>
              </div>
            );
          })}
          {/* Suggested new slot */}
          <div style={{position:'relative', gridColumn:newEvent.d+1}}>
            <div style={{
              position:'absolute', top:(newEvent.h-9)*60.7, left:6, right:6, height:newEvent.dur*60.7,
              background:'transparent',
              border:`1.5px dashed ${CF_PALETTE.warm}`,
              borderRadius:6, padding:'8px 10px',
              opacity: placeT, transform:`scale(${0.92+0.08*placeT})`,
              fontSize:12, color:CF_PALETTE.warm, fontFamily:'JetBrains Mono,monospace',
            }}>
              <div style={{fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase'}}>suggested</div>
              <div style={{marginTop:2}}>{newEvent.t}</div>
            </div>
          </div>
        </div>
      </CFChrome>
    </>
  );
}

// =====================================================================
// SCENE 8 — End card (27–30s)
// =====================================================================
function CFScene8() {
  const { localTime, duration } = useSprite();
  const fade = Math.min(1, localTime/0.5);
  return (
    <>
      <div style={{
        position:'absolute', inset:0,
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        opacity:fade,
      }}>
        <div style={{
          fontFamily:'Fraunces, serif', fontSize:130, fontWeight:400,
          letterSpacing:'-0.04em', color:CF_PALETTE.ink, lineHeight:1,
        }}>
          Client<em style={{color:CF_PALETTE.accent, fontStyle:'italic', fontWeight:500}}>Flow</em>
        </div>
        <div style={{
          width:60, height:1, background:CF_PALETTE.rule, margin:'28px 0',
        }}/>
        <div style={{
          fontFamily:'JetBrains Mono,monospace', fontSize:13, color:CF_PALETTE.dim,
          letterSpacing:'0.24em', textTransform:'uppercase',
          display:'flex', gap:18, alignItems:'center',
        }}>
          <span>30s</span>
          <span style={{width:3,height:3,borderRadius:999,background:CF_PALETTE.dim}}/>
          <span>CLIP 02</span>
          <span style={{width:3,height:3,borderRadius:999,background:CF_PALETTE.dim}}/>
          <span style={{color:CF_PALETTE.accent}}>End</span>
        </div>
      </div>
    </>
  );
}

// ---------- Timeline HUD ----------
function CFTimelineHUD() {
  const { time, duration } = useTimeline();
  const pct = (time/duration)*100;
  const marks = [0,3,7,11,15,19,23,27,30];
  return (
    <div style={{
      position:'absolute', left:80, bottom:40, right:80,
      display:'flex', flexDirection:'column', gap:8, pointerEvents:'none',
    }}>
      <div style={{display:'flex', justifyContent:'space-between', fontFamily:'JetBrains Mono,monospace', fontSize:11, color:CF_PALETTE.dim, letterSpacing:'0.1em'}}>
        <span>{cfFmt(time)} / {cfFmt(duration)}</span>
        <span>CLIP 02 · CLIENTFLOW · 30s</span>
      </div>
      <div style={{position:'relative', height:3, background:'rgba(255,255,255,0.10)', borderRadius:999}}>
        <div style={{position:'absolute', left:0, top:0, bottom:0, width:pct+'%', background:CF_PALETTE.accent, borderRadius:999}}/>
        {marks.map((m,i)=>(
          <div key={i} style={{position:'absolute', left:(m/duration)*100+'%', top:-2, width:1, height:7, background:CF_PALETTE.dim, opacity:0.5}}/>
        ))}
      </div>
    </div>
  );
}
function cfFmt(s){const m=Math.floor(s/60);const sec=Math.floor(s%60);const ms=Math.floor((s%1)*100);return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(ms).padStart(2,'0')}`}

// ---------- Root ----------
function ClientFlowVideo() {
  return (
    <>
      <style>{`
        @keyframes cf-caret { 50% { opacity: 0; } }
      `}</style>
      <CFBackground/>
      <Sprite start={0}  end={3}>  <CFScene1/> </Sprite>
      <Sprite start={3}  end={7}>  <CFScene2/> </Sprite>
      <Sprite start={7}  end={11}> <CFScene3/> </Sprite>
      <Sprite start={11} end={15}> <CFScene4/> </Sprite>
      <Sprite start={15} end={19}> <CFScene5/> </Sprite>
      <Sprite start={19} end={23}> <CFScene6/> </Sprite>
      <Sprite start={23} end={27}> <CFScene7/> </Sprite>
      <Sprite start={27} end={30}> <CFScene8/> </Sprite>
      <CFTimelineHUD/>
    </>
  );
}

Object.assign(window, { ClientFlowVideo, CF_PALETTE });
