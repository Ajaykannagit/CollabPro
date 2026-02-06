import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Database, Wifi, WifiOff } from 'lucide-react';

export function DatabaseStatus() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [collegeCount, setCollegeCount] = useState<number>(0);

    useEffect(() => {
        async function checkConnection() {
            try {
                const { data, error } = await supabase
                    .from('colleges')
                    .select('*', { count: 'exact' });

                if (error) {
                    console.error('Connection check failed:', error);
                    setIsConnected(false);
                } else {
                    setIsConnected(true);
                    setCollegeCount(data?.length || 0);
                }
            } catch (err) {
                console.error('Connection error:', err);
                setIsConnected(false);
            }
        }

        checkConnection();
    }, []);

    if (isConnected === null) {
        return (
            <Badge variant="outline" className="gap-2">
                <Database className="h-3 w-3 animate-pulse" />
                Checking connection...
            </Badge>
        );
    }

    if (!isConnected) {
        return (
            <Badge variant="destructive" className="gap-2">
                <WifiOff className="h-3 w-3" />
                Database offline
            </Badge>
        );
    }

    return (
        <Badge variant="default" className="gap-2 bg-green-600">
            <Wifi className="h-3 w-3" />
            Supabase connected ({collegeCount} colleges)
        </Badge>
    );
}
