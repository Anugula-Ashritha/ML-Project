import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  Search,
  Filter,
  Bot,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { DepartmentCategory, DocumentItem } from '../types';

interface DocumentsViewProps {
  documents: DocumentItem[];
  onOpenUpload: () => void;
  onInspectDocument: (doc: DocumentItem) => void;
  onQueryWithDoc: (doc: DocumentItem) => void;
  onDeleteDocument: (docId: string) => void;
  globalSearch: string;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onOpenUpload,
  onInspectDocument,
  onQueryWithDoc,
  onDeleteDocument,
  globalSearch,
}) => {
  const [localSearch, setLocalSearch] = useState(globalSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'pages' | 'title'>('date');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'HR & People', label: 'HR & People' },
    { id: 'Academic & Policies', label: 'Academic & Policies' },
    { id: 'IT & Security', label: 'IT & Security' },
    { id: 'Finance & Procurement', label: 'Finance & Procurement' },
    { id: 'Operations', label: 'Operations' },
  ];

  const filteredDocuments = documents
    .filter((doc) => {
      const matchSearch =
        localSearch.trim() === '' ||
        doc.title.toLowerCase().includes(localSearch.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(localSearch.toLowerCase()) ||
        doc.summary.toLowerCase().includes(localSearch.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || doc.category === selectedCategory;

      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      if (sortBy === 'pages') {
        return b.pageCount - a.pageCount;
      }
      return a.title.localeCompare(b.title);
    });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}" from the knowledge base?`)) {
      onDeleteDocument(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, inspect, and vectorize institutional knowledge files.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by document title, keywords, or file name..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg outline-none transition-colors text-slate-800"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white text-slate-700 outline-none"
            >
              <option value="date">Upload Date</option>
              <option value="pages">Page Count</option>
              <option value="title">Document Title</option>
            </select>
          </div>
        </div>

        {/* Category Filter Buttons (Functional Segmented Control) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 bg-slate-100/80 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents Table / Catalog */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Document Title &amp; File</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Pages &amp; Chunks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Upload Info</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => onInspectDocument(doc)}
                            className="font-medium text-slate-900 hover:text-blue-600 transition-colors text-left block truncate max-w-sm"
                          >
                            {doc.title}
                          </button>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {doc.fileName} · {doc.fileSize}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department / Category */}
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {doc.category}
                    </td>

                    {/* Pages & Chunks */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800 font-medium">{doc.pageCount} pages</div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-400" />
                        {doc.chunkCount} vector chunks
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {doc.status === 'indexed' ? (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Indexed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing</span>
                        </div>
                      )}
                    </td>

                    {/* Upload Info */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700">{doc.uploadDate}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {doc.uploadedBy}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onInspectDocument(doc)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                          title="Inspect Chunks"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onQueryWithDoc(doc)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          title="Ask AI with this document"
                        >
                          <Bot className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <div className="text-sm font-medium text-slate-700">No documents found</div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try adjusting your search terms or upload a new document.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
