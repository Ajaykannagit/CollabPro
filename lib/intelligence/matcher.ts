/**
 * Expertise Alignment Matcher
 * 
 * Implements sophisticated matching logic between research projects and industry challenges.
 */

export interface MatchSynergy {
    score: number;
    reasoning: string;
    technicalOverlap: string[];
    strategicFit: 'Transformative' | 'Standard' | 'Experimental';
}

export function calculateSynergy(project: any, challenge: any): MatchSynergy {
    const projectExpertise = new Set(project.expertise_areas || []);
    const challengeExpertise = new Set(challenge.required_expertise || []);

    // 1. Calculate Technical Overlap
    const overlap = [...projectExpertise].filter(x => challengeExpertise.has(x));

    // 2. Base Score Calculation
    let baseScore = 40; // Baseline for any project in the ecosystem

    // Weighted overlap score
    const overlapPercentage = challengeExpertise.size > 0
        ? (overlap.length / challengeExpertise.size)
        : 0;

    baseScore += Math.round(overlapPercentage * 40);

    // 3. Strategic Modifiers

    // TRL Alignment: Industry usually wants TRL 4-6
    if (project.trl_level >= 4 && project.trl_level <= 7) {
        baseScore += 10;
    }

    // Team Capacity: Larger teams signal higher project bandwidth
    if (project.team_size > 8) {
        baseScore += 5;
    }

    // 4. Strategic Fit Classification
    let strategicFit: 'Transformative' | 'Standard' | 'Experimental' = 'Standard';
    if (baseScore > 85) strategicFit = 'Transformative';
    else if (baseScore < 60) strategicFit = 'Experimental';

    // 5. Intelligent Reasoning Generation
    let reasoning = '';
    if (overlap.length > 0) {
        reasoning = `High alignment in key technical domains: ${overlap.join(', ')}. `;
        if (strategicFit === 'Transformative') {
            reasoning += `This partnership represents a rare synergy of high-TRL research and specific industrial needs, with potential for rapid commercialization.`;
        } else {
            reasoning += `The research team's proficiency aligns well with the challenge's core requirements.`;
        }
    } else {
        reasoning = `While direct expertise overlap is emerging, the methodological approach of the research project offers a novel perspective on this industrial challenge.`;
    }

    return {
        score: Math.min(100, baseScore),
        reasoning,
        technicalOverlap: overlap as string[],
        strategicFit
    };
}
