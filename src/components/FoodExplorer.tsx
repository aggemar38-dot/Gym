import React, { useState } from 'react';
import { Language, FoodCalorieItem } from '../types';
import { initialFoodDatabase } from '../data/fatLossPlanData';
import { Search, Sparkles, UtensilsCrossed, AlertTriangle, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

interface FoodExplorerProps {
  language: Language;
}

export const FoodExplorer: React.FC<FoodExplorerProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // AI Food Analyzer state
  const [customDishInput, setCustomDishInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [analyzerError, setAnalyzerError] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelHi: 'सभी खाद्य (All)', labelEn: 'All Foods' },
    { id: 'protein', labelHi: 'हाई प्रोटीन (Protein)', labelEn: 'Protein' },
    { id: 'roti_grain', labelHi: 'रोटी व अनाज (Grains)', labelEn: 'Roti & Grains' },
    { id: 'dal_curry', labelHi: 'दाल व सब्जी (Dals)', labelEn: 'Dals & Veg' },
    { id: 'snack', labelHi: 'स्नैक्स (Snacks)', labelEn: 'Snacks' },
    { id: 'beverage', labelHi: 'पेय पदार्थ (Drinks)', labelEn: 'Beverages' },
  ];

  const filteredFoods = initialFoodDatabase.filter((item) => {
    const matchesSearch =
      item.nameHi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAnalyzeCustomMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDishInput.trim()) return;

    setIsAnalyzing(true);
    setAnalyzerError(null);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodDescription: customDishInput, language }),
      });

      if (!res.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setAnalyzerError(err?.message || 'Server error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVerdictBadge = (verdict: FoodCalorieItem['fatLossVerdict']) => {
    switch (verdict) {
      case 'Excellent':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/30';
      case 'Good':
        return 'text-teal-400 bg-teal-950/80 border-teal-500/30';
      case 'Moderate':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/30';
      case 'Avoid on Cut':
        return 'text-rose-400 bg-rose-950/80 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <UtensilsCrossed className="w-4 h-4" />
          <span>{isHi ? 'कैलोरी एवं मैक्रोन्यूट्रिएंट्स' : 'Calorie & Macro Guide'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
          {isHi ? 'भारतीय फूड कैलोरी एवं फैट-लॉस डायरेक्टरी' : 'Indian Everyday Foods Directory'}
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          {isHi
            ? 'अपनी पसंद का कोई भी खाना खोजें या नीचे एआई विश्लेषक में टाइप करके जानें कि उसमें कितनी कैलोरी है और फैट लॉस में वह सुरक्षित है या नहीं।'
            : 'Search everyday Indian foods or input your custom meals to instantly assess calories, protein, and fat-loss compatibility.'}
        </p>
      </div>

      {/* AI Custom Dish Analyzer Section */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>{isHi ? 'स्मार्ट एआई भोजन विश्लेषक' : 'AI Food & Meal Scanner'}</span>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-white">
          {isHi ? 'आपने आज क्या खाया या खाने की सोच रहे हैं?' : 'What did you eat or plan to eat today?'}
        </h3>

        <form onSubmit={handleAnalyzeCustomMeal} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder={
              isHi
                ? 'उदा: 2 आलू पराठे मक्खन के साथ, 1 ग्लास मीठी लस्सी...'
                : 'e.g. 2 aloo parathas with butter and sweet lassi...'
            }
            value={customDishInput}
            onChange={(e) => setCustomDishInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !customDishInput.trim()}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isHi ? 'विश्लेषण हो रहा है...' : 'Analyzing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{isHi ? 'कैलोरी व फैट स्कोर चेक करें' : 'Analyze Meal'}</span>
              </>
            )}
          </button>
        </form>

        {/* Quick prompt examples */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-500">{isHi ? 'आज़माएं:' : 'Try:'}</span>
          {[
            '2 बेसन चीला और हरी चटनी',
            'दाल मखनी और 2 बटर नान',
            'पोहा और 1 कप मीठी चाय',
            '100g तवा पनीर भुर्जी और 1 रोटी',
          ].map((sample, sIdx) => (
            <button
              key={sIdx}
              type="button"
              onClick={() => {
                setCustomDishInput(sample);
              }}
              className="text-xs text-slate-400 hover:text-emerald-400 underline decoration-slate-700 underline-offset-2 transition-colors"
            >
              "{sample}"
            </button>
          ))}
        </div>

        {/* AI Analysis Result Card */}
        {analysisResult && (
          <div className="mt-4 p-5 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-xs text-slate-400 block">{isHi ? 'विश्लेषण का परिणाम' : 'Analysis Output'}</span>
                <h4 className="text-lg font-bold text-white">{analysisResult.foodName}</h4>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-lg border text-xs font-semibold ${
                    analysisResult.fatLossVerdict === 'Avoid on Fat Loss'
                      ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {analysisResult.fatLossVerdict}
                </span>
                <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                  ~{analysisResult.estimatedCalories} kcal
                </span>
              </div>
            </div>

            {/* Macros Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">{isHi ? 'प्रोटीन' : 'Protein'}</span>
                <span className="font-mono font-bold text-white text-sm">{analysisResult.proteinGrams}g</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">{isHi ? 'कार्ब्स' : 'Carbs'}</span>
                <span className="font-mono font-bold text-slate-300 text-sm">{analysisResult.carbsGrams}g</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">{isHi ? 'वसा (Fat)' : 'Fat'}</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{analysisResult.fatGrams}g</span>
              </div>
            </div>

            {/* Explanation */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isHi ? analysisResult.reasonHindi : analysisResult.reasonEnglish}
            </p>

            {/* Smart Swap Recommendation */}
            {(analysisResult.smartSwapHindi || analysisResult.smartSwapEnglish) && (
              <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs">
                <span className="text-emerald-400 font-semibold block mb-0.5">
                  {isHi ? 'बेहतर हेल्दी विकल्प (Smart Swap):' : 'Recommended Smart Swap:'}
                </span>
                <span className="text-slate-200">
                  {isHi ? analysisResult.smartSwapHindi : analysisResult.smartSwapEnglish}
                </span>
              </div>
            )}
          </div>
        )}

        {analyzerError && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 text-xs text-rose-300">
            {analyzerError}
          </div>
        )}
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHi ? 'खाना खोजें (रोटी, दाल, पनीर, समोसा...)' : 'Search foods...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 w-full sm:w-auto overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === c.id
                    ? 'bg-emerald-500 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isHi ? c.labelHi : c.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Food Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-white">
                    {isHi ? food.nameHi : food.nameEn}
                  </h4>
                  <span className="text-[11px] text-slate-400">{food.serving}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md border text-[11px] font-medium font-mono shrink-0 ${getVerdictBadge(
                    food.fatLossVerdict
                  )}`}
                >
                  {food.fatLossVerdict}
                </span>
              </div>

              {/* Nutrition numbers */}
              <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">कैलोरी</span>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">
                    {food.calories}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">प्रोटीन</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {food.protein}g
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">कार्ब्स</span>
                  <span className="font-mono font-medium text-slate-300 tabular-nums">
                    {food.carbs}g
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">फैट</span>
                  <span className="font-mono font-medium text-amber-400/90 tabular-nums">
                    {food.fat}g
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {isHi ? food.tipHi : food.tipEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
