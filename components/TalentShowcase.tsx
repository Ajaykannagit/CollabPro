import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap, Github, Linkedin } from 'lucide-react';
import { useStudentProfiles } from '@/hooks/useDatabase';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function TalentShowcase() {
  const { data: profiles } = useStudentProfiles();
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const { toast } = useToast();

  const handleHire = (name: string) => {
    toast({
      title: "Inquiry Sent",
      description: `We've sent your interest in collaborating with ${name} to their department.`,
    });
    setSelectedProfile(null);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Talent Showcase</h1>
        <p className="text-slate-400">Discover talented researchers and students available for projects</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles && profiles.length > 0 ? (
          profiles.map((profile) => (
            <Card key={profile.id} className="border-white/10 bg-white/5 backdrop-blur-md hover:border-white/20 transition-all group overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <User className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">{profile.name}</CardTitle>
                    <p className="text-sm text-slate-400 font-medium">{profile.degree}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400 bg-white/5 p-2 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="truncate">{profile.college}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills?.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] uppercase tracking-wider border-white/5 bg-white/5 text-slate-400">{skill}</Badge>
                      ))}
                      {profile.skills?.length > 3 && (
                        <Badge variant="outline" className="text-[10px] border-white/5 bg-white/5 text-slate-500">+{profile.skills.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    size="sm"
                    onClick={() => setSelectedProfile(profile)}
                  >
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-dashed border-white/10 bg-white/5">
            <CardContent className="p-12 text-center">
              <User className="h-16 w-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-300 mb-2">No Profiles Listed</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Talent profiles will appear here once students and researchers from partner colleges join the platform.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {selectedProfile && (
        <Dialog open onOpenChange={() => setSelectedProfile(null)}>
          <DialogContent className="max-w-lg bg-[#0a0a0c] text-white border-white/10 shadow-2xl">
            <DialogHeader className="border-b border-white/5 pb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl">{selectedProfile.name}</DialogTitle>
                  <p className="text-primary font-medium">{selectedProfile.degree}</p>
                </div>
              </div>
            </DialogHeader>
            <div className="py-6 space-y-6">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Biography</p>
                <p className="text-slate-300 leading-relaxed italic">"{selectedProfile.bio || 'Passionate researcher focused on cutting-edge technological advancements and cross-industry collaboration.'}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Affiliation</p>
                  <p className="text-sm font-medium">{selectedProfile.college}</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Availability</p>
                  <p className="text-sm font-medium text-emerald-400">{selectedProfile.availability || 'Immediate'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Core Skills</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.skills?.map((skill: string, i: number) => (
                    <Badge key={i} className="bg-primary/10 text-primary border-primary/20">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => handleHire(selectedProfile.name)} className="flex-1 bg-primary hover:bg-primary/90">
                  Request Collaboration
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5 text-slate-400">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="border-white/10 hover:bg-white/5 text-slate-400">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
