import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  evaluateSpeaking,
  evaluateWriting,
  generateReading,
  translateWord,
  chatSpeaking,
} from './api/_lib/handlers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// --- Gemini API endpoints ---
// Handler implementations are shared with the Vercel serverless functions in
// `api/gemini/*.ts` (see `api/_lib/handlers.ts`). Registering them here keeps the
// local `npm run dev` experience — Express + Vite middleware on one port —
// identical to before this refactor.
app.post('/api/gemini/evaluate-speaking', evaluateSpeaking);
app.post('/api/gemini/evaluate-writing', evaluateWriting);
app.post('/api/gemini/generate-reading', generateReading);
app.post('/api/gemini/translate-word', translateWord);
app.post('/api/gemini/chat-speaking', chatSpeaking);

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
