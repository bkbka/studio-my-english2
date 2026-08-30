// Vercel serverless function: POST /api/gemini/generate-reading
// The implementation is shared with the local Express dev server (see
// ../_lib/handlers.ts) so behaviour is identical in both environments.
export { generateReading as default } from '../_lib/handlers';
