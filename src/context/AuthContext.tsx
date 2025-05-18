
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // Add a state to track initialization
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Avoid duplicate initialization
    if (initialized) return;

    const initAuth = async () => {
      // Set up the auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, currentSession) => {
          console.log("Auth state change event:", event);
          
          // Only update state, don't trigger redirects from here
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (event === 'SIGNED_OUT') {
            // Clear any cached data when signed out
            console.log("User signed out, cleaning up state");
          }
          
          // Always make sure loading is set to false after auth state changes
          setLoading(false);
        }
      );

      // Then check for existing session
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      
      console.log("Current session:", currentSession ? "exists" : "none");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      setInitialized(true);

      return () => {
        subscription.unsubscribe();
      };
    };

    initAuth();
  }, [initialized]);

  const signOut = async () => {
    // Clean up auth state
    const cleanupAuthState = () => {
      // Remove standard auth tokens
      localStorage.removeItem('supabase.auth.token');
      // Remove all Supabase auth keys from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      // Remove from sessionStorage if in use
      Object.keys(sessionStorage || {}).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    };

    try {
      cleanupAuthState();
      
      // Global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for a clean state
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", error);
      // Still redirect even if there's an error
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
