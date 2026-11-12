import {
  UserProfile,
  CalculatedPlan,
  DayRoadmapItem,
  MealPlanCategory,
  SmartSwap,
  FoodCalorieItem,
} from '../types';

export const defaultProfile: UserProfile = {
  age: 28,
  gender: 'male',
  heightCm: 172,
  currentWeightKg: 80,
  targetWeightKg: 72,
  activityLevel: 'light_walker',
  dietPreference: 'vegetarian',
  startDate: new Date().toISOString().split('T')[0],
};

// Scientific Calculation: Mifflin-St Jeor formula
export function calculatePlan(profile: UserProfile): CalculatedPlan {
  const { age, gender, heightCm, currentWeightKg, targetWeightKg, activityLevel } = profile;

  // BMR
  let bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }

  // Activity multipliers for non-gym approach
  const activityFactors = {
    sedentary: 1.2, // Desk job, ~4,000 steps
    light_walker: 1.375, // 7,000-8,500 daily steps
    active_walker: 1.55, // 10,000+ daily steps + home mobility
  };

  const tdee = Math.round(bmr * (activityFactors[activityLevel] || 1.35));

  // Safe sustainable deficit: 450 - 550 kcal/day (never dip below 1250 kcal for females, 1400 for males)
  const targetDeficit = 500;
  const targetDailyCalories = Math.max(gender === 'male' ? 1400 : 1250, tdee - targetDeficit);
  const actualDeficit = tdee - targetDailyCalories;

  // 1.4g protein per kg of bodyweight to preserve muscle & spike TEF
  const targetProteinGrams = Math.round(currentWeightKg * 1.35);

  // 60-day fat loss: 1kg of fat ≈ 7,700 kcal. Plus ~1.5kg initial water/glycogen shedding
  const caloricFatLossKg = (actualDeficit * 60) / 7700;
  const totalProjectedLoss = Math.min(
    currentWeightKg - targetWeightKg,
    Math.round((caloricFatLossKg + 1.2) * 10) / 10
  );

  return {
    bmr: Math.round(bmr),
    tdee,
    targetDailyCalories,
    dailyCalorieDeficit: actualDeficit,
    targetProteinGrams,
    targetSteps: activityLevel === 'active_walker' ? 10000 : 8500,
    targetWaterLiters: 3.5,
    estimated60DayFatLossKg: Math.max(2, totalProjectedLoss),
    projectedWeightAt60Days: Math.round((currentWeightKg - totalProjectedLoss) * 10) / 10,
  };
}

export const phasesInfo = [
  {
    phase: 1,
    days: 'Day 1 - 14 (हफ़्ते 1-2)',
    titleHi: 'मेटाबोलिक रीसेट और आदत निर्माण',
    titleEn: 'Metabolic Reset & Habit Foundation',
    descHi: 'मीठा और पैकेज्ड फूड बंद करें। 8,000 कदम और 3.5 लीटर पानी से वॉटर वेट तुरंत 1.5-2.5 किलो कम होता है।',
    descEn: 'Eliminate refined sugars and junk. 8,000 brisk steps & 3.5L water sheds water bloat rapidly.',
    color: 'emerald',
  },
  {
    phase: 2,
    days: 'Day 15 - 28 (हफ़्ते 3-4)',
    titleHi: 'फैट ऑक्सीडेशन गति (फैट बर्निंग)',
    titleEn: 'Fat Oxidation Acceleration',
    descHi: 'हाई प्रोटीन नाश्ता और 14:10 या 16:8 फास्टिंग। शरीर स्टोर्ड विसरल फैट को ईंधन के रूप में जलाना शुरू करता है।',
    descEn: 'High-protein breakfast & intermittent fasting window. Body shifts to burning stored body fat for fuel.',
    color: 'teal',
  },
  {
    phase: 3,
    days: 'Day 29 - 45 (हफ़्ते 5-6)',
    titleHi: 'जिद्दी पेट और कमर की चर्बी पर वार',
    titleEn: 'Deep Visceral & Stubborn Fat Melting',
    descHi: '10,000 दैनिक कदम + भोजन के तुरंत बाद 10 मिनट की टहल। इंसुलिन स्पाइक्स को 40% तक कम करें।',
    descEn: '10,000 daily steps + 10-minute post-meal walks blunts glucose spikes by 40% and targets belly fat.',
    color: 'amber',
  },
  {
    phase: 4,
    days: 'Day 46 - 60 (हफ़्ते 7-8)',
    titleHi: 'लीन ट्रांसफॉर्मेशन और स्थायी परिणाम',
    titleEn: 'Chiseled Transformation & Lifelong Lock',
    descHi: 'नया मेटाबॉलिज्म लॉक हो चुका है। बिना जिम जाए आप हल्का, ऊर्जावान और फिट महसूस करेंगे जो सालों तक बना रहेगा।',
    descEn: 'Metabolic rate is permanently optimized. Locked-in fat loss habits without ever needing heavy gym machines.',
    color: 'sky',
  },
];

export function generate60DayRoadmap(): DayRoadmapItem[] {
  const items: DayRoadmapItem[] = [];

  for (let i = 1; i <= 60; i++) {
    let phase: 1 | 2 | 3 | 4 = 1;
    if (i > 45) phase = 4;
    else if (i > 28) phase = 3;
    else if (i > 14) phase = 2;

    const baseTasks = [
      { id: `d${i}-steps`, labelHi: '8,000 - 10,000 कदम (NEAT वॉक)', labelEn: '8,000 - 10,000 Daily Steps', target: 'Walk', completed: false },
      { id: `d${i}-deficit`, labelHi: 'कैलोरी डेफिसिट बनाए रखा (घर का सादा खाना)', labelEn: 'Caloric Deficit Kept (No Overeating)', target: 'Diet', completed: false },
      { id: `d${i}-protein`, labelHi: 'हर मुख्य भोजन में प्रोटीन (दाल/पनीर/अंडे/सोया)', labelEn: 'Protein in Every Main Meal', target: 'Protein', completed: false },
      { id: `d${i}-water`, labelHi: '3.5 लीटर पानी पूरा पिया', labelEn: '3.5 Liters Clean Water', target: 'Water', completed: false },
      { id: `d${i}-nosugar`, labelHi: 'कोई मीठा/सॉफ्ट ड्रिंक/तली हुई चीजें नहीं', labelEn: 'Zero Added Sugar & Fried Food', target: 'Clean', completed: false },
      { id: `d${i}-dinner`, labelHi: 'रात का खाना 8:00 PM से पहले पूरा किया', labelEn: 'Dinner finished before 8:00 PM', target: 'Timing', completed: false },
    ];

    let titleHi = `दिन ${i}: निरंतर प्रगति`;
    let titleEn = `Day ${i}: Steady Fat Burn`;
    let focusHi = 'दैनिक डेफिसिट और 8k कदम पूरा करें।';
    let focusEn = 'Maintain daily deficit and complete 8k steps.';
    let actionTipHi = 'खाने से 15 मिनट पहले 1 बड़ा कटोरा खीरा-टमाटर सलाद खाएं।';
    let actionTipEn = 'Eat 1 large bowl of raw salad before your main meal to curb overeating.';

    if (i === 1) {
      titleHi = 'दिन 1: नई शुरुआत और किचन ऑडिट';
      titleEn = 'Day 1: Kickoff & Kitchen Audit';
      focusHi = 'घर से बिस्कुट, नमकीन और मीठे पेय पदार्थों को दूर करें। 3.5 लीटर पानी की बोतल भरें।';
      focusEn = 'Remove biscuits, chips and sugary sodas. Fill a 3.5L water bottle.';
      actionTipHi = 'आज ही अपनी कमर का नाप और सुबह खाली पेट वजन नोट करें।';
      actionTipEn = 'Log your starting waist and morning weight today.';
    } else if (i === 7) {
      titleHi = 'दिन 7: प्रथम सप्ताह का रिजल्ट चेक';
      titleEn = 'Day 7: Week 1 Weigh-in Check';
      focusHi = 'वॉटर वेट और ब्लोटिंग कम हुई होगी। ऊर्जा का स्तर चेक करें।';
      focusEn = 'Notice reduced bloat and lighter stomach. Check progress.';
      actionTipHi = 'सप्ताह 1 पूरा करने पर खुद को शाबाशी दें। कोई चीट मील नहीं!';
      actionTipEn = 'Congratulate yourself on finishing Week 1. Avoid cheat meals.';
    } else if (i === 15) {
      titleHi = 'दिन 15: फेज 2 - फास्टिंग विंडो शुरुआत';
      titleEn = 'Day 15: Phase 2 - 14:10 Fasting Kickoff';
      focusHi = 'रात 8 बजे से सुबह 10 बजे तक केवल पानी/ग्रीन टी। 14 घंटे का प्राकृतिक उपवास।';
      focusEn = '8 PM to 10 AM fasting (water/green tea only). Natural 14-hr fat burn.';
      actionTipHi = 'सुबह खाली पेट 20 मिनट की तेज चाल से चर्बी तेजी से पिघलती है।';
      actionTipEn = 'A 20-min morning walk on an empty stomach triggers rapid fat oxidation.';
    } else if (i === 30) {
      titleHi = 'दिन 30: 1 महीना पूरा! 50% लक्ष्य हासिल';
      titleEn = 'Day 30: Halfway Mark! 1 Month Milestone';
      focusHi = 'कपड़े ढीले लगने लगे होंगे। चेहरे और पेट का फैट साफ तौर पर कम दिखता है।';
      focusEn = 'Clothes feel noticeably looser. Visible fat reduction in face and waist.';
      actionTipHi = 'आज कमर और वजन का दोबारा माप लें।';
      actionTipEn = 'Measure waist and morning weight today to celebrate progress.';
    } else if (i === 60) {
      titleHi = 'दिन 60: महा-परिवर्तन पूर्ण! नई लीन बॉडी';
      titleEn = 'Day 60: Transformation Complete!';
      focusHi = 'बधाई हो! आपने बिना जिम के डाइट और कदमों के दम पर खुद को बदल दिया।';
      focusEn = 'Congratulations! You reshaped your body without gym purely via nutrition & steps.';
      actionTipHi = 'अब इन स्वस्थ आदतों को अपनी जीवनशैली बना लें!';
      actionTipEn = 'Lock in these habits as your permanent healthy lifestyle!';
    }

    items.push({
      day: i,
      phase,
      titleHi,
      titleEn,
      focusHi,
      focusEn,
      actionTipHi,
      actionTipEn,
      tasks: baseTasks,
    });
  }

  return items;
}

