import { useState } from 'react';
import { useAppStore, User } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Briefcase, Building2, Camera, User as UserIcon } from 'lucide-react';
import { FadeInUp, SpringPress } from '@/components/ui/animation-wrapper';
import { getRoleLabel } from '@/lib/userUtils';

export function ProfilePage() {
    const { user, updateUser } = useAppStore();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || '',
        organization: user?.organization || '',
        department: user?.department || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateUser(formData);
            toast({
                title: "Profile Updated",
                description: "Your changes have been saved successfully.",
            });
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "There was an error saving your profile.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const placeholderPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=0D8ABC&color=fff&size=128`;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <FadeInUp>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
                    <p className="text-slate-500 font-medium">Manage your personal information and account preferences.</p>
                </div>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Photo Sidebar */}
                <FadeInUp delay={0.1} className="md:col-span-1">
                    <Card className="border-slate-200 bg-white shadow-sm overflow-hidden border">
                        <CardContent className="p-6 flex flex-col items-center">
                            <div className="relative group mb-4">
                                <div className="h-32 w-32 rounded-full overflow-hidden ring-4 ring-primary/10 shadow-lg">
                                    <img
                                        src={placeholderPhoto}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-0 right-0 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors ring-4 ring-white">
                                    <Camera className="h-5 w-5" />
                                </button>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">{formData.name}</h3>
                            <p className="text-primary text-[10px] font-black uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full mb-4">
                                {getRoleLabel(user)}
                            </p>

                            <div className="w-full space-y-2 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span>{formData.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Briefcase className="h-4 w-4 text-slate-400" />
                                    <span>{formData.role}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </FadeInUp>

                {/* Main Settings Form */}
                <FadeInUp delay={0.2} className="md:col-span-2">
                    <Card className="border-slate-200 bg-white shadow-sm border">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <CardTitle className="text-xl text-slate-900">Personal Information</CardTitle>
                            <CardDescription>Update your profile details and how others see you.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                                        <UserIcon className="h-3.5 w-3.5" /> Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="bg-slate-50 border-slate-200 text-slate-900 font-medium h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5" /> Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-slate-50 border-slate-200 text-slate-900 font-medium h-11"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role" className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                                        <Briefcase className="h-3.5 w-3.5" /> Professional Role
                                    </Label>
                                    <Input
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="bg-slate-50 border-slate-200 text-slate-900 font-medium h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department" className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                                        <Building2 className="h-3.5 w-3.5" /> Department
                                    </Label>
                                    <Input
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="bg-slate-50 border-slate-200 text-slate-900 font-medium h-11"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="organization" className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
                                    <Building2 className="h-3.5 w-3.5" /> Organization
                                </Label>
                                <Input
                                    id="organization"
                                    name="organization"
                                    value={formData.organization}
                                    onChange={handleChange}
                                    className="bg-slate-50 border-slate-200 text-slate-900 font-medium h-11"
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <SpringPress>
                                    <Button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-primary/20"
                                    >
                                        {isSaving ? 'Saving Changes...' : 'Save Profile'}
                                    </Button>
                                </SpringPress>
                            </div>
                        </CardContent>
                    </Card>
                </FadeInUp>
            </div>
        </div>
    );
}
