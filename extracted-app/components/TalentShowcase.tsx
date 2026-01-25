// Student talent showcase with filtering

import { useState } from 'react';
import { useLoadAction } from '@uibakery/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import loadStudentProfilesAction from '@/actions/loadStudentProfiles';
import { Search, GraduationCap, Briefcase, Mail, Star } from 'lucide-react';

type StudentProfile = {
  id: number;
  name: string;
  email: string;
  degree_level: string;
  field_of_study: string;
  graduation_year: number;
  gpa: number;
  bio: string;
  availability_status: string;
  College_name: string;
  skills: string[];
  project_count: number;
};

export function TalentShowcase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');
  const [students, loading, error] = useLoadAction(
    loadStudentProfilesAction,
    [],
    {
      searchQuery: searchQuery || null,
      degreeLevel: degreeFilter || null,
    }
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Talent Showcase</h1>
        <p className="text-gray-600">Discover exceptional students for recruitment</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={degreeFilter} onValueChange={setDegreeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Degrees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Degrees</SelectItem>
                <SelectItem value="PhD">PhD</SelectItem>
                <SelectItem value="Masters">Masters</SelectItem>
                <SelectItem value="Bachelors">Bachelors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Student Cards */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading student profiles...</p>
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
        <div className="grid md:grid-cols-2 gap-6">
          {students.map((student: StudentProfile) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-lg">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {student.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{student.degree_level}</span>
                      <span>•</span>
                      <span>{student.College_name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">
                        {student.availability_status.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{student.gpa}</span>
                        <span className="text-gray-500">GPA</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {student.field_of_study}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {student.bio}
                  </p>
                </div>

                {student.skills && student.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.slice(0, 6).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {student.skills.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{student.skills.length - 6}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm text-gray-600 mb-4 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{student.project_count} projects</span>
                  </div>
                  <span>•</span>
                  <span>Class of {student.graduation_year}</span>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    Request Interview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && students.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
