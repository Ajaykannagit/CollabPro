import { action } from '@/lib/data-actions';
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
        // 1. Upload to Storage
        // Note: 'project-documents' bucket must exist in Supabase
        await uploadFileToStorage(file, filePath);

        // 2. Create Database Record
        return action('uploadProjectDocument', 'SQL', {
            datasourceName: 'collabsync_pro_db',
            query: `
        INSERT INTO project_documents (
          project_id,
          file_name,
          file_size,
          file_type,
          storage_path,
          uploaded_by,
          description
        ) VALUES (
          {{params.projectId}}::int,
          {{params.fileName}},
          {{params.fileSize}}::bigint,
          {{params.fileType}},
          {{params.storagePath}},
          {{params.uploadedBy}},
          {{params.description}}
        )
        RETURNING *;
      `,
            params: {
                projectId,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                storagePath: filePath,
                uploadedBy: uploadedBy || 'Unknown User',
                description: description || ''
            }
        });
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}
