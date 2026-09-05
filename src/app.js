import { POORNIMA_MENU } from './data/poornima_menu.js';
import { OUTSIDE_SUPPLEMENTS } from './data/supplements.js';
import { CANTEEN_ITEMS } from './data/canteen_items.js';
import { getMenuForDate, saveMealOverride, resetMealOverride } from './services/menu_service.js';
import { matchDish } from './data/nutrition_dictionary.js';

/* ─────────────────────────────────────────────────────────
 * TIMEZONE HELPER: STRICT ASIA/KOLKATA (IST = UTC + 5:30)
 * Protects against Poornima University's GMT rollover glitch.
 * Safe sync window: 06:00 AM to 11:59 PM IST.
 * ───────────────────────────────────────────────────────── */
export function getISTDate() {
  const now = new Date();
  const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(istString);
}

export function isWithinSafeSyncWindow() {
  const ist = getISTDate();
  const hours = ist.getHours();
  // Safe between 6:00 AM (06:00) and 11:59 PM (23:59)
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

// Catmull-Rom Resampling from User's Snippet
function smooth(values, perSegment = 8) {
  if (values.length < 3) return values.slice();
  const out = [];
  const n = values.length;
  for (let i = 0; i < n - 1; i += 1) {
    const p0 = values[Math.max(0, i - 1)];
    const p1 = values[i];
    const p2 = values[i + 1];
    const p3 = values[Math.min(n - 1, i + 2)];
    for (let s = 0; s < perSegment; s += 1) {
      const t = s / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push(
        0.5 *
          (2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
      );
    }
  }
  out.push(values[n - 1]);
  return out;
}

/* ─────────────────────────────────────────────────────────
 * STATE MANAGEMENT
 * ───────────────────────────────────────────────────────── */
const STATE_KEY = 'poornima_web_dashboard_state_v5';

function getDefaultState() {
  return {
    settings: {
      calorieTarget: 1700,
      proteinTarget: 80,
      userName: 'Hostel Resident',
      activeAllocation: 'protein'
    },
    dailyLogs: {},
    sidebarCollapsed: false,
    expandedMeals: { lunch: true, dinner: true, breakfast: false, snacks: false }
  };
}

let appState = loadState();
const istCurrent = getISTDate();
let selectedDate = new Date(istCurrent.getFullYear(), istCurrent.getMonth(), istCurrent.getDate(), 12, 0, 0);
let activePlateMeal = 'lunch';
let currentMenuResult = null;

// Modal edit state
let editingMealCategory = 'lunch';
let editingMealItems = [];

function loadState() {
  try {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading state', e);
  }
  return getDefaultState();
}

function saveState() {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Error saving state', e);
  }
}

function getDayLog(dateKey) {
  if (!appState.dailyLogs[dateKey]) {
    appState.dailyLogs[dateKey] = {
      consumedMeals: {},
      supplements: [
        {
          id: 'whey_starter',
          name: '1 Scoop Whey Protein (with water)',
          calories: 120,
          protein: 24,
          fat: 1.5,
          carbs: 2,
          unit: '1 scoop (30g)',
          time: 'Morning'
        }
      ],
      customFoods: [],
      mealOverrides: {},
      sleep: { hours: 7.5 },
      morningWeight: ''
    };
    saveState();
  }
  return appState.dailyLogs[dateKey];
}

/* ─────────────────────────────────────────────────────────
 * CALCULATIONS
 * ───────────────────────────────────────────────────────── */
function calculateDayTotals(dateKey, mealsData) {
  const log = getDayLog(dateKey);
  const dateObj = parseDateKey(dateKey);
  const dayOfWeek = dateObj.getDay();
  const menuData = mealsData || currentMenuResult?.meals || POORNIMA_MENU[dayOfWeek]?.meals || {};

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let messProtein = 0;
  let outsideProtein = 0;

  Object.values(menuData).forEach(category => {
    if (Array.isArray(category)) {
      category.forEach(item => {
        const state = log.consumedMeals[item.id];
        if (state && state.consumed) {
          const qty = state.qty !== undefined ? state.qty : (item.recQty || 1);
          calories += (item.calories || 0) * qty;
          protein += (item.protein || 0) * qty;
          carbs += (item.carbs || 0) * qty;
          fat += (item.fat || 0) * qty;
          messProtein += (item.protein || 0) * qty;
        }
      });
    }
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
  const proteinGap = Math.max(0, targetPro - (protein + outsideProtein > protein ? protein : protein));
  const remainingCal = targetCal - calories;

  return {
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    messProtein: Math.round(messProtein * 10) / 10,
    outsideProtein: Math.round(outsideProtein * 10) / 10,
    proteinGap: Math.round((Math.max(0, targetPro - protein)) * 10) / 10,
    remainingCal: Math.round(remainingCal),
    targetCal,
    targetPro
  };
}

/* ─────────────────────────────────────────────────────────
 * DOM RENDERING
 * ───────────────────────────────────────────────────────── */
export async function initApp() {
  setupSidebar();
  renderISTSyncStatus();
  renderDateNavigation();
  await renderDashboard();
  setupEventListeners();
}

function setupSidebar() {
  const sidebar = document.getElementById('sidebar-nav');
  const toggleBtn = document.getElementById('btn-toggle-sidebar');
  if (sidebar && appState.sidebarCollapsed) {
    sidebar.classList.add('collapsed');
  }

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      appState.sidebarCollapsed = sidebar.classList.contains('collapsed');
      saveState();
    });
  }
}

