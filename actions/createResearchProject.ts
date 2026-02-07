
import { action } from '@/lib/data-actions';

function createResearchProject() {
    return action('createResearchProject', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      INSERT INTO research_projects (
        project_name,
        description,
        college_id,
        status,
        funding_allocated,
        budget_utilized,
        start_date
      ) VALUES (
        {{params.title}},
        {{params.description}},
        {{params.collegeId}}::int,
        'active',
        {{params.fundingAllocated}}::numeric,
        0,
        NOW()
      )
      RETURNING id;
    `,
    });
}

export default createResearchProject;
