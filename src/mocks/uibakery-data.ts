
// Mock implementation for @uibakery/data

export function useLoadAction(_action: any, initialData: any = [], _params: any) {
    // Return mock data structure: [data, loading, error, reload]
    // We return the initialData (or empty array) so the app doesn't crash on .map/.filter
    return [initialData || [], false, null, () => { }];
}

export function useMutateAction(_action: any) {
    return [() => Promise.resolve(), false];
}

export function action(name: string, _type: string, params: any) {
    console.log(`Mock action called: ${name}`, params);
    return Promise.resolve([]);
}
