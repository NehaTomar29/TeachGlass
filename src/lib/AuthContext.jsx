import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // 1. Fetch initial session on app mount
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setAuthError({ type: 'auth_error', message: error.message });
      } else {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setIsLoadingAuth(false);
    });

    // 2. Listen for real-time auth state updates (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setIsLoadingAuth(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoadingAuth(false);
    if (error) throw error;
    return data;
  };

  const signup = async (email, password, metadata = {}) => {
    setIsLoadingAuth(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata }
    });
    setIsLoadingAuth(false);
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    setIsLoadingAuth(true);
    const { error } = await supabase.auth.signOut();
    setIsLoadingAuth(false);
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoadingAuth,
        authError,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
