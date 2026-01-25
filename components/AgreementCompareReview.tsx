import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    FileText,
    History,
    MessageSquare,
    ArrowLeftRight,
    Plus,
    ArrowRight,
    PenTool
} from 'lucide-react';
import { useTestData } from '@/contexts/TestDataContext';
import { motion, AnimatePresence } from 'framer-motion';

export function AgreementCompareReview() {
    const { agreementVersions = [], agreementComments = [] } = useTestData();
    const [v1Version, setV1Version] = useState(agreementVersions[0]?.version_number || '');
    const [v2Version, setV2Version] = useState(agreementVersions[agreementVersions.length > 1 ? 1 : 0]?.version_number || '');
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    if (agreementVersions.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0a0a0c] text-slate-400">
                <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No agreement versions found in database.</p>
                </div>
            </div>
        );
    }

    const v1 = agreementVersions.find(v => v.version_number === v1Version) || agreementVersions[0];
    const v2 = agreementVersions.find(v => v.version_number === v2Version) || agreementVersions[0];

    const getCommentsForSection = (sectionId: string) => {
        return agreementComments.filter(c => c.section_id === sectionId);
    };

    return (
        <div className="flex flex-col h-screen bg-[#0a0a0c] text-slate-100">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111114]">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FileText className="h-6 w-6 text-blue-500" />
                        Agreement Review
                    </h1>
                    <p className="text-slate-400 text-sm">Compare versions and annotate changes</p>
                </div>
                <div className="flex items-center gap-4 bg-[#1a1a1e] p-2 rounded-lg border border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Base:</span>
                        <select
                            value={v1Version}
                            onChange={(e) => setV1Version(e.target.value)}
                            className="bg-transparent border-none text-sm focus:ring-0 text-blue-400 font-medium cursor-pointer"
                        >
                            {agreementVersions.map((v, i) => (
                                <option key={i} value={v.version_number} className="bg-[#1a1a1e]">{v.version_number}</option>
                            ))}
                        </select>
                    </div>
                    <ArrowLeftRight className="h-4 w-4 text-slate-600" />
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Compare:</span>
                        <select
                            value={v2Version}
                            onChange={(e) => setV2Version(e.target.value)}
                            className="bg-transparent border-none text-sm focus:ring-0 text-purple-400 font-medium cursor-pointer"
                        >
                            {agreementVersions.map((v, i) => (
                                <option key={i} value={v.version_number} className="bg-[#1a1a1e]">{v.version_number}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Version History Sidebar */}
                <div className="w-64 border-r border-white/10 bg-[#0d0d10] p-4 hidden xl:block">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History className="h-3 w-3" />
                        Version History
                    </h3>
                    <div className="space-y-2">
                        {agreementVersions.map((v, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${v1Version === v.version_number || v2Version === v.version_number
                                    ? 'bg-blue-500/10 border-blue-500/30'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                                onClick={() => setV2Version(v.version_number)}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-slate-200">{v.version_number}</span>
                                    <Badge variant="outline" className="text-[10px] py-0 h-4 border-white/10 text-slate-400">
                                        {v.created_at}
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate">{v.created_by}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Comparison View */}
                <div className="flex-1 overflow-auto bg-[#0a0a0c] p-8 space-y-8">
                    {v1.sections.map((v1Section) => {
                        const v2Section = v2.sections.find(s => s.id === v1Section.id) || v1Section;
                        const hasChanges = v1Section.text !== v2Section.text;

                        return (
                            <Card
                                key={v1Section.id}
                                className={`bg-[#111114] border-white/5 hover:border-white/20 transition-all ${selectedSection === v1Section.id ? 'ring-2 ring-blue-500/50 scale-[1.01]' : ''
                                    }`}
                                onClick={() => setSelectedSection(v1Section.id)}
                            >
                                <CardHeader className="py-4 px-6 border-b border-white/5 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                                            {v1Section.title}
                                        </CardTitle>
                                    </div>
                                    {hasChanges && (
                                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">
                                            Changes Detected
                                        </Badge>
                                    )}
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="flex divide-x divide-white/5">
                                        {/* Version 1 Text */}
                                        <div className="flex-1 p-6 bg-blue-500/5">
                                            <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                                                {v1Section.text}
                                            </p>
                                        </div>
                                        {/* Version 2 Text */}
                                        <div className={`flex-1 p-6 ${hasChanges ? 'bg-purple-500/10' : 'bg-transparent'}`}>
                                            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                                                {v2Section.text}
                                                {hasChanges && (
                                                    <span className="inline-flex ml-2 h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Annotations & Comments Sidebar */}
                <div className="w-80 border-l border-white/10 bg-[#0d0d10] flex flex-col">
                    <div className="p-4 border-b border-white/10 bg-[#111114]">
                        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-500" />
                            Annotations
                        </h3>
                    </div>
                    <div className="flex-1 p-4 overflow-auto">
                        <AnimatePresence mode="popLayout">
                            {selectedSection ? (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-4"
                                >
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-1">Active Section</p>
                                        <p className="text-sm text-slate-200 font-medium">{v1.sections.find(s => s.id === selectedSection)?.title}</p>
                                    </div>

                                    <div className="space-y-3">
                                        {getCommentsForSection(selectedSection).map((comment) => (
                                            <div key={comment.id} className="p-3 bg-white/5 border border-white/10 rounded-lg active:scale-95 transition-transform">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-slate-300">{comment.author}</span>
                                                    <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 leading-normal">{comment.text}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Button variant="ghost" className="w-full justify-start text-xs border border-dashed border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/5">
                                        <Plus className="h-3 w-3 mr-2" />
                                        Add new comment...
                                    </Button>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                    <MessageSquare className="h-12 w-12 text-slate-800 mb-4" />
                                    <p className="text-sm text-slate-500">Select a section to view or add annotations</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-4 border-t border-white/10 bg-[#111114]">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                            <PenTool className="h-4 w-4" />
                            Proceed to Signature
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