function renderISTSyncStatus() {
  const badge = document.getElementById('ist-sync-badge');
  if (!badge) return;

  const isSafe = isWithinSafeSyncWindow();
  const ist = getISTDate();
  const timeStr = ist.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isSafe) {
    badge.innerHTML = `
      <span class="ist-pulse-dot"></span>
      <span>IST Live Sync Active (${timeStr}) • 6 AM–12 AM Window</span>
    `;
    badge.title = "Within active Indian daytime schedule. Safe from Poornima GMT rollover discrepancy.";
  } else {
    badge.innerHTML = `
      <span class="ist-pulse-dot night-mode"></span>
      <span>IST Night Guard Active (${timeStr}) • GMT Rollover Protected</span>
    `;
    badge.title = "Night hours (12 AM - 6 AM IST): Anchored to Indian calendar date to prevent GMT date drift.";
  }
}

function renderDateNavigation() {
  const container = document.getElementById('date-pills-container');
  if (!container) return;

  const days = [];
  const istNow = getISTDate();

  // -1: Yesterday
  const yesterday = new Date(istNow);
  yesterday.setDate(istNow.getDate() - 1);
  days.push({ date: yesterday, label: 'Yesterday', isYesterday: true });

  // 0: Today
  days.push({ date: new Date(istNow), label: 'Today', isToday: true });

  // +1, +2, +3
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 1; i <= 3; i++) {
    const d = new Date(istNow);
    d.setDate(istNow.getDate() + i);
    days.push({ date: d, label: `${dayNames[d.getDay()]} (${d.getDate()})` });
  }

  const selectedKey = formatDateKey(selectedDate);

  container.innerHTML = days.map(day => {
    const key = formatDateKey(day.date);
    const isActive = key === selectedKey;
    let cls = 'date-pill-btn';
    if (isActive) cls += ' active';
    if (day.isYesterday) cls += ' yesterday-btn';

    return `
      <button class="${cls}" data-date-key="${key}">
        <span>${day.isYesterday ? '↩ Check Yesterday' : day.label}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.date-pill-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const key = btn.getAttribute('data-date-key');
      selectedDate = parseDateKey(key);
      renderDateNavigation();
      await renderDashboard();
    });
  });
}

export async function renderDashboard(forceRefresh = false) {
  const dateKey = formatDateKey(selectedDate);
  const log = getDayLog(dateKey);

  const syncIcon = document.getElementById('sync-icon-spin');
  if (syncIcon && forceRefresh) {
    syncIcon.classList.add('spin-active');
  }

  // Fetch Live Firestore or Fallback or User Overrides
  const menuResult = await getMenuForDate(dateKey, appState, forceRefresh);
  currentMenuResult = menuResult;

  if (syncIcon) {
    syncIcon.classList.remove('spin-active');
  }

  // Update Active Menu Source Pill
  const sourcePill = document.getElementById('active-menu-source-pill');
  if (sourcePill) {
    sourcePill.innerHTML = `
      <span>${menuResult.statusBadge}</span>
    `;
    sourcePill.title = menuResult.statusNote;
  }

  const totals = calculateDayTotals(dateKey, menuResult.meals);

  // 1. Render Liveline & Allocation Insight Cards
  renderInsightCards(totals, dateKey);

  // 2. Render 6-Compartment Stainless Steel Thali
  renderPlateVisualizer(menuResult.meals, log);

  // 3. Render TaskRows Expandable Meal Checklist
  renderTaskRowsMeals(menuResult.meals, log, dateKey);

  // 4. Render Outside Protein Gap Widget
  renderProteinGapWidget(totals, dateKey);

  // 5. Render Off-Menu Write-In Items
  renderCustomFoodsList(log, dateKey);

  // 6. Render Sleep & Weight
  renderSleep(log, dateKey);
}

/* ─────────────────────────────────────────────────────────
 * INSIGHT CARDS WITH SMOOTH CATMULL-ROM LIVELINE CHART
 * ───────────────────────────────────────────────────────── */
function renderInsightCards(totals, dateKey) {
  // 1. Calorie Deficit Hero Card with Liveline Spline
  const calCard = document.getElementById('insight-calorie-card');
  if (calCard) {
    const calValues = [1620, 1680, 1590, 1740, 1690, 1650, totals.calories || 1680];
    const smoothed = smooth(calValues, 8);
    const minVal = 1400;
    const maxVal = 2000;
    const width = 280;
    const height = 90;

    // Build SVG path
    const points = smoothed.map((val, idx) => {
      const x = (idx / (smoothed.length - 1)) * width;
      const y = height - ((val - minVal) / (maxVal - minVal)) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const pathD = `M ${points.join(' L ')}`;

    // 1700 kcal threshold line
    const thresholdY = height - ((totals.targetCal - minVal) / (maxVal - minVal)) * height;

    calCard.innerHTML = `
      <div class="insight-card-top">
        <span class="insight-metric-label">
          <span class="metric-dot green"></span>
          Calorie Deficit Snapshot
        </span>
        <span style="font-size:11px; font-family:monospace; color:var(--ink-3);">Target: ${totals.targetCal} kcal</span>
      </div>

      <div class="hero-number">${totals.calories} <span style="font-size:14px; font-weight:500; color:var(--ink-2);">kcal</span></div>
      <div style="display:flex; align-items:baseline; gap:8px; margin-top:2px;">
        <span class="mono-delta ${totals.remainingCal >= 0 ? 'green' : 'red'}">
          ${totals.remainingCal >= 0 ? `+${totals.remainingCal} kcal budget left` : `${totals.remainingCal} kcal over budget`}
        </span>
      </div>

      <div class="insight-chart-stage" id="calorie-chart-stage">
        <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
          <!-- Threshold line -->
          <line x1="0" y1="${thresholdY}" x2="${width}" y2="${thresholdY}" stroke="rgba(255,255,255,0.18)" stroke-dasharray="3 3" stroke-width="1" />
          <!-- Spline -->
          <path d="${pathD}" fill="none" stroke="#10b981" stroke-width="2.2" stroke-linecap="round" />
        </svg>
        <div id="chart-cursor" class="chart-cursor-line" style="display:none;"></div>
        <div id="chart-tooltip" class="chart-tooltip-box" style="display:none;"></div>
      </div>
    `;

    // Add interactive hover cursor to chart
    const stage = document.getElementById('calorie-chart-stage');
    const cursor = document.getElementById('chart-cursor');
    const tooltip = document.getElementById('chart-tooltip');
    if (stage && cursor && tooltip) {
      stage.addEventListener('pointermove', (e) => {
        const rect = stage.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const index = Math.round(progress * (smoothed.length - 1));
        const val = Math.round(smoothed[index]);

        cursor.style.display = 'block';
        cursor.style.left = `${progress * 100}%`;

        tooltip.style.display = 'block';
        tooltip.style.left = `${progress * 100}%`;
        tooltip.innerText = `${val} kcal`;
      });
      stage.addEventListener('pointerleave', () => {
        cursor.style.display = 'none';
        tooltip.style.display = 'none';
      });
    }
  }

  // 2. Macro Allocation Segment Bar Card (From User's AllocationCard snippet)
  const allocCard = document.getElementById('insight-allocation-card');
  if (allocCard) {
    const totalGrams = (totals.carbs + totals.protein + totals.fat) || 100;
    const carbPct = Math.round((totals.carbs / totalGrams) * 100) || 50;
    const proPct = Math.round((totals.protein / totalGrams) * 100) || 28;
    const fatPct = Math.max(0, 100 - carbPct - proPct) || 22;

    allocCard.innerHTML = `
      <div class="insight-card-top">
        <span class="insight-metric-label">
          <span class="metric-dot accent"></span>
          Macro Allocation
        </span>
        <span style="font-size:11px; font-family:monospace; color:var(--ink-3);">Gram Ratio</span>
      </div>

      <div class="hero-number">${totals.protein}g <span style="font-size:14px; font-weight:500; color:var(--ink-2);">Protein</span></div>
      <div style="font-size:11.5px; color:var(--ink-2);">
        Mess: <strong>${totals.messProtein}g</strong> • Outside: <strong>${totals.outsideProtein}g</strong>
      </div>

      <div class="allocation-bar-wrapper">
        <div class="allocation-segmented-bar">
          <div class="allocation-seg-btn" style="width: ${proPct}%; background: #818cf8;" title="Protein: ${proPct}%"></div>
          <div class="allocation-seg-btn" style="width: ${carbPct}%; background: #f59e0b;" title="Carbs: ${carbPct}%"></div>
          <div class="allocation-seg-btn" style="width: ${fatPct}%; background: #f43f5e;" title="Fats: ${fatPct}%"></div>
        </div>

        <div class="allocation-chips-row">
          <span class="allocation-chip"><span class="metric-dot accent"></span> Protein ${totals.protein}g (${proPct}%)</span>
          <span class="allocation-chip"><span class="metric-dot orange"></span> Carbs ${totals.carbs}g (${carbPct}%)</span>
          <span class="allocation-chip"><span class="metric-dot red"></span> Fats ${totals.fat}g (${fatPct}%)</span>
        </div>
      </div>
    `;
  }

  // 3. Protein Gap Anomaly Card
  const gapCard = document.getElementById('insight-gap-card');
  if (gapCard) {
    const gap = totals.proteinGap;
    gapCard.innerHTML = `
      <div class="insight-card-top">
        <span class="insight-metric-label">
          <span class="metric-dot ${gap > 0 ? 'orange' : 'green'}"></span>
          ${gap > 0 ? 'Outside Protein Shortfall' : 'Protein Target Achieved'}
        </span>
        <span class="task-pill-status ${gap > 0 ? 'in-progress' : 'completed'}">
          ${gap > 0 ? `${gap}g Short` : 'Done ✓'}
        </span>
      </div>

      <div class="hero-number" style="color: ${gap > 0 ? '#fbbf24' : '#10b981'};">
        ${gap > 0 ? `${gap}g Needed` : 'Goal Met! 🎉'}
      </div>

      <p style="font-size:11.5px; color:var(--ink-2); margin-top:4px; line-height:1.4;">
        ${gap > 0 
          ? `Hostel mess provides ~${totals.messProtein}g protein. Take 1 scoop whey or 3 boiled eggs outside to hit ${totals.targetPro}g.` 
          : `You hit ${totals.protein}g protein today. Excellent muscle recovery.`}
      </p>

      <div style="margin-top:auto; padding-top:10px; border-top:1px solid var(--line);">
        <button class="btn-control" id="btn-quick-fix-gap" style="width:100%; justify-content:center; background:#1e293b;">
          ⚡ Quick Log: 1 Scoop Whey (+24g P)
        </button>
      </div>
    `;

    const quickBtn = document.getElementById('btn-quick-fix-gap');
    if (quickBtn) {
      quickBtn.addEventListener('click', () => {
        const log = getDayLog(dateKey);
        const whey = OUTSIDE_SUPPLEMENTS.find(s => s.id === 'whey_scoop') || {
          id: 'whey_scoop',
          name: '1 Scoop Whey Protein (with water)',
          protein: 24,
          calories: 120,
          fat: 1.5,
          carbs: 2,
          unit: '1 scoop (30g)'
        };
        log.supplements = log.supplements || [];
        log.supplements.push({ ...whey, time: 'Quick Log' });
        saveState();
        renderDashboard();
        showToast('Added 1 Scoop Whey (+24g Protein)!');
      });
    }
  }
}

/* ─────────────────────────────────────────────────────────
 * 6-COMPARTMENT MESS TRAY DIGITAL TWIN (39.5 x 29.5 cm)
 * ───────────────────────────────────────────────────────── */
function renderPlateVisualizer(mealsData, log) {
  const container = document.getElementById('metal-thali-tray');
  if (!container) return;

  const mealItems = (mealsData && (mealsData[activePlateMeal] || mealsData.lunch)) || [];

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

  // Assign sensible defaults if slots empty
  if (!compMap.comp_side_left) {
    compMap.comp_side_left = { name: "Green Salad (Kheera/Onion)", tag: "eat", unit: "1 Full Plate", calories: 25 };
  }
  if (!compMap.comp_side_right) {
    compMap.comp_side_right = { name: "Lemon / Green Chili", tag: "portion", unit: "Skip Achar!", calories: 5 };
  }
  if (!compMap.comp_center) {
    compMap.comp_center = { name: "3 Plain Tawa Chapatis", tag: "portion", unit: "3 rotis (no ghee)", calories: 270 };
  }

  function renderKatori(slotKey, defaultRole, extraClass = '') {
    const item = compMap[slotKey];
    if (!item) {
      return `
        <div class="tray-katori ${extraClass}">
          <span class="katori-role-pill">${defaultRole}</span>
          <div class="katori-food-title" style="color:var(--ink-3);">Empty / Optional</div>
        </div>
      `;
    }

    let statusCls = 'portion-cap';
    if (item.tag === 'eat') statusCls = 'safe-eat';
    if (item.tag === 'avoid') statusCls = 'avoid-item';

    return `
      <div class="tray-katori ${extraClass} ${statusCls}">
        <span class="katori-role-pill">${item.tag === 'eat' ? '🟢 High Protein / Safe' : (item.tag === 'avoid' ? '🔴 Avoid / Skip' : '🟡 Portion Cap')}</span>
        <div class="katori-food-title">${item.name}</div>
        <div class="katori-meta">
          <span style="color:#10b981; font-weight:600;">${item.unit || '1 portion'}</span>
          <span style="color:var(--ink-3);">~${item.calories || 0} kcal</span>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="tray-top-slots">
      ${renderKatori('comp_top_left', 'Dal / Protein Katori')}
      ${renderKatori('comp_top_mid', 'Sabzi / Veg Katori')}
      ${renderKatori('comp_top_right', 'Rayta / Curd Katori')}
    </div>
    <div class="tray-bottom-slots">
      ${renderKatori('comp_side_left', 'Salad Slot', 'side-slot')}
      ${renderKatori('comp_center', 'Roti / Rice Center Slot', 'center-slot')}
      ${renderKatori('comp_side_right', 'Papad / Pickle', 'side-slot')}
    </div>
  `;

  // Update meal toggle pills
  document.querySelectorAll('.plate-tab-pill').forEach(pill => {
    const meal = pill.getAttribute('data-meal');
    pill.classList.toggle('active', meal === activePlateMeal);
  });
}

/* ─────────────────────────────────────────────────────────
 * TASKROWS COMPONENT (Expandable Checklist with Edit Dish)
 * ───────────────────────────────────────────────────────── */
function renderTaskRowsMeals(mealsData, log, dateKey) {
  const container = document.getElementById('task-rows-meal-container');
  if (!container) return;

  const mealOrder = [
    { key: 'breakfast', title: 'Breakfast', icon: '🌅', time: '07:30 - 09:30 AM' },
    { key: 'lunch', title: 'Lunch', icon: '☀️', time: '12:30 - 02:30 PM' },
    { key: 'snacks', title: 'High Tea & Snacks', icon: '☕', time: '05:00 - 06:00 PM' },
    { key: 'dinner', title: 'Dinner', icon: '🌙', time: '07:30 - 09:30 PM' }
  ];

  container.innerHTML = mealOrder.map(meal => {
    const items = (mealsData && mealsData[meal.key]) || [];
    let mealCals = 0;
    let mealPro = 0;
    let consumedCount = 0;

    items.forEach(item => {
      const state = log.consumedMeals[item.id];
      if (state && state.consumed) {
        consumedCount++;
        const qty = state.qty !== undefined ? state.qty : (item.recQty || 1);
        mealCals += (item.calories || 0) * qty;
        mealPro += (item.protein || 0) * qty;
      }
    });

    const isDone = items.length > 0 && consumedCount > 0;
    const isExpanded = appState.expandedMeals[meal.key] !== false;

    const dishStepsHtml = items.map(item => {
      const state = log.consumedMeals[item.id] || { consumed: false, qty: item.recQty || 1 };
      const isConsumed = state.consumed;
      const currentQty = state.qty !== undefined ? state.qty : (item.recQty || 1);
      const effectiveCal = Math.round((item.calories || 0) * currentQty);
      const effectivePro = Math.round((item.protein || 0) * currentQty * 10) / 10;

      return `
        <div class="dish-step-item ${isConsumed ? 'checked' : ''}">
          <div style="display:flex; align-items:center; gap:10px; flex:1;">
            <button class="custom-checkbox ${isConsumed ? 'checked' : ''}" data-action="toggle-dish" data-dish-id="${item.id}">
              ${isConsumed ? '✓' : ''}
            </button>
            <div>
              <div style="font-size:13.5px; font-weight:600; color:#fff; display:flex; align-items:center; gap:6px;">
                <span>${item.name}</span>
                <span class="tag-pill ${item.tag || 'portion'}">${(item.tag || 'PORTION').toUpperCase()}</span>
              </div>
              <div style="font-size:11px; color:var(--ink-3);">${item.note || item.unit || '1 serving'}</div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:6px;">
            <button class="qty-btn" data-action="dec-dish" data-dish-id="${item.id}">−</button>
            <span class="qty-display">${currentQty}x</span>
            <button class="qty-btn" data-action="inc-dish" data-dish-id="${item.id}">+</button>
          </div>

          <div style="font-family:monospace; font-size:12px; margin-left:14px; text-align:right;">
            <div style="color:#10b981; font-weight:600;">${effectiveCal} cal</div>
            <div style="color:#818cf8;">${effectivePro}g P</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="task-row-card ${isExpanded ? 'expanded' : ''}" data-meal-key="${meal.key}">
        <div class="task-row-header-btn">
          <div style="display:flex; align-items:center; gap:12px; flex:1; cursor:pointer;" data-action="toggle-expand" data-meal-key="${meal.key}">
            <span class="badge-ring ${isDone ? 'done' : 'pending'}">
              ${isDone ? '✓' : meal.icon}
            </span>
            <div class="task-label-col">
              <span class="task-main-label">${meal.title}</span>
              <div class="task-sub-amount">${meal.time} • ${items.length} dishes</div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn-control" data-action="open-meal-editor" data-meal-key="${meal.key}" title="Chef cooked something else? Click to swap dishes" style="font-size:11px; padding:3px 8px;">
              ✏️ Swap / Edit Dishes
            </button>
            <div style="font-family:monospace; font-size:12px; text-align:right;">
              <span style="color:#10b981; font-weight:600;">${Math.round(mealCals)} cal</span>
              <span style="color:#818cf8; margin-left:6px;">${Math.round(mealPro * 10) / 10}g P</span>
            </div>
            <span class="task-pill-status ${isDone ? 'completed' : 'in-progress'}">
              ${isDone ? 'Logged' : 'Pending'}
            </span>
            <div data-action="toggle-expand" data-meal-key="${meal.key}" style="cursor:pointer; display:flex; align-items:center;">
              <svg class="task-chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>

        <div class="task-drawer-grid">
          <div class="task-drawer-inner">
            <div class="task-detail-list">
              <div class="vertical-hairline-connector"></div>
              <div class="dishes-step-stack">
                ${dishStepsHtml || '<div style="font-size:12px; color:var(--ink-3); padding:10px;">No dishes in this meal. Tap Swap / Edit Dishes above.</div>'}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Expand / collapse meal rows
  container.querySelectorAll('[data-action="toggle-expand"]').forEach(elem => {
    elem.addEventListener('click', () => {
      const key = elem.getAttribute('data-meal-key');
      appState.expandedMeals[key] = !appState.expandedMeals[key];
      saveState();
      renderDashboard();
    });
  });

  // Open Meal Editor
  container.querySelectorAll('[data-action="open-meal-editor"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mealKey = btn.getAttribute('data-meal-key');
      openMealEditor(mealKey, mealsData, dateKey);
    });
  });

  // Dish toggle listeners
  container.querySelectorAll('[data-action="toggle-dish"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-dish-id');
      const cur = log.consumedMeals[id] || { consumed: false, qty: 1 };
      cur.consumed = !cur.consumed;
      log.consumedMeals[id] = cur;
      saveState();
      renderDashboard();
      showToast(cur.consumed ? 'Dish logged to daily deficit!' : 'Dish unchecked');
    });
  });

  // Increment dish portion
  container.querySelectorAll('[data-action="inc-dish"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-dish-id');
      const cur = log.consumedMeals[id] || { consumed: true, qty: 1 };
      cur.qty = Math.round((cur.qty + 0.5) * 10) / 10;
      cur.consumed = true;
      log.consumedMeals[id] = cur;
      saveState();
      renderDashboard();
    });
  });

  // Decrement dish portion
  container.querySelectorAll('[data-action="dec-dish"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-dish-id');
      const cur = log.consumedMeals[id] || { consumed: true, qty: 1 };
      if (cur.qty > 0.5) {
        cur.qty = Math.round((cur.qty - 0.5) * 10) / 10;
      } else {
        cur.qty = 0;
        cur.consumed = false;
      }
      log.consumedMeals[id] = cur;
      saveState();
      renderDashboard();
    });
  });
}

