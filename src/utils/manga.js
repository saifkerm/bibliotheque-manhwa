export const ACCENT_PALETTES = {
  teal: { label: 'Teal', colors: ['#22c1a6', '#12a08a', '#5ee0c8'] },
  rose: { label: 'Rose', colors: ['#ff5c8a', '#d13d69', '#ff9ebc'] },
  violet: { label: 'Violet', colors: ['#7c5cff', '#5a3ee0', '#b3a1ff'] },
  amber: { label: 'Ambre', colors: ['#ff9e40', '#e07a1f', '#ffc588'] },
  blue: { label: 'Bleu', colors: ['#3b82f6', '#2563c4', '#93c0ff'] },
};

export const COVER_STYLES = [
  { key: 'vibrant', label: 'Vibrant' },
  { key: 'pastel', label: 'Pastel' },
  { key: 'duotone', label: 'Duotone' },
  { key: 'noir', label: 'Noir' },
];

const FIXED_STATUS = {
  completed: { label: 'Terminé', color: '#6f8cff', bg: 'rgba(111,140,255,.22)' },
  wishlist: { label: 'À lire', color: '#ffb020', bg: 'rgba(255,176,32,.22)' },
  paused: { label: 'En pause', color: '#ff6b8a', bg: 'rgba(255,107,138,.22)' },
};

export function accentTriad(accentKey) {
  const palette = ACCENT_PALETTES[accentKey] || ACCENT_PALETTES.teal;
  const [a, b, c] = palette.colors;
  return { a, b: b || a, c: c || b || a };
}

export function accentCssVars(accentKey) {
  const { a, b, c } = accentTriad(accentKey);
  return {
    '--acc': a,
    '--acc2': b,
    '--acc3': c,
    '--acc-soft': `color-mix(in srgb, ${a} 35%, transparent)`,
  };
}

export function statusMeta(status, accentKey = 'teal') {
  if (FIXED_STATUS[status]) return FIXED_STATUS[status];
  // 'reading' (et tout statut inconnu) suit la couleur d'accent choisie par l'utilisateur
  const { a } = accentTriad(accentKey);
  return { label: 'En cours', color: a, bg: `color-mix(in srgb, ${a} 24%, transparent)` };
}

export function coverFromHues(h1, h2) {
  return `linear-gradient(145deg, oklch(0.62 0.19 ${h1}) 0%, oklch(0.42 0.17 ${h2}) 100%)`;
}

export function coverOf(manga, { coverStyle = 'vibrant', accentKey = 'teal' } = {}) {
  if (manga.coverImg) return `#1a1824 url("${manga.coverImg}") center/cover no-repeat`;
  const { h1, h2 } = manga;
  if (coverStyle === 'pastel') return `linear-gradient(145deg, oklch(0.83 0.09 ${h1}) 0%, oklch(0.72 0.10 ${h2}) 100%)`;
  if (coverStyle === 'noir') return `linear-gradient(145deg, oklch(0.52 0.02 ${h1}) 0%, oklch(0.24 0.02 ${h2}) 100%)`;
  if (coverStyle === 'duotone') {
    const { a } = accentTriad(accentKey);
    return `linear-gradient(150deg, ${a} 0%, oklch(0.28 0.10 ${h2}) 100%)`;
  }
  return coverFromHues(h1, h2);
}

export function pctOf(manga) {
  if (!manga.totalCh) return '0%';
  return Math.min(100, Math.round((manga.currentCh / manga.totalCh) * 100)) + '%';
}

export function hostOf(url) {
  if (!url) return 'aucun lien défini';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'lien externe';
  }
}

export function hueFromString(str) {
  const base = (str || '').charCodeAt(0) || 100;
  return (base * 7) % 360;
}
