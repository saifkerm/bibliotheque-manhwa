import { coverOf, pctOf, statusMeta } from '../utils/manga.js';

const CHIP_DEFS = [
  { key: 'all', label: 'Tout' },
  { key: 'reading', label: 'En cours' },
  { key: 'wishlist', label: 'À lire' },
  { key: 'completed', label: 'Terminé' },
  { key: 'paused', label: 'En pause' },
  { key: 'fav', label: '❤︎ Favoris' },
];

export default function LibraryScreen({ items, settings, query, setQuery, filter, setFilter, onOpen, onPlusOne, onToggleFav, onOpenSettings }) {
  const q = query.trim().toLowerCase();
  let list = items;
  if (filter === 'fav') list = list.filter((m) => m.fav);
  else if (filter !== 'all') list = list.filter((m) => m.status === filter);
  if (q) list = list.filter((m) => m.title.toLowerCase().includes(q) || m.author.toLowerCase().includes(q));

  const reading = items.filter((m) => m.status === 'reading');
  const dense = settings.density === 'dense';
  const gridCols = dense ? '1fr 1fr 1fr' : '1fr 1fr';
  const gridGap = dense ? 11 : 16;

  return (
    <div style={{ animation: 'slideUp .35s ease both' }}>
      <div style={{ padding: '8px 20px 4px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--acc)', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>Ma bibliothèque</div>
          <div style={{ fontSize: 27, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginTop: 3 }}>{items.length} manhwas<br />en collection</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div onClick={onOpenSettings} style={{ width: 40, height: 40, borderRadius: '50%', background: '#17151f', border: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, cursor: 'pointer', flex: 'none' }}>⚙️</div>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#04231e', fontSize: 15, flex: 'none', boxShadow: '0 6px 16px -4px rgba(34,193,166,.6)' }}>笑</div>
        </div>
      </div>

      <div style={{ padding: '16px 0 6px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#8b8798', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          <span>Reprendre la lecture</span>
          <span style={{ color: 'var(--acc)', fontSize: 12 }}>← glisser · {reading.length} en cours</span>
        </div>
        <div className="hscroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '2px 20px 6px' }}>
          {reading.map((m) => (
            <div key={m.id} onClick={() => onOpen(m.id)} style={{ flex: 'none', width: 150, cursor: 'pointer', animation: 'popIn .3s ease both' }}>
              <div style={{ height: 96, borderRadius: 16, background: coverOf(m, settings), position: 'relative', overflow: 'hidden', boxShadow: '0 8px 20px -8px rgba(0,0,0,.7)' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0) 30%,rgba(0,0,0,.72) 100%)' }} />
                <div style={{ position: 'absolute', left: 12, bottom: 10, right: 12 }}>
                  <div style={{ fontWeight: 800, color: '#fff', fontSize: 14, lineHeight: 1.1, textShadow: '0 1px 4px rgba(0,0,0,.5)' }}>{m.title}</div>
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20 }}>Ch. {m.currentCh}</div>
              </div>
              <div style={{ marginTop: 8, height: 5, borderRadius: 6, background: 'rgba(255,255,255,.1)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: pctOf(m), background: 'linear-gradient(90deg,var(--acc),var(--acc3))', borderRadius: 6 }} />
              </div>
              <div style={{ marginTop: 6, fontSize: 11, color: '#7d7a89', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Ch. {m.currentCh} / {m.totalCh || '?'}</span>
                <span onClick={(e) => { e.stopPropagation(); onPlusOne(m.id); }} style={{ color: 'var(--acc)', fontWeight: 700, cursor: 'pointer', padding: '2px 4px' }}>+1 ch</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '14px 20px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#17151f', border: '1px solid rgba(255,255,255,.06)', borderRadius: 14, padding: '12px 14px' }}>
          <span style={{ opacity: .5 }}>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un titre, un auteur…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 14 }}
          />
          {q.length > 0 && (
            <span onClick={() => setQuery('')} style={{ cursor: 'pointer', color: '#6b6878', fontSize: 16 }}>✕</span>
          )}
        </div>
      </div>

      <div className="hscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 20px 12px' }}>
        {CHIP_DEFS.map((c) => {
          const active = filter === c.key;
          return (
            <div
              key={c.key}
              onClick={() => setFilter(c.key)}
              style={{
                flex: 'none', cursor: 'pointer', padding: '8px 15px', borderRadius: 20, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                background: active ? 'var(--acc)' : '#17151f', color: active ? '#04231e' : '#b8b3c6',
                border: `1px solid ${active ? 'var(--acc)' : 'rgba(255,255,255,.06)'}`, transition: 'all .15s',
              }}
            >
              {c.label}
            </div>
          );
        })}
      </div>

      <div style={{ padding: '4px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#8b8798' }}>{list.length} {list.length > 1 ? 'titres' : 'titre'}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: gridGap }}>
          {list.map((m) => {
            const meta = statusMeta(m.status, settings.accentKey);
            return (
              <div key={m.id} onClick={() => onOpen(m.id)} style={{ cursor: 'pointer', animation: 'popIn .3s ease both' }}>
                <div style={{ aspectRatio: '3/4.1', borderRadius: 16, background: coverOf(m, settings), position: 'relative', overflow: 'hidden', boxShadow: '0 10px 24px -12px rgba(0,0,0,.8)' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,.78) 100%)' }} />
                  <div style={{ position: 'absolute', top: 9, left: 9, display: 'flex', alignItems: 'center', gap: 5, background: meta.bg, backdropFilter: 'blur(6px)', padding: '4px 9px', borderRadius: 20 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{meta.label}</span>
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); onToggleFav(m.id); }} style={{ position: 'absolute', top: 7, right: 7, width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, cursor: 'pointer' }}>{m.fav ? '❤️' : '🤍'}</div>
                  <div style={{ position: 'absolute', left: 11, right: 11, bottom: 10 }}>
                    <div style={{ fontWeight: 800, color: '#fff', fontSize: 14, lineHeight: 1.12, textShadow: '0 1px 4px rgba(0,0,0,.6)' }}>{m.title}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.72)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Ch. {m.currentCh}/{m.totalCh}</span>
                      <span>{m.lastRead}</span>
                    </div>
                    <div style={{ marginTop: 6, height: 4, borderRadius: 6, background: 'rgba(255,255,255,.22)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: pctOf(m), background: meta.color, borderRadius: 6 }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {list.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6b6878' }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>🫥</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Aucun manhwa trouvé</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Essaie un autre filtre ou recherche</div>
          </div>
        )}
      </div>
    </div>
  );
}
