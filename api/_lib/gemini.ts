import { GoogleGenAI } from '@google/genai';

// Lazy initialization for Gemini AI client.
//
// GEMINI_API_KEY is read from the environment only here — on the server (local
// Express dev server) or inside a Vercel serverless function. It is never
// imported by anything under `src/` and is never prefixed with `VITE_`, so it
// cannot be bundled into client-side JavaScript.
//
// On Vercel: configure GEMINI_API_KEY under Project Settings > Environment Variables.
export function getGeminiClient() {
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
