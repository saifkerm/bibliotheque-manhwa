import { useState } from 'react';
import { searchManga } from '../api/mangadex.js';
import { coverFromHues, hueFromString, statusMeta } from '../utils/manga.js';

const STATUS_ORDER = ['reading', 'wishlist', 'paused', 'completed'];

const EMPTY_FORM = { title: '', author: '', currentCh: '', totalCh: '', status: 'wishlist', readUrl: '', coverImg: null };

export default function AddScreen({ settings, onBack, onAdd }) {
  const [apiQuery, setApiQuery] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResults, setApiResults] = useState([]);
  const [apiError, setApiError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);

  async function runSearch() {
    if (!apiQuery.trim()) return;
    setApiLoading(true);
    setApiError('');
    setApiResults([]);
    const { results, error } = await searchManga(apiQuery);
    setApiLoading(false);
    setApiResults(results);
    setApiError(error);
  }

  function pickResult(r) {
    setForm((f) => ({
      ...f,
      title: r.title,
      author: r.author,
      totalCh: r.totalCh ? String(r.totalCh) : '',
      currentCh: f.currentCh || '0',
      readUrl: r.url || '',
      coverImg: r.coverImg || null,
    }));
    setApiResults([]);
  }

  function submit() {
    if (!form.title.trim()) return;
    const th = hueFromString(form.title);
    onAdd({ ...form, h1: th });
    setForm(EMPTY_FORM);
    setApiResults([]);
    setApiQuery('');
  }

  const th = hueFromString(form.title);
  const formCover = form.coverImg ? `#1a1824 url("${form.coverImg}") center/cover no-repeat` : coverFromHues(th, (th + 50) % 360);

  return (
    <div style={{ animation: 'slideUp .32s ease both', padding: '8px 22px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div onClick={onBack} style={{ width: 38, height: 38, borderRadius: '50%', background: '#17151f', border: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, cursor: 'pointer' }}>‹</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Ajouter un manhwa</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ background: 'linear-gradient(150deg,#171522,#14121c)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 18, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--acc)', letterSpacing: '.08em', marginBottom: 10, fontFamily: "'Space Grotesk',sans-serif" }}>RECHERCHE EN LIGNE · MANGADEX</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={apiQuery}
            onChange={(e) => setApiQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            placeholder="Nom du manhwa…"
            style={{ flex: 1, background: '#0f0e15', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none' }}
          />
          <div onClick={runSearch} style={{ width: 48, flex: 'none', borderRadius: 12, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, cursor: 'pointer', color: '#03251f' }}>🔍</div>
        </div>

        {apiLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 4px 4px', color: '#8b8798', fontSize: 13 }}>
            <span style={{ width: 16, height: 16, border: '2px solid var(--acc-soft)', borderTopColor: 'var(--acc)', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} />
            Recherche en cours…
          </div>
        )}

        {!apiLoading && apiError && (
          <div style={{ padding: '14px 4px 2px', color: '#8b8798', fontSize: 13 }}>{apiError}</div>
        )}

        {!apiLoading && apiResults.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            {apiResults.map((r, i) => (
              <div
                key={i}
                onClick={() => pickResult(r)}
                style={{ display: 'flex', gap: 12, alignItems: 'center', background: '#0f0e15', border: '1px solid rgba(255,255,255,.06)', borderRadius: 13, padding: 9, cursor: 'pointer', animation: 'popIn .25s ease both' }}
              >
                <div style={{ width: 44, height: 60, flex: 'none', borderRadius: 8, background: r.coverImg ? `#1a1824 url("${r.coverImg}") center/cover no-repeat` : (r.cover || coverFromHues(hueFromString(r.title), (hueFromString(r.title) + 50) % 360)), boxShadow: '0 4px 10px -4px rgba(0,0,0,.6)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: '#8b8798', marginTop: 3 }}>{r.author}</div>
                  <div style={{ fontSize: 11, color: '#6b6878', marginTop: 2 }}>{r.totalCh ? `${r.totalCh} chapitres` : 'Chapitres inconnus'}</div>
                </div>
                <span style={{ color: 'var(--acc)', fontSize: 22, fontWeight: 700, paddingRight: 6 }}>＋</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', color: '#57545f', fontSize: 11, margin: '16px 0', fontWeight: 600 }}>— ou saisie manuelle —</div>

      <div style={{ height: 120, borderRadius: 18, background: formCover, position: 'relative', overflow: 'hidden', marginBottom: 8, display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.6))' }} />
        <div style={{ position: 'relative', padding: '14px 16px', color: '#fff', fontWeight: 800, fontSize: 18 }}>{form.title.trim() || 'Nouveau titre'}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 14 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8b8798', display: 'block', marginBottom: 8 }}>TITRE</label>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, coverImg: null }))} placeholder="Ex. Solo Leveling" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8b8798', display: 'block', marginBottom: 8 }}>AUTEUR</label>
          <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="Ex. Chugong" style={inputStyle} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#8b8798', display: 'block', marginBottom: 8 }}>CHAPITRE ACTUEL</label>
            <input value={form.currentCh} onChange={(e) => setForm((f) => ({ ...f, currentCh: e.target.value.replace(/[^0-9]/g, '') }))} inputMode="numeric" placeholder="0" style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#8b8798', display: 'block', marginBottom: 8 }}>TOTAL</label>
            <input value={form.totalCh} onChange={(e) => setForm((f) => ({ ...f, totalCh: e.target.value.replace(/[^0-9]/g, '') }))} inputMode="numeric" placeholder="—" style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8b8798', display: 'block', marginBottom: 8 }}>LIEN DE LECTURE (URL)</label>
          <input value={form.readUrl} onChange={(e) => setForm((f) => ({ ...f, readUrl: e.target.value }))} placeholder="https://…" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8b8798', display: 'block', marginBottom: 10 }}>STATUT</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {STATUS_ORDER.map((s) => {
              const meta = statusMeta(s, settings.accentKey);
              const active = form.status === s;
              return (
                <div
                  key={s}
                  onClick={() => setForm((f) => ({ ...f, status: s }))}
                  style={{ cursor: 'pointer', padding: '12px 14px', borderRadius: 13, background: active ? meta.bg : '#17151f', border: `1px solid ${active ? meta.color : 'rgba(255,255,255,.06)'}`, display: 'flex', alignItems: 'center', gap: 9 }}
                >
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: meta.color, flex: 'none' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: active ? '#fff' : '#b8b3c6' }}>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        onClick={submit}
        style={{ marginTop: 26, height: 54, borderRadius: 15, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#03251f', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 12px 26px -8px rgba(34,193,166,.5)', opacity: form.title.trim() ? 1 : 0.5 }}
      >
        Ajouter à ma bibliothèque
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: '#17151f', border: '1px solid rgba(255,255,255,.07)', borderRadius: 13,
  padding: 14, color: '#fff', fontSize: 14, outline: 'none',
};
