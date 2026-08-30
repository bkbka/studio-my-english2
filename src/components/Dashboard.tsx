import React from 'react';
import { LevelType, UserStats, SkillType } from '../types';
import { LEVEL_DEFINITIONS } from '../data/initialData';
import { Headphones, Mic, BookOpen, PenTool, Sparkles, Trophy, ArrowLeft, Flame, Star, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  userStats: UserStats;
  savedWordsCount: number;
  onNavigateSkill: (skill: SkillType) => void;
  onOpenLevelModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userStats,
  savedWordsCount,
  onNavigateSkill,
  onOpenLevelModal,
}) => {
  const level = userStats?.level || 'beginner';
  const completedExercises = userStats?.completedExercises || [];
  const currentLevelInfo = LEVEL_DEFINITIONS.find((l) => l.id === level) || LEVEL_DEFINITIONS[0];

  const skillCards = [
    {
      id: 'listening' as SkillType,
      titleAr: 'مهارة الاستماع',
      titleEn: 'Listening Skill',
      descriptionAr: 'استمع إلى حوارات ونصوص متنوعة، مع إمكانية تحكّم السرعة، إخفاء النص، واختبارات الفهم.',
      icon: Headphones,
      gradient: 'from-blue-600 via-indigo-600 to-indigo-800',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      accentColor: 'text-blue-400',
      completedCount: completedExercises.filter((id) => id.startsWith('l_')).length,
      totalCount: 3,
    },
    {
      id: 'speaking' as SkillType,
      titleAr: 'مهارة التحدث',
      titleEn: 'Speaking Skill',
      descriptionAr: 'تدرب على النطق والسيناريوهات التفاعلية مع التعرف على الصوت وتقييم فوري بالذكاء الاصطناعي.',
      icon: Mic,
      gradient: 'from-amber-500 via-orange-600 to-red-600',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      accentColor: 'text-amber-400',
      completedCount: completedExercises.filter((id) => id.startsWith('s_')).length,
      totalCount: 4,
    },
    {
      id: 'reading' as SkillType,
      titleAr: 'مهارة القراءة',
      titleEn: 'Reading Skill',
      descriptionAr: 'مقالات ونصوص مع ترجمة فورية بالضغط على أي كلمة، واستماع صوتي للنص، وإنشاء مقالات ذكية.',
      icon: BookOpen,
      gradient: 'from-emerald-600 via-teal-600 to-green-700',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      accentColor: 'text-emerald-400',
      completedCount: completedExercises.filter((id) => id.startsWith('r_')).length,
      totalCount: 3,
    },
    {
      id: 'writing' as SkillType,
      titleAr: 'مهارة الكتابة',
      titleEn: 'Writing Skill',
      descriptionAr: 'معمل الكتابة الذكي: اكتب مقالات ورسائل مع تصحيح قواعدي شامل وإعادة صياغة متقدمة من الذكاء الاصطناعي.',
      icon: PenTool,
      gradient: 'from-purple-600 via-violet-600 to-fuchsia-700',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      accentColor: 'text-purple-400',
      completedCount: completedExercises.filter((id) => id.startsWith('w_')).length,
      totalCount: 3,
    },
  ];

  return (
    <div className="space-y-8 font-arabic">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              أهلاً بك في منصتك التفاعلية لإتقان الإنجليزية
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              تطوير المهارات الأربع الموحدة
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              تطبيقك المصمم خصيصاً لممارسة مهارات الاستماع، التحدث، القراءة، والكتابة كلاً على حدة مع تقييم ذكي فوري لكل مهارة.
            </p>
          </div>

          {/* Level Switcher Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg backdrop-blur">
            <div className="text-4xl bg-slate-800 p-2.5 rounded-xl border border-slate-700">
              {currentLevelInfo.badge}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">المستوى النشط</div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                {currentLevelInfo.titleAr}
                <span className="text-xs font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                  {currentLevelInfo.cefr}
                </span>
              </div>
              <button
                onClick={onOpenLevelModal}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold mt-1 underline underline-offset-2 transition"
              >
                تغيير المستوى
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            اختر المهارة للبدء في التمرين
          </h3>
          <span className="text-xs text-slate-400">4 مهارات أساسية مستقلة</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillCards.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.id}
                onClick={() => onNavigateSkill(skill.id)}
                className="group relative bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-950/40 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Gradient Accent Bar */}
                <div
                  className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${skill.gradient} group-hover:h-1.5 transition-all`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${skill.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full border ${skill.badgeBg}`}
                    >
                      {skill.completedCount}/{skill.totalCount} مكتمل
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                    {skill.titleAr}
                    <span className="text-xs font-normal text-slate-400 font-mono">
                      {skill.titleEn}
                    </span>
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {skill.descriptionAr}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-auto">
                  <span className={`text-xs font-bold ${skill.accentColor} flex items-center gap-1`}>
                    بدء تمرين {skill.titleAr}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-1">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gamification Stats & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streak & XP Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-slate-200 flex items-center gap-2 text-base">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            نشاطك المستمر
          </h4>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <div className="text-2xl font-black text-amber-400">{userStats?.streakDays || 0}</div>
              <div className="text-xs text-slate-400">أيام متتالية</div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <div className="text-2xl font-black text-emerald-400">{userStats?.xp || 0}</div>
              <div className="text-xs text-slate-400">مجموع XP</div>
            </div>
          </div>
        </div>

        {/* Dictionary Count */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-slate-200 flex items-center gap-2 text-base">
            <BookOpen className="w-5 h-5 text-sky-400" />
            قاموسك الشخصي
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            الكلمات المحفوظة أثناء القراءة والاستماع المتاحة للمراجعة ببطاقات الذاكرة.
          </p>
          <div className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
            <span className="text-sm font-semibold text-slate-300">الكلمات المسجلة</span>
            <span className="text-lg font-bold text-sky-400">{savedWordsCount} كلمة</span>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-slate-200 flex items-center gap-2 text-base">
            <Trophy className="w-5 h-5 text-purple-400" />
            الأوسمة والإنجازات
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              مستكشف المهارات
            </span>
            <span className="px-3 py-1.5 bg-amber-950 border border-amber-800 text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              شعلة الالتزام
            </span>
            <span className="px-3 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-emerald-400" />
              متحدث العصر
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
