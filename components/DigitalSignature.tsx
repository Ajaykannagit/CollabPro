import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle2,
    Clock,
    PenTool,
    ShieldCheck,
    ArrowRight,
    UserCheck,
    Building,
    GraduationCap,
    History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function DigitalSignature() {
    const { toast } = useToast();
    const [isSigning, setIsSigning] = useState(false);
    const [signature, setSignature] = useState('');
    const [workflow, setWorkflow] = useState({
        status: 'approval',
        college_approval: true,
        corporate_approval: false,
        audit_trail: [
            { id: 1, event: 'Agreement Finalized', actor: 'System', timestamp: 'Jan 24, 10:00 AM' },
            { id: 2, event: 'College Approval Granted', actor: 'Dr. Aris (Dean of Research)', timestamp: 'Jan 24, 11:30 AM' },
        ]
    });

    const handleGrantApproval = () => {
        setWorkflow(prev => ({
            ...prev,
            corporate_approval: true,
            audit_trail: [
                ...prev.audit_trail,
                { id: Date.now(), event: 'Corporate Approval Granted', actor: 'NHSRCL Exec Board', timestamp: new Date().toLocaleString() }
            ]
        }));
        toast({ title: 'Approval Granted', description: 'Corporate compliance has reviewed and approved the document.' });
    };

    const handleFinalSign = () => {
        setWorkflow(prev => ({
            ...prev,
            status: 'signed',
            audit_trail: [
                ...prev.audit_trail,
                { id: Date.now(), event: 'Document Digitally Signed', actor: signature, timestamp: new Date().toLocaleString() }
            ]
        }));
        setIsSigning(false);
        toast({ title: 'Document Signed', description: 'The agreement is now legally binding and active.' });
    };

    const steps = [
        { id: 'draft', label: 'Agreement Draft', icon: Clock },
        { id: 'review', label: 'Legal Review', icon: ShieldCheck },
        { id: 'approval', label: 'Approval Status', icon: UserCheck },
        { id: 'signed', label: 'Final Execution', icon: PenTool },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === workflow.status);

    return (
        <div className="p-8 bg-[#0a0a0c] min-h-screen text-slate-100">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                            <PenTool className="h-8 w-8 text-blue-500" />
                            Digital Signature Workflow
                        </h1>
                        <p className="text-slate-400 mt-2">Track approvals and execute legal agreements securely</p>
                    </div>
                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-1 text-sm font-bold">
                        SECURE AUDIT ENABLED
                    </Badge>
                </div>

                {/* Stepper */}
                <div className="grid grid-cols-4 gap-4">
                    {steps.map((step, idx) => (
                        <div key={step.id} className="relative">
                            <div className={`flex flex-col items-center gap-3 p-6 rounded-xl border transition-all ${idx <= currentStepIndex
                                ? 'bg-blue-500/10 border-blue-500/30'
                                : 'bg-white/5 border-white/5 opacity-50'
                                }`}>
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${idx <= currentStepIndex ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                                    }`}>
                                    <step.icon className="h-6 w-6" />
                                </div>
                                <span className={`text-sm font-bold ${idx <= currentStepIndex ? 'text-slate-200' : 'text-slate-500'}`}>
                                    {step.label}
                                </span>
                                {idx < currentStepIndex && (
                                    <CheckCircle2 className="h-5 w-5 text-green-500 absolute top-4 right-4" />
                                )}
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`absolute top-1/2 -right-2 h-[2px] w-4 z-10 ${idx < currentStepIndex ? 'bg-blue-600' : 'bg-slate-800'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Approval Tracking */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-[#111114] border-white/5 overflow-hidden">
                            <CardHeader className="border-b border-white/5 bg-[#1a1a1e]">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-blue-500" />
                                    Party Approvals
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid md:grid-cols-2 divide-x divide-white/5">
                                    {/* College Approval */}
                                    <div className="p-8 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center">
                                                <GraduationCap className="h-8 w-8 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-200">College Side</h3>
                                                <p className="text-xs text-slate-500">Legal & Ethics Committee</p>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-lg flex items-center justify-between ${workflow.college_approval ? 'bg-green-500/10 border border-green-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {workflow.college_approval ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-amber-500" />
                                                )}
                                                <span className={`text-sm font-bold ${workflow.college_approval ? 'text-green-500' : 'text-amber-500'}`}>
                                                    {workflow.college_approval ? 'Approved' : 'Pending Approval'}
                                                </span>
                                            </div>
                                            {workflow.college_approval && (
                                                <span className="text-[10px] text-slate-500 font-medium">DONE</span>
                                            )}
                                        </div>

                                        <Button
                                            className="w-full h-12 bg-white/5 hover:bg-white/10 text-slate-300 font-bold border border-white/10"
                                            disabled={workflow.college_approval}
                                        >
                                            {workflow.college_approval ? 'Approval Granted' : 'Grant Approval'}
                                        </Button>
                                    </div>

                                    {/* Corporate Approval */}
                                    <div className="p-8 space-y-6 bg-white/[0.02]">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center">
                                                <Building className="h-8 w-8 text-purple-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-200">Corporate Side</h3>
                                                <p className="text-xs text-slate-500">Compliance & Executive Board</p>
                                            </div>
                                        </div>

                                        <div className={`p-4 rounded-lg flex items-center justify-between ${workflow.corporate_approval ? 'bg-green-500/10 border border-green-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {workflow.corporate_approval ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-amber-500" />
                                                )}
                                                <span className={`text-sm font-bold ${workflow.corporate_approval ? 'text-green-500' : 'text-amber-500'}`}>
                                                    {workflow.corporate_approval ? 'Approved' : 'Pending Approval'}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/20"
                                            disabled={workflow.corporate_approval}
                                            onClick={handleGrantApproval}
                                        >
                                            {workflow.corporate_approval ? 'Approval Granted' : 'Grant Approval'}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Signature Area */}
                        <Card className="bg-[#111114] border-white/5">
                            <CardHeader className="border-b border-white/5">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <PenTool className="h-5 w-5 text-blue-500" />
                                    Final Execution
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                                <div className="max-w-md">
                                    <h3 className="text-xl font-bold text-slate-200 mb-2">Ready for Digital Signature</h3>
                                    <p className="text-sm text-slate-400">
                                        All compliance checks have passed. Once both parties sign, this agreement becomes legally binding and active.
                                    </p>
                                </div>

                                <div className="flex gap-4 w-full max-w-lg">
                                    <div className="flex-1 p-4 rounded-xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center gap-2">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">College Signatory</span>
                                        <div className="h-[2px] w-full bg-white/10 my-4" />
                                        <span className="text-xs text-slate-400 italic font-medium">Awaiting Signature</span>
                                    </div>
                                    <div className="flex-1 p-4 rounded-xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center gap-2">
                                        <span className="text-[10px] uppercase font-bold text-slate-500">Corporate Signatory</span>
                                        <div className="h-[2px] w-full bg-white/10 my-4" />
                                        <span className="text-xs text-slate-400 italic font-medium">Awaiting Signature</span>
                                    </div>
                                </div>

                                <Button
                                    className="px-12 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold shadow-2xl shadow-blue-500/30 group"
                                    onClick={() => setIsSigning(true)}
                                    disabled={!workflow.college_approval || !workflow.corporate_approval || workflow.status === 'signed'}
                                >
                                    {workflow.status === 'signed' ? 'Document Signed' : 'Sign Document Now'}
                                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Audit Trail */}
                    <Card className="bg-[#111114] border-white/5 flex flex-col">
                        <CardHeader className="border-b border-white/5 bg-[#1a1a1e]">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
                                <History className="h-4 w-4" />
                                Audit Trail
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-6 overflow-auto">
                            <div className="space-y-6 relative">
                                <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-white/5" />
                                {workflow.audit_trail.map((event: any) => (
                                    <div key={event.id} className="relative pl-10">
                                        <div className="absolute left-[13px] top-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                        <p className="text-sm font-bold text-slate-200">{event.event}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-500 font-medium">{event.actor}</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-700" />
                                            <span className="text-[10px] text-slate-500">{event.timestamp}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Signature Modal Overlay */}
            <AnimatePresence>
                {isSigning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#111114] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 bg-[#1a1a1e]">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <PenTool className="h-5 w-5 text-blue-500" />
                                    Secure Digital Signature
                                </h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type your full name</label>
                                    <input
                                        type="text"
                                        value={signature}
                                        onChange={(e) => setSignature(e.target.value)}
                                        placeholder="Enter full legal name"
                                        className="w-full h-12 bg-white/5 border border-white/10 rounded-lg px-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>

                                <div className="p-24 border-2 border-dashed border-white/5 rounded-xl bg-black/20 flex items-center justify-center relative group cursor-crosshair">
                                    {signature ? (
                                        <span className="text-4xl font-signature text-blue-400 select-none" style={{ fontFamily: '"Great Vibes", cursive' }}>
                                            {signature}
                                        </span>
                                    ) : (
                                        <span className="text-slate-700 text-sm font-medium">Draw signature area</span>
                                    )}
                                    <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" />
                                        Biometric cryptographically secured
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="ghost"
                                        className="flex-1 h-12 text-slate-400 hover:text-slate-100 font-bold"
                                        onClick={() => setIsSigning(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-3 h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 shadow-lg shadow-blue-500/20"
                                        disabled={!signature}
                                        onClick={handleFinalSign}
                                    >
                                        Confirm & Sign Document
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
