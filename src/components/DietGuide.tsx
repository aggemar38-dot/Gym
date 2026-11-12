import React, { useState } from 'react';
import { MealPlanCategory, Language } from '../types';
import { mealPlans } from '../data/fatLossPlanData';
import { Utensils, Clock, Flame, ShieldAlert, Sparkles, ChefHat } from 'lucide-react';

interface DietGuideProps {
  language: Language;
  onOpenCustomPlanModal: () => void;
}

export const DietGuide: React.FC<DietGuideProps> = ({
  language,
  onOpenCustomPlanModal,
}) => {
  const isHi = language === 'hi';
  const [selectedCategory, setSelectedCategory] = useState<MealPlanCategory['id']>('vegetarian');

  const activePlan = mealPlans.find((p) => p.id === selectedCategory) || mealPlans[0];

  const planOptions: { id: MealPlanCategory['id']; labelHi: string; labelEn: string }[] = [
    { id: 'vegetarian', labelHi: 'शाकाहारी (Veg)', labelEn: 'Vegetarian' },
    { id: 'eggetarian', labelHi: 'एगेटेरियन (Egg)', labelEn: 'Eggetarian' },
    { id: 'non_veg', labelHi: 'नॉन-वेज (Non-Veg)', labelEn: 'Non-Vegetarian' },
    { id: 'jain', labelHi: 'जैन / सात्विक (Satvik)', labelEn: 'Jain / Satvik' },
  ];

  return (
    <div className="space-y-8">
      {/* Header and Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Utensils className="w-4 h-4" />
            <span>{isHi ? '80% फैट लॉस किचन से होता है' : '80% of Fat Loss Happens in Kitchen'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            {isHi ? 'सम्पूर्ण डाइट गाइड एवं मील प्लान' : 'Comprehensive Fat-Loss Meal Plans'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isHi
              ? 'ये मील प्लान घर के रोजमर्रा के खाने से बनाए गए हैं। इनमें प्रोटीन भरपूर है और कैलोरी नियंत्रित, ताकि बिना जिम जाए शरीर फैट को ऊर्जा के लिए जलाए।'
              : 'Constructed from everyday home ingredients with optimized protein and high fiber to trigger all-day fat oxidation without hunger.'}
          </p>
        </div>

        {/* AI Custom Diet Generator Button */}
        <button
          onClick={onOpenCustomPlanModal}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs md:text-sm flex items-center gap-2 transition-all whitespace-nowrap shrink-0"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{isHi ? 'घर की सब्जियों से कस्टमाइज़ प्लान बनाएं' : 'AI Custom Meal Generator'}</span>
        </button>
      </div>

      {/* Plan Selector Buttons (Filter tabs) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
        {planOptions.map((opt) => {
          const isSelected = selectedCategory === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedCategory(opt.id)}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isHi ? opt.labelHi : opt.labelEn}
            </button>
          );
        })}
      </div>

      {/* Active Plan Meta Bar */}
      <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">
            {isHi ? activePlan.nameHi : activePlan.nameEn}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isHi ? activePlan.descriptionHi : activePlan.descriptionEn}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isHi ? 'कुल कैलोरी' : 'Daily Calories'}</span>
            <span className="text-emerald-400 font-bold font-mono text-sm tabular-nums">
              ~{activePlan.totalCalories} kcal
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isHi ? 'कुल प्रोटीन' : 'Daily Protein'}</span>
            <span className="text-white font-bold font-mono text-sm tabular-nums">
              ~{activePlan.totalProteinG}g
            </span>
          </div>
        </div>
      </div>

      {/* Culinary Visual Showcase Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="md:col-span-4 rounded-xl overflow-hidden border border-slate-700/80">
          <img
            src="/src/assets/images/healthy_plate_meal_1794499502826.jpg"
            alt="Healthy balanced fat loss plate"
            referrerPolicy="no-referrer"
            className="w-full h-48 md:h-52 object-cover"
          />
        </div>
        <div className="md:col-span-8 space-y-3">
          <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <ChefHat className="w-4 h-4" />
            <span>{isHi ? 'गोल्डन प्लेट रूल (The Perfect Fat-Loss Plate)' : 'The Ideal Fat-Loss Plate Model'}</span>
          </div>
          <h4 className="text-base font-bold text-white">
            {isHi
              ? 'आधा हिस्सा सलाद, एक-चौथाई प्रोटीन और एक-चौथाई साबुत अनाज'
              : '1/2 Raw Greens Salad + 1/4 Lean Protein + 1/4 Complex Whole Grains'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isHi
              ? 'जब आप प्लेट में पहले 50% हिस्सा खीरा, ककड़ी, टमाटर और हरी सब्जियों का रखते हैं, तो आपका पेट 10 गुना कम कैलोरी में ही भर जाता है। रोटी या चावल 1 से 2 से अधिक खाने की इच्छा ही नहीं होती।'
              : 'Pre-portioning 50% of your ceramic plate with low-energy-density water-rich vegetables naturally limits calorie intake without willpower fatigue.'}
          </p>
        </div>
      </div>

      {/* Chronological Meals Sequence */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-300">
          {isHi ? 'दैनिक समयबद्ध भोजन तालिका (Daily Schedule)' : 'Daily Structured Meal Schedule'}
        </h4>

        <div className="grid grid-cols-1 gap-4">
          {activePlan.meals.map((meal, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold font-mono text-emerald-400">
                    {meal.mealTime}
                  </span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{meal.timeRange}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400">
                    {isHi ? 'मात्रा:' : 'Portion:'} <span className="text-slate-200">{meal.portion}</span>
                  </span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">
                    {meal.calories} kcal
                  </span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span className="font-mono text-white font-medium tabular-nums">
                    {meal.proteinG}g प्रोटीन
                  </span>
                </div>
              </div>

              {/* Meal Name & Description */}
              <div>
                <h5 className="text-base font-bold text-white">
                  {isHi ? meal.dishNameHi : meal.dishNameEn}
                </h5>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  <strong className="text-slate-400">{isHi ? 'सामग्री: ' : 'Ingredients: '}</strong>
                  {isHi ? meal.ingredientsHi : meal.ingredientsEn}
                </p>
              </div>

              {/* Science & Fat Loss Reason */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
                <span className="text-emerald-400 font-semibold block mb-0.5">
                  {isHi ? 'फैट लॉस पर असर:' : 'Metabolic Rationale:'}
                </span>
                <span>{isHi ? meal.fatLossReasonHi : meal.fatLossReasonEn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
