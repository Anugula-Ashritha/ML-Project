import React, { useState, useEffect } from 'react';
import { Sidebar, NavItem } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { DocumentsView } from './components/DocumentsView';
import { AssistantView } from './components/AssistantView';
import { ReportsView } from './components/ReportsView';
import { UploadModal } from './components/UploadModal';
import { CitationDrawer } from './components/CitationDrawer';
import { DocumentInspectorModal } from './components/DocumentInspectorModal';
import { ReportModal } from './components/ReportModal';
import { ReportViewerModal } from './components/ReportViewerModal';
import { api } from './services/api';
import {
  DocumentItem,
  DashboardStats,
  RecentQuestion,
  ReportItem,
  ChatMessage,
  Citation,
} from './types';

export default function App() {
  const [currentNav, setCurrentNav] = useState<NavItem>('dashboard');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    documentsCount: 0,
    pagesIndexed: 0,
    questionsAsked: 0,
    reportsGenerated: 0,
  });
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);

  // Chat Assistant State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: `Welcome to the **Enterprise AI Knowledge & Workflow Assistant**.\n\nI can answer inquiries about enterprise policies, academic regulations, procurement thresholds, and security guidelines with verified document citations.\n\nSelect a suggested query below or ask your own question.`,
      timestamp: 'Just now',
    },
  ]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [activeScopeDocId, setActiveScopeDocId] = useState<string | undefined>();
  const [assistantPrefill, setAssistantPrefill] = useState<string>('');

  // Modals & Drawers State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [inspectingDoc, setInspectingDoc] = useState<DocumentItem | null>(null);
  const [viewingReport, setViewingReport] = useState<ReportItem | null>(null);
  const [globalSearch, setGlobalSearch] = useState('');

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [docs, st, qns, reps] = await Promise.all([
          api.getDocuments(),
          api.getDashboardStats(),
          api.getRecentQuestions(),
          api.getReports(),
        ]);
        setDocuments(docs);
        setStats(st);
        setRecentQuestions(qns);
        setReports(reps);
      } catch (err) {
        console.error('Failed to initialize app data', err);
      }
    }
    loadData();
  }, []);

  // Handlers
  const handleSendMessage = async (query: string, scopeDocId?: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: 'Just now',
      scope: scopeDocId ? documents.find((d) => d.id === scopeDocId)?.title : 'All Documents',
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsAssistantLoading(true);

    try {
      const result = await api.queryAssistant(query, scopeDocId);
      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        content: result.answer,
        timestamp: 'Just now',
        citations: result.citations,
        processingTimeMs: result.processingTimeMs,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Refresh stats & questions
      const [updatedStats, updatedQuestions] = await Promise.all([
        api.getDashboardStats(),
        api.getRecentQuestions(),
      ]);
      setStats(updatedStats);
      setRecentQuestions(updatedQuestions);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'Unable to retrieve grounded response. Please try again.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const handleSelectQuestion = (question: string) => {
    setCurrentNav('assistant');
    setAssistantPrefill(question);
    handleSendMessage(question, activeScopeDocId);
  };

  const handleQueryWithDoc = (doc: DocumentItem) => {
    setActiveScopeDocId(doc.id);
    setCurrentNav('assistant');
    setAssistantPrefill(`What are the key policy requirements in ${doc.title}?`);
  };

  const handleUploadSuccess = async (newDoc: DocumentItem) => {
    const [updatedDocs, updatedStats] = await Promise.all([
      api.getDocuments(),
      api.getDashboardStats(),
    ]);
    setDocuments(updatedDocs);
    setStats(updatedStats);
  };

  const handleDeleteDocument = async (id: string) => {
    await api.deleteDocument(id);
    const [updatedDocs, updatedStats] = await Promise.all([
      api.getDocuments(),
      api.getDashboardStats(),
    ]);
    setDocuments(updatedDocs);
    setStats(updatedStats);
  };

  const handleGenerateReportSuccess = async (newReport: ReportItem) => {
    const [updatedReports, updatedStats] = await Promise.all([
      api.getReports(),
      api.getDashboardStats(),
    ]);
    setReports(updatedReports);
    setStats(updatedStats);
    setViewingReport(newReport);
  };

  const handleDeleteReport = async (id: string) => {
    await api.deleteReport(id);
    const [updatedReports, updatedStats] = await Promise.all([
      api.getReports(),
      api.getDashboardStats(),
    ]);
    setReports(updatedReports);
    setStats(updatedStats);
  };

  const handleTurnIntoReport = (text: string, citations?: Citation[]) => {
    setIsReportModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-100/70 font-sans text-slate-800 antialiased overflow-hidden">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentNav={currentNav}
        onNavigate={(nav) => setCurrentNav(nav)}
        documentsCount={documents.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentNav={currentNav}
          onOpenUpload={() => setIsUploadOpen(true)}
          onNavigate={(nav) => setCurrentNav(nav)}
          searchQuery={globalSearch}
          onSearchChange={(q) => {
            setGlobalSearch(q);
            if (q.trim() && currentNav === 'dashboard') {
              setCurrentNav('documents');
            }
          }}
        />

        {/* Dynamic Nav View Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {currentNav === 'dashboard' && (
            <DashboardView
              stats={stats}
              documents={documents}
              recentQuestions={recentQuestions}
              onNavigate={(nav) => setCurrentNav(nav)}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onSelectQuestion={handleSelectQuestion}
              onInspectDocument={(doc) => setInspectingDoc(doc)}
            />
          )}

          {currentNav === 'documents' && (
            <DocumentsView
              documents={documents}
              onOpenUpload={() => setIsUploadOpen(true)}
              onInspectDocument={(doc) => setInspectingDoc(doc)}
              onQueryWithDoc={handleQueryWithDoc}
              onDeleteDocument={handleDeleteDocument}
              globalSearch={globalSearch}
            />
          )}

          {currentNav === 'assistant' && (
            <AssistantView
              documents={documents}
              messages={messages}
              onSendMessage={handleSendMessage}
              onClearChat={() =>
                setMessages([
                  {
                    id: 'welcome-reset',
                    sender: 'assistant',
                    content: 'Conversation cleared. What organizational knowledge would you like to explore?',
                    timestamp: 'Just now',
                  },
                ])
              }
              onOpenCitation={(citation) => setActiveCitation(citation)}
              onTurnIntoReport={handleTurnIntoReport}
              activeScopeDocId={activeScopeDocId}
              onSelectScopeDoc={(id) => setActiveScopeDocId(id)}
              isLoading={isAssistantLoading}
              prefillQuery={assistantPrefill}
            />
          )}

          {currentNav === 'reports' && (
            <ReportsView
              reports={reports}
              onOpenGenerateModal={() => setIsReportModalOpen(true)}
              onOpenReportViewer={(rep) => setViewingReport(rep)}
              onDeleteReport={handleDeleteReport}
            />
          )}
        </main>
      </div>

      {/* Modals & Overlays */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        onUploadApi={api.uploadDocument}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        documents={documents}
        onClose={() => setIsReportModalOpen(false)}
        onGenerate={api.generateReport}
        onSuccess={handleGenerateReportSuccess}
      />

      <ReportViewerModal
        report={viewingReport}
        onClose={() => setViewingReport(null)}
      />

      <CitationDrawer
        citation={activeCitation}
        document={
          activeCitation
            ? documents.find((d) => d.id === activeCitation.documentId) || null
            : null
        }
        onClose={() => setActiveCitation(null)}
        onOpenDocument={(doc) => {
          setActiveCitation(null);
          setInspectingDoc(doc);
        }}
      />

      <DocumentInspectorModal
        document={inspectingDoc}
        onClose={() => setInspectingDoc(null)}
        onQueryWithDoc={handleQueryWithDoc}
      />
    </div>
  );
}
