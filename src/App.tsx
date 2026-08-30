import React, { useState, useEffect } from 'react';
import { SkillType, LevelType, SavedWord, UserStats } from './types';
import { INITIAL_USER_STATS, INITIAL_SAVED_WORDS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { SkillTabs } from './components/SkillTabs';
import { LevelSelectorModal } from './components/LevelSelectorModal';
import { Dashboard } from './components/Dashboard';
import { ListeningSkill } from './components/ListeningSkill';
import { SpeakingSkill } from './components/SpeakingSkill';
import { ReadingSkill } from './components/ReadingSkill';
import { WritingSkill } from './components/WritingSkill';
import { VocabWallet } from './components/VocabWallet';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  // LocalStorage state initialization
  const [activeTab, setActiveTab] = useState<SkillType>('dashboard');
  const [isLevelModalOpen, setIsLevelModalOpen] = useState<boolean>(false);

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('cambridge_user_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...INITIAL_USER_STATS,
            ...parsed,
            level: parsed.level || INITIAL_USER_STATS.level,
            completedExercises: Array.isArray(parsed.completedExercises) ? parsed.completedExercises : INITIAL_USER_STATS.completedExercises,
          };
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER_STATS;
  });

  const [savedWords, setSavedWords] = useState<SavedWord[]>(() => {
    const saved = localStorage.getItem('cambridge_saved_words');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAVED_WORDS;
  });

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cambridge_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('cambridge_saved_words', JSON.stringify(savedWords));
  }, [savedWords]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Change student level
  const handleLevelSelect = (newLevel: LevelType) => {
    setUserStats((prev) => ({ ...prev, level: newLevel }));
    setIsLevelModalOpen(false);
    showToast(`تم تغيير مستواك الدراسي بنجاح إلى ${newLevel.toUpperCase()}`);
  };

  // Add word to vocabulary wallet
  const handleAddWord = (wordData: Omit<SavedWord, 'id' | 'dateAdded' | 'masteryLevel'>) => {
    const existing = savedWords.find(
      (w) => w.word.toLowerCase() === wordData.word.toLowerCase()
    );

    if (existing) {
      showToast(`الكلمة "${wordData.word}" موجودة بالفعل في بنك المفردات`);
      return;
    }

    const newWord: SavedWord = {
      ...wordData,
      id: `word_${Date.now()}`,
      dateAdded: new Date().toISOString(),
      masteryLevel: 1,
    };

    setSavedWords((prev) => [newWord, ...prev]);
    showToast(`تمت إضافة الكلمة "${wordData.word}" إلى بنك المفردات 📚`);
  };

  // Remove word from vocabulary wallet
  const handleRemoveWord = (wordId: string) => {
    setSavedWords((prev) => prev.filter((w) => w.id !== wordId));
    showToast('تمت إزالة الكلمة من بنك المفردات');
  };

  // Update mastery level for word
  const handleUpdateMastery = (wordId: string, level: number) => {
    setSavedWords((prev) =>
      prev.map((w) => (w.id === wordId ? { ...w, masteryLevel: level } : w))
    );
  };

  // Record completed exercise and reward XP
  const handleCompleteExercise = (exerciseId: string, xpEarned: number) => {
    if (userStats.completedExercises.includes(exerciseId)) {
      showToast(`أحسنت! أعدت التمرين وحصلت على +${Math.round(xpEarned / 2)} نقاط خبرة extra`);
      setUserStats((prev) => ({ ...prev, xp: prev.xp + Math.round(xpEarned / 2) }));
      return;
    }

    setUserStats((prev) => ({
      ...prev,
      xp: prev.xp + xpEarned,
      completedExercises: [...prev.completedExercises, exerciseId],
    }));

    showToast(`مبارك! أكملت التمرين بنجاح وكسبت +${xpEarned} نقطة خبرة 🌟`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white font-arabic">
      {/* Navbar */}
      <Navbar
        userStats={userStats}
        savedWordsCount={savedWords.length}
        onOpenLevelModal={() => setIsLevelModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs for Skills */}
        <SkillTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          wordCount={savedWords.length}
        />

        {/* Tab View Switcher */}
        <div className="mt-6">
          {activeTab === 'dashboard' && (
            <Dashboard
              userStats={userStats}
              savedWordsCount={savedWords.length}
              onNavigateSkill={setActiveTab}
              onOpenLevelModal={() => setIsLevelModalOpen(true)}
            />
          )}

          {activeTab === 'listening' && (
            <ListeningSkill
              currentLevel={userStats.level}
              onAddWord={handleAddWord}
              onCompleteExercise={handleCompleteExercise}
            />
          )}

          {activeTab === 'speaking' && (
            <SpeakingSkill
              currentLevel={userStats.level}
              onCompleteExercise={handleCompleteExercise}
            />
          )}

          {activeTab === 'reading' && (
            <ReadingSkill
              currentLevel={userStats.level}
              onAddWord={handleAddWord}
              onCompleteExercise={handleCompleteExercise}
            />
          )}

          {activeTab === 'writing' && (
            <WritingSkill
              currentLevel={userStats.level}
              onCompleteExercise={handleCompleteExercise}
            />
          )}

          {activeTab === 'wallet' && (
            <VocabWallet
              savedWords={savedWords}
              onAddWord={handleAddWord}
              onRemoveWord={handleRemoveWord}
              onUpdateMastery={handleUpdateMastery}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/50 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>منصة تعليم وتدريب المهارات الأربعة للغة الإنجليزية المعتمدة على الذكاء الاصطناعي</span>
          <span className="font-mono text-slate-400">CEFR Framework: A1 • A2 • B1 • B2 • C1</span>
        </div>
      </footer>

      {/* Level Selector Modal */}
      {isLevelModalOpen && (
        <LevelSelectorModal
          currentLevel={userStats.level}
          onSelectLevel={handleLevelSelect}
          onClose={() => setIsLevelModalOpen(false)}
        />
      )}

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-sky-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
          <span className="text-xs font-bold font-arabic">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
