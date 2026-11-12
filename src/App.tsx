import React, { useState, useEffect } from 'react';
import { UserProfile, CalculatedPlan, DayRoadmapItem, WeightLogEntry, Language } from './types';
import { defaultProfile, calculatePlan, generate60DayRoadmap } from './data/fatLossPlanData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CalorieCalculator } from './components/CalorieCalculator';
import { DietGuide } from './components/DietGuide';
import { DayRoadmap } from './components/DayRoadmap';
import { GoldenRules } from './components/GoldenRules';
import { SmartSwaps } from './components/SmartSwaps';
import { HomeMobilityGuide } from './components/HomeMobilityGuide';
import { FoodExplorer } from './components/FoodExplorer';
import { ProgressTracker } from './components/ProgressTracker';
import { AiCoachDrawer } from './components/AiCoachDrawer';
import { CustomPlanModal } from './components/CustomPlanModal';
import { Utensils, Calendar, RefreshCw, Footprints, Sparkles, Scale, HeartPulse } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('hi');
  const [currentTab, setCurrentTab] = useState<string>('overview');

  // Load User Profile from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('lean60_user_profile');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  // Calculate Plan
  const [calculatedPlan, setCalculatedPlan] = useState<CalculatedPlan>(() => calculatePlan(profile));

  useEffect(() => {
    const updated = calculatePlan(profile);
    setCalculatedPlan(updated);
    try {
      localStorage.setItem('lean60_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  // Load 60-Day Roadmap from localStorage
  const [roadmap, setRoadmap] = useState<DayRoadmapItem[]>(() => {
    try {
      const saved = localStorage.getItem('lean60_roadmap');
      return saved ? JSON.parse(saved) : generate60DayRoadmap();
    } catch {
      return generate60DayRoadmap();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lean60_roadmap', JSON.stringify(roadmap));
    } catch (e) {
      console.error(e);
    }
  }, [roadmap]);

  // Current day in 60-day plan
  const [currentDay, setCurrentDay] = useState<number>(1);

  // Weight logs
  const [weightLogs, setWeightLogs] = useState<WeightLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('lean60_weight_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('lean60_weight_logs', JSON.stringify(weightLogs));
    } catch (e) {
      console.error(e);
    }
  }, [weightLogs]);

  // Modals / Drawers
  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);
  const [isCustomPlanOpen, setIsCustomPlanOpen] = useState(false);

  const isHi = language === 'hi';

  const scrollToCalculator = () => {
    setCurrentTab('overview');
    setTimeout(() => {
      document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 3-Zone Sticky Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        onOpenAiCoach={() => setIsAiCoachOpen(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {currentTab === 'overview' && (
          <div className="space-y-12">
            {/* Hero Section with images & quick metrics */}
            <HeroSection
              language={language}
              onExploreDiet={() => setCurrentTab('diet')}
              onOpenCalculator={scrollToCalculator}
            />

            {/* Quick Access Feature Jump Banners */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button
                onClick={() => setCurrentTab('diet')}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <Utensils className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">
                  {isHi ? '4 मील प्लान' : '4 Meal Plans'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isHi ? 'शाकाहारी, अंडा, नॉन-वेज' : 'Veg, Egg, Non-Veg'}
                </div>
              </button>

              <button
                onClick={() => setCurrentTab('roadmap')}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <Calendar className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">
                  {isHi ? '60-दिन रोडमैप' : '60-Day Roadmap'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isHi ? 'दैनिक हैबिट चेकलिस्ट' : 'Daily Habits'}
                </div>
              </button>

              <button
                onClick={() => setCurrentTab('rules')}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <Footprints className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">
                  {isHi ? '7 सुनहरे नियम' : '7 Golden Rules'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isHi ? 'फूड सीक्वेंसिंग व वॉक' : 'Food sequencing'}
                </div>
              </button>

              <button
                onClick={() => setCurrentTab('swaps')}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <RefreshCw className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">
                  {isHi ? 'स्मार्ट स्वैप्स' : 'Smart Swaps'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isHi ? 'समोसा व चाय विकल्प' : 'Snack replacements'}
                </div>
              </button>

              <button
                onClick={() => setCurrentTab('mobility')}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <HeartPulse className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">
                  {isHi ? '10-मिनट मोबिलिटी' : '10-Min Mobility'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isHi ? 'जीरो जिम होम रूटीन' : 'Zero gym routine'}
                </div>
              </button>

              <button
                onClick={() => setCurrentTab('foods')}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
              >
                <Sparkles className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">
                  {isHi ? 'फूड स्कैनर' : 'Food Scanner'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isHi ? 'कैलोरी व मैक्रो चेक' : 'Calorie lookup'}
                </div>
              </button>
            </div>

            {/* Interactive Calorie & Deficit Calculator */}
            <CalorieCalculator
              profile={profile}
              setProfile={setProfile}
              calculatedPlan={calculatedPlan}
              language={language}
              onPlanUpdated={() => {
                // Keep updated
              }}
            />

            {/* Today's Active Day Snapshot */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-semibold text-emerald-400">
                    {isHi ? `आज का कार्य (दिन ${currentDay} of 60)` : `Today’s Focus (Day ${currentDay} of 60)`}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {isHi ? roadmap[currentDay - 1]?.titleHi : roadmap[currentDay - 1]?.titleEn}
                  </h3>
                </div>

                <button
                  onClick={() => setCurrentTab('roadmap')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>{isHi ? 'पूरा 60-दिन रोडमैप खोलें →' : 'View Full 60-Day Roadmap →'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {roadmap[currentDay - 1]?.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <span className="text-slate-300 line-clamp-1">
                      {isHi ? task.labelHi : task.labelEn}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        task.completed
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-900 text-slate-500'
                      }`}
                    >
                      {task.completed ? (isHi ? 'पूर्ण' : 'Done') : (isHi ? 'बाकी' : 'Pending')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentTab === 'diet' && (
          <DietGuide
            language={language}
            onOpenCustomPlanModal={() => setIsCustomPlanOpen(true)}
          />
        )}

        {currentTab === 'roadmap' && (
          <DayRoadmap
            roadmap={roadmap}
            setRoadmap={setRoadmap}
            currentDay={currentDay}
            setCurrentDay={setCurrentDay}
            language={language}
          />
        )}

        {currentTab === 'rules' && (
          <GoldenRules
            language={language}
            onOpenMobility={() => setCurrentTab('mobility')}
          />
        )}

        {currentTab === 'swaps' && <SmartSwaps language={language} />}

        {currentTab === 'mobility' && <HomeMobilityGuide language={language} />}

        {currentTab === 'foods' && <FoodExplorer language={language} />}

        {currentTab === 'tracker' && (
          <ProgressTracker
            profile={profile}
            calculatedPlan={calculatedPlan}
            weightLogs={weightLogs}
            setWeightLogs={setWeightLogs}
            currentDay={currentDay}
            language={language}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">Lean60</span>
              <span aria-hidden="true">·</span>
              <span>{isHi ? 'नो-जिम 60-दिन फैट लॉस व पोषण गाइड' : 'No-Gym 60-Day Fat Loss & Nutrition System'}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button onClick={() => setCurrentTab('overview')} className="hover:text-white">
                {isHi ? 'कैलकुलेटर' : 'Calculator'}
              </button>
              <button onClick={() => setCurrentTab('diet')} className="hover:text-white">
                {isHi ? 'डाइट चार्ट' : 'Diet'}
              </button>
              <button onClick={() => setCurrentTab('roadmap')} className="hover:text-white">
                {isHi ? 'रोडमैप' : 'Roadmap'}
              </button>
              <button onClick={() => setIsAiCoachOpen(true)} className="hover:text-emerald-400">
                {isHi ? 'AI कोच' : 'AI Coach'}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-900 pt-3">
            {isHi
              ? 'चिकित्सीय सूचना (Health Notice): यह एप्लिकेशन वैज्ञानिक पोषण सिद्धांतों, कैलोरी डेफिसिट और दैनिक कदमों (NEAT) पर आधारित सामान्य जीवनशैली मार्गदर्शन प्रदान करता है। किसी गंभीर बीमारी (जैसे मधुमेह, थायराइड, हृदय रोग) या गर्भावस्था के दौरान किसी भी नई डाइट को शुरू करने से पहले अपने डॉक्टर से सलाह लें।'
              : 'Medical Disclaimer: This application provides science-grounded nutritional guidance based on energy balance and non-exercise movement. Consult your licensed physician before initiating any dietary protocol if you have underlying medical conditions.'}
          </p>
        </div>
      </footer>

      {/* Floating AI Coach Trigger button for quick access on any tab */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsAiCoachOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-xl shadow-emerald-500/25 transition-all transform hover:scale-105"
        >
          <Sparkles className="w-5 h-5 text-slate-950" />
          <span className="text-xs sm:text-sm">{isHi ? 'लीन गुरु AI से पूछें' : 'Ask LeanGuru AI'}</span>
        </button>
      </div>

      {/* AI Coach Drawer */}
      <AiCoachDrawer
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        language={language}
        userProfile={profile}
      />

      {/* Custom AI Plan Generator Modal */}
      <CustomPlanModal
        isOpen={isCustomPlanOpen}
        onClose={() => setIsCustomPlanOpen(false)}
        language={language}
        userProfile={profile}
        calculatedPlan={calculatedPlan}
      />
    </div>
  );
}
