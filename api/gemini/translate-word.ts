// Vercel serverless function: POST /api/gemini/translate-word
// The implementation is shared with the local Express dev server (see
// ../_lib/handlers.ts) so behaviour is identical in both environments.
export { translateWord as default } from '../_lib/handlers';
