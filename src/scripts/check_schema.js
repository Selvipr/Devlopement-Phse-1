
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qydbythnvjezzzhkfamw.supabase.co';
const supabaseKey = 'sb_publishable_eaxB-w35Vt9purdCjR_DGg_4zPX2Eo8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('Checking Supabase connection and schema...');

    // Check 'orders' table
    try {
        // Try to select one row to check if table exists and what columns it returns
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error querying orders table:', error.message);
        } else {
            console.log('✅ "orders" table exists.');
            if (data.length > 0) {
                console.log('Sample order columns:', Object.keys(data[0]));
            } else {
                console.log('⚠️ "orders" table is empty, cannot verify columns directly.');

                // Try to insert a dummy record and rollback (not possible easily via client without transaction, 
                // so we just try to insert invalid data to trigger schema error or see if it accepts)
                // Actually, let's just assume empty is fine if no error.
            }
        }
    } catch (err) {
        console.error('Unexpected error checking orders:', err);
    }

    // Check 'order_items' table
    try {
        const { data, error } = await supabase
            .from('order_items')
            .select('*')
            .limit(1);

        if (error) {
            console.error('Error querying order_items table:', error.message);
        } else {
            console.log('✅ "order_items" table exists.');
            if (data.length > 0) {
                console.log('Sample order_items columns:', Object.keys(data[0]));
            }
        }
    } catch (err) {
        console.error('Unexpected error checking order_items:', err);
    }
}

checkSchema();
