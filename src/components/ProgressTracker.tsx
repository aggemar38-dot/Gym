import React, { useState } from 'react';
import { UserProfile, CalculatedPlan, WeightLogEntry, Language } from '../types';
import { Scale, TrendingDown, Plus, Trash2, Calendar, Target, Award } from 'lucide-react';

interface ProgressTrackerProps {
  profile: UserProfile;
  calculatedPlan: CalculatedPlan;
  weightLogs: WeightLogEntry[];
  setWeightLogs: React.Dispatch<React.SetStateAction<WeightLogEntry[]>>;
  currentDay: number;
  language: Language;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  profile,
  calculatedPlan,
  weightLogs,
  setWeightLogs,
  currentDay,
  language,
}) => {
  const isHi = language === 'hi';

  const [inputWeight, setInputWeight] = useState<string>('');
  const [inputWaist, setInputWaist] = useState<string>('');
  const [inputNotes, setInputNotes] = useState<string>('');

  const currentLoggedWeight =
    weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weightKg : profile.currentWeightKg;
  const initialWeight = profile.currentWeightKg;
  const targetWeight = profile.targetWeightKg;

  const totalLost = Math.max(0, Math.round((initialWeight - currentLoggedWeight) * 10) / 10);
  const remaining = Math.max(0, Math.round((currentLoggedWeight - targetWeight) * 10) / 10);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const wt = parseFloat(inputWeight);
    if (isNaN(wt) || wt <= 30 || wt >= 250) return;

    const newEntry: WeightLogEntry = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dayNumber: currentDay,
      weightKg: wt,
      waistCm: inputWaist ? parseFloat(inputWaist) : undefined,
      notes: inputNotes.trim() || undefined,
    };

    setWeightLogs((prev) => [...prev, newEntry]);
    setInputWeight('');
    setInputWaist('');
    setInputNotes('');
  };

  const handleDeleteLog = (id: string) => {
    setWeightLogs((prev) => prev.filter((item) => item.id !== id));
  };

  // Generate 8-point ideal target progression curve for the 60 days
  const targetTrajectory = [
    { day: 1, wt: initialWeight },
    { day: 14, wt: Math.round((initialWeight - (initialWeight - targetWeight) * 0.3) * 10) / 10 },
    { day: 28, wt: Math.round((initialWeight - (initialWeight - targetWeight) * 0.55) * 10) / 10 },
    { day: 45, wt: Math.round((initialWeight - (initialWeight - targetWeight) * 0.8) * 10) / 10 },
    { day: 60, wt: targetWeight },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
          <TrendingDown className="w-4 h-4" />
          <span>{isHi ? 'मापन एवं परिणाम' : 'Measurement & Results'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
          {isHi ? '60-दिन वजन एवं कमर माप ट्रैकर' : '60-Day Weight & Waist Progress Log'}
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          {isHi
            ? 'सप्ताह में 1 या 2 बार सुबह खाली पेट अपना वजन दर्ज करें। दैनिक उतार-चढ़ाव से परेशान न हों, 60 दिन के ट्रेंड पर नजर रखें।'
            : 'Log your morning weight 1-2 times weekly. Focus on the overarching 60-day downward trend.'}
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">{isHi ? 'शुरुआती वजन' : 'Start Weight'}</span>
          <div className="text-2xl font-bold font-display text-white tabular-nums">
            {initialWeight} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">{isHi ? 'वर्तमान वजन' : 'Current Weight'}</span>
          <div className="text-2xl font-bold font-display text-emerald-400 tabular-nums">
            {currentLoggedWeight} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">{isHi ? 'कुल कमी' : 'Total Fat Lost'}</span>
          <div className="text-2xl font-bold font-display text-emerald-400 tabular-nums">
            -{totalLost} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">{isHi ? 'लक्ष्य तक बाकी' : 'To 60-Day Goal'}</span>
          <div className="text-2xl font-bold font-display text-amber-400 tabular-nums">
            {remaining} <span className="text-xs text-slate-500 font-normal">kg</span>
          </div>
        </div>
      </div>

      {/* Visual SVG Progression Graph */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
              <span>{isHi ? '60-दिन का आदर्श लक्ष्य मार्ग' : 'Ideal 60-Day Path'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white inline-block" />
              <span>{isHi ? 'आपकी वास्तविक प्रविष्टियां' : 'Your Actual Entries'}</span>
            </span>
          </div>
          <span className="font-mono text-emerald-400">Day 1 ➔ Day 60</span>
        </div>

        <div className="relative h-44 w-full flex items-end justify-between pt-6 pb-4 px-2 border-b border-slate-800">
          {targetTrajectory.map((t, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 z-10">
              <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                {t.wt}kg
              </span>
              <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-slate-950" />
              <span className="text-[10px] text-slate-400 font-mono mt-1">
                D{t.day}
              </span>
            </div>
          ))}

          {/* Background trajectory line */}
          <div className="absolute left-8 right-8 top-1/2 h-0.5 bg-gradient-to-r from-emerald-500/40 via-teal-500/40 to-emerald-400/80 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Log Form and History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleAddLog} className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>{isHi ? 'नया वजन / माप दर्ज करें' : 'Log New Measurement'}</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isHi ? 'आज का वजन (kg)' : 'Today’s Weight (kg)'}
            </label>
            <input
              type="number"
              step="0.1"
              min="35"
              max="200"
              required
              placeholder="उदा: 78.5"
              value={inputWeight}
              onChange={(e) => setInputWeight(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isHi ? 'कमर का घेरा (cm / इंच) (वैकल्पिक)' : 'Waist Circumference (optional)'}
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="उदा: 88"
              value={inputWaist}
              onChange={(e) => setInputWaist(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isHi ? 'नोट्स (उदा: हल्का महसूस हुआ, 10k कदम किए)' : 'Notes'}
            </label>
            <input
              type="text"
              placeholder={isHi ? 'कैसा महसूस हो रहा है...' : 'Feeling energized...'}
              value={inputNotes}
              onChange={(e) => setInputNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
          >
            {isHi ? 'प्रविष्टि जोड़ें' : 'Save Entry'}
          </button>
        </form>

        {/* History Column */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-base font-bold text-white">
            {isHi ? 'हालिया माप इतिहास' : 'Recent Measurement Logs'}
          </h3>

          {weightLogs.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-400">
              {isHi
                ? 'अभी तक कोई वजन प्रविष्टि दर्ज नहीं की गई है। बाईं ओर से अपनी पहली माप जोड़ें!'
                : 'No measurements logged yet. Use the form to log your first weigh-in.'}
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {weightLogs.slice().reverse().map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-emerald-400 font-bold text-sm tabular-nums">
                      {log.weightKg} kg
                    </span>
                    {log.waistCm && (
                      <span className="text-slate-400 font-mono">
                        कमर: {log.waistCm} cm
                      </span>
                    )}
                    {log.notes && (
                      <span className="text-slate-400 italic">"{log.notes}"</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono">{log.date}</span>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
