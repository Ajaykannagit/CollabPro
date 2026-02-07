// College profile cards showing research strengths and statistics

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GraduationCap, Search, MapPin, TrendingUp, Briefcase, Award } from 'lucide-react';
import { useLoadAction } from '@/lib/data-actions';
import loadCollegesAction from '@/actions/loadColleges';

import { College } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

export function UniversityProfiles({ onNavigate }: { onNavigate?: (section: any) => void }) {
  const [collegesData, loading, error] = useLoadAction(loadCollegesAction, [] as College[]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  // Filter Colleges based on search query
  const Colleges = collegesData.filter(u =>
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">College Partners</h1>
        <p className="text-slate-400">
          Explore research institutions and their expertise
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Colleges..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Colleges Grid */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading Colleges...</p>
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Colleges.map((College: College) => (
            <Card key={College.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-blue-600 text-white text-lg">
                      {getInitials(College.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl text-slate-100 mb-1">{College.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <MapPin className="h-3 w-3" />
                      <span>{College.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <p className="text-2xl font-bold">{College.success_rate}%</p>
                    </div>
                    <p className="text-xs text-gray-600">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Briefcase className="h-4 w-4" />
                      <p className="text-2xl font-bold">
                        {College.active_projects_count}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">Active Projects</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                      <Award className="h-4 w-4" />
                      <p className="text-2xl font-bold">
                        {College.past_partnerships_count}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600">Partnerships</p>
                  </div>
                </div>

                {/* Research Strengths */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-200 mb-2">
                    Research Strengths
                  </p>
                  <p className="text-sm text-slate-400">{College.research_strengths}</p>
                </div>

                {/* Available Resources */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-200 mb-2">
                    Available Resources
                  </p>
                  <p className="text-sm text-slate-400">{College.available_resources}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Redirecting to Projects",
                        description: `Viewing projects for ${College.name}`,
                      });
                      if (onNavigate) {
                        onNavigate('challenges');
                      }
                    }}
                  >
                    View Projects
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Contact Info",
                        description: `Contacting ${College.name}...`,
                      });
                      window.location.href = `mailto:contact@${College.name.replace(/\s+/g, '').toLowerCase()}.edu`;
                    }}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Colleges found
            </h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
