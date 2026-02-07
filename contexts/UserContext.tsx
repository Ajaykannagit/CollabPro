import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

type User = {
    user_id: string;
    name: string;
    email: string;
    organization: string;
    organization_type: 'college' | 'corporate';
    role: string;
};

type UserContextType = {
    user: User | null;
    loading: boolean;
    setCurrentUser: (userId: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load default user on mount (user_1 - Rajesh Kumar from NHSRCL)
        loadUser('user_1');
    }, []);

    const loadUser = async (userId: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('user_sessions')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (error) throw error;
            if (data) setUser(data);
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const setCurrentUser = async (userId: string) => {
        await loadUser(userId);
    };

    return (
        <UserContext.Provider value={{ user, loading, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
