import { coverFromHues, hueFromString } from '../utils/manga.js';

// Proxy Cloudflare Worker (cf. cloudflare-worker/) : MangaDex n'autorise pas les
// requêtes CORS depuis un domaine déployé (seulement localhost et mangadex.org),
// donc on passe par un proxy qui ajoute les headers CORS nécessaires.
const MANGADEX_BASE = 'https://mangadex-proxy.skermoun.workers.dev';

function buildSearchUrl(query) {
  const params = new URLSearchParams();
  params.set('limit', '6');
  params.set('title', query);
  params.append('includes[]', 'cover_art');
  params.append('includes[]', 'author');
  params.append('contentRating[]', 'safe');
  params.append('contentRating[]', 'suggestive');
  params.set('order[relevance]', 'desc');
  return `${MANGADEX_BASE}/manga?${params.toString()}`;
}

function bestTitle(attributes) {
  const title = attributes.title || {};
  if (title.fr) return title.fr;
  if (title.en) return title.en;
  // Le titre principal est souvent romanisé (ex. "ko-ro") sans version en/fr ;
  // le titre le plus lisible se trouve alors dans altTitles.
  const altMatch = (attributes.altTitles || []).find((t) => t.fr || t.en);
  if (altMatch) return altMatch.fr || altMatch.en;
  return Object.values(title)[0] || 'Sans titre';
}

function mapMangaDexResult(entry) {
  const attributes = entry.attributes || {};
  const title = bestTitle(attributes);
  const relationships = entry.relationships || [];
  const coverRel = relationships.find((r) => r.type === 'cover_art');
  const authorRel = relationships.find((r) => r.type === 'author');
  const coverImg = coverRel?.attributes?.fileName
    ? `https://uploads.mangadex.org/covers/${entry.id}/${coverRel.attributes.fileName}.256.jpg`
    : null;

  return {
    title,
    author: authorRel?.attributes?.name || 'Auteur inconnu',
    totalCh: parseInt(attributes.lastChapter, 10) || 0,
    coverImg,
    url: `https://mangadex.org/title/${entry.id}`,
  };
}

function mockCatalog(query) {
  const base = hueFromString(query);
  return [0, 1, 2].map((i) => {
    const h1 = (base + i * 40) % 360;
    const h2 = (base + i * 40 + 50) % 360;
    return {
      title: query.replace(/\b\w/g, (c) => c.toUpperCase()) + (i ? ' ' + ['Origins', 'Side Story', 'Remake'][i - 1] : ''),
      author: 'Résultat hors-ligne',
      totalCh: 50 + i * 40,
      coverImg: null,
      cover: coverFromHues(h1, h2),
      url: 'https://mangadex.org/search?q=' + encodeURIComponent(query),
    };
  });
}

export async function searchManga(query) {
  const trimmed = query.trim();
  if (!trimmed) return { results: [], error: '' };

  try {
    const res = await fetch(buildSearchUrl(trimmed));
    if (!res.ok) throw new Error(`MangaDex a répondu ${res.status}`);
    const json = await res.json();
    const results = (json.data || []).map(mapMangaDexResult);

    if (!results.length) {
      return { results: [], error: `Aucun résultat pour « ${trimmed} »` };
    }
    return { results, error: '' };
  } catch {
    // API MangaDex injoignable (réseau, CORS, hors-ligne) → catalogue de secours local
    return { results: mockCatalog(trimmed), error: '' };
  }
}
