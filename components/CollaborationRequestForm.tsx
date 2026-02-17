// Form for initiating collaboration requests

import { useMutateAction } from '@/lib/data-actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import createCollaborationRequestAction from '@/actions/createCollaborationRequest';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const requestSchema = z.object({
  projectBrief: z.string().min(50, 'Project brief must be at least 50 characters'),
  budgetProposed: z.string().min(1, 'Budget is required'),
  timelineProposed: z.string().min(1, 'Timeline is required'),
});

type RequestFormData = z.infer<typeof requestSchema>;

type CollaborationRequestFormProps = {
  projectId: number;
  projectTitle: string;
  corporatePartnerId?: number;
  onClose: () => void;
  onSuccess: () => void;
};

export function CollaborationRequestForm({
  projectId,
  projectTitle,
  corporatePartnerId = 1,
  onClose,
  onSuccess,
}: CollaborationRequestFormProps) {
  const [createRequest, isSubmitting] = useMutateAction(createCollaborationRequestAction);
  const { toast } = useToast();

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      projectBrief: '',
      budgetProposed: '',
      timelineProposed: '',
    },
  });

  const onSubmit = async (data: RequestFormData) => {
    try {
      await createRequest({
        corporatePartnerId,
        researchProjectId: projectId,
        industryChallengeId: null,
        projectBrief: data.projectBrief,
        budgetProposed: parseFloat(data.budgetProposed),
        timelineProposed: data.timelineProposed,
      });
      toast({
        title: 'Success',
        description: 'Collaboration request sent successfully',
      });
      onSuccess();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send request',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Initiate Collaboration Request</DialogTitle>
            <DialogDescription>Project: {projectTitle}</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="projectBrief">Project Brief</Label>
              <Textarea
                id="projectBrief"
                placeholder="Describe your collaboration proposal, objectives, and expected outcomes..."
                rows={8}
                {...form.register('projectBrief')}
              />
              {form.formState.errors.projectBrief && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.projectBrief.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budgetProposed">Proposed Budget ($)</Label>
              <Input
                id="budgetProposed"
                type="number"
                placeholder="850000"
                {...form.register('budgetProposed')}
              />
              {form.formState.errors.budgetProposed && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.budgetProposed.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timelineProposed">Proposed Timeline</Label>
              <Input
                id="timelineProposed"
                placeholder="e.g., 24 months with 6-month pilot phase"
                {...form.register('timelineProposed')}
              />
              {form.formState.errors.timelineProposed && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.timelineProposed.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}
