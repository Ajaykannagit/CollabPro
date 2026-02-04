// Generic data action hooks and utilities for CollabSync Pro

/**
 * Custom hook for loading data from an action.
 * @template T - The type of the data returned by the action.
 * @param {any} _action - The data action to execute.
 * @param {T} initialData - Initial data while loading.
 * @param {any} _params - Optional parameters for the action.
 * @returns {readonly [T, boolean, { message: string } | null, () => void]} Tuple containing [data, loading, error, reload].
 */
export function useLoadAction<T>(_action: any, initialData: T, _params?: any): readonly [T, boolean, { message: string } | null, () => void] {
    // Return mock data structure: [data, loading, error, reload]
    // We return the initialData (or empty array) so the app doesn't crash on .map/.filter
    const reload = () => { console.log('Mock reload called'); };
    const error: { message: string } | null = null;
    return [initialData, false, error, reload] as const;
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
