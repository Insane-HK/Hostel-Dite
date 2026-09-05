import { POORNIMA_MENU } from './data/poornima_menu.js';
import { OUTSIDE_SUPPLEMENTS } from './data/supplements.js';
import { CANTEEN_ITEMS } from './data/canteen_items.js';

/* ─────────────────────────────────────────────────────────
 * TIMEZONE HELPER: STRICT ASIA/KOLKATA (IST = UTC + 5:30)
 * Safe window: 06:00 AM to 11:59 PM IST
 * ───────────────────────────────────────────────────────── */
export function getISTDate() {
  const now = new Date();
  const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(istString);
}

export function isWithinSafeSyncWindow() {
  const ist = getISTDate();
  const hours = ist.getHours();
  return hours >= 6 && hours < 24;
}

export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0); // Noon anchor prevents midnight timezone rollover
}

/* ─────────────────────────────────────────────────────────
 * APPLICATION STATE (MacroFactor v4)
 * ───────────────────────────────────────────────────────── */
const STATE_KEY = 'poornima_macrofactor_state_v4';

function getDefaultState() {
  return {
    settings: {
      calorieTarget: 1700,
      proteinTarget: 80,
      userName: 'Hostel Resident'
    },
    dailyLogs: {},
    collapsedCards: {
      breakfast: true,
      snacks: true
    }
  };
}

let appState = loadState();
const istCurrent = getISTDate();
let selectedDate = new Date(istCurrent.getFullYear(), istCurrent.getMonth(), istCurrent.getDate(), 12, 0, 0);
let activeMealCategory = 'lunch';

function loadState() {
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load state', e);
  }
  return getDefaultState();
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Failed to save state', e);
  }
}

function getDayLog(dateKey) {
  if (!appState.dailyLogs[dateKey]) {
    // Initial sample consumed lunch for realism (Screenshot 1: 1465 / 2000 style)
    appState.dailyLogs[dateKey] = {
      consumedMeals: {},
      supplements: [
        {
          id: 'sample_whey',
          name: '1 Scoop Whey Protein (with water)',
          calories: 120,
          protein: 24,
          fat: 1.5,
          carbs: 2,
          unit: '1 scoop (30g)'
        }
      ],
      customFoods: [],
      sleep: { hours: 7.5, quality: 4 }
    };
    saveState();
  }
  return appState.dailyLogs[dateKey];
}

/* ─────────────────────────────────────────────────────────
 * TOTALS & CALCULATIONS
 * ───────────────────────────────────────────────────────── */
function calculateDayTotals(dateKey) {
  const log = getDayLog(dateKey);
  const dateObj = parseDateKey(dateKey);
  const dayOfWeek = dateObj.getDay();
  const menuData = POORNIMA_MENU[dayOfWeek]?.meals || {};

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let messProtein = 0;
  let outsideProtein = 0;

  Object.values(menuData).forEach(category => {
    category.forEach(item => {
      const state = log.consumedMeals[item.id];
      if (state && state.consumed) {
        const qty = state.qty !== undefined ? state.qty : (item.recQty || 1);
        calories += item.calories * qty;
        protein += item.protein * qty;
        carbs += item.carbs * qty;
        fat += item.fat * qty;
        messProtein += item.protein * qty;
      }
    });
  });

  (log.supplements || []).forEach(s => {
    calories += s.calories || 0;
    protein += s.protein || 0;
    carbs += s.carbs || 0;
    fat += s.fat || 0;
    outsideProtein += s.protein || 0;
  });

  (log.customFoods || []).forEach(f => {
    calories += f.calories || 0;
    protein += f.protein || 0;
    carbs += f.carbs || 0;
    fat += f.fat || 0;
    outsideProtein += f.protein || 0;
  });

  const targetCal = appState.settings.calorieTarget;
  const targetPro = appState.settings.proteinTarget;
  const proteinGap = Math.max(0, targetPro - protein);
  const remainingCal = targetCal - calories;

  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    messProtein: Math.round(messProtein * 10) / 10,
    outsideProtein: Math.round(outsideProtein * 10) / 10,
    proteinGap: Math.round(proteinGap * 10) / 10,
    remainingCal: Math.round(remainingCal),
    targetCal,
    targetPro
  };
}

