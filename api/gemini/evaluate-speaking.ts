// Vercel serverless function: POST /api/gemini/evaluate-speaking
// The implementation is shared with the local Express dev server (see
// ../_lib/handlers.ts) so behaviour is identical in both environments.
export { evaluateSpeaking as default } from '../_lib/handlers';
