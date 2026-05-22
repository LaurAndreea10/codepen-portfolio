// scenes2.jsx — scenes 3-5 (training, infiltration, showdown)

// ── SCENE 3: TRAINING MONTAGE (lasers) ──────────────────────────────────────
function SceneTraining() {
  const { localTime, duration } = useSprite();
  const fadeIn = animate({ from: 0, to: 1, start: 0, end: 0.8 })(localTime);
  const fadeOut = animate({ from: 0, to: 1, start: duration - 0.6, end: duration })(localTime);
  const overallOp = fadeIn * (1 - fadeOut);

  let subtitle = null;
  if (localTime >= 2.0 && localTime < 6.5) {
    subtitle = { name: 'CLAWSON', text: '"Trei ratoni. O singură șansă să-i prind."', color: '#D2B06B' };
  } else if (localTime >= 7.0 && localTime < 10.5) {
    subtitle = { name: 'NARATOR', text: '"Antrenamentul a început."', color: '#8A8070' };
  }

  const binocularIris = animate({ from: 1, to: 0, start: 0, end: 1.2, ease: Easing.easeOutCubic })(localTime);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #0F1A1A 0%, #1A2A2A 50%, #0D1820 100%)',
      opacity: overallOp,
    }}>
      {/* floor grid */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 60%)',
      }}/>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
        backgroundImage: `linear-gradient(rgba(26,58,58,0.4) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(26,58,58,0.4) 1px, transparent 1px)`,
        backgroundSize: '80px 40px',
        transform: 'perspective(600px) rotateX(60deg)',
        transformOrigin: 'bottom',
      }}/>

      {/* laser grid */}
      {[
        { top: '25%', delay: 0, dir: 1 },
        { top: '40%', delay: 0.7, dir: -1 },
        { top: '55%', delay: 1.3, dir: 1 },
        { top: '70%', delay: 0.4, dir: -1 },
      ].map((l, i) => {
        const t = (localTime + l.delay) % 2;
        const offset = Math.sin(t * Math.PI) * 40 * l.dir;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: '10%', right: '10%',
            top: l.top,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #FF3344 20%, #FF6655 50%, #FF3344 80%, transparent)',
            boxShadow: '0 0 20px #FF3344, 0 0 40px rgba(255,51,68,0.5)',
            transform: `translateX(${offset}px)`,
            opacity: 0.9,
          }}/>
        );
      })}

      {/* tripwire dots */}
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${10 + i * 7}%`,
          top: `${25 + (i % 4) * 15}%`,
          width: 6, height: 6,
          background: '#FF3344',
          borderRadius: '50%',
          boxShadow: '0 0 8px #FF3344',
          opacity: 0.6 + 0.4 * Math.sin(localTime * 4 + i),
        }}/>
      ))}

      {/* raccoons in poses — training */}
      <div style={{ position: 'absolute', left: '22%', top: '62%', transform: `translateY(${Math.sin(localTime * 3) * 6}px)` }}>
        <Raccoon x={0} y={0} scale={1.8} eyeColor="#6B9BD2" tilt={-8} />
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '48%', transform: `translate(-50%, ${Math.sin(localTime * 3 + 1) * 8}px) rotate(5deg)` }}>
        <Raccoon x={0} y={0} scale={1.7} eyeColor="#D26B8A" />
      </div>
      <div style={{ position: 'absolute', left: '78%', top: '66%', transform: `translateX(-100%) rotate(${Math.sin(localTime * 2) * 6}deg)` }}>
        <Raccoon x={0} y={0} scale={1.6} eyeColor="#7BD26B" flip tilt={15} />
      </div>

      {/* binocular iris overlay */}
      {binocularIris > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 70% 30%, transparent ${200 * (1 - binocularIris)}px, rgba(0,0,0,0.95) ${280 * (1 - binocularIris)}px)`,
          zIndex: 45,
        }}>
          <div style={{
            position: 'absolute', left: '70%', top: '30%',
            transform: 'translate(-50%, -50%)',
            width: 12, height: 12,
            borderRadius: '50%',
            background: '#FF3344',
            opacity: Math.sin(localTime * 8) > 0 ? 1 : 0.3,
          }}/>
          <div style={{
            position: 'absolute', left: '70%', top: '30%',
            transform: 'translate(-50%, -50%)',
            fontFamily: "'Special Elite', monospace",
            fontSize: 18,
            color: '#FF3344',
            marginTop: 40,
          }}>REC ●</div>
        </div>
      )}

      {/* Clawson silhouette in corner */}
      {localTime > 1.0 && (
        <div style={{ opacity: animate({ from: 0, to: 1, start: 1.0, end: 2.0 })(localTime) }}>
          <CatDetective x="88%" y="70%" scale={1.6} />
        </div>
      )}

      <Scanlines />
      <Vignette />
      <Grain />

      <div style={{
        position: 'absolute', top: 60, left: 80,
        fontFamily: "'Special Elite', monospace",
        color: '#D4A843',
        fontSize: 22,
        letterSpacing: '0.4em',
        opacity: animate({ from: 0, to: 1, start: 0.4, end: 1.2 })(localTime),
      }}>
        ◇ SCENA III — ANTRENAMENTUL & UMBRA
      </div>

      {subtitle && <Subtitle {...subtitle} />}
    </div>
  );
}

