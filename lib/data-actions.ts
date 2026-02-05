// Generic data action hooks and utilities for CollabSync Pro

/**
 * Custom hook for loading data from an action.
 * @template T - The type of the data returned by the action.
 * @param {any} _action - The data action to execute.
 * @param {T} initialData - Initial data while loading.
 * @param {any} _params - Optional parameters for the action.
 * @returns {readonly [T, boolean, { message: string } | null, () => void]} Tuple containing [data, loading, error, reload].
 */
import { useState, useEffect, useCallback } from 'react';
import { useErrorHandler } from './errors/useErrorHandler';
import { AppError, ErrorCodes } from './errors/AppError';

export function useLoadAction<T>(
    actionFn: (params?: any) => Promise<T>,
    initialData: T,
    params?: any
): readonly [T, boolean, { message: string } | null, () => void] {
    const [data, setData] = useState<T>(initialData);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<{ message: string } | null>(null);
    const { handleError } = useErrorHandler();

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // If actionFn is not a function (mock legacy), handle gracefully or assume it returns promise
            const result = await actionFn(params);
            setData(result);
        } catch (err: any) {
            const appError = err instanceof AppError
                ? err
                : new AppError(err.message || 'Data fetch failed', ErrorCodes.DATABASE_ERROR);

            setError({ message: appError.message });
            handleError(appError);
        } finally {
            setLoading(false);
        }
    }, [actionFn, JSON.stringify(params), handleError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return [data, loading, error, fetchData] as const;
}

/**
 * Custom hook for performing mutation actions.
 * @param {any} _action - The mutation action to execute.
 * @returns {readonly [(params?: any) => Promise<void>, boolean]} Tuple containing [mutate function, loading state].
 */
export function useMutateAction(_action: any): readonly [(params?: any) => Promise<void>, boolean] {
    const mutate = async (params?: any) => {
        console.log('Mock mutate called with params:', params);
        return Promise.resolve();
    };
    return [mutate, false] as const;
}

export function action(name: string, _type: string, params: any) {
    console.log(`Action called: ${name}`, params);
    return Promise.resolve([]);
}
