// Secure project workspace with tabs for different aspects


import { useState, useMemo } from 'react';
import { useLoadAction } from '@/lib/data-actions';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import loadProjectDetailsAction from '@/actions/loadProjectDetails';
import loadProjectDocumentsAction from '@/actions/loadProjectDocuments';
import loadProjectIPDisclosuresAction from '@/actions/loadProjectIPDisclosures';
import uploadProjectDocumentAction from '@/actions/uploadProjectDocument';
import { IPDisclosureForm } from '@/components/IPDisclosureForm';
import {
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  Lightbulb,
  Building2,
  Mail,
  ShieldAlert,
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { StaggerContainer, FadeInUp, SpringPress, LayoutTransition } from '@/components/ui/animation-wrapper';
import { AnimatePresence } from 'framer-motion';
import { SmartLoader } from '@/components/ui/AIFeedback';

type Milestone = {
  id: number;
  title: string;
  description: string;
  due_date: string;
  status: string;
  deliverables: string;
};

type TeamMember = {
  id: number;
  name: string;
  role: string;
  email: string;
  organization: string;
};

type ProjectDetails = {
  id: number;
  project_name: string;
  description: string;
  funding_allocated: number;
  budget_utilized: number;
  start_date: string;
  end_date: string | null;
  status: string;
  milestones: Milestone[];
  team_members: TeamMember[];
  risk_assessment?: {
    score: number;
    level: string;
    factors: { label: string; impact: number; description: string }[];
    recommendation: string;
  };
};

type ProjectDocument = {
  id: number;
  project_id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  uploaded_by: string;
  uploaded_at: string;
  version: number;
  description: string;
};

type IPDisclosure = {
  id: number;
  title: string;
  submission_date: string;
  status: string;
  category: string;
  description: string;
};

export function ProjectWorkspace({
  projectId = 1,
  onNavigate
}: {
  projectId?: number;
  onNavigate?: (section: any) => void;
}) {
  const { toast } = useToast();
  const [selectedProjectId] = useState(projectId);
  const [isIPDialogOpen, setIsIPDialogOpen] = useState(false);

  const projectParams = useMemo(() => ({ projectId: selectedProjectId }), [selectedProjectId]);
  const [projectData, loading] = useLoadAction<ProjectDetails | null>(
    loadProjectDetailsAction,
    null,
    projectParams
  );

  const docParams = useMemo(() => ({ projectId: selectedProjectId }), [selectedProjectId]);
  const [documents, loadingDocs] = useLoadAction(
    loadProjectDocumentsAction,
    [] as ProjectDocument[],
    docParams
  );

  const ipParams = useMemo(() => ({ projectId: selectedProjectId }), [selectedProjectId]);
  const [ipDisclosures, loadingIP] = useLoadAction(
    loadProjectIPDisclosuresAction,
    [] as IPDisclosure[],
    ipParams
  );


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200 font-bold uppercase tracking-wider text-[10px]';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200 font-bold uppercase tracking-wider text-[10px]';
      case 'pending':
        return 'bg-slate-100 text-slate-700 border-slate-200 font-bold uppercase tracking-wider text-[10px]';
      case 'delayed':
        return 'bg-red-100 text-red-700 border-red-200 font-bold uppercase tracking-wider text-[10px]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-bold uppercase tracking-wider text-[10px]';
    }
  };

  const [uploading, setUploading] = useState(false);


  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('projectId', selectedProjectId.toString());
      formData.append('file', file);
      formData.append('uploadedBy', 'Current User'); // Replace with actual user context if available
      formData.append('description', 'Uploaded via Project Workspace');

      await uploadProjectDocumentAction(formData);

      toast({
        title: "Success",
        description: "File uploaded successfully"
      });

      // Refresh documents list (simple reload for now, ideally strictly refetch)
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: "Upload Failed",
        description: "Ensure 'project-documents' bucket exists in Supabase Storage",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (path: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('project-documents')
        .download(path);

      if (error) throw error;

      // Create download link
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: `Downloading ${fileName}...`
      });
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download file. Check if bucket exists.",
        variant: "destructive"
      });
    }
  };

  // IP Disclosure handled by IPDisclosureForm component

  // ... (in component)
  if (loading || !projectData) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4 p-8">
        <SmartLoader />
        <p className="text-slate-500 font-medium animate-pulse tracking-tight">Synchronizing Project DNA...</p>
      </div>
    );
  }

  const budgetPercent =
    (projectData.budget_utilized / projectData.funding_allocated) * 100;
  const milestones: Milestone[] = projectData.milestones || [];
  const teamMembers: TeamMember[] = projectData.team_members || [];
  const completedMilestones = milestones.filter((m) => m.status === 'completed').length;
  const milestonePercent = (completedMilestones / milestones.length) * 100;

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
              {projectData.project_name}
            </h1>
            <p className="text-slate-500 font-medium max-w-3xl">{projectData.description}</p>
          </div>
          <Badge variant="outline" className={getStatusColor(projectData.status)}>
            {projectData.status.replace('_', ' ')}
          </Badge>
        </div>

        {/* KPI Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <FadeInUp>
            <SpringPress>
              <Card className="border-slate-200 bg-white shadow-sm border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {budgetPercent.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(projectData.budget_utilized)}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                    of {formatCurrency(projectData.funding_allocated)}
                  </p>
                  <Progress value={budgetPercent} className="mt-3 h-1.5 bg-slate-100" />
                </CardContent>
              </Card>
            </SpringPress>
          </FadeInUp>

          <FadeInUp>
            <SpringPress>
              <Card className="border-slate-200 bg-white shadow-sm border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {milestonePercent.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {completedMilestones}/{milestones.length}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Milestones Completed</p>
                  <Progress value={milestonePercent} className="mt-3 h-1.5 bg-slate-100" />
                </CardContent>
              </Card>
            </SpringPress>
          </FadeInUp>

          <FadeInUp>
            <SpringPress>
              <Card className="border-slate-200 bg-white shadow-sm border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{teamMembers.length}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Team Members</p>
                </CardContent>
              </Card>
            </SpringPress>
          </FadeInUp>

          <FadeInUp>
            <SpringPress>
              <Card className="border-slate-200 bg-white shadow-sm border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {new Date(projectData.start_date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Started</p>
                </CardContent>
              </Card>
            </SpringPress>
          </FadeInUp>
        </StaggerContainer>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ip">IP Disclosures</TabsTrigger>
          <TabsTrigger value="risk" className="text-primary font-bold">
            <ShieldAlert className="h-4 w-4 mr-2" />
            Health & Risk
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AnimatePresence mode="wait">
            <LayoutTransition key="overview-trans">
              <Card className="border-slate-200 bg-white shadow-sm border">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-900">Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Description</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {projectData.description}
                    </p>
                  </div>

                  <Separator className="bg-slate-100" />

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Timeline</h3>
                      <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-semibold">Start Date</span>
                          <span className="font-bold text-slate-900">
                            {new Date(projectData.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        {projectData.end_date && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-500 font-semibold">End Date</span>
                            <span className="font-bold text-slate-900">
                              {new Date(projectData.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Budget Breakdown</h3>
                      <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-semibold">Allocated</span>
                          <span className="font-bold text-slate-900">
                            {formatCurrency(projectData.funding_allocated)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-semibold">Utilized</span>
                          <span className="font-bold text-slate-900">
                            {formatCurrency(projectData.budget_utilized)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-semibold">Remaining</span>
                          <span className="font-bold text-green-600">
                            {formatCurrency(
                              projectData.funding_allocated - projectData.budget_utilized
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </LayoutTransition>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="milestones">
          <AnimatePresence mode="wait">
            <LayoutTransition key="milestones-trans">
              <Card className="border-slate-200 bg-white shadow-sm border">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-900">Project Milestones</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <StaggerContainer className="space-y-4">
                    {milestones.map((milestone) => (
                      <FadeInUp
                        key={milestone.id}
                      >
                        <SpringPress className="border border-slate-100 rounded-xl p-5 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="mt-1">
                                {milestone.status === 'completed' ? (
                                  <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                  </div>
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                                  {milestone.title}
                                </h4>
                                <p className="text-sm text-slate-500 mb-3 leading-relaxed font-medium">
                                  {milestone.description}
                                </p>
                                {milestone.deliverables && (
                                  <div className="bg-white/50 p-2.5 rounded-lg border border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                      Deliverables:
                                    </p>
                                    <p className="text-xs text-slate-600 font-semibold">
                                      {milestone.deliverables}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Badge variant="outline" className={getStatusColor(milestone.status)}>
                              {milestone.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 ml-12 uppercase tracking-tight">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Due: {new Date(milestone.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        </SpringPress>
                      </FadeInUp>
                    ))}
                  </StaggerContainer>
                </CardContent>
              </Card>
            </LayoutTransition>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="team">
          <AnimatePresence mode="wait">
            <LayoutTransition key="team-trans">
              <Card className="border-slate-200 bg-white shadow-sm border">
                <CardHeader className="border-b border-slate-100">
                  <CardTitle className="text-slate-900">Team Members</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <StaggerContainer className="grid md:grid-cols-2 gap-4">
                    {teamMembers.map((member) => (
                      <FadeInUp
                        key={member.id}
                      >
                        <SpringPress className="border border-slate-100 rounded-xl p-5 hover:border-primary/20 hover:bg-slate-50 transition-all group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-3xl transform translate-x-4 -translate-y-4 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
                          <div className="flex items-start gap-4 relative z-10">
                            <div className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md shadow-primary/20 ring-4 ring-slate-50">
                              {member.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{member.name}</h4>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">{member.role}</p>
                              <div className="mt-2 space-y-1">
                                <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                  <Building2 className="h-3 w-3" />
                                  {member.organization}
                                </p>
                                {member.email && (
                                  <p className="text-xs font-bold text-primary flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                                    <Mail className="h-3 w-3" />
                                    {member.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </SpringPress>
                      </FadeInUp>
                    ))}
                  </StaggerContainer>
                </CardContent>
              </Card>
            </LayoutTransition>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="documents">
          <AnimatePresence mode="wait">
            <LayoutTransition key="documents-trans">
              <Card className="border-slate-200 bg-white shadow-sm border">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
                  <CardTitle className="text-slate-900">Project Documents</CardTitle>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      aria-label="Upload project document"
                    />
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-white font-bold"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={uploading}
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingDocs ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">Loading documents...</p>
                    </div>
                  ) : documents && documents.length > 0 ? (
                    <StaggerContainer className="space-y-3 pt-6">
                      {documents.map((doc) => (
                        <FadeInUp key={doc.id}>
                          <SpringPress className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{doc.file_name}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight">
                                  {formatFileSize(doc.file_size)} • {doc.uploaded_by} • {new Date(doc.uploaded_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary font-bold hover:bg-primary/10"
                              onClick={() => handleDownload(doc.storage_path, doc.file_name)}
                            >
                              Download
                            </Button>
                          </SpringPress>
                        </FadeInUp>
                      ))}
                    </StaggerContainer>
                  ) : (
                    <div className="p-8 border-2 border-dashed rounded-lg text-center bg-gray-50/20">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No documents uploaded yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </LayoutTransition>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="ip">
          <AnimatePresence mode="wait">
            <LayoutTransition key="ip-trans">
              <Card className="border-slate-200 bg-white shadow-sm border">
                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
                  <CardTitle className="text-slate-900">IP Disclosures</CardTitle>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white font-bold"
                    onClick={() => {
                      setIsIPDialogOpen(true);
                    }}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" /> Submit Disclosure
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingIP ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-500">Loading IP disclosures...</p>
                    </div>
                  ) : ipDisclosures && ipDisclosures.length > 0 ? (
                    <StaggerContainer className="space-y-4 pt-6">
                      {ipDisclosures.map((ip) => (
                        <FadeInUp key={ip.id}>
                          <SpringPress className="flex items-center justify-between p-5 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-all group">
                            <div>
                              <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{ip.title}</h4>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                Submitted: {new Date(ip.submission_date).toLocaleDateString()}
                              </p>
                              {ip.category && (
                                <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary font-bold text-[10px] uppercase h-5">{ip.category}</Badge>
                              )}
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "font-bold uppercase tracking-wider text-[10px] h-6 px-3",
                                ip.status === 'Patent Pending' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  ip.status === 'Under Review' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                    'bg-slate-100 text-slate-600 border-slate-200'
                              )}
                            >
                              {ip.status}
                            </Badge>
                          </SpringPress>
                        </FadeInUp>
                      ))}
                    </StaggerContainer>
                  ) : (
                    <div className="p-8 border-2 border-dashed rounded-lg text-center bg-gray-50/20">
                      <Lightbulb className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No IP disclosures for this project yet</p>
                    </div>
                  )}
                  {!loadingIP && (
                    <div className="p-8 border-2 border-dashed rounded-lg text-center bg-gray-50/20 mt-4">
                      <Lightbulb className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Document new inventions or software created during this project</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </LayoutTransition>
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="risk">
          <AnimatePresence mode="wait">
            <LayoutTransition key="risk-trans">
              <Card className="border-slate-200 bg-white shadow-sm border">
                <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-900">Collaboration Health Analysis</CardTitle>
                    <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest">AI-Driven Risk Oversight</p>
                  </div>
                  {projectData.risk_assessment && (
                    <Badge className={cn(
                      "font-black text-[10px] uppercase tracking-tighter h-7 px-4",
                      projectData.risk_assessment.level === 'Critical' ? 'bg-red-600 text-white' :
                        projectData.risk_assessment.level === 'High' ? 'bg-orange-600 text-white' :
                          projectData.risk_assessment.level === 'Medium' ? 'bg-yellow-500 text-white' :
                            'bg-green-600 text-white'
                    )}>
                      {projectData.risk_assessment.level} RISK
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-8 pb-10">
                  {projectData.risk_assessment ? (
                    <div className="space-y-10">
                      <div className="max-w-md mx-auto text-center">
                        <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-4 border border-slate-100">
                          <div
                            className={cn(
                              "h-full transition-all duration-1000 ease-out",
                              projectData.risk_assessment.score > 75 ? 'bg-red-600' :
                                projectData.risk_assessment.score > 50 ? 'bg-orange-500' :
                                  'bg-green-500'
                            )}
                            style={{ width: `${projectData.risk_assessment.score}%` }}
                          />
                        </div>
                        <p className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{projectData.risk_assessment.score}%</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aggregate Failure Probability</p>
                      </div>

                      <Separator className="bg-slate-100" />

                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            Risk Factors Identified
                          </h3>
                          <div className="space-y-3">
                            {projectData.risk_assessment.factors.map((factor, i) => (
                              <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-bold text-slate-900">{factor.label}</span>
                                  <span className="text-[10px] font-black text-red-600">+{factor.impact} RISK</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                  {factor.description}
                                </p>
                              </div>
                            ))}
                            {projectData.risk_assessment.factors.length === 0 && (
                              <div className="p-12 text-center border border-dashed rounded-xl flex flex-col items-center">
                                <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                                <p className="text-sm font-bold text-slate-600">No critical risk factors detected</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Info className="h-4 w-4 text-primary" />
                            AI Strategic Recommendation
                          </h3>
                          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                              <Lightbulb className="h-24 w-24 text-primary" />
                            </div>
                            <p className="text-slate-800 font-bold leading-relaxed relative z-10 italic">
                              "{projectData.risk_assessment.recommendation}"
                            </p>
                            <div className="mt-6 pt-6 border-t border-primary/10 relative z-10 flex gap-3">
                              <Button
                                size="sm"
                                className="font-bold"
                                onClick={() => {
                                  toast({
                                    title: "Sync Scheduled",
                                    description: "Project stakeholders have been notified of the requested strategic synchronization session.",
                                  });
                                }}
                              >
                                Schedule Sync
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="font-bold"
                                onClick={() => {
                                  toast({
                                    title: "Action Plan Generated",
                                    description: "The AI-driven risk mitigation protocol has been exported and shared with the project lead.",
                                  });
                                }}
                              >
                                View Mitigation Plan
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-slate-500">Risk analytics not available for this project profile.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </LayoutTransition>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      <Dialog open={isIPDialogOpen} onOpenChange={setIsIPDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-0">
          <IPDisclosureForm
            activeProjectId={selectedProjectId}
            onSuccess={() => setIsIPDialogOpen(false)}
            onNavigate={onNavigate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Re-using local Plus icon
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