// ── SCENE 4: INFILTRATION (city at night) ───────────────────────────────────
function SceneInfiltration() {
  const { localTime, duration } = useSprite();
  const fadeIn = animate({ from: 0, to: 1, start: 0, end: 0.8 })(localTime);
  const fadeOut = animate({ from: 0, to: 1, start: duration - 0.6, end: duration })(localTime);
  const overallOp = fadeIn * (1 - fadeOut);

  let subtitle = null;
  if (localTime >= 2.0 && localTime < 6.0) {
    subtitle = { name: 'BELLA', text: '"Suntem aproape. Timpul e tot ce nu avem."', color: '#D26B8A' };
  } else if (localTime >= 6.3 && localTime < 10.5) {
    subtitle = { name: 'RICK', text: '"Intrăm. Luăm nucile. Ieșim. Fără eroi."', color: '#6B9BD2' };
  }

  // rooftop traverse
  const raccoonX = animate({ from: 10, to: 65, start: 1, end: duration - 1, ease: Easing.easeInOutQuad })(localTime);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #0A0A15 0%, #15101A 40%, #0D0D18 100%)',
      opacity: overallOp,
    }}>
      {/* stars */}
      {[...Array(40)].map((_, i) => {
        const x = (i * 53) % 100;
        const y = (i * 37) % 40;
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(localTime * 2 + i));
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            width: 2, height: 2,
            background: '#F5D98A',
            borderRadius: '50%',
            opacity: tw * 0.7,
          }}/>
        );
      })}

      {/* moon */}
      <div style={{
        position: 'absolute', top: '8%', right: '12%',
        width: 180, height: 180,
        background: 'radial-gradient(circle at 55% 40%, #FFF8DC 0%, #F5D98A 40%, #D4A843 75%, transparent 95%)',
        borderRadius: '50%',
        boxShadow: '0 0 120px rgba(245,217,138,0.3)',
      }}>
        {/* craters */}
        <div style={{ position: 'absolute', top: '30%', left: '30%', width: 14, height: 14, background: 'rgba(180,140,60,0.4)', borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', top: '55%', left: '50%', width: 10, height: 10, background: 'rgba(180,140,60,0.4)', borderRadius: '50%' }}/>
        <div style={{ position: 'absolute', top: '40%', left: '65%', width: 8, height: 8, background: 'rgba(180,140,60,0.4)', borderRadius: '50%' }}/>
      </div>

      {/* skyline buildings */}
      <div style={{ position: 'absolute', bottom: 0, left: '5%', width: 160, height: '55%', background: '#060610' }}/>
      <div style={{ position: 'absolute', bottom: 0, left: '16%', width: 200, height: '70%', background: '#08080F' }}/>
      {/* VAULT building — central */}
      <div style={{ position: 'absolute', bottom: 0, left: '40%', width: 280, height: '78%', background: 'linear-gradient(180deg, #1a1a28 0%, #08080F 100%)', borderRadius: '6px 6px 0 0' }}>
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: '0.3em', color: '#D4A843', textShadow: '0 0 20px #D4A843' }}>SEIF</div>
        {/* windows */}
        {[...Array(5)].map((_, r) => (
          [...Array(4)].map((_, c) => {
            const lit = (r + c + Math.floor(localTime * 2)) % 5 === 0;
            return (
              <div key={`${r}-${c}`} style={{
                position: 'absolute',
                top: `${35 + r * 11}%`,
                left: `${12 + c * 22}%`,
                width: 22, height: 28,
                background: lit ? '#F5D98A' : '#0a0a12',
                opacity: lit ? 0.8 : 1,
                boxShadow: lit ? '0 0 12px #F5D98A' : 'none',
              }}/>
            );
          })
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 0, right: '18%', width: 180, height: '60%', background: '#07070D' }}/>
      <div style={{ position: 'absolute', bottom: 0, right: '5%', width: 140, height: '45%', background: '#050510' }}/>

      {/* searchlight beam */}
      <div style={{
        position: 'absolute',
        top: '60%', left: '40%',
        width: 6, height: 400,
        background: 'linear-gradient(180deg, rgba(245,217,138,0.5) 0%, transparent 100%)',
        transformOrigin: 'top center',
        transform: `rotate(${20 * Math.sin(localTime * 0.8)}deg)`,
        filter: 'blur(8px)',
      }}/>

      {/* raccoon crossing rooftop */}
      <div style={{
        position: 'absolute',
        left: `${raccoonX}%`,
        top: '32%',
        transform: `translateY(${Math.sin(localTime * 6) * 4}px)`,
      }}>
        <Raccoon x={0} y={0} scale={1.2} eyeColor="#6B9BD2" />
      </div>

      <Scanlines />
      <Vignette />
      <Grain />

      <div style={{
        position: 'absolute', top: 60, left: 80,
        fontFamily: "'Special Elite', monospace",
        color: '#D4A843',
        fontSize: 22,
        letterSpacing: '0.4em',
        opacity: animate({ from: 0, to: 1, start: 0.4, end: 1.2 })(localTime),
      }}>
        ◇ SCENA IV — NOAPTEA FESTIVALULUI
      </div>

      {subtitle && <Subtitle {...subtitle} />}
    </div>
  );
}

