import React, { useState } from 'react';
import { Language, UserProfile, CalculatedPlan } from '../types';
import { X, Sparkles, Loader2, Check, Clock, Utensils } from 'lucide-react';

interface CustomPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  userProfile: UserProfile;
  calculatedPlan: CalculatedPlan;
}

export const CustomPlanModal: React.FC<CustomPlanModalProps> = ({
  isOpen,
  onClose,
  language,
  userProfile,
  calculatedPlan,
}) => {
  const isHi = language === 'hi';

  const [dietType, setDietType] = useState<string>(userProfile.dietPreference);
  const [preferences, setPreferences] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/generate-meal-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietType,
          targetCalories: calculatedPlan.targetDailyCalories,
          preferences: preferences || 'घर का सादा शुद्ध खाना, बिना ज्यादा तेल के',
          currentWeight: userProfile.currentWeightKg,
          targetWeight: userProfile.targetWeightKg,
        }),
      });

      if (!response.ok) {
        throw new Error('Plan generation failed');
      }

      const data = await response.json();
      setGeneratedPlan(data);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error creating custom meal plan');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isHi ? 'एआई व्यक्तिगत डाइट प्लान जनरेटर' : 'AI Custom Diet Plan Generator'}
              </h3>
              <p className="text-xs text-slate-400">
                {isHi ? 'घर पर मौजूद सामग्री के अनुसार डाइट तैयार करें' : 'Tailored to your specific pantry & preferences'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {!generatedPlan ? (
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {isHi ? 'डाइट प्राथमिकता' : 'Diet Category'}
                </label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                >
                  <option value="Vegetarian">{isHi ? 'शुद्ध शाकाहारी (Vegetarian)' : 'Vegetarian'}</option>
                  <option value="Eggetarian">{isHi ? 'एगेटेरियन (Eggetarian)' : 'Eggetarian'}</option>
                  <option value="Non-Vegetarian">{isHi ? 'नॉन-वेजिटेरियन (Non-Veg)' : 'Non-Vegetarian'}</option>
                  <option value="Jain">{isHi ? 'जैन / सात्विक (No Onion, No Garlic)' : 'Jain / Satvik'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {isHi
                    ? 'घर पर क्या सामग्री उपलब्ध है या क्या पसंद/नापसंद है?'
                    : 'Ingredients you have at home or specific dislikes?'}
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    isHi
                      ? 'उदा: घर में पनीर, पालक, ओट्स और मूंग दाल है। मुझे सोया पसंद नहीं है। ऑफिस का लंच बॉक्स पैक करना है।'
                      : 'e.g. I have eggs, spinach, lentils and dahi at home. Dislike cabbage. Need easy office tiffin ideas.'
                  }
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{isHi ? 'दैनिक लक्ष्य कैलोरी:' : 'Target Calories:'}</span>
                <span className="font-mono text-emerald-400 font-bold tabular-nums">
                  {calculatedPlan.targetDailyCalories} kcal / दिन
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isHi ? 'कस्टम डाइट तैयार हो रही है...' : 'Generating Customized Plan...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isHi ? 'कस्टम 1-दिवसीय डाइट चार्ट बनाएं' : 'Create My Custom Diet Plan'}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Plan Summary Card */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-400 font-semibold block">
                    {isHi ? 'प्लान का मुख्य फोकस' : 'Plan Summary Focus'}
                  </span>
                  <div className="text-sm font-bold text-white">
                    {isHi ? generatedPlan.daySummary?.focusHindi : generatedPlan.daySummary?.focusEnglish}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    {generatedPlan.daySummary?.totalCalories} kcal
                  </div>
                  <div className="text-slate-400">
                    {generatedPlan.daySummary?.totalProteinG}g प्रोटीन
                  </div>
                </div>
              </div>

              {/* Meals List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300">
                  {isHi ? 'समयबद्ध भोजन तालिका:' : 'Meal Schedule:'}
                </h4>

                {generatedPlan.meals?.map((m: any, mIdx: number) => (
                  <div
                    key={mIdx}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-emerald-400 font-semibold">{m.mealTime}</span>
                      <span className="font-mono text-slate-300">
                        {m.calories} kcal · {m.proteinG}g P
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white">
                      {isHi ? m.dishNameHindi : m.dishNameEnglish}
                    </div>

                    <div className="text-xs text-slate-400">
                      <strong>{isHi ? 'मात्रा: ' : 'Portion: '}</strong>
                      {m.portion}
                    </div>

                    {m.preparationTip && (
                      <p className="text-[11px] text-slate-400 italic">
                        {m.preparationTip}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Reset to generate another */}
              <button
                onClick={() => setGeneratedPlan(null)}
                className="w-full py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 text-xs font-medium transition-colors"
              >
                {isHi ? 'नया प्लान बनाएं' : 'Generate Another Plan'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
