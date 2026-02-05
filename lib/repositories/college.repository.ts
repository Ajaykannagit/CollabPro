import { BaseRepository } from './base.repository';
import type { College } from '../types';

export class CollegeRepository extends BaseRepository<College> {
    constructor() {
        super('colleges');
    }

    async findByName(name: string): Promise<College[]> {
        return this.table.where('name').equalsIgnoreCase(name).toArray();
    }
}

export const collegeRepository = new CollegeRepository();
