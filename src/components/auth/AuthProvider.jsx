import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchMyProfile } from "@/services/profile";

const AuthContext = createContext(
  /** @type {null | {
   *  session: import("@supabase/supabase-js").Session | null,
   *  user: import("@supabase/supabase-js").User | null,
   *  profile: any,
   *  loading: boolean,
   *  profileLoading: boolean,
   *  refreshProfile: () => Promise<void>,
   * }} */ (null)
);

async function safeLoadProfile() {
  try {
    return await fetchMyProfile();
  } catch (err) {
    // If the profile table isn't set up yet (or RLS blocks), keep the app usable and surface a clear error in UI.
    return { __error: err };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    const next = await safeLoadProfile();
    setProfile(next);
    setProfileLoading(false);
  }, [user]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setSession(null);
        setUser(null);
        setProfile({ __error: error });
        setLoading(false);
        return;
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile, user?.id]);

  const value = useMemo(
    () => ({ session, user, profile, loading, profileLoading, refreshProfile }),
    [session, user, profile, loading, profileLoading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}

