import { useState } from 'react';
import { coverOf, hueFromString, statusMeta } from '../utils/manga.js';

const STATUS_ORDER = ['reading', 'wishlist', 'paused', 'completed'];

export default function EditScreen({ manga, settings, onBack, onSave, onDelete }) {
  const [form, setForm] = useState({
    title: manga.title,
    author: manga.author,
    currentCh: String(manga.currentCh || 0),
    totalCh: manga.totalCh ? String(manga.totalCh) : '',
    status: manga.status,
    readUrl: manga.readUrl || '',
  });

  function save() {
    if (!form.title.trim()) return;
    onSave(manga.id, form);
  }

  const cover = manga.coverImg
    ? coverOf(manga, settings)
    : coverOf({ h1: hueFromString(form.title), h2: (hueFromString(form.title) + 50) % 360 }, settings);

  return (
    <div style={{ animation: 'slideUp .32s ease both', padding: '8px 22px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <div onClick={onBack} style={{ width: 38, height: 38, borderRadius: '50%', background: '#17151f', border: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, cursor: 'pointer' }}>‹</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>Modifier la fiche</div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ height: 120, borderRadius: 18, background: cover, position: 'relative', overflow: 'hidden', marginBottom: 20, display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.6))' }} />
        <div style={{ position: 'relative', padding: '14px 16px', color: '#fff', fontWeight: 800, fontSize: 18 }}>{form.title.trim() || 'Sans titre'}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8b8798', display: 'block', marginBottom: 8 }}>TITRE</label>
          <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Titre" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#8b8798', display: 'block', marginBottom: 8 }}>AUTEUR</label>
          <input value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} placeholder="Auteur" style={inputStyle} />
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
        onClick={save}
        style={{ marginTop: 26, height: 54, borderRadius: 15, background: 'linear-gradient(135deg,var(--acc),var(--acc2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#03251f', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 12px 26px -8px rgba(34,193,166,.5)', opacity: form.title.trim() ? 1 : 0.5 }}
      >
        Enregistrer les modifications
      </div>

      <div
        onClick={() => onDelete(manga.id)}
        style={{ marginTop: 12, height: 50, borderRadius: 15, background: 'transparent', border: '1px solid rgba(255,107,138,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#ff6b8a', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
      >
        <span>🗑️</span> Supprimer de ma bibliothèque
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: '#17151f', border: '1px solid rgba(255,255,255,.07)', borderRadius: 13,
  padding: 14, color: '#fff', fontSize: 14, outline: 'none',
};
