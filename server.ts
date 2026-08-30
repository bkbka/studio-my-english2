import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization for Gemini AI client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please set it in Settings > Secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// --- API ENDPOINT: Evaluate Speaking ---
app.post('/api/gemini/evaluate-speaking', async (req, res) => {
  try {
    const { userTranscript, scenarioPrompt, level } = req.body;
    if (!userTranscript || !userTranscript.trim()) {
      return res.status(400).json({ error: 'User transcript is required' });
    }

    const ai = getGeminiClient();
    const prompt = `You are an expert English language examiner evaluating a student's spoken response.
Level target: ${level || 'beginner'}
Task prompt: "${scenarioPrompt || 'General speaking exercise'}"
Student spoken transcript: "${userTranscript}"

Provide a detailed evaluation in JSON format matching the schema.
All explanations and feedback notes MUST be in Arabic so the student understands easily.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: 'Overall score 0 to 100' },
            fluencyScore: { type: Type.NUMBER, description: 'Fluency score 0 to 100' },
            grammarScore: { type: Type.NUMBER, description: 'Grammar score 0 to 100' },
            vocabularyScore: { type: Type.NUMBER, description: 'Vocabulary score 0 to 100' },
            pronunciationNotesAr: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Tips for pronunciation in Arabic',
            },
            grammarCorrectionsAr: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  corrected: { type: Type.STRING },
                  reasonAr: { type: Type.STRING },
                },
                required: ['original', 'corrected', 'reasonAr'],
              },
            },
            overallFeedbackAr: { type: Type.STRING, description: 'Encouraging comprehensive feedback in Arabic' },
            betterWaysToSay: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'More natural English expressions',
            },
            cefrEstimate: { type: Type.STRING, description: 'Estimated CEFR level like A1, A2, B1, B2, C1' },
          },
          required: [
            'score',
            'fluencyScore',
            'grammarScore',
            'vocabularyScore',
            'pronunciationNotesAr',
            'grammarCorrectionsAr',
            'overallFeedbackAr',
            'betterWaysToSay',
            'cefrEstimate',
          ],
        },
      },
    });

    const jsonText = response.text || '{}';
    const feedbackData = JSON.parse(jsonText);
    res.json(feedbackData);
  } catch (error: any) {
    console.error('Error evaluating speaking:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate speaking' });
  }
});

// --- API ENDPOINT: Evaluate Writing ---
app.post('/api/gemini/evaluate-writing', async (req, res) => {
  try {
    const { text, prompt: taskPrompt, level } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const ai = getGeminiClient();
    const prompt = `You are a certified ESL Cambridge/IELTS writing examiner.
Target Level: ${level || 'intermediate'}
Writing Prompt: "${taskPrompt}"
Student's Essay/Writing:
"${text}"

Evaluate the writing thoroughly. Provide corrected version, identify grammar mistakes with Arabic explanations, offer vocabulary enhancements, and assign scores (0-100). Output strictly in JSON format matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: 'Overall score 0-100' },
            grammarScore: { type: Type.NUMBER, description: 'Grammar score 0-100' },
            coherenceScore: { type: Type.NUMBER, description: 'Coherence & organization score 0-100' },
            vocabularyScore: { type: Type.NUMBER, description: 'Vocabulary richness score 0-100' },
            overallFeedbackAr: { type: Type.STRING, description: 'Comprehensive constructive critique in Arabic' },
            correctedText: { type: Type.STRING, description: 'Polished, error-free full English version' },
            grammarMistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mistake: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  explanationAr: { type: Type.STRING },
                },
                required: ['mistake', 'correction', 'explanationAr'],
              },
            },
            vocabularySuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  betterWord: { type: Type.STRING },
                  reasonAr: { type: Type.STRING },
                },
                required: ['word', 'betterWord', 'reasonAr'],
              },
            },
            cefrEstimate: { type: Type.STRING, description: 'CEFR level estimate' },
          },
          required: [
            'score',
            'grammarScore',
            'coherenceScore',
            'vocabularyScore',
            'overallFeedbackAr',
            'correctedText',
            'grammarMistakes',
            'vocabularySuggestions',
            'cefrEstimate',
          ],
        },
      },
    });

    const jsonText = response.text || '{}';
    res.json(JSON.parse(jsonText));
  } catch (error: any) {
    console.error('Error evaluating writing:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate writing' });
  }
});

