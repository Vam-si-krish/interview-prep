// ─── App identity ────────────────────────────────────────────────────────────
// This ID namespaces ALL data in the shared Supabase database.
// When you build a second app, create a new config.js there with a different
// APP_ID (e.g. 'recipe-app') — the same tables and bucket will hold both
// apps' data with zero overlap.
//
// Owner: Vamsichiguruwada@gmail.com
// Supabase account: shared across projects (max 2 projects on free tier)
// ─────────────────────────────────────────────────────────────────────────────

export const APP_ID = 'interview-prep'
