import { useState, useEffect } from 'react';
import type { Match } from '../lib/types';
import { fetchAllMatches } from '../lib/api';

export function useMatches() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                const data = await fetchAllMatches();
                if (mounted) {
                    setMatches(data);
                    setLoading(false);
                }
            } catch (err) {
                if (mounted) {
                    setError("Failed to load matches");
                    setLoading(false);
                }
            }
        }

        load();

        // Auto-refresh every 5 minutes?
        const interval = setInterval(load, 5 * 60 * 1000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    return { matches, loading, error };
}
