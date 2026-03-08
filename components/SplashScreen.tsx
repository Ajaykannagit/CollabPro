import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineAcademicCap, HiOutlineBuildingOffice2, HiOutlineUser, HiOutlineArrowRight } from 'react-icons/hi2';
import { BsStars } from 'react-icons/bs';
import { cn } from '@/lib/utils';

type Role = 'college' | 'corporate' | 'student';

interface SplashScreenProps {
    onLaunch: (role: Role) => void;
}

const ROLES: { id: Role; label: string; subtitle: string; icon: React.ElementType; gradient: string; glow: string }[] = [
    {
        id: 'college',
        label: 'Academic',
        subtitle: 'Universities & Research Labs',
        icon: HiOutlineAcademicCap,
        gradient: 'from-blue-500 to-indigo-600',
        glow: 'shadow-blue-500/30',
    },
    {
        id: 'corporate',
        label: 'Industry',
        subtitle: 'Companies & R&D Divisions',
        icon: HiOutlineBuildingOffice2,
        gradient: 'from-violet-500 to-purple-700',
        glow: 'shadow-purple-500/30',
    },
    {
        id: 'student',
        label: 'Talent',
        subtitle: 'Students & Researchers',
        icon: HiOutlineUser,
        gradient: 'from-cyan-500 to-blue-500',
        glow: 'shadow-cyan-500/30',
    },
];

export function SplashScreen({ onLaunch }: SplashScreenProps) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [launching, setLaunching] = useState(false);

    const handleLaunch = () => {
        if (!selectedRole) return;
        setLaunching(true);
        setTimeout(() => onLaunch(selectedRole), 800);
    };

    return (
        <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07080f] text-white overflow-hidden"
        >
            {/* Animated background mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:50px_50px]" />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-700/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
            <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-white/20"
                    style={{ left: `${8 + i * 8}%`, top: `${15 + (i % 5) * 18}%` }}
                    animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                />
            ))}

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-8 w-full">
                {/* Logo + Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mb-10"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-2xl shadow-violet-500/40 ring-1 ring-white/10">
                            <img
                                src="https://image2url.com/r2/default/images/1771329385661-8f28ce43-1650-4db7-b0d6-8fe239ee1acc.png"
                                alt="CollabSync Pro"
                                className="h-10 w-10 object-cover rounded-xl"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <BsStars className="text-cyan-400 text-lg" />
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-400">CollabSync Pro</span>
                        <BsStars className="text-cyan-400 text-lg" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
                        Where Research Meets
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400">
                            Industry
                        </span>
                    </h1>
                    <p className="text-slate-400 text-base font-medium max-w-md mx-auto leading-relaxed">
                        A sovereign intelligence platform bridging academic innovation and industrial application. Select your role to get started.
                    </p>
                </motion.div>

                {/* Role Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className="grid grid-cols-3 gap-4 w-full mb-8"
                >
                    {ROLES.map(role => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.id;
                        return (
                            <motion.button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                whileHover={{ scale: 1.04, y: -3 }}
                                whileTap={{ scale: 0.97 }}
                                className={cn(
                                    'relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-300 overflow-hidden group',
                                    isSelected
                                        ? 'border-white/20 bg-white/10 ring-2 ring-white/20'
                                        : 'border-white/8 bg-white/5 hover:bg-white/8 hover:border-white/15'
                                )}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="roleGlow"
                                        className={cn('absolute inset-0 opacity-20 bg-gradient-to-br', role.gradient)}
                                    />
                                )}
                                <div className={cn(
                                    'h-12 w-12 rounded-xl flex items-center justify-center shadow-lg transition-all',
                                    `bg-gradient-to-br ${role.gradient}`,
                                    isSelected ? `shadow-lg ${role.glow}` : 'shadow-black/20'
                                )}>
                                    <Icon className="h-6 w-6 text-white" />
                                </div>
                                <div className="text-center relative z-10">
                                    <p className="font-black text-white text-sm">{role.label}</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-snug">{role.subtitle}</p>
                                </div>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 right-2 h-5 w-5 rounded-full bg-white flex items-center justify-center"
                                    >
                                        <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500" />
                                    </motion.div>
                                )}
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Launch Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="w-full"
                >
                    <motion.button
                        onClick={handleLaunch}
                        disabled={!selectedRole || launching}
                        whileHover={selectedRole ? { scale: 1.02 } : {}}
                        whileTap={selectedRole ? { scale: 0.98 } : {}}
                        className={cn(
                            'w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-3',
                            selectedRole && !launching
                                ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50'
                                : 'bg-white/10 text-white/40 cursor-not-allowed'
                        )}
                    >
                        {launching ? (
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                                />
                                Initializing Platform...
                            </div>
                        ) : (
                            <>
                                Launch Platform
                                <HiOutlineArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </motion.button>

                    {!selectedRole && (
                        <p className="text-slate-600 text-xs font-medium mt-3">Select a role above to continue</p>
                    )}
                </motion.div>

                {/* Version badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-[10px] text-slate-700 font-mono tracking-widest"
                >
                    v1.1.0 · LOCAL DEMO MODE · MIT LICENSE
                </motion.div>
            </div>
        </motion.div>
    );
}
