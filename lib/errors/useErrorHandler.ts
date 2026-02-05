import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AppError } from './AppError';

export function useErrorHandler() {
    const { toast } = useToast();

    const handleError = useCallback((error: unknown) => {
        let message = 'An unexpected error occurred';
        let title = 'Error';

        if (error instanceof AppError) {
            message = error.message;
            title = `${error.code} Error`;
        } else if (error instanceof Error) {
            message = error.message;
        } else if (typeof error === 'string') {
            message = error;
        }

        console.error('[ErrorHandler]', error);

        toast({
            title,
            description: message,
            variant: 'destructive',
        });
    }, [toast]);

    return { handleError };
}
