import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels';
import Editor from '@monaco-editor/react';
import { Bot, Terminal, Code2, AlertTriangle, FileCode, CheckCircle2, ChevronLeft, LayoutPanelLeft, ListTree, Activity, MessageSquare, Send } from 'lucide-react';
import { api } from '../api';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { usePreferences } from '../contexts/PreferencesContext';

const Workspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { preferences } = usePreferences();
  
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [bottomTab, setBottomTab] = useState('terminal');

  const [code, setCode] = useState('# Loading code...');
  
  // AI Chat State
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setChatLoading(true);

    try {
      const res = await api.chatWithReview(id, userMsg.content);
      setMessages(prev => [...prev, { role: 'ai', content: res.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I encountered an error." }]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const data = await api.getReview(id);
        setReview(data);
        if (data.project_id) {
          try {
            const codeData = await api.getRawCode(data.project_id);
            setCode(codeData.code || '# Code not available');
          } catch (codeErr) {
            console.error("Failed to fetch code", codeErr);
            setCode('# Code not available');
          }
        }
      } catch (error) {
        console.error("Failed to load review in workspace", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <p className="text-text-muted animate-pulse">Initializing AI Workspace...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Review Not Found</h2>
        <Button onClick={() => navigate('/reviews')}>Back to Reviews</Button>
      </div>
    );
  }

  // Derive editor theme based on active global theme
  const isDark = !preferences.theme || preferences.theme.includes('dark') || preferences.theme === 'dracula' || preferences.theme === 'tokyo-night' || preferences.theme === 'catppuccin' || preferences.theme === 'nord';
  const editorTheme = isDark ? "vs-dark" : "light";

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-text-primary">
      {/* Top Navbar */}
      <div className="h-12 border-b border-border bg-surface flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-text-muted hover:text-text-primary" onClick={() => navigate('/reviews')}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <FileCode className="h-4 w-4 text-accent" />
          <span className="font-medium text-sm">{review.project?.name || 'Unknown Project'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Analysis Complete
          </div>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          
          {/* Editor */}
          <Panel defaultSize={65} minSize={40}>
            <div className="h-full w-full relative bg-background">
              <Editor
                height="100%"
                language="python"
                theme={editorTheme}
                value={code}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineHeight: 24,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              />
            </div>
          </Panel>
              


          <PanelResizeHandle className="w-1 bg-border hover:bg-accent/50 transition-colors cursor-col-resize" />
          
          {/* Right Sidebar (AI Assistant) */}
          <Panel defaultSize={35} minSize={20}>
            <div className="h-full border-l border-border bg-surface flex flex-col">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2 font-medium text-sm">
                  <Bot className="h-4 w-4 text-accent" />
                  AI Assistant
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto bg-background space-y-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-text-muted text-sm text-center h-full">
                    <div className="max-w-[200px] space-y-3">
                      <MessageSquare className="h-8 w-8 mx-auto opacity-50 text-accent" />
                      <p>Ask me anything about this code! I can explain concepts, suggest alternatives, or help you refactor.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-4 rounded-xl max-w-[90%] text-[15px] ${m.role === 'user' ? 'bg-accent text-white shadow-sm' : 'bg-surface border border-border shadow-sm text-text-primary'}`}>
                          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(m.content)) }} className="prose prose-sm dark:prose-invert" />
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="p-3 rounded-lg bg-surface border border-border text-text-muted text-sm animate-pulse">Thinking...</div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="p-3 border-t border-border flex gap-2 bg-surface">
                <input 
                  type="text" 
                  placeholder="Ask a question about this code..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent"
                />
                <Button size="icon" onClick={sendMessage} disabled={chatLoading}><Send className="w-4 h-4" /></Button>
              </div>
            </div>
          </Panel>
          
        </PanelGroup>
      </div>
    </div>
  );
};

export default Workspace;
