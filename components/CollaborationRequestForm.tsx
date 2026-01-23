// Collaboration Request Form

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCollaborationRequests } from '@/hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';

const requestSchema = z.object({
  projectBrief: z.string().min(20, 'Brief must be at least 20 characters'),
  budgetProposed: z.string().min(1, 'Budget is required'),
  timelineProposed: z.string().min(1, 'Timeline is required'),
});

type RequestFormData = z.infer<typeof requestSchema>;

export function CollaborationRequestForm({
  onSuccess,
  projectId,
  projectTitle: _projectTitle,
  onClose
}: {
  onSuccess?: () => void;
  projectId?: number;
  projectTitle?: string;
  onClose?: () => void;
}) {
  const { create } = useCollaborationRequests();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      projectBrief: '',
      budgetProposed: '',
      timelineProposed: '',
    },
  });

  const onSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true);
    try {
      await create({
        corporate_partner_id: 1,
        research_project_id: projectId || 1,
        project_brief: data.projectBrief,
        budget_proposed: parseFloat(data.budgetProposed),
        timeline_proposed: data.timelineProposed,
        status: 'pending',
      });

      toast({
        title: 'Success',
        description: 'Collaboration request submitted successfully',
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit request',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Collaboration Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="projectBrief">Project Brief</Label>
            <Textarea
              id="projectBrief"
              placeholder="Describe the collaboration opportunity..."
              rows={4}
              {...form.register('projectBrief')}
            />
            {form.formState.errors.projectBrief && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.projectBrief.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="budgetProposed">Proposed Budget ($)</Label>
            <Input
              id="budgetProposed"
              type="number"
              placeholder="500000"
              {...form.register('budgetProposed')}
            />
            {form.formState.errors.budgetProposed && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.budgetProposed.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="timelineProposed">Proposed Timeline</Label>
            <Input
              id="timelineProposed"
              placeholder="e.g., 24 months"
              {...form.register('timelineProposed')}
            />
            {form.formState.errors.timelineProposed && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.timelineProposed.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
