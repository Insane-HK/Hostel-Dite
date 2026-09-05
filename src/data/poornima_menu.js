// Poornima University Hostel Mess Menu Dataset
// Calibrated with ICMR-NIN Indian Food Composition Tables + 20% Mess Oil/Tadka adjustment factor.
// Timezone Anchor: Asia/Kolkata (IST = UTC+5:30). Safe sync window: 06:00 AM - 11:59 PM IST.

export const POORNIMA_MENU = {
  // Day 5: Friday (Corrected: Bhindi Masala served for Friday Lunch)
  5: {
    dayName: "Friday",
    meals: {
      breakfast: [
        { id: "pav_bhaji", name: "Pav Bhaji", tag: "portion", calories: 310, protein: 6.2, carbs: 42, fat: 12.5, unit: "2 pav + bhaji", comp: "comp_center", recQty: 0.7, note: "Mess adds butter to toast pav. Eat 1.5 pav or skip butter." },
        { id: "bread_butter_fri", name: "Bread Butter", tag: "portion", calories: 190, protein: 4.2, carbs: 26, fat: 7.5, unit: "2 slices", comp: "comp_center", recQty: 0, note: "Alternative light option." },
        { id: "tea_fri", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Tea." }
      ],
      lunch: [
        { id: "bhindi_fri", name: "Bhindi Masala", tag: "eat", calories: 95, protein: 2.2, carbs: 9, fat: 5.5, unit: "1 katori (150g)", comp: "comp_top_mid", recQty: 1.5, note: "Friday Special! High dietary fiber, super low calorie." },
        { id: "chana_dal_fri", name: "Chana Dal Fry", tag: "eat", calories: 140, protein: 7.6, carbs: 19, fat: 4.2, unit: "1 katori", comp: "comp_top_left", recQty: 1.5, note: "Primary protein base. Fill full bowl." },
        { id: "rayta_fri", name: "Boondi / Mix Veg Rayta", tag: "portion", calories: 90, protein: 3.8, carbs: 8, fat: 4.8, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Probiotic digestive support." },
        { id: "chapati_fri", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "Max 2 rotis without butter." },
        { id: "rice_fri", name: "Plain Rice", tag: "portion", calories: 135, protein: 2.8, carbs: 29, fat: 0.6, unit: "1 small cup", comp: "comp_center", recQty: 0, note: "Skip rice if having 2 rotis." },
        { id: "salad_fri", name: "Fresh Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Eat cucumber first." },
        { id: "achar_fri", name: "Achar", tag: "avoid", calories: 40, protein: 0.2, carbs: 2, fat: 3.5, unit: "1 tsp", comp: "comp_side_right", recQty: 0, note: "Skip oily pickle." }
      ],
      snacks: [
        { id: "samosa", name: "Samosa", tag: "avoid", calories: 260, protein: 4.0, carbs: 32, fat: 14.0, unit: "1 samosa", comp: "comp_center", recQty: 0, note: "Maida & deep fried oil! Skip on fat loss deficit." },
        { id: "tea_fri_snack", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Warm chai." }
      ],
      dinner: [
        { id: "soya_chaap", name: "Soyabin Wadi / Soya Curry", tag: "eat", calories: 185, protein: 14.5, carbs: 12, fat: 8.5, unit: "1 katori", comp: "comp_top_left", recQty: 1.5, note: "Friday dinner protein king! 14.5g protein per bowl." },
        { id: "dal_fri_din", name: "Yellow Dal Tadka", tag: "eat", calories: 115, protein: 6.2, carbs: 16, fat: 3.2, unit: "1 katori", comp: "comp_top_mid", recQty: 1, note: "Clean dal." },
        { id: "dahi_fri_din", name: "Dahi", tag: "eat", calories: 85, protein: 4.4, carbs: 5, fat: 5.2, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Cold curd." },
        { id: "chapati_fri_din", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "2 rotis." },
        { id: "salad_fri_din", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Salad." }
      ]
    }
  },

  // Day 6: Saturday (Reciprocated with Torai/Kundru & Chana Dal)
  6: {
    dayName: "Saturday",
    meals: {
      breakfast: [
        { id: "poha", name: "Poha", tag: "portion", calories: 180, protein: 3.5, carbs: 32, fat: 4, unit: "1 bowl (150g)", comp: "comp_center", recQty: 1, note: "Light breakfast. Don't add extra namkeen on top." },
        { id: "bread_butter", name: "Bread Butter", tag: "portion", calories: 190, protein: 4.2, carbs: 26, fat: 7.5, unit: "2 slices", comp: "comp_center", recQty: 0, note: "Skip if having Poha." },
        { id: "thandai", name: "Thandai", tag: "avoid", calories: 185, protein: 3.0, carbs: 36, fat: 3.2, unit: "1 glass (200ml)", comp: "bev", recQty: 0, note: "High refined sugar! Skip completely on deficit." },
        { id: "tea", name: "Chai (Tea)", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup (100ml)", comp: "bev", recQty: 1, note: "Ask for less sugar if possible." }
      ],
      lunch: [
        { id: "chana_dal_sat", name: "Chana Dal", tag: "eat", calories: 145, protein: 7.8, carbs: 20, fat: 4, unit: "1 katori (180ml)", comp: "comp_top_left", recQty: 1.5, note: "High protein dal! Fill full katori." },
        { id: "torai_sat", name: "Torai / Kundru Sabzi", tag: "eat", calories: 80, protein: 2.0, carbs: 8, fat: 4.5, unit: "1 katori (150g)", comp: "comp_top_mid", recQty: 1, note: "Light on stomach, excellent hydration." },
        { id: "aloo_shimla", name: "Aloo Shimla Mirch", tag: "portion", calories: 125, protein: 2.4, carbs: 16, fat: 5.5, unit: "1 katori (150g)", comp: "comp_top_mid", recQty: 0.5, note: "Pick more capsicum and less potato cubes." },
        { id: "rayta_sat", name: "Boondi / Mix Veg Rayta", tag: "eat", calories: 85, protein: 4.2, carbs: 7, fat: 4.5, unit: "1 katori (150ml)", comp: "comp_top_right", recQty: 1, note: "Protein booster & gut health." },
        { id: "chapati_sat", name: "Chapati (Roti)", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "Limit to 2 rotis." },
        { id: "rice_sat", name: "Plain Rice", tag: "portion", calories: 135, protein: 2.8, carbs: 29, fat: 0.6, unit: "1 small cup (130g)", comp: "comp_center", recQty: 0, note: "Skip if having 2 rotis." },
        { id: "salad_sat", name: "Green Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 full plate", comp: "comp_side_left", recQty: 1, note: "Unlimited fiber hack!" },
        { id: "achar_sat", name: "Achar", tag: "avoid", calories: 40, protein: 0.2, carbs: 2, fat: 3.5, unit: "1 tsp (15g)", comp: "comp_side_right", recQty: 0, note: "Skip sodium and oil." }
      ],
      snacks: [
        { id: "sabudana_khichadi", name: "Sabudana Khichadi", tag: "portion", calories: 220, protein: 2.2, carbs: 38, fat: 6.8, unit: "1 small plate", comp: "comp_center", recQty: 0.7, note: "Eat half plate if low on energy." },
        { id: "tea_sat_snack", name: "Evening Chai", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Warm tea." }
      ],
      dinner: [
        { id: "dal_sat_din", name: "Yellow Dal Tadka", tag: "eat", calories: 125, protein: 6.8, carbs: 17, fat: 3.8, unit: "1 katori (180ml)", comp: "comp_top_left", recQty: 1.5, note: "Take 1.5 katori." },
        { id: "soyabin_sat", name: "Soyabin Badi Curry", tag: "eat", calories: 175, protein: 14.5, carbs: 11, fat: 7.5, unit: "1 katori (160g)", comp: "comp_top_mid", recQty: 1.5, note: "High protein meal." },
        { id: "pyaz_matar", name: "Pyaz Matar Sabzi", tag: "portion", calories: 110, protein: 3.2, carbs: 14, fat: 4.8, unit: "1 katori", comp: "comp_top_mid", recQty: 0.5, note: "Matar plant protein." },
        { id: "dahi_sat_din", name: "Fresh Curd (Dahi)", tag: "eat", calories: 85, protein: 4.4, carbs: 5, fat: 5.2, unit: "1 katori (150ml)", comp: "comp_top_right", recQty: 1, note: "Slow digesting casein protein." },
        { id: "chapati_sat_din", name: "Chapati (Roti)", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "Cap at 2 rotis." },
        { id: "salad_sat_din", name: "Fresh Green Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Cucumber slices." }
      ]
    }
  },

  // Day 0: Sunday
  0: {
    dayName: "Sunday",
    meals: {
      breakfast: [
        { id: "puri_bhaji", name: "Puri Bhaji", tag: "avoid", calories: 480, protein: 6.5, carbs: 58, fat: 26, unit: "3 puris + bhaji", comp: "comp_center", recQty: 0.4, note: "DANGER ZONE! 1 puri = ~130 kcal deep fried. Take max 1-2 puris or swap for bread." },
        { id: "bread_butter_sun", name: "Bread Butter", tag: "portion", calories: 190, protein: 4.2, carbs: 26, fat: 7.5, unit: "2 slices", comp: "comp_center", recQty: 1, note: "Safer option than Puri on deficit." },
        { id: "thandai_sun", name: "Thandai", tag: "avoid", calories: 185, protein: 3.0, carbs: 36, fat: 3.2, unit: "1 glass", comp: "bev", recQty: 0, note: "Avoid sugar drink." },
        { id: "tea_sun", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Standard tea." }
      ],
      lunch: [
        { id: "chhola", name: "Chhola Masala", tag: "eat", calories: 175, protein: 8.5, carbs: 24, fat: 5.5, unit: "1 katori (180g)", comp: "comp_top_left", recQty: 1.5, note: "High protein & fiber." },
        { id: "dal_sun", name: "Mix Dal", tag: "eat", calories: 120, protein: 6.5, carbs: 16, fat: 3.5, unit: "1 katori", comp: "comp_top_mid", recQty: 1, note: "Good amino profile." },
        { id: "dahi_loki", name: "Dahi Lauki (Ghiya)", tag: "eat", calories: 80, protein: 3.2, carbs: 7, fat: 4.2, unit: "1 katori", comp: "comp_top_mid", recQty: 1, note: "Super low calorie, high water content." },
        { id: "rayta_sun", name: "Rayta", tag: "eat", calories: 85, protein: 4.2, carbs: 7, fat: 4.5, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Hydrating." },
        { id: "chapati_sun", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "Limit to 2." },
        { id: "salad_sun", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Eat generously." }
      ],
      snacks: [
        { id: "dal_pakodi", name: "Dal Pakodi", tag: "avoid", calories: 260, protein: 5.8, carbs: 28, fat: 14.5, unit: "3-4 pakodis", comp: "comp_center", recQty: 0.3, note: "Deep fried snack! Eat 1 piece only for taste, or skip." },
        { id: "tea_sun_snack", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Hot tea." }
      ],
      dinner: [
        { id: "kadhi", name: "Rajasthani Kadhi Pakoda", tag: "portion", calories: 145, protein: 4.5, carbs: 15, fat: 7.8, unit: "1 katori", comp: "comp_top_left", recQty: 1, note: "Besan + curd based. Take moderate gravy." },
        { id: "patta_gobi", name: "Patta Gobi Matar", tag: "eat", calories: 85, protein: 2.6, carbs: 11, fat: 3.5, unit: "1 katori", comp: "comp_top_mid", recQty: 1, note: "Cruciferous vegetable, keeps you full for hours." },
        { id: "chivda", name: "Chivda Namkeen", tag: "avoid", calories: 140, protein: 2.1, carbs: 18, fat: 7.0, unit: "1 small handful", comp: "comp_side_right", recQty: 0, note: "Fried namkeen. Empty calories." },
        { id: "pila_pulav", name: "Pila Pulav (Matar Rice)", tag: "portion", calories: 165, protein: 3.5, carbs: 32, fat: 3.0, unit: "1 cup", comp: "comp_center", recQty: 0.5, note: "Take half cup max." },
        { id: "chapati_sun_din", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "2 chapatis." },
        { id: "dahi_sun_din", name: "Dahi", tag: "eat", calories: 85, protein: 4.4, carbs: 5, fat: 5.2, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Digestive support." },
        { id: "salad_sun_din", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Fresh veggies." }
      ]
    }
  },

  // Day 1: Monday
  1: {
    dayName: "Monday",
    meals: {
      breakfast: [
        { id: "mix_paratha", name: "Mix Paratha", tag: "portion", calories: 210, protein: 4.8, carbs: 31, fat: 7.8, unit: "1 paratha", comp: "comp_center", recQty: 1, note: "Eat 1 paratha with dahi or tea. Say NO to extra butter cube." },
        { id: "bread_butter_mon", name: "Bread Butter", tag: "portion", calories: 190, protein: 4.2, carbs: 26, fat: 7.5, unit: "2 slices", comp: "comp_center", recQty: 0, note: "Skip if having Paratha." },
        { id: "tea_mon", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Standard tea." }
      ],
      lunch: [
        { id: "dal_mon", name: "Arhar / Toor Dal", tag: "eat", calories: 130, protein: 7.0, carbs: 18, fat: 3.8, unit: "1 katori", comp: "comp_top_left", recQty: 1.5, note: "Drink a full bowl." },
        { id: "sukhe_aloo", name: "Sukhe Aloo Jeera", tag: "portion", calories: 140, protein: 2.2, carbs: 21, fat: 5.5, unit: "1 katori", comp: "comp_top_mid", recQty: 0.5, note: "Pure starch. Take half katori only." },
        { id: "rayta_mon", name: "Mix Rayta", tag: "eat", calories: 85, protein: 4.2, carbs: 7, fat: 4.5, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Protein boost." },
        { id: "matar_pulav_mon", name: "Matar Pulav", tag: "portion", calories: 160, protein: 3.6, carbs: 31, fat: 2.8, unit: "1 cup", comp: "comp_center", recQty: 0.5, note: "Small portion." },
        { id: "chapati_mon", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "2 rotis." },
        { id: "papad_mon", name: "Roasted Papad", tag: "portion", calories: 45, protein: 2.5, carbs: 7, fat: 0.8, unit: "1 pc", comp: "comp_side_right", recQty: 1, note: "Ensure it is roasted, not fried!" },
        { id: "salad_mon", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Lots of cucumber." }
      ],
      snacks: [
        { id: "poha_snack", name: "Poha", tag: "portion", calories: 170, protein: 3.2, carbs: 30, fat: 3.8, unit: "1 small plate", comp: "comp_center", recQty: 1, note: "Good evening fuel if working out." },
        { id: "tea_mon_snack", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Warm chai." }
      ],
      dinner: [
        { id: "dal_mon_din", name: "Moong Dal", tag: "eat", calories: 120, protein: 7.2, carbs: 17, fat: 3.2, unit: "1 katori", comp: "comp_top_left", recQty: 1.5, note: "Easily digestible evening protein." },
        { id: "malai_kofta", name: "Malai Kofta", tag: "avoid", calories: 270, protein: 4.8, carbs: 22, fat: 18.5, unit: "1 katori", comp: "comp_top_mid", recQty: 0.5, note: "Heavy cashew/cream gravy. Pick 1 kofta piece, avoid pooling gravy." },
        { id: "dahi_mon_din", name: "Dahi", tag: "eat", calories: 85, protein: 4.4, carbs: 5, fat: 5.2, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Cold curd." },
        { id: "chapati_mon_din", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "2 rotis." },
        { id: "salad_mon_din", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Unlimited salad." }
      ]
    }
  },

  // Day 2: Tuesday
  2: {
    dayName: "Tuesday",
    meals: {
      breakfast: [
        { id: "idli_sambhar", name: "Idli Sambhar", tag: "eat", calories: 185, protein: 6.2, carbs: 36, fat: 1.8, unit: "2 idlis + sambhar", comp: "comp_center", recQty: 1, note: "Steamed, virtually oil-free! Fantastic choice for deficit." },
        { id: "tea_tue", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Chai." }
      ],
      lunch: [
        { id: "arhar_dal_tue", name: "Toor / Arhar Dal", tag: "eat", calories: 130, protein: 7.0, carbs: 18, fat: 3.8, unit: "1 katori", comp: "comp_top_left", recQty: 1.5, note: "1.5 katori." },
        { id: "baingan_bharta", name: "Baingan Bharta / Aloo Baingan", tag: "eat", calories: 105, protein: 2.2, carbs: 12, fat: 5.8, unit: "1 katori", comp: "comp_top_mid", recQty: 1, note: "Good veggie base." },
        { id: "boondi_rayta", name: "Boondi Rayta", tag: "portion", calories: 95, protein: 3.8, carbs: 9, fat: 5.0, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "1 katori." },
        { id: "chapati_tue", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "2 rotis." },
        { id: "salad_tue", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Full plate." }
      ],
      snacks: [
        { id: "veg_cutlet", name: "Veg Cutlet / Biscuits", tag: "portion", calories: 160, protein: 3.0, carbs: 22, fat: 6.8, unit: "1 pc", comp: "comp_center", recQty: 1, note: "Portion control." },
        { id: "tea_tue_snack", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Tea." }
      ],
      dinner: [
        { id: "paneer_bhurji", name: "Paneer Bhurji / Matar Paneer", tag: "eat", calories: 215, protein: 11.2, carbs: 9, fat: 15.0, unit: "1 katori", comp: "comp_top_left", recQty: 1.5, note: "Hostel jackpot protein! Take a hearty serving." },
        { id: "dal_tadka_tue", name: "Dal Tadka", tag: "eat", calories: 125, protein: 6.5, carbs: 17, fat: 3.8, unit: "1 katori", comp: "comp_top_mid", recQty: 1, note: "Standard dal." },
        { id: "dahi_tue", name: "Curd", tag: "eat", calories: 85, protein: 4.4, carbs: 5, fat: 5.2, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Curd." },
        { id: "chapati_tue_din", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "2 rotis." },
        { id: "salad_tue_din", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Salad." }
      ]
    }
  },

  // Day 3: Wednesday
  3: {
    dayName: "Wednesday",
    meals: {
      breakfast: [
        { id: "aloo_paratha", name: "Aloo Paratha", tag: "portion", calories: 225, protein: 4.5, carbs: 34, fat: 8.5, unit: "1 paratha", comp: "comp_center", recQty: 1, note: "1 piece only. Pair with dahi." },
        { id: "dahi_wed_bf", name: "Plain Curd", tag: "eat", calories: 75, protein: 4.0, carbs: 4.5, fat: 4.5, unit: "1 small cup", comp: "comp_top_right", recQty: 1, note: "Add black salt." },
        { id: "tea_wed", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Tea." }
      ],
      lunch: [
        { id: "rajma", name: "Rajma Masala", tag: "eat", calories: 170, protein: 8.8, carbs: 23, fat: 4.8, unit: "1 katori (180g)", comp: "comp_top_left", recQty: 1.5, note: "Powerhouse protein & complex carbs! Fill up on Rajma." },
        { id: "aloo_gobi", name: "Aloo Gobi Sabzi", tag: "portion", calories: 115, protein: 2.8, carbs: 15, fat: 5.2, unit: "1 katori", comp: "comp_top_mid", recQty: 1, note: "Take more gobi and fewer potatoes." },
        { id: "rayta_wed", name: "Cucumber Rayta", tag: "eat", calories: 75, protein: 4.0, carbs: 6, fat: 4.0, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Cooling & light." },
        { id: "chapati_wed", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "2 rotis." },
        { id: "salad_wed", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Onion & lemon." }
      ],
      snacks: [
        { id: "sweet_corn", name: "Boiled Sweet Corn / Bhel", tag: "eat", calories: 135, protein: 3.5, carbs: 27, fat: 1.8, unit: "1 cup", comp: "comp_center", recQty: 1, note: "Boiled corn is great fiber and clean carbs." },
        { id: "tea_wed_snack", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Tea." }
      ],
      dinner: [
        { id: "moong_dal_wed", name: "Moong Dal Tadka", tag: "eat", calories: 120, protein: 7.2, carbs: 17, fat: 3.2, unit: "1 katori", comp: "comp_top_left", recQty: 1.5, note: "1.5 katori." },
        { id: "lauki_chana", name: "Lauki Chana Dal Sabzi", tag: "eat", calories: 105, protein: 4.2, carbs: 13, fat: 4.0, unit: "1 katori", comp: "comp_top_mid", recQty: 1, note: "Dual benefit: hydrating lauki + protein chana." },
        { id: "dahi_wed_din", name: "Dahi", tag: "eat", calories: 85, protein: 4.4, carbs: 5, fat: 5.2, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Curd." },
        { id: "chapati_wed_din", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "2 rotis." },
        { id: "salad_wed_din", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Salad." }
      ]
    }
  },

  // Day 4: Thursday
  4: {
    dayName: "Thursday",
    meals: {
      breakfast: [
        { id: "besan_chilla", name: "Besan Chilla / Veg Daliya", tag: "eat", calories: 190, protein: 7.2, carbs: 28, fat: 5.5, unit: "1 large chilla", comp: "comp_center", recQty: 1, note: "Besan is packed with plant protein! Much better than bread." },
        { id: "tea_thu", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Tea." }
      ],
      lunch: [
        { id: "masoor_dal", name: "Masoor Dal (Malka)", tag: "eat", calories: 130, protein: 7.4, carbs: 18, fat: 3.5, unit: "1 katori", comp: "comp_top_left", recQty: 1.5, note: "Rich in iron and protein." },
        { id: "shimla_aloo", name: "Shimla Mirch Aloo", tag: "portion", calories: 110, protein: 2.1, carbs: 15, fat: 4.8, unit: "1 katori", comp: "comp_top_mid", recQty: 1, note: "Eat capsicum." },
        { id: "rayta_thu", name: "Lauki Rayta", tag: "eat", calories: 75, protein: 4.0, carbs: 6, fat: 4.0, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Lauki rayta." },
        { id: "chapati_thu", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "2 rotis." },
        { id: "salad_thu", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Cucumber." }
      ],
      snacks: [
        { id: "upma", name: "Veg Upma", tag: "portion", calories: 175, protein: 4.2, carbs: 31, fat: 4.2, unit: "1 plate", comp: "comp_center", recQty: 1, note: "Warm roasted sooji." },
        { id: "tea_thu_snack", name: "Tea", tag: "portion", calories: 65, protein: 1.5, carbs: 9, fat: 2.2, unit: "1 cup", comp: "bev", recQty: 1, note: "Tea." }
      ],
      dinner: [
        { id: "dal_makhani", name: "Dal Makhani / Urad Dal", tag: "portion", calories: 210, protein: 6.8, carbs: 21, fat: 11.2, unit: "1 katori", comp: "comp_top_left", recQty: 1, note: "Butter/cream loaded in mess. Don't take second helping." },
        { id: "gobi_matar", name: "Gobi Matar Sabzi", tag: "eat", calories: 95, protein: 3.2, carbs: 12, fat: 3.8, unit: "1 katori", comp: "comp_top_mid", recQty: 1, note: "High volume, low calorie." },
        { id: "dahi_thu_din", name: "Dahi", tag: "eat", calories: 85, protein: 4.4, carbs: 5, fat: 5.2, unit: "1 katori", comp: "comp_top_right", recQty: 1, note: "Curd." },
        { id: "chapati_thu_din", name: "Chapati", tag: "portion", calories: 85, protein: 3.1, carbs: 16, fat: 0.8, unit: "1 roti", comp: "comp_center", recQty: 2, note: "2 rotis." },
        { id: "salad_thu_din", name: "Salad", tag: "eat", calories: 25, protein: 1.1, carbs: 5, fat: 0.2, unit: "1 plate", comp: "comp_side_left", recQty: 1, note: "Salad." }
      ]
    }
  }
};
