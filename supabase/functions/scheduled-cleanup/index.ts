import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing required environment variables");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Edge Function pour l'exécution automatique des purges RGPD
 * À appeler via un CRON job pour nettoyer les données expirées
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    // Vérification de la méthode HTTP
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Method not allowed. Use POST.",
        }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Authentification basique (optionnel - pour sécuriser l'endpoint)
    const authHeader = req.headers.get("Authorization");
    const expectedToken = Deno.env.get("CLEANUP_API_TOKEN");

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized. Invalid or missing token.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("🚀 Démarrage de l'exécution des purges RGPD...");

    // Exécution de la fonction SQL de purge
    const { data: purgesExecuted, error: purgeError } = await supabase.rpc(
      "execute_gdpr_purges"
    );

    if (purgeError) {
      console.error("❌ Erreur lors de l'exécution des purges:", purgeError);
      return new Response(
        JSON.stringify({
          success: false,
          error: purgeError.message,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Récupération des statistiques post-purge
    const { data: activeUsers, error: statsError } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .is("deleted_at", null);

    const { data: deletedUsers } = await supabase
      .from("profiles")
      .select("id", { count: "exact" })
      .not("deleted_at", "is", null);

    const statistics = {
      purges_executed: purgesExecuted || 0,
      active_users: activeUsers?.length || 0,
      deleted_users: deletedUsers?.length || 0,
      last_execution: new Date().toISOString(),
    };

    console.log(`✅ Purges exécutées avec succès: ${purgesExecuted}`);
    console.log(`📊 Statistiques:`, statistics);

    // Réponse de succès
    return new Response(
      JSON.stringify({
        success: true,
        message: `${purgesExecuted} purge(s) exécutée(s) avec succès`,
        purges_executed: purgesExecuted,
        statistics,
        timestamp: new Date().toISOString(),
        execution_time: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("🚨 Erreur fatale dans scheduled-cleanup:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

/* 
USAGE EXAMPLES:

1. Appel manuel depuis le terminal:
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-project.supabase.co/functions/v1/scheduled-cleanup

2. Appel depuis GitHub Actions (CRON):
- name: Execute RGPD Cleanup
  run: |
    curl -X POST \
      -H "Authorization: Bearer ${{ secrets.CLEANUP_API_TOKEN }}" \
      https://your-project.supabase.co/functions/v1/scheduled-cleanup

3. Test en local:
npx supabase functions serve scheduled-cleanup
curl -X POST http://localhost:54321/functions/v1/scheduled-cleanup

ENVIRONMENT VARIABLES REQUIRED:
- SUPABASE_URL: URL de votre projet Supabase
- SUPABASE_SERVICE_ROLE_KEY: Clé service role pour accès admin
- CLEANUP_API_TOKEN: Token pour sécuriser l'endpoint (optionnel)
*/
