import React, { createContext, useContext, ReactNode } from 'react';

export interface MetricData {
    title: string;
    value: string | number;
    trend: string;
    color: string;
    bg: string;
    icon?: string;
}

export interface ChartDataPoint {
    name: string;
    value: number;
}

export interface ResearchProject {
    id: number;
    title: string;
    description: string;
    funding_needed: number;
    trl_level: number;
    status: string;
    team_lead: string;
    team_size: number;
    publications_count: number;
    College_name: string;
    College_location: string;
    expertise_areas: string[];
}

export interface IndustryChallenge {
    id: number;
    title: string;
    description: string;
    budget_min: number;
    budget_max: number;
    timeline_months: number;
    status: string;
    company_name: string;
    industry: string;
    company_location: string;
    required_expertise: string[];
    created_at: string;
}

export interface College {
    id: number;
    name: string;
    location: string;
    website: string;
    research_strengths: string;
    available_resources: string;
    success_rate: number;
    past_partnerships_count: number;
    active_projects_count: number;
}

export interface TestData {
    metrics: MetricData[];
    chartData: ChartDataPoint[];
    projects: ResearchProject[];
    challenges: IndustryChallenge[];
    Colleges: College[];
    recentActivity: { id: number; title: string; College_name: string; timestamp: string }[];
    agreementVersions: { version_number: string; created_at: string; created_by: string; content: string; sections: { id: string; title: string; text: string }[] }[];
    agreementComments: { id: number; section_id: string; author: string; text: string; timestamp: string }[];
    signatureWorkflow: {
        status: 'draft' | 'review' | 'approval' | 'signed';
        College_approval: boolean;
        corporate_approval: boolean;
        College_signed: boolean;
        corporate_signed: boolean;
        audit_trail: { id: number; event: string; actor: string; timestamp: string }[];
    };
    projectName: string;
    userRole: string;
}