/* ─────────────────────────────────────────────────────────
 * OUTSIDE PROTEIN GAP WIDGET
 * ───────────────────────────────────────────────────────── */
function renderProteinGapWidget(totals, dateKey) {
  const container = document.getElementById('outside-supplements-stack');
  if (!container) return;

  const log = getDayLog(dateKey);
  const supps = OUTSIDE_SUPPLEMENTS.slice(0, 5);

  container.innerHTML = supps.map(supp => `
    <div class="supplement-card-v2">
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:4px;">
        <span style="font-size:13px; font-weight:700; color:#fff;">${supp.name}</span>
        <span class="task-pill-status in-progress" style="font-size:10px;">${supp.badge}</span>
      </div>
      <div style="display:flex; gap:12px; font-size:11.5px; color:var(--ink-2); margin-bottom:6px;">
        <span style="color:#818cf8; font-weight:600;">+${supp.protein}g Protein</span>
        <span>${supp.calories} kcal</span>
        <span style="color:var(--ink-3);">${supp.cost}</span>
      </div>
      <div style="font-size:11px; color:var(--ink-3); line-height:1.35; margin-bottom:8px;">${supp.howTo}</div>
      <button class="btn-control" data-add-supp-id="${supp.id}" style="width:100%; justify-content:center; background:#10b981; color:#fff; border-color:#10b981;">
        + Log Supplement
      </button>
    </div>
  `).join('');

  // Logged supplements list
  const loggedContainer = document.getElementById('logged-supplements-list');
  if (loggedContainer) {
    const list = log.supplements || [];
    if (list.length === 0) {
      loggedContainer.innerHTML = `<span style="font-size:11.5px; color:var(--ink-3); font-style:italic;">No outside supplements logged today.</span>`;
    } else {
      loggedContainer.innerHTML = list.map((s, idx) => `
        <div class="logged-custom-item">
          <span>💊 <strong>${s.name}</strong> (+${s.protein}g P, ${s.calories} kcal)</span>
          <button class="btn-remove-item" data-del-supp-idx="${idx}">✕</button>
        </div>
      `).join('');
    }

    loggedContainer.querySelectorAll('[data-del-supp-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-del-supp-idx'), 10);
        log.supplements.splice(idx, 1);
        saveState();
        renderDashboard();
        showToast('Removed supplement');
      });
    });
  }

  container.querySelectorAll('[data-add-supp-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-add-supp-id');
      const s = OUTSIDE_SUPPLEMENTS.find(x => x.id === id);
      if (s) {
        log.supplements = log.supplements || [];
        log.supplements.push({ ...s, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        saveState();
        renderDashboard();
        showToast(`Logged ${s.name} (+${s.protein}g Protein)!`);
      }
    });
  });
}

