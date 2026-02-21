import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineDocumentText,
  HiOutlinePencilSquare,
  HiOutlineCpuChip,
  HiOutlineCheckBadge,
} from 'react-icons/hi2';
import { BsClockHistory, BsGraphUpArrow, BsShieldCheck, BsSearch } from 'react-icons/bs';
import { RiExchangeLine, RiQuillPenLine, RiDraftLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProjectDiscovery } from '@/components/ProjectDiscovery';
import { IndustryChallengesBoard } from '@/components/IndustryChallengesBoard';
import { AIMatchmaking } from '@/components/AIMatchmaking';
import { PartnerShowcase } from '@/components/PartnerShowcase';
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
import { AgreementTracking } from '@/components/AgreementTracking';
import { ProfilePage } from '@/components/ProfilePage';
import { MatchmakingBlueprint } from '@/components/MatchmakingBlueprint';
import { IndustryProfileSettings } from '@/components/IndustryProfileSettings';
import { QuantumDashboard } from '@/components/QuantumDashboard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';




import { ParticleBackground } from '@/components/ui/animated-primitives';
import { DatabaseStatus } from '@/components/DatabaseStatus';
import { getRoleLabel, getInitials } from '@/lib/userUtils';
import { useAppStore } from '@/lib/store';
import { useNotifications } from '@/hooks/useDatabase';
import DecryptedText from '@/components/ui/DecryptedText';
import { FuturisticPageTransition } from '@/components/ui/animation-wrapper';
import { SystemStatus } from '@/components/ui/AIFeedback';

type NavSection =
  | 'dashboard'
  | 'projects'
  | 'challenges'
  | 'partners'
  | 'matchmaking'
  | 'agreement-review'
  | 'digital-signature'
  | 'notifications'
  | 'profile'
  | 'workspace'
  | 'talent'
  | 'ip'
  | 'negotiate'
  | 'agreement'
  | 'ipdisclosure'
  | 'licensing'
  | 'analytics'
  | 'agreement-tracking'
  | 'engine-blueprint'
  | 'industry-profile';



