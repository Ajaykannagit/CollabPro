import { useState, useEffect } from 'react';
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
    PenTool,
    Send
} from 'lucide-react';
import { useLoadAction } from '@/lib/data-actions';
import loadAgreementDetailsAction from '@/actions/loadAgreementDetails';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

type AgreementVersion = {
    id: number;
    agreement_id: number;
    version_number: string;
    created_at: string;
    created_by: string;
    change_summary?: string;
};

type AgreementSection = {
    id: number;
    agreement_version_id: number;
    section_id: string;
    title: string;
    content: string;
    display_order: number;
};

type AgreementComment = {
    id: number;
    agreement_id: number;
    section_id: string;
    author: string;
    comment_text: string;
    created_at: string;
};

export function AgreementCompareReview({
    collaborationRequestId = 1,
    onNavigate
}: {
    collaborationRequestId?: number;
    onNavigate?: (section: any) => void;
}) {
    const [agreement, loadingAgreement] = useLoadAction<any[]>(loadAgreementDetailsAction, [], { collaborationRequestId });

    // Get agreement ID from the loaded agreement
    const agreementData = Array.isArray(agreement) ? agreement[0] : agreement;
    const agreementId = agreementData?.id;

    // State for versions, sections, and comments
    const [versions, setVersions] = useState<AgreementVersion[]>([]);
    const [comments, setComments] = useState<AgreementComment[]>([]);
    const [loadingVersions, setLoadingVersions] = useState(false);
    const [loadingComments, setLoadingComments] = useState(false);

    const [v1Version, setV1Version] = useState<string>('');
    const [v2Version, setV2Version] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [v1Sections, setV1Sections] = useState<AgreementSection[]>([]);
    const [v2Sections, setV2Sections] = useState<AgreementSection[]>([]);
    const [loadingSections, setLoadingSections] = useState(false);

    // Comment form state
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [newCommentText, setNewCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    // Load versions when agreementId is available
    useEffect(() => {
        const loadVersions = async () => {
            if (!agreementId) return;

            setLoadingVersions(true);
            try {
                const { data, error } = await supabase
                    .from('agreement_versions')
                    .select('*')
                    .eq('agreement_id', agreementId)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                if (data) setVersions(data);
            } catch (error) {
                console.error('Error loading versions:', error);
            } finally {
                setLoadingVersions(false);
            }
        };

        loadVersions();
    }, [agreementId]);

    // Load comments when agreementId is available
    useEffect(() => {
        const loadComments = async () => {
            if (!agreementId) return;

            setLoadingComments(true);
            try {
                const { data, error } = await supabase
                    .from('agreement_comments')
                    .select('*')
                    .eq('agreement_id', agreementId)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                if (data) setComments(data);
            } catch (error) {
                console.error('Error loading comments:', error);
            } finally {
                setLoadingComments(false);
            }
        };

        loadComments();
    }, [agreementId]);

    // Set default versions when versions load
    useEffect(() => {
        if (versions && versions.length > 0 && !v1Version) {
            const firstVersion = versions[0].version_number;
            setV1Version(firstVersion);
            setV2Version(firstVersion);
        }
    }, [versions, v1Version]);

    // Load sections when versions change
    useEffect(() => {
        const loadSections = async () => {
            if (!versions || versions.length === 0) return;

            const v1 = versions.find(v => v.version_number === v1Version);
            const v2 = versions.find(v => v.version_number === v2Version);

            if (!v1 || !v2) return;

            setLoadingSections(true);
            try {
                const [v1Result, v2Result] = await Promise.all([
                    supabase
                        .from('agreement_sections')
                        .select('*')
                        .eq('agreement_version_id', v1.id)
                        .order('display_order', { ascending: true }),
                    supabase
                        .from('agreement_sections')
                        .select('*')
                        .eq('agreement_version_id', v2.id)
                        .order('display_order', { ascending: true })
                ]);

                if (v1Result.error) throw v1Result.error;
                if (v2Result.error) throw v2Result.error;

                if (v1Result.data) setV1Sections(v1Result.data);
                if (v2Result.data) setV2Sections(v2Result.data);
            } catch (error) {
                console.error('Error loading sections:', error);
            } finally {
                setLoadingSections(false);
            }
        };

        loadSections();
    }, [v1Version, v2Version, versions]);

    const getCommentsForSection = (sectionId: string): AgreementComment[] => {
        if (!comments) return [];
        return comments.filter(c => c.section_id === sectionId);
    };

    const refetchComments = async () => {
        if (!agreementId) return;

        try {
            const { data, error } = await supabase
                .from('agreement_comments')
                .select('*')
                .eq('agreement_id', agreementId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            if (data) setComments(data);
        } catch (error) {
            console.error('Error refetching comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newCommentText.trim() || !selectedSection || !agreementId) return;

        setSubmittingComment(true);
        try {
            const { error } = await supabase
                .from('agreement_comments')
                .insert({
                    agreement_id: agreementId,
                    section_id: selectedSection,
                    author: 'Current User', // In production, get from auth context
                    comment_text: newCommentText.trim()
                });

            if (error) throw error;

            // Refetch comments to get the new one
            await refetchComments();

            // Reset form
            setNewCommentText('');
            setIsAddingComment(false);
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        } finally {
            setSubmittingComment(false);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loadingAgreement || loadingVersions) {
        return <div className="p-8 text-slate-400">Loading agreement details...</div>;
    }

    if (!agreement || !versions || versions.length === 0) {
        return <div className="p-8 text-slate-400">No agreement data found.</div>;
    }

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
                            {versions.map((v) => (
                                <option key={v.id} value={v.version_number} className="bg-[#1a1a1e]">{v.version_number}</option>
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
                            {versions.map((v) => (
                                <option key={v.id} value={v.version_number} className="bg-[#1a1a1e]">{v.version_number}</option>
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
                        {versions.map((v) => (
                            <div
                                key={v.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${v1Version === v.version_number || v2Version === v.version_number
                                    ? 'bg-blue-500/10 border-blue-500/30'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                                onClick={() => setV2Version(v.version_number)}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-slate-200">{v.version_number}</span>
                                    <Badge variant="outline" className="text-[10px] py-0 h-4 border-white/10 text-slate-400">
                                        {formatTimestamp(v.created_at)}
                                    </Badge>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate">{v.created_by}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Comparison View */}
                <div className="flex-1 overflow-auto bg-[#0a0a0c] p-8 space-y-8">
                    {loadingSections ? (
                        <div className="text-slate-400 text-center py-8">Loading sections...</div>
                    ) : (
                        v1Sections.map((v1Section) => {
                            const v2Section = v2Sections.find(s => s.section_id === v1Section.section_id) || v1Section;
                            const hasChanges = v1Section.content !== v2Section.content;

                            return (
                                <Card
                                    key={v1Section.id}
                                    className={`bg-[#111114] border-white/5 hover:border-white/20 transition-all cursor-pointer ${selectedSection === v1Section.section_id ? 'ring-2 ring-blue-500/50 scale-[1.01]' : ''
                                        }`}
                                    onClick={() => setSelectedSection(v1Section.section_id)}
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
                                                    {v1Section.content}
                                                </p>
                                            </div>
                                            {/* Version 2 Text */}
                                            <div className={`flex-1 p-6 ${hasChanges ? 'bg-purple-500/10' : 'bg-transparent'}`}>
                                                <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                                                    {v2Section.content}
                                                    {hasChanges && (
                                                        <span className="inline-flex ml-2 h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
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
                                        <p className="text-sm text-slate-200 font-medium">
                                            {v1Sections.find(s => s.section_id === selectedSection)?.title}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        {loadingComments ? (
                                            <div className="text-xs text-slate-500 text-center py-4">Loading comments...</div>
                                        ) : (
                                            getCommentsForSection(selectedSection).map((comment) => (
                                                <div key={comment.id} className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-bold text-slate-300">{comment.author}</span>
                                                        <span className="text-[10px] text-slate-500">{formatTimestamp(comment.created_at)}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 leading-normal">{comment.comment_text}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {isAddingComment ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={newCommentText}
                                                onChange={(e) => setNewCommentText(e.target.value)}
                                                placeholder="Enter your comment..."
                                                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                                                rows={4}
                                                autoFocus
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleAddComment}
                                                    disabled={!newCommentText.trim() || submittingComment}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                                                >
                                                    <Send className="h-3 w-3 mr-1" />
                                                    {submittingComment ? 'Posting...' : 'Post'}
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setIsAddingComment(false);
                                                        setNewCommentText('');
                                                    }}
                                                    variant="ghost"
                                                    className="text-xs h-8 text-slate-400 hover:text-slate-200"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => setIsAddingComment(true)}
                                            variant="ghost"
                                            className="w-full justify-start text-xs border border-dashed border-white/10 text-slate-500 hover:text-slate-300 hover:bg-white/5"
                                        >
                                            <Plus className="h-3 w-3 mr-2" />
                                            Add new comment...
                                        </Button>
                                    )}
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
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                            onClick={() => onNavigate?.('digital-signature')}
                        >
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
