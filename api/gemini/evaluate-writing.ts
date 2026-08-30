// Vercel serverless function: POST /api/gemini/evaluate-writing
// The implementation is shared with the local Express dev server (see
// ../_lib/handlers.ts) so behaviour is identical in both environments.
export { evaluateWriting as default } from '../_lib/handlers';
