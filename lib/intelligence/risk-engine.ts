/**
 * Collaboration Risk Engine
 * 
 * Analyzes ongoing collaborations to predict the probability of failure 
 * or timeline slippage based on engagement and resource metrics.
 */

export interface RiskAssessment {
    score: number; // 0 to 100
    level: 'Low' | 'Medium' | 'High' | 'Critical';
    factors: {
        label: string,
        impact: number; // -10 to +10
        description: string;
    }[];
    recommendation: string;
}

export interface CollaborationMetrics {
    daysSinceLastMilestone: number;
    budgetUtilization: number; // ratio 0.0 to 1.0
    milestoneProgress: number; // ratio 0.0 to 1.0
    communicationFrequency: number; // messages per week
    sentimentScore: number; // -1.0 to 1.0
}

export function assessCollaborationRisk(metrics: CollaborationMetrics): RiskAssessment {
    const {
        daysSinceLastMilestone,
        budgetUtilization,
        milestoneProgress,
        communicationFrequency,
        sentimentScore
    } = metrics;

    let riskScore = 20; // Base score
    const factors: RiskAssessment['factors'] = [];

    // 1. Budget vs Progress Alignment
    const progressionGap = budgetUtilization - milestoneProgress;
    if (progressionGap > 0.2) {
        riskScore += 25;
        factors.push({
            label: 'Budget Overrun',
            impact: 8,
            description: `Budget consumption (${(budgetUtilization * 100).toFixed(0)}%) is significantly outpacing milestone progress (${(milestoneProgress * 100).toFixed(0)}%).`
        });
    }

    // 2. Engagement Decay
    if (communicationFrequency < 2) {
        riskScore += 20;
        factors.push({
            label: 'Engagement Decay',
            impact: 6,
            description: 'Communication frequency has dropped below the critical threshold of 2 updates per week.'
        });
    }

    // 3. Timeline Stagnation
    if (daysSinceLastMilestone > 45) {
        riskScore += 15;
        factors.push({
            label: 'Timeline Stagnation',
            impact: 5,
            description: `No milestone updates or completions recorded in the last ${daysSinceLastMilestone} days.`
        });
    }

    // 4. Sentiment Analysis
    if (sentimentScore < 0) {
        riskScore += 10;
        factors.push({
            label: 'Interpersonal Friction',
            impact: 4,
            description: 'AI sentiment analysis of negotiation and workspace chat indicates rising friction.'
        });
    }

    // Determine Level
    let level: RiskAssessment['level'] = 'Low';
    if (riskScore > 75) level = 'Critical';
    else if (riskScore > 50) level = 'High';
    else if (riskScore > 35) level = 'Medium';

    // Recommendation logic
    let recommendation = 'Collaboration is healthy. Continue with current roadmap.';
    if (level === 'Critical') {
        recommendation = 'IMMEDIATE MEDIATION REQUIRED. Schedule a strategic alignment meeting within 48 hours to prevent total partnership failure.';
    } else if (level === 'High') {
        recommendation = 'Adjust project scope or increase team allocation to address the budget-progress gap.';
    } else if (level === 'Medium') {
        recommendation = 'Monitor engagement closely. Consider a brief status sync to re-align on near-term deliverables.';
    }

    return {
        score: Math.min(100, riskScore),
        level,
        factors,
        recommendation
    };
}
