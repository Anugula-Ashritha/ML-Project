import React, { useState } from 'react';
import {
  FileBarChart,
  Plus,
  Search,
  Download,
  Eye,
  Trash2,
  Calendar,
  User,
  FileText,
  Sparkles,
} from 'lucide-react';
import { ReportItem } from '../types';

interface ReportsViewProps {
  reports: ReportItem[];
  onOpenGenerateModal: () => void;
  onOpenReportViewer: (report: ReportItem) => void;
  onDeleteReport: (id: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  onOpenGenerateModal,
  onOpenReportViewer,
  onDeleteReport,
}) => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredReports = reports.filter((rep) => {
    const matchSearch =
      search.trim() === '' ||
      rep.title.toLowerCase().includes(search.toLowerCase()) ||
      rep.summary.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === 'all' || rep.type === selectedType;
    return matchSearch && matchType;
  });

  const handleDownload = (e: React.MouseEvent, report: ReportItem) => {
    e.stopPropagation();
    const blob = new Blob([report.contentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete report "${title}"?`)) {
      onDeleteReport(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Synthesized executive briefings, policy audits, and comparative matrices.
          </p>
        </div>

        <button
          onClick={onOpenGenerateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports by title or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-none transition-colors text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Type:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white text-slate-700 outline-none"
          >
            <option value="all">All Types</option>
            <option value="Executive Summary">Executive Summary</option>
            <option value="Policy Audit">Policy Audit</option>
            <option value="Department Briefing">Department Briefing</option>
            <option value="Comparative Analysis">Comparative Analysis</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => onOpenReportViewer(report)}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileBarChart className="w-4 h-4" />
                  </div>
                  {/* Clean unboxed text metadata */}
                  <span className="text-xs font-semibold text-blue-600 font-mono">
                    {report.type}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {report.summary}
                </p>

                {/* Grounding Source Count */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{report.sourceDocuments.length} source documents cited</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{report.createdAt}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDownload(e, report)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Download Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, report.id, report.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-slate-200">
            <FileBarChart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <div className="text-sm font-medium text-slate-700">No reports generated yet</div>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Click &quot;Generate New Report&quot; to synthesize multiple documents into an executive briefing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
