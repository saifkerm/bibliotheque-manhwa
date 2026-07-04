import { coverOf, hostOf, pctOf, statusMeta } from '../utils/manga.js';

const STATUS_ORDER = ['reading', 'wishlist', 'paused', 'completed'];

export default function DetailScreen({ manga, settings, onBack, onPlusOne, onMinusOne, onToggleFav, onSetStatus, onEdit }) {
  const meta = statusMeta(manga.status, settings.accentKey);

  return (
    <div style={{ animation: 'slideUp .32s ease both' }}>
      <div style={{ height: 300, background: coverOf(manga, settings), position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(10,9,16,.15) 0%,rgba(10,9,16,.5) 55%,#0a0910 100%)' }} />
        <div onClick={onBack} style={{ position: 'absolute', top: 14, left: 16, width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, cursor: 'pointer', zIndex: 5 }}>‹</div>
        <div onClick={() => onToggleFav(manga.id)} style={{ position: 'absolute', top: 14, right: 16, width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,0,0,.45)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, cursor: 'pointer', zIndex: 5 }}>{manga.fav ? '❤️' : '🤍'}</div>
        <div style={{ position: 'absolute', left: 22, right: 22, bottom: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: meta.bg, padding: '5px 11px', borderRadius: 20, marginBottom: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{meta.label}</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{manga.title}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginTop: 4 }}>{manga.author}</div>
        </div>
      </div>

      <div style={{ padding: '20px 22px 30px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {manga.genres.map((g) => (
            <span key={g} style={{ fontSize: 11, fontWeight: 600, color: '#c7c2d6', background: '#1a1824', border: '1px solid rgba(255,255,255,.06)', padding: '6px 12px', borderRadius: 20 }}>{g}</span>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(150deg,#171522,#14121c)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 20, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, color: '#8b8798', fontWeight: 600 }}>Ta progression</span>
            <span style={{ fontSize: 13, color: 'var(--acc)', fontWeight: 700 }}>{pctOf(manga)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
            <span style={{ fontSize: 38, fontWeight: 800, color: '#fff', fontFamily: "'Space Grotesk',sans-serif" }}>{manga.currentCh}</span>
            <span style={{ fontSize: 18, color: '#6b6878', fontWeight: 600 }}>/ {manga.totalCh} chapitres</span>
          </div>
          <div style={{ marginTop: 14, height: 9, borderRadius: 8, background: 'rgba(255,255,255,.09)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: pctOf(manga), background: 'linear-gradient(90deg,var(--acc),var(--acc3))', borderRadius: 8, transition: 'width .4s ease' }} />
          </div>
          <div style={{ fontSize: 12, color: '#6b6878', marginTop: 10 }}>Dernière lecture · {manga.lastRead}</div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <div onClick={() => onMinusOne(manga.id)} style={{ width: 52, height: 52, flex: 'none', borderRadius: 14, background: '#1e1b28', border: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c7c2d6', fontSize: 22, cursor: 'pointer' }}>−</div>
            <div onClick={() => onPlusOne(manga.id)} style={{ flex: 1, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#03251f', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 10px 22px -8px rgba(34,193,166,.55)' }}>
              <span style={{ fontSize: 18 }}>＋</span> Chapitre suivant
            </div>
          </div>
        </div>

        <div
          onClick={() => manga.readUrl && window.open(manga.readUrl, '_blank', 'noopener')}
          style={{ marginTop: 14, height: 56, borderRadius: 16, background: '#17151f', border: '1px solid var(--acc-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: 'color-mix(in srgb, var(--acc) 16%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🔗</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Lire sur le site</div>
              <div style={{ fontSize: 11, color: '#6b6878' }}>{hostOf(manga.readUrl)}</div>
            </div>
          </div>
          <span style={{ color: 'var(--acc)', fontSize: 20, fontWeight: 700 }}>↗</span>
        </div>

        <div
          onClick={() => onEdit(manga.id)}
          style={{ marginTop: 12, height: 52, borderRadius: 16, background: '#17151f', border: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, cursor: 'pointer' }}
        >
          <span style={{ fontSize: 15 }}>✏️</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#c7c2d6' }}>Modifier la fiche</span>
        </div>

        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#8b8798', marginBottom: 12 }}>Changer le statut</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {STATUS_ORDER.map((s) => {
              const sMeta = statusMeta(s, settings.accentKey);
              const active = manga.status === s;
              return (
                <div
                  key={s}
                  onClick={() => onSetStatus(manga.id, s)}
                  style={{ cursor: 'pointer', padding: '13px 14px', borderRadius: 14, background: active ? sMeta.bg : '#17151f', border: `1px solid ${active ? sMeta.color : 'rgba(255,255,255,.06)'}`, display: 'flex', alignItems: 'center', gap: 9 }}
                >
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: sMeta.color, flex: 'none' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#fff' : '#b8b3c6' }}>{sMeta.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