export const mealPlans: MealPlanCategory[] = [
  {
    id: 'vegetarian',
    nameHi: 'शुद्ध शाकाहारी फैट-लॉस डाइट (Indian Veg)',
    nameEn: 'Indian Vegetarian Fat-Loss Plan',
    totalCalories: 1480,
    totalProteinG: 78,
    descriptionHi: 'दाल, कम फैट पनीर, अंकुरित मूंग, बेसन चीला और हरी सब्जियों से भरपूर संतुलित शाकाहारी भोजन।',
    descriptionEn: 'High-fiber, high-protein plant-powered plan featuring paneer, sprouts, besan chilla, and dal.',
    meals: [
      {
        mealTime: 'Early Morning',
        timeRange: '7:00 AM - 7:30 AM',
        dishNameHi: 'गुनगुना जीरा-नींबू पानी + 4 भीगे बादाम',
        dishNameEn: 'Warm Cumin Lemon Water + 4 Soaked Almonds',
        ingredientsHi: '1 बड़ा गिलास गुनगुना पानी, 1/2 नींबू का रस, 1/2 चम्मच भुना जीरा पाउडर, 4 भीगे बादाम (छिले हुए)।',
        ingredientsEn: 'Warm water with half a lemon, roasted cumin, and 4 peeled soaked almonds.',
        portion: '1 बड़ा गिलास + 4 बादाम',
        calories: 45,
        proteinG: 1.5,
        fatLossReasonHi: 'पाचन तंत्र को एक्टिवेट करता है और सुबह का मेटाबॉलिक रेट 10% बढ़ाता है।',
        fatLossReasonEn: 'Activates digestion and boosts morning metabolic rate.',
      },
      {
        mealTime: 'Breakfast',
        timeRange: '8:30 AM - 9:00 AM',
        dishNameHi: '2 बेसन-सब्जी चीला + पुदीना चटनी + हरी चाय',
        dishNameEn: '2 Veggie Besan Chilla + Mint Chutney + Green Tea',
        ingredientsHi: 'बेसन 60g, बारीक कटा प्याज, टमाटर, पालक, शिमला मिर्च, 1 चम्मच तेल/घी, हरी मिर्च, पुदीना-धनिया चटनी।',
        ingredientsEn: 'Gram flour (60g), chopped spinach, tomato, onion, herbs, 1 tsp oil/ghee, mint chutney.',
        portion: '2 मध्यम चीले',
        calories: 310,
        proteinG: 16,
        fatLossReasonHi: 'बेसन में हाई फाइबर और कॉम्प्लेक्स कार्ब्स होते हैं, जो 4 घंटे तक भूख नहीं लगने देते।',
        fatLossReasonEn: 'High fiber and low glycemic index keeps blood sugar steady and curbs cravings.',
      },
      {
        mealTime: 'Mid-Morning',
        timeRange: '11:00 AM - 11:30 AM',
        dishNameHi: 'अंकुरित मूंग चाट (ककड़ी और नींबू के साथ)',
        dishNameEn: 'Sprouted Moong Chaat with Cucumber & Lemon',
        ingredientsHi: 'उबला/कच्चा अंकुरित मूंग 70g, कटा खीरा, टमाटर, चाट मसाला, सेंधा नमक, नींबू का रस।',
        ingredientsEn: 'Sprouted green moong (70g), cucumber, tomato, chaat masala, rock salt, lemon.',
        portion: '1 छोटी कटोरी',
        calories: 120,
        proteinG: 9,
        fatLossReasonHi: 'जीरो ऑयल, शून्य अतिरिक्त वसा और शुद्ध प्राकृतिक प्रोटीन व एंजाइम।',
        fatLossReasonEn: 'Zero oil snack packed with bioavailable plant protein and digestive enzymes.',
      },
      {
        mealTime: 'Lunch',
        timeRange: '1:30 PM - 2:00 PM',
        dishNameHi: 'बड़ा सलाद बाउल + 100g लो-फैट पनीर भुर्जी + 1 मल्टीग्रेन रोटी + 1 कटोरी दाल',
        dishNameEn: 'Large Salad Bowl + 100g Low-Fat Paneer Bhurji + 1 Multigrain Roti + 1 Bowl Dal',
        ingredientsHi: 'सलाद (खीरा, ककड़ी, चुकंदर, गाजर), लो-फैट गाय का पनीर 100g (हल्दी-जीरा में भुना), अरहर या मूंग दाल 1 कटोरी, 1 पतली रोटी बिना घी।',
        ingredientsEn: 'Raw salad bowl first, 100g cow paneer lightly sauteed, 1 katori moong/arhar dal, 1 whole wheat roti.',
        portion: 'भरा हुआ भोजन',
        calories: 520,
        proteinG: 32,
        fatLossReasonHi: 'सलाद पहले खाने से ग्लूकोज स्पाइक 40% कम होता है और पनीर से भरपूर प्रोटीन मिलता है।',
        fatLossReasonEn: 'Eating salad first cuts glucose spike; paneer delivers sustained amino acids for muscles.',
      },
      {
        mealTime: 'Evening Snack',
        timeRange: '5:00 PM - 5:30 PM',
        dishNameHi: 'भुने मखाने (हल्के नमक-काली मिर्च में) + ब्लैक कॉफी या मसाला चाय (बिना चीनी)',
        dishNameEn: 'Roasted Foxnuts (Makhana) + Black Coffee or Sugar-Free Tea',
        ingredientsHi: 'मखाना 30g, 1/4 चम्मच ऑलिव ऑयल या ड्राई रोस्ट, चुटकी भर सेंधा नमक और काली मिर्च।',
        ingredientsEn: '30g dry roasted foxnuts with black pepper, pinch of pink salt, unsweetened tea/coffee.',
        portion: '1 मीडियम बाउल (30g)',
        calories: 115,
        proteinG: 3.5,
        fatLossReasonHi: 'शाम के समोसे और बिस्कुट की तलब को खत्म करता है। बहुत कम कैलोरी में पेट भरता है।',
        fatLossReasonEn: 'Crushes evening craving without the 300-calorie hit of fried biscuits or samosas.',
      },
      {
        mealTime: 'Dinner',
        timeRange: '7:30 PM - 8:00 PM',
        dishNameHi: 'लौकी/पालक का गरमा-गरम सूप + 1 कटोरी सोया चंक्स करी या उबली सब्जियां',
        dishNameEn: 'Warm Bottle Gourd/Spinach Soup + Soya Chunks Curry Bowl',
        ingredientsHi: 'लौकी/टमाटर/पालक का सूप (बिना क्रीम/कॉर्नफ्लोर), सोया चंक्स 35g (उबाले हुए), टमाटर-अदरक प्यूरी में पके हुए।',
        ingredientsEn: 'Fresh bottle gourd & tomato soup, 35g boiled soya chunks in light ginger-tomato gravy.',
        portion: '1 सूप बाउल + 1 कटोरी सोया सब्जी',
        calories: 270,
        proteinG: 22,
        fatLossReasonHi: 'रात में शून्य कार्ब्स और हाई प्रोटीन से सोते समय बॉडी रात भर फैट बर्न करती है।',
        fatLossReasonEn: 'Low carb and light digestion before bedtime maximizes nocturnal growth hormone and fat oxidation.',
      },
    ],
  },
  {
    id: 'eggetarian',
    nameHi: 'एगेटेरियन फैट-लॉस डाइट (Indian Eggetarian)',
    nameEn: 'Indian Eggetarian Fat-Burner',
    totalCalories: 1510,
    totalProteinG: 88,
    descriptionHi: 'अंडे, दाल, ओट्स और ताजी सब्जियों का पावर-पैक कॉम्बिनेशन जो बिना जिम के फैट कम करता है।',
    descriptionEn: 'High-satiety egg & lentil plan designed for maximum thermic effect of food and steady fat reduction.',
    meals: [
      {
        mealTime: 'Early Morning',
        timeRange: '7:00 AM',
        dishNameHi: 'मेथी दाना पानी या एप्पल साइडर विनेगर पानी',
        dishNameEn: 'Fenugreek Seed Water or ACV Lemon Water',
        ingredientsHi: 'रात भर भीगे 1 चम्मच मेथी दाना का पानी या 1 चम्मच ACV गुनगुने पानी में।',
        ingredientsEn: 'Overnight soaked fenugreek seed water or 1 tsp apple cider vinegar in warm water.',
        portion: '1 गिलास',
        calories: 15,
        proteinG: 0.5,
        fatLossReasonHi: 'इंसुलिन संवेदनशीलता में सुधार करता है जिससे फैट स्टोरेज रुकता है।',
        fatLossReasonEn: 'Improves insulin sensitivity and blunts morning cortisol spikes.',
      },
      {
        mealTime: 'Breakfast',
        timeRange: '8:30 AM',
        dishNameHi: '2 पूरे अंडे + 2 एग वाइट भुर्जी/ऑमलेट + बहुत सारी सब्जियां + 1 स्लाइस मल्टीग्रेन ब्रेड',
        dishNameEn: '2 Whole Eggs + 2 Egg Whites Veggie Scramble + 1 Multigrain Toast',
        ingredientsHi: '2 साबुत अंडे, 2 अंडों की सफेदी, शिमला मिर्च, प्याज, टमाटर, हरी मिर्च, 1 चम्मच जैतून तेल।',
        ingredientsEn: '2 whole eggs, 2 egg whites, diced veggies, 1 tsp olive oil, 1 multigrain toast.',
        portion: 'बड़ा नाश्ता',
        calories: 340,
        proteinG: 24,
        fatLossReasonHi: 'अंडों का थर्मिक इफ़ेक्ट (TEF) सबसे ज्यादा होता है। शरीर इन्हें पचाने में ही 25% कैलोरी खर्च कर देता है।',
        fatLossReasonEn: 'Eggs have a 25-30% thermic effect, meaning your body burns calories just digesting them.',
      },
      {
        mealTime: 'Mid-Morning',
        timeRange: '11:00 AM',
        dishNameHi: '1 सेब (दालचीनी पाउडर छिड़का हुआ) या 1 संतरा',
        dishNameEn: '1 Apple with Cinnamon Dusting or 1 Fresh Orange',
        ingredientsHi: 'ताजा सेब 150g, ऊपर से 1 चुटकी दालचीनी पाउडर।',
        ingredientsEn: 'Medium apple with a sprinkle of Ceylon cinnamon powder.',
        portion: '1 फल',
        calories: 85,
        proteinG: 0.5,
        fatLossReasonHi: 'दालचीनी ब्लड शुगर स्पाइक को रोकती है और फाइबर पेट को भरा रखता है।',
        fatLossReasonEn: 'Cinnamon regulates blood glucose while pectin fiber curbs appetite.',
      },
      {
        mealTime: 'Lunch',
        timeRange: '1:30 PM',
        dishNameHi: 'खीरा-टमाटर सलाद + 1 कटोरी गाढ़ी पीली दाल + 1 कटोरी मिक्स वेज + 1 रोटी',
        dishNameEn: 'Cucumber Salad + 1 Cup Thick Yellow Dal + 1 Cup Mix Veg + 1 Roti',
        ingredientsHi: 'सलाद प्लेट, मूंग या चना दाल 150g, गोभी-मटर-गाजर की हल्की सब्जी, 1 गेहूं की पतली रोटी।',
        ingredientsEn: 'Generous raw salad plate, 150g cooked dal, dry vegetable curry, 1 dry roti.',
        portion: 'संतुलित थाली',
        calories: 490,
        proteinG: 21,
        fatLossReasonHi: 'कार्ब्स सीमित (केवल 1 रोटी) और दाल से भरपूर न्यूट्रिशन। दोपहर की सुस्ती नहीं आती।',
        fatLossReasonEn: 'Restricts fast-digesting carbs to 1 roti and provides clean steady energy.',
      },
      {
        mealTime: 'Evening Snack',
        timeRange: '5:00 PM',
        dishNameHi: 'भुने हुए चने (50g) + मसाला ग्रीन टी',
        dishNameEn: 'Roasted Black Chana (50g) + Spiced Green Tea',
        ingredientsHi: 'छिलके वाले भुने काले चने 50g, 1 कप लेमन ग्रीन टी।',
        ingredientsEn: '50g roasted unpeeled black chickpeas with 1 cup warm lemon green tea.',
        portion: '1 मुट्ठी',
        calories: 180,
        proteinG: 9,
        fatLossReasonHi: 'काले चने में रेसिस्टेंट स्टार्च होता है जो आंतों के फैट-बर्निंग बैक्टीरिया को बढ़ाता है।',
        fatLossReasonEn: 'Resistant starch in roasted chana feeds beneficial gut bacteria that speed fat burning.',
      },
      {
        mealTime: 'Dinner',
        timeRange: '7:30 PM',
        dishNameHi: '3 उबले अंडे (केवल सफेदी) + 100g भुना पनीर टिक्का + सूप',
        dishNameEn: '3 Boiled Egg Whites + 100g Grilled Paneer Tikka + Clear Soup',
        ingredientsHi: '3 अंडों की सफेदी, पनीर 100g दही-मसाले में मैरीनेट करके तवे पर सेका हुआ, टमाटर-धनिया सूप।',
        ingredientsEn: '3 boiled egg whites, 100g pan-grilled paneer tikka cubes, warm vegetable broth.',
        portion: '1 प्लेट टिक्का व सूप',
        calories: 320,
        proteinG: 33,
        fatLossReasonHi: 'रात में शून्य रोटी/चावल और 33 ग्राम शुद्ध प्रोटीन मांसपेशियों को सुरक्षित रखता है और फैट गिराता है।',
        fatLossReasonEn: 'Zero grain dinner prevents midnight insulin spikes while protecting lean tissue.',
      },
    ],
  },
  {
    id: 'non_veg',
    nameHi: 'नॉन-वेज लीन प्रोटीन फैट-लॉस डाइट (Non-Veg)',
    nameEn: 'Lean Protein Non-Veg Fat Loss',
    totalCalories: 1540,
    totalProteinG: 105,
    descriptionHi: 'चिकन ब्रेस्ट, मछली, अंडे और प्रचुर सब्जियों का वैज्ञानिक कॉम्बिनेशन जो फैट को तेजी से जलाता है।',
    descriptionEn: 'High-protein diet utilizing lean chicken breast, fish, eggs, and antioxidant-rich veggies.',
    meals: [
      {
        mealTime: 'Early Morning',
        timeRange: '7:00 AM',
        dishNameHi: 'गुनगुना नींबू पानी + 3 अखरोट गिरी',
        dishNameEn: 'Warm Lemon Water + 3 Walnut Halves',
        ingredientsHi: '1 बड़ा गिलास पानी, नींबू, 3 अखरोट (ओमेगा-3 फैटी एसिड)।',
        ingredientsEn: '1 glass warm lemon water with 3 walnut halves for healthy omega-3 fats.',
        portion: '1 गिलास + 3 अखरोट',
        calories: 80,
        proteinG: 2,
        fatLossReasonHi: 'ओमेगा-3 फैट्स शरीर में सूजन (inflammation) को कम करते हैं जिससे फैट जल्दी बर्न होता है।',
        fatLossReasonEn: 'Omega-3 fatty acids lower systemic inflammation and support hormonal balance.',
      },
      {
        mealTime: 'Breakfast',
        timeRange: '8:30 AM',
        dishNameHi: '3 अंडों का ऑमलेट (सब्जियों वाला) + 1 कटोरी ओट्स उपमा',
        dishNameEn: '3-Egg Veggie Omelet + Small Bowl Savory Oats Upma',
        ingredientsHi: '1 पूरा अंडा + 2 अंडे की सफेदी, टमाटर, शिमला मिर्च, प्याज, 30g ओट्स उपमा सब्जियों के साथ।',
        ingredientsEn: '1 whole egg + 2 whites, diced veggies, 30g oats upma with green peas and carrots.',
        portion: 'नाश्ता प्लेट',
        calories: 360,
        proteinG: 22,
        fatLossReasonHi: 'ओट्स का बीटा-ग्लूकन फाइबर और अंडों का प्रोटीन भूख को 5 घंटे तक शांत रखता है।',
        fatLossReasonEn: 'Beta-glucan soluble fiber from oats + egg albumin triggers leptin (satiety hormone).',
      },
      {
        mealTime: 'Mid-Morning',
        timeRange: '11:00 AM',
        dishNameHi: 'ताजा छाछ (मट्ठा) भुने जीरे और पुदीने के साथ',
        dishNameEn: 'Fresh Spiced Buttermilk (Chaas) with Mint & Jeera',
        ingredientsHi: 'कम फैट दही 100g मथकर, पानी, भुना जीरा, काला नमक, पुदीना पत्ती।',
        ingredientsEn: '100g low-fat curd churned with water, roasted jeera, mint, and black salt.',
        portion: '1 बड़ा गिलास (250ml)',
        calories: 65,
        proteinG: 4,
        fatLossReasonHi: 'प्रोबायोटिक्स पेट की सूजन घटाते हैं और वाटर रिटेंशन को रोकते हैं।',
        fatLossReasonEn: 'Probiotics optimize gut biome for enhanced fatty-acid breakdown.',
      },
      {
        mealTime: 'Lunch',
        timeRange: '1:30 PM',
        dishNameHi: 'बड़ा सलाद + 150g ग्रिल्ड/हल्का तवा चिकन ब्रेस्ट + 1 कटोरी दाल + 1 रोटी',
        dishNameEn: 'Big Salad + 150g Grilled Herb Chicken Breast + 1 Cup Dal + 1 Roti',
        ingredientsHi: 'सलाद प्लेट, 150g चिकन ब्रेस्ट (दही-अदरक-लहसुन-हल्दी में पका), 1 कटोरी मूंग दाल, 1 गेहूं रोटी।',
        ingredientsEn: 'Raw salad plate first, 150g skinless chicken breast marinated in yogurt/herbs, 1 bowl dal, 1 roti.',
        portion: 'फुल मील थाली',
        calories: 510,
        proteinG: 46,
        fatLossReasonHi: '46 ग्राम लीन प्रोटीन! मसल्स बिना जिम के टोंड रहती हैं और फैट लगातार पिघलता है।',
        fatLossReasonEn: '46g lean protein protects metabolic rate and burns extra calories through digestion.',
      },
      {
        mealTime: 'Evening Snack',
        timeRange: '5:00 PM',
        dishNameHi: '2 उबले अंडे की सफेदी (चाट मसाला के साथ) + ब्लैक कॉफी',
        dishNameEn: '2 Hard-Boiled Egg Whites + Black Coffee',
        ingredientsHi: '2 उबले अंडे (जर्दी हटाकर), चुटकी भर चाट मसाला, गर्म बिना चीनी वाली ब्लैक कॉफी।',
        ingredientsEn: '2 boiled egg whites with black pepper, fresh hot black coffee.',
        portion: '2 एग वाइट',
        calories: 40,
        proteinG: 8,
        fatLossReasonHi: 'ब्लैक कॉफी का कैफीन फैट मोबिलाइजेशन को तेज करता है और कैलोरी लगभग शून्य है।',
        fatLossReasonEn: 'Caffeine stimulates lipolysis (fat cell breakdown) with virtually zero calories.',
      },
      {
        mealTime: 'Dinner',
        timeRange: '7:30 PM',
        dishNameHi: '150g तवा ग्रिल्ड फिश या लेमन पेपर चिकन + सूप व उबली सब्जियां',
        dishNameEn: '150g Pan-Seared Fish / Lemon Pepper Chicken + Steamed Broccoli & Carrot',
        ingredientsHi: '150g फिश या चिकन ब्रेस्ट, 1 चम्मच तेल, नींबू, काली मिर्च, उबली फूलगोभी, शिमला मिर्च, ब्रोकली।',
        ingredientsEn: '150g white fish or chicken seasoned with lemon and pepper, paired with steamed veggies.',
        portion: '1 प्लेट',
        calories: 310,
        proteinG: 38,
        fatLossReasonHi: 'कार्बोहाइड्रेट शून्य होने से रात को सोते वक्त इंसुलिन सबसे नीचे रहता है और फैट बर्न उच्चतम होता है।',
        fatLossReasonEn: 'Virtually zero carbs at night drives overnight fat oxidation during deep sleep.',
      },
    ],
  },
  {
    id: 'jain',
    nameHi: 'जैन / सात्विक फैट-लॉस डाइट (No Onion, No Garlic)',
    nameEn: 'Jain Satvik Fat Loss (No Onion, No Garlic)',
    totalCalories: 1450,
    totalProteinG: 72,
    descriptionHi: 'बिना प्याज-लहसुन और जमीनकंद के शुद्ध, सात्विक व हाई-प्रोटीन फैट-बर्निंग आहार।',
    descriptionEn: 'Pure Satvik, root-free nutrition with moong, low-fat paneer, buttermilk, and wholesome grains.',
    meals: [
      {
        mealTime: 'Early Morning',
        timeRange: 'सूरज निकलने के बाद (7:30 AM)',
        dishNameHi: 'गुनगुना सौंफ-अजवाइन पानी + 4 भीगे बादाम',
        dishNameEn: 'Warm Fennel-Carom Water + 4 Soaked Almonds',
        ingredientsHi: 'सौंफ और अजवाइन का उबला पानी (छाना हुआ), 4 भीगे छिले बादाम।',
        ingredientsEn: 'Warm boiled fennel & carom seed infused water with 4 peeled almonds.',
        portion: '1 बड़ा गिलास',
        calories: 45,
        proteinG: 1.5,
        fatLossReasonHi: 'अजवाइन और सौंफ पेट की गैस, एसिडिटी और ब्लोटिंग को तुरंत ठीक करते हैं।',
        fatLossReasonEn: 'Fennel and ajwain eliminate abdominal bloating and soothe digestive tract.',
      },
      {
        mealTime: 'Breakfast',
        timeRange: '8:45 AM',
        dishNameHi: 'मूंग दाल का चीला (पनीर की स्टफिंग के साथ) + हरी धनिया चटनी',
        dishNameEn: 'Moong Dal Chilla with Grated Paneer Stuffing + Fresh Coriander Chutney',
        ingredientsHi: 'पिली मूंग दाल 50g, 40g कद्दूकस किया हुआ गाय का पनीर, हरी मिर्च, जीरा, धनिया चटनी।',
        ingredientsEn: 'Yellow moong dal batter, stuffed with 40g light cow paneer, fresh coriander chutney.',
        portion: '2 चीले',
        calories: 320,
        proteinG: 19,
        fatLossReasonHi: 'मूंग दाल और पनीर का मेल सम्पूर्ण अमीनो एसिड प्रोफाइल देता है जिससे भूख नहीं सताती।',
        fatLossReasonEn: 'Moong dal and paneer combine to form complete proteins for sustained energy.',
      },
      {
        mealTime: 'Mid-Morning',
        timeRange: '11:15 AM',
        dishNameHi: 'ताजा नारियल पानी या भुना हुआ जीरा छाछ',
        dishNameEn: 'Fresh Tender Coconut Water or Jeera Buttermilk',
        ingredientsHi: 'ताजा नारियल पानी 200ml (बिना मलाई के) या पतली छाछ।',
        ingredientsEn: 'Fresh tender coconut water (water only) or light buttermilk with roasted cumin.',
        portion: '1 गिलास',
        calories: 50,
        proteinG: 1,
        fatLossReasonHi: 'पोटेशियम और इलेक्ट्रोलाइट्स से भरपूर, जो शरीर से अतिरिक्त नमक व पानी बाहर निकालते हैं।',
        fatLossReasonEn: 'High potassium flushes excess sodium and sheds stubborn subcutaneous water.',
      },
      {
        mealTime: 'Lunch',
        timeRange: '1:15 PM',
        dishNameHi: 'ककड़ी-टमाटर सलाद + तुअर/मूंग दाल + 100g पनीर सब्जी (टमाटर प्यूरी में) + 1 रोटी',
        dishNameEn: 'Cucumber Salad + Moong Dal + 100g Paneer in Tomato Gravy + 1 Roti',
        ingredientsHi: 'ककड़ी व टमाटर का सलाद, 1 कटोरी मूंग दाल, 100g पनीर टमाटर व जीरा-धनिया ग्रेवी में, 1 पतली रोटी।',
        ingredientsEn: 'Kakdi-tomato salad, 1 cup moong dal, 100g paneer in fresh tomato-coriander gravy, 1 dry roti.',
        portion: 'पूर्ण थाली',
        calories: 520,
        proteinG: 28,
        fatLossReasonHi: 'सात्विक पाचन के साथ 28 ग्राम प्रोटीन, जिससे बिना भारीपन के पेट संतुष्ट रहता है।',
        fatLossReasonEn: 'Light on gut yet packs 28g clean protein to maintain steady calorie deficit.',
      },
      {
        mealTime: 'Evening Snack',
        timeRange: '4:45 PM',
        dishNameHi: 'भुना हुआ चना और मखाना मिक्स + हर्बल तुलसी चाय',
        dishNameEn: 'Roasted Chana & Makhana Trail Mix + Herbal Tulsi Tea',
        ingredientsHi: 'भुना चना 25g, मखाना 20g, हल्का सेंधा नमक, गर्म तुलसी चाय।',
        ingredientsEn: '25g roasted chana, 20g makhana lightly tossed in a dry pan, organic tulsi tea.',
        portion: '1 छोटा कटोरा',
        calories: 140,
        proteinG: 6,
        fatLossReasonHi: 'फाइबर की उच्च मात्रा शाम की अस्वस्थ भूख को पूरी तरह समाप्त कर देती है।',
        fatLossReasonEn: 'Crunchy high-fiber snack that satisfies tactile snacking urges.',
      },
      {
        mealTime: 'Dinner (सूरज ढलने से पूर्व)',
        timeRange: '6:45 PM - 7:15 PM (चौविहार/सूर्यास्त से पहले)',
        dishNameHi: 'लौकी-मूंग दाल का सूप + भुना हुआ पनीर या टोफू टिक्का',
        dishNameEn: 'Bottle Gourd & Moong Dal Light Soup + Pan-Grilled Paneer/Tofu Cubes',
        ingredientsHi: 'लौकी व पीली मूंग दाल का पतला सूप, 80g पनीर या टोफू तवे पर जीरा-काली मिर्च में सेका हुआ।',
        ingredientsEn: 'Pureed bottle gourd & moong soup with 80g lightly toasted paneer or tofu.',
        portion: '1 बड़ा कटोरा',
        calories: 260,
        proteinG: 18,
        fatLossReasonHi: 'सूर्यास्त पूर्व हल्का भोजन पाचन को रात में 100% आराम देता है, जिससे फैट बर्निंग चरम पर होती है।',
        fatLossReasonEn: 'Early pre-sunset dinner allows 14+ hours of overnight metabolic rest and peak fat mobilization.',
      },
    ],
  },
];

