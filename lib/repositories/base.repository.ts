import { Table } from 'dexie';
import { db } from '../db';

export abstract class BaseRepository<T, TKey = number> {
    protected table: Table<T, TKey>;

    constructor(tableName: string) {
        this.table = (db as any)[tableName];
    }

    async getAll(): Promise<T[]> {
        return this.table.toArray();
    }

    async getById(id: TKey): Promise<T | undefined> {
        return this.table.get(id);
    }

    async add(item: T): Promise<TKey> {
        return this.table.add(item);
    }

    async update(id: TKey, updates: Partial<T>): Promise<number> {
        return this.table.update(id, updates as any);
    }

    async delete(id: TKey): Promise<void> {
        await this.table.delete(id);
    }
}
