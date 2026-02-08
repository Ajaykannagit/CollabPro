import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Home, Briefcase, Building2, Sparkles, User, Bell, Target, FileText, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProjectDiscovery } from '@/components/ProjectDiscovery';
import { IndustryChallengesBoard } from '@/components/IndustryChallengesBoard';
import { AIMatchmaking } from '@/components/AIMatchmaking';
import { UniversityProfiles } from '@/components/UniversityProfiles';
import { NotificationsPanel } from '@/components/NotificationsPanel';
import { DashboardOverview } from '@/components/DashboardOverview';
import { ProjectWorkspace } from '@/components/ProjectWorkspace';
import { TalentShowcase } from '@/components/TalentShowcase';
import { IPPortfolio } from '@/components/IPPortfolio';
import { NegotiationWorkspace } from '@/components/NegotiationWorkspace';
import { AgreementGenerator } from '@/components/AgreementGenerator';
import { IPDisclosureForm } from '@/components/IPDisclosureForm';
import { LicensingMarketplace } from '@/components/LicensingMarketplace';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { AgreementCompareReview } from '@/components/AgreementCompareReview';
import { DigitalSignature } from '@/components/DigitalSignature';

import { ParticleBackground } from '@/components/ui/animated-primitives';
import { useAppStore } from '@/lib/store';
import DecryptedText from '@/components/ui/DecryptedText';
import { useNotifications } from '@/hooks/useDatabase';

type NavSection = 'dashboard' | 'projects' | 'challenges' | 'partners' | 'matchmaking' | 'agreement-review' | 'digital-signature' | 'notifications' | 'profile' | 'workspace' | 'talent' | 'ip' | 'negotiate' | 'agreement' | 'ipdisclosure' | 'licensing' | 'analytics';

import { seedDatabase } from '@/lib/seedDatabase';
import { DatabaseStatus } from '@/components/DatabaseStatus';

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<number>(1);
  const { unreadCount } = useNotifications();

  const { loadUser } = useAppStore();

  useEffect(() => {
    seedDatabase();
    loadUser('user_1');
  }, [loadUser]);

  const navItems = [
    { id: 'dashboard' as NavSection, label: 'Dashboard', icon: Home },
    { id: 'projects' as NavSection, label: 'Research Projects', icon: Briefcase },
    { id: 'challenges' as NavSection, label: 'Industry Challenges', icon: Target },
    { id: 'partners' as NavSection, label: 'Colleges', icon: Building2 },
    { id: 'matchmaking' as NavSection, label: 'AI Matchmaking', icon: Sparkles },
    { id: 'agreement-review' as NavSection, label: 'Agreement Review', icon: FileText },
    { id: 'digital-signature' as NavSection, label: 'Digital Signature', icon: PenTool },
    { id: 'notifications' as NavSection, label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile' as NavSection, label: 'Profile', icon: User },
  ];

  const secondaryItems = [
    { id: 'workspace' as NavSection, label: 'Project Workspace', icon: Target },
    { id: 'talent' as NavSection, label: 'Talent Showcase', icon: User },
    { id: 'ip' as NavSection, label: 'IP Portfolio', icon: Briefcase },
    { id: 'negotiate' as NavSection, label: 'Negotiation', icon: Target },
    { id: 'agreement' as NavSection, label: 'Agreement', icon: Target },
    { id: 'ipdisclosure' as NavSection, label: 'Submit IP', icon: Target },
    { id: 'licensing' as NavSection, label: 'Licensing Market', icon: Target },
    { id: 'analytics' as NavSection, label: 'Analytics', icon: Target },
  ];

  // Helper to handle navigation to a specific project
  const navigateToProject = (projectId: number) => {
    setActiveProjectId(projectId);
    setActiveSection('workspace');
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      {/* Ambient Background Mesh */}
      <ParticleBackground />

      {/* Glassmorphism Sidebar */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 z-10 relative flex flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl"
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                <DecryptedText text="CollabSync Pro" />
              </h1>
              <span className="text-xs font-medium text-primary tracking-widest uppercase">Pro</span>
            </div>
          </div>
          <div className="px-6 py-3">
            <DatabaseStatus />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 px-3 mb-2 uppercase tracking-wider">Main Menu</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive ? "text-white bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.3)]" : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={cn("h-4 w-4 relative z-10 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-gray-500 group-hover:text-white")} />
                  <span className="relative z-10">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge className="ml-auto bg-primary text-white border-0 shadow-sm relative z-10">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 px-3 mb-2 uppercase tracking-wider">Workspace</p>
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                    isActive ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-500 group-hover:text-white")} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 ring-2 ring-white/5">
              NH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">NHSRCL</p>
              <p className="text-xs text-gray-500">Corporate Partner</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
        {/* Top Bar / Header could go here */}

        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full max-w-7xl mx-auto"
            >
              {activeSection === 'dashboard' && (
                <DashboardOverview
                  onNavigate={setActiveSection}
                  onProjectSelect={navigateToProject}
                />
              )}
              {activeSection === 'projects' && <ProjectDiscovery />}
              {activeSection === 'challenges' && <IndustryChallengesBoard onNavigate={setActiveSection} />}
              {activeSection === 'partners' && <UniversityProfiles onNavigate={setActiveSection} />}
              {activeSection === 'matchmaking' && <AIMatchmaking />}
              {activeSection === 'agreement-review' && <AgreementCompareReview />}
              {activeSection === 'digital-signature' && <DigitalSignature />}
              {activeSection === 'notifications' && <NotificationsPanel />}
              {activeSection === 'workspace' && <ProjectWorkspace projectId={activeProjectId} />}
              {activeSection === 'talent' && <TalentShowcase />}
              {activeSection === 'ip' && <IPPortfolio onNavigate={setActiveSection} />}
              {activeSection === 'negotiate' && <NegotiationWorkspace collaborationRequestId={1} />}
              {activeSection === 'agreement' && <AgreementGenerator collaborationRequestId={1} />}
              {activeSection === 'ipdisclosure' && (
                <IPDisclosureForm activeProjectId={activeProjectId} onSuccess={() => setActiveSection('ip')} />
              )}
              {activeSection === 'licensing' && <LicensingMarketplace />}
              {activeSection === 'analytics' && <AnalyticsDashboard />}
              {activeSection === 'profile' && (
                <div className="p-8">
                  <div className="max-w-2xl">
                    <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                    <p className="text-gray-400 mb-6">Manage your account and preferences</p>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                      <p className="text-gray-400">Profile settings coming soon...</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
