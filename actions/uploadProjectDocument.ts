import { supabase } from '@/lib/supabase';

// Helper to upload file to Supabase Storage
async function uploadFileToStorage(file: File, path: string) {
    const { data, error } = await supabase.storage
        .from('project-documents')
        .upload(path, file);

    if (error) throw error;
    return data.path;
}

export default async function uploadProjectDocument(formData: FormData) {
    const projectId = formData.get('projectId') as string;
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const uploadedBy = formData.get('uploadedBy') as string;

    if (!file || !projectId) {
        throw new Error('Missing file or project ID');
    }

    // Generate unique path
    const timestamp = Date.now();
    const filePath = `projects/${projectId}/${timestamp}_${file.name}`;

    try {
        // 1. Map projectId (active_project id) to research_project_id
        let researchProjectId = Number(projectId);
        const ap = await supabase.from('active_projects').select('collaboration_request_id').eq('id', researchProjectId).single();
        if (ap.data?.collaboration_request_id) {
            const cr = await supabase.from('collaboration_requests').select('research_project_id').eq('id', ap.data.collaboration_request_id).single();
            if (cr.data?.research_project_id != null) researchProjectId = cr.data.research_project_id;
        }

        // 2. Upload to Storage
        // Note: 'project-documents' bucket must exist in Supabase
        await uploadFileToStorage(file, filePath);

        // 3. Create Database Record in project_documents
        const { data, error } = await supabase
            .from('project_documents')
            .insert([{
                project_id: researchProjectId,
                file_name: file.name,
                file_size: file.size,
                file_type: file.type,
                storage_path: filePath,
                uploaded_by: uploadedBy || 'Unknown User',
                description: description || '',
            }])
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to save project document record: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}
