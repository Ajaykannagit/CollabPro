import { supabase } from '../supabase';
import type { College } from '../types';

export class CollegeRepository {
    async getAll(): Promise<College[]> {
        console.log('🔍 Fetching colleges from Supabase...');

        const { data, error } = await supabase
            .from('colleges')
            .select('*')
            .order('name');

        if (error) {
            console.error('❌ Error fetching colleges:', error);
            throw error;
        }

        console.log(`✅ Fetched ${data?.length || 0} colleges from Supabase`);
        return data || [];
    }

    async getById(id: number): Promise<College | undefined> {
        const { data, error } = await supabase
            .from('colleges')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data || undefined;
    }

    async add(college: Omit<College, 'id' | 'created_at'>): Promise<number> {
        const { data, error } = await supabase
            .from('colleges')
            .insert([college])
            .select('id')
            .single();

        if (error) throw error;
        return data.id;
    }

    async update(id: number, updates: Partial<College>): Promise<number> {
        const { error } = await supabase
            .from('colleges')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
        return 1; // Return 1 to indicate success
    }

    async delete(id: number): Promise<void> {
        const { error } = await supabase
            .from('colleges')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async findByName(name: string): Promise<College[]> {
        const { data, error } = await supabase
            .from('colleges')
            .select('*')
            .ilike('name', `%${name}%`);

        if (error) throw error;
        return data || [];
    }
}

export const collegeRepository = new CollegeRepository();
