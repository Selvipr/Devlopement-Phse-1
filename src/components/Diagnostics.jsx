import React, { useState, useEffect } from 'react';

export default function Diagnostics() {
    const [status, setStatus] = useState('Running Tests...');
    const [logs, setLogs] = useState([]);

    const log = (msg) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);

    useEffect(() => {
        runTests();
    }, []);

    const runTests = async () => {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        log(`Env URL: ${url ? 'Found' : 'Missing'}`);
        log(`Env Key: ${key ? 'Found' : 'Missing'}`);

        if (!url || !key) {
            setStatus("Failed: Missing Env Vars");
            return;
        }

        try {
            log("Testing Raw Fetch...");
            const target = `${url}/rest/v1/brands?select=*&limit=1`;
            log(`Target: ${target}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            const res = await fetch(target, {
                headers: {
                    'apikey': key,
                    'Authorization': `Bearer ${key}`
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            log(`Status: ${res.status} ${res.statusText}`);

            if (res.ok) {
                const json = await res.json();
                log(`Data: Found ${json.length} items`);
                setStatus("Success: Connection Verified");
            } else {
                const text = await res.text();
                log(`Error Body: ${text.slice(0, 100)}`);
                setStatus("Failed: API Error");
            }

        } catch (err) {
            log(`Exception: ${err.message}`);
            setStatus("Failed: Network/Exception");
        }
    };

    return (
        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs border border-green-500 overflow-auto max-h-60 w-full mt-4">
            <h3 className="font-bold border-b border-green-500 mb-2">Supabase Connectivity Test</h3>
            <div className="mb-2 font-bold text-white">Result: {status}</div>
            {logs.map((l, i) => <div key={i}>{l}</div>)}
        </div>
    );
}
