import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debugging logs
console.log("Supabase URL present:", !!supabaseUrl);
console.log("Supabase Key present:", !!supabaseAnonKey);

let client;

if (supabaseUrl && supabaseAnonKey) {
    console.log("Supabase Client: Initializing with real keys");
    client = createClient(supabaseUrl.trim(), supabaseAnonKey.trim());
} else {
    console.warn("⚠️ Supabase keys missing! Using mock client. Real authentication will NOT work.");
    // Mock implementation for UI stability when keys are missing
    const createMockClient = () => {
        const mockSession = { user: { id: 'mock-id', email: 'test@example.com' }, access_token: 'mock-token' };

        // Chainable mock builder
        const mockChain = {
            select: () => mockChain,
            order: () => mockChain,
            eq: () => mockChain,
            single: async () => ({ data: null, error: { message: "Mock client: No data found (Check .env keys)" } }),
            then: (resolve) => resolve({ data: [], error: null }) // Allow direct await on chain for list
        };

        return {
            auth: {
                getSession: async () => ({ data: { session: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                signInWithPassword: async () => ({ data: { user: mockSession.user, session: mockSession }, error: null }),
                signUp: async () => ({ data: { user: mockSession.user, session: mockSession }, error: null }),
                signOut: async () => ({ error: null }),
            },
            from: (table) => {
                console.log(`Mock DB: Querying table '${table}'`);
                return mockChain;
            }
        };
    };
    client = createMockClient();
}

export const supabase = client;

// Helper functions for Database
// Helper functions for Database - Using Direct FETCH to bypass Client Library issues
// Helper functions for Database - Using Direct FETCH to bypass Client Library issues
const directUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const directKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const getHeaders = () => ({
    'apikey': directKey,
    'Authorization': `Bearer ${directKey}`,
    'Content-Type': 'application/json'
});

export const getBrands = async () => {
    try {
        const response = await fetch(`${directUrl}/rest/v1/brands?select=*&order=is_featured.desc`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error(`Fetch error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Direct Fetch Error:", error);
        throw error;
    }
};

export const getProductsByBrand = async (brandId) => {
    try {
        const response = await fetch(`${directUrl}/rest/v1/products?select=*&brand_id=eq.${brandId}&order=price.asc`, {
            headers: getHeaders()
        });
        if (!response.ok) throw new Error(`Fetch error: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Direct Fetch Error:", error);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        // Syntax for join in Supabase REST: select=*,brands(name,icon,color)
        const response = await fetch(`${directUrl}/rest/v1/products?select=*,brands(name,icon,color)&id=eq.${id}`, {
            headers: getHeaders()
        });

        if (!response.ok) throw new Error(`Fetch error: ${response.statusText}`);

        const data = await response.json();
        // REST returns an array, we want single object
        if (data && data.length > 0) return data[0];
        throw new Error("Product not found");
    } catch (error) {
        console.error("Direct Fetch Error:", error);
        throw error;
    }
};
