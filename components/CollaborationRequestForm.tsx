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
  onSuccess?: () => void; // Changed to optional based on snippet
  onNavigate?: (section: any) => void; // Added onNavigate
};

export function CollaborationRequestForm({
  projectId,
  projectTitle,
  onClose,
  onSuccess,
  onNavigate, // Added onNavigate
}: CollaborationRequestFormProps) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false); // Replaced isSubmitting from useMutateAction
  const [formData, setFormData] = useState({ // Replaced react-hook-form state
    budget: '',
    timeline: '',
    brief: ''
  });

  // Removed useMutateAction and useForm hooks as per snippet's new state management

  const handleSubmit = async (e: React.FormEvent) => { // Renamed onSubmit to handleSubmit and changed signature
    e.preventDefault();
    if (!formData.brief || !formData.budget || !formData.timeline) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      await createCollaborationRequestAction({
        research_project_id: projectId,
        corporate_partner_id: 1, // Simulated current user partner (hardcoded as per snippet)
        project_brief: formData.brief,
        budget_proposed: parseFloat(formData.budget),
        timeline_proposed: formData.timeline
      });

      toast({
        title: "Request Submitted",
        description: `Your collaboration request for "${projectTitle}" has been sent.`,
      });

      onSuccess?.();
      onClose();

      // Navigate to tracking if needed
      if (onNavigate) {
        onNavigate('agreements');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
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
