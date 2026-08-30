import React, { useState, useEffect, useRef } from 'react';
import { SpeakingScenario, LevelType, SpeakingFeedback } from '../types';
import { SPEAKING_SCENARIOS } from '../data/initialData';
import { createSpeechRecognition, speakText, stopSpeaking } from '../utils/speech';
import {
  Mic,
  MicOff,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Bot,
  Send,
  Volume2,
  Award,
  Loader2,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

interface SpeakingSkillProps {
  currentLevel: LevelType;
  onCompleteExercise: (exerciseId: string, xpEarned: number) => void;
}

export const SpeakingSkill: React.FC<SpeakingSkillProps> = ({
  currentLevel,
  onCompleteExercise,
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'scenarios' | 'aiChat'>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<SpeakingScenario>(
    SPEAKING_SCENARIOS.find((s) => s.level === currentLevel) || SPEAKING_SCENARIOS[0]
  );

  useEffect(() => {
    const scenario = SPEAKING_SCENARIOS.find((s) => s.level === currentLevel) || SPEAKING_SCENARIOS[0];
    setSelectedScenario(scenario);
    setFeedback(null);
    setTranscript('');
  }, [currentLevel]);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // AI Evaluation State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // AI Chat Mode State
  const [chatHistory, setChatHistory] = useState<
    { sender: 'user' | 'ai'; text: string; translationAr?: string; tipAr?: string }[]
  >([
    {
      sender: 'ai',
      text: "Hello! I am your AI Speaking Partner. I'm ready to practice speaking with you. What would you like to talk about today?",
      translationAr: 'مرحباً! أنا شريكك الافتراضي لممارسة المحادثة. جاهز للحديث معك، عن ماذا تريد أن نتحدث اليوم؟',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const recog = createSpeechRecognition(
        (text) => setTranscript(text),
        (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        },
        () => setIsListening(false)
      );

      if (!recog) {
        alert('خاصية التعرف على الصوت غير مدعومة مباشرة في متصفحك. يمكنك كتابة المنطوق بدلاً من ذلك.');
        return;
      }

      recognitionRef.current = recog;
      recog.start();
      setIsListening(true);
    }
  };

  // Evaluate Recorded Speech with Gemini
  const handleEvaluateSpeaking = async () => {
    if (!transcript.trim()) return;

    setIsEvaluating(true);
    setEvalError(null);

    try {
      const res = await fetch('/api/gemini/evaluate-speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userTranscript: transcript,
          scenarioPrompt: selectedScenario.promptToUser,
          level: selectedScenario.level,
        }),
      });

      if (!res.ok) throw new Error('فشل تقييم التحدث عبر الذكاء الاصطناعي');

      const data: SpeakingFeedback = await res.json();
      setFeedback(data);
      onCompleteExercise(selectedScenario.id, Math.round(data.score / 2));
    } catch (err: any) {
      console.error(err);
      setEvalError('حدث خطأ أثناء تقييم التحدث. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Send Chat Message to Gemini AI Partner
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);

    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat-speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: chatHistory,
          userMessage: userText,
          scenario: selectedScenario,
          level: currentLevel,
        }),
      });

      if (!res.ok) throw new Error('Failed to get chat response');

      const data = await res.json();

      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.replyEn,
          translationAr: data.translationAr,
          tipAr: data.pronunciationTipAr || data.correctionIfAny,
        },
      ]);

      // Speak AI reply aloud automatically
      speakText(data.replyEn);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I had trouble processing that. Could you say it again?',
          translationAr: 'عذراً، حدث خطأ أثناء المعالجة، هل يمكنك إعادة قول ذلك؟',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  return (
    <div className="space-y-8 font-arabic">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 border border-amber-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <Mic className="w-3.5 h-3.5" />
              مهارة التحدث (Speaking)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              تحدث الإنجليزية بثقة وتقييم ذكي فوري
            </h2>
            <p className="text-amber-200/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              سجل صوتك أو تحدث مع المعلم الافتراضي لتلقي تقييم شامل للدقة القواعدية، طلاقة النطق، والمفردات.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-2xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTabMode('scenarios')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTabMode === 'scenarios'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" /> سيناريوهات محددة
            </button>
            <button
              onClick={() => setActiveTabMode('aiChat')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTabMode === 'aiChat'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> محادثة مفتوحة
            </button>
          </div>
        </div>
      </div>

      {activeTabMode === 'scenarios' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: List of Scenarios */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <Mic className="w-4 h-4 text-amber-400" />
              سيناريوهات التحدث
            </h3>

            <div className="space-y-2.5">
              {SPEAKING_SCENARIOS.map((sc) => {
                const isSelected = selectedScenario.id === sc.id;
                return (
                  <div
                    key={sc.id}
                    onClick={() => {
                      setSelectedScenario(sc);
                      setTranscript('');
                      setFeedback(null);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-500 shadow-lg shadow-amber-950/50'
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                        {sc.level.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{sc.titleAr}</h4>
                    <p className="text-xs text-slate-400 font-mono">{sc.titleEn}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Scenario Recording & AI Feedback */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              {/* Scenario Details */}
              <div className="space-y-3 pb-4 border-b border-slate-800">
                <span className="text-xs text-amber-400 font-mono font-semibold">
                  دور الشخص الافتراضي: {selectedScenario.aiPersonaRole}
                </span>
                <h3 className="text-xl font-bold text-white">{selectedScenario.titleAr}</h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-bold block mb-1">الموقف المباشر:</span>
                  {selectedScenario.situationAr}
                </p>

                {/* Prompt to User */}
                <div className="bg-indigo-950/50 border border-indigo-800/80 p-4 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-400" /> المطلـوب منك قوله بالإنجليزية:
                  </span>
                  <p className="text-sm font-semibold text-white font-mono">{selectedScenario.promptToUser}</p>
                </div>

                {/* Suggested Phrases */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400">عبارات مساعدة مقترحة:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedScenario.suggestedPhrases.map((phrase, idx) => (
                      <button
                        key={idx}
                        onClick={() => speakText(phrase)}
                        className="text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
                        title="استمع للنطق"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Speech Recorder Workspace */}
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={toggleListening}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl group ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-rose-600/40 scale-105'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8" />
                    ) : (
                      <Mic className="w-8 h-8" />
                    )}
                  </button>

                  <span className="text-xs font-bold text-slate-300">
                    {isListening
                      ? 'جاري الاستماع لصوتك... تحدث الآن بالإنجليزية'
                      : 'اضغط على الميكروفون لبدء التسجيل'}
                  </span>
                </div>

                {/* Editable Transcript Field */}
                <div className="space-y-1 text-right">
                  <label className="text-xs text-slate-400 font-semibold">
                    النص المسجّل (يمكنك تعديل أي كلمة هنا):
                  </label>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="سوف يظهر كلامك بالإنجليزية هنا عند التحدث، أو يمكنك كتابته مباشرة..."
                    className="w-full h-24 bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm font-mono text-white focus:outline-none focus:border-amber-500 transition resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setTranscript('')}
                    className="text-xs text-slate-400 hover:text-rose-400 transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> مسح النص
                  </button>

                  <button
                    onClick={handleEvaluateSpeaking}
                    disabled={!transcript.trim() || isEvaluating}
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> جاري التقييم بالذكاء الاصطناعي...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> تقييم التحدث بالذكاء الاصطناعي
                      </>
                    )}
                  </button>
                </div>
              </div>

              {evalError && (
                <div className="p-4 bg-rose-950/60 border border-rose-800 text-rose-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {evalError}
                </div>
              )}

              {/* AI Feedback Report Display */}
              {feedback && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <h4 className="font-bold text-white text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        تقرير تقييم النطق والتحدث
                      </h4>
                      <p className="text-xs text-slate-400">
                        التقدير المستهدف المقدر: <span className="font-mono text-amber-400 font-bold">{feedback.cefrEstimate}</span>
                      </p>
                    </div>

                    <div className="text-center bg-slate-900 border border-amber-500/30 px-4 py-2 rounded-2xl">
                      <div className="text-2xl font-black text-amber-400">{feedback.score}</div>
                      <div className="text-[10px] text-slate-400">النتيجة الإجمالية</div>
                    </div>
                  </div>

                  {/* Sub Scores Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                      <div className="text-lg font-bold text-blue-400">{feedback.fluencyScore}%</div>
                      <div className="text-[10px] text-slate-400">الطلاقة والسرعة</div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                      <div className="text-lg font-bold text-emerald-400">{feedback.grammarScore}%</div>
                      <div className="text-[10px] text-slate-400">القواعد والتراكيب</div>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                      <div className="text-lg font-bold text-purple-400">{feedback.vocabularyScore}%</div>
                      <div className="text-[10px] text-slate-400">تنوع المفردات</div>
                    </div>
                  </div>

                  {/* Overall Feedback in Arabic */}
                  <div className="p-4 bg-indigo-950/40 border border-indigo-800/80 rounded-xl space-y-1">
                    <span className="text-xs font-bold text-indigo-300">ملاحظات المعلم الافتراضي:</span>
                    <p className="text-xs text-slate-200 leading-relaxed">{feedback.overallFeedbackAr}</p>
                  </div>

                  {/* Pronunciation Notes */}
                  {feedback.pronunciationNotesAr && feedback.pronunciationNotesAr.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-amber-400">توجيهات لتحسين النطق:</span>
                      <ul className="space-y-1 list-disc list-inside text-xs text-slate-300">
                        {feedback.pronunciationNotesAr.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Natural Phrasing Suggestions */}
                  {feedback.betterWaysToSay && feedback.betterWaysToSay.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-emerald-400">طرق أكثر ملاءمة وطلاقة للتعبيـر:</span>
                      <div className="space-y-1.5">
                        {feedback.betterWaysToSay.map((phrase, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-emerald-300 flex items-center justify-between"
                          >
                            <span>"{phrase}"</span>
                            <button
                              onClick={() => speakText(phrase)}
                              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
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
      ) : (
        /* AI Chat Mode Workspace */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">المعلم الافتراضي للمحادثة الحية</h3>
                <p className="text-xs text-slate-400">محادثة مفتوحة مع تصحيح حقيقي ومقروء بالصوت</p>
              </div>
            </div>

            <button
              onClick={() =>
                setChatHistory([
                  {
                    sender: 'ai',
                    text: 'Hello again! What topic would you like to discuss now?',
                    translationAr: 'مرحباً مجدداً! ما الموضوع الذي ترغب في نقاشه الآن؟',
                  },
                ])
              }
              className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> بدء محادثة جديدة
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="h-96 overflow-y-auto space-y-4 p-4 bg-slate-950 rounded-2xl border border-slate-800/80">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-bold text-xs'
                      : 'bg-indigo-600 text-white'
                  }`}
                >
                  {msg.sender === 'user' ? 'أنت' : <Bot className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-semibold rounded-tl-none font-mono'
                        : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tr-none font-mono'
                    }`}
                  >
                    {msg.text}

                    {msg.sender === 'ai' && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="inline-block mr-2 text-indigo-400 hover:text-indigo-300 align-middle"
                        title="استمع للرد بالصوت"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {msg.translationAr && (
                    <div className="text-[11px] text-slate-400 px-1 font-arabic">
                      {msg.translationAr}
                    </div>
                  )}

                  {msg.tipAr && (
                    <div className="text-[11px] text-amber-300 bg-amber-950/40 border border-amber-800/50 p-2 rounded-xl font-arabic">
                      💡 ملاحظة: {msg.tipAr}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-amber-400 animate-pulse p-2">
                <Loader2 className="w-4 h-4 animate-spin" /> المعلم يكتب ويرد عليك بالإنجليزية...
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-xl border transition ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse border-rose-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="تحدث بالصوت"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="اكتب ردك بالإنجليزية هنا أو استخدم الصوت..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
            />

            <button
              onClick={handleSendChatMessage}
              disabled={!chatInput.trim() || isChatLoading}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition flex items-center gap-2 shrink-0"
            >
              <Send className="w-4 h-4" /> إرسال
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