// --- API ENDPOINT: Generate Custom Reading Passage ---
app.post('/api/gemini/generate-reading', async (req, res) => {
  try {
    const { topic, level } = req.body;
    const ai = getGeminiClient();

    const prompt = `Generate an engaging English reading article tailored for CEFR level: ${level || 'intermediate'}.
Topic requested: "${topic || 'General Curiosity'}"

Requirements:
1. "contentEn": 3 distinct paragraphs of English text matching the requested level.
2. "paragraphTranslationsAr": Array of 3 Arabic paragraph translations corresponding to each paragraph.
3. "questions": Array of 2 comprehension multiple-choice questions in JSON.
4. "vocabularyList": Array of 3 key words with Arabic translation, part of speech, and an example sentence.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titleAr: { type: Type.STRING },
            titleEn: { type: Type.STRING },
            contentEn: { type: Type.STRING },
            paragraphTranslationsAr: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  questionAr: { type: Type.STRING },
                  questionEn: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswer: { type: Type.INTEGER },
                  explanationAr: { type: Type.STRING },
                },
                required: ['id', 'questionEn', 'options', 'correctAnswer', 'explanationAr'],
              },
            },
            vocabularyList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  translationAr: { type: Type.STRING },
                  partOfSpeech: { type: Type.STRING },
                  example: { type: Type.STRING },
                },
                required: ['word', 'translationAr', 'partOfSpeech', 'example'],
              },
            },
          },
          required: [
            'titleAr',
            'titleEn',
            'contentEn',
            'paragraphTranslationsAr',
            'questions',
            'vocabularyList',
          ],
        },
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error generating reading:', error);
    res.status(500).json({ error: error.message || 'Failed to generate reading article' });
  }
});

// --- API ENDPOINT: Translate Word Contextually ---
app.post('/api/gemini/translate-word', async (req, res) => {
  try {
    const { word, contextSentence } = req.body;
    if (!word) {
      return res.status(400).json({ error: 'Word parameter is required' });
    }

    const ai = getGeminiClient();
    const prompt = `Provide contextually accurate translation and dictionary details for the word "${word}".
Sentence Context: "${contextSentence || ''}"

Return JSON:
- "translationAr": precise Arabic translation
- "partOfSpeech": noun, verb, adjective, adverb, etc.
- "phonetic": IPA pronunciation if available or simple phonetic spelling
- "definitionEn": simple English definition
- "exampleSentence": simple English example sentence`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translationAr: { type: Type.STRING },
            partOfSpeech: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            definitionEn: { type: Type.STRING },
            exampleSentence: { type: Type.STRING },
          },
          required: ['translationAr', 'partOfSpeech', 'definitionEn', 'exampleSentence'],
        },
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error translating word:', error);
    res.status(500).json({ error: error.message || 'Failed to translate word' });
  }
});

// --- API ENDPOINT: Speaking Roleplay Chat Partner ---
app.post('/api/gemini/chat-speaking', async (req, res) => {
  try {
    const { history, userMessage, scenario, level } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are an encouraging English speaking partner in a roleplay scenario.
Role: ${scenario?.aiPersonaRole || 'English Conversation Tutor'}
Level: ${level || 'beginner'}
Scenario: ${scenario?.situationEn || 'Casual practice'}

Respond in conversational English suitable for ${level} level (keep sentences clear).
Also provide a short Arabic translation of your reply, an optional quick grammar correction if the user made a mistake, and a helpful phrase. Return JSON matching the schema.`;

    const contents = [
      { role: 'user', parts: [{ text: `System context: ${systemPrompt}` }] },
      ...(history || []).map((h: any) => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: userMessage || 'Hello' }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyEn: { type: Type.STRING, description: 'Natural English response to user' },
            translationAr: { type: Type.STRING, description: 'Arabic translation of your reply' },
            correctionIfAny: { type: Type.STRING, description: 'Gentle grammar correction if user had error in userMessage, else empty' },
            pronunciationTipAr: { type: Type.STRING, description: 'Short pronunciation or vocabulary tip in Arabic' },
          },
          required: ['replyEn', 'translationAr'],
        },
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in speaking chat:', error);
    res.status(500).json({ error: error.message || 'Failed to generate speaking reply' });
  }
});

// Start Express Server with Vite Middleware
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