// ── SCENE 5: SHOWDOWN ───────────────────────────────────────────────────────
function SceneShowdown() {
  const { localTime, duration } = useSprite();
  const fadeIn = animate({ from: 0, to: 1, start: 0, end: 0.8 })(localTime);
  const fadeOut = animate({ from: 0, to: 1, start: duration - 0.6, end: duration })(localTime);
  const overallOp = fadeIn * (1 - fadeOut);

  let subtitle = null;
  if (localTime >= 2.0 && localTime < 6.5) {
    subtitle = { name: 'MAX', text: '"Prea târziu... am activat PROTOCOLUL VEVERIȚA SUPREMĂ."', color: '#7BD26B' };
  } else if (localTime >= 7.0 && localTime < 10.8) {
    subtitle = { name: 'RICK', text: '"Toată lumea jos! Momeala!"', color: '#6B9BD2' };
  }

  // screen shake on clash
  const clashBeats = [1.2, 2.8, 4.5, 6.2, 8.0, 9.5];
  let shake = 0;
  for (const beat of clashBeats) {
    const d = localTime - beat;
    if (d >= 0 && d < 0.25) {
      shake = Math.sin(d * 60) * (1 - d / 0.25) * 12;
    }
  }

  // squirrel reveal
  const squirrelOp = animate({ from: 0, to: 1, start: 0.5, end: 1.8 })(localTime);
  const squirrelScale = animate({ from: 1.8, to: 1, start: 0.5, end: 1.8, ease: Easing.easeOutBack })(localTime);

  // flashes
  const flashOn = clashBeats.some(b => localTime - b >= 0 && localTime - b < 0.1);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at 50% 50%, #3a1515 0%, #1a0a0a 50%, #0A0A0F 100%)',
      opacity: overallOp,
      transform: `translate(${shake}px, ${shake * 0.5}px)`,
    }}>
      {/* flash */}
      {flashOn && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,220,150,0.25)', zIndex: 40 }}/>
      )}

      {/* radial speed lines */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} viewBox="0 0 1920 1080">
        {[...Array(24)].map((_, i) => {
          const angle = (i * 15 + localTime * 30) * Math.PI / 180;
          const r1 = 200, r2 = 900;
          const x1 = 960 + Math.cos(angle) * r1;
          const y1 = 540 + Math.sin(angle) * r1;
          const x2 = 960 + Math.cos(angle) * r2;
          const y2 = 540 + Math.sin(angle) * r2;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4A843" strokeWidth="2" opacity="0.4"/>;
        })}
      </svg>

      {/* Rick (left) */}
      <div style={{ position: 'absolute', left: '22%', top: '55%' }}>
        <Raccoon x={0} y={0} scale={2.8} eyeColor="#6B9BD2" tilt={-15} />
      </div>

      {/* Squirrel supreme (right) — stylized */}
      <div style={{
        position: 'absolute', right: '22%', top: '55%',
        transform: `translate(50%, -50%) scale(${squirrelScale})`,
        opacity: squirrelOp,
      }}>
        <div style={{ position: 'relative', width: 180, height: 220 }}>
          {/* tail */}
          <div style={{
            position: 'absolute', left: -30, top: -40,
            width: 90, height: 180,
            background: 'radial-gradient(ellipse, #6b3a15 0%, #2a1408 80%)',
            borderRadius: '50% 20% 50% 50%',
            transform: `rotate(-30deg) translateY(${Math.sin(localTime * 5) * 8}px)`,
          }}/>
          {/* body */}
          <div style={{ position: 'absolute', left: 30, top: 70, width: 120, height: 140, background: 'radial-gradient(ellipse at 50% 30%, #8b4a1a 0%, #3a1a08 85%)', borderRadius: '45% 45% 40% 40%' }}/>
          {/* head */}
          <div style={{ position: 'absolute', left: 40, top: 20, width: 100, height: 90, background: 'radial-gradient(ellipse at 50% 40%, #9a5520 0%, #3a1a08 90%)', borderRadius: '50%' }}/>
          {/* ears (tufted) */}
          <div style={{ position: 'absolute', left: 42, top: 4, width: 24, height: 32, background: '#2a1408', borderRadius: '50% 50% 20% 20%' }}/>
          <div style={{ position: 'absolute', right: 42, top: 4, width: 24, height: 32, background: '#2a1408', borderRadius: '50% 50% 20% 20%' }}/>
          {/* eyes — red */}
          <div style={{ position: 'absolute', left: 55, top: 40, width: 14, height: 14, background: '#ff3344', borderRadius: '50%', boxShadow: '0 0 20px #ff3344' }}/>
          <div style={{ position: 'absolute', right: 55, top: 40, width: 14, height: 14, background: '#ff3344', borderRadius: '50%', boxShadow: '0 0 20px #ff3344' }}/>
        </div>
      </div>

      {/* Crossed swords in center */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: `translate(-50%, -50%) rotate(${shake * 2}deg)`,
        fontSize: 180,
        filter: `drop-shadow(0 0 30px #D4A843)`,
      }}>⚔</div>

      {/* sparks */}
      {clashBeats.map((beat, i) => {
        const d = localTime - beat;
        if (d < 0 || d > 0.8) return null;
        return [...Array(8)].map((_, j) => {
          const angle = (j * 45) * Math.PI / 180;
          const dist = d * 400;
          return (
            <div key={`${i}-${j}`} style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: 6, height: 6,
              background: '#D4A843',
              borderRadius: '50%',
              transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
              opacity: 1 - d / 0.8,
              boxShadow: '0 0 12px #D4A843',
            }}/>
          );
        });
      })}

      <Scanlines />
      <Vignette />
      <Grain />

      <div style={{
        position: 'absolute', top: 60, left: 80,
        fontFamily: "'Special Elite', monospace",
        color: '#D4A843',
        fontSize: 22,
        letterSpacing: '0.4em',
        opacity: animate({ from: 0, to: 1, start: 0.4, end: 1.2 })(localTime),
      }}>
        ◇ SCENA V — VEVERIȚA SUPREMĂ
      </div>

      {subtitle && <Subtitle {...subtitle} />}
    </div>
  );
}

Object.assign(window, { SceneTraining, SceneInfiltration, SceneShowdown });
