import { action } from '@/lib/data-actions';

function loadAgreementTemplates() {
    return action('loadAgreementTemplates', 'SQL', {
        datasourceName: 'collabsync_pro_db',
        query: `
      SELECT 
        id,
        name,
        description,
        agreement_type,
        ip_ownership_split,
        revenue_sharing_model,
        confidentiality_terms,
        termination_clauses,
        compliance_requirements
      FROM agreement_templates
      ORDER BY name ASC;
    `,
    });
}

export default loadAgreementTemplates;
