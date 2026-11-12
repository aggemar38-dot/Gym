import React, { useState } from 'react';
import { Language } from '../types';
import { smartSwaps } from '../data/fatLossPlanData';
import { ArrowRight, RefreshCw, Sparkles, Flame, Check } from 'lucide-react';

interface SmartSwapsProps {
  language: Language;
}

export const SmartSwaps: React.FC<SmartSwapsProps> = ({ language }) => {
  const isHi = language === 'hi';
  const [selectedSwaps, setSelectedSwaps] = useState<string[]>(['s1', 's2', 's3']);

  const toggleSwap = (id: string) => {
    setSelectedSwaps((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalDailySaved = smartSwaps
    .filter((s) => selectedSwaps.includes(s.id))
    .reduce((acc, cur) => acc + cur.caloriesSaved, 0);

  const estimated60DayWeightDrop = Math.round(((totalDailySaved * 60) / 7700) * 10) / 10;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <RefreshCw className="w-4 h-4" />
            <span>{isHi ? 'बिना भूखे रहे वजन घटाएं' : 'Effortless Calorie Reduction'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            {isHi ? 'स्मार्ट फूड स्वैप्स (Smart Food Swaps)' : 'Smart Indian Food Swaps'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isHi
              ? 'आपको पसंदीदा स्वाद छोड़ने की जरूरत नहीं है, बस इन आसान बदलावों से रोजाना 400-600 कैलोरी बचाएं और चर्बी को पिघलने दें।'
              : 'Keep satisfying taste while stripping out hundreds of empty calories through clever ingredient substitutions.'}
          </p>
        </div>

        {/* Live Cumulative Savings Bar */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[11px] text-slate-400 block">
              {isHi ? 'चयनित स्वैप्स से दैनिक बचत' : 'Selected Swaps Daily Savings'}
            </span>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {totalDailySaved} kcal / दिन
            </div>
            <span className="text-[10px] text-slate-500">
              {isHi
                ? `60 दिनों में ~${estimated60DayWeightDrop} kg शुद्ध वसा की कमी!`
                : `~${estimated60DayWeightDrop} kg pure fat gone in 60 days!`}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Savings Calculator Guidance */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
        <span>
          {isHi
            ? 'नीचे दिए गए कार्डों पर क्लिक करके देखें कि कौन-से बदलाव आपकी दिनचर्या में सबसे आसान हैं:'
            : 'Select the swaps you plan to practice daily to calculate your 60-day fat loss boost:'}
        </span>
        <span className="font-mono text-emerald-400 font-semibold">
          {selectedSwaps.length} / {smartSwaps.length} {isHi ? 'चुने गए' : 'active'}
        </span>
      </div>

      {/* Swaps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {smartSwaps.map((swap) => {
          const isSelected = selectedSwaps.includes(swap.id);

          return (
            <div
              key={swap.id}
              onClick={() => toggleSwap(swap.id)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all text-left space-y-4 ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/20'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {isHi ? 'फूड रिप्लेसमेंट' : 'Food Replacement'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-mono font-bold text-xs tabular-nums">
                    -{swap.caloriesSaved} kcal
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>

              {/* Before vs After Visual Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Traditional / High Calorie */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-red-900/30 space-y-1">
                  <span className="text-[11px] text-red-400 font-semibold block">
                    {isHi ? 'पारंपरिक / हाई कैलोरी' : 'Traditional High-Calorie'}
                  </span>
                  <div className="text-sm font-bold text-slate-200">
                    {isHi ? swap.highCalorieFoodHi : swap.highCalorieFoodEn}
                  </div>
                  <div className="text-xs font-mono text-red-400/90 font-bold tabular-nums">
                    ~{swap.highCalorieVal} kcal
                  </div>
                </div>

                {/* Smart Swap */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] text-emerald-400 font-semibold block">
                    {isHi ? 'स्मार्ट हेल्दी विकल्प' : 'Smart Fat-Loss Alternative'}
                  </span>
                  <div className="text-sm font-bold text-white">
                    {isHi ? swap.smartAlternativeHi : swap.smartAlternativeEn}
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-bold tabular-nums">
                    ~{swap.smartCalorieVal} kcal
                  </div>
                </div>
              </div>

              {/* Science Why It Works */}
              <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <span className="text-emerald-400 font-medium block mb-0.5">
                  {isHi ? 'यह क्यों काम करता है:' : 'Why It Works:'}
                </span>
                <span>{isHi ? swap.whyItWorksHi : swap.whyItWorksEn}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
