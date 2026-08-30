import React, { useState } from 'react';
import { SavedWord } from '../types';
import { speakText } from '../utils/speech';
import {
  BookmarkCheck,
  Search,
  Plus,
  Volume2,
  Trash2,
  Sparkles,
  RotateCw,
  Star,
  BookOpen,
  Check,
  Languages,
} from 'lucide-react';

interface VocabWalletProps {
  savedWords: SavedWord[];
  onAddWord: (word: Omit<SavedWord, 'id' | 'dateAdded' | 'masteryLevel'>) => void;
  onRemoveWord: (wordId: string) => void;
  onUpdateMastery: (wordId: string, level: number) => void;
}

export const VocabWallet: React.FC<VocabWalletProps> = ({
  savedWords,
  onAddWord,
  onRemoveWord,
  onUpdateMastery,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMode, setActiveMode] = useState<'grid' | 'flashcards'>('grid');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Add custom new word state
  const [newWordInput, setNewWordInput] = useState('');
  const [newTranslationInput, setNewTranslationInput] = useState('');
  const [newContextInput, setNewContextInput] = useState('');
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);

  // Auto translate typed word using Gemini API
  const handleAutoTranslate = async () => {
    if (!newWordInput.trim() || isAutoTranslating) return;
    setIsAutoTranslating(true);

    try {
      const res = await fetch('/api/gemini/translate-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: newWordInput.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translationAr) setNewTranslationInput(data.translationAr);
        if (data.exampleSentence) setNewContextInput(data.exampleSentence);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAutoTranslating(false);
    }
  };

  const handleAddNewWord = () => {
    if (!newWordInput.trim() || !newTranslationInput.trim()) return;
    onAddWord({
      word: newWordInput.trim(),
      translationAr: newTranslationInput.trim(),
      contextSentence: newContextInput.trim() || undefined,
    });
    setNewWordInput('');
    setNewTranslationInput('');
    setNewContextInput('');
  };

  // Filtered words
  const filteredWords = savedWords.filter(
    (w) =>
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.translationAr.includes(searchTerm)
  );

  const currentFlashcard = filteredWords[flashcardIndex] || filteredWords[0];

  return (
    <div className="space-y-8 font-arabic">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-900 via-rose-950 to-slate-900 border border-pink-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold border border-pink-500/30">
              <BookmarkCheck className="w-3.5 h-3.5" />
              بنك الكلمات والمفردات (Vocab Wallet)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              قاموسك الشخصي وبطاقات الذاكرة التفاعلية
            </h2>
            <p className="text-pink-200/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              احفظ الكلمات أثناء ممارسة المهارات الأربع ومارس مراجعتها ببطاقات الذاكرة (Flashcards) لترسيخها في الذاكرة طويلة المدى.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveMode('grid')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition ${
                activeMode === 'grid'
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              قائمة الكلمات
            </button>
            <button
              onClick={() => {
                setActiveMode('flashcards');
                setFlashcardIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeMode === 'flashcards'
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" /> بطاقات الذاكرة
            </button>
          </div>
        </div>
      </div>

      {/* Add New Word Quick Widget */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Plus className="w-4 h-4 text-pink-400" />
          إضافة كلمة جديدة إلى قاموسك
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <input
              type="text"
              value={newWordInput}
              onChange={(e) => setNewWordInput(e.target.value)}
              placeholder="الكلمة بالإنجليزية (Word)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
            />
            <button
              onClick={handleAutoTranslate}
              disabled={!newWordInput.trim() || isAutoTranslating}
              className="absolute left-2 top-2 px-2 py-1 bg-pink-950 text-pink-300 border border-pink-800 rounded-lg text-[10px] font-bold hover:bg-pink-900 transition flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" /> ترجمة ذكية
            </button>
          </div>

          <input
            type="text"
            value={newTranslationInput}
            onChange={(e) => setNewTranslationInput(e.target.value)}
            placeholder="الترجمة العربية..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
          />

          <div className="flex gap-2">
            <input
              type="text"
              value={newContextInput}
              onChange={(e) => setNewContextInput(e.target.value)}
              placeholder="جملة سياقية (اختياري)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
            />

            <button
              onClick={handleAddNewWord}
              disabled={!newWordInput.trim() || !newTranslationInput.trim()}
              className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-pink-600/20 shrink-0 flex items-center gap-1"
            >
              <Check className="w-4 h-4" /> حفظ
            </button>
          </div>
        </div>
      </div>

      {activeMode === 'grid' ? (
        <div className="space-y-4">
          {/* Search Field */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="بحث في الكلمات المسجلة..."
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 transition"
            />
          </div>

          {filteredWords.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold">لا توجد كلمات محفوظة تطابق بحثك حالياً.</p>
              <p className="text-xs">احفظ الكلمات أثناء ممارسة درجات الاستماع والقراءة لتجدها هنا.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWords.map((word) => (
                <div
                  key={word.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition space-y-3 relative group shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-pink-300 font-mono flex items-center gap-2">
                      {word.word}
                      <button
                        onClick={() => speakText(word.word)}
                        className="text-slate-400 hover:text-white transition"
                        title="استمع للنطق"
                      >
                        <Volume2 className="w-4 h-4 text-pink-400" />
                      </button>
                    </span>

                    <button
                      onClick={() => onRemoveWord(word.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                      title="حذف الكلمة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-sm font-bold text-white">{word.translationAr}</div>

                  {word.contextSentence && (
                    <div className="text-xs text-slate-400 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      "{word.contextSentence}"
                    </div>
                  )}

                  {/* Mastery Rating */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <span>مستوى الإتقان:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => onUpdateMastery(word.id, star)}
                          className="hover:scale-110 transition"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              star <= word.masteryLevel
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Flashcards Mode */
        <div className="max-w-xl mx-auto space-y-6">
          {filteredWords.length === 0 ? (
            <div className="text-center p-8 text-slate-400">لا توجد كلمات للتدريب عليها حالياً.</div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>
                  البطاقة {flashcardIndex + 1} من {filteredWords.length}
                </span>
                <span>انقر على البطاقة لقلبها</span>
              </div>

              {/* Flashcard Component */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full min-h-[260px] rounded-3xl border cursor-pointer transition-all duration-500 p-8 flex flex-col items-center justify-center text-center shadow-2xl relative ${
                  isFlipped
                    ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-pink-950 border-pink-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {!isFlipped ? (
                  /* Front Side (English) */
                  <div className="space-y-4 animate-fade-in">
                    <span className="text-xs text-pink-400 font-mono font-semibold">ENGLISH</span>
                    <h3 className="text-3xl font-bold text-white font-mono">{currentFlashcard.word}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(currentFlashcard.word);
                      }}
                      className="p-3 bg-pink-600/20 text-pink-300 rounded-full hover:bg-pink-600 hover:text-white transition inline-block"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                ) : (
                  /* Back Side (Arabic) */
                  <div className="space-y-4 animate-fade-in">
                    <span className="text-xs text-emerald-400 font-semibold">الترجمة والمعنى</span>
                    <h3 className="text-2xl font-bold text-white">{currentFlashcard.translationAr}</h3>
                    {currentFlashcard.contextSentence && (
                      <p className="text-xs text-slate-300 font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        "{currentFlashcard.contextSentence}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : filteredWords.length - 1));
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
                >
                  البطاقة السابقة
                </button>

                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-pink-600/30"
                >
                  قلب البطاقة 🔄
                </button>

                <button
                  onClick={() => {
                    setIsFlipped(false);
                    setFlashcardIndex((prev) => (prev < filteredWords.length - 1 ? prev + 1 : 0));
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
                >
                  البطاقة التالية
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
