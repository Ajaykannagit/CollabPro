// Dialog for creating new research projects

import { useState } from 'react';
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
import { useProjects } from '@/hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';

const projectSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    fundingNeeded: z.string().min(1, 'Funding amount is required'),
    trlLevel: z.string().min(1, 'TRL level is required'),
    teamLead: z.string().min(1, 'Team lead is required'),
    teamSize: z.string().min(1, 'Team size is required'),
    collegeName: z.string().min(1, 'College name is required'),
    location: z.string().min(1, 'Location is required'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

type CreateProjectDialogProps = {
    onClose: () => void;
    onSuccess: () => void;
};

export function CreateProjectDialog({ onClose, onSuccess }: CreateProjectDialogProps) {
    const { create } = useProjects();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            description: '',
            fundingNeeded: '',
            trlLevel: '1',
            teamLead: '',
            teamSize: '',
            collegeName: '',
            location: '',
        },
    });

    const onSubmit = async (data: ProjectFormData) => {
        setIsSubmitting(true);
        try {
            await create({
                title: data.title,
                description: data.description,
                funding_needed: parseFloat(data.fundingNeeded),
                trl_level: parseInt(data.trlLevel),
                status: 'Active',
                team_lead: data.teamLead,
                team_size: parseInt(data.teamSize),
                publications_count: 0,
                college_name: data.collegeName,
                college_location: data.location,
                expertise_areas: [],
            });

            toast({
                title: 'Success',
                description: 'Research project created successfully',
            });
            onSuccess();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to create project',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto bg-[#0a0a0c] text-white border-white/10 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-white">Create New Research Project</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Showcase your research to potential industry partners
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Quantum Cryptography for Secure Communication"
                            {...form.register('title')}
                            className="bg-white/5 border-white/10"
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe your research, methodology, and practical applications..."
                            rows={4}
                            {...form.register('description')}
                            className="bg-white/5 border-white/10"
                        />
                        {form.formState.errors.description && (
                            <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fundingNeeded">Funding Needed (₹)</Label>
                            <Input
                                id="fundingNeeded"
                                type="number"
                                placeholder="1000000"
                                {...form.register('fundingNeeded')}
                                className="bg-white/5 border-white/10"
                            />
                            {form.formState.errors.fundingNeeded && (
                                <p className="text-sm text-red-500">{form.formState.errors.fundingNeeded.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="trlLevel">TRL Level (1-9)</Label>
                            <Input
                                id="trlLevel"
                                type="number"
                                min="1"
                                max="9"
                                {...form.register('trlLevel')}
                                className="bg-white/5 border-white/10"
                            />
                            {form.formState.errors.trlLevel && (
                                <p className="text-sm text-red-500">{form.formState.errors.trlLevel.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="teamLead">Team Lead</Label>
                            <Input
                                id="teamLead"
                                placeholder="Dr. Jane Smith"
                                {...form.register('teamLead')}
                                className="bg-white/5 border-white/10"
                            />
                            {form.formState.errors.teamLead && (
                                <p className="text-sm text-red-500">{form.formState.errors.teamLead.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="teamSize">Team Size</Label>
                            <Input
                                id="teamSize"
                                type="number"
                                placeholder="5"
                                {...form.register('teamSize')}
                                className="bg-white/5 border-white/10"
                            />
                            {form.formState.errors.teamSize && (
                                <p className="text-sm text-red-500">{form.formState.errors.teamSize.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="collegeName">College Name</Label>
                            <Input
                                id="collegeName"
                                placeholder="IIT Madras"
                                {...form.register('collegeName')}
                                className="bg-white/5 border-white/10"
                            />
                            {form.formState.errors.collegeName && (
                                <p className="text-sm text-red-500">{form.formState.errors.collegeName.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                placeholder="Chennai, Tamil Nadu"
                                {...form.register('location')}
                                className="bg-white/5 border-white/10"
                            />
                            {form.formState.errors.location && (
                                <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary hover:bg-primary/90">
                            {isSubmitting ? 'Creating...' : 'Create Project'}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/5">
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
