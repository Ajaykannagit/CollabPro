// Seed the IndexedDB database with initial test data

import { db } from './db';

const defaultTestData = {
    projects: [
        {
            title: "Quantum Computing Optimization for Logistics",
            description: "Developing novel quantum algorithms to solve complex vehicle routing problems with time windows and heterogeneous fleets. This project aims to reduce carbon footprint by 15% in urban delivery networks.",
            funding_needed: 750000,
            trl_level: 4,
            status: "Active",
            team_lead: "Dr. Sarah Chen",
            team_size: 8,
            publications_count: 12,
            university_name: "MIT",
            university_location: "Cambridge, USA",
            expertise_areas: ["Quantum Computing", "Logistics", "Optimization"],
            created_at: new Date().toISOString(),
        },
        {
            title: "Next-gen Solid State Battery Technology",
            description: "Researching solid-state electrolytes with high ionic conductivity and wide electrochemical stability windows. Focused on improving safety and energy density of EV batteries.",
            funding_needed: 1200000,
            trl_level: 6,
            status: "Active",
            team_lead: "Prof. James Wilson",
            team_size: 15,
            publications_count: 24,
            university_name: "Stanford University",
            university_location: "Stanford, USA",
            expertise_areas: ["Materials Science", "Energy Storage", "Chemistry"],
            created_at: new Date().toISOString(),
        },
        {
            title: "AI-driven Drug Discovery for Rare Diseases",
            description: "Utilizing deep learning models to predict protein-ligand binding affinities for orphan receptors. This initiative seeks to accelerate the drug discovery process for neuromuscular disorders.",
            funding_needed: 500000,
            trl_level: 3,
            status: "Proposed",
            team_lead: "Dr. Elena Rodriguez",
            team_size: 6,
            publications_count: 8,
            university_name: "Oxford Research Institute",
            university_location: "Oxford, UK",
            expertise_areas: ["Artificial Intelligence", "Bioinformatics", "Pharmacology"],
            created_at: new Date().toISOString(),
        },
        {
            title: "Sustainable Concrete using Recycled Plastics",
            description: "Developing high-performance concrete composites by incorporating processed waste plastics as partial replacements for aggregates. Testing structural integrity and long-term durability.",
            funding_needed: 250000,
            trl_level: 5,
            status: "Active",
            team_lead: "Dr. Mark Thorne",
            team_size: 4,
            publications_count: 5,
            university_name: "Technical University Munich",
            university_location: "Munich, Germany",
            expertise_areas: ["Civil Engineering", "Sustainability", "Polymer Science"],
            created_at: new Date().toISOString(),
        },
        {
            title: "Blockchain for Secure Agricultural Supply Chains",
            description: "A decentralized platform for real-time tracking of organic produce from farm to fork. Ensuring transparency in certification and fair pricing for small-scale farmers.",
            funding_needed: 300000,
            trl_level: 7,
            status: "Active",
            team_lead: "Prof. Li Wei",
            team_size: 9,
            publications_count: 18,
            university_name: "ETH Zurich",
            university_location: "Zurich, Switzerland",
            expertise_areas: ["Blockchain", "Agriculture", "Cybersecurity"],
            created_at: new Date().toISOString(),
        },
    ],

    challenges: [
        {
            title: "Zero-Emission Heavy Shipping Engines",
            description: "Post-fossil fuel propulsion systems for maritime logistics. We are seeking technical partners to design hydrogen-ammonia dual-fuel internal combustion engines.",
            budget_min: 2000000,
            budget_max: 5000000,
            timeline_months: 36,
            status: "Open",
            company_name: "Maersk Innovations",
            industry: "Maritime",
            company_location: "Copenhagen, Denmark",
            required_expertise: ["Mechanical Engineering", "Hydrogen Power", "Propulsion"],
            created_at: new Date().toISOString(),
        },
        {
            title: "Real-time Defect Detection in Semi-conductors",
            description: "Developing sub-nanometer visual inspection systems using computer vision and specialized optics to identify crystal defects during the wafer fabrication process.",
            budget_min: 500000,
            budget_max: 1500000,
            timeline_months: 18,
            status: "Open",
            company_name: "ASML FutureTech",
            industry: "Semiconductors",
            company_location: "Veldhoven, Netherlands",
            required_expertise: ["Computer Vision", "Nanotechnology", "Optics"],
            created_at: new Date().toISOString(),
        },
        {
            title: "Biodegradable Packaging for Hot Liquids",
            description: "Seeking a material that can withstand temperatures up to 100°C for 30 minutes while remaining 100% home-compostable and cost-competitive with PE-lined paper cups.",
            budget_min: 100000,
            budget_max: 300000,
            timeline_months: 12,
            status: "Shortlisted",
            company_name: "Starbucks Green Initiative",
            industry: "F&B",
            company_location: "Seattle, USA",
            required_expertise: ["Material Science", "Biochemistry", "Packaging Design"],
            created_at: new Date().toISOString(),
        },
    ],

    universities: [
        {
            name: "MIT",
            location: "Cambridge, MA",
            website: "https://www.mit.edu",
            research_strengths: "AI, Robotics, Physics, Quantum Computing",
            available_resources: "Nuclear Reactor Lab, Nano-fabrication Facility",
            success_rate: 98,
            past_partnerships_count: 450,
            active_projects_count: 120,
            created_at: new Date().toISOString(),
        },
        {
            name: "Stanford University",
            location: "Stanford, CA",
            website: "https://www.stanford.edu",
            research_strengths: "Entrepreneurship, Bio-engineering, Computer Science",
            available_resources: "SLAC National Accelerator Laboratory",
            success_rate: 96,
            past_partnerships_count: 380,
            active_projects_count: 95,
            created_at: new Date().toISOString(),
        },
        {
            name: "ETH Zurich",
            location: "Zurich, Switzerland",
            website: "https://ethz.ch",
            research_strengths: "Architecture, Mathematics, Engineering",
            available_resources: "High-Performance Computing Center",
            success_rate: 94,
            past_partnerships_count: 290,
            active_projects_count: 82,
            created_at: new Date().toISOString(),
        },
        {
            name: "University of Oxford",
            location: "Oxford, UK",
            website: "https://www.ox.ac.uk",
            research_strengths: "Medicine, Humanities, Social Sciences",
            available_resources: "Begbroke Science Park",
            success_rate: 95,
            past_partnerships_count: 510,
            active_projects_count: 110,
            created_at: new Date().toISOString(),
        },
    ],

    notifications: [
        {
            user_id: "user1",
            title: "New Collaboration Request",
            message: "Maersk Innovations has expressed interest in your Quantum Computing project",
            type: "info" as const,
            read: false,
            created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            user_id: "user1",
            title: "Project Milestone Completed",
            message: "Battery Technology project has reached TRL 6",
            type: "success" as const,
            read: false,
            created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
    ],
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

        // Seed universities
        await db.universities.bulkAdd(defaultTestData.universities);

        // Seed notifications
        await db.notifications.bulkAdd(defaultTestData.notifications);

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
