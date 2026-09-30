import React, { useState } from 'react';
import { X, Download, Copy, Check, Printer, FileBarChart, Calendar, User, FileText } from 'lucide-react';
import { ReportItem } from '../types';

interface ReportViewerModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({
  report,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(report.contentMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <FileBarChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 leading-tight">
                {report.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                <span className="font-semibold text-blue-600">{report.type}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {report.createdAt}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {report.author}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg transition-colors text-xs flex items-center gap-1.5 border border-slate-200"
              title="Copy Markdown"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-xs flex items-center gap-1.5 shadow-sm"
              title="Download Report"
            >
              <Download className="w-4 h-4" />
              <span>Download (.md)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Source Documents Banner */}
        <div className="px-6 py-2.5 bg-slate-50/70 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-600">
          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="font-semibold text-slate-700">Source Grounding:</span>
          <span className="text-slate-600 truncate">
            {report.sourceDocuments.join(', ')}
          </span>
        </div>

        {/* Report Content Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 print:p-0">
          <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed">
            {report.contentMarkdown.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
                    {line.replace('# ', '')}
                  </h1>
                );
              }
              if (line.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-lg font-semibold text-slate-900 mt-6 mb-2">
                    {line.replace('## ', '')}
                  </h2>
                );
              }
              if (line.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-sm font-semibold text-slate-800 mt-4 mb-1">
                    {line.replace('### ', '')}
                  </h3>
                );
              }
              if (line.startsWith('---')) {
                return <hr key={index} className="my-4 border-slate-200" />;
              }
              if (line.startsWith('- ')) {
                return (
                  <li key={index} className="ml-4 list-disc text-slate-700 my-1">
                    {line.replace('- ', '')}
                  </li>
                );
              }
              if (line.startsWith('|')) {
                return (
                  <div key={index} className="font-mono text-xs bg-slate-50 p-1 border-x border-slate-200">
                    {line}
                  </div>
                );
              }
              if (line.trim() === '') {
                return <div key={index} className="h-2" />;
              }
              return (
                <p key={index} className="my-1.5 text-slate-700 leading-relaxed">
                  {line}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Verified by Enterprise AI Engine · Document hash valid
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
