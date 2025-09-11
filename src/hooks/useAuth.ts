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
      // Create admin profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email!,
        full_name: fullName,
        role: "admin",
        profile_validated: true,
      });

      if (profileError) {
        throw new Error("Failed to create admin profile");
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
