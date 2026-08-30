import React from 'react';
import { UserStats } from '../types';
import { LEVEL_DEFINITIONS } from '../data/initialData';
import { Flame, Star, BookMarked, Sparkles, ChevronDown } from 'lucide-react';

interface NavbarProps {
  userStats: UserStats;
  savedWordsCount: number;
  onOpenLevelModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  userStats,
  savedWordsCount,
  onOpenLevelModal,
}) => {
  const currentLevel = userStats?.level || 'beginner';
  const levelInfo = LEVEL_DEFINITIONS.find((l) => l.id === currentLevel) || LEVEL_DEFINITIONS[0];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-amber-400 p-0.5 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
              English Master
            </h1>
            <p className="text-[11px] text-indigo-300/80 font-arabic font-medium -mt-1">
              أكاديمية المهارات الأربع
            </p>
          </div>
        </div>

        {/* Level Selector Button & Gamification Stats */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Level Switcher */}
          <button
            onClick={onOpenLevelModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 text-indigo-200 text-xs sm:text-sm font-medium transition-all shadow-sm group"
            title="تغيير المستوى التعليمي"
          >
            <span className="text-base">{levelInfo.badge}</span>
            <span className="font-arabic font-semibold">{levelInfo.titleAr}</span>
            <span className="bg-indigo-800/80 text-indigo-100 px-1.5 py-0.5 rounded text-[10px] font-mono">
              {levelInfo.cefr}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* User Gamification Stats */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-full px-3 py-1 text-xs">
            {/* Streak */}
            <div className="flex items-center gap-1 text-amber-400 font-semibold" title="أيام التفاعل المتتالية">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 animate-bounce" />
              <span>{userStats?.streakDays || 0}</span>
              <span className="text-[10px] text-slate-400 font-arabic font-normal">يوم</span>
            </div>

            <div className="w-px h-3.5 bg-slate-800" />

            {/* XP */}
            <div className="flex items-center gap-1 text-emerald-400 font-semibold" title="نقاط الخبرة المكتسبة">
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span>{userStats?.xp || 0}</span>
              <span className="text-[10px] text-slate-400 font-arabic font-normal">XP</span>
            </div>

            <div className="w-px h-3.5 bg-slate-800" />

            {/* Saved Words */}
            <div className="flex items-center gap-1 text-sky-400 font-semibold" title="كلمات القاموس المحفوظة">
              <BookMarked className="w-4 h-4 text-sky-400" />
              <span>{savedWordsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
