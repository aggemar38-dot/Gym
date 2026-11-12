import React from 'react';
import { Sparkles, Languages } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenAiCoach: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  onOpenAiCoach,
}) => {
  const isHi = language === 'hi';

  const navLinks = [
    { id: 'overview', label: isHi ? 'प्लान अवलोकन' : 'Overview' },
    { id: 'diet', label: isHi ? 'डाइट गाइड' : 'Diet Plans' },
    { id: 'roadmap', label: isHi ? '60-दिन रोडमैप' : '60-Day Roadmap' },
    { id: 'rules', label: isHi ? '7 सुनहरे नियम' : 'Golden Rules' },
    { id: 'swaps', label: isHi ? 'स्मार्ट स्वैप्स' : 'Smart Swaps' },
    { id: 'tracker', label: isHi ? 'प्रोग्रेस ट्रैकर' : 'Tracker' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setCurrentTab('overview');
          }}
          className="text-lg md:text-xl font-bold font-display tracking-tight text-white flex items-center gap-2 whitespace-nowrap shrink-0 hover:text-emerald-400 transition-colors"
        >
          <span className="text-emerald-400">Lean60</span>
          <span className="text-slate-400 text-sm font-normal">
            {isHi ? 'नो-जिम फैट बर्न' : 'No-Gym Fat Loss'}
          </span>
        </a>

        {/* Zone 2: 4-6 concise single-line text links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                  isActive
                    ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Language Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(isHi ? 'en' : 'hi')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors whitespace-nowrap shrink-0"
            title="भाषा बदलें / Change Language"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHi ? 'English' : 'हिंदी'}</span>
          </button>

          {/* AI Coach Button */}
          <button
            onClick={onOpenAiCoach}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs md:text-sm shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isHi ? 'आहार AI कोच' : 'AI Diet Coach'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-slate-950/95 scrollbar-none gap-2">
        {navLinks.map((link) => {
          const isActive = currentTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setCurrentTab(link.id)}
              className={`px-3 py-1 text-xs whitespace-nowrap rounded-md font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
