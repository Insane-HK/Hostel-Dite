# MacroFactor • Poornima Mess Deficit & Protein Companion

A personal calorie deficit and protein tracker for Indian college hostel students eating at the **Poornima University hostel mess** (`https://poornima.edu.in/life-at-poornima/menu-facility/`), styled with the exact visual grammar, layout, and micro-interactions of the **MacroFactor iOS mobile app**.

---

## 🎯 Key Objectives & Parameters

- **Target Calorie Deficit**: Strictly **1600–1800 kcal/day** (Default: 1700 kcal).
- **Daily Protein Target**: **60–95g/day** (Default: 80g).
- **Outside Protein Pantry**: Calculates the shortfall between mess food and your daily target, recommending affordable campus options:
  - 1 Scoop Whey Protein with water (+24g P, 120 kcal)
  - 3 Boiled Eggs from campus tapri (+18g P, 215 kcal)
  - Amul High Protein Lassi / Buttermilk (+15g P, 110 kcal)
  - Chana Sattu Drink with Lemon (+10.5g P, 165 kcal)
  - Roasted Chana / Bhuna Chana (+9.5g P, 185 kcal)
  - Canteen Maggi & Bread Omelette macros
- **6-Compartment Stainless Steel Thali Portion Guide**:
  - Calibrated specifically to the hostel's **39.5 cm × 29.5 cm × 2.3 cm** stainless steel tray.
  - Precise compartment mapping: Dal Bowl (180ml), Sabzi Bowl (150g), Curd/Rayta (150ml), Salad plate, Chapati/Rice slot, Papad/Lemon slot.
- **Poornima GMT / IST Rollover Bug Resolution**:
  - Anchored strictly to `Asia/Kolkata` (UTC + 5:30).
  - Sync window active between **06:00 AM and 11:59 PM IST**.
  - Uses a noon calendar anchor (`hours: 12`) to permanently prevent UTC date rollback between 12:00 AM and 05:30 AM IST.
- **Menu Reciprocation**:
  - **Friday Lunch**: Bhindi Masala (🟢 Eat, 95 kcal) + Chana Dal Fry + Soya Curry dinner.
  - **Saturday Lunch**: Torai / Kundru Sabzi (🟢 Eat, 80 kcal) + Chana Dal + Soya Badi dinner.

---

## 📱 MacroFactor iOS Visual Grammar

The interface replicates the signature MacroFactor mobile design system:
1. **AI Plate View**:
   - iOS status bar (`9:41`, battery, cellular, Wi-Fi).
   - Header bar with `(X)` reset, meal timing pill, circular SVG calorie progress arc meter, `[ 🥗 ]` Thali guide button, and `(↑)` scroll-to-top button.
   - Day selector chips (`Yesterday`, `Today`, `Sun 6`, `Mon 7`...).
   - Meal cards with **2-line serving pills** (`1 plate`, `1.5 katori`, `2 roti`).
   - Accordion toggles (`Collapse Ingredients ^` / `Expand Ingredients v`).
   - Food items with ICMR nutritional composition, deficit guidance tags (`🟢 Eat`, `🟡 Portion`, `🔴 Avoid`), and circular checkmark buttons `(+)` / `(✓)`.
   - Floating solid black pill CTA: **`Log Foods`**.
2. **Search Drawer**:
   - Slide-up bottom sheet with top fork/knife icon, minimize chevron, and drag handle.
   - 5 sub-tabs (`Scan`, `Search` with solid black underline, `AI`, `Quick Add`, `Library`).
   - `Latest` section with outside protein supplements and canteen items.
   - Pinned bottom capsule search bar with solid black **`Done`** button.
3. **Multi-Step Recipe Builder**:
   - **Step 1 (Build your recipe)**: Recipe Name, Serving Quantity, Total Weight (`g`), Ingredients list with 2-line serving pills and `(+)` button, sticky black `Next` button.
   - **Step 2 (Preparation optional)**: New Recipe preview card with `Edit Icon`, Preparation Time (`min`), Cooking Time (`min`), Recipe Link, Description (`0/1500`), `Create & Add`, and `Create` buttons.
4. **Nutrition Breakdown**:
   - Coral/pink dual-tone progress bars for minerals (Zinc, Iron, Calcium).
   - Blue progress bars for Calories, Protein deficit target, Choline, and Water.
   - Tinted `No Target` bars for Alcohol, Caffeine, and Cholesterol.
   - iOS toggle switch: **`Show all nutrients`**.
5. **6-Compartment Mess Thali Blueprint**:
   - Slide-up modal displaying the physical 39.5 × 29.5 cm tray layout with hostel deficit portion rules.

---

## 🛠️ Tech Stack & Structure

- **Core**: Vanilla HTML5, Modern ES6+ JavaScript, Vanilla CSS.
- **Bundler / Dev Server**: Vite 8.
- **Directory Structure**:
  ```
  ├── index.html                 # Main MacroFactor application frame & views
  ├── package.json               # Dependencies and scripts
  ├── vite.config.js             # Vite configuration
  ├── .gitignore                 # Production ignore rules
  └── src/
      ├── app.js                 # Application state, IST timezone logic & UI interactions
      ├── style.css              # MacroFactor iOS design system & responsive styling
      └── data/
          ├── poornima_menu.js   # 7-day cyclical Poornima mess menu with ICMR macros
          ├── supplements.js     # Hostel outside protein pantry database
          └── canteen_items.js   # Campus tapri & canteen nutritional items
  ```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/Insane-HK/Hostel-Dite.git

# Navigate into directory
cd Hostel-Dite

# Install dependencies
npm install
```

### Run Locally
```bash
npm run dev
```
Open `http://localhost:5173/` in your browser.

### Production Build
```bash
npm run build
```
The optimized bundle will be generated in `dist/`.

---

## 📄 License
ISC License.
