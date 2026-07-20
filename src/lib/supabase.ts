// Clients Supabase. Le client navigateur utilise la clé anon (RLS anon :
// insert + update only). Le client serveur utilise la service role pour la
// lecture back-office, le webhook Notion et le marquage des emails envoyés.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let browserClient: SupabaseClient | null = null;

// Client côté navigateur (singleton). L'id de session reste en state React et
// n'apparaît jamais dans l'URL (spec §1, note RLS).
export function getSupabaseBrowser(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY manquants',
    );
  }
  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return browserClient;
}

// Client côté serveur (service role — jamais exposé au navigateur).
export function getSupabaseAdmin(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants',
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
