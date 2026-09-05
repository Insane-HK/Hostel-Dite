// Poornima University Mess & Campus Nutrition Master Dictionary
// Calibrated with ICMR-NIN Indian Food Composition Tables + 20% Mess Oil/Tadka Adjustment Factor

export const NUTRITION_DICTIONARY = [
  // ─── BREAKFAST SPECIALS ───
  {
    keys: ['puri bhaji', 'poori bhaji', 'aaloo bhaji', 'puri', 'poori', 'aaloo puri'],
    name: 'Puri Bhaji',
    calories: 480,
    protein: 6.5,
    carbs: 58,
    fat: 26,
    unit: '3 puris + bhaji',
    tag: 'avoid',
    comp: 'comp_center',
    recQty: 0.5,
    note: 'DANGER ZONE! 1 puri = ~130 kcal deep fried. Eat max 1 puri or swap with bread.'
  },
  {
    keys: ['bread butter', 'bread'],
    name: 'Bread Butter',
    calories: 190,
    protein: 4.2,
    carbs: 26,
    fat: 7.5,
    unit: '2 slices',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 1,
    note: 'Safer light option on a deficit.'
  },
  {
    keys: ['poha', 'poha sev namkeen'],
    name: 'Poha',
    calories: 180,
    protein: 3.5,
    carbs: 32,
    fat: 4.0,
    unit: '1 bowl (150g)',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 1,
    note: 'Light breakfast. Skip extra oily namkeen on top.'
  },
  {
    keys: ['mix paratha', 'sada paratha', 'plain paratha', 'paratha', 'parantha', 'aaloo-parantha'],
    name: 'Mix Paratha',
    calories: 210,
    protein: 4.8,
    carbs: 31,
    fat: 7.8,
    unit: '1 paratha',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 1,
    note: 'Eat 1 paratha with dahi or tea. Say NO to extra butter cube.'
  },
  {
    keys: ['aloo paratha', 'aaloo paratha', 'aloo paratha masala'],
    name: 'Aloo Paratha',
    calories: 225,
    protein: 4.5,
    carbs: 34,
    fat: 8.5,
    unit: '1 paratha',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 1,
    note: '1 piece only. Pair with dahi or green chutney.'
  },
  {
    keys: ['besan chilla', 'chilla'],
    name: 'Besan Chilla',
    calories: 190,
    protein: 7.2,
    carbs: 28,
    fat: 5.5,
    unit: '1 large chilla',
    tag: 'eat',
    comp: 'comp_center',
    recQty: 1,
    note: 'Besan is packed with plant protein! Excellent deficit choice.'
  },
  {
    keys: ['idli', 'sambhar', 'idli sambhar', 'idli shambar', 'shambar'],
    name: 'Idli Sambhar',
    calories: 185,
    protein: 6.2,
    carbs: 36,
    fat: 1.8,
    unit: '2 idlis + sambhar',
    tag: 'eat',
    comp: 'comp_center',
    recQty: 1,
    note: 'Steamed, virtually oil-free! Fantastic choice for deficit.'
  },
  {
    keys: ['sprouts', 'sprauts'],
    name: 'Sprouts (Moong/Chana)',
    calories: 110,
    protein: 7.5,
    carbs: 18,
    fat: 0.8,
    unit: '1 bowl (150g)',
    tag: 'eat',
    comp: 'comp_center',
    recQty: 1.5,
    note: 'Clean uncooked plant protein with zero oil.'
  },
  {
    keys: ['upma', 'veg upma'],
    name: 'Veg Upma',
    calories: 175,
    protein: 4.2,
    carbs: 31,
    fat: 4.2,
    unit: '1 plate',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 1,
    note: 'Warm roasted sooji.'
  },
  {
    keys: ['pav bhaji'],
    name: 'Pav Bhaji',
    calories: 310,
    protein: 6.2,
    carbs: 42,
    fat: 12.5,
    unit: '2 pav + bhaji',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 0.7,
    note: 'Mess adds butter to toast pav. Limit to 1.5 pav.'
  },
  {
    keys: ['thandai'],
    name: 'Thandai',
    calories: 185,
    protein: 3.0,
    carbs: 36,
    fat: 3.2,
    unit: '1 glass (200ml)',
    tag: 'avoid',
    comp: 'bev',
    recQty: 0,
    note: 'High refined sugar! Skip completely on deficit.'
  },
  {
    keys: ['tea', 'chai', 'hot tea'],
    name: 'Chai (Tea)',
    calories: 65,
    protein: 1.5,
    carbs: 9,
    fat: 2.2,
    unit: '1 cup (100ml)',
    tag: 'portion',
    comp: 'bev',
    recQty: 1,
    note: 'Standard hostel tea.'
  },
  {
    keys: ['hot milk', 'milk'],
    name: 'Hot Milk',
    calories: 120,
    protein: 6.5,
    carbs: 9,
    fat: 6.5,
    unit: '1 glass (180ml)',
    tag: 'eat',
    comp: 'bev',
    recQty: 1,
    note: 'Slow digesting casein protein.'
  },

  // ─── DALS & HIGH PROTEIN CURRIES ───
  {
    keys: ['chana dal', 'chana dal fry'],
    name: 'Chana Dal Fry',
    calories: 145,
    protein: 7.8,
    carbs: 20,
    fat: 4.0,
    unit: '1 katori (180ml)',
    tag: 'eat',
    comp: 'comp_top_left',
    recQty: 1.5,
    note: 'High protein dal! Fill full katori.'
  },
  {
    keys: ['chhola', 'chhole', 'aaloo chhole', 'safed chana', 'aaloo- chhole', 'aloo- chhole', 'aloo chhole'],
    name: 'Chhola Masala',
    calories: 175,
    protein: 8.5,
    carbs: 24,
    fat: 5.5,
    unit: '1 katori (180g)',
    tag: 'eat',
    comp: 'comp_top_left',
    recQty: 1.5,
    note: 'Powerhouse protein & fiber! Eat 1.5 katoris.'
  },
  {
    keys: ['rajma', 'razma'],
    name: 'Rajma Masala',
    calories: 170,
    protein: 8.8,
    carbs: 23,
    fat: 4.8,
    unit: '1 katori (180g)',
    tag: 'eat',
    comp: 'comp_top_left',
    recQty: 1.5,
    note: 'Rich in amino acids and complex carbs.'
  },
  {
    keys: ['kala chana'],
    name: 'Kala Chana Curry',
    calories: 160,
    protein: 8.2,
    carbs: 22,
    fat: 4.5,
    unit: '1 katori (180g)',
    tag: 'eat',
    comp: 'comp_top_left',
    recQty: 1.5,
    note: 'High fiber desi chana.'
  },
  {
    keys: ['dal', 'yellow dal', 'arhar dal', 'toor dal', 'moong dal', 'masoor dal'],
    name: 'Yellow Dal Tadka',
    calories: 125,
    protein: 6.5,
    carbs: 17,
    fat: 3.8,
    unit: '1 katori (180ml)',
    tag: 'eat',
    comp: 'comp_top_left',
    recQty: 1.5,
    note: 'Clean amino foundation. Take 1.5 bowls.'
  },
  {
    keys: ['dal makhani', 'urad dal'],
    name: 'Dal Makhani',
    calories: 210,
    protein: 6.8,
    carbs: 21,
    fat: 11.2,
    unit: '1 katori',
    tag: 'portion',
    comp: 'comp_top_left',
    recQty: 1,
    note: 'Butter/cream loaded in mess. Don\'t take second helping.'
  },
  {
    keys: ['kadhi', 'rajasthani kadhi', 'kadhi pakoda'],
    name: 'Rajasthani Kadhi',
    calories: 145,
    protein: 4.5,
    carbs: 15,
    fat: 7.8,
    unit: '1 katori',
    tag: 'portion',
    comp: 'comp_top_left',
    recQty: 1,
    note: 'Besan + curd based. Take moderate gravy.'
  },
  {
    keys: ['soyabin', 'soya', 'soyabeen', 'aloo soyabeen', 'soyabin wadi', 'soya curry'],
    name: 'Soyabin Badi Curry',
    calories: 175,
    protein: 14.5,
    carbs: 11,
    fat: 7.5,
    unit: '1 katori (160g)',
    tag: 'eat',
    comp: 'comp_top_mid',
    recQty: 1.5,
    note: 'Hostel protein king! 14.5g protein per bowl.'
  },
  {
    keys: ['paneer', 'matar paneer', 'paneer bhurji'],
    name: 'Matar Paneer / Bhurji',
    calories: 215,
    protein: 11.2,
    carbs: 9,
    fat: 15.0,
    unit: '1 katori',
    tag: 'eat',
    comp: 'comp_top_left',
    recQty: 1.5,
    note: 'Hostel jackpot protein! Take a hearty serving.'
  },
  {
    keys: ['malai kopta', 'malai kofta'],
    name: 'Malai Kofta',
    calories: 270,
    protein: 4.8,
    carbs: 22,
    fat: 18.5,
    unit: '1 katori',
    tag: 'avoid',
    comp: 'comp_top_mid',
    recQty: 0.5,
    note: 'Heavy cashew/cream gravy. Pick 1 kofta piece, avoid pooling gravy.'
  },

  // ─── SABZIS & VEGETABLES ───
  {
    keys: ['bhindi', 'bhindi masala'],
    name: 'Bhindi Masala',
    calories: 95,
    protein: 2.2,
    carbs: 9,
    fat: 5.5,
    unit: '1 katori (150g)',
    tag: 'eat',
    comp: 'comp_top_mid',
    recQty: 1.5,
    note: 'High dietary fiber, super low calorie! Eat freely.'
  },
  {
    keys: ['dahi loki', 'loki', 'lauki', 'ghiya', 'dahi lauki', 'lauki chana'],
    name: 'Dahi Lauki (Ghiya)',
    calories: 80,
    protein: 3.2,
    carbs: 7,
    fat: 4.2,
    unit: '1 katori',
    tag: 'eat',
    comp: 'comp_top_mid',
    recQty: 1.5,
    note: 'Super low calorie, high water content.'
  },
  {
    keys: ['turai', 'torai', 'kundru', 'tinda', 'gwar fali'],
    name: 'Torai / Kundru Sabzi',
    calories: 80,
    protein: 2.0,
    carbs: 8,
    fat: 4.5,
    unit: '1 katori (150g)',
    tag: 'eat',
    comp: 'comp_top_mid',
    recQty: 1.5,
    note: 'Light on stomach, excellent hydration.'
  },
  {
    keys: ['patta gobi', 'aaloo-pattagobhi', 'pattagobhi', 'phool gobi', 'gobi matar', 'aloo gobi'],
    name: 'Patta Gobi / Cauliflower Sabzi',
    calories: 85,
    protein: 2.6,
    carbs: 11,
    fat: 3.5,
    unit: '1 katori',
    tag: 'eat',
    comp: 'comp_top_mid',
    recQty: 1.5,
    note: 'Cruciferous vegetable, keeps you full for hours.'
  },
  {
    keys: ['pyaz matar', 'matar'],
    name: 'Pyaz Matar Sabzi',
    calories: 110,
    protein: 3.2,
    carbs: 14,
    fat: 4.8,
    unit: '1 katori',
    tag: 'portion',
    comp: 'comp_top_mid',
    recQty: 1,
    note: 'Matar plant protein.'
  },
  {
    keys: ['aloo shimla', 'shimla mirch', 'aaloo- shimla', 'aloo- shimla', 'aloo shima'],
    name: 'Aloo Shimla Mirch',
    calories: 125,
    protein: 2.4,
    carbs: 16,
    fat: 5.5,
    unit: '1 katori',
    tag: 'portion',
    comp: 'comp_top_mid',
    recQty: 0.8,
    note: 'Pick more capsicum and less potato cubes.'
  },
  {
    keys: ['sukhe aloo', 'aaloo', 'aloo jeera', 'aloo tamater', 'dam aloo', 'dum aloo'],
    name: 'Sukhe Aloo Jeera',
    calories: 140,
    protein: 2.2,
    carbs: 21,
    fat: 5.5,
    unit: '1 katori',
    tag: 'portion',
    comp: 'comp_top_mid',
    recQty: 0.5,
    note: 'Pure starch. Take half katori max.'
  },
  {
    keys: ['gajar matar', 'gajar mater'],
    name: 'Gajar Matar',
    calories: 95,
    protein: 2.8,
    carbs: 13,
    fat: 3.8,
    unit: '1 katori',
    tag: 'eat',
    comp: 'comp_top_mid',
    recQty: 1,
    note: 'Rich in vitamin A & fiber.'
  },
  {
    keys: ['sev tamater', 'sev tamatar'],
    name: 'Sev Tamatar',
    calories: 190,
    protein: 4.5,
    carbs: 16,
    fat: 12.0,
    unit: '1 katori',
    tag: 'portion',
    comp: 'comp_top_mid',
    recQty: 0.8,
    note: 'Sev adds fried oil. Take mostly tomato gravy.'
  },
  {
    keys: ['corn palak', 'palak', 'aaloo-palak', 'aloo palak'],
    name: 'Corn Palak',
    calories: 115,
    protein: 3.8,
    carbs: 16,
    fat: 4.2,
    unit: '1 katori',
    tag: 'eat',
    comp: 'comp_top_mid',
    recQty: 1,
    note: 'Iron-rich spinach.'
  },
  {
    keys: ['gatta', 'aloo gatta'],
    name: 'Rajasthani Gatta Curry',
    calories: 165,
    protein: 5.5,
    carbs: 16,
    fat: 8.5,
    unit: '1 katori',
    tag: 'portion',
    comp: 'comp_top_mid',
    recQty: 1,
    note: 'Besan dumplings.'
  },
  {
    keys: ['baingan bharta', 'aloo baingan'],
    name: 'Baingan Bharta',
    calories: 105,
    protein: 2.2,
    carbs: 12,
    fat: 5.8,
    unit: '1 katori',
    tag: 'eat',
    comp: 'comp_top_mid',
    recQty: 1,
    note: 'Good roasted eggplant fiber.'
  },

  // ─── STAPLES, GRAINS & SIDES ───
  {
    keys: ['chapati', 'roti', 'phulka'],
    name: 'Chapati (Roti)',
    calories: 85,
    protein: 3.1,
    carbs: 16,
    fat: 0.8,
    unit: '1 roti',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 2,
    note: 'Cap at 2 rotis without butter.'
  },
  {
    keys: ['plain rice', 'rice', 'palin rice'],
    name: 'Plain Rice',
    calories: 135,
    protein: 2.8,
    carbs: 29,
    fat: 0.6,
    unit: '1 small cup (130g)',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 0,
    note: 'Skip rice if having 2 rotis to keep deficit.'
  },
  {
    keys: ['matar pulav', 'pila pulav', 'pulav', 'pulao'],
    name: 'Matar / Pila Pulav',
    calories: 165,
    protein: 3.5,
    carbs: 32,
    fat: 3.0,
    unit: '1 cup',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 0.5,
    note: 'Take half cup max.'
  },
  {
    keys: ['rayta', 'boondi rayta', 'mix rayta', 'mix veg rayta', 'cucumber rayta', 'lauki rayta'],
    name: 'Boondi / Veg Rayta',
    calories: 85,
    protein: 4.2,
    carbs: 7,
    fat: 4.5,
    unit: '1 katori (150ml)',
    tag: 'eat',
    comp: 'comp_top_right',
    recQty: 1,
    note: 'Protein booster & gut health.'
  },
  {
    keys: ['dahi', 'curd', 'fresh curd'],
    name: 'Fresh Curd (Dahi)',
    calories: 85,
    protein: 4.4,
    carbs: 5,
    fat: 5.2,
    unit: '1 katori (150ml)',
    tag: 'eat',
    comp: 'comp_top_right',
    recQty: 1,
    note: 'Cold curd provides digestive support.'
  },
  {
    keys: ['salad', 'saad', 'green salad', 'fresh salad'],
    name: 'Fresh Green Salad',
    calories: 25,
    protein: 1.1,
    carbs: 5,
    fat: 0.2,
    unit: '1 full plate',
    tag: 'eat',
    comp: 'comp_side_left',
    recQty: 1,
    note: 'Unlimited fiber hack! Eat first.'
  },
  {
    keys: ['achar', 'aachar'],
    name: 'Achar (Pickle)',
    calories: 40,
    protein: 0.2,
    carbs: 2,
    fat: 3.5,
    unit: '1 tsp (15g)',
    tag: 'avoid',
    comp: 'comp_side_right',
    recQty: 0,
    note: 'Skip sodium and oil.'
  },
  {
    keys: ['papad', 'roasted papad', 'sevdi'],
    name: 'Roasted Papad',
    calories: 45,
    protein: 2.5,
    carbs: 7,
    fat: 0.8,
    unit: '1 pc',
    tag: 'portion',
    comp: 'comp_side_right',
    recQty: 1,
    note: 'Ensure roasted, not fried.'
  },

  // ─── SNACKS & SWEETS ───
  {
    keys: ['dal pakodi', 'pakodi'],
    name: 'Dal Pakodi',
    calories: 260,
    protein: 5.8,
    carbs: 28,
    fat: 14.5,
    unit: '3-4 pakodis',
    tag: 'avoid',
    comp: 'comp_center',
    recQty: 0.3,
    note: 'Deep fried! Eat 1 pc for taste, or skip.'
  },
  {
    keys: ['sabudana khichadi'],
    name: 'Sabudana Khichadi',
    calories: 220,
    protein: 2.2,
    carbs: 38,
    fat: 6.8,
    unit: '1 small plate',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 0.7,
    note: 'Eat half plate if low on energy.'
  },
  {
    keys: ['bhelpuri', 'bhel'],
    name: 'Bhelpuri',
    calories: 145,
    protein: 3.2,
    carbs: 27,
    fat: 3.0,
    unit: '1 cup',
    tag: 'portion',
    comp: 'comp_center',
    recQty: 1,
    note: 'Puffed rice snack.'
  },
  {
    keys: ['chivda', 'sev namkeen', 'namkeen'],
    name: 'Chivda Namkeen',
    calories: 140,
    protein: 2.1,
    carbs: 18,
    fat: 7.0,
    unit: '1 small handful',
    tag: 'avoid',
    comp: 'comp_side_right',
    recQty: 0,
    note: 'Fried namkeen. Empty calories.'
  },
  {
    keys: ['samosa'],
    name: 'Samosa',
    calories: 260,
    protein: 4.0,
    carbs: 32,
    fat: 14.0,
    unit: '1 samosa',
    tag: 'avoid',
    comp: 'comp_center',
    recQty: 0,
    note: 'Maida & deep fried oil! Skip on deficit.'
  },
  {
    keys: ['kheer'],
    name: 'Kheer (Rice Pudding)',
    calories: 210,
    protein: 5.2,
    carbs: 32,
    fat: 7.5,
    unit: '1 small bowl',
    tag: 'avoid',
    comp: 'comp_side_right',
    recQty: 0.3,
    note: 'High refined sugar. Take 2 spoons for taste only.'
  },
  {
    keys: ['gulab jamun'],
    name: 'Gulab Jamun',
    calories: 150,
    protein: 2.0,
    carbs: 25,
    fat: 6.0,
    unit: '1 pc',
    tag: 'avoid',
    comp: 'comp_side_right',
    recQty: 0,
    note: 'Pure sugar and khoya. Skip.'
  },

  // ─── CAMPUS CANTEEN & TAPRI SUPPLEMENTS ───
  {
    keys: ['whey', 'whey protein', '1 scoop whey protein (with water)'],
    name: '1 Scoop Whey Protein (with water)',
    calories: 120,
    protein: 24.0,
    carbs: 2.0,
    fat: 1.5,
    unit: '1 scoop (30g)',
    tag: 'eat',
    comp: 'bev',
    recQty: 1,
    note: 'Primary outside protein foundation (+24g P).'
  },
  {
    keys: ['boiled egg', 'boiled eggs', '3 boiled eggs (campus tapri)', 'egg'],
    name: '3 Boiled Eggs (Campus Tapri)',
    calories: 215,
    protein: 18.0,
    carbs: 1.5,
    fat: 15.0,
    unit: '3 eggs',
    tag: 'eat',
    comp: 'comp_center',
    recQty: 1,
    note: 'Easy campus tapri protein (+18g P). Can skip 1 yolk to save 50 kcal.'
  },
  {
    keys: ['amul lassi', 'amul high protein lassi', 'buttermilk'],
    name: 'Amul High Protein Lassi / Buttermilk',
    calories: 110,
    protein: 15.0,
    carbs: 8.0,
    fat: 1.5,
    unit: '200 ml',
    tag: 'eat',
    comp: 'bev',
    recQty: 1,
    note: 'Pre-packaged clean dairy protein.'
  },
  {
    keys: ['sattu', 'chana sattu', 'chana sattu drink with lemon'],
    name: 'Chana Sattu Drink with Lemon',
    calories: 165,
    protein: 10.5,
    carbs: 26.0,
    fat: 2.2,
    unit: '1 glass',
    tag: 'eat',
    comp: 'bev',
    recQty: 1,
    note: 'Desi natural protein and hydration.'
  },
  {
    keys: ['roasted chana', 'bhuna chana'],
    name: 'Roasted Chana / Bhuna Chana',
    calories: 185,
    protein: 9.5,
    carbs: 28.0,
    fat: 3.0,
    unit: '50 g',
    tag: 'eat',
    comp: 'comp_side_right',
    recQty: 1,
    note: 'Crunchy study snack.'
  }
];

