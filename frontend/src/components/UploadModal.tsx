import React, { useState } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { DepartmentCategory, DocumentItem } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: DocumentItem) => void;
  onUploadApi: (
    params: { file: File; title: string; category: DepartmentCategory },
    onProgress: (step: string, progress: number) => void
  ) => Promise<DocumentItem>;
}

const PRESET_SAMPLES = [
  { title: 'University Research Grant & Lab Protocol 2026', fileName: 'Research_Grant_Lab_Safety_2026.pdf', category: 'Operations' as DepartmentCategory },
  { title: 'Cloud Infrastructure & Encryption Guidelines', fileName: 'Cloud_Encryption_Standards_v2.pdf', category: 'IT & Security' as DepartmentCategory },
  { title: 'Faculty Promotion & Tenure Evaluation Bylaws', fileName: 'Faculty_Promotion_Tenure_2026.pdf', category: 'Academic & Policies' as DepartmentCategory },
];

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUploadSuccess, onUploadApi }) => {
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DepartmentCategory>('Academic & Policies');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_SAMPLES[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setSelectedFile(null);
    alert(`Please select the actual PDF file: ${preset.fileName}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF files are supported by the current backend.');
      return;
    }
    setSelectedFile(file);
    setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) {
      alert('Please select a PDF file and provide a document title.');
      return;
    }

    try {
      setIsProcessing(true);
      const newDoc = await onUploadApi(
        { file: selectedFile, title, category },
        (step, progress) => {
          setProgressStep(step);
          setProgressPercent(progress);
        }
      );
      setIsProcessing(false);
      onUploadSuccess(newDoc);
      onClose();
      setSelectedFile(null);
      setTitle('');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white"><UploadCloud className="w-4 h-4" /></div>
            <div><h2 className="text-sm font-semibold text-slate-900">Upload &amp; Index Document</h2><p className="text-[11px] text-slate-500">Vectorize for Semantic Search &amp; RAG</p></div>
          </div>
          {!isProcessing && <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50"><X className="w-5 h-5" /></button>}
        </div>

        {isProcessing ? (
          <div className="p-8 space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600"><Loader2 className="w-7 h-7 animate-spin" /></div>
            <div className="space-y-1"><div className="text-sm font-semibold text-slate-900">{progressStep || 'Ingesting Document...'}</div><div className="text-xs text-slate-500">Extracting text, generating embeddings and updating the searchable RAG index</div></div>
            <div className="space-y-2 max-w-xs mx-auto"><div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} /></div><div className="text-[11px] font-mono text-slate-400">{progressPercent}% complete</div></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2"><span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-blue-600" />Quick Presets</span><span className="text-[11px] text-slate-400">Autofill only</span></div>
              <div className="space-y-1.5">{PRESET_SAMPLES.map((preset) => <button key={preset.fileName} type="button" onClick={() => handleSelectPreset(preset)} className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-colors text-xs flex items-center justify-between"><div className="flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="font-medium text-slate-800 truncate">{preset.title}</span></div><span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{preset.category}</span></button>)}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Select PDF</label>
              <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <UploadCloud className="w-6 h-6 text-slate-400 mb-1.5" />
                <span className="text-xs font-medium text-slate-700">{selectedFile ? selectedFile.name : 'Choose a PDF from your computer'}</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Only PDF files are supported</span>
                <input type="file" accept="application/pdf,.pdf" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Document Display Title</label>
              <input type="text" required placeholder="e.g. 2026 Academic Code of Conduct" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Department / Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as DepartmentCategory)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-600 text-slate-800 bg-white">
                <option value="HR & People">HR &amp; People</option><option value="Academic & Policies">Academic &amp; Policies</option><option value="IT & Security">IT &amp; Security</option><option value="Finance & Procurement">Finance &amp; Procurement</option><option value="Legal & Compliance">Legal &amp; Compliance</option><option value="Operations">Operations</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button type="submit" disabled={!selectedFile} className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /><span>Upload &amp; Vectorize</span></button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
