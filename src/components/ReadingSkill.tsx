import React, { useState, useEffect } from 'react';
import { ReadingPassage, LevelType, SavedWord } from '../types';
import { READING_PASSAGES } from '../data/initialData';
import { speakText, stopSpeaking } from '../utils/speech';
import {
  BookOpen,
  Volume2,
  Languages,
  CheckCircle,
  XCircle,
  HelpCircle,
  PlusCircle,
  Check,
  Sparkles,
  Loader2,
  BookmarkCheck,
  RotateCcw,
  Plus,
} from 'lucide-react';

interface ReadingSkillProps {
  currentLevel: LevelType;
  onAddWord: (word: Omit<SavedWord, 'id' | 'dateAdded' | 'masteryLevel'>) => void;
  onCompleteExercise: (exerciseId: string, xpEarned: number) => void;
}

export const ReadingSkill: React.FC<ReadingSkillProps> = ({
  currentLevel,
  onAddWord,
  onCompleteExercise,
}) => {
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage>(
    READING_PASSAGES.find((r) => r.level === currentLevel) || READING_PASSAGES[0]
  );

  useEffect(() => {
    const passage = READING_PASSAGES.find((r) => r.level === currentLevel) || READING_PASSAGES[0];
    setSelectedPassage(passage);
    setUserAnswers({});
    setSubmittedQuiz(false);
  }, [currentLevel]);
  const [showParagraphTranslations, setShowParagraphTranslations] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);
  const [savedWordList, setSavedWordList] = useState<Set<string>>(new Set());

  // Click-to-Translate Modal / Tooltip State
  const [selectedWordData, setSelectedWordData] = useState<{
    word: string;
    translationAr: string;
    partOfSpeech?: string;
    definitionEn?: string;
    exampleSentence?: string;
  } | null>(null);
  const [isTranslatingWord, setIsTranslatingWord] = useState<boolean>(false);

  // Custom AI Generator state
  const [customTopic, setCustomTopic] = useState<string>('');
  const [isGeneratingArticle, setIsGeneratingArticle] = useState<boolean>(false);

  // Handle word click inside article
  const handleWordClick = async (rawWord: string) => {
    // Clean word from punctuation
    const cleanWord = rawWord.replace(/[^a-zA-Z]/g, '');
    if (!cleanWord || cleanWord.length < 2) return;

    // Check if word is already in vocabulary list of passage
    const foundInList = selectedPassage.vocabularyList.find(
      (v) => v.word.toLowerCase() === cleanWord.toLowerCase()
    );

    if (foundInList) {
      setSelectedWordData({
        word: foundInList.word,
        translationAr: foundInList.translationAr,
        partOfSpeech: foundInList.partOfSpeech,
        definitionEn: foundInList.example,
      });
      return;
    }

    // Call Gemini translation API
    setIsTranslatingWord(true);
    setSelectedWordData({ word: cleanWord, translationAr: 'جاري الترجمة...' });

    try {
      const res = await fetch('/api/gemini/translate-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: cleanWord, contextSentence: selectedPassage.contentEn }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedWordData({
          word: cleanWord,
          translationAr: data.translationAr,
          partOfSpeech: data.partOfSpeech,
          definitionEn: data.definitionEn,
          exampleSentence: data.exampleSentence,
        });
      }
    } catch (err) {
      console.error(err);
      setSelectedWordData({
        word: cleanWord,
        translationAr: 'تعذر الاتصال بالقاموس الإلكتروني',
      });
    } finally {
      setIsTranslatingWord(false);
    }
  };

  const handleSaveWordToWallet = () => {
    if (!selectedWordData) return;
    onAddWord({
      word: selectedWordData.word,
      translationAr: selectedWordData.translationAr,
      contextSentence: selectedWordData.exampleSentence || selectedWordData.definitionEn,
      partOfSpeech: selectedWordData.partOfSpeech,
    });
    setSavedWordList((prev) => new Set(prev).add(selectedWordData.word));
  };

  // Generate Custom Article with Gemini
  const handleGenerateCustomArticle = async () => {
    if (!customTopic.trim() || isGeneratingArticle) return;
    setIsGeneratingArticle(true);

    try {
      const res = await fetch('/api/gemini/generate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: customTopic, level: currentLevel }),
      });

      if (res.ok) {
        const data = await res.json();
        const customPassage: ReadingPassage = {
          id: `custom_${Date.now()}`,
          titleAr: data.titleAr || customTopic,
          titleEn: data.titleEn || customTopic,
          level: currentLevel,
          topic: customTopic,
          contentEn: data.contentEn,
          paragraphTranslationsAr: data.paragraphTranslationsAr || [],
          questions: data.questions || [],
          vocabularyList: data.vocabularyList || [],
        };
        setSelectedPassage(customPassage);
        setUserAnswers({});
        setSubmittedQuiz(false);
        setCustomTopic('');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إنشاء المقال بالذكاء الاصطناعي');
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  const handleSubmitQuiz = () => {
    setSubmittedQuiz(true);
    let correct = 0;
    selectedPassage.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) correct += 1;
    });
    onCompleteExercise(selectedPassage.id, correct * 20 + 15);
  };

  const paragraphs = selectedPassage.contentEn.split('\n\n');

  return (
    <div className="space-y-8 font-arabic">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              مهارة القراءة الاستيعابية (Reading)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              القراءة التفاعلية مع الترجمة الفورية بالضغط
            </h2>
            <p className="text-emerald-200/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              انقر على أي كلمة داخل النص لمعرفة معناها فوراً وحفظها في بنك المفردات، أو استمع للمقال بالصوت مع ترجمة الفقرات.
            </p>
          </div>

          {/* AI Generator Trigger */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex flex-col gap-2 shrink-0 max-w-xs">
            <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> اكتب أي موضوع لإنشاء مقال بالذكاء الاصطناعي:
            </span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="مثال: Space Travel, Coffee, AI..."
                className="bg-slate-900 border border-slate-700 text-xs rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500 w-full"
              />
              <button
                onClick={handleGenerateCustomArticle}
                disabled={!customTopic.trim() || isGeneratingArticle}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shrink-0 flex items-center gap-1"
              >
                {isGeneratingArticle ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Passages List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            المقالات المتاحة للقراءة
          </h3>

          <div className="space-y-2.5">
            {READING_PASSAGES.map((p) => {
              const isSelected = selectedPassage.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPassage(p);
                    setUserAnswers({});
                    setSubmittedQuiz(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/70 border-emerald-500 shadow-lg shadow-emerald-950/50'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {p.topic}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {p.level.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{p.titleAr}</h4>
                  <p className="text-xs text-slate-400 font-mono">{p.titleEn}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Article View & Interactive Tools */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 relative">
            {/* Article Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-emerald-400 font-mono font-semibold">
                  موضوع: {selectedPassage.topic}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedPassage.titleAr}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedPassage.titleEn}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(selectedPassage.contentEn)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" /> قراءة صوتیة للنص كامل
                </button>

                <button
                  onClick={() => setShowParagraphTranslations(!showParagraphTranslations)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Languages className="w-4 h-4 text-emerald-400" />
                  {showParagraphTranslations ? 'إخفاء ترجمة الفقرات' : 'إظهار ترجمة الفقرات'}
                </button>
              </div>
            </div>

            {/* Interactive Article Content */}
            <div className="space-y-6">
              {paragraphs.map((paragraph, pIdx) => (
                <div
                  key={pIdx}
                  className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-2xl space-y-3"
                >
                  {/* Clickable Words Paragraph */}
                  <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-serif tracking-wide select-none">
                    {paragraph.split(' ').map((word, wIdx) => (
                      <span
                        key={wIdx}
                        onClick={() => handleWordClick(word)}
                        className="hover:bg-emerald-500/20 hover:text-emerald-300 rounded px-1 cursor-pointer transition duration-150 inline-block mr-1"
                        title="انقر لترجمة هذه الكلمة"
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </p>

                  {/* Optional Paragraph Translation */}
                  {showParagraphTranslations && selectedPassage.paragraphTranslationsAr[pIdx] && (
                    <div className="pt-3 border-t border-slate-800/80 text-xs text-emerald-200/90 leading-relaxed font-arabic bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/40">
                      💡 {selectedPassage.paragraphTranslationsAr[pIdx]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Dictionary Popover / Modal for clicked word */}
            {selectedWordData && (
              <div className="p-4 bg-slate-950 border border-emerald-500/50 rounded-2xl shadow-2xl space-y-3 animate-fade-in relative">
                <button
                  onClick={() => setSelectedWordData(null)}
                  className="absolute top-3 left-3 text-slate-400 hover:text-white text-xs"
                >
                  إغلاق ✕
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    {selectedWordData.word}
                  </span>
                  {selectedWordData.partOfSpeech && (
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {selectedWordData.partOfSpeech}
                    </span>
                  )}
                  <button
                    onClick={() => speakText(selectedWordData.word)}
                    className="p-1 hover:bg-slate-800 text-slate-300 rounded"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>

                <div className="text-sm font-bold text-white">
                  الترجمة العربية: {selectedWordData.translationAr}
                </div>

                {selectedWordData.definitionEn && (
                  <div className="text-xs text-slate-400 font-mono">
                    مثال/معنى: {selectedWordData.definitionEn}
                  </div>
                )}

                <button
                  onClick={handleSaveWordToWallet}
                  disabled={savedWordList.has(selectedWordData.word)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    savedWordList.has(selectedWordData.word)
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                  }`}
                >
                  {savedWordList.has(selectedWordData.word) ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> تم الحفظ في بنك الكلمات
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5" /> حفظ هذه الكلمة لحفظها لاحقاً
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Vocabulary List Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-emerald-400" />
              قائمة المفردات المستهدفة في المقال
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedPassage.vocabularyList.map((item, idx) => {
                const isSaved = savedWordList.has(item.word);
                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-sm text-emerald-300 font-mono flex items-center gap-1.5">
                        {item.word}
                        <button
                          onClick={() => speakText(item.word)}
                          className="hover:text-white"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </div>
                      <div className="text-xs text-slate-300">{item.translationAr}</div>
                    </div>

                    <button
                      onClick={() => {
                        onAddWord({
                          word: item.word,
                          translationAr: item.translationAr,
                          partOfSpeech: item.partOfSpeech,
                          contextSentence: item.example,
                        });
                        setSavedWordList((prev) => new Set(prev).add(item.word));
                      }}
                      disabled={isSaved}
                      className={`p-2 rounded-xl text-xs font-semibold transition ${
                        isSaved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30'
                      }`}
                    >
                      {isSaved ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Article Comprehension Quiz */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              أسئلة استيعاب القراءة (Comprehension Questions)
            </h4>

            <div className="space-y-6">
              {selectedPassage.questions.map((q, qIdx) => {
                const selectedOption = userAnswers[q.id];
                const isCorrect = selectedOption === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="font-semibold text-sm text-white">
                      {qIdx + 1}. {q.questionAr || q.questionEn}
                      <span className="block text-xs text-slate-400 font-mono mt-0.5">{q.questionEn}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle =
                          'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800';

                        if (selectedOption === optIdx) {
                          btnStyle = 'bg-emerald-600 text-white border-emerald-500 font-bold';
                        }

                        if (submittedQuiz) {
                          if (optIdx === q.correctAnswer) {
                            btnStyle = 'bg-emerald-600 text-white border-emerald-400 font-bold';
                          } else if (selectedOption === optIdx) {
                            btnStyle = 'bg-rose-600 text-white border-rose-400';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={submittedQuiz}
                            onClick={() =>
                              setUserAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                            }
                            className={`p-3 rounded-xl border text-xs text-right transition ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {submittedQuiz && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                          isCorrect
                            ? 'bg-emerald-950/60 border border-emerald-800/80 text-emerald-200'
                            : 'bg-rose-950/60 border border-rose-800/80 text-rose-200'
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold">{isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة.'}</span>{' '}
                          {q.explanationAr}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Actions */}
            <div className="flex justify-end pt-2">
              {!submittedQuiz ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < selectedPassage.questions.length}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-600/30"
                >
                  تصحيح اختبار القراءة
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSubmittedQuiz(false);
                    setUserAnswers({});
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> إعادة الاختبار
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
