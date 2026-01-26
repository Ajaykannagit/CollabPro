// Generic data action hooks and utilities for CollabSync Pro

export function useLoadAction(_action: any, initialData: any = [], _params?: any): readonly [any, boolean, { message: string } | null, () => void] {
    // Return mock data structure: [data, loading, error, reload]
    // We return the initialData (or empty array) so the app doesn't crash on .map/.filter
    const reload = () => { console.log('Mock reload called'); };
    const error: { message: string } | null = null;
    return [initialData || [], false, error, reload] as const;
}

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