export const goldenDietRules = [
  {
    number: '01',
    titleHi: 'सलाद प्लेट पहले खाएं (फूड सीक्वेंसिंग)',
    titleEn: 'Eat the Salad Plate First',
    descHi: 'रोटी या चावल छूने से 10 मिनट पहले 1 बड़ा कटोरा खीरा, ककड़ी, टमाटर खाएं। फाइबर आपके आंतों में एक सुरक्षात्मक परत बना देता है जिससे ग्लूकोज स्पाइक 40% तक घट जाता है और आप ज्यादा रोटी नहीं खा पाते।',
    descEn: 'Consume a large bowl of raw salad before touching roti or rice. Fiber creates a viscous mesh in your gut that blunts post-meal glucose spikes by up to 40% and naturally induces early satiety.',
    badge: 'ग्लूकोज कंट्रोल',
  },
  {
    number: '02',
    titleHi: 'पीने वाली कैलोरी (Liquid Calories) को शून्य करें',
    titleEn: 'Eliminate Liquid Calories Entirely',
    descHi: 'चाय में 2-3 चम्मच चीनी, कोल्ड ड्रिंक, फ्रूट जूस और पैक्ड लस्सी सबसे बड़े फैट के कारण हैं। इन्हें बंद करके सादा पानी, नींबू पानी, जीरा पानी, छाछ या बिना चीनी की ग्रीन टी पिएं। रोजाना 300-400 कैलोरी सीधे बचेंगी।',
    descEn: 'Sugary teas (2-3 spoons sugar), sodas, canned juices and sweet lassis deliver concentrated fructose that goes straight to liver and visceral fat. Switch to water, lime water, chaas, or green tea.',
    badge: '300 kcal बचत',
  },
  {
    number: '03',
    titleHi: 'भोजन के तुरंत बाद 10-15 मिनट की टहल (100 कदम नियम)',
    titleEn: 'The 10-Minute Post-Meal Stroll',
    descHi: 'जिम जाने की जरूरत नहीं है! लंच और डिनर के ठीक बाद सोफे पर लेटने के बजाय सिर्फ 10 मिनट घर में या छत पर सामान्य गति से चलें। यह मांसपेशियों द्वारा सीधे ब्लड शुगर को खींच लेता है और चर्बी जमने नहीं देता।',
    descEn: 'No gym needed! Instead of crashing on the couch after eating, take an easy 10-15 minute walk. Active skeletal muscle absorbs glucose from circulation without requiring excess insulin surges.',
    badge: 'फैट स्टोरेज रोकें',
  },
  {
    number: '04',
    titleHi: 'हर भोजन में 20-30 ग्राम प्रोटीन अनिवार्य',
    titleEn: 'Anchor Every Meal with 20-30g Protein',
    descHi: 'कार्ब्स (रोटी/चावल) अकेले खाने से 2 घंटे में दोबारा भूख लगती है। दाल, पनीर, सोया, अंडे, या चिकन साथ में जोड़ें। प्रोटीन का थर्मिक प्रभाव सबसे ऊंचा होता है—100 कैलोरी पचाने में 25-30 कैलोरी शरीर खुद जलाता है।',
    descEn: 'High carb meals digest quickly, leaving you hungry in 2 hours. Anchoring every meal with paneer, dal, soya, or eggs triggers peptide YY and burns 25% of its calories simply in digestion (TEF).',
    badge: 'मेटाबॉलिज्म बूस्ट',
  },
  {
    number: '05',
    titleHi: 'रात 8:00 बजे के बाद किचन बंद (अर्ली डिनर)',
    titleEn: 'Kitchen Curfew by 8:00 PM',
    descHi: 'देर रात 10-11 बजे खाने से शरीर नींद में फैट बर्न करने के बजाय भोजन पचाने में लगा रहता है। रात 7:30 से 8:00 बजे के बीच हल्का भोजन पूरा करें ताकि अगली सुबह तक 12-14 घंटे का प्राकृतिक उपवास हो सके।',
    descEn: 'Late-night eating sabotages nighttime fat burning and impairs sleep quality. Completing a light dinner by 7:30-8:00 PM unlocks a clean 12-14 hour overnight fasting window for visceral fat oxidation.',
    badge: 'हॉर्मोनल रीसेट',
  },
  {
    number: '06',
    titleHi: '80% पेट भरने पर खाना रोकें (हारा हाची बू नियम)',
    titleEn: 'Stop at 80% Fullness (Hara Hachi Bu)',
    descHi: 'दिमाग तक "पेट भर गया" का सिग्नल पहुंचने में 20 मिनट लगते हैं। जब लगे कि अब थोड़ी और जगह बाकी है, तभी हाथ रोक लें। खाना धीरे-धीरे 20-25 बार चबाकर खाएं। इससे पेट कभी फूला हुआ महसूस नहीं होगा।',
    descEn: 'The brain lags by 15-20 minutes in registering satiety signals from the stomach. Practice stopping when you are comfortably 80% full. Chew each bite 20+ times for effortless portion management.',
    badge: 'अति-आहार नियंत्रण',
  },
  {
    number: '07',
    titleHi: '7.5 घंटे की गहरी नींद और 3.5 लीटर पानी',
    titleEn: '7.5 Hours Restful Sleep & 3.5L Water',
    descHi: 'जब आप कम सोते हैं, तो शरीर में "घ्रेलिन" (भूख बढ़ाने वाला हॉर्मोन) 20% बढ़ जाता है और "लेप्टिन" गिर जाता है, जिससे मीठा खाने का मन करता है। अच्छी नींद और पानी फैट लॉस के 50% हिस्सेदार हैं।',
    descEn: 'Sleep deprivation spikes ghrelin (hunger hormone) and cortisol while tanking leptin. Adequate hydration and 7.5 hours of consistent sleep prevent phantom cravings and water retention.',
    badge: 'रिकवरी व क्रेविंग कंट्रोल',
  },
];

