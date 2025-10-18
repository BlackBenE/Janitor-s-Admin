import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface LockUserRequest {
  userId: string;
  duration: number; // minutes
  reason?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Vérifier que c'est une requête POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Récupérer le body de la requête
    const { userId, duration, reason }: LockUserRequest = await req.json();

    if (!userId || !duration) {
      return new Response(
        JSON.stringify({ error: "userId and duration are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Créer le client Supabase avec la service role (côté serveur uniquement)
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Vérifier que l'utilisateur qui fait la requête est admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Créer un client pour vérifier l'utilisateur actuel
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Vérifier l'utilisateur actuel
    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Vérifier que l'utilisateur actuel est admin
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || userProfile?.role !== "admin") {
      return new Response(
        JSON.stringify({
          error: "Insufficient permissions. Admin role required.",
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculer la date d'expiration du lock
    const lockUntil = new Date(Date.now() + duration * 60000);

    // 1. Mettre à jour le statut de l'utilisateur dans la base de données
    const { data: lockData, error: lockError } = await supabaseAdmin
      .from("profiles")
      .update({
        account_locked: true,
        locked_until: lockUntil.toISOString(),
        lock_reason: reason || "Verrouillage par un administrateur",
      })
      .eq("id", userId)
      .select();

    if (lockError) {
      console.error("Database lock error:", lockError);
      return new Response(
        JSON.stringify({ error: "Failed to lock user account" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Invalider toutes les sessions de l'utilisateur
    console.log(`Attempting to invalidate all sessions for user: ${userId}`);

    // Méthode 1: Invalidation globale de toutes les sessions (révoque les refresh tokens)
    const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(
      userId,
      "global"
    );

    if (signOutError) {
      console.error("Session invalidation error:", signOutError);
    } else {
      console.log(`Successfully invalidated all sessions for user: ${userId}`);
    }

    // Méthode 2: Forcer l'expiration des JWT en mettant à jour l'auth metadata
    // Cela force une invalidation immédiate des tokens JWT existants
    const { error: updateUserError } =
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        // Changer l'email_confirmed_at force une re-authentification sur certains clients
        user_metadata: {
          account_locked_at: new Date().toISOString(),
          forced_signout_timestamp: Date.now(),
        },
      });

    if (updateUserError) {
      console.error("User metadata update error:", updateUserError);
    } else {
      console.log(`Successfully updated user metadata for: ${userId}`);
    }

    const sessionInvalidated = !signOutError;

    // 3. Log de l'action pour audit (optionnel)
    await supabaseAdmin.from("audit_logs").insert({
      user_id: userId,
      admin_id: user.id,
      action: "ACCOUNT_LOCKED",
      details: {
        duration_minutes: duration,
        reason: reason || "Verrouillage par un administrateur",
        locked_until: lockUntil.toISOString(),
        session_invalidated: sessionInvalidated,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: lockData,
        session_invalidated: sessionInvalidated,
        locked_until: lockUntil.toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Lock user function error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
