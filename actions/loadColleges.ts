import { collegeRepository } from '@/lib/repositories/college.repository';
import type { College } from '@/lib/types';

async function loadColleges(): Promise<College[]> {
  return await collegeRepository.getAll();
}

export default loadColleges;
