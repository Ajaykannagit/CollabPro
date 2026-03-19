import { db } from '../db';
import type { College } from '../types';

export class CollegeRepository {
    async getAll(): Promise<College[]> {
        console.log('🔍 Fetching colleges from local database...');
        const colleges = await db.colleges.toArray();
        console.log(`✅ Fetched ${colleges.length} colleges from local database`);
        return colleges;
    }

    async getById(id: number): Promise<College | undefined> {
        return await db.colleges.get(id);
    }

    async add(college: Omit<College, 'id' | 'created_at'>): Promise<number> {
        const id = await db.colleges.add({
            ...college,
            created_at: new Date().toISOString()
        } as any);
        return id as number;
    }

    async update(id: number, updates: Partial<College>): Promise<number> {
        await db.colleges.update(id, updates);
        return 1;
    }

    async delete(id: number): Promise<void> {
        await db.colleges.delete(id);
    }

    async findByName(name: string): Promise<College[]> {
        return await db.colleges
            .filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
            .toArray();
    }
}

export const collegeRepository = new CollegeRepository();
