import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    CheckCircle2,
    Clock,
    PenTool,
    ShieldCheck,
    ArrowRight,
    UserCheck,
    Building,
    GraduationCap,
    History,
    Eraser,
    MousePointer2
} from 'lucide-react';
import { useLoadAction } from '@/lib/data-actions';
import loadAgreementDetailsAction from '@/actions/loadAgreementDetails';
import { motion, AnimatePresence } from 'framer-motion';
import signAgreement from '@/actions/signAgreement';
import approveAgreement from '@/actions/approveAgreement';
import { useToast } from "@/hooks/use-toast";

type AuditEvent = {
    id: string;
    event: string;
    actor: string;
    timestamp: string;
};

type AgreementDetails = {
    id: number;
    status: string;
    college_signed_at: string | null;
    corporate_signed_at: string | null;
    college_approval_status: boolean;
    corporate_approval_status: boolean;
    // ... add other fields if needed, or use any for now to silence strict errors if lazy
    [key: string]: any;
};

export function DigitalSignature({ collaborationRequestId = 1 }: { collaborationRequestId?: number }) {
    const [agreements, loading, , refresh] = useLoadAction<any[]>(loadAgreementDetailsAction, [], { collaborationRequestId });
    const { toast } = useToast();

    // Handle array return from action
    const agreement = agreements?.[0] as AgreementDetails | undefined;


    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const signatureWorkflow = {
        status: agreement?.status || 'draft',
        College_approval: !!agreement?.college_approval_status,
        corporate_approval: !!agreement?.corporate_approval_status,
        College_signed: !!agreement?.college_signed_at,
        corporate_signed: !!agreement?.corporate_signed_at,
        audit_trail: [
            { id: '1', event: 'Agreement Draft Created', actor: 'System', timestamp: formatDate(agreement?.created_at) || 'Jan 10, 2024' },
            { id: '2', event: 'Legal Review Initiated', actor: 'Legal Dept', timestamp: agreement?.created_at ? formatDate(new Date(new Date(agreement.created_at).getTime() + 86400000).toISOString()) : 'Jan 11, 2024' },
            agreement?.college_approval_status ? { id: '3', event: 'College Approval Granted', actor: 'Legal Committee', timestamp: formatDate(agreement.created_at) } : null,
            agreement?.corporate_approval_status ? { id: '4', event: 'Corporate Approval Granted', actor: 'Compliance Board', timestamp: formatDate(agreement.created_at) } : null,
            agreement?.college_signed_at ? { id: '5', event: 'College Signature Applied', actor: agreement.college_signatory || 'Dean', timestamp: formatDate(agreement.college_signed_at) } : null,
            agreement?.corporate_signed_at ? { id: '6', event: 'Corporate Signature Applied', actor: agreement.corporate_signatory || 'CEO', timestamp: formatDate(agreement.corporate_signed_at) } : null,
        ].filter(Boolean) as AuditEvent[]
    };
    const [isSigning, setIsSigning] = useState(false);
    const [signature, setSignature] = useState('');
    const [activeRole, setActiveRole] = useState<'college' | 'corporate'>('college');
    const [signatureMode, setSignatureMode] = useState<'type' | 'draw'>('type');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Canvas Drawing Logic
    const startDrawing = (e: any) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: any) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (canvasRef.current) {
            setSignature(canvasRef.current.toDataURL());
        }
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature('');
    };

    const handleApproval = async (role: 'college' | 'corporate') => {
        try {
            await approveAgreement({ agreementId: agreement!.id, role });
            toast({
                title: "Approval Granted",
                description: `${role === 'college' ? 'College' : 'Corporate'} approval recorded successfully.`,
            });
            refresh();
        } catch (error: any) {
            toast({
                title: "Approval Failed",
                description: error.message,
                variant: 'destructive'
            });
        }
    };

    if (loading || !agreement) {
        return <div className="p-8 text-slate-400">Loading signature workflow...</div>;
    }

    const steps = [
        { id: 'draft', label: 'Agreement Draft', icon: Clock },
        { id: 'review', label: 'Legal Review', icon: ShieldCheck },
        { id: 'approval', label: 'Approval Status', icon: UserCheck },
        { id: 'signed', label: 'Final Execution', icon: PenTool },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === signatureWorkflow.status);

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
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
                            <MousePointer2 className="h-4 w-4 text-slate-400" />
                            <span className="text-xs text-slate-400 font-medium mr-2">Simulate Role:</span>
                            <Select value={activeRole} onValueChange={(val: any) => setActiveRole(val)}>
                                <SelectTrigger className="w-[140px] h-8 bg-black/20 border-white/10 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="college">College Admin</SelectItem>
                                    <SelectItem value="corporate">Corporate Exec</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-4 py-1 text-sm font-bold">
                            SECURE AUDIT ENABLED
                        </Badge>
                    </div>
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

                                        <div className={`p-4 rounded-lg flex items-center justify-between ${signatureWorkflow.College_approval ? 'bg-green-500/10 border border-green-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {signatureWorkflow.College_approval ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-amber-500" />
                                                )}
                                                <span className={`text-sm font-bold ${signatureWorkflow.College_approval ? 'text-green-500' : 'text-amber-500'}`}>
                                                    {signatureWorkflow.College_approval ? 'Approved' : 'Pending Approval'}
                                                </span>
                                            </div>
                                            {signatureWorkflow.College_approval && (
                                                <span className="text-[10px] text-slate-500 font-medium">JAN 12, 11:30 AM</span>
                                            )}
                                        </div>

                                        <Button
                                            className="w-full h-12 bg-white/5 hover:bg-white/10 text-slate-300 font-bold border border-white/10"
                                            disabled={signatureWorkflow.College_approval || activeRole !== 'college'}
                                            onClick={() => handleApproval('college')}
                                        >
                                            {signatureWorkflow.College_approval ? 'Approval Granted' : 'Grant Approval'}
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

                                        <div className={`p-4 rounded-lg flex items-center justify-between ${signatureWorkflow.corporate_approval ? 'bg-green-500/10 border border-green-500/20' : 'bg-amber-500/10 border border-amber-500/20'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                {signatureWorkflow.corporate_approval ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <Clock className="h-5 w-5 text-amber-500" />
                                                )}
                                                <span className={`text-sm font-bold ${signatureWorkflow.corporate_approval ? 'text-green-500' : 'text-amber-500'}`}>
                                                    {signatureWorkflow.corporate_approval ? 'Approved' : 'Pending Approval'}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/20"
                                            disabled={signatureWorkflow.corporate_approval || activeRole !== 'corporate'}
                                            onClick={() => handleApproval('corporate')}
                                        >
                                            {signatureWorkflow.corporate_approval ? 'Approved' : 'Process Approval'}
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
                                    disabled={!signatureWorkflow.College_approval || !signatureWorkflow.corporate_approval}
                                >
                                    Sign Document Now
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
                                {signatureWorkflow.audit_trail.map((event: AuditEvent) => (
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
                                <Tabs defaultValue="type" value={signatureMode} onValueChange={(v: any) => setSignatureMode(v)} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-black/20">
                                        <TabsTrigger value="type">Type Signature</TabsTrigger>
                                        <TabsTrigger value="draw">Draw Signature</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="type" className="space-y-4">
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
                                        {signature && (
                                            <div className="p-8 border border-dashed border-white/10 rounded-xl bg-black/20 flex items-center justify-center">
                                                <span className="text-4xl font-signature text-blue-400 select-none" style={{ fontFamily: '"Great Vibes", cursive' }}>
                                                    {signature}
                                                </span>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="draw" className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Draw your signature</label>
                                                <Button size="sm" variant="ghost" onClick={clearCanvas} className="h-6 text-xs text-red-400 hover:text-red-300">
                                                    <Eraser className="h-3 w-3 mr-1" /> Clear
                                                </Button>
                                            </div>
                                            <div className="border-2 border-dashed border-white/10 rounded-xl bg-white bg-opacity-[0.02] overflow-hidden flex items-center justify-center relative h-48">
                                                <canvas
                                                    ref={canvasRef}
                                                    width={400}
                                                    height={192}
                                                    className="w-full h-full cursor-crosshair touch-none"
                                                    onMouseDown={startDrawing}
                                                    onMouseMove={draw}
                                                    onMouseUp={stopDrawing}
                                                    onMouseLeave={stopDrawing}
                                                    onTouchStart={startDrawing}
                                                    onTouchMove={draw}
                                                    onTouchEnd={stopDrawing}
                                                />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>

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
                                        onClick={async () => {
                                            try {
                                                const role = activeRole;
                                                await signAgreement(agreement.id, signature, role);

                                                toast({
                                                    title: "Agreement Signed",
                                                    description: `Successfully signed as ${role === 'college' ? 'College' : 'Corporate'} representative.`,
                                                });
                                                setIsSigning(false);
                                                refresh();
                                                setSignature('');
                                            } catch (e: any) {
                                                toast({
                                                    title: "Signing Failed",
                                                    description: e.message,
                                                    variant: "destructive"
                                                });
                                            }
                                        }}
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