function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<number>(1);
  const { unreadCount } = useNotifications();

  const { loadUser, user: storeUser } = useAppStore();

  // Temporary: load demo user session without auth
  useEffect(() => {
    loadUser('user_1');
  }, [loadUser]);

  const navItems = [
    { id: 'dashboard' as NavSection, label: 'Dashboard', icon: HiOutlineHome },
    // ProjectDetailModal props removed in favor of inline type for simplicity
    { id: 'projects' as NavSection, label: 'Research Projects', icon: HiOutlineBriefcase },
    {
      id: 'challenges' as NavSection,
      label: 'Industry Challenges',
      icon: HiOutlineChatBubbleBottomCenterText,
    },
    { id: 'partners' as NavSection, label: 'Ecosystem', icon: HiOutlineBuildingOffice2 },
    { id: 'matchmaking' as NavSection, label: 'AI Matchmaking', icon: HiOutlineSparkles },
    {
      id: 'agreement-review' as NavSection,
      label: 'Agreement Review',
      icon: HiOutlineDocumentText,
    },
    { id: 'digital-signature' as NavSection, label: 'Digital Signature', icon: RiQuillPenLine },
    {
      id: 'notifications' as NavSection,
      label: 'Notifications',
      icon: HiOutlineBell,
      badge: unreadCount,
    },
    { id: 'profile' as NavSection, label: 'Profile', icon: HiOutlineUser },
    { id: 'engine-blueprint' as NavSection, label: 'Engine Blueprint', icon: HiOutlineCpuChip },
    { id: 'industry-profile' as NavSection, label: 'Industry Profile', icon: HiOutlineCheckBadge },
  ];



  const secondaryItems = [
    { id: 'workspace' as NavSection, label: 'Project Workspace', icon: BsSearch },
    { id: 'talent' as NavSection, label: 'Talent Showcase', icon: HiOutlineUser },
    { id: 'ip' as NavSection, label: 'IP Portfolio', icon: BsShieldCheck },
    { id: 'negotiate' as NavSection, label: 'Negotiation', icon: RiExchangeLine },
    { id: 'agreement' as NavSection, label: 'Agreement', icon: RiDraftLine },
    { id: 'agreement-tracking' as NavSection, label: 'Agreement Tracking', icon: BsClockHistory },
    { id: 'ipdisclosure' as NavSection, label: 'Submit IP', icon: HiOutlinePencilSquare },
    { id: 'licensing' as NavSection, label: 'Licensing Market', icon: HiOutlineBuildingOffice2 },
    { id: 'analytics' as NavSection, label: 'Analytics', icon: BsGraphUpArrow },
  ];

  // Helper to handle navigation to a specific project
  const navigateToProject = (projectId: number) => {
    setActiveProjectId(projectId);
    setActiveSection('workspace');
  };

  const userRole = storeUser?.organization_type;
  const isStudent = userRole === 'student';
  const isAcademic = isStudent || userRole === 'college';

  const filteredNavItems = navItems.filter((item) => {
    if (isAcademic) {
      // Hide company-focused main menu items for academy users
      if (
        ['challenges', 'matchmaking', 'agreement-review', 'digital-signature', 'licensing', 'analytics'].includes(item.id)
      ) {
        return false;
      }
    }
    return true;
  });

  const filteredSecondaryItems = secondaryItems.filter((item) => {
    if (isAcademic) {
      // Academy users should not see company-only negotiation / licensing analytics tools
      if (['negotiate', 'agreement', 'licensing', 'analytics'].includes(item.id)) {
        return false;
      }
    } else {
      // Corporate / college users should not see the Talent workspace entry
      if (item.id === 'talent') {
        return false;
      }
    }
    return true;
  });

  const mainMenuTitle = isAcademic ? 'Academy Menu' : 'Company Menu';
  const workspaceTitle = isAcademic ? 'Academy Workspace' : 'Company Workspace';

  const { theme } = useAppStore();

  return (
    <div className={cn(
      "flex h-screen overflow-hidden selection:bg-primary/10 transition-colors duration-500",
      theme === 'quantum' ? "bg-[#020617] text-white" : "bg-[#F8FAFC] text-slate-900"
    )}>
      {/* Ambient Background Mesh */}
      <ParticleBackground />

      {/* Glassmorphism Sidebar */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "w-64 z-10 relative flex flex-col border-r transition-colors duration-500",
          theme === 'quantum' ? "bg-black/40 border-white/10" : "border-slate-200 glass-panel"
        )}
      >
        <div className={cn("p-6 border-b transition-colors duration-500", theme === 'quantum' ? "border-white/10" : "border-slate-200")}>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-xl shadow-lg ring-1 ring-slate-200/50">
              <img
                src="https://image2url.com/r2/default/images/1771329385661-8f28ce43-1650-4db7-b0d6-8fe239ee1acc.png"
                alt="CollabSync Pro Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className={cn("text-xl font-bold leading-tight transition-colors", theme === 'quantum' ? "text-white" : "text-slate-900")}>
                <DecryptedText text="CollabSync Pro" />
              </h1>
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase py-0.5 px-2 bg-primary/10 rounded-full inline-block mt-1">
                Pro
              </span>
            </div>
          </div>
          <div className="px-6 py-3 flex flex-col gap-2">
            <DatabaseStatus />
            <SystemStatus status="System Ready" />
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <p className={cn("text-xs font-semibold px-3 mb-2 uppercase tracking-wider transition-colors", theme === 'quantum' ? "text-slate-500" : "text-gray-500")}>
              {mainMenuTitle}
            </p>
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group relative overflow-hidden mb-1',
                    isActive
                      ? (theme === 'quantum' ? 'text-cyan-400 bg-cyan-500/10' : 'text-primary bg-primary/5')
                      : (theme === 'quantum' ? 'text-slate-500 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'),
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent border-l-2 border-primary"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      'h-4 w-4 relative z-10 transition-transform group-hover:scale-110',
                      isActive ? 'text-primary' : 'text-gray-500 group-hover:text-slate-900',
                    )}
                  />
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
            <p className="text-xs font-semibold text-gray-500 px-3 mb-2 uppercase tracking-wider">
              {workspaceTitle}
            </p>
            {filteredSecondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group relative mb-1',
                    isActive
                      ? 'text-slate-900 bg-slate-100'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-transform group-hover:scale-110',
                      isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-900',
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveSection('profile')}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all duration-300 group"
          >
            <div className="h-10 w-10 bg-gradient-to-tr from-primary to-cyan-500 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-primary/10 ring-2 ring-white group-hover:ring-primary/20 transition-all font-mono">
              {getInitials(storeUser?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                {storeUser?.organization || 'Personal Profile'}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                {getRoleLabel(storeUser)}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
        {/* Top Bar / Header could go here */}

        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          <AnimatePresence mode="wait">
            <FuturisticPageTransition key={activeSection}>
              <div className="h-full max-w-7xl mx-auto">
                {activeSection === 'dashboard' && (
                  theme === 'quantum' ? <QuantumDashboard /> : <DashboardOverview onNavigate={setActiveSection} onProjectSelect={navigateToProject} />
                )}
                {activeSection === 'projects' && <ProjectDiscovery onNavigate={setActiveSection} />}
                {activeSection === 'challenges' && <IndustryChallengesBoard onNavigate={setActiveSection} />}
                {activeSection === 'partners' && <PartnerShowcase onNavigate={setActiveSection} />}
                {activeSection === 'matchmaking' && <AIMatchmaking />}
                {activeSection === 'agreement-review' && <AgreementCompareReview onNavigate={setActiveSection} />}
                {activeSection === 'digital-signature' && <DigitalSignature />}
                {activeSection === 'notifications' && <NotificationsPanel />}
                {activeSection === 'workspace' && (
                  <ProjectWorkspace projectId={activeProjectId} onNavigate={setActiveSection} />
                )}
                {activeSection === 'talent' && <TalentShowcase />}
                {activeSection === 'ip' && <IPPortfolio onNavigate={setActiveSection} />}
                {activeSection === 'negotiate' && <NegotiationWorkspace collaborationRequestId={1} />}
                {activeSection === 'agreement' && <AgreementGenerator collaborationRequestId={1} onNavigate={setActiveSection} />}
                {activeSection === 'ipdisclosure' && (
                  <IPDisclosureForm activeProjectId={activeProjectId} onSuccess={() => setActiveSection('ip')} />
                )}
                {activeSection === 'licensing' && <LicensingMarketplace />}
                {activeSection === 'analytics' && <AnalyticsDashboard />}
                {activeSection === 'agreement-tracking' && <AgreementTracking />}
                {activeSection === 'profile' && <ProfilePage />}
                {activeSection === 'engine-blueprint' && <MatchmakingBlueprint />}
                {activeSection === 'industry-profile' && <IndustryProfileSettings />}
              </div>

            </FuturisticPageTransition>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