export const smartSwaps: SmartSwap[] = [
  {
    id: 's1',
    highCalorieFoodHi: 'समोसा (1 बड़ा)',
    highCalorieFoodEn: 'Fried Samosa (1 pc)',
    highCalorieVal: 280,
    smartAlternativeHi: 'रोस्टेड मखाना या भुने चने (1 कटोरी)',
    smartAlternativeEn: 'Roasted Makhana or Chana (1 bowl)',
    smartCalorieVal: 110,
    caloriesSaved: 170,
    whyItWorksHi: 'तले हुए मैदे और ट्रांस-फैट से मुक्ति। मखाने में कैल्शियम और फाइबर प्रचुर होता है।',
    whyItWorksEn: 'Avoids oxidized vegetable oil and refined flour; rich in protein and magnesium.',
  },
  {
    id: 's2',
    highCalorieFoodHi: 'दिनभर में 3 कप मीठी दूध वाली चाय',
    highCalorieFoodEn: '3 Cups Sugary Milk Tea',
    highCalorieVal: 240,
    smartAlternativeHi: 'इलायची लेमन ग्रीन टी या 1 छोटा कप बिना चीनी की चाय',
    smartAlternativeEn: 'Lemon Green Tea or Unsweetened Tea',
    smartCalorieVal: 30,
    caloriesSaved: 210,
    whyItWorksHi: 'केवल चाय से चीनी हटाने पर महीने में 6,300 कैलोरी (लगभग 1 किलो शुद्ध चर्बी) बचती है!',
    whyItWorksEn: 'Cutting liquid sugar from daily tea saves over 6,000 calories a month—nearly 1 kg pure fat!',
  },
  {
    id: 's3',
    highCalorieFoodHi: 'आलू पराठा मक्खन के साथ (2 पराठे)',
    highCalorieFoodEn: '2 Aloo Parathas with Butter',
    highCalorieVal: 580,
    smartAlternativeHi: '2 बेसन-पालक-पनीर चीला पुदीना चटनी के साथ',
    smartAlternativeEn: '2 Besan-Paneer-Spinach Chillas',
    smartCalorieVal: 290,
    caloriesSaved: 290,
    whyItWorksHi: 'कार्ब्स आधा और प्रोटीन 3 गुना ज्यादा! पेट 4 घंटे तक भरा रहेगा और फैट नहीं जमेगा।',
    whyItWorksEn: 'Halves fast starch while tripling protein density to prevent mid-day slumps.',
  },
  {
    id: 's4',
    highCalorieFoodHi: 'सफेद चावल (2 बड़ी कटोरी)',
    highCalorieFoodEn: '2 Large Bowls White Rice',
    highCalorieVal: 420,
    smartAlternativeHi: '1 कटोरी स्टीम्ड राइस + 2 कटोरी गाढ़ी दाल व खीरा सलाद',
    smartAlternativeEn: '1/2 Portion Rice + Extra Dal & Salad',
    smartCalorieVal: 220,
    caloriesSaved: 200,
    whyItWorksHi: 'चावल को पूरी तरह छोड़ने की जरूरत नहीं है, बस उसकी मात्रा आधी करके दाल और सलाद बढ़ाएं।',
    whyItWorksEn: 'No need to ban rice—simply half the portion and double the dal and cucumber volume.',
  },
  {
    id: 's5',
    highCalorieFoodHi: 'गुलाब जामुन या रसगुल्ला (2 पीस)',
    highCalorieFoodEn: '2 Gulab Jamuns / Indian Sweets',
    highCalorieVal: 380,
    smartAlternativeHi: 'दही में दालचीनी व 1 खजूर या सेब के टुकड़े',
    smartAlternativeEn: 'Greek Yogurt with Cinnamon & 1 Date',
    smartCalorieVal: 110,
    caloriesSaved: 270,
    whyItWorksHi: 'चीनी और चाशनी के जहर से बचाव। खजूर से प्राकृतिक मिठास और दही से प्रोटीन व कैल्शियम।',
    whyItWorksEn: 'Satisfies sweet tooth with raw fiber and probiotic protein without insulin rollercoasters.',
  },
  {
    id: 's6',
    highCalorieFoodHi: 'कोल्ड ड्रिंक / पैक्ड मैंगो जूस (500ml)',
    highCalorieFoodEn: 'Cold Drink / Packaged Juice (500ml)',
    highCalorieVal: 230,
    smartAlternativeHi: 'ठंडी जीरा छाछ या पुदीना-नींबू सोडा (बिना चीनी)',
    smartAlternativeEn: 'Chilled Jeera Chaas or Fresh Mint Lime Soda',
    smartCalorieVal: 35,
    caloriesSaved: 195,
    whyItWorksHi: 'पैक्ड ड्रिंक्स में 10 चम्मच फ्रुक्टोज होता है जो सीधे लिवर में फैटी लिवर और बेली फैट बनाता है।',
    whyItWorksEn: 'Zero high-fructose corn syrup; provides cooling hydration and natural electrolytes.',
  },
  {
    id: 's7',
    highCalorieFoodHi: 'मैदा बिस्कुट / नमकीन (शाम को 1 पैकेट)',
    highCalorieFoodEn: 'Tea Biscuits / Haldiram Namkeen',
    highCalorieVal: 320,
    smartAlternativeHi: 'उबले अंकुरित मूंग या भुना चना चाट',
    smartAlternativeEn: 'Boiled Sprouts or Roasted Chana Chaat',
    smartCalorieVal: 120,
    caloriesSaved: 200,
    whyItWorksHi: 'पाम ऑयल और रिफाइंड आटे से छुटकारा। आंतों का स्वास्थ्य सुधरता है।',
    whyItWorksEn: 'Zero palm oil or refined starch; supplies prebiotic plant fiber.',
  },
  {
    id: 's8',
    highCalorieFoodHi: 'क्रीमी बटर पनीर मसाला',
    highCalorieFoodEn: 'Restaurant Shahi/Butter Paneer',
    highCalorieVal: 480,
    smartAlternativeHi: 'घर का तवा पनीर भुर्जी (कम तेल, प्याज-टमाटर में)',
    smartAlternativeEn: 'Home-cooked Paneer Bhurji (Light Oil)',
    smartCalorieVal: 240,
    caloriesSaved: 240,
    whyItWorksHi: 'क्रीम, काजू पेस्ट और मक्खन की सैकड़ों छिपी हुई कैलोरी से तुरंत बचाव।',
    whyItWorksEn: 'Avoids heavy heavy cream, cashew pastes, and excessive butter solids.',
  },
];

