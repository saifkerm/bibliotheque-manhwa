import { useEffect, useState } from 'react';
import { accentCssVars } from '../utils/manga.js';

const STORAGE_KEY = 'bibli-manhwa-settings';

const DEFAULT_SETTINGS = { accentKey: 'teal', coverStyle: 'vibrant', density: 'comfy' };

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // localStorage corrompu ou indisponible → réglages par défaut
  }
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const [settings, setSettings] = useState(loadInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    const vars = accentCssVars(settings.accentKey);
    for (const [key, value] of Object.entries(vars)) {
      document.documentElement.style.setProperty(key, value);
    }
  }, [settings]);

  function setAccentKey(accentKey) {
    setSettings((s) => ({ ...s, accentKey }));
  }

  function setCoverStyle(coverStyle) {
    setSettings((s) => ({ ...s, coverStyle }));
  }

  function setDensity(density) {
    setSettings((s) => ({ ...s, density }));
  }

  return { settings, setAccentKey, setCoverStyle, setDensity };
}
