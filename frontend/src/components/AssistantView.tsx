import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  User,
  Send,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  FileText,
  FileBarChart,
  Loader2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage, Citation, DocumentItem } from '../types';

interface AssistantViewProps {
  documents: DocumentItem[];
  messages: ChatMessage[];
  onSendMessage: (query: string, scopeDocId?: string) => Promise<void>;
  onClearChat: () => void;
  onOpenCitation: (citation: Citation) => void;
  onTurnIntoReport: (text: string, citations?: Citation[]) => void;
  activeScopeDocId?: string;
  onSelectScopeDoc: (docId: string | undefined) => void;
  isLoading: boolean;
  prefillQuery?: string;
}

export const AssistantView: React.FC<AssistantViewProps> = ({
  documents,
  messages,
  onSendMessage,
  onClearChat,
  onOpenCitation,
  onTurnIntoReport,
  activeScopeDocId,
  onSelectScopeDoc,
  isLoading,
  prefillQuery,
}) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (prefillQuery) {
      setInput(prefillQuery);
      textareaRef.current?.focus();
    }
  }, [prefillQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const query = input.trim();
    setInput('');
    onSendMessage(query, activeScopeDocId);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const promptSuggestions = [
    'What is our reimbursement policy for travel & flights?',
    'What is the equipment stipend for remote employees?',
    'Explain the academic grade appeal procedure & deadlines',
    'What are the mandatory MFA and BYOD security standards?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Scope Control Header */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-800">Knowledge Scope:</span>
          <select
            value={activeScopeDocId || ''}
            onChange={(e) => onSelectScopeDoc(e.target.value || undefined)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1 bg-white text-slate-800 outline-none focus:border-blue-500 font-medium"
          >
            <option value="">All Indexed Documents ({documents.length} corpora)</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title} ({doc.category})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClearChat}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-200/50 transition-colors"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <Bot className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-slate-900">
                Enterprise AI Knowledge Assistant
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ask questions about campus policies, enterprise security, travel caps, or academic rules. Every answer is verified with citations from indexed source documents.
              </p>
            </div>

            {/* Prompt suggestions grid */}
            <div className="w-full space-y-2 text-left pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Suggested Questions
              </span>
              {promptSuggestions.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(prompt);
                    textareaRef.current?.focus();
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-xs text-slate-700 hover:text-blue-600 transition-colors flex items-center justify-between text-left group"
                >
                  <span>{prompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-xl p-4 space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-slate-50/80 border border-slate-200/90 text-slate-800 rounded-bl-xs'
                }`}
              >
                {/* Content */}
                <div className="whitespace-pre-line leading-relaxed font-sans">
                  {msg.content.split('\n').map((line, lIdx) => {
                    // Render simple bold markdown
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={lIdx} className="my-1">
                        {parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return (
                              <strong key={pIdx} className="font-semibold">
                                {part.slice(2, -2)}
                              </strong>
                            );
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>

                {/* Grounding Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-200/70 space-y-1.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-blue-600" />
                      <span>Verified Citations ({msg.citations.length})</span>
                    </div>

                    <div className="space-y-1.5">
                      {msg.citations.map((citation) => (
                        <button
                          key={citation.id}
                          onClick={() => onOpenCitation(citation)}
                          className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-colors flex items-center justify-between text-xs group"
                        >
                          <div className="truncate pr-2">
                            <span className="font-medium text-slate-800 group-hover:text-blue-600">
                              {citation.fileName}
                            </span>
                            <span className="text-slate-400 mx-1.5">·</span>
                            <span className="text-blue-600 font-semibold font-mono">
                              Page {citation.pageNumber}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-mono shrink-0">
                            {(citation.relevanceScore * 100).toFixed(0)}% match
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer metadata & actions for assistant */}
                {msg.sender === 'assistant' && (
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/50">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{msg.processingTimeMs || 420}ms RAG lookup</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onTurnIntoReport(msg.content, msg.citations)}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        title="Create formal report from this answer"
                      >
                        <FileBarChart className="w-3 h-3" />
                        <span>Export to Report</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading state indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Retrieving dense vectors &amp; cross-referencing citations...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={textareaRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about enterprise policies, academic regulations, or guidelines... (Enter to send)"
            className="w-full pl-4 pr-12 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-600 rounded-xl outline-none transition-colors text-slate-800 resize-none"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-3 bottom-4 p-1.5 rounded-lg transition-colors ${
              input.trim() && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
          <span>Press Enter to send · Shift + Enter for new line</span>
          <span className="flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Strict Grounding Active
          </span>
        </div>
      </div>
    </div>
  );
};