export const homeMobilityRoutines = [
  {
    id: 'm1',
    nameHi: '1. चेयर स्क्वाट्स / सिट-टू-स्टैंड (Chair Squats)',
    nameEn: '1. Chair Squats / Sit-to-Stand',
    duration: '2 मिनट (15-20 रेप्स x 2 सेट)',
    targetHi: 'जांघों और ग्लूट्स की बड़ी मांसपेशियों को जगाना',
    targetEn: 'Activate thigh and glute muscle groups',
    instructionHi: 'कुर्सी के सामने खड़े हों, धीरे-धीरे बैठें जैसे बैठने वाले हों और बिना टिके वापस सीधे खड़े हों। यह शरीर की सबसे बड़ी मांसपेशियों को उत्तेजित करता है जो दिनभर कैलोरी जलाती हैं।',
    instructionEn: 'Stand in front of a chair, hinge at hips to lightly tap the seat, then power back up. Activates the body’s largest calorie-burning muscle group.',
  },
  {
    id: 'm2',
    nameHi: '2. दीवार पर टिकना / वॉल सिट (Wall Sits)',
    nameEn: '2. Isometric Wall Sit',
    duration: '3 सेट (45-60 सेकंड होल्ड)',
    targetHi: 'कोर, क्वैड्स और मेटाबॉलिक रेजिस्टेंस',
    targetEn: 'Core, quads, and metabolic burn without joint impact',
    instructionHi: 'दीवार से पीठ सटाकर घुटनों को 90 डिग्री पर मोड़ें। बिना किसी वजन के यह जांघों से लैक्टिक एसिड और ग्लूकोज सोखने का सबसे असरदार तरीका है।',
    instructionEn: 'Back flat against a wall, sink down to 90 degrees as if seated. Super gentle on knees, tremendous metabolic glucose uptake.',
  },
  {
    id: 'm3',
    nameHi: '3. खड़े होकर घुटने ऊपर करना (Standing High Knees March)',
    nameEn: '3. Standing High Knees March',
    duration: '2 मिनट (मध्यम गति)',
    targetHi: 'लोअर बेली और हिप फ्लेक्सर्स एक्टिवेशन',
    targetEn: 'Lower belly, hip flexors, and lymphatic drainage',
    instructionHi: 'एक जगह खड़े होकर बारी-बारी से अपने घुटने छाती की ओर ऊपर लाएं और हाथ स्विंग करें। कमर सीधी रखें। फोन पर बात करते हुए भी कर सकते हैं।',
    instructionEn: 'March in place bringing alternate knees up to hip height with deliberate core bracing. Great during phone calls.',
  },
  {
    id: 'm4',
    nameHi: '4. फर्श पर ग्लूट ब्रिज (Glute Bridges)',
    nameEn: '4. Floor Glute Bridges',
    duration: '2 मिनट (15 रेप्स x 2 सेट)',
    targetHi: 'लोअर बैक को मजबूत करना और हिप्स को टोन करना',
    targetEn: 'Strengthen lower back, tighten hips and hamstrings',
    instructionHi: 'पीठ के बल लेटें, घुटने मोड़ें और पैरों को जमीन पर रखें। अपने हिप्स को ऊपर उठाएं और 2 सेकंड रुककर वापस लाएं। कुर्सी पर बैठने वालों के लिए रामबाण है।',
    instructionEn: 'Lie on your back with knees bent, feet flat. Drive hips upward, squeezing glutes for 2 seconds at the top. Reverses sitting posture.',
  },
  {
    id: 'm5',
    nameHi: '5. बर्ड-डॉग संतुलन मुद्रा (Bird-Dog Pose)',
    nameEn: '5. Bird-Dog Core Stability',
    duration: '2 मिनट (10 रेप्स प्रति साइड)',
    targetHi: 'गहरी पेट की मांसपेशियां (ट्रांसवर्स एब्डोमिनिस)',
    targetEn: 'Deep transverse abdominal wall and spine stabilization',
    instructionHi: 'हाथों और घुटनों के बल आएं (चौपाया)। दायां हाथ आगे और बायां पैर पीछे सीधा फैलाएं। 3 सेकंड रोकें फिर बदलें। पेट को अंदर खींचने में मदद करता है।',
    instructionEn: 'Hands and knees position. Extend opposite arm forward and leg backward. Hold 3 seconds. Flattens lower belly posture.',
  },
  {
    id: 'm6',
    nameHi: '6. खड़े होकर पिंडलियां ऊपर उठाना (Calf Raises)',
    nameEn: '6. Standing Calf Raises',
    duration: '2 मिनट (25-30 रेप्स x 2 सेट)',
    targetHi: 'पिंडलियों का "दूसरा दिल" (सोलियस मसल पंप)',
    targetEn: 'Soleus muscle glucose clearing pump',
    instructionHi: 'दीवार का सहारा लेकर पंजों के बल ऊपर उठें और धीरे-धीरे नीचे आएं। हालिया रिसर्च बताती है कि सोलियस मसल को एक्टिवेट करने से ब्लड शुगर और फैट बर्निंग कई गुना बढ़ती है।',
    instructionEn: 'Raise up onto toes and control the descent. Soleus muscle activation has been proven to dramatically clear systemic glucose and triglycerides.',
  },
];