/**
 * Intelligent Token Matcher: maps any dish name (from Poornima live DB or user text)
 * to calibrated nutritional macros.
 */
export function matchDish(rawName) {
  if (!rawName || typeof rawName !== 'string') {
    return {
      id: 'custom_' + Date.now(),
      name: 'Custom Food',
      calories: 100,
      protein: 3.0,
      carbs: 15,
      fat: 3.0,
      unit: '1 serving',
      tag: 'portion',
      comp: 'comp_top_mid',
      recQty: 1,
      note: 'Hostel item'
    };
  }

  const clean = rawName.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) {
    return {
      id: 'custom_' + Date.now(),
      name: rawName,
      calories: 100,
      protein: 3.0,
      carbs: 15,
      fat: 3.0,
      unit: '1 serving',
      tag: 'portion',
      comp: 'comp_top_mid',
      recQty: 1,
      note: 'Hostel item'
    };
  }

  // 1. Exact Match Check
  for (const item of NUTRITION_DICTIONARY) {
    for (const k of item.keys) {
      if (clean === k) {
        return { ...item, id: clean.replace(/\s+/g, '_') };
      }
    }
  }

  // 2. Substring Match with Preference for Longest Key
  let bestMatch = null;
  let maxKeyLen = 0;
  for (const item of NUTRITION_DICTIONARY) {
    for (const k of item.keys) {
      if (clean.includes(k) || k.includes(clean)) {
        if (k.length > maxKeyLen) {
          maxKeyLen = k.length;
          bestMatch = item;
        }
      }
    }
  }
  if (bestMatch) {
    return { ...bestMatch, id: clean.replace(/\s+/g, '_') };
  }

  // 3. Heuristic Fallback based on keywords
  let cal = 110, pro = 3.0, carbs = 15, fat = 4.0;
  let tag = 'portion';
  let comp = 'comp_top_mid';
  let unit = '1 serving';

  if (clean.includes('dal') || clean.includes('curry')) {
    cal = 125; pro = 6.5; carbs = 17; fat = 3.8; tag = 'eat'; comp = 'comp_top_left'; unit = '1 katori';
  } else if (clean.includes('bhaji') || clean.includes('sabzi') || clean.includes('gobi') || clean.includes('aloo')) {
    cal = 115; pro = 2.5; carbs = 16; fat = 5.0; tag = 'portion'; comp = 'comp_top_mid'; unit = '1 katori';
  } else if (clean.includes('roti') || clean.includes('chapati') || clean.includes('paratha')) {
    cal = 90; pro = 3.2; carbs = 17; fat = 1.0; tag = 'portion'; comp = 'comp_center'; unit = '1 roti';
  } else if (clean.includes('rice') || clean.includes('pulav') || clean.includes('pulao')) {
    cal = 140; pro = 2.8; carbs = 30; fat = 1.0; tag = 'portion'; comp = 'comp_center'; unit = '1 cup';
  } else if (clean.includes('dahi') || clean.includes('curd') || clean.includes('rayta')) {
    cal = 85; pro = 4.2; carbs = 6; fat = 4.5; tag = 'eat'; comp = 'comp_top_right'; unit = '1 katori';
  } else if (clean.includes('sweet') || clean.includes('halwa') || clean.includes('pakodi') || clean.includes('fried')) {
    cal = 240; pro = 3.0; carbs = 32; fat = 12.0; tag = 'avoid'; comp = 'comp_side_right'; unit = '1 pc';
  }

  return {
    id: clean.replace(/\s+/g, '_'),
    name: rawName.trim(),
    calories: cal,
    protein: pro,
    carbs: carbs,
    fat: fat,
    unit,
    tag,
    comp,
    recQty: 1,
    note: 'Poornima mess item'
  };
}
