import { createClient } from '@supabase/supabase-js';

// Force Mock Client for verification
const createMockClient = () => {
    console.log("Supabase (Mock): Creating mock client");

    const mockSession = {
        user: { id: 'mock-user-id', email: 'admin@quantix.com', role: 'authenticated' },
        access_token: 'mock-token'
    };

    return {
        auth: {
            getSession: async () => {
                console.log("Supabase (Mock): getSession called");
                return { data: { session: null }, error: null };
            },
            onAuthStateChange: (callback) => {
                console.log("Supabase (Mock): onAuthStateChange called");
                // Immediately trigger the callback with current state (null session)
                // setTimeout(() => callback('INITIAL_SESSION', { session: null }), 0); 
                return { data: { subscription: { unsubscribe: () => console.log("Supabase (Mock): unsubscribed") } } };
            },
            signInWithPassword: async ({ email, password }) => {
                console.log("Supabase (Mock): signInWithPassword", email);
                if (email === "admin@quantix.com") {
                    return { data: { user: mockSession.user, session: mockSession }, error: null };
                }
                return { data: { user: null, session: null }, error: { message: "Invalid credentials (Mock)" } };
            },
            signUp: async ({ email, password }) => {
                return { data: { user: { id: 'new-user', email }, session: null }, error: null };
            },
            signOut: async () => {
                console.log("Supabase (Mock): signOut");
                return { error: null };
            },
        },
        from: (table) => ({
            select: (columns) => ({
                eq: (col, val) => ({
                    single: async () => ({ data: { full_name: 'Admin User', avatar_url: null }, error: null }),
                }),
                order: () => ({ data: [], error: null })
            }),
        }),
    };
};

export const supabase = createMockClient();
