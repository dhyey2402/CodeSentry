import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Activity, AlertTriangle, ShieldCheck, FileText, ArrowLeft, Download, Box, 
  Code2, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, Wrench, Clock, Search, BookOpen, MessageSquare, Send, LayoutTemplate, Trash2
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { usePreferences } from '../contexts/PreferencesContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../lib/utils';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CircularProgress = ({ value, max = 10, size = 120, label, color = "text-accent" }) => {
  const radius = (size - 12) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / max) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-hover" />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
            strokeDasharray={circumference}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold tracking-tighter">{value}</span>
          <span className="text-[10px] text-text-muted uppercase tracking-wider">{label}</span>
        </div>
      </div>
    </div>
  );
};

const AIChatWidget = ({ reviewId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chatWithReview(reviewId, userMsg.content);
      setMessages(prev => [...prev, { role: 'ai', content: res.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-80 md:w-96 bg-surface border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: '400px' }}
          >
            <div className="bg-surface-hover p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-accent" /> AI Review Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text-primary">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-text-muted text-sm mt-10">
                  Ask me anything about this code review! I can explain concepts, suggest alternatives, or help you refactor.
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-[80%] text-sm ${m.role === 'user' ? 'bg-accent text-white' : 'bg-surface-hover text-text-primary'}`}>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(m.content)) }} className="prose prose-sm dark:prose-invert" />
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-lg bg-surface-hover text-text-muted text-sm animate-pulse">Thinking...</div>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-border flex gap-2">
              <input
                type="text"
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                placeholder="Ask a question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <Button size="icon" onClick={sendMessage} disabled={loading}><Send className="w-4 h-4" /></Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button size="lg" className="rounded-full h-14 w-14 shadow-lg shadow-accent/20" onClick={() => setIsOpen(!isOpen)}>
        <MessageSquare className="w-6 h-6" />
      </Button>
    </div>
  );
};

const IssueCard = ({ finding }) => {
  const [expanded, setExpanded] = useState(false);
  const extra = finding.extra_data || {};
  
  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'CRITICAL':
      case 'ERROR': return { bg: 'bg-destructive/10', border: 'border-destructive/20', text: 'text-destructive', icon: <AlertTriangle className="h-5 w-5 text-destructive" /> };
      case 'WARNING':
      case 'MEDIUM': return { bg: 'bg-warning/10', border: 'border-warning/20', text: 'text-warning', icon: <AlertTriangle className="h-5 w-5 text-warning" /> };
      default: return { bg: 'bg-success/10', border: 'border-success/20', text: 'text-success', icon: <CheckCircle2 className="h-5 w-5 text-success" /> };
    }
  };

  const style = getSeverityStyle(finding.severity);

  return (
    <Card className={cn("overflow-hidden transition-all duration-300", expanded ? "border-border shadow-md" : "hover:border-border")}>
      <div 
        className={cn("p-4 flex items-start gap-4 cursor-pointer", expanded ? "bg-surface" : "")}
        onClick={() => setExpanded(!expanded)}
      >
        <div className={cn("p-2 rounded-lg flex-shrink-0", style.bg, style.text)}>
          {style.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-text-primary truncate">{finding.issue_type}</h4>
              {extra.confidence && (
                <Badge variant="outline" className="text-xs">AI Confidence: {extra.confidence}%</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {extra.fix_time && <span className="text-xs text-text-muted flex items-center gap-1"><Clock className="w-3 h-3" /> {extra.fix_time}</span>}
              <Badge variant={finding.severity === 'CRITICAL' ? 'destructive' : finding.severity === 'WARNING' ? 'warning' : 'success'}>
                {finding.severity}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-text-muted line-clamp-1">{finding.description}</p>
        </div>
        <div className="flex-shrink-0 text-text-muted mt-1">
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-border mt-2 bg-surface">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mb-4">
                <div>
                  <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Location</h5>
                  <div className="flex items-center gap-2 text-sm bg-background p-2 rounded-md border border-border">
                    <FileText className="h-4 w-4 text-accent" />
                    <span className="font-mono text-text-primary">{finding.file_path}</span>
                    <span className="text-text-muted">Line {finding.line_number}</span>
                  </div>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Impact & Confidence</h5>
                  <div className="text-sm text-text-primary space-y-1 bg-background p-2 rounded-md border border-border">
                    <div><span className="text-text-muted">Impact:</span> {extra.impact || "Medium"}</div>
                    {extra.confidence_reason && <div><span className="text-text-muted">Reasoning:</span> {extra.confidence_reason}</div>}
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-primary mb-4">{finding.description}</p>
              
              {extra.original_code && extra.improved_code && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <h5 className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">Before</h5>
                    <div className="bg-destructive/5 border border-destructive/20 rounded-md overflow-hidden text-sm">
                       <SyntaxHighlighter language="python" style={atomOneDark} customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}>
                         {extra.original_code}
                       </SyntaxHighlighter>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-success uppercase tracking-wider mb-2">After</h5>
                    <div className="bg-success/5 border border-success/20 rounded-md overflow-hidden text-sm">
                       <SyntaxHighlighter language="python" style={atomOneDark} customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}>
                         {extra.improved_code}
                       </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              )}
              
              {!extra.improved_code && finding.suggestion && (
                <div className="mt-4">
                  <h5 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Wrench className="h-3 w-3" /> Recommended Fix
                  </h5>
                  <div className="bg-accent/5 border border-accent/20 p-3 rounded-md text-sm text-text-primary font-mono whitespace-pre-wrap">
                    {finding.suggestion}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

const CodeHeatmap = ({ code, findings }) => {
  const { preferences } = usePreferences();
  const isDark = preferences?.theme?.includes('dark') || preferences?.theme === 'system';
  
  if (!code) return <div className="text-center py-10 text-text-muted">Source code unavailable</div>;
  
  const findingLines = new Set(findings.map(f => f.line_number));

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <SyntaxHighlighter 
        language="python" 
        style={isDark ? atomOneDark : atomOneLight}
        showLineNumbers={true}
        wrapLines={true}
        lineProps={(lineNumber) => {
          const style = { display: 'block', width: '100%' };
          if (findingLines.has(lineNumber)) {
            const issue = findings.find(f => f.line_number === lineNumber);
            if (issue.severity === 'CRITICAL' || issue.severity === 'ERROR') {
              style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            } else if (issue.severity === 'WARNING') {
              style.backgroundColor = 'rgba(245, 158, 11, 0.2)';
            } else {
              style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
            }
          }
          return { style };
        }}
        customStyle={{ margin: 0, padding: '1.5rem', background: 'var(--color-surface)' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [rawCode, setRawCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const { preferences } = usePreferences();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        setLoading(true);
        const data = await api.getReview(id);
        setReview(data);
        
        if (data?.project_id) {
          try {
            const codeData = await api.getRawCode(data.project_id);
            setRawCode(codeData.code);
          } catch (err) {
            console.error("Failed to load raw code:", err);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [id]);

  if (loading) {
    return (
      <div className="py-6 space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)}
        </div>
        <Skeleton className="h-96 rounded-xl w-full mt-6" />
      </div>
    );
  }

  if (!review) return <div className="py-6 text-center text-text-muted">Review not found.</div>;

  const aiData = review.ai_summary ? JSON.parse(review.ai_summary) : null;
  
  const handleDownloadDocs = () => {
    if (!review.documentation) return;
    const blob = new Blob([review.documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documentation_${id}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this analysis? This action cannot be undone.")) {
      try {
        await api.deleteReview(id);
        navigate('/reviews');
      } catch (err) {
        console.error("Failed to delete review:", err);
        alert("Failed to delete review. Please try again.");
      }
    }
  };

  const criticalIssues = review.findings?.filter(f => f.severity === 'CRITICAL' || f.severity === 'ERROR') || [];
  const warnings = review.findings?.filter(f => f.severity === 'WARNING' || f.severity === 'MEDIUM') || [];
  const suggestions = review.findings?.filter(f => f.severity === 'INFO' || f.severity === 'LOW' || f.severity === 'SUCCESS') || [];
  
  const sortedFindings = [...(review.findings || [])].sort((a, b) => {
    const sevMap = { 'CRITICAL': 4, 'ERROR': 4, 'WARNING': 3, 'MEDIUM': 3, 'INFO': 1, 'LOW': 1, 'SUCCESS': 0 };
    return (sevMap[b.severity] || 0) - (sevMap[a.severity] || 0);
  });

  return (
    <div className="py-6 animate-in fade-in duration-500 relative">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/reviews')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">Review Report</h1>
            <p className="text-text-muted mt-1">Project: {review.project?.name || 'Unknown Project'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(`/reviews/${id}/workspace`)}>
            <LayoutTemplate className="w-4 h-4 mr-2" />
            Open Workspace
          </Button>
          <Button variant="outline" onClick={() => navigate('/reviews/replay')}>
            <Box className="w-4 h-4 mr-2" />
            Compare Replay
          </Button>
          <Button variant="primary" onClick={handleDownloadDocs} disabled={!review.documentation}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-surface to-background border-border">
          <CircularProgress value={aiData?.quality_score || review.pylint_score || 0} label="Quality" color="text-accent" size={100} />
        </Card>
        <Card className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-surface to-background border-border">
          <CircularProgress value={aiData?.security_score || review.ai_score || 0} label="Security" color="text-destructive" size={100} />
        </Card>
        <Card className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-surface to-background border-border">
          <CircularProgress value={aiData?.performance_score || 0} label="Performance" color="text-warning" size={100} />
        </Card>
        <Card className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-surface to-background border-border">
          <CircularProgress value={aiData?.readability_score || 0} label="Readability" color="text-success" size={100} />
        </Card>
        <Card className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-surface to-background border-border">
           <div className="text-center">
            <h4 className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Complexity</h4>
            <span className="text-3xl font-bold tracking-tighter text-text-primary">
              {typeof review.cyclomatic_complexity === 'number' 
                ? review.cyclomatic_complexity.toFixed(1) 
                : parseFloat(review.cyclomatic_complexity || 0).toFixed(1)}
            </span>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="ai" className="space-y-6">
        <TabsList className="mb-2">
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
          <TabsTrigger value="issues">Action Roadmap ({sortedFindings.length})</TabsTrigger>
          <TabsTrigger value="heatmap">Code Heatmap</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6">
          {aiData ? (
            <>
              <Card className="bg-gradient-to-r from-accent/10 via-background to-background border-l-4 border-l-accent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-accent" />
                    Review Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-primary leading-relaxed text-lg mb-6">
                    {aiData.review_story?.narrative || aiData.summary}
                  </p>
                  
                  {aiData.review_story && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-success/5 border border-success/20 p-4 rounded-xl">
                        <h4 className="font-semibold text-success mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {aiData.review_story.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-xl">
                        <h4 className="font-semibold text-destructive mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Areas for Improvement</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {aiData.review_story.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {aiData.learning_hub?.length > 0 && (
                   <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                          <BookOpen className="h-5 w-5 text-accent" />
                          AI Learning Hub
                        </CardTitle>
                        <CardDescription>Targeted topics to level up based on this review.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {aiData.learning_hub.map((hub, i) => (
                            <li key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-surface hover:bg-surface-hover cursor-pointer transition-colors">
                              <div>
                                <h5 className="font-medium text-sm">{hub.title}</h5>
                                <p className="text-xs text-text-muted mt-1">{hub.concept}</p>
                              </div>
                              <ArrowLeft className="w-4 h-4 rotate-135 text-text-muted" />
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                   </Card>
                 )}
                 <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-warning">
                        <Lightbulb className="h-5 w-5" />
                        Refactoring & Naming
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Refactoring Advice</h4>
                        <p className="text-text-primary leading-relaxed bg-surface p-4 rounded-lg border border-border text-sm">{aiData.refactoring_advice}</p>
                      </div>
                    </CardContent>
                 </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-text-muted">
                No AI Review data available for this analysis.
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="issues" className="space-y-6">
          <div className="flex gap-2 flex-wrap mb-6">
            <Badge variant="destructive" className="px-3 py-1 text-sm">Critical ({criticalIssues.length})</Badge>
            <Badge variant="warning" className="px-3 py-1 text-sm">Warnings ({warnings.length})</Badge>
            <Badge variant="success" className="px-3 py-1 text-sm">Suggestions ({suggestions.length})</Badge>
          </div>

          <div className="space-y-4">
            {sortedFindings.length > 0 ? (
              sortedFindings.map(finding => (
                <IssueCard key={finding.id} finding={finding} />
              ))
            ) : (
              <Card className="border-dashed bg-surface/50">
                <CardContent className="py-16 text-center">
                  <div className="h-12 w-12 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">No issues found</h3>
                  <p className="text-text-muted">This codebase looks incredibly clean and follows best practices.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Code Risk Heatmap</CardTitle>
              <CardDescription>Lines are highlighted based on vulnerability or issue severity.</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeHeatmap code={rawCode} findings={sortedFindings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader className="border-b border-border bg-surface">
              <CardTitle>Auto-Generated Documentation</CardTitle>
              <CardDescription>Generated by Mistral Large to explain the codebase.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {review.documentation ? (
                 <div 
                   className="prose prose-zinc dark:prose-invert max-w-none" 
                   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(review.documentation)) }} 
                 />
              ) : (
                 <div className="py-12 text-center text-text-muted">
                    No documentation generated yet.
                 </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AIChatWidget reviewId={id} />
    </div>
  );
};

export default ReviewDetails;
