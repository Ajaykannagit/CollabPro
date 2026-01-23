// IP Disclosure Form

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIPDisclosures } from '@/hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';

const disclosureSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  inventionType: z.string().min(1, 'Invention type is required'),
  inventors: z.string().min(1, 'At least one inventor is required'),
});

type DisclosureFormData = z.infer<typeof disclosureSchema>;

export function IPDisclosureForm({ activeProjectId, onSuccess }: { activeProjectId: number; onSuccess?: () => void }) {
  const { create } = useIPDisclosures();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DisclosureFormData>({
    resolver: zodResolver(disclosureSchema),
    defaultValues: {
      title: '',
      description: '',
      inventionType: '',
      inventors: '',
    },
  });

  const onSubmit = async (data: DisclosureFormData) => {
    setIsSubmitting(true);
    try {
      await create({
        active_project_id: activeProjectId,
        title: data.title,
        description: data.description,
        invention_type: data.inventionType,
        inventors: data.inventors.split(',').map(i => i.trim()),
        disclosure_date: new Date().toISOString(),
        status: 'Submitted',
      });

      toast({
        title: 'Success',
        description: 'IP disclosure submitted successfully',
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit disclosure',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Submit IP Disclosure</h1>
        <p className="text-slate-400">Protect your intellectual property</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disclosure Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="title">Invention Title</Label>
              <Input
                id="title"
                placeholder="e.g., Novel Quantum Algorithm"
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="inventionType">Invention Type</Label>
              <Select
                value={form.watch('inventionType')}
                onValueChange={(value) => form.setValue('inventionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Patent">Patent</SelectItem>
                  <SelectItem value="Copyright">Copyright</SelectItem>
                  <SelectItem value="Trade Secret">Trade Secret</SelectItem>
                  <SelectItem value="Trademark">Trademark</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.inventionType && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.inventionType.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the invention..."
                rows={6}
                {...form.register('description')}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="inventors">Inventors (comma-separated)</Label>
              <Input
                id="inventors"
                placeholder="e.g., John Doe, Jane Smith"
                {...form.register('inventors')}
              />
              {form.formState.errors.inventors && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.inventors.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Disclosure'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