export const initialFoodDatabase: FoodCalorieItem[] = [
  {
    id: 'f1',
    nameHi: 'रोटी (गेहूं की सामान्य)',
    nameEn: 'Whole Wheat Roti (Chapati)',
    category: 'roti_grain',
    serving: '1 मध्यम (35g आटा)',
    calories: 85,
    protein: 3.0,
    carbs: 17.5,
    fat: 0.5,
    fatLossVerdict: 'Good',
    tipHi: 'घी न लगाएं या 1/4 चम्मच लगाएं। 1-2 रोटी से ज्यादा न लें।',
    tipEn: 'Keep to 1-2 rotis per meal without slathering extra butter.',
  },
  {
    id: 'f2',
    nameHi: 'सफेद उबले चावल',
    nameEn: 'Steamed White Rice',
    category: 'roti_grain',
    serving: '1 कटोरी (150g उबला)',
    calories: 195,
    protein: 3.5,
    carbs: 43.0,
    fat: 0.4,
    fatLossVerdict: 'Moderate',
    tipHi: 'चावल से पहले 1 बड़ा कटोरा खीरा सलाद खाएं ताकि शुगर स्पाइक न हो।',
    tipEn: 'Preload with a cucumber salad to blunt the rapid glucose uptake.',
  },
  {
    id: 'f3',
    nameHi: 'मूंग दाल (पीली पतली)',
    nameEn: 'Cooked Moong Dal (Yellow)',
    category: 'dal_curry',
    serving: '1 कटोरी (150g)',
    calories: 135,
    protein: 8.5,
    carbs: 21.0,
    fat: 1.8,
    fatLossVerdict: 'Excellent',
    tipHi: 'हल्का तड़का (जीरा, हींग, टमाटर)। फैट लॉस के लिए सबसे हल्की और सुपाच्य दाल।',
    tipEn: 'Light tadka with cumin and asafoetida. Easiest dal to digest on a cut.',
  },
  {
    id: 'f4',
    nameHi: 'गाय का लो-फैट पनीर',
    nameEn: 'Low-Fat Cow Paneer',
    category: 'protein',
    serving: '100 ग्राम',
    calories: 190,
    protein: 19.0,
    carbs: 3.5,
    fat: 11.0,
    fatLossVerdict: 'Excellent',
    tipHi: 'शाकाहारियों के लिए सर्वोत्तम लीन प्रोटीन। तवे पर हल्का भूनें।',
    tipEn: 'Prime vegetarian protein source. Lightly grill or scramble in bhurji.',
  },
  {
    id: 'f5',
    nameHi: 'उबला हुआ पूरा अंडा',
    nameEn: 'Boiled Whole Egg',
    category: 'protein',
    serving: '1 अंडा (50g)',
    calories: 74,
    protein: 6.3,
    carbs: 0.4,
    fat: 5.0,
    fatLossVerdict: 'Excellent',
    tipHi: 'विटामिन बी12 और कोलीन से भरपूर। सुबह 1-2 पूरे अंडे फैट लॉस में बहुत सहायक हैं।',
    tipEn: 'High satiety index with essential vitamins and healthy fats.',
  },
  {
    id: 'f6',
    nameHi: 'उबले अंडे की सफेदी (एग वाइट)',
    nameEn: 'Boiled Egg White',
    category: 'protein',
    serving: '1 सफेदी (33g)',
    calories: 17,
    protein: 3.6,
    carbs: 0.2,
    fat: 0.1,
    fatLossVerdict: 'Excellent',
    tipHi: 'शुद्ध लीन प्रोटीन! रात में 3-4 सफेदी खाने से जीरो फैट और भरपूर रिकवरी मिलती है।',
    tipEn: 'Pure lean protein. Perfect nighttime hunger crusher with near-zero fat.',
  },
  {
    id: 'f7',
    nameHi: 'सोया चंक्स (उबाले हुए)',
    nameEn: 'Boiled Soya Chunks',
    category: 'protein',
    serving: '50g सूखा (उबालकर 1 बड़ा बाउल)',
    calories: 170,
    protein: 26.0,
    carbs: 16.0,
    fat: 0.5,
    fatLossVerdict: 'Excellent',
    tipHi: 'शाकाहार का सबसे सस्ता और ताकतवर प्रोटीन (52% प्रोटीन)। गर्म पानी में निचोड़ कर पकाएं।',
    tipEn: 'Highest protein density in plant kingdom (52% by weight). Very filling.',
  },
  {
    id: 'f8',
    nameHi: 'चिकन ब्रेस्ट (ग्रिल्ड/उबला)',
    nameEn: 'Skinless Chicken Breast',
    category: 'protein',
    serving: '100 ग्राम',
    calories: 165,
    protein: 31.0,
    carbs: 0.0,
    fat: 3.6,
    fatLossVerdict: 'Excellent',
    tipHi: 'नॉन-वेज में फैट लॉस का गोल्ड स्टैंडर्ड। बिना तेल या 1/2 चम्मच ऑलिव ऑयल में पकाएं।',
    tipEn: 'The gold standard lean poultry. Packs 31g pure protein per 100g.',
  },
  {
    id: 'f9',
    nameHi: 'खीरा व ककड़ी सलाद',
    nameEn: 'Cucumber & Tomato Salad',
    category: 'snack',
    serving: '1 बड़ा बाउल (250g)',
    calories: 35,
    protein: 1.5,
    carbs: 7.0,
    fat: 0.2,
    fatLossVerdict: 'Excellent',
    tipHi: 'फ्री फूड! इसे जितना मर्जी खाएं। 95% पानी और फाइबर।',
    tipEn: 'Virtually a free food. 95% structured water and volume fiber.',
  },
  {
    id: 'f10',
    nameHi: 'भुना हुआ काला चना',
    nameEn: 'Roasted Black Chana',
    category: 'snack',
    serving: '50 ग्राम (1 मुट्ठी)',
    calories: 185,
    protein: 9.5,
    carbs: 28.0,
    fat: 2.5,
    fatLossVerdict: 'Good',
    tipHi: 'शाम के लिए सबसे बढ़िया स्नैक। छिलके सहित खाएं ताकि आंतें साफ रहें।',
    tipEn: 'Eat with husks intact for maximum dietary fiber and slow energy release.',
  },
  {
    id: 'f11',
    nameHi: 'भुने मखाने (कम तेल में)',
    nameEn: 'Roasted Makhana (Foxnuts)',
    category: 'snack',
    serving: '30 ग्राम (1 बड़ा कटोरा)',
    calories: 110,
    protein: 3.2,
    carbs: 22.0,
    fat: 0.4,
    fatLossVerdict: 'Good',
    tipHi: 'क्रंची स्नैकिंग के लिए उत्तम। चिप्स और बिस्कुट का सबसे सुरक्षित विकल्प।',
    tipEn: 'Light, crunchy snack that satisfies chips cravings at a fraction of calories.',
  },
  {
    id: 'f12',
    nameHi: 'समोसा (हलवाई वाला)',
    nameEn: 'Fried Potato Samosa',
    category: 'snack',
    serving: '1 पीस (120g)',
    calories: 280,
    protein: 4.0,
    carbs: 32.0,
    fat: 16.0,
    fatLossVerdict: 'Avoid on Cut',
    tipHi: 'फैट लॉस के 60 दिनों में इसे पूरी तरह टालें। ट्रांस-फैट से बेली फैट बढ़ता है।',
    tipEn: 'Avoid during 60-day fat loss. Packed with refined flour and reheated oil.',
  },
  {
    id: 'f13',
    nameHi: 'गुलाब जामुन (चाशनी में)',
    nameEn: 'Gulab Jamun with Syrup',
    category: 'snack',
    serving: '2 पीस (100g)',
    calories: 380,
    protein: 4.5,
    carbs: 58.0,
    fat: 15.0,
    fatLossVerdict: 'Avoid on Cut',
    tipHi: 'एक बार में 12 चम्मच चीनी के बराबर! 2 महीने के संकल्प में इसे न छुएं।',
    tipEn: 'Insulin bomb that stalls fat oxidation for 24+ hours.',
  },
  {
    id: 'f14',
    nameHi: 'छाछ (सादी मट्ठा)',
    nameEn: 'Spiced Buttermilk (Chaas)',
    category: 'beverage',
    serving: '1 बड़ा गिलास (250ml)',
    calories: 45,
    protein: 3.2,
    carbs: 4.5,
    fat: 1.2,
    fatLossVerdict: 'Excellent',
    tipHi: 'दोपहर में पीने से पाचन सुधरता है और पेट ठंडा रहता है।',
    tipEn: 'Hydrating, probiotic-rich and keeps stomach feeling light and full.',
  },
  {
    id: 'f15',
    nameHi: 'मीठी दूध वाली चाय',
    nameEn: 'Regular Sugary Milk Tea',
    category: 'beverage',
    serving: '1 कप (150ml)',
    calories: 80,
    protein: 2.0,
    carbs: 12.0,
    fat: 2.5,
    fatLossVerdict: 'Avoid on Cut',
    tipHi: 'दिन में 3 बार पीने से 240 खाली कैलोरी मिलती है। बिना चीनी की चाय पर आएं।',
    tipEn: 'Swap sugar with stevia or switch to green tea/black coffee.',
  },
];
