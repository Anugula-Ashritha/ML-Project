import React from 'react';
import { X, FileText, Bot, Layers, CheckCircle2, Copy, Check } from 'lucide-react';
import { DocumentItem } from '../types';

interface DocumentInspectorModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onQueryWithDoc: (doc: DocumentItem) => void;
}

export const DocumentInspectorModal: React.FC<DocumentInspectorModalProps> = ({
  document,
  onClose,
  onQueryWithDoc,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!document) return null;

  const handleCopyChunk = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 leading-tight">
                {document.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                <span>{document.fileName}</span>
                <span>·</span>
                <span>{document.category}</span>
                <span>·</span>
                <span>{document.fileSize}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Document Summary */}
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Document Abstract &amp; Scope
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {document.summary}
            </p>
          </div>

          {/* Indexing Diagnostics */}
          <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <div className="text-slate-400 font-medium">Pages</div>
              <div className="text-base font-semibold text-slate-800">{document.pageCount}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Vector Chunks</div>
              <div className="text-base font-semibold text-slate-800">{document.chunkCount}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Status</div>
              <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Indexed &amp; Ready</span>
              </div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Uploaded By</div>
              <div className="text-xs font-medium text-slate-700 mt-1 truncate">
                {document.uploadedBy}
              </div>
            </div>
          </div>

          {/* Semantic Chunks preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Indexed Text Passages &amp; Vector Chunks ({document.chunks?.length || 0} samples)
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">512 token window</span>
            </div>

            <div className="space-y-3">
              {document.chunks && document.chunks.length > 0 ? (
                document.chunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-mono">
                      <span className="font-semibold text-slate-700">
                        Page {chunk.pageNumber} · Chunk #{chunk.chunkIndex}
                      </span>
                      <div className="flex items-center gap-3">
                        <span>{chunk.tokenCount} tokens</span>
                        <button
                          onClick={() => handleCopyChunk(chunk.text, chunk.id)}
                          className="flex items-center gap-1 text-slate-400 hover:text-slate-700"
                        >
                          {copiedId === chunk.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600 text-[11px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/70 p-3 rounded border border-slate-100">
                      {chunk.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-lg text-center">
                  No chunk preview available for this document.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            Close Inspector
          </button>

          <button
            onClick={() => {
              onClose();
              onQueryWithDoc(document);
            }}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI About This Document</span>
          </button>
        </div>
      </div>
    </div>
  );
};
