import { ACCENT_PALETTES, COVER_STYLES } from '../utils/manga.js';

export default function SettingsScreen({ settings, onBack, onSetAccent, onSetCoverStyle, onSetDensity }) {
  return (
    <div style={{ animation: 'slideUp .32s ease both', padding: '8px 22px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div onClick={onBack} style={{ width: 38, height: 38, borderRadius: '50%', background: '#17151f', border: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, cursor: 'pointer' }}>‹</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Réglages</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: '#8b8798', marginBottom: 12 }}>Couleur d'accent</div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        {Object.entries(ACCENT_PALETTES).map(([key, p]) => {
          const active = settings.accentKey === key;
          return (
            <div
              key={key}
              onClick={() => onSetAccent(key)}
              style={{
                cursor: 'pointer', padding: '10px 14px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 9,
                background: active ? `color-mix(in srgb, ${p.colors[0]} 22%, transparent)` : '#17151f',
                border: `1px solid ${active ? p.colors[0] : 'rgba(255,255,255,.06)'}`,
              }}
            >
              <span style={{ width: 18, height: 18, borderRadius: '50%', background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})`, flex: 'none' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#fff' : '#b8b3c6' }}>{p.label}</span>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: '#8b8798', marginBottom: 12 }}>Style des couvertures</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {COVER_STYLES.map((s) => {
          const active = settings.coverStyle === s.key;
          return (
            <div
              key={s.key}
              onClick={() => onSetCoverStyle(s.key)}
              style={{ cursor: 'pointer', padding: '13px 14px', borderRadius: 14, background: active ? 'color-mix(in srgb, var(--acc) 22%, transparent)' : '#17151f', border: `1px solid ${active ? 'var(--acc)' : 'rgba(255,255,255,.06)'}`, textAlign: 'center' }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#fff' : '#b8b3c6' }}>{s.label}</span>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 13, fontWeight: 700, color: '#8b8798', marginBottom: 12 }}>Densité de la grille</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[{ key: 'comfy', label: 'Confortable · 2 col.' }, { key: 'dense', label: 'Dense · 3 col.' }].map((d) => {
          const active = settings.density === d.key;
          return (
            <div
              key={d.key}
              onClick={() => onSetDensity(d.key)}
              style={{ cursor: 'pointer', padding: '13px 14px', borderRadius: 14, background: active ? 'color-mix(in srgb, var(--acc) 22%, transparent)' : '#17151f', border: `1px solid ${active ? 'var(--acc)' : 'rgba(255,255,255,.06)'}`, textAlign: 'center' }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#fff' : '#b8b3c6' }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
