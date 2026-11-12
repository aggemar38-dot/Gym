import React from 'react';
import { Language } from '../types';
import { goldenDietRules } from '../data/fatLossPlanData';
import { BookOpen, Footprints, ShieldCheck, HeartPulse } from 'lucide-react';

interface GoldenRulesProps {
  language: Language;
  onOpenMobility: () => void;
}

export const GoldenRules: React.FC<GoldenRulesProps> = ({
  language,
  onOpenMobility,
}) => {
  const isHi = language === 'hi';

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <BookOpen className="w-4 h-4" />
          <span>{isHi ? 'वैज्ञानिक सिद्धांत' : 'Scientific Principles'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
          {isHi ? 'नो-जिम फैट लॉस के 7 सुनहरे नियम' : 'The 7 Golden Rules of No-Gym Fat Loss'}
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          {isHi
            ? 'बिना भारी वर्कआउट के वजन कम करने के लिए इन 7 नियमों का पालन करें। यह आपके मेटाबॉलिज्म और हॉर्मोन्स को प्राकृतिक रूप से रीसेट कर देंगे।'
            : 'Adhere to these 7 evidence-based rules to prime your hormones for fat oxidation without endless gym cardio.'}
        </p>
      </div>

      {/* 7 Rules Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goldenDietRules.map((rule) => (
          <div
            key={rule.number}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <span className="text-2xl font-extrabold font-mono text-emerald-400">
                {rule.number}
              </span>
              <span className="text-xs font-medium text-slate-400 font-mono">
                {rule.badge}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">
              {isHi ? rule.titleHi : rule.titleEn}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isHi ? rule.descHi : rule.descEn}
            </p>
          </div>
        ))}
      </div>

      {/* Walking & NEAT Spotlight Section with Image */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-700">
            <img
              src="/src/assets/images/walking_outdoor_morning_1794499504140.jpg"
              alt="Person brisk walking in sunlit park"
              referrerPolicy="no-referrer"
              className="w-full h-64 md:h-72 object-cover"
            />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Footprints className="w-4 h-4" />
              <span>{isHi ? 'NEAT (Non-Exercise Activity Thermogenesis)' : 'NEAT Power Factor'}</span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold font-display text-white">
              {isHi
                ? 'जिम में 1 घंटा vs दिनभर में 8,000-10,000 कदम: क्या ज्यादा चर्बी जलाता है?'
                : '1 Hour Heavy Gym vs. 8,000-10,000 Daily Steps: Which Burns More Fat?'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isHi
                ? 'जिम में 1 घंटे की भारी कसरत में केवल 250-300 कैलोरी जलती है, लेकिन इसके बाद भूख बहुत तेज लगती है जिससे लोग 500 कैलोरी ज्यादा खा लेते हैं! इसके विपरीत, दिनभर में 8k से 10k सामान्य वॉक करने से बिना जोड़ों पर दबाव डाले 350-450 कैलोरी सीधे फैट से जलती है और भूख भी नियंत्रित रहती है।'
                : 'Strenuous gym sessions often drive compensatory hunger and spike cortisol, sabotaging fat loss. In contrast, steady-state NEAT walking mobilizes fatty acids directly from visceral deposits without fatigue.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenMobility}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs md:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <HeartPulse className="w-4 h-4" />
                <span>{isHi ? '10 मिनट की आसान घरेलू मोबिलिटी रूटीन देखें' : 'View 10-Min Home Mobility Routine'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
