import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Définition du type pour le payload de la requête
type CreateUserPayload = {
  email: string;
  role: string;
  full_name?: string | null;
  phone?: string | null;
  profile_validated?: boolean;
  vip_subscription?: boolean;
};

// Récupération des variables d'environnement
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Deno.serve est la méthode standard pour lancer une fonction Edge
serve(async (req) => {
  try {
    // Récupérer l'origine de la requête
    const origin = req.headers.get("origin") || "http://localhost:3000";

    // Gérer les requêtes OPTIONS pour CORS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
          "Access-Control-Max-Age": "86400",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Expose-Headers": "*",
        },
      });
    }

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Expose-Headers": "*",
        },
      });
    }

    const payload = (await req.json()) as CreateUserPayload;

    if (!payload?.email || !payload?.role) {
      return new Response(
        JSON.stringify({ error: "email et role sont requis" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Récupérer le user appelant (token Bearer du front)
    const authHeader = req.headers.get("Authorization") || "";
    const supabaseAuthed = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user: caller },
    } = await supabaseAuthed.auth.getUser();

    if (!caller?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Vérifier que le caller est admin via table profiles
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: callerProfile, error: callerProfileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, role")
        .eq("id", caller.id)
        .single();

    if (callerProfileError || callerProfile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1) Créer l'utilisateur Auth avec invitation (lien magique)
    // @ts-ignore
    const { data: created, error: createAuthError } =
      await supabaseAdmin.auth.admin.createUser({
        email: payload.email,
        email_confirm: true,
        user_metadata: {
          full_name: payload.full_name ?? null,
          phone: payload.phone ?? null,
          role: payload.role,
        },
        password: null, // Force l'envoi d'un email de réinitialisation
        data: {
          role: payload.role,
        },
      });

    if (createAuthError || !created?.user) {
      return new Response(
        JSON.stringify({
          error: createAuthError?.message || "Auth creation failed",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Déterminer l'URL de redirection en fonction du rôle
    const getRedirectUrl = (role: string) => {
      const ADMIN_URL = origin; // Back-office URL
      const CLIENT_APP_URL =
        Deno.env.get("CLIENT_APP_URL") || "https://app.example.com";
      const PROVIDER_APP_URL =
        Deno.env.get("PROVIDER_APP_URL") || "https://provider.example.com";

      switch (role.toLowerCase()) {
        case "admin":
          return `${ADMIN_URL}/reset-password`;
        case "property_owner":
        case "traveler":
          return `${CLIENT_APP_URL}/auth/set-password`;
        case "service_provider":
          return `${PROVIDER_APP_URL}/auth/set-password`;
        default:
          return `${CLIENT_APP_URL}/auth/set-password`;
      }
    };

    // Envoyer l'email de réinitialisation de mot de passe
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: "invite",
      email: payload.email,
      options: {
        redirectTo: getRedirectUrl(payload.role),
        data: {
          role: payload.role,
          invited_by: caller.email,
        },
      },
    });

    if (resetError) {
      // Si l'envoi de l'email échoue, on supprime l'utilisateur créé
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      return new Response(
        JSON.stringify({
          error: "Failed to send invitation email: " + resetError.message,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2) Upsert dans profiles
    const profileRow = {
      id: created.user.id,
      email: payload.email,
      role: payload.role,
      full_name: payload.full_name ?? null,
      phone: payload.phone ?? null,
      profile_validated: payload.profile_validated ?? false,
      vip_subscription: payload.vip_subscription ?? false,
      account_locked: false,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    } as Record<string, unknown>;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert(profileRow)
      .select()
      .single();

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      return new Response(JSON.stringify({ error: profileError.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ user: created.user, profile }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Expose-Headers": "*",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Expose-Headers": "*",
      },
    });
  }
});
