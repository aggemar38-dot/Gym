import React from 'react';
import { ArrowRight, Flame, Utensils, Footprints, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface HeroSectionProps {
  language: Language;
  onExploreDiet: () => void;
  onOpenCalculator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onExploreDiet,
  onOpenCalculator,
}) => {
  const isHi = language === 'hi';

  return (
    <section className="relative overflow-hidden pt-8 pb-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <span>{isHi ? 'वैज्ञानिक दृष्टिकोण' : 'Evidence-Based Method'}</span>
              <span aria-hidden="true">·</span>
              <span>{isHi ? 'जीरो भारी कसरत' : 'Zero Heavy Gym'}</span>
              <span aria-hidden="true">·</span>
              <span>{isHi ? '60 दिन का ट्रांसफॉर्मेशन' : '60-Day Transformation'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white leading-tight text-balance">
              {isHi ? (
                <>
                  बिना जिम गए <span className="text-emerald-400">60 दिनों</span> में बॉडी फैट घटाएं
                </>
              ) : (
                <>
                  Drop Significant Body Fat in{' '}
                  <span className="text-emerald-400">60 Days</span> Without Gym
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {isHi
                ? 'वजन घटाने का 80% राज सही डाइट और कैलोरी डेफिसिट में है। रोज 8,000-10,000 साधारण कदम, घर का संतुलित भोजन, और 10 मिनट की आसान मोबिलिटी से 2 महीने में 5 से 8 किलो शुद्ध चर्बी पिघलाएं।'
                : '80% of body fat reduction happens in the kitchen through smart portion control. Pair an easy caloric deficit with 8,000 daily steps and simple home mobility to shed 5 to 8 kg of pure fat.'}
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenCalculator}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 whitespace-nowrap shrink-0"
              >
                <span>{isHi ? 'मेरा 60-दिन प्लान बनाएं' : 'Calculate 60-Day Plan'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreDiet}
                className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <Utensils className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? 'डाइट चार्ट व नियम देखें' : 'View Diet Plans'}</span>
              </button>
            </div>

            {/* Micro reassurance badges (clean text) */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {isHi ? 'कोई सप्लीमेंट पाउडर जरूरी नहीं' : 'No expensive supplements needed'}
              </span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>{isHi ? '100% भारतीय घर का भोजन' : 'Real everyday home-cooked food'}</span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>{isHi ? 'भूखा रहने की जरूरत नहीं' : 'Zero starving or extreme fasting'}</span>
            </div>
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <img
                src="/src/assets/images/hero_fatloss_lifestyle_1794499501992.jpg"
                alt="Healthy whole foods and walking shoes for no-gym fat loss"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{isHi ? 'गोल्डन फॉर्मूला' : 'The Golden Formula'}</span>
                  <span className="text-emerald-400 font-medium">{isHi ? '80% डाइट + 20% चाल' : '80% Food + 20% NEAT'}</span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {isHi ? 'जिम की भारी मशीनों के बिना भी चर्बी जलती है' : 'Burn Stubborn Visceral Fat Without Weights'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Stat Strip */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? 'डाइट की भूमिका' : 'Diet Influence'}</span>
            </div>
            <div className="text-2xl font-bold font-display text-white tabular-nums">80%</div>
            <p className="text-xs text-slate-400 mt-1">
              {isHi ? 'कैलोरी डेफिसिट + प्रोटीन' : 'Calorie deficit + Protein'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? 'दैनिक कदम लक्ष्य' : 'Daily Step Goal'}</span>
            </div>
            <div className="text-2xl font-bold font-display text-white tabular-nums">8k - 10k</div>
            <p className="text-xs text-slate-400 mt-1">
              {isHi ? 'NEAT से 300-400 kcal बर्न' : 'Burns 300-400 kcal daily'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Flame className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? '2 महीने का लक्ष्य' : '60-Day Target'}</span>
            </div>
            <div className="text-2xl font-bold font-display text-white tabular-nums">5 - 8 kg</div>
            <p className="text-xs text-slate-400 mt-1">
              {isHi ? 'शुद्ध बॉडी फैट में कमी' : 'Net pure body fat lost'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? 'जिम इक्विपमेंट' : 'Gym Required'}</span>
            </div>
            <div className="text-2xl font-bold font-display text-white tabular-nums">0%</div>
            <p className="text-xs text-slate-400 mt-1">
              {isHi ? 'घर और बाहर पैदल चलना' : 'Zero memberships needed'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
