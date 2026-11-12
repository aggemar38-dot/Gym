import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { homeMobilityRoutines } from '../data/fatLossPlanData';
import { Play, Pause, RotateCcw, HeartPulse, CheckCircle, ShieldCheck } from 'lucide-react';

interface HomeMobilityGuideProps {
  language: Language;
}

export const HomeMobilityGuide: React.FC<HomeMobilityGuideProps> = ({ language }) => {
  const isHi = language === 'hi';

  // Timer state (seconds)
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimerSeconds(600);
  };

  const activeMove = homeMobilityRoutines[activeExerciseIdx];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <HeartPulse className="w-4 h-4" />
            <span>{isHi ? 'घर पर 10-12 मिनट रूटीन' : 'Zero Gym Equipment Home Movement'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            {isHi ? 'घरेलू नो-जिम मोबिलिटी और फैट एक्टिवेशन' : 'Daily 10-Min Home Mobility & Metabolic Pump'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isHi
              ? 'बिना भारी वजन या मशीनों के शरीर की बड़ी मांसपेशियों (क्वैड्स, ग्लूट्स, कोर, सोलियस) को उत्तेजित करें जो दिनभर इंसुलिन को शांत और फैट बर्न को चालू रखती हैं।'
              : 'Gentle, impact-free home movements that activate major muscle beds to clear blood glucose and elevate metabolic rate all day.'}
          </p>
        </div>

        {/* Live Timer Interactive Box */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-5 shrink-0">
          <div>
            <span className="text-[11px] text-slate-400 block">{isHi ? '10 मिनट टाइमर' : '10-Min Session'}</span>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
              {formatTime(timerSeconds)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all"
              title={isRunning ? 'Pause' : 'Start'}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <button
              onClick={resetTimer}
              className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-all"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Routine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {homeMobilityRoutines.map((routine, idx) => {
          const isCurrent = activeExerciseIdx === idx;

          return (
            <div
              key={routine.id}
              onClick={() => setActiveExerciseIdx(idx)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all text-left space-y-3 ${
                isCurrent
                  ? 'bg-slate-900 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">
                  {routine.duration}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {isHi ? 'घर का कमरा / लिविंग एरिया' : 'Living Room / Bedroom'}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">
                {isHi ? routine.nameHi : routine.nameEn}
              </h3>

              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-emerald-400 font-medium block text-[11px] mb-0.5">
                  {isHi ? 'लक्षित मांसपेशी / लाभ:' : 'Target & Benefit:'}
                </span>
                <span className="text-slate-300">{isHi ? routine.targetHi : routine.targetEn}</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {isHi ? routine.instructionHi : routine.instructionEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* Reassurance Banner */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300">
          <span className="font-semibold text-white block">
            {isHi ? 'याद रखें: फैट लॉस के लिए जिम की आवश्यकता नहीं है' : 'Reminder: Gym Is Completely Optional for Fat Loss'}
          </span>
          <p className="leading-relaxed">
            {isHi
              ? 'मानव शरीर लाखों वर्षों से सिर्फ चलने और साधारण दैनिक कार्यों से फिट रहा है। यदि आप अपनी डाइट में 500 कैलोरी की कटौती बनाए रखते हैं और दिनभर में 8-10 हजार कदम चलते हैं, तो आपका वजन जिम जाने वाले किसी भी व्यक्ति जितनी ही तेजी से घटेगा।'
              : 'Human physiology oxidizes body fat strictly based on systemic energy deficit and steady daily movement. Combining this 10-minute activation with 8k steps and home diet creates ideal hormonal conditions for fat breakdown.'}
          </p>
        </div>
      </div>
    </div>
  );
};
