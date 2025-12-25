import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client;

if (supabaseUrl && supabaseAnonKey) {
    console.log("Supabase Client: Initializing with real keys");
    client = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("⚠️ Supabase keys missing! Using mock client. Real authentication will NOT work.");
    // Mock implementation for UI stability when keys are missing
    const createMockClient = () => {
        const mockSession = { user: { id: 'mock-id', email: 'test@example.com' }, access_token: 'mock-token' };
        return {
            auth: {
                getSession: async () => ({ data: { session: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                signInWithPassword: async () => ({ data: { user: mockSession.user, session: mockSession }, error: null }),
                signUp: async () => ({ data: { user: mockSession.user, session: mockSession }, error: null }),
                signOut: async () => ({ error: null }),
            },
            from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: {}, error: null }) }) }) })
        };
    };
    client = createMockClient();
}

export const supabase = client;
