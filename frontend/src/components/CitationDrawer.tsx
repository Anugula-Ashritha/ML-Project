import React from 'react';
import { X, FileText, ExternalLink, CheckCircle2, Bookmark, Copy, Check } from 'lucide-react';
import { Citation, DocumentItem } from '../types';

interface CitationDrawerProps {
  citation: Citation | null;
  document?: DocumentItem | null;
  onClose: () => void;
  onOpenDocument: (doc: DocumentItem) => void;
}

export const CitationDrawer: React.FC<CitationDrawerProps> = ({
  citation,
  document,
  onClose,
  onOpenDocument,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!citation) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(citation.excerpt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Verified Citation</h3>
                <p className="text-xs text-slate-500">Document Grounding Evidence</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Source Reference Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="font-medium text-slate-900 text-sm leading-snug">
                  {citation.documentTitle}
                </div>
              </div>

              {/* Clean text metadata without pill slop */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3 font-mono">
                <span>{citation.fileName}</span>
                <span>·</span>
                <span className="font-semibold text-blue-600">Page {citation.pageNumber}</span>
                <span>·</span>
                <span>{citation.category}</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cosine Similarity: {(citation.relevanceScore * 100).toFixed(1)}% match</span>
              </div>
            </div>

            {/* Extracted Passage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Extracted Source Excerpt
                </label>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 text-slate-800 text-xs leading-relaxed font-sans relative">
                <div className="absolute top-3 left-3 text-amber-500 opacity-30 select-none">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div className="pl-4 border-l-2 border-amber-400">
                  {citation.excerpt}
                </div>
              </div>
            </div>

            {/* Grounding Context Note */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="font-medium text-slate-800">Verification Mechanism</div>
              <p className="leading-relaxed text-slate-500">
                This passage was retrieved directly from the vector index embeddings representing page {citation.pageNumber} of this document. It was supplied to the language model to prevent hallucinations.
              </p>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
            >
              Close
            </button>

            {document && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDocument(document);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
              >
                <span>Inspect Full Document</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