/* ─────────────────────────────────────────────────────────
 * INITIALIZE & RENDER
 * ───────────────────────────────────────────────────────── */
export function initApp() {
  renderHeaderTime();
  renderDayCarousel();
  renderDashboard();
  setupEventListeners();
}

function renderHeaderTime() {
  const ist = getISTDate();
  const hours = ist.getHours();
  let timeStr = '2 PM';
  if (hours >= 6 && hours < 11) timeStr = '8 AM';
  else if (hours >= 11 && hours < 16) timeStr = '1 PM';
  else if (hours >= 16 && hours < 19) timeStr = '5 PM';
  else timeStr = '8 PM';

  const timePill = document.getElementById('mf-time-pill');
  if (timePill) {
    timePill.innerText = timeStr;
  }
}

function renderDayCarousel() {
  const container = document.getElementById('mf-day-carousel');
  if (!container) return;

  const istNow = getISTDate();
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Yesterday
  const yesterday = new Date(istNow);
  yesterday.setDate(istNow.getDate() - 1);
  days.push({
    date: yesterday,
    label: `Yesterday (${dayNames[yesterday.getDay()]})`,
    isYesterday: true
  });

  // Today
  days.push({
    date: new Date(istNow),
    label: `Today (${dayNames[istNow.getDay()]})`,
    isToday: true
  });

  // Next 5 days
  for (let i = 1; i <= 5; i++) {
    const d = new Date(istNow);
    d.setDate(istNow.getDate() + i);
    days.push({
      date: d,
      label: `${dayNames[d.getDay()]} ${d.getDate()}`
    });
  }

  const selectedKey = formatDateKey(selectedDate);

  container.innerHTML = days.map(day => {
    const key = formatDateKey(day.date);
    const isActive = key === selectedKey;
    let cls = 'mf-day-chip';
    if (isActive) cls += ' active';

    return `
      <button class="${cls}" data-date-key="${key}">
        ${day.label}
      </button>
    `;
  }).join('');

  container.querySelectorAll('.mf-day-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-date-key');
      selectedDate = parseDateKey(key);
      renderDayCarousel();
      renderDashboard();
    });
  });
}

function renderDashboard() {
  const dateKey = formatDateKey(selectedDate);
  const dateObj = parseDateKey(dateKey);
  const dayOfWeek = dateObj.getDay();
  const menuData = POORNIMA_MENU[dayOfWeek] || POORNIMA_MENU[6];
  const totals = calculateDayTotals(dateKey);
  const log = getDayLog(dateKey);

  // 1. Top Header Calorie Pill & Circular Progress Arc (Screenshot 1)
  const calTextEl = document.getElementById('mf-header-calorie-text');
  const arcFillEl = document.getElementById('mf-header-arc-fill');
  if (calTextEl) {
    calTextEl.innerText = `${totals.calories} / ${totals.targetCal}`;
  }
  if (arcFillEl) {
    // Circle radius = 15, circumference = 2 * PI * 15 ≈ 94.25
    const circumference = 94.25;
    const pct = Math.min(1, totals.calories / totals.targetCal);
    const offset = circumference * (1 - pct);
    arcFillEl.style.strokeDashoffset = offset;
  }

  // 2. Nutrients Breakdown Modal Stats (Screenshot 5)
  updateNutrientsModal(totals);

  // 3. 6-Compartment Thali Tray Blueprint
  renderThaliBlueprint(menuData);

  // 4. Meal Cards & Ingredients List (Screenshot 1)
  renderMealCards(menuData, log, dateKey);

  // 5. Search Sheet "Latest" items (Screenshot 2)
  renderSearchSheetItems(log, dateKey);
}

