import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        console.log("AuthContext: Provider mounted");
        // Check active sessions and sets the user
        const getSession = async () => {
            console.log("AuthContext: calling getSession");
            try {
                const { data } = await supabase.auth.getSession();
                console.log("AuthContext: getSession result", data);
                const session = data?.session;
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    console.log("AuthContext: fetching profile");
                    fetchProfile(session.user);
                } else {
                    console.log("AuthContext: no session, setting loading false");
                    setLoading(false);
                }
            } catch (err) {
                console.error("AuthContext: getSession error", err);
                setLoading(false);
            }
        };

        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log("AuthContext: onAuthStateChange", _event, session);
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                console.log("AuthContext: fetching profile for", session.user.id);
                // Force a refresh of the profile to get the latest role
                await fetchProfile(session.user);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        // Force loading to false after 2 seconds to prevent infinite hanging
        const timeout = setTimeout(() => {
            console.warn("AuthContext: Timeout - forcing loading false");
            setLoading(false);
        }, 2000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const fetchProfile = async (user) => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.warn('Profile not found (fetching error), attempting to create fallback...', error);

                // Fallback: Create or upsert profile if it doesn't exist
                // This handles cases where the DB trigger might have failed or been too slow
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        email: user.email,
                        full_name: user.user_metadata?.full_name,
                        avatar_url: user.user_metadata?.avatar_url,
                    }, { onConflict: 'id' })
                    .select()
                    .single();

                if (createError) {
                    console.error('Error creating profile fallback:', createError);
                } else {
                    console.log('Profile created via fallback:', newProfile);
                    setProfile(newProfile);
                }
            } else {
                setProfile(data);
            }
        } catch (error) {
            console.error('Error in fetchProfile logic:', error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password, metadata = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });
        if (error) throw error;
        return data;
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signInWithGoogle = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            }
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error("Error signing out:", error);
            }
        } catch (error) {
            console.error("Unexpected error during execution of signOut:", error);
        } finally {
            // Always clear local state
            setUser(null);
            setSession(null);
            setProfile(null);
        }
    };

    const resetPassword = async (email) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`,
        });
        if (error) throw error;
        return data;
    };

    const updatePassword = async (newPassword) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
        return data;
    };

    const value = {
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
        refreshProfile: () => user && fetchProfile(user),
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen bg-primary text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                    <span className="ml-4 text-xl">Loading...</span>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
