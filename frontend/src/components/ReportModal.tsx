import React, { useState } from 'react';
import { X, FileBarChart, Loader2, Sparkles, CheckSquare, Square } from 'lucide-react';
import { DocumentItem, ReportItem } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  documents: DocumentItem[];
  onClose: () => void;
  onGenerate: (params: {
    title: string;
    type: 'Executive Summary' | 'Policy Audit' | 'Department Briefing' | 'Comparative Analysis';
    sourceDocuments: string[];
    focusTopic: string;
  }) => Promise<ReportItem>;
  onSuccess: (newReport: ReportItem) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  documents,
  onClose,
  onGenerate,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<
    'Executive Summary' | 'Policy Audit' | 'Department Briefing' | 'Comparative Analysis'
  >('Executive Summary');
  const [selectedDocs, setSelectedDocs] = useState<string[]>(
    documents.slice(0, 2).map((d) => d.title)
  );
  const [focusTopic, setFocusTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const toggleDoc = (docTitle: string) => {
    if (selectedDocs.includes(docTitle)) {
      if (selectedDocs.length > 1) {
        setSelectedDocs(selectedDocs.filter((d) => d !== docTitle));
      }
    } else {
      setSelectedDocs([...selectedDocs, docTitle]);
    }
  };

  const handleSelectAll = () => {
    setSelectedDocs(documents.map((d) => d.title));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert('Please enter a report title.');
      return;
    }
    if (selectedDocs.length === 0) {
      alert('Please select at least one source document.');
      return;
    }

    try {
      setIsGenerating(true);
      const report = await onGenerate({
        title,
        type,
        sourceDocuments: selectedDocs,
        focusTopic,
      });
      setIsGenerating(false);
      onSuccess(report);
      onClose();
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      alert('Failed to generate report. Please try again.');
    }
  };

  const applyPreset = (presetTitle: string, presetType: any, topic: string) => {
    setTitle(presetTitle);
    setType(presetType);
    setFocusTopic(topic);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileBarChart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Generate Knowledge Report</h2>
              <p className="text-[11px] text-slate-500">Automated Multi-Document Synthesis</p>
            </div>
          </div>
          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Generating Animation */}
        {isGenerating ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Synthesizing Verified Records</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Extracting relevant clauses from {selectedDocs.length} source documents, evaluating cross-policy compliance, and drafting executive findings...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Template Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Suggested Report Blueprints
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    applyPreset(
                      'Cross-Departmental Remote Work & Travel Compliance Audit',
                      'Policy Audit',
                      'Reimbursement thresholds and equipment stipends'
                    )
                  }
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-xs transition-colors"
                >
                  <div className="font-medium text-slate-800">Remote &amp; Travel Audit</div>
                  <div className="text-[10px] text-slate-500">Stipends &amp; per diems</div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyPreset(
                      'Academic Integrity & Grade Appeal Procedure Briefing',
                      'Department Briefing',
                      'Statutory appeal timelines and hearing protocols'
                    )
                  }
                  className="p-2 text-left rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-xs transition-colors"
                >
                  <div className="font-medium text-slate-800">Academic Dispute Protocol</div>
                  <div className="text-[10px] text-slate-500">Appeal windows &amp; hearings</div>
                </button>
              </div>
            </div>

            {/* Title & Type */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Security &amp; Compliance Synthesis"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Report Format
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600 text-slate-800 bg-white"
                >
                  <option value="Executive Summary">Executive Summary</option>
                  <option value="Policy Audit">Policy Audit</option>
                  <option value="Department Briefing">Department Briefing</option>
                  <option value="Comparative Analysis">Comparative Analysis</option>
                </select>
              </div>
            </div>

            {/* Focus Topic */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Custom Focus / Specific Directives (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Compare purchasing caps, remote work stipends, or MFA requirements"
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600 text-slate-800"
              />
            </div>

            {/* Source Documents Checklist */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Select Grounding Documents ({selectedDocs.length} selected)
                </label>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                >
                  Select All
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 p-1">
                {documents.map((doc) => {
                  const isChecked = selectedDocs.includes(doc.title);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDoc(doc.title)}
                      className={`p-2 rounded text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50/50 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className="truncate font-medium">{doc.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {doc.pageCount} pgs
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <FileBarChart className="w-3.5 h-3.5" />
                <span>Generate Executive Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
