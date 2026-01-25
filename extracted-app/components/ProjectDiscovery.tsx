// Project Discovery page with filterable research projects grid

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import { ProjectDetailModal } from '@/components/ProjectDetailModal';
import { formatINRCompact, usdToINR } from '@/lib/currency';

type ResearchProject = {
  id: number;
  title: string;
  description: string;
  funding_needed: number;
  trl_level: number;
  status: string;
  team_lead: string;
  team_size: number;
  publications_count: number;
  College_name: string;
  College_location: string;
  expertise_areas: string[];
};

import { useTestData } from '@/contexts/TestDataContext';

export function ProjectDiscovery() {
  const { projects: allProjects } = useTestData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Filter projects based on search query
  const projects = allProjects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.College_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loading = false;
  const error: any = null;

  const formatCurrency = (amount: number) => {
    return formatINRCompact(usdToINR(amount));
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Research Projects</h1>
        <p className="text-slate-400">Discover cutting-edge College research available for collaboration</p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading research projects...</p>
        </div>
      )}

      {error && (
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading projects: {error.message}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: ResearchProject) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{project.College_name}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                  {project.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Funding Needed
                    </span>
                    <span className="font-semibold text-slate-100">
                      {formatCurrency(project.funding_needed)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      TRL Level
                    </span>
                    <span className="font-semibold text-gray-900">
                      {project.trl_level}/9
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.expertise_areas?.slice(0, 3).map((area, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                  {project.expertise_areas?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{project.expertise_areas.length - 3} more
                    </span>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => setSelectedProject(project)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}

      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
