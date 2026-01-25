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
        { title: 'Active Projects', value: 0, trend: '0%', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 text-blue-500' },
        { title: 'Open Challenges', value: 0, trend: '0%', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10 text-purple-500' },
        { title: 'Pending Requests', value: 0, trend: '0%', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10 text-amber-500' },
        { title: 'Success Rate', value: '0%', trend: '0%', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10 text-emerald-500' }
    ],
    chartData: [],
    recentActivity: [],
    agreementVersions: [],
    agreementComments: [],
    signatureWorkflow: {
        status: 'draft',
        College_approval: false,
        corporate_approval: false,
        College_signed: false,
        corporate_signed: false,
        audit_trail: []
    },
    projects: [],
    challenges: [],
    Colleges: []
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
