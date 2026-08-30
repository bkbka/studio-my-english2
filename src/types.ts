export type SkillType = 'dashboard' | 'listening' | 'speaking' | 'reading' | 'writing' | 'wallet';

export type LevelType = 'beginner' | 'intermediate' | 'advanced';

export interface UserStats {
  level: LevelType;
  xp: number;
  streakDays: number;
  completedExercises: string[];
  totalListeningMinutes: number;
}

export interface LevelInfo {
  id: LevelType;
  titleAr: string;
  titleEn: string;
  cefr: string;
  badge: string;
  descriptionAr: string;
}

export interface QuizQuestion {
  id: string;
  questionAr?: string;
  questionEn: string;
  options: string[];
  correctAnswer: number;
  explanationAr: string;
}

// --- Listening Lesson ---
export interface ListeningExercise {
  id: string;
  titleAr: string;
  titleEn: string;
  level: LevelType;
  durationMinutes: number;
  topic: string;
  audioText: string;
  transcriptText: string;
  fillInBlanksText?: string;
  missingWords?: string[];
  questions: QuizQuestion[];
  keyVocabulary: { word: string; translationAr: string; meaningEn: string }[];
}

// --- Speaking Scenario ---
export interface SpeakingScenario {
  id: string;
  titleAr: string;
  titleEn: string;
  level: LevelType;
  situationAr: string;
  situationEn: string;
  promptToUser: string;
  suggestedPhrases: string[];
  sampleResponse: string;
  aiPersonaRole: string;
}

export interface SpeakingFeedback {
  score: number; // 0 - 100
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  pronunciationNotesAr: string[];
  grammarCorrectionsAr: { original: string; corrected: string; reasonAr: string }[];
  overallFeedbackAr: string;
  betterWaysToSay: string[];
  cefrEstimate: string;
}

// --- Reading Passage ---
export interface ReadingPassage {
  id: string;
  titleAr: string;
  titleEn: string;
  level: LevelType;
  topic: string;
  contentEn: string;
  paragraphTranslationsAr: string[];
  questions: QuizQuestion[];
  vocabularyList: { word: string; translationAr: string; partOfSpeech: string; example: string }[];
}

// --- Writing Prompt ---
export interface WritingPrompt {
  id: string;
  titleAr: string;
  titleEn: string;
  level: LevelType;
  promptAr: string;
  promptEn: string;
  minWords: number;
  maxWords: number;
  guidedQuestionsAr: string[];
  helpfulVocabulary: string[];
  sampleGoodWriting: string;
}

export interface WritingFeedback {
  score: number; // 0 - 100
  grammarScore: number;
  coherenceScore: number;
  vocabularyScore: number;
  overallFeedbackAr: string;
  correctedText: string;
  grammarMistakes: { mistake: string; correction: string; explanationAr: string }[];
  vocabularySuggestions: { word: string; betterWord: string; reasonAr: string }[];
  cefrEstimate: string;
}

// --- Saved Word for Vocabulary Wallet ---
export interface SavedWord {
  id: string;
  word: string;
  translationAr: string;
  partOfSpeech?: string;
  contextSentence?: string;
  dateAdded: string;
  masteryLevel: number; // 0 to 5
}

// --- User Progress ---
export interface UserProgress {
  level: LevelType;
  xp: number;
  streakDays: number;
  completedLessons: string[]; // lesson IDs
  skillScores: Record<SkillType, number>; // 0 to 100 average
  savedWords: SavedWord[];
  badges: string[];
}
