// Talent Showcase - browse student/researcher profiles

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, GraduationCap } from 'lucide-react';
import { useStudentProfiles } from '@/hooks/useDatabase';

export function TalentShowcase() {
  const { data: profiles } = useStudentProfiles();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Talent Showcase</h1>
        <p className="text-slate-400">Discover talented researchers and students</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles && profiles.length > 0 ? (
          profiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <p className="text-sm text-slate-400">{profile.degree}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <GraduationCap className="h-4 w-4" />
                    <span>{profile.university}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-300 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.skills?.slice(0, 4).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full" size="sm">View Profile</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-100 mb-2">No profiles available</h3>
              <p className="text-slate-400">Talent profiles will appear here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
