// User Profile - Edit and View User Profile

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function UserProfile() {
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Dr. Lakshmi Narayanan",
        title: "Senior Research Scientist",
        organization: "IIT Madras Research Park",
        email: "lakshmi.n@iitm.ac.in",
        location: "Chennai, Tamil Nadu",
        bio: "Specializing in quantum algorithms and optimization problems for supply chain logistics in South India. Leading a team of 8 researchers focused on sustainable logistics applications.",
        expertise: ["Quantum Computing", "Logistics Optimization", "Physics", "Linear Algebra"],
        projects_count: 5,
        patents_count: 3
    });

    const handleSave = () => {
        setIsEditing(false);
        toast({
            title: "Profile Updated",
            description: "Your profile changes have been saved successfully.",
        });
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-100">My Profile</h1>
                <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Avatar className="h-24 w-24 mx-auto mb-4">
                                <AvatarImage src="/placeholder-avatar.jpg" />
                                <AvatarFallback className="text-xl bg-blue-100 text-blue-700">LN</AvatarFallback>
                            </Avatar>

                            {isEditing ? (
                                <div className="space-y-3">
                                    <Input
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        placeholder="Name"
                                    />
                                    <Input
                                        value={profile.title}
                                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                                        placeholder="Title"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-slate-900 mb-1">{profile.name}</h2>
                                    <p className="text-slate-500 mb-4">{profile.title}</p>
                                </>
                            )}

                            <div className="flex flex-col gap-2 mt-4 text-left text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    {isEditing ? (
                                        <Input
                                            value={profile.organization}
                                            onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                                        />
                                    ) : (
                                        <span>{profile.organization}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {isEditing ? (
                                        <Input
                                            value={profile.location}
                                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                        />
                                    ) : (
                                        <span>{profile.location}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>{profile.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Projects</span>
                                <span className="font-bold text-slate-900">{profile.projects_count}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Patents</span>
                                <span className="font-bold text-slate-900">{profile.patents_count}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditing ? (
                                <Textarea
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    rows={4}
                                />
                            ) : (
                                <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Expertise</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {profile.expertise.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="px-3 py-1">
                                        {skill}
                                    </Badge>
                                ))}
                                {isEditing && (
                                    <Button variant="outline" size="sm" className="h-6">
                                        + Add
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <GraduationCap className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">PhD in Quantum Physics</h4>
                                    <p className="text-sm text-slate-500">Indian Institute of Technology (IIT), Madras</p>
                                    <p className="text-xs text-slate-400 mt-1">2015 - 2019</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
