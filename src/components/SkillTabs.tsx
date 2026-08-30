import React from 'react';
import { Headphones, Mic, BookOpen, PenTool, LayoutDashboard, BookmarkCheck } from 'lucide-react';
import { SkillType } from '../types';

interface SkillTabsProps {
  activeTab: SkillType;
  onTabChange: (tab: SkillType) => void;
  wordCount: number;
}

export const SkillTabs: React.FC<SkillTabsProps> = ({
  activeTab,
  onTabChange,
  wordCount,
}) => {
  const tabs = [
    {
      id: 'dashboard' as SkillType,
      labelAr: 'الرئيسية',
      labelEn: 'Dashboard',
      icon: LayoutDashboard,
      color: 'from-slate-600 to-slate-800',
    },
    {
      id: 'listening' as SkillType,
      labelAr: 'الاستماع',
      labelEn: 'Listening',
      icon: Headphones,
      badge: 'AUDIO',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'speaking' as SkillType,
      labelAr: 'التحدث',
      labelEn: 'Speaking',
      icon: Mic,
      badge: 'AI VOICE',
      color: 'from-amber-500 to-orange-600',
    },
    {
      id: 'reading' as SkillType,
      labelAr: 'القراءة',
      labelEn: 'Reading',
      icon: BookOpen,
      badge: 'TEXT',
      color: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'writing' as SkillType,
      labelAr: 'الكتابة',
      labelEn: 'Writing',
      icon: PenTool,
      badge: 'ESSAY',
      color: 'from-purple-600 to-violet-700',
    },
    {
      id: 'wallet' as SkillType,
      labelAr: 'بنك الكلمات',
      labelEn: 'Vocab Wallet',
      icon: BookmarkCheck,
      count: wordCount,
      color: 'from-pink-600 to-rose-700',
    },
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-16 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap font-arabic shrink-0 relative ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-md border border-slate-700 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow`
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex flex-col text-right">
                  <span className="leading-tight">{tab.labelAr}</span>
                  <span className="text-[10px] text-slate-500 font-mono font-normal">
                    {tab.labelEn}
                  </span>
                </div>

                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
