// Dialog for creating new industry challenges


import { useMutateAction, useLoadAction } from '@/lib/data-actions';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import createIndustryChallengeAction from '@/actions/createIndustryChallenge';
import loadCorporatePartnersAction from '@/actions/loadCorporatePartners';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const challengeSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  budgetMin: z.string().min(1, 'Minimum budget is required'),
  budgetMax: z.string().min(1, 'Maximum budget is required'),
  timelineMonths: z.string().min(1, 'Timeline is required'),
  corporatePartnerId: z.string().min(1, 'Partner is required'),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

type CreateChallengeDialogProps = {
  onClose: () => void;
  onSuccess: () => void;
};

type Partner = {
  id: number;
  name: string;
};

export function CreateChallengeDialog({ onClose, onSuccess }: CreateChallengeDialogProps) {
  const [partners] = useLoadAction<Partner[]>(loadCorporatePartnersAction, []);
  const [createChallenge, isSubmitting] = useMutateAction(createIndustryChallengeAction);
  const { toast } = useToast();

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title: '',
      description: '',
      budgetMin: '',
      budgetMax: '',
      timelineMonths: '',
      corporatePartnerId: '',
    },
  });

  const onSubmit = async (data: ChallengeFormData) => {
    try {
      await createChallenge({
        title: data.title,
        description: data.description,
        budgetMin: parseFloat(data.budgetMin),
        budgetMax: parseFloat(data.budgetMax),
        timelineMonths: parseInt(data.timelineMonths),
        corporatePartnerId: parseInt(data.corporatePartnerId),
      });
      toast({
        title: 'Success',
        description: 'Industry challenge posted successfully',
      });
      onSuccess();
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to create challenge',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Post New Industry Challenge</DialogTitle>
            <DialogDescription>
              Describe your problem and find research partners to solve it
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="corporatePartnerId">Corporate Partner</Label>
              <Select
                value={form.watch('corporatePartnerId')}
                onValueChange={(value) => form.setValue('corporatePartnerId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  {partners.map((partner: Partner) => (
                    <SelectItem key={partner.id} value={String(partner.id)}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.corporatePartnerId && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.corporatePartnerId.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Challenge Title</Label>
              <Input
                id="title"
                placeholder="e.g., Predictive Maintenance for High-Speed Rail"
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the problem you need solved..."
                rows={6}
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="budgetMin">Minimum Budget ($)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  placeholder="500000"
                  {...form.register('budgetMin')}
                />
                {form.formState.errors.budgetMin && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.budgetMin.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="budgetMax">Maximum Budget ($)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  placeholder="1000000"
                  {...form.register('budgetMax')}
                />
                {form.formState.errors.budgetMax && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.budgetMax.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timelineMonths">Timeline (months)</Label>
              <Input
                id="timelineMonths"
                type="number"
                placeholder="24"
                {...form.register('timelineMonths')}
              />
              {form.formState.errors.timelineMonths && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.timelineMonths.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Posting...' : 'Post Challenge'}
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
