// Vercel serverless function: POST /api/gemini/chat-speaking
// The implementation is shared with the local Express dev server (see
// ../_lib/handlers.ts) so behaviour is identical in both environments.
export { chatSpeaking as default } from '../_lib/handlers';
