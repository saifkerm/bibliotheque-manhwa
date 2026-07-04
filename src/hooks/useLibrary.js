import { useEffect, useState } from 'react';

const STORAGE_KEY = 'bibli-manhwa-library';

const DEFAULT_ITEMS = [
  ];

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // localStorage corrompu ou indisponible → on repart du catalogue de démo
  }
  return DEFAULT_ITEMS;
}

export function useLibrary() {
  const [items, setItems] = useState(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function updateItem(id, fn) {
    setItems((prev) => prev.map((it) => (it.id === id ? fn({ ...it }) : it)));
  }

  function plusOne(id) {
    updateItem(id, (m) => {
      const nextCh = m.currentCh + 1;
      if (m.totalCh && nextCh > m.totalCh) {
        // le total connu vient d'être dépassé (nouveaux chapitres parus) : on le resynchronise
        m.totalCh = nextCh;
        m.status = 'reading';
      } else if (m.totalCh && nextCh >= m.totalCh) {
        m.status = 'completed';
      } else if (m.status === 'wishlist') {
        m.status = 'reading';
      }
      m.currentCh = nextCh;
      m.lastRead = "à l'instant";
      return m;
    });
  }

  function minusOne(id) {
    updateItem(id, (m) => {
      m.currentCh = Math.max(0, m.currentCh - 1);
      return m;
    });
  }

  function toggleFav(id) {
    updateItem(id, (m) => {
      m.fav = !m.fav;
      return m;
    });
  }

  function setStatus(id, status) {
    updateItem(id, (m) => {
      m.status = status;
      return m;
    });
  }

  function editItem(id, form) {
    updateItem(id, (m) => {
      m.title = form.title.trim();
      m.author = form.author.trim() || 'Auteur inconnu';
      m.currentCh = parseInt(form.currentCh, 10) || 0;
      m.totalCh = parseInt(form.totalCh, 10) || 0;
      m.status = form.status;
      m.readUrl = (form.readUrl || '').trim();
      return m;
    });
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function addItem(form) {
    const th = form.h1 ?? 0;
    const id = Math.max(0, ...items.map((i) => i.id)) + 1;
    const item = {
      id,
      title: form.title.trim(),
      author: form.author.trim() || 'Auteur inconnu',
      currentCh: parseInt(form.currentCh, 10) || 0,
      totalCh: parseInt(form.totalCh, 10) || 0,
      status: form.status,
      fav: false,
      lastRead: parseInt(form.currentCh, 10) > 0 ? "à l'instant" : '—',
      h1: th,
      h2: (th + 50) % 360,
      genres: ['Manhwa'],
      readUrl: (form.readUrl || '').trim(),
      coverImg: form.coverImg || null,
    };
    setItems((prev) => [item, ...prev]);
    return item;
  }

  return { items, plusOne, minusOne, toggleFav, setStatus, addItem, editItem, deleteItem };
}
