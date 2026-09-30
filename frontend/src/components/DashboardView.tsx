import React from 'react';
import {
  FileText,
  BookOpen,
  MessageSquare,
  FileBarChart,
  ArrowUpRight,
  UploadCloud,
  Bot,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { DashboardStats, DocumentItem, RecentQuestion } from '../types';
import { NavItem } from './Sidebar';

interface DashboardViewProps {
  stats: DashboardStats;
  documents: DocumentItem[];
  recentQuestions: RecentQuestion[];
  onNavigate: (nav: NavItem) => void;
  onOpenUpload: () => void;
  onOpenReportModal: () => void;
  onSelectQuestion: (question: string) => void;
  onInspectDocument: (doc: DocumentItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  documents,
  recentQuestions,
  onNavigate,
  onOpenUpload,
  onOpenReportModal,
  onSelectQuestion,
  onInspectDocument,
}) => {
  const statCards = [
    {
      label: 'Documents',
      value: stats.documentsCount.toString(),
      subtext: 'Verified institutional files',
      icon: FileText,
      accent: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Pages Indexed',
      value: stats.pagesIndexed.toLocaleString(),
      subtext: 'Searchable dense vectors',
      icon: BookOpen,
      accent: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Questions Asked',
      value: stats.questionsAsked.toString(),
      subtext: 'With source citations',
      icon: MessageSquare,
      accent: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      label: 'Reports Generated',
      value: stats.reportsGenerated.toString(),
      subtext: 'Executive syntheses & audits',
      icon: FileBarChart,
      accent: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
  ];

  const suggestedPrompts = [
    'What is our reimbursement policy for travel & flights?',
    'What is the equipment stipend for remote employees?',
    'Explain the academic grade appeal procedure & deadlines',
    'What are the mandatory MFA and BYOD security standards?',
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Knowledge Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Access organizational knowledge and generate insights.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center ${stat.accent}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  {stat.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Quick Actions
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Accelerate your workflow with grounded AI assistance and document ingestion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => onNavigate('assistant')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <Bot className="w-4 h-4 text-blue-400" />
            <span>Ask AI</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <FileBarChart className="w-4 h-4 text-violet-400" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Suggested Knowledge Prompts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Frequently Asked Knowledge Inquiries
          </h2>
          <span className="text-xs text-slate-400">Click to run via AI Assistant</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSelectQuestion(prompt)}
              className="text-left p-3.5 bg-white hover:bg-blue-50/40 rounded-xl border border-slate-200 hover:border-blue-400 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-xs font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                  {prompt}
                </span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Documents & Recent AI Questions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Documents */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent Documents</h2>
              <p className="text-xs text-slate-500">Latest files ingested into vector storage</p>
            </div>
            <button
              onClick={() => onNavigate('documents')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {documents.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center text-slate-500 shrink-0 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <button
                      onClick={() => onInspectDocument(doc)}
                      className="text-xs font-medium text-slate-900 hover:text-blue-600 truncate block text-left"
                    >
                      {doc.title}
                    </button>
                    {/* Clean unboxed text metadata with separators */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                      <span>{doc.category}</span>
                      <span>·</span>
                      <span>{doc.pageCount} pgs</span>
                      <span>·</span>
                      <span>{doc.uploadDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onInspectDocument(doc)}
                    className="px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded transition-colors"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent AI Questions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent AI Questions</h2>
              <p className="text-xs text-slate-500">Queries resolved with document citations</p>
            </div>
            <button
              onClick={() => onNavigate('assistant')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Ask Assistant</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recentQuestions.slice(0, 4).map((q) => (
              <div
                key={q.id}
                onClick={() => onSelectQuestion(q.question)}
                className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {q.question}
                  </div>
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                    <span>{q.category}</span>
                    <span>·</span>
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {q.citedDocumentCount} source cited
                    </span>
                    <span>·</span>
                    <span>{q.timestamp}</span>
                  </div>
                </div>

                <div className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
