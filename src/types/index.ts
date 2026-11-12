export type Language = 'hi' | 'en';

export interface UserProfile {
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'light_walker' | 'active_walker';
  dietPreference: 'vegetarian' | 'eggetarian' | 'non_veg' | 'jain';
  startDate: string;
}

export interface CalculatedPlan {
  bmr: number;
  tdee: number;
  targetDailyCalories: number;
  dailyCalorieDeficit: number;
  targetProteinGrams: number;
  targetSteps: number;
  targetWaterLiters: number;
  estimated60DayFatLossKg: number;
  projectedWeightAt60Days: number;
}

export interface DayTask {
  id: string;
  labelHi: string;
  labelEn: string;
  target: string;
  completed: boolean;
}

export interface DayRoadmapItem {
  day: number;
  phase: 1 | 2 | 3 | 4;
  titleHi: string;
  titleEn: string;
  focusHi: string;
  focusEn: string;
  actionTipHi: string;
  actionTipEn: string;
  tasks: DayTask[];
}

export interface MealItem {
  mealTime: string;
  timeRange: string;
  dishNameHi: string;
  dishNameEn: string;
  ingredientsHi: string;
  ingredientsEn: string;
  portion: string;
  calories: number;
  proteinG: number;
  fatLossReasonHi: string;
  fatLossReasonEn: string;
}

export interface MealPlanCategory {
  id: 'vegetarian' | 'eggetarian' | 'non_veg' | 'jain';
  nameHi: string;
  nameEn: string;
  totalCalories: number;
  totalProteinG: number;
  descriptionHi: string;
  descriptionEn: string;
  meals: MealItem[];
}

export interface SmartSwap {
  id: string;
  highCalorieFoodHi: string;
  highCalorieFoodEn: string;
  highCalorieVal: number;
  smartAlternativeHi: string;
  smartAlternativeEn: string;
  smartCalorieVal: number;
  caloriesSaved: number;
  whyItWorksHi: string;
  whyItWorksEn: string;
}

export interface FoodCalorieItem {
  id: string;
  nameHi: string;
  nameEn: string;
  category: 'breakfast' | 'dal_curry' | 'roti_grain' | 'protein' | 'snack' | 'beverage';
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fatLossVerdict: 'Excellent' | 'Good' | 'Moderate' | 'Avoid on Cut';
  tipHi: string;
  tipEn: string;
}

export interface WeightLogEntry {
  id: string;
  date: string;
  dayNumber: number;
  weightKg: number;
  waistCm?: number;
  notes?: string;
}
