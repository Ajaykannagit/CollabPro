// Seed the IndexedDB database with initial test data

import { db } from './db';

const defaultTestData = {
    projects: [],
    challenges: [],
    colleges: [],
    notifications: [],
    student_profiles: [],
    licensing_opportunities: [],
};

export async function seedDatabase() {
    try {
        // Check if database is already seeded
        const projectCount = await db.research_projects.count();

        if (projectCount > 0) {
            console.log('Database already seeded');
            return;
        }

        console.log('Seeding database with initial data...');

        // Seed research projects
        await db.research_projects.bulkAdd(defaultTestData.projects);

        // Seed industry challenges
        await db.industry_challenges.bulkAdd(defaultTestData.challenges);

        // Seed colleges
        await db.colleges.bulkAdd(defaultTestData.colleges);

        // Seed notifications
        await db.notifications.bulkAdd(defaultTestData.notifications);

        // Seed student profiles
        if (defaultTestData.student_profiles) {
            await db.student_profiles.bulkAdd(defaultTestData.student_profiles);
        }

        // Seed licensing opportunities
        if (defaultTestData.licensing_opportunities) {
            await db.licensing_opportunities.bulkAdd(defaultTestData.licensing_opportunities);
        }

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

export async function resetDatabase() {
    try {
        await db.delete();
        window.location.reload();
    } catch (error) {
        console.error('Error resetting database:', error);
    }
}
