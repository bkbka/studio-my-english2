import React, { useState, useEffect } from 'react';
import { ListeningExercise, LevelType, SavedWord } from '../types';
import { LISTENING_LESSONS } from '../data/initialData';
import { speakText, stopSpeaking } from '../utils/speech';
import {
  Headphones,
  Play,
  Pause,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  HelpCircle,
  PlusCircle,
  Check,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface ListeningSkillProps {
  currentLevel: LevelType;
  onAddWord: (word: Omit<SavedWord, 'id' | 'dateAdded' | 'masteryLevel'>) => void;
  onCompleteExercise: (exerciseId: string, xpEarned: number) => void;
}

export const ListeningSkill: React.FC<ListeningSkillProps> = ({
  currentLevel,
  onAddWord,
  onCompleteExercise,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<ListeningExercise>(
    LISTENING_LESSONS.find((l) => l.level === currentLevel) || LISTENING_LESSONS[0]
  );

  useEffect(() => {
    const lesson = LISTENING_LESSONS.find((l) => l.level === currentLevel) || LISTENING_LESSONS[0];
    setSelectedExercise(lesson);
    setUserAnswers({});
    setSubmittedQuiz(false);
  }, [currentLevel]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.8); // Default 0.8 for clarity
  const [showTranscript, setShowTranscript] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);
  const [savedWordIds, setSavedWordIds] = useState<Set<string>>(new Set());

  // Fill in blanks state
  const [blankInputs, setBlankInputs] = useState<string[]>([]);
  const [checkedBlanks, setCheckedBlanks] = useState(false);

  // Handle Play Audio
  const handlePlayAudio = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(selectedExercise.audioText, playbackSpeed, () => {
        setIsPlaying(false);
      });
    }
  };

  const handleSelectExercise = (ex: ListeningExercise) => {
    stopSpeaking();
    setIsPlaying(false);
    setSelectedExercise(ex);
    setShowTranscript(false);
    setUserAnswers({});
    setSubmittedQuiz(false);
    setBlankInputs([]);
    setCheckedBlanks(false);
  };

  const handleSaveVocab = (vocab: { word: string; translationAr: string; meaningEn: string }) => {
    onAddWord({
      word: vocab.word,
      translationAr: vocab.translationAr,
      contextSentence: vocab.meaningEn,
    });
    setSavedWordIds((prev) => new Set(prev).add(vocab.word));
  };

  // Submit quiz
  const handleSubmitQuiz = () => {
    setSubmittedQuiz(true);
    let correctCount = 0;
    selectedExercise.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const xp = correctCount * 25 + 10;
    onCompleteExercise(selectedExercise.id, xp);
  };

  return (
    <div className="space-y-8 font-arabic">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-blue-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
              <Headphones className="w-3.5 h-3.5" />
              مهارة الاستماع (Listening)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              تدريب الأذن واستيعاب النطق الطبيعي
            </h2>
            <p className="text-blue-200/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              استمع للمقطع الصوتي بالسرعة التي تناسبك، اختبر مدى استيعابك بأسئلة تفاعلية، وتحدّ استماعك بإخفاء النص أولاً.
            </p>
          </div>

          {/* Level Filter Selector */}
          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-2xl border border-slate-800 shrink-0">
            {(['beginner', 'intermediate', 'advanced'] as LevelType[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  const found = LISTENING_LESSONS.find((l) => l.level === lvl);
                  if (found) handleSelectExercise(found);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedExercise.level === lvl
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {lvl === 'beginner' ? 'مبتدئ' : lvl === 'intermediate' ? 'متوسط' : 'متقدم'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of Exercises */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Headphones className="w-4 h-4 text-blue-400" />
            دروس الاستماع المتاحة
          </h3>

          <div className="space-y-2.5">
            {LISTENING_LESSONS.map((ex) => {
              const isSelected = selectedExercise.id === ex.id;
              return (
                <div
                  key={ex.id}
                  onClick={() => handleSelectExercise(ex)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/70 border-blue-500 shadow-lg shadow-blue-950/50'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      {ex.topic}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {ex.durationMinutes} دقائق
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{ex.titleAr}</h4>
                  <p className="text-xs text-slate-400 font-mono">{ex.titleEn}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Exercise Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Audio Player Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs text-blue-400 font-semibold font-mono">
                  {selectedExercise.topic} • {selectedExercise.level.toUpperCase()}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedExercise.titleAr}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedExercise.titleEn}</p>
              </div>

              {/* Playback Speed Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1" />
                {[0.6, 0.8, 1.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPlaybackSpeed(s)}
                    className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition ${
                      playbackSpeed === s
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Big Audio Play Button & Equalizer */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center">
              <button
                onClick={handlePlayAudio}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl group ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30 scale-105'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 fill-current" />
                ) : (
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                )}
              </button>

              <div className="text-xs font-medium text-slate-300">
                {isPlaying ? (
                  <span className="text-amber-400 font-bold flex items-center gap-2 animate-pulse">
                    <Volume2 className="w-4 h-4" /> جاري تشغيل المقطع الصوتي...
                  </span>
                ) : (
                  'اضغط للاستماع إلى المقطع بالإنجليزية'
                )}
              </div>

              {/* Audio Wave Visualizer Simulation */}
              <div className="flex items-center gap-1 h-8">
                {[40, 70, 30, 90, 60, 100, 40, 80, 50, 75, 35, 95, 60, 40].map((height, idx) => (
                  <div
                    key={idx}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlaying
                        ? 'bg-blue-400 animate-pulse'
                        : 'bg-slate-800'
                    }`}
                    style={{ height: isPlaying ? `${Math.max(15, Math.round(height * Math.random()))}%` : '20%' }}
                  />
                ))}
              </div>
            </div>

            {/* Show / Hide Transcript Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                {showTranscript ? (
                  <>
                    <EyeOff className="w-4 h-4 text-rose-400" /> إخفاء نص المحادثة (التحدي)
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-blue-400" /> إظهار النص المقروء (Transcript)
                  </>
                )}
              </button>

              <span className="text-xs text-slate-400">
                {showTranscript ? 'النص معروض' : 'مخفي لتدريب الأذن'}
              </span>
            </div>

            {/* Transcript Box */}
            {showTranscript && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-sm leading-relaxed text-indigo-100 whitespace-pre-line animate-fade-in">
                {selectedExercise.transcriptText}
              </div>
            )}
          </div>

          {/* Key Vocabulary Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              مفردات الدرس المهمة
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedExercise.keyVocabulary.map((vocab, idx) => {
                const isSaved = savedWordIds.has(vocab.word);
                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-sm text-indigo-200 font-mono">{vocab.word}</div>
                      <div className="text-xs text-slate-400">{vocab.translationAr}</div>
                    </div>
                    <button
                      onClick={() => handleSaveVocab(vocab)}
                      disabled={isSaved}
                      className={`p-2 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
                        isSaved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30'
                      }`}
                      title="حفظ في بنك الكلمات"
                    >
                      {isSaved ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quiz Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h4 className="font-bold text-white text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              اختبار فهم الاستماع (Comprehension Quiz)
            </h4>

            <div className="space-y-6">
              {selectedExercise.questions.map((q, qIdx) => {
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
                          btnStyle = 'bg-blue-600 text-white border-blue-500 font-bold';
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

            {/* Submit Quiz Action */}
            <div className="flex justify-end pt-2">
              {!submittedQuiz ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < selectedExercise.questions.length}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  تصحيح اختبار الاستماع
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