function updateNutrientsModal(totals) {
  const calsText = document.getElementById('nutr-cals-text');
  const calsPct = document.getElementById('nutr-cals-pct');
  const calsBar = document.getElementById('nutr-cals-bar');

  const proText = document.getElementById('nutr-pro-text');
  const proPct = document.getElementById('nutr-pro-pct');
  const proBar = document.getElementById('nutr-pro-bar');

  const calPctNum = Math.min(100, Math.round((totals.calories / totals.targetCal) * 100));
  const proPctNum = Math.min(100, Math.round((totals.protein / totals.targetPro) * 100));

  if (calsText) calsText.innerText = `${totals.calories} / ${totals.targetCal} kcal`;
  if (calsPct) calsPct.innerText = `${calPctNum}%`;
  if (calsBar) calsBar.style.width = `${calPctNum}%`;

  if (proText) proText.innerText = `${totals.protein} / ${totals.targetPro} g`;
  if (proPct) proPct.innerText = `${proPctNum}%`;
  if (proBar) proBar.style.width = `${proPctNum}%`;
}

function renderThaliBlueprint(menuData) {
  const container = document.getElementById('mf-thali-tray');
  if (!container) return;

  const mealItems = menuData.meals[activeMealCategory] || menuData.meals.lunch || [];

  const compMap = {
    comp_top_left: null,
    comp_top_mid: null,
    comp_top_right: null,
    comp_center: null,
    comp_side_left: null,
    comp_side_right: null
  };

  mealItems.forEach(item => {
    if (item.comp && compMap.hasOwnProperty(item.comp) && !compMap[item.comp]) {
      compMap[item.comp] = item;
    }
  });

  if (!compMap.comp_side_left) {
    compMap.comp_side_left = { name: "Cucumber Salad", unit: "1 Full Plate", calories: 25 };
  }
  if (!compMap.comp_side_right) {
    compMap.comp_side_right = { name: "Lemon / Chili (Skip Achar)", unit: "0 kcal", calories: 5 };
  }

  function renderSlot(slotKey, title) {
    const item = compMap[slotKey];
    if (!item) {
      return `
        <div class="mf-thali-katori">
          <span class="mf-katori-header">${title}</span>
          <div class="mf-katori-food" style="color:var(--mf-text-muted);">Empty</div>
        </div>
      `;
    }
    return `
      <div class="mf-thali-katori">
        <span class="mf-katori-header">${title}</span>
        <div class="mf-katori-food">${item.name}</div>
        <div class="mf-katori-portion">${item.unit}</div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="mf-thali-row-top">
      ${renderSlot('comp_top_left', 'Dal Bowl')}
      ${renderSlot('comp_top_mid', 'Sabzi Bowl')}
      ${renderSlot('comp_top_right', 'Curd / Rayta')}
    </div>
    <div class="mf-thali-row-bottom">
      ${renderSlot('comp_side_left', 'Salad Slot')}
      ${renderSlot('comp_center', 'Chapatis / Rice Slot')}
      ${renderSlot('comp_side_right', 'Papad / Lemon')}
    </div>
  `;
}

function renderMealCards(menuData, log, dateKey) {
  const container = document.getElementById('mf-meals-stack');
  if (!container) return;

  const mealOrder = [
    { key: 'lunch', title: 'Poornima Mess Lunch: Dal + Sabzi + Roti', icon: '🥗', time: '12:30 PM', defaultServing: { qty: '1', unit: 'bowl' } },
    { key: 'dinner', title: 'Poornima Mess Dinner: Curry + Dal + Dahi', icon: '🍛', time: '07:30 PM', defaultServing: { qty: '1', unit: 'plate' } },
    { key: 'breakfast', title: 'Breakfast: Mess Morning Meal', icon: '🌅', time: '08:00 AM', defaultServing: { qty: '1', unit: 'serving' } },
    { key: 'snacks', title: 'High Tea & Afternoon Snacks', icon: '☕', time: '05:00 PM', defaultServing: { qty: '1', unit: 'cup' } }
  ];

  container.innerHTML = mealOrder.map(meal => {
    const items = menuData.meals[meal.key] || [];
    let mealCals = 0;
    let mealPro = 0;
    let mealCarbs = 0;
    let mealFat = 0;

    let plannedCals = 0;
    let plannedPro = 0;
    let plannedCarbs = 0;
    let plannedFat = 0;
    let hasLoggedItems = false;

    items.forEach(item => {
      const q = item.recQty || 1;
      plannedCals += item.calories * q;
      plannedPro += item.protein * q;
      plannedCarbs += item.carbs * q;
      plannedFat += item.fat * q;

      const state = log.consumedMeals[item.id];
      const qty = state && state.qty !== undefined ? state.qty : q;
      if (state && state.consumed) {
        hasLoggedItems = true;
        mealCals += item.calories * qty;
        mealPro += item.protein * qty;
        mealCarbs += item.carbs * qty;
        mealFat += item.fat * qty;
      }
    });

    const displayCals = hasLoggedItems ? Math.round(mealCals) : Math.round(plannedCals);
    const displayPro = hasLoggedItems ? (Math.round(mealPro * 10) / 10) : (Math.round(plannedPro * 10) / 10);
    const displayFat = hasLoggedItems ? Math.round(mealFat) : Math.round(plannedFat);
    const displayCarbs = hasLoggedItems ? Math.round(mealCarbs) : Math.round(plannedCarbs);
    const statusNote = hasLoggedItems ? 'Logged' : 'Planned';

    const isCollapsed = appState.collapsedCards[meal.key] === true;

    const ingredientsHtml = items.map(item => {
      const state = log.consumedMeals[item.id] || { consumed: false, qty: item.recQty || 1 };
      const isConsumed = state.consumed;
      const currentQty = state.qty !== undefined ? state.qty : (item.recQty || 1);
      const effectiveCal = Math.round(item.calories * currentQty);
      const effectivePro = Math.round(item.protein * currentQty * 10) / 10;
      const effectiveCarbs = Math.round(item.carbs * currentQty);
      const effectiveFat = Math.round(item.fat * currentQty);

      let itemIcon = '🍲';
      let unitLabel = 'serving';
      const nameLower = item.name.toLowerCase();

      if (nameLower.includes('lemon')) { itemIcon = '🍋'; unitLabel = 'tbsp'; }
      else if (nameLower.includes('mustard')) { itemIcon = '🍯'; unitLabel = 'tsp'; }
      else if (nameLower.includes('salt')) { itemIcon = '🧂'; unitLabel = 'tsp'; }
      else if (nameLower.includes('pepper')) { itemIcon = '🧂'; unitLabel = 'tsp'; }
      else if (nameLower.includes('chana dal') || nameLower.includes('chickpea')) { itemIcon = '🫘'; unitLabel = 'katori'; }
      else if (nameLower.includes('dal')) { itemIcon = '🥣'; unitLabel = 'katori'; }
      else if (nameLower.includes('bhindi') || nameLower.includes('torai') || nameLower.includes('sabzi')) { itemIcon = '🥬'; unitLabel = 'katori'; }
      else if (nameLower.includes('roti') || nameLower.includes('chapati')) { itemIcon = '🫓'; unitLabel = 'roti'; }
      else if (nameLower.includes('rayta') || nameLower.includes('curd') || nameLower.includes('dahi') || nameLower.includes('yogurt')) { itemIcon = '🥛'; unitLabel = 'katori'; }
      else if (nameLower.includes('salad') || nameLower.includes('kheera') || nameLower.includes('cucumber')) { itemIcon = '🥒'; unitLabel = 'cup'; }
      else if (nameLower.includes('tomato')) { itemIcon = '🍅'; unitLabel = 'cup'; }
      else if (nameLower.includes('tea') || nameLower.includes('chai')) { itemIcon = '☕'; unitLabel = 'cup'; }
      else if (nameLower.includes('poha')) { itemIcon = '🍚'; unitLabel = 'bowl'; }
      else if (nameLower.includes('soya')) { itemIcon = '🌱'; unitLabel = 'katori'; }

      return `
        <div class="mf-ingredient-row">
          <div class="mf-ingredient-icon">${itemIcon}</div>
          <div class="mf-ingredient-meta">
            <div class="mf-ingredient-name">
              <span>${item.name}</span>
              <span class="mf-tag-badge ${item.tag}">${item.tag}</span>
            </div>
            <div class="mf-ingredient-macros">
              ${effectiveCal}🔥  ${effectivePro}P  ${effectiveFat}F  ${effectiveCarbs}C  •  ${item.unit}
            </div>
          </div>

          <div class="mf-ing-actions">
            <!-- 2-Line Serving Pill (Screenshot 1) -->
            <div class="mf-serving-pill" data-action="edit-qty" data-dish-id="${item.id}" title="Click to adjust portion">
              <span class="mf-qty">${currentQty}</span>
              <span class="mf-unit">${unitLabel}</span>
            </div>

            <!-- Check Button (Turns green when checked) -->
            <button class="mf-check-btn ${isConsumed ? 'checked' : ''}" data-action="toggle-check" data-dish-id="${item.id}" title="Toggle Logged State">
              ${isConsumed ? '✓' : '+'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="mf-meal-card ${isCollapsed ? 'collapsed' : ''}" data-meal-key="${meal.key}">
        <div class="mf-meal-card-header">
          <div class="mf-dish-icon-box">${meal.icon}</div>
          <div class="mf-dish-info">
            <div class="mf-dish-title">${meal.title}</div>
            <div class="mf-dish-macros-line">
              <strong>${displayCals}🔥</strong>  ${displayPro}P  ${displayFat}F  ${displayCarbs}C  •  ${meal.time} <span style="font-size:10.5px; opacity:0.85;">(${statusNote})</span>
            </div>
          </div>
          <div class="mf-serving-pill" data-action="open-thali-for-meal" data-meal-key="${meal.key}" title="View Thali Blueprint">
            <span class="mf-qty">${meal.defaultServing.qty}</span>
            <span class="mf-unit">${meal.defaultServing.unit}</span>
          </div>
        </div>

        <div class="mf-collapse-toggle ${isCollapsed ? 'collapsed' : ''}" data-action="toggle-collapse" data-meal-key="${meal.key}">
          <span>${isCollapsed ? 'Expand Ingredients' : 'Collapse Ingredients'}</span>
          <svg class="mf-chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </div>

        <div class="mf-ingredients-list">
          ${ingredientsHtml}
        </div>
      </div>
    `;
  }).join('');

  // Attach handlers
  container.querySelectorAll('[data-action="toggle-collapse"]').forEach(toggleRow => {
    toggleRow.addEventListener('click', () => {
      const key = toggleRow.getAttribute('data-meal-key');
      appState.collapsedCards[key] = !appState.collapsedCards[key];
      saveState();
      renderDashboard();
    });
  });

  container.querySelectorAll('[data-action="open-thali-for-meal"]').forEach(pill => {
    pill.addEventListener('click', () => {
      activeMealCategory = pill.getAttribute('data-meal-key');
      renderThaliBlueprint(menuData);
      const thaliModal = document.getElementById('mf-thali-modal');
      if (thaliModal) thaliModal.classList.add('open');
    });
  });

  container.querySelectorAll('[data-action="toggle-check"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-dish-id');
      const cur = log.consumedMeals[id] || { consumed: false, qty: 1 };
      cur.consumed = !cur.consumed;
      log.consumedMeals[id] = cur;
      saveState();
      renderDashboard();
      showToast(cur.consumed ? 'Logged to daily deficit!' : 'Dish unchecked');
    });
  });

  container.querySelectorAll('[data-action="edit-qty"]').forEach(box => {
    box.addEventListener('click', () => {
      const id = box.getAttribute('data-dish-id');
      const cur = log.consumedMeals[id] || { consumed: true, qty: 1 };
      const portionSteps = [0.5, 1, 1.5, 2, 2.5, 3];
      const curIndex = portionSteps.indexOf(cur.qty);
      const nextQty = curIndex >= 0 && curIndex < portionSteps.length - 1 ? portionSteps[curIndex + 1] : portionSteps[0];
      cur.qty = nextQty;
      cur.consumed = true;
      log.consumedMeals[id] = cur;
      saveState();
      renderDashboard();
      showToast(`Portion adjusted to ${nextQty}x`);
    });
  });
}