function renderCustomFoodsList(log, dateKey) {
  const container = document.getElementById('custom-items-output');
  if (!container) return;

  const items = log.customFoods || [];
  if (items.length === 0) {
    container.innerHTML = `<span style="font-size:11.5px; color:var(--ink-3); font-style:italic;">No extra foods logged.</span>`;
    return;
  }

  container.innerHTML = items.map((f, idx) => `
    <div class="logged-custom-item">
      <span>🍴 <strong>${f.name}</strong> (${f.calories} cal, ${f.protein}g protein)</span>
      <button class="btn-remove-item" data-del-custom-idx="${idx}">✕</button>
    </div>
  `).join('');

  container.querySelectorAll('[data-del-custom-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-del-custom-idx'), 10);
      log.customFoods.splice(idx, 1);
      saveState();
      renderDashboard();
      showToast('Removed off-menu food');
    });
  });
}

function renderSleep(log, dateKey) {
  const hoursInput = document.getElementById('sleep-hours-v2');
  const weightInput = document.getElementById('morning-weight-v2');
  if (hoursInput) hoursInput.value = log.sleep?.hours || 7.5;
  if (weightInput) weightInput.value = log.morningWeight || '';
}

/* ─────────────────────────────────────────────────────────
 * MEAL EDITOR MODAL (Trust & Counter Overrides)
 * ───────────────────────────────────────────────────────── */
