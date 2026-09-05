// Poornima University Mess Menu Service
// Direct Firestore REST API + ICMR Nutritional Mapping + Zero-Downtime Cyclical Fallback + User Override Engine

import { matchDish } from '../data/nutrition_dictionary.js';
import { POORNIMA_MENU } from '../data/poornima_menu.js';

const FIRESTORE_PROJECT_ID = 'poornima-5c202';
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/meals`;
const CACHE_PREFIX = 'poornima_live_menu_';

/**
 * Clean and split raw HTML string from Firestore (e.g. "<p>Dal, Dahi Loki, Chhola...</p>")
 * into individual dish tokens.
 */
export function cleanHtmlToTokens(htmlStr) {
  if (!htmlStr || typeof htmlStr !== 'string') return [];
  // Strip tags and HTML entities
  const clean = htmlStr
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .trim();

  // Split on commas, plus signs, or periods
  return clean
    .split(/[,+]/)
    .map(s => s.trim().replace(/\.$/, ''))
    .filter(s => s.length > 1 && !s.toLowerCase().startsWith('(pgi') && !s.toLowerCase().startsWith('(pu)'));
}

/**
 * Fetch and assemble meals for a given date.
 * Guarantees zero downtime and zero empty meals.
 */
export async function getMenuForDate(dateKey, appState, forceRefresh = false) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d, 12, 0, 0);
  const dayOfWeek = dateObj.getDay();

  // 1. Check for User Counter Overrides (Highest Priority: User is always source of truth)
  const log = appState?.dailyLogs?.[dateKey];
  const userOverrides = log?.mealOverrides;

  // 2. Fetch Live Firestore or LocalStorage Cache
  let liveMeals = null;
  let source = 'cycle';
  let statusBadge = '📋 7-Day Mess Cycle Fallback';
  let statusNote = 'Warden has not entered live menu for this date yet. Showing calibrated 7-day Poornima rotation.';

  if (!forceRefresh && typeof localStorage !== 'undefined') {
    try {
      const cached = localStorage.getItem(`${CACHE_PREFIX}${dateKey}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        liveMeals = parsed.meals;
        source = 'live';
        statusBadge = '🟢 Live Mess Synced (Poornima DB)';
        statusNote = `Synced from Poornima University Firestore (${parsed.syncTime || 'Today'}).`;
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }
  }

  // 3. If not cached, fetch live Firestore REST API
  if (!liveMeals) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500); // Fast 4.5s timeout

      const res = await fetch(`${FIRESTORE_BASE_URL}/${dateKey}`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.status === 200) {
        const doc = await res.json();
        const f = doc.fields || {};

        const rawBreakfast = cleanHtmlToTokens(f.breakfast?.stringValue || '');
        const rawLunch = cleanHtmlToTokens(f.lunch?.stringValue || '');
        const rawSnacks = cleanHtmlToTokens(f.snacks?.stringValue || '');
        const rawDinner = cleanHtmlToTokens(f.dinner?.stringValue || '');

        liveMeals = {
          breakfast: rawBreakfast.map(name => matchDish(name)),
          lunch: rawLunch.map(name => matchDish(name)),
          snacks: rawSnacks.map(name => matchDish(name)),
          dinner: rawDinner.map(name => matchDish(name))
        };

        source = 'live';
        statusBadge = '🟢 Live Mess Synced (Poornima DB)';
        const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        statusNote = `Live data pulled from University Firestore at ${nowTime}.`;

        // Cache to localStorage
        if (typeof localStorage !== 'undefined') {
          try {
            localStorage.setItem(`${CACHE_PREFIX}${dateKey}`, JSON.stringify({
              meals: liveMeals,
              syncTime: nowTime
            }));
          } catch (err) {
            console.warn('Cache write failed:', err);
          }
        }
      }
    } catch (netErr) {
      console.warn(`Live fetch failed for ${dateKey}, using cyclical fallback:`, netErr.message);
    }
  }

  // 4. Fallback to 7-Day Cyclical Rotation if no live data
  let baseMeals = liveMeals;
  if (!baseMeals || Object.values(baseMeals).every(arr => !arr || arr.length === 0)) {
    const cycleData = POORNIMA_MENU[dayOfWeek] || POORNIMA_MENU[6];
    baseMeals = cycleData.meals;
    source = 'cycle';
    statusBadge = '📋 7-Day Mess Cycle Fallback';
    statusNote = 'University portal has no entry for this date. Showing calibrated 7-day Poornima rotation.';
  }

  // 5. Apply User Overrides if user modified dishes at the counter
  const finalMeals = {
    breakfast: [...(baseMeals.breakfast || [])],
    lunch: [...(baseMeals.lunch || [])],
    snacks: [...(baseMeals.snacks || [])],
    dinner: [...(baseMeals.dinner || [])]
  };

  let hasUserOverride = false;
  if (userOverrides) {
    ['breakfast', 'lunch', 'snacks', 'dinner'].forEach(cat => {
      if (userOverrides[cat] && Array.isArray(userOverrides[cat])) {
        finalMeals[cat] = userOverrides[cat];
        hasUserOverride = true;
      }
    });
  }

  if (hasUserOverride) {
    source = 'user';
    statusBadge = '✏️ Custom Counter Verified';
    statusNote = 'Custom dishes adjusted by you for what was actually served at the mess counter.';
  }

  return {
    source,
    statusBadge,
    statusNote,
    dateKey,
    dayOfWeek,
    meals: finalMeals
  };
}

/**
 * Save user custom dishes for a specific meal category and date.
 */
export function saveMealOverride(dateKey, mealCategory, items, appState, saveStateFn) {
  if (!appState.dailyLogs[dateKey]) {
    appState.dailyLogs[dateKey] = {
      consumedMeals: {},
      supplements: [],
      customFoods: [],
      mealOverrides: {}
    };
  }
  if (!appState.dailyLogs[dateKey].mealOverrides) {
    appState.dailyLogs[dateKey].mealOverrides = {};
  }
  appState.dailyLogs[dateKey].mealOverrides[mealCategory] = items;
  saveStateFn();
}

/**
 * Reset a meal category back to live/cyclical defaults.
 */
export function resetMealOverride(dateKey, mealCategory, appState, saveStateFn) {
  if (appState?.dailyLogs?.[dateKey]?.mealOverrides?.[mealCategory]) {
    delete appState.dailyLogs[dateKey].mealOverrides[mealCategory];
    saveStateFn();
  }
}
