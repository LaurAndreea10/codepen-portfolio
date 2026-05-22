// scenes3.jsx — scene 6 (escape) + credits

// ── SCENE 6: ESCAPE & LEGEND ────────────────────────────────────────────────
function SceneEscape() {
  const { localTime, duration } = useSprite();
  const fadeIn = animate({ from: 0, to: 1, start: 0, end: 0.8 })(localTime);
  const fadeOut = animate({ from: 0, to: 1, start: duration - 0.8, end: duration })(localTime);
  const overallOp = fadeIn * (1 - fadeOut);

  let subtitle = null;
  if (localTime >= 1.5 && localTime < 5.5) {
    subtitle = { name: 'BELLA', text: '"Planul B?"', color: '#D26B8A' };
  } else if (localTime >= 5.8 && localTime < 9.5) {
    subtitle = { name: 'RICK', text: '"Să fugim!"', color: '#6B9BD2' };
  } else if (localTime >= 9.8 && localTime < 13.5) {
    subtitle = { name: 'NARATOR', text: '"Au câștigat o nucă. Și au câștigat... LEGENDA."', color: '#8A8070' };
  } else if (localTime >= 13.8 && localTime < 17.0) {
    subtitle = { name: 'MAX', text: '"Știți... mai sunt și nuci de argint..."', color: '#7BD26B' };
  }

  // explosion rings
  const explosionStart = 5.8;
  const rings = [0, 0.25, 0.5].map(offset => {
    const t = localTime - explosionStart - offset;
    if (t < 0 || t > 1.5) return null;
    const p = t / 1.5;
    return { scale: p * 4, opacity: 1 - p };
  });

  const flash = localTime > explosionStart && localTime < explosionStart + 0.15 ? 1 : 0;

  // raccoons flying out
  const escStart = 6.0;
  const escProg = Math.max(0, Math.min(1, (localTime - escStart) / 2.5));

  // golden nut floating up at end
  const nutY = animate({ from: 100, to: -50, start: 10, end: duration, ease: Easing.easeOutCubic })(localTime);
  const nutScale = animate({ from: 0, to: 1, start: 9.5, end: 11, ease: Easing.easeOutBack })(localTime);
  const nutRot = localTime * 40;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #2a1510 0%, #1a0f0a 40%, #0A0A0F 100%)',
      opacity: overallOp,
    }}>
      {flash > 0 && <div style={{ position: 'absolute', inset: 0, background: '#FFF8DC', opacity: flash, zIndex: 45 }}/>}

      {/* explosion rings from center */}
      {rings.map((r, i) => r && (
        <div key={i} style={{
          position: 'absolute', left: '50%', top: '55%',
          width: 60, height: 60,
          transform: `translate(-50%, -50%) scale(${r.scale})`,
          border: '4px solid #D4A843',
          borderRadius: '50%',
          opacity: r.opacity,
          boxShadow: '0 0 40px #D4A843',
        }}/>
      ))}

      {/* debris particles */}
      {localTime > explosionStart && localTime < explosionStart + 3 && (
        [...Array(20)].map((_, i) => {
          const t = localTime - explosionStart;
          const angle = (i * 18) * Math.PI / 180;
          const dist = t * 400;
          const gravity = t * t * 80;
          return (
            <div key={i} style={{
              position: 'absolute',
              left: '50%', top: '55%',
              width: 8, height: 8,
              background: i % 2 ? '#D4A843' : '#8B5A2A',
              borderRadius: i % 3 === 0 ? '50%' : '2px',
              transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + gravity}px) rotate(${t * 300}deg)`,
              opacity: Math.max(0, 1 - t / 3),
            }}/>
          );
        })
      )}

      {/* Silhouette raccoons running (bottom) */}
      {escProg > 0 && escProg < 1 && (
        <div style={{
          position: 'absolute', bottom: '10%',
          left: `${10 + escProg * 80}%`,
          display: 'flex', gap: 30,
          transform: `translateY(${Math.sin(localTime * 12) * 6}px)`,
        }}>
          <Raccoon x={0} y={0} scale={1.3} eyeColor="#6B9BD2" flip />
          <Raccoon x={0} y={0} scale={1.3} eyeColor="#D26B8A" flip />
          <Raccoon x={0} y={0} scale={1.3} eyeColor="#7BD26B" flip />
        </div>
      )}

      {/* The Golden Nut — hero shot */}
      {localTime > 9 && (
        <div style={{
          position: 'absolute', left: '50%', top: '45%',
          transform: `translate(-50%, ${-nutY}px) scale(${nutScale}) rotate(${nutRot}deg)`,
          filter: 'drop-shadow(0 0 60px rgba(212,168,67,0.8))',
        }}>
          <svg width="180" height="220" viewBox="0 0 180 220">
            <defs>
              <radialGradient id="nut" cx="40%" cy="30%">
                <stop offset="0%" stopColor="#FFF4C7"/>
                <stop offset="40%" stopColor="#F5D98A"/>
                <stop offset="80%" stopColor="#D4A843"/>
                <stop offset="100%" stopColor="#8B6515"/>
              </radialGradient>
            </defs>
            <ellipse cx="90" cy="120" rx="70" ry="90" fill="url(#nut)"/>
            <path d="M 90 30 L 90 210" stroke="#6B4E10" strokeWidth="2" opacity="0.5"/>
            <ellipse cx="90" cy="120" rx="68" ry="88" fill="none" stroke="#8B6515" strokeWidth="1.5" opacity="0.4"/>
            {/* specular highlight */}
            <ellipse cx="65" cy="70" rx="18" ry="28" fill="rgba(255,255,255,0.4)"/>
          </svg>
        </div>
      )}

      {/* radiant rays during hero shot */}
      {localTime > 10 && (
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} viewBox="0 0 1920 1080">
          {[...Array(16)].map((_, i) => {
            const angle = (i * 22.5 + localTime * 15) * Math.PI / 180;
            const x1 = 960, y1 = 485;
            const x2 = 960 + Math.cos(angle) * 1500;
            const y2 = 485 + Math.sin(angle) * 1500;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F5D98A" strokeWidth="3" opacity="0.5"/>;
          })}
        </svg>
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
        ◇ SCENA VI — LEGENDA
      </div>

      {subtitle && <Subtitle {...subtitle} />}
    </div>
  );
}

// ── CREDITS ─────────────────────────────────────────────────────────────────
function SceneCredits() {
  const { localTime, duration } = useSprite();
  const fadeIn = animate({ from: 0, to: 1, start: 0, end: 1.0 })(localTime);

  const lineOp = (delay) => animate({ from: 0, to: 1, start: delay, end: delay + 0.7 })(localTime);

  const creditsY = animate({ from: 80, to: 0, start: 0, end: 2, ease: Easing.easeOutQuart })(localTime);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at 50% 50%, rgba(212,168,67,0.05), #0A0A0F 70%)',
      opacity: fadeIn,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '0 120px',
      textAlign: 'center',
    }}>
      <div style={{ transform: `translateY(${creditsY}px)` }}>
        <div style={{
          fontFamily: "'Special Elite', monospace",
          fontSize: 22,
          color: '#8A8070',
          letterSpacing: '0.5em',
          marginBottom: 40,
          opacity: lineOp(0.2),
        }}>UN SCENARIU DE</div>

        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 120,
          color: '#D4A843',
          letterSpacing: '0.1em',
          textShadow: '0 0 60px rgba(212,168,67,0.4)',
          opacity: lineOp(0.8),
          lineHeight: 1,
        }}>
          OPERAȚIUNEA:
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 80,
          color: '#F5D98A',
          letterSpacing: '0.2em',
          marginTop: 20,
          opacity: lineOp(1.2),
        }}>
          NUCILE DE AUR
        </div>

        <div style={{
          fontFamily: "'Lora', serif",
          fontSize: 26,
          color: '#8A8070',
          marginTop: 60,
          opacity: lineOp(2.0),
        }}>
          — DISTRIBUȚIA —
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 32,
          letterSpacing: '0.15em',
          marginTop: 20,
          opacity: lineOp(2.4),
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 30,
          maxWidth: 1200,
          margin: '20px auto 0',
        }}>
          <div><span style={{ color: '#6B9BD2' }}>RICK</span><div style={{ fontSize: 16, color: '#8A8070', fontFamily: "'Special Elite', monospace", letterSpacing: '0.2em', marginTop: 8 }}>CREIERUL</div></div>
          <div><span style={{ color: '#D26B8A' }}>BELLA</span><div style={{ fontSize: 16, color: '#8A8070', fontFamily: "'Special Elite', monospace", letterSpacing: '0.2em', marginTop: 8 }}>STRATEGA</div></div>
          <div><span style={{ color: '#7BD26B' }}>MAX</span><div style={{ fontSize: 16, color: '#8A8070', fontFamily: "'Special Elite', monospace", letterSpacing: '0.2em', marginTop: 8 }}>TEHNICIANUL</div></div>
          <div><span style={{ color: '#D2B06B' }}>CLAWSON</span><div style={{ fontSize: 16, color: '#8A8070', fontFamily: "'Special Elite', monospace", letterSpacing: '0.2em', marginTop: 8 }}>DETECTIVUL</div></div>
        </div>

        <div style={{
          fontFamily: "'Lora', serif",
          fontStyle: 'italic',
          fontSize: 28,
          color: '#8A8070',
          marginTop: 80,
          opacity: lineOp(4.0),
        }}>
          Coming soon...
        </div>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 54,
          color: '#D4A843',
          letterSpacing: '0.2em',
          marginTop: 12,
          opacity: lineOp(4.5),
          textShadow: '0 0 40px rgba(212,168,67,0.4)',
        }}>
          OPERAȚIUNEA: NUCILE DE ARGINT
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SceneEscape, SceneCredits });
