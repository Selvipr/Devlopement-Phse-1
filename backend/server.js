const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Allow requests from frontend
app.use(express.json());  // Parse JSON bodies

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Example API route: Fetch products from Supabase
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add more routes as needed (e.g., POST for adding to cart, auth, etc.)

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});