import React, { useState, useEffect } from 'react';
import { WritingPrompt, LevelType, WritingFeedback } from '../types';
import { WRITING_PROMPTS } from '../data/initialData';
import { speakText } from '../utils/speech';
import {
  PenTool,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  Volume2,
  Copy,
  Check,
  RefreshCw,
  FileText,
} from 'lucide-react';

interface WritingSkillProps {
  currentLevel: LevelType;
  onCompleteExercise: (exerciseId: string, xpEarned: number) => void;
}

export const WritingSkill: React.FC<WritingSkillProps> = ({
  currentLevel,
  onCompleteExercise,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<WritingPrompt>(
    WRITING_PROMPTS.find((w) => w.level === currentLevel) || WRITING_PROMPTS[0]
  );

  useEffect(() => {
    const prompt = WRITING_PROMPTS.find((w) => w.level === currentLevel) || WRITING_PROMPTS[0];
    setSelectedPrompt(prompt);
    setEssayText('');
    setFeedback(null);
  }, [currentLevel]);

  const [essayText, setEssayText] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [showSampleWriting, setShowSampleWriting] = useState<boolean>(false);
  const [copiedCorrectedText, setCopiedCorrectedText] = useState<boolean>(false);

  // Word count calculation
  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const isWithinLimits = wordCount >= selectedPrompt.minWords && wordCount <= selectedPrompt.maxWords;

  // Submit Essay to Gemini AI
  const handleEvaluateWriting = async () => {
    if (!essayText.trim() || isEvaluating) return;

    setIsEvaluating(true);
    setEvalError(null);

    try {
      const res = await fetch('/api/gemini/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: essayText,
          prompt: selectedPrompt.promptEn,
          level: selectedPrompt.level,
        }),
      });

      if (!res.ok) throw new Error('فشل تقييم النص بواسطة معلم اللغة الافتراضي');

      const data: WritingFeedback = await res.json();
      setFeedback(data);
      onCompleteExercise(selectedPrompt.id, Math.round(data.score / 2));
    } catch (err: any) {
      console.error(err);
      setEvalError('حدث خطأ أثناء فحص وتصحيح النص. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleCopyCorrected = () => {
    if (!feedback) return;
    navigator.clipboard.writeText(feedback.correctedText);
    setCopiedCorrectedText(true);
    setTimeout(() => setCopiedCorrectedText(false), 2000);
  };

  return (
    <div className="space-y-8 font-arabic">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-violet-950 to-slate-900 border border-purple-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
              <PenTool className="w-3.5 h-3.5" />
              مهارة الكتابة والتعبير (Writing)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              معمل الكتابة وتصحيح القواعد وتراكيب الجمل
            </h2>
            <p className="text-purple-200/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              اختر موضوع الكتابة المطلوب، استعن بالأسئلة التوجيهية، واكتب مقالك لتصحيحه فورياً بمعايير معتمدة مع إعادة صياغة احترافية.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of Writing Prompts */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            موضوعات الكتابة المتاحة
          </h3>

          <div className="space-y-2.5">
            {WRITING_PROMPTS.map((prompt) => {
              const isSelected = selectedPrompt.id === prompt.id;
              return (
                <div
                  key={prompt.id}
                  onClick={() => {
                    setSelectedPrompt(prompt);
                    setEssayText('');
                    setFeedback(null);
                    setShowSampleWriting(false);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-950/70 border-purple-500 shadow-lg shadow-purple-950/50'
                      : 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      {prompt.level.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {prompt.minWords}-{prompt.maxWords} كلمة
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{prompt.titleAr}</h4>
                  <p className="text-xs text-slate-400 font-mono">{prompt.titleEn}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Writing Editor & AI Evaluation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            {/* Prompt Details */}
            <div className="space-y-3 pb-4 border-b border-slate-800">
              <span className="text-xs text-purple-400 font-mono font-semibold">
                المستوى: {selectedPrompt.level.toUpperCase()}
              </span>
              <h3 className="text-xl font-bold text-white">{selectedPrompt.titleAr}</h3>
              <p className="text-sm text-slate-200 bg-slate-950 p-4 rounded-2xl border border-slate-800 leading-relaxed">
                <span className="text-purple-400 font-bold block mb-1">تعليمات المأموية:</span>
                {selectedPrompt.promptAr}
                <span className="block text-xs text-slate-400 font-mono mt-2">{selectedPrompt.promptEn}</span>
              </p>

              {/* Guided Questions */}
              <div className="bg-purple-950/40 border border-purple-800/60 p-4 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" /> أسئلة لتوجيه كتابتك وتوزيع أفكارك:
                </span>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {selectedPrompt.guidedQuestionsAr.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>

              {/* Helpful Vocabulary Pill Container */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-400">عبارات ومفردات يُنصح بتضمينها:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedPrompt.helpfulVocabulary.map((vocab, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono bg-slate-800 text-purple-200 px-3 py-1 rounded-xl border border-slate-700"
                    >
                      {vocab}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Essay Textarea Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  محرر المقال (اكتب باللغة الإنجليزية):
                </label>
                <div
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                    isWithinLimits
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}
                >
                  {wordCount} / {selectedPrompt.minWords}-{selectedPrompt.maxWords} كلمة
                </div>
              </div>

              <textarea
                value={essayText}
                onChange={(e) => setEssayText(e.target.value)}
                placeholder="Write your response here in English..."
                className="w-full h-48 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-mono text-white focus:outline-none focus:border-purple-500 transition resize-y leading-relaxed"
              />
            </div>

            {/* Editor Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setShowSampleWriting(!showSampleWriting)}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition underline underline-offset-2"
              >
                {showSampleWriting ? 'إخفاء العينة النموذجية' : 'عرض نموذج كتابة مثالي للمقارنة'}
              </button>

              <button
                onClick={handleEvaluateWriting}
                disabled={!essayText.trim() || isEvaluating}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> جاري التقييم والتصحيح بالذكاء الاصطناعي...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> فحص وتصحيح المقال الآن
                  </>
                )}
              </button>
            </div>

            {/* Sample Writing Modal Box */}
            {showSampleWriting && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-purple-800/80 space-y-2 animate-fade-in">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  🌟 نموذج نص ممتاز (Model Answer):
                </span>
                <p className="text-xs font-mono text-slate-200 whitespace-pre-line leading-relaxed">
                  {selectedPrompt.sampleGoodWriting}
                </p>
                <button
                  onClick={() => speakText(selectedPrompt.sampleGoodWriting)}
                  className="text-xs text-purple-300 hover:text-white font-semibold flex items-center gap-1 pt-2"
                >
                  <Volume2 className="w-3.5 h-3.5" /> استمع للنموذج بالصوت
                </button>
              </div>
            )}

            {evalError && (
              <div className="p-4 bg-rose-950/60 border border-rose-800 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {evalError}
              </div>
            )}

            {/* AI Writing Feedback Report */}
            {feedback && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h4 className="font-bold text-white text-lg flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      تقرير التقييم والتصحيح القواعدي
                    </h4>
                    <p className="text-xs text-slate-400">
                      المستوى التقديري المقارن: <span className="font-mono text-purple-400 font-bold">{feedback.cefrEstimate}</span>
                    </p>
                  </div>

                  <div className="text-center bg-slate-900 border border-purple-500/30 px-4 py-2 rounded-2xl">
                    <div className="text-2xl font-black text-purple-400">{feedback.score}</div>
                    <div className="text-[10px] text-slate-400">الدرجة النهائية</div>
                  </div>
                </div>

                {/* Scores Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <div className="text-lg font-bold text-emerald-400">{feedback.grammarScore}%</div>
                    <div className="text-[10px] text-slate-400">صحة القواعد</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <div className="text-lg font-bold text-blue-400">{feedback.coherenceScore}%</div>
                    <div className="text-[10px] text-slate-400">ربط الأفكار</div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                    <div className="text-lg font-bold text-purple-400">{feedback.vocabularyScore}%</div>
                    <div className="text-[10px] text-slate-400">المفردات والتنوع</div>
                  </div>
                </div>

                {/* General Constructive Feedback */}
                <div className="p-4 bg-indigo-950/40 border border-indigo-800/80 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-indigo-300">ملاحظات شاملة على أسلوبك:</span>
                  <p className="text-xs text-slate-200 leading-relaxed">{feedback.overallFeedbackAr}</p>
                </div>

                {/* Polished / Corrected Version */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> النسخة المصححة والمعدلة احترافياً:
                    </span>
                    <button
                      onClick={handleCopyCorrected}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                    >
                      {copiedCorrectedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCorrectedText ? 'تم النسخ' : 'نسخ النص'}
                    </button>
                  </div>
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-emerald-200 leading-relaxed">
                    {feedback.correctedText}
                  </div>
                </div>

                {/* Detailed Grammar Mistakes List */}
                {feedback.grammarMistakes && feedback.grammarMistakes.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-rose-400">الأخطاء القواعدية المكتشفة مع الشرح:</span>
                    <div className="space-y-2">
                      {feedback.grammarMistakes.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-rose-950/30 border border-rose-900/60 rounded-xl space-y-1 text-xs"
                        >
                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-rose-400 line-through">{m.mistake}</span>
                            <span className="text-slate-400">←</span>
                            <span className="text-emerald-400 font-bold">{m.correction}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] font-arabic">{m.explanationAr}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vocabulary Upgrades */}
                {feedback.vocabularySuggestions && feedback.vocabularySuggestions.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-amber-400">اقتراحات لتطوير حصيلتك اللغوية:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {feedback.vocabularySuggestions.map((v, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-0.5"
                        >
                          <div className="font-mono">
                            <span className="text-slate-400">{v.word}</span> →{' '}
                            <span className="text-amber-300 font-bold">{v.betterWord}</span>
                          </div>
                          <div className="text-[10px] text-slate-400">{v.reasonAr}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
