import { useState, useEffect, useCallback, useRef } from 'react';
import { fetcher } from '@/lib/api';

interface FetchOptions {
    baseUrl: string;
    params?: Record<string, string | number | undefined>;
    /** If set (ms), the data will be automatically refreshed at this interval */
    pollingInterval?: number;
}

export function useApiData<T>(options: FetchOptions) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const query = new URLSearchParams();
            if (options.params) {
                Object.entries(options.params).forEach(([key, val]) => {
                    if (val !== undefined && val !== "") query.append(key, String(val));
                });
            }
            const url = `${options.baseUrl}${query.toString() ? `?${query.toString()}` : ''}`;
            const result = await fetcher<T>(url);
            setData(result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, [options.baseUrl, JSON.stringify(options.params)]); // eslint-disable-line

    // Silent refresh (no loading spinner) used internally by polling
    const silentRefresh = useCallback(async () => {
        try {
            const query = new URLSearchParams();
            if (options.params) {
                Object.entries(options.params).forEach(([key, val]) => {
                    if (val !== undefined && val !== "") query.append(key, String(val));
                });
            }
            const url = `${options.baseUrl}${query.toString() ? `?${query.toString()}` : ''}`;
            const result = await fetcher<T>(url);
            setData(result);
        } catch {
            // silently ignore polling errors
        }
    }, [options.baseUrl, JSON.stringify(options.params)]); // eslint-disable-line

    useEffect(() => {
        refresh();
    }, [refresh]);

    // Set up polling if requested
    useEffect(() => {
        if (!options.pollingInterval) return;

        intervalRef.current = setInterval(() => {
            silentRefresh();
        }, options.pollingInterval);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [options.pollingInterval, silentRefresh]);

    return { data, isLoading, error, refresh };
}