const defaultTestData: TestData = {
    projectName: "CollabSync Pro",
    userRole: "Lead Researcher",
    metrics: [
        { title: 'Active Projects', value: 42, trend: '+12%', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 text-blue-500' },
        { title: 'Open Challenges', value: 28, trend: '+8%', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10 text-purple-500' },
        { title: 'Pending Requests', value: 15, trend: '+3', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10 text-amber-500' },
        { title: 'Success Rate', value: '92.4%', trend: '+2.4%', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 text-emerald-500' }
    ],
    chartData: [
        { name: 'Jan', value: 45 }, { name: 'Feb', value: 52 }, { name: 'Mar', value: 38 },
        { name: 'Apr', value: 65 }, { name: 'May', value: 48 }, { name: 'Jun', value: 59 },
        { name: 'Jul', value: 72 }, { name: 'Aug', value: 85 }, { name: 'Sep', value: 92 }
    ],
    recentActivity: [
        { id: 1, title: "Quantum Computing Optimization", College_name: "MIT", timestamp: "2h ago" },
        { id: 2, title: "Next-gen Battery Tech", College_name: "Stanford College", timestamp: "4h ago" },
        { id: 3, title: "AI-driven Drug Discovery", College_name: "Oxford Research", timestamp: "1d ago" },
        { id: 4, title: "Clean Energy Infrastructure", College_name: "Technical College Munich", timestamp: "2d ago" },
        { id: 5, title: "Secure Blockchain Logistics", College_name: "ETH Zurich", timestamp: "3d ago" }
    ],
    agreementVersions: [
        {
            version_number: "v1.0",
            created_at: "2024-01-01",
            created_by: "Dr. Sarah Miller (College)",
            content: "Initial draft for the research collaboration...",
            sections: [
                { id: "s1", title: "Definitions", text: "1.1 'Research Materials' means all tangible and intangible research materials..." },
                { id: "s2", title: "IP Rights", text: "2.1 The College shall retain ownership of all Background IP..." },
                { id: "s3", title: "Royalties", text: "3.1 Corporate shall pay 5% of net sales in royalties..." }
            ]
        },
        {
            version_number: "v1.1",
            created_at: "2024-01-10",
            created_by: "James Chen (Corporate)",
            content: "Updated draft with revised royalty terms...",
            sections: [
                { id: "s1", title: "Definitions", text: "1.1 'Research Materials' means all tangible and intangible research materials..." },
                { id: "s2", title: "IP Rights", text: "2.1 The College shall retain ownership of all Background IP. Joint IP shall be shared 50/50." },
                { id: "s3", title: "Royalties", text: "3.1 Corporate shall pay 3.5% of net sales in royalties, capped at $10M total." }
            ]
        }
    ],
    agreementComments: [
        { id: 1, section_id: "s2", author: "Sarah Miller", text: "Can we clarify the 'Joint IP' definition further?", timestamp: "Jan 12, 10:00 AM" },
        { id: 2, section_id: "s3", author: "James Chen", text: "Revised the royalty cap based on our internal discussion.", timestamp: "Jan 12, 2:30 PM" }
    ],
    signatureWorkflow: {
        status: 'approval',
        College_approval: true,
        corporate_approval: false,
        College_signed: false,
        corporate_signed: false,
        audit_trail: [
            { id: 1, event: "Agreement Draft v1.0 created", actor: "Dr. Sarah Miller", timestamp: "Jan 01, 09:00 AM" },
            { id: 2, event: "Revision v1.1 proposed", actor: "James Chen", timestamp: "Jan 10, 02:00 PM" },
            { id: 3, event: "Agreement approved by College", actor: "Dr. Sarah Miller", timestamp: "Jan 12, 11:30 AM" },
            { id: 4, event: "Awaiting Corporate approval", actor: "System", timestamp: "Jan 12, 11:30 AM" }
        ]
    },
    projects: [
        {
            id: 1, title: "Quantum Computing Optimization for Logistics",
            description: "Developing novel quantum algorithms to solve complex vehicle routing problems with time windows and heterogeneous fleets. This project aims to reduce carbon footprint by 15% in urban delivery networks.",
            funding_needed: 750000, trl_level: 4, status: "Active", team_lead: "Dr. Sarah Chen", team_size: 8, publications_count: 12,
            College_name: "MIT", College_location: "Cambridge, USA", expertise_areas: ["Quantum Computing", "Logistics", "Optimization"]
        },
        {
            id: 2, title: "Next-gen Solid State Battery Technology",
            description: "Researching solid-state electrolytes with high ionic conductivity and wide electrochemical stability windows. Focused on improving safety and energy density of EV batteries.",
            funding_needed: 1200000, trl_level: 6, status: "Active", team_lead: "Prof. James Wilson", team_size: 15, publications_count: 24,
            College_name: "Stanford College", College_location: "Stanford, USA", expertise_areas: ["Materials Science", "Energy Storage", "Chemistry"]
        },
        {
            id: 3, title: "AI-driven Drug Discovery for Rare Diseases",
            description: "Utilizing deep learning models to predict protein-ligand binding affinities for orphan receptors. This initiative seeks to accelerate the drug discovery process for neuromuscular disorders.",
            funding_needed: 500000, trl_level: 3, status: "Proposed", team_lead: "Dr. Elena Rodriguez", team_size: 6, publications_count: 8,
            College_name: "Oxford Research Institute", College_location: "Oxford, UK", expertise_areas: ["Artificial Intelligence", "Bioinformatics", "Pharmacology"]
        },
        {
            id: 4, title: "Sustainable Concrete using Recycled Plastics",
            description: "Developing high-performance concrete composites by incorporating processed waste plastics as partial replacements for aggregates. Testing structural integrity and long-term durability.",
            funding_needed: 250000, trl_level: 5, status: "Active", team_lead: "Dr. Mark Thorne", team_size: 4, publications_count: 5,
            College_name: "Technical College Munich", College_location: "Munich, Germany", expertise_areas: ["Civil Engineering", "Sustainability", "Polymer Science"]
        },
        {
            id: 5, title: "Blockchain for Secure Agricultural Supply Chains",
            description: "A decentralized platform for real-time tracking of organic produce from farm to fork. Ensuring transparency in certification and fair pricing for small-scale farmers.",
            funding_needed: 300000, trl_level: 7, status: "Active", team_lead: "Prof. Li Wei", team_size: 9, publications_count: 18,
            College_name: "ETH Zurich", College_location: "Zurich, Switzerland", expertise_areas: ["Blockchain", "Agriculture", "Cybersecurity"]
        }
        // ... adding more for showcase ...
    ].concat(Array.from({ length: 15 }, (_, i) => ({
        id: i + 6,
        title: `Advanced Research Initiative #${i + 6}`,
        description: `A breakthrough study in the field of modern science, focusing on solving critical challenges in industry ${i % 3 === 0 ? 'Healthcare' : i % 3 === 1 ? 'Manufacturing' : 'Environment'}.`,
        funding_needed: Math.floor(Math.random() * 1000000) + 100000,
        trl_level: Math.floor(Math.random() * 7) + 2,
        status: i % 4 === 0 ? "Completed" : "Active",
        team_lead: "Academic Expert",
        team_size: Math.floor(Math.random() * 10) + 3,
        publications_count: Math.floor(Math.random() * 30),
        College_name: "Global College Network",
        College_location: "Global",
        expertise_areas: ["Innovation", "Research", "Technology"]
    }))),
    challenges: [
        {
            id: 1, title: "Zero-Emission Heavy Shipping Engines",
            description: "Post-fossil fuel propulsion systems for maritime logistics. We are seeking technical partners to design hydrogen-ammonia dual-fuel internal combustion engines.",
            budget_min: 2000000, budget_max: 5000000, timeline_months: 36, status: "Open",
            company_name: "Maersk Innovations", industry: "Maritime", company_location: "Copenhagen, Denmark",
            required_expertise: ["Mechanical Engineering", "Hydrogen Power", "Propulsion"], created_at: "2024-01-10T10:00:00Z"
        },
        {
            id: 2, title: "Real-time Defect Detection in Semi-conductors",
            description: "Developing sub-nanometer visual inspection systems using computer vision and specialized optics to identify crystal defects during the wafer fabrication process.",
            budget_min: 500000, budget_max: 1500000, timeline_months: 18, status: "Open",
            company_name: "ASML FutureTech", industry: "Semiconductors", company_location: "Veldhoven, Netherlands",
            required_expertise: ["Computer Vision", "Nanotechnology", "Optics"], created_at: "2024-01-12T08:30:00Z"
        },
        {
            id: 3, title: "Biodegradable Packaging for Hot Liquids",
            description: "Seeking a material that can withstand temperatures up to 100°C for 30 minutes while remaining 100% home-compostable and cost-competitive with PE-lined paper cups.",
            budget_min: 100000, budget_max: 300000, timeline_months: 12, status: "Shortlisted",
            company_name: "Starbucks Green Initiative", industry: "F&B", company_location: "Seattle, USA",
            required_expertise: ["Material Science", "Biochemistry", "Packaging Design"], created_at: "2024-01-05T14:15:00Z"
        }
    ].concat(Array.from({ length: 10 }, (_, i) => ({
        id: i + 4,
        title: `Industry Challenge Enhancement #${i + 4}`,
        description: `A critical technical problem posted by a Fortune 500 company seeking academic collaboration to modernize their ${i % 2 === 0 ? 'digital' : 'physical'} infrastructure.`,
        budget_min: 200000, budget_max: 800000, timeline_months: 24, status: "Open",
        company_name: "Tech Corp International", industry: "Software", company_location: "San Jose, USA",
        required_expertise: ["Data Science", "System Architecture", "AI"], created_at: "2024-01-14T09:00:00Z"
    }))),
    Colleges: [
        {
            id: 1, name: "MIT", location: "Cambridge, MA", website: "https://www.mit.edu",
            research_strengths: "AI, Robotics, Physics, Quantum Computing", available_resources: "Nuclear Reactor Lab, Nano-fabrication Facility",
            success_rate: 98, past_partnerships_count: 450, active_projects_count: 120
        },
        {
            id: 2, name: "Stanford College", location: "Stanford, CA", website: "https://www.stanford.edu",
            research_strengths: "Entrepreneurship, Bio-engineering, Computer Science", available_resources: "SLAC National Accelerator Laboratory",
            success_rate: 96, past_partnerships_count: 380, active_projects_count: 95
        },
        {
            id: 3, name: "ETH Zurich", location: "Zurich, Switzerland", website: "https://ethz.ch",
            research_strengths: "Architecture, Mathematics, Engineering", available_resources: "High-Performance Computing Center",
            success_rate: 94, past_partnerships_count: 290, active_projects_count: 82
        },
        {
            id: 4, name: "College of Oxford", location: "Oxford, UK", website: "https://www.ox.ac.uk",
            research_strengths: "Medicine, Humanities, Social Sciences", available_resources: "Begbroke Science Park",
            success_rate: 95, past_partnerships_count: 510, active_projects_count: 110
        }
    ].concat(Array.from({ length: 15 }, (_, i) => ({
        id: i + 5,
        name: `Institute of Higher Learning #${i + 5}`,
        location: "Global City",
        website: "https://www.globedu.example",
        research_strengths: "Cross-disciplinary Innovation, Future Studies",
        available_resources: "Virtual Collaboration Spaces, Advanced Libraries",
        success_rate: 88 + (i % 5),
        past_partnerships_count: 100 + (i * 10),
        active_projects_count: 20 + i
    })))
};

const TestDataContext = createContext<TestData>(defaultTestData);

export const TestDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <TestDataContext.Provider value={defaultTestData}>
            {children}
        </TestDataContext.Provider>
    );
};

export const useTestData = () => useContext(TestDataContext);
