import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log("Testing Supabase Connection...");
console.log("URL:", supabaseUrl);
console.log("Key:", supabaseAnonKey ? "Found" : "Missing");

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing keys!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log("Fetching brands...");
        const { data, error } = await supabase.from('brands').select('*');

        if (error) {
            console.error("Error fetching brands:", error);
        } else {
            console.log("Success! Brands found:", data.length);
            if (data.length > 0) {
                console.log("Sample Brand:", data[0].name);
            } else {
                console.log("Brands table is empty.");
            }
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

testConnection();
