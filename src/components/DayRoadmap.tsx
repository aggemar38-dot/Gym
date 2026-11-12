import React, { useState } from 'react';
import { DayRoadmapItem, Language } from '../types';
import { phasesInfo } from '../data/fatLossPlanData';
import { CheckCircle2, Circle, Calendar, Sparkles, ChevronRight, ChevronLeft, Award } from 'lucide-react';

interface DayRoadmapProps {
  roadmap: DayRoadmapItem[];
  setRoadmap: React.Dispatch<React.SetStateAction<DayRoadmapItem[]>>;
  currentDay: number;
  setCurrentDay: (day: number) => void;
  language: Language;
}

export const DayRoadmap: React.FC<DayRoadmapProps> = ({
  roadmap,
  setRoadmap,
  currentDay,
  setCurrentDay,
  language,
}) => {
  const isHi = language === 'hi';
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  const activeDayItem = roadmap.find((d) => d.day === currentDay) || roadmap[0];

  const toggleTask = (dayNum: number, taskId: string) => {
    setRoadmap((prev) =>
      prev.map((item) => {
        if (item.day !== dayNum) return item;
        return {
          ...item,
          tasks: item.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        };
      })
    );
  };

  const completedTasksToday = activeDayItem.tasks.filter((t) => t.completed).length;
  const totalTasksToday = activeDayItem.tasks.length;
  const dayProgressPct = Math.round((completedTasksToday / totalTasksToday) * 100);

  // Overall 60-day task completion
  const totalCompletedTasksOverall = roadmap.reduce(
    (acc, cur) => acc + cur.tasks.filter((t) => t.completed).length,
    0
  );
  const totalTasksOverall = roadmap.length * 6;
  const overallProgressPct = Math.round((totalCompletedTasksOverall / totalTasksOverall) * 100);

  return (
    <div className="space-y-8">
      {/* Header and Progress Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span>{isHi ? '60-दिवसीय व्यवस्थित योजना' : '60-Day Step-by-Step Blueprint'}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            {isHi ? 'दैनिक 60-दिन फैट लॉस रोडमैप' : 'Daily 60-Day Habit & Fat-Loss Roadmap'}
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {isHi
              ? 'प्रत्येक दिन के 6 आसान कार्यों को पूरा करें। निरंतरता ही 60 दिनों में 5 से 8 किलो वसा घटाने की असली कुंजी है।'
              : 'Check off daily habits. Consistency across 60 days guarantees metabolic fat reduction without extreme suffering.'}
          </p>
        </div>

        {/* Global Progress Card */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">{isHi ? 'कुल ट्रांसफॉर्मेशन प्रगति' : 'Total 60-Day Progress'}</span>
            <span className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
              {overallProgressPct}%
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 flex items-center justify-center font-mono font-bold text-xs text-white">
            {currentDay}/60
          </div>
        </div>
      </div>

      {/* 4 Phases Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {phasesInfo.map((p) => {
          const isPhaseActive = p.phase === activeDayItem.phase;
          return (
            <button
              key={p.phase}
              onClick={() => {
                setSelectedPhase(p.phase);
                if (p.phase === 1) setCurrentDay(1);
                else if (p.phase === 2) setCurrentDay(15);
                else if (p.phase === 3) setCurrentDay(29);
                else if (p.phase === 4) setCurrentDay(46);
              }}
              className={`text-left p-4 rounded-xl border transition-all ${
                isPhaseActive
                  ? 'bg-slate-900 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-mono text-emerald-400 mb-1">{p.days}</div>
              <h4 className="text-sm font-bold text-white mb-1.5">
                {isHi ? p.titleHi : p.titleEn}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {isHi ? p.descHi : p.descEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Day Selector Ribbon */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{isHi ? 'दिन चुनें (Days 1 to 60):' : 'Select Day (Days 1 to 60):'}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
              disabled={currentDay === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-40 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-white text-xs">
              {isHi ? `दिन ${currentDay}` : `Day ${currentDay}`}
            </span>
            <button
              onClick={() => setCurrentDay(Math.min(60, currentDay + 1))}
              disabled={currentDay === 60}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 disabled:opacity-40 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Day Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {roadmap.map((item) => {
            const isSelected = item.day === currentDay;
            const completedCount = item.tasks.filter((t) => t.completed).length;
            const isFullyDone = completedCount === item.tasks.length;

            return (
              <button
                key={item.day}
                onClick={() => setCurrentDay(item.day)}
                className={`min-w-10 h-10 rounded-lg text-xs font-mono font-semibold flex flex-col items-center justify-center transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400 shadow-sm'
                    : isFullyDone
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{item.day}</span>
                <span className="text-[9px] opacity-75">{completedCount}/6</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Main Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 mb-1">
              <span>{isHi ? `फेज ${activeDayItem.phase}` : `Phase ${activeDayItem.phase}`}</span>
              <span aria-hidden="true">·</span>
              <span>{isHi ? `दिन ${activeDayItem.day} of 60` : `Day ${activeDayItem.day} of 60`}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-white">
              {isHi ? activeDayItem.titleHi : activeDayItem.titleEn}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {isHi ? activeDayItem.focusHi : activeDayItem.focusEn}
            </p>
          </div>

          {/* Today's completion rate */}
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right shrink-0">
            <span className="text-xs text-slate-400 block">{isHi ? 'आज का स्कोर' : 'Today Score'}</span>
            <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
              {completedTasksToday} / {totalTasksToday} {isHi ? 'कार्य पूर्ण' : 'tasks done'} ({dayProgressPct}%)
            </span>
          </div>
        </div>

        {/* Action Tip Banner */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-emerald-300 block mb-0.5">
              {isHi ? 'आज का गोल्डन एक्शन टिप:' : 'Today’s Action Tip:'}
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {isHi ? activeDayItem.actionTipHi : activeDayItem.actionTipEn}
            </p>
          </div>
        </div>

        {/* Daily Checklist Tasks */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-300">
            {isHi ? 'आज के 6 आवश्यक नियम (चेक करें):' : 'Daily 6 Pillars Checklist (Tap to Mark Completed):'}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeDayItem.tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(activeDayItem.day, task.id)}
                className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  task.completed
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className={`text-sm font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                    {isHi ? task.labelHi : task.labelEn}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                    {task.target}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Milestone Celebration Box if fully complete */}
        {dayProgressPct === 100 && (
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>
                {isHi
                  ? `शानदार काम! दिन ${activeDayItem.day} के सभी कार्य पूरे हुए। आपका शरीर फैट बर्न मोड में है!`
                  : `Terrific job! Day ${activeDayItem.day} targets 100% completed. Your body is oxidizing fat!`}
              </span>
            </div>
            <button
              onClick={() => setCurrentDay(Math.min(60, currentDay + 1))}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors whitespace-nowrap"
            >
              {isHi ? 'अगले दिन पर जाएं' : 'Next Day →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
