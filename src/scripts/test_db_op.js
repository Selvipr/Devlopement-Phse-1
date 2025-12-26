
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qydbythnvjezzzhkfamw.supabase.co';
const supabaseKey = 'sb_publishable_eaxB-w35Vt9purdCjR_DGg_4zPX2Eo8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Attempting to insert dummy order...');

    const dummyOrder = {
        guest_email: 'test_script@example.com',
        total_amount: 10.00,
        status: 'pending',
        payment_status: 'paid',
        payment_method: 'card',
        shipping_address: {
            fullName: 'Test User',
            address: '123 Test St',
            city: 'Test City',
            zipCode: '12345',
            country: 'US'
        }
    };

    try {
        const { data, error } = await supabase
            .from('orders')
            .insert([dummyOrder])
            .select()
            .single();

        if (error) {
            console.error('❌ INSERT Failed:', error.message);
            console.error('Details:', error);
        } else {
            console.log('✅ INSERT Success!');
            console.log('Inserted Order:', data);

            // Clean up if possible, though usually delete is restricted too
            console.log('Attempting cleanup...');
            const { error: delError } = await supabase.from('orders').delete().eq('id', data.id);
            if (delError) console.log('Cleanup failed (expected if RLS blocks delete):', delError.message);
            else console.log('Cleanup successful.');
        }
    } catch (err) {
        console.error('Unexpected error during insert:', err);
    }
}

testInsert();
