// College profile cards showing research strengths and statistics

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GraduationCap, Search, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useColleges } from '@/hooks/useDatabase';
import { College } from '@/lib/types';

export function CollegeProfiles({ onNavigate }: { onNavigate?: (section: any) => void }) {
  const { data: allColleges, loading, error } = useColleges();
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleContact = (collegeName: string) => {
    toast({
      title: "Contact Requested",
      description: `A connection request has been sent to the research office at ${collegeName}.`,
    });
  };

  // Filter Colleges based on search query... (rest of logic same)
  const Colleges = (allColleges || []).filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-8">
      {/* ... header and search bar ... */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">College Partners</h1>
        <p className="text-slate-400">
          Explore research institutions and their expertise
        </p>
      </div>

      <Card className="mb-6 border-white/10 bg-white/5">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Colleges..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Colleges.map((College: College) => (
            <Card key={College.id} className="hover:shadow-lg transition-shadow border-white/10 bg-white/5 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white/10 shadow-xl">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl font-bold">
                      {getInitials(College.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-white mb-1">{College.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <MapPin className="h-3 w-3" />
                      <span>{College.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="text-center">
                    <p className="text-xl font-bold text-emerald-400">{College.success_rate || 0}%</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Success</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-blue-400">{College.active_projects_count || 0}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-400">{College.past_partnerships_count || 0}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Partners</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Expertise</p>
                    <p className="text-sm text-slate-300 line-clamp-2">{College.research_strengths}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                    size="sm"
                    onClick={() => onNavigate && onNavigate('projects')}
                  >
                    View Projects
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContact(College.name)}
                    className="flex-1 border-white/10 hover:bg-white/5 text-slate-300"
                  >
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && Colleges.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">
              No Colleges found
            </h3>
            <p className="text-gray-400">Try adjusting your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
