import { useState, useEffect, useCallback } from 'react';
import { fetcher } from '@/lib/api';

interface FetchOptions {
    baseUrl: string;
    params?: Record<string, string | number | undefined>;
}

export function useApiData<T>(options: FetchOptions) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        } catch (err: any) {
            setError(err.message);
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, [options.baseUrl, JSON.stringify(options.params)]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { data, isLoading, error, refresh };
}