function openMealEditor(category, mealsData, dateKey) {
  editingMealCategory = category;
  const currentItems = (mealsData && mealsData[category]) || [];
  editingMealItems = JSON.parse(JSON.stringify(currentItems));

  const modal = document.getElementById('modal-meal-editor');
  const pretitle = document.getElementById('editor-meal-pretitle');
  if (pretitle) {
    pretitle.innerText = `${category.toUpperCase()} COUNTER OVERRIDE • ${dateKey}`;
  }

  renderEditorDishesList();
  if (modal) modal.classList.add('open');
}

function renderEditorDishesList() {
  const listEl = document.getElementById('editor-dishes-stack');
  if (!listEl) return;

  if (editingMealItems.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center; padding:16px; color:var(--ink-3); font-size:12.5px;">
        No dishes in this meal. Add what the mess served below!
      </div>
    `;
    return;
  }

  listEl.innerHTML = editingMealItems.map((item, idx) => `
    <div class="logged-custom-item" style="padding:8px 10px; margin-bottom:6px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:16px;">🍲</span>
        <div>
          <div style="font-size:13px; font-weight:600; color:#fff;">${item.name}</div>
          <div style="font-size:11px; color:var(--ink-3); font-family:monospace;">
            ${item.calories} cal • ${item.protein}g P • ${item.unit || '1 serving'}
          </div>
        </div>
      </div>
      <button class="btn-remove-item" data-remove-editor-idx="${idx}" title="Remove this dish">✕</button>
    </div>
  `).join('');

  listEl.querySelectorAll('[data-remove-editor-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-remove-editor-idx'), 10);
      const removed = editingMealItems.splice(idx, 1);
      renderEditorDishesList();
      showToast(`Removed ${removed[0]?.name || 'dish'}`);
    });
  });
}

function addDishToEditor(dishName) {
  if (!dishName || !dishName.trim()) return;
  const matched = matchDish(dishName.trim());
  editingMealItems.push(matched);
  renderEditorDishesList();
  showToast(`Added ${matched.name} (+${matched.protein}g P)`);
}

/* ─────────────────────────────────────────────────────────
 * EVENT LISTENERS
 * ───────────────────────────────────────────────────────── */
function setupEventListeners() {
  // Plate meal toggle
  document.querySelectorAll('.plate-tab-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activePlateMeal = btn.getAttribute('data-meal');
      const dateKey = formatDateKey(selectedDate);
      const log = getDayLog(dateKey);
      renderPlateVisualizer(currentMenuResult?.meals, log);
    });
  });

  // Custom food add button (Off-Menu / Canteen)
  const addBtn = document.getElementById('btn-add-canteen-food');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('input-canteen-name');
      const calInput = document.getElementById('input-canteen-cal');
      const proInput = document.getElementById('input-canteen-pro');

      const name = nameInput.value.trim();
      const calories = parseFloat(calInput.value) || 0;
      const protein = parseFloat(proInput.value) || 0;

      if (!name) {
        alert('Please enter a food name');
        return;
      }

      const dateKey = formatDateKey(selectedDate);
      const log = getDayLog(dateKey);
      log.customFoods = log.customFoods || [];
      log.customFoods.push({
        id: 'cust_' + Date.now(),
        name,
        calories,
        protein,
        carbs: Math.round(calories * 0.12),
        fat: Math.round(calories * 0.04)
      });

      nameInput.value = '';
      calInput.value = '';
      proInput.value = '';

      saveState();
      renderDashboard();
      showToast(`Logged ${name}!`);
    });
  }

  // Quick Chips
  const chipsContainer = document.getElementById('canteen-chips-row');
  if (chipsContainer) {
    chipsContainer.innerHTML = CANTEEN_ITEMS.slice(0, 10).map(c => `
      <button class="chip-btn" data-name="${c.name}" data-cal="${c.calories}" data-pro="${c.protein}">
        + ${c.name} (${c.calories} cal)
      </button>
    `).join('');

    chipsContainer.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('input-canteen-name').value = btn.getAttribute('data-name');
        document.getElementById('input-canteen-cal').value = btn.getAttribute('data-cal');
        document.getElementById('input-canteen-pro').value = btn.getAttribute('data-pro');
      });
    });
  }

  // Sleep save
  const saveSleepBtn = document.getElementById('btn-save-sleep-v2');
  if (saveSleepBtn) {
    saveSleepBtn.addEventListener('click', () => {
      const hours = parseFloat(document.getElementById('sleep-hours-v2').value) || 7.5;
      const weight = document.getElementById('morning-weight-v2').value.trim();

      const dateKey = formatDateKey(selectedDate);
      const log = getDayLog(dateKey);
      log.sleep = { hours };
      log.morningWeight = weight;

      saveState();
      renderDashboard();
      showToast('Sleep & Weight saved!');
    });
  }

  // Force Sync Button
  const syncBtn = document.getElementById('btn-force-sync');
  if (syncBtn) {
    syncBtn.addEventListener('click', async () => {
      showToast('Connecting directly to Poornima University Firestore...');
      await renderDashboard(true);
      renderISTSyncStatus();
      showToast('Synced with Poornima University DB!');
    });
  }

  // Meal Editor Modal handlers
  const modalEditor = document.getElementById('modal-meal-editor');
  const btnCloseEditor = document.getElementById('btn-close-editor');
  const btnSaveEditor = document.getElementById('btn-editor-save');
  const btnResetEditor = document.getElementById('btn-editor-reset');
  const editorInput = document.getElementById('editor-input-dish');
  const btnEditorAdd = document.getElementById('btn-editor-add-dish');

  if (btnCloseEditor && modalEditor) {
    btnCloseEditor.addEventListener('click', () => modalEditor.classList.remove('open'));
  }
  if (modalEditor) {
    modalEditor.addEventListener('click', (e) => {
      if (e.target === modalEditor) modalEditor.classList.remove('open');
    });
  }

  if (btnEditorAdd && editorInput) {
    const handleAdd = () => {
      const val = editorInput.value.trim();
      if (val) {
        addDishToEditor(val);
        editorInput.value = '';
      }
    };
    btnEditorAdd.addEventListener('click', handleAdd);
    editorInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAdd();
    });
  }

  // Preset chips in modal
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const preset = chip.getAttribute('data-preset');
      if (preset) addDishToEditor(preset);
    });
  });

  if (btnSaveEditor) {
    btnSaveEditor.addEventListener('click', async () => {
      const dateKey = formatDateKey(selectedDate);
      saveMealOverride(dateKey, editingMealCategory, editingMealItems, appState, saveState);
      if (modalEditor) modalEditor.classList.remove('open');
      await renderDashboard();
      showToast(`Saved verified ${editingMealCategory}!`);
    });
  }

  if (btnResetEditor) {
    btnResetEditor.addEventListener('click', async () => {
      const dateKey = formatDateKey(selectedDate);
      resetMealOverride(dateKey, editingMealCategory, appState, saveState);
      if (modalEditor) modalEditor.classList.remove('open');
      await renderDashboard(true);
      showToast(`Reset ${editingMealCategory} to live mess schedule.`);
    });
  }
}

export function showToast(msg) {
  let t = document.getElementById('web-app-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'web-app-toast';
    t.className = 'web-toast';
    document.body.appendChild(t);
  }
  t.innerText = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});
