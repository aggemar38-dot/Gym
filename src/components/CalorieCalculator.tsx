import React, { useState } from 'react';
import { UserProfile, CalculatedPlan, Language } from '../types';
import { calculatePlan } from '../data/fatLossPlanData';
import { Calculator, Check, Scale, Footprints, Droplets, Target, Sparkles } from 'lucide-react';

interface CalorieCalculatorProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  calculatedPlan: CalculatedPlan;
  language: Language;
  onPlanUpdated?: () => void;
}

export const CalorieCalculator: React.FC<CalorieCalculatorProps> = ({
  profile,
  setProfile,
  calculatedPlan,
  language,
  onPlanUpdated,
}) => {
  const isHi = language === 'hi';
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const previewPlan = calculatePlan(formData);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setSavedSuccess(true);
    if (onPlanUpdated) onPlanUpdated();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div id="calculator-section" className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Calculator className="w-4 h-4" />
            <span>{isHi ? 'मिफ्लिन-सेंट जियोर फॉर्मूला' : 'Mifflin-St Jeor Science Engine'}</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            {isHi ? 'आपका व्यक्तिगत 60-दिन फैट लॉस कैलकुलेटर' : 'Personalized 60-Day Fat Loss Calculator'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isHi
              ? 'अपनी जानकारी दर्ज करें और बिना जिम जाए 2 महीने में सुरक्षित फैट घटाने का सटीक दैनिक कैलोरी और प्रोटीन लक्ष्य जानें।'
              : 'Enter your details to generate your exact daily calorie deficit, protein target, and step count for no-gym fat loss.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs Column */}
        <form onSubmit={handleSave} className="lg:col-span-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isHi ? 'उम्र (वर्ष)' : 'Age (Years)'}
              </label>
              <input
                type="number"
                min={16}
                max={85}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || 25 })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isHi ? 'लिंग' : 'Gender'}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-all text-sm"
              >
                <option value="male">{isHi ? 'पुरुष (Male)' : 'Male'}</option>
                <option value="female">{isHi ? 'महिला (Female)' : 'Female'}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Height */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isHi ? 'ऊंचाई (cm)' : 'Height (cm)'}
              </label>
              <input
                type="number"
                min={130}
                max={220}
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) || 170 })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            {/* Current Weight */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isHi ? 'वर्तमान वजन (kg)' : 'Current Wt (kg)'}
              </label>
              <input
                type="number"
                min={40}
                max={200}
                step={0.5}
                value={formData.currentWeightKg}
                onChange={(e) => setFormData({ ...formData, currentWeightKg: Number(e.target.value) || 75 })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            {/* Target Weight */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {isHi ? 'लक्ष्य वजन (kg)' : 'Target Wt (kg)'}
              </label>
              <input
                type="number"
                min={35}
                max={190}
                step={0.5}
                value={formData.targetWeightKg}
                onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) || 68 })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {isHi ? 'दैनिक गतिविधि (बिना जिम)' : 'Daily Routine Activity (No Gym)'}
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="sedentary">
                {isHi ? 'डेस्क जॉब / कम चलना (लगभग 3k-4k कदम)' : 'Sedentary / Desk Job (~3k-4k steps)'}
              </option>
              <option value="light_walker">
                {isHi ? 'सक्रिय चलना (7,000 - 8,500 कदम/दिन)' : 'Moderate Walker (7k - 8.5k steps/day)'}
              </option>
              <option value="active_walker">
                {isHi ? 'उच्च दैनिक कदम (10,000+ कदम/दिन + घरेलू स्ट्रेच)' : 'Active Walker (10k+ steps + home mobility)'}
              </option>
            </select>
          </div>

          {/* Diet Preference */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              {isHi ? 'डाइट प्राथमिकता' : 'Dietary Preference'}
            </label>
            <select
              value={formData.dietPreference}
              onChange={(e) => setFormData({ ...formData, dietPreference: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-sm"
            >
              <option value="vegetarian">{isHi ? 'शुद्ध शाकाहारी (Vegetarian)' : 'Vegetarian'}</option>
              <option value="eggetarian">{isHi ? 'एगेटेरियन (Eggetarian)' : 'Eggetarian'}</option>
              <option value="non_veg">{isHi ? 'नॉन-वेज (Non-Vegetarian)' : 'Non-Vegetarian'}</option>
              <option value="jain">{isHi ? 'जैन / सात्विक (No Onion, No Garlic)' : 'Jain / Satvik'}</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>{isHi ? 'प्लान सुरक्षित हो गया!' : 'Plan Saved Successfully!'}</span>
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                <span>{isHi ? 'इस लक्ष्य को 60-दिन रोडमैप में सेट करें' : 'Apply to My 60-Day Roadmap'}</span>
              </>
            )}
          </button>
        </form>

        {/* Calculated Results Summary Box */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-xl bg-slate-950/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-xs text-slate-400">
                  {isHi ? 'दैनिक अनुशंसित कैलोरी' : 'Daily Calorie Target'}
                </span>
                <div className="text-3xl font-extrabold font-display text-emerald-400 tabular-nums">
                  {previewPlan.targetDailyCalories} <span className="text-base font-normal text-slate-400">kcal</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">
                  {isHi ? 'दैनिक डेफिसिट' : 'Daily Deficit'}
                </span>
                <div className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                  -{previewPlan.dailyCalorieDeficit} kcal
                </div>
                <div className="text-xs text-slate-500">TDEE: {previewPlan.tdee} kcal</div>
              </div>
            </div>

            {/* Core Targets Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHi ? 'दैनिक प्रोटीन' : 'Target Protein'}</span>
                </div>
                <div className="text-xl font-bold font-display text-white tabular-nums">
                  {previewPlan.targetProteinGrams} <span className="text-xs font-normal text-slate-400">ग्राम/दिन</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isHi ? 'मांसपेशी सुरक्षित व तेज तृप्ति' : 'Muscle protection & high TEF'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHi ? 'दैनिक कदम (NEAT)' : 'Daily Steps Goal'}</span>
                </div>
                <div className="text-xl font-bold font-display text-white tabular-nums">
                  {previewPlan.targetSteps.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-slate-400">कदम</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isHi ? 'बिना जिम 350+ kcal बर्न' : 'Burns 350+ kcal daily'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isHi ? 'पानी की मात्रा' : 'Water Intake'}</span>
                </div>
                <div className="text-xl font-bold font-display text-white tabular-nums">
                  {previewPlan.targetWaterLiters} <span className="text-xs font-normal text-slate-400">लीटर/दिन</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isHi ? 'वाटर रिटेंशन व ब्लोटिंग मुक्त' : 'Eliminates water bloat'}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isHi ? '60 दिन का संभावित लॉस' : '60-Day Fat Drop'}</span>
                </div>
                <div className="text-xl font-bold font-display text-emerald-400 tabular-nums">
                  -{previewPlan.estimated60DayFatLossKg} <span className="text-xs font-normal text-slate-400">kg</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isHi ? `अनुमानित वजन: ${previewPlan.projectedWeightAt60Days} kg` : `Projected: ${previewPlan.projectedWeightAt60Days} kg`}
                </p>
              </div>
            </div>

            {/* 60-Day Progression Phase Projection */}
            <div className="border-t border-slate-800/80 pt-4">
              <span className="text-xs font-medium text-slate-400 block mb-2">
                {isHi ? '60 दिनों में शरीर कैसे बदलेगा:' : '60-Day Body Transformation Milestones:'}
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">{isHi ? 'दिन 1-14 (हफ़्ते 1-2):' : 'Days 1-14:'}</span>
                  <span className="font-medium text-white">{isHi ? '~1.5 से 2.2 kg (वॉटर वेट व सूजन खत्म)' : '~1.5-2.2 kg (water bloat gone)'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">{isHi ? 'दिन 15-30 (हफ़्ते 3-4):' : 'Days 15-30:'}</span>
                  <span className="font-medium text-white">{isHi ? '~1.5 से 2.0 kg (फैट बर्निंग तेज, चेहरे पर निखार)' : '~1.5-2.0 kg (face & neck fat drop)'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">{isHi ? 'दिन 31-45 (हफ़्ते 5-6):' : 'Days 31-45:'}</span>
                  <span className="font-medium text-white">{isHi ? '~1.2 से 1.8 kg (पेट और कमर की गहरी चर्बी)' : '~1.2-1.8 kg (visceral belly fat melting)'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">{isHi ? 'दिन 46-60 (हफ़्ते 7-8):' : 'Days 46-60:'}</span>
                  <span className="font-medium text-emerald-400">{isHi ? 'स्थायी लीन बॉडी और आदतें लॉक' : 'Permanent lean transformation locked'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
