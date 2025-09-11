import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  session: null,
  user: null,
  isAdmin: false,
  loading: true,

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      await supabase.auth.signOut();
      throw new Error("Failed to verify admin privileges");
    }

    if (profile.role !== "admin") {
      await supabase.auth.signOut();
      throw new Error("Access denied. Admin privileges required.");
    }

    set({
      session: data.session,
      user: data.user,
      isAdmin: true,
    });
  },

  signUp: async (email: string, password: string, fullName: string) => {
    // Check if this is the first admin (allow first signup)
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");

    if (count && count > 0) {
      throw new Error(
        "Admin registration is restricted. Contact existing admin."
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Wait for automatic profile creation trigger to complete
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Use database function to set admin role with elevated privileges
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: functionError } = await (supabase.rpc as any)(
        "set_user_admin_role",
        {
          user_id: data.user.id,
          user_email: data.user.email!,
          user_name: fullName,
        }
      );

      if (functionError) {
        console.error("Function error:", functionError);
        // Fallback to direct update
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            role: "admin",
            profile_validated: true,
          })
          .eq("id", data.user.id);

        if (updateError) {
          throw new Error("Failed to set admin role. Please contact support.");
        }
      }
    }

    // Sign out immediately after signup to force login
    await supabase.auth.signOut();
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isAdmin: false });
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });

    if (error) throw error;
  },

  initialize: async () => {
    console.log("Initializing auth...");
    const {
      data: { session },
    } = await supabase.auth.getSession();

    let isAdmin = false;

    if (session?.user) {
      // Check admin status
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      isAdmin = profile?.role === "admin";

      if (!isAdmin) {
        // If user is not admin, sign them out
        await supabase.auth.signOut();
        set({ session: null, user: null, isAdmin: false, loading: false });
        return;
      }
    }

    console.log("Session:", session);
    set({
      session,
      user: session?.user ?? null,
      isAdmin,
      loading: false,
    });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      let isAdmin = false;

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        isAdmin = profile?.role === "admin";

        if (!isAdmin) {
          await supabase.auth.signOut();
          set({ session: null, user: null, isAdmin: false });
          return;
        }
      }

      set({
        session,
        user: session?.user ?? null,
        isAdmin,
      });
    });
  },
}));
