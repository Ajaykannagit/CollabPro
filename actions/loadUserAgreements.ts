import { supabase } from '@/lib/supabase';

export interface LoadUserAgreementsParams {
    role: 'student' | 'corporate' | 'college' | null;
    organization?: string | null;
    email?: string | null;
}

export default async function loadUserAgreements(
    params: LoadUserAgreementsParams
): Promise<any[]> {
    const role = params.role;
    const organization = (params.organization ?? '').trim();
    const email = (params.email ?? '').trim();

    // Base agreements query with related collaboration request, project, and partner info
    const { data: agreements, error } = await supabase
        .from('agreements')
        .select(`
            id,
            collaboration_request_id,
            agreement_type,
            ip_ownership_split,
            status,
            college_approval_status,
            corporate_approval_status,
            created_at,
            updated_at,
            collaboration_requests (
                id,
                project_brief,
                research_project_id,
                corporate_partner_id,
                corporate_partners (
                    name,
                    industry
                ),
                research_projects (
                    id,
                    title,
                    college_name,
                    colleges (
                        name,
                        location
                    )
                )
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading agreements for tracking:', error);
        throw error;
    }

    let filtered = agreements || [];

    // Corporate users: filter by their organization name matching the corporate partner
    if (role === 'corporate' && organization) {
        const orgLower = organization.toLowerCase();
        filtered = filtered.filter((a: any) => {
            const cr = a.collaboration_requests;
            const companyName = cr?.corporate_partners?.name ?? '';
            return companyName.toLowerCase() === orgLower;
        });
    }

    // Student users: filter by the projects they are involved in
    if (role === 'student' && email) {
        try {
            const { data: student, error: studentError } = await supabase
                .from('student_profiles')
                .select('id')
                .eq('email', email)
                .maybeSingle();

            if (studentError) {
                console.error('Error loading student profile for agreement tracking:', studentError);
                filtered = [];
            } else if (student) {
                const { data: involvement, error: involvementError } = await supabase
                    .from('student_project_involvement')
                    .select('research_project_id')
                    .eq('student_profile_id', student.id);

                if (involvementError) {
                    console.error('Error loading student project involvement:', involvementError);
                    filtered = [];
                } else {
                    const allowedProjectIds = new Set(
                        (involvement || [])
                            .map((row: any) => row.research_project_id)
                            .filter((id: unknown): id is number => typeof id === 'number')
                    );

                    filtered = filtered.filter((a: any) => {
                        const cr = a.collaboration_requests;
                        return cr && allowedProjectIds.has(cr.research_project_id);
                    });
                }
            } else {
                // No student profile found for this email
                filtered = [];
            }
        } catch (err) {
            console.error('Unexpected error while filtering agreements for student:', err);
            filtered = [];
        }
    }

    // College / default role could be filtered here in the future based on college_name

    return filtered.map((a: any) => {
        const cr = a.collaboration_requests;
        const rp = cr?.research_projects;
        const college = rp?.colleges;

        return {
            id: a.id,
            agreement_type: a.agreement_type,
            status: a.status,
            ip_ownership_split: a.ip_ownership_split,
            created_at: a.created_at,
            updated_at: a.updated_at,
            project_title: rp?.title ?? '',
            company_name: cr?.corporate_partners?.name ?? '',
            college_name: rp?.college_name ?? college?.name ?? '',
            college_approval_status: a.college_approval_status ?? false,
            corporate_approval_status: a.corporate_approval_status ?? false,
        };
    });
}