/* ─────────────────────────────────────────────────────────
 * SEARCH DRAWER LATEST ITEMS (Screenshot 2)
 * ───────────────────────────────────────────────────────── */
function renderSearchSheetItems(log, dateKey) {
  const container = document.getElementById('mf-sheet-latest-list');
  if (!container) return;

  const latestItems = [
    { name: "Egg Fried", calories: 90, protein: 6.0, fat: 7.0, carbs: 0.0, unit: "1 egg (46 g)", icon: "🍳" },
    { name: "Greek Yogurt", calories: 49, protein: 5.0, fat: 3.0, carbs: 2.0, unit: "50 ml (50.72 g)", icon: "🥣" },
    { name: "1 Scoop Whey Protein (with water)", calories: 120, protein: 24.0, fat: 1.5, carbs: 2.0, unit: "1 scoop (30g)", icon: "💊" },
    { name: "3 Boiled Eggs (Campus Tapri)", calories: 215, protein: 18.0, fat: 15.0, carbs: 1.5, unit: "3 eggs", icon: "🥚" },
    { name: "Amul High Protein Lassi / Buttermilk", calories: 110, protein: 15.0, fat: 1.5, carbs: 8.0, unit: "200 ml", icon: "🥛" },
    { name: "Chana Sattu Drink with Lemon", calories: 165, protein: 10.5, fat: 2.2, carbs: 26.0, unit: "1 glass", icon: "🥤" },
    { name: "Roasted Chana / Bhuna Chana", calories: 185, protein: 9.5, fat: 3.0, carbs: 28.0, unit: "50 g", icon: "🥜" },
    { name: "Canteen Maggi", calories: 310, protein: 6.0, fat: 12.0, carbs: 46.0, unit: "1 plate", icon: "🍜" },
    { name: "Canteen Bread Omelette", calories: 340, protein: 16.0, fat: 18.0, carbs: 28.0, unit: "2 slices", icon: "🥪" },
    { name: "Banana, Fresh", calories: 105, protein: 1.3, fat: 0.3, carbs: 27.0, unit: "1 medium", icon: "🍌" }
  ];

  container.innerHTML = latestItems.map(item => `
    <div class="mf-latest-food-row">
      <div class="mf-latest-left">
        <div class="mf-food-emoji-box">${item.icon}</div>
        <div>
          <div class="mf-latest-name">${item.name}</div>
          <div class="mf-latest-macros">
            ${item.calories}🔥  ${item.protein}P  ${item.fat}F  ${item.carbs}C  •  ${item.unit}
          </div>
        </div>
      </div>
      <button class="mf-plus-circle-btn" data-add-quick="${item.name}" title="Add to Today">+</button>
    </div>
  `).join('');

  container.querySelectorAll('[data-add-quick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-add-quick');
      const item = latestItems.find(x => x.name === name);
      if (item) {
        log.supplements = log.supplements || [];
        log.supplements.push({
          id: 'item_' + Date.now(),
          name: item.name,
          calories: item.calories,
          protein: item.protein,
          fat: item.fat,
          carbs: item.carbs,
          unit: item.unit
        });
        saveState();
        renderDashboard();
        showToast(`Logged ${item.name} (+${item.protein}g Protein)!`);
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────
 * EVENT LISTENERS & MODAL INTERACTIVITY
 * ───────────────────────────────────────────────────────── */
function setupEventListeners() {
  const searchBackdrop = document.getElementById('mf-search-backdrop');
  const btnFloatingLog = document.getElementById('mf-floating-log-btn');
  const btnNavSearch = document.getElementById('nav-btn-search');
  const btnNavQuickAdd = document.getElementById('nav-btn-quickadd');
  const btnCloseSearch = document.getElementById('btn-close-search');
  const btnDoneSearch = document.getElementById('btn-done-search');

  // Open Search Drawer (Screenshot 2)
  const openSearch = () => {
    if (searchBackdrop) searchBackdrop.classList.add('open');
  };
  const closeSearch = () => {
    if (searchBackdrop) searchBackdrop.classList.remove('open');
  };

  if (btnFloatingLog) btnFloatingLog.addEventListener('click', openSearch);
  if (btnNavSearch) btnNavSearch.addEventListener('click', openSearch);
  if (btnNavQuickAdd) btnNavQuickAdd.addEventListener('click', openSearch);
  if (btnCloseSearch) btnCloseSearch.addEventListener('click', closeSearch);
  if (btnDoneSearch) btnDoneSearch.addEventListener('click', closeSearch);

  if (searchBackdrop) {
    searchBackdrop.addEventListener('click', (e) => {
      if (e.target === searchBackdrop) closeSearch();
    });
  }

  // Search input typing & enter
  const searchInput = document.getElementById('mf-search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = searchInput.value.trim();
        if (val) {
          const dateKey = formatDateKey(selectedDate);
          const log = getDayLog(dateKey);
          log.customFoods = log.customFoods || [];
          log.customFoods.push({
            id: 'c_' + Date.now(),
            name: val,
            calories: 220,
            protein: 8,
            fat: 6,
            carbs: 26
          });
          saveState();
          searchInput.value = '';
          closeSearch();
          renderDashboard();
          showToast(`Logged ${val}!`);
        }
      }
    });
  }

  // 6-Compartment Thali Modal
  const thaliModal = document.getElementById('mf-thali-modal');
  const btnOpenThali = document.getElementById('btn-open-thali');
  const btnCloseThali = document.getElementById('btn-close-thali');

  if (btnOpenThali && thaliModal) {
    btnOpenThali.addEventListener('click', () => thaliModal.classList.add('open'));
  }
  if (btnCloseThali && thaliModal) {
    btnCloseThali.addEventListener('click', () => thaliModal.classList.remove('open'));
  }
  if (thaliModal) {
    thaliModal.addEventListener('click', (e) => {
      if (e.target === thaliModal) thaliModal.classList.remove('open');
    });
  }

  // Top Calorie Pill -> Opens Nutrients Breakdown (Screenshot 5)
  const calPill = document.getElementById('mf-calorie-pill');
  const nutrientsModal = document.getElementById('mf-nutrients-modal');
  const btnBackNutrients = document.getElementById('btn-back-nutrients');
  const btnNutrientsDone = document.getElementById('btn-nutrients-done');

  if (calPill && nutrientsModal) {
    calPill.addEventListener('click', () => nutrientsModal.classList.add('open'));
  }
  if (btnBackNutrients && nutrientsModal) {
    btnBackNutrients.addEventListener('click', () => nutrientsModal.classList.remove('open'));
  }
  if (btnNutrientsDone && nutrientsModal) {
    btnNutrientsDone.addEventListener('click', () => nutrientsModal.classList.remove('open'));
  }

  // Recipe Builder Modal (Screenshots 4 & 3)
  const recipeModal = document.getElementById('mf-recipe-modal');
  const navBtnAi = document.getElementById('nav-btn-ai');
  const navBtnLibrary = document.getElementById('nav-btn-library');
  const btnBackRecipe1 = document.getElementById('btn-back-recipe-1');
  const btnBackRecipe2 = document.getElementById('btn-back-recipe-2');
  const btnRecipeNext1 = document.getElementById('btn-recipe-next-1');
  const stepView1 = document.getElementById('recipe-step-1');
  const stepView2 = document.getElementById('recipe-step-2');
  const btnCreateOnly = document.getElementById('btn-recipe-create-only');
  const btnCreateAndAdd = document.getElementById('btn-recipe-create-and-add');

  const openRecipeBuilder = () => {
    if (recipeModal) {
      recipeModal.classList.add('open');
      if (stepView1) stepView1.classList.add('active');
      if (stepView2) stepView2.classList.remove('active');
    }
  };

  if (navBtnAi) navBtnAi.addEventListener('click', openRecipeBuilder);
  if (navBtnLibrary) navBtnLibrary.addEventListener('click', openRecipeBuilder);

  if (btnBackRecipe1 && recipeModal) {
    btnBackRecipe1.addEventListener('click', () => recipeModal.classList.remove('open'));
  }

  if (btnRecipeNext1 && stepView1 && stepView2) {
    btnRecipeNext1.addEventListener('click', () => {
      stepView1.classList.remove('active');
      stepView2.classList.add('active');
      const name = document.getElementById('recipe-input-name')?.value || 'New Recipe';
      const previewTitle = document.getElementById('preview-recipe-title');
      if (previewTitle) previewTitle.innerText = name;
    });
  }

  if (btnBackRecipe2 && stepView1 && stepView2) {
    btnBackRecipe2.addEventListener('click', () => {
      stepView2.classList.remove('active');
      stepView1.classList.add('active');
    });
  }

  const handleRecipeDone = (addFood) => {
    if (recipeModal) recipeModal.classList.remove('open');
    if (addFood) {
      const dateKey = formatDateKey(selectedDate);
      const log = getDayLog(dateKey);
      const name = document.getElementById('recipe-input-name')?.value || 'Custom Recipe';
      log.customFoods = log.customFoods || [];
      log.customFoods.push({
        id: 'rec_' + Date.now(),
        name: name,
        calories: 320,
        protein: 15,
        fat: 10,
        carbs: 35
      });
      saveState();
      renderDashboard();
      showToast(`Created & Logged ${name}!`);
    } else {
      showToast(`Recipe saved to Library!`);
    }
  };

  if (btnCreateOnly) btnCreateOnly.addEventListener('click', () => handleRecipeDone(false));
  if (btnCreateAndAdd) btnCreateAndAdd.addEventListener('click', () => handleRecipeDone(true));

  // Description character counter (Screenshot 3)
  const descInput = document.getElementById('recipe-desc');
  const descCounter = document.getElementById('recipe-desc-count');
  if (descInput && descCounter) {
    descInput.addEventListener('input', () => {
      descCounter.innerText = `${descInput.value.length}/1500`;
    });
  }

  // Up Chevron: Scroll to top (Screenshot 1)
  const btnUp = document.getElementById('btn-header-up');
  if (btnUp) {
    btnUp.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Time Pill: Show IST status
  const timePill = document.getElementById('mf-time-pill');
  if (timePill) {
    timePill.addEventListener('click', () => {
      const ist = getISTDate();
      const timeStr = ist.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isSafe = isWithinSafeSyncWindow();
      showToast(`IST: ${timeStr} • ${isSafe ? 'Sync Window 06:00–23:59 Active' : 'Overnight Anchor Active'}`);
    });
  }

  // Header Close: Reset day log demo
  const btnClose = document.getElementById('btn-header-close');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      showToast('Poornima Mess Deficit Tracker Active (1600–1800 kcal)');
    });
  }

  // Scan tab toast
  const navBtnScan = document.getElementById('nav-btn-scan');
  if (navBtnScan) {
    navBtnScan.addEventListener('click', () => {
      showToast('Scan Barcode: Point at hostel snack packaging');
    });
  }
}

function showToast(msg) {
  let t = document.getElementById('mf-app-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'mf-app-toast';
    t.className = 'mf-toast';
    document.body.appendChild(t);
  }
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
