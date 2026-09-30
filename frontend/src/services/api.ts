import {
  DocumentItem,
  Citation,
  ReportItem,
  DashboardStats,
  RecentQuestion,
  DepartmentCategory,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || data?.detail?.error?.message || data?.detail || 'Request failed';
    throw new Error(typeof message === 'string' ? message : 'Request failed');
  }
  return data as T;
}

function mapDocument(raw: any): DocumentItem {
  return {
    id: raw.id,
    title: raw.title || raw.filename?.replace(/\.pdf$/i, '') || raw.filename || 'Untitled document',
    fileName: raw.filename || 'document.pdf',
    fileSize: raw.file_size || '—',
    fileType: 'pdf',
    category: (raw.category || 'Operations') as DepartmentCategory,
    pageCount: Number(raw.page_count ?? 0),
    chunkCount: Number(raw.chunk_count ?? 0),
    uploadDate: raw.upload_date || new Date().toISOString().slice(0, 10),
    uploadedBy: raw.uploaded_by || 'User',
    status: raw.status === 'error' ? 'error' : 'indexed',
    summary: raw.summary || `Indexed ${raw.chunk_count ?? 0} searchable chunks.`,
  };
}

function mapCitation(source: any, index: number): Citation {
  const fileName = source.document || 'document.pdf';
  return {
    id: `cit-${Date.now()}-${index}`,
    documentId: '',
    documentTitle: fileName.replace(/\.pdf$/i, ''),
    fileName,
    pageNumber: Number(source.page || 0),
    excerpt: source.excerpt || '',
    relevanceScore: Number(source.relevance_score ?? 0),
    category: 'Operations',
  };
}

export const api = {
  async getDashboardStats(): Promise<DashboardStats> {
    const docs = await this.getDocuments();
    return {
      documentsCount: docs.length,
      pagesIndexed: docs.reduce((sum, d) => sum + d.pageCount, 0),
      questionsAsked: 0,
      reportsGenerated: 0,
    };
  },

  async getDocuments(): Promise<DocumentItem[]> {
    const data = await request<any>('/documents');
    return (data.documents || []).map(mapDocument);
  },

  async uploadDocument(
    params: { file: File; title: string; category: DepartmentCategory },
    onProgress?: (step: string, progress: number) => void,
  ): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('title', params.title);
    formData.append('category', params.category);

    onProgress?.('Uploading PDF to server...', 25);
    const data = await request<any>('/upload', { method: 'POST', body: formData });
    onProgress?.('Processing document with ML/RAG pipeline...', 70);
    onProgress?.('Document indexed successfully.', 100);
    return mapDocument(data.document);
  },

  async deleteDocument(id: string): Promise<boolean> {
    await request(`/documents/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return true;
  },

  async getRecentQuestions(): Promise<RecentQuestion[]> {
    return [];
  },

  async queryAssistant(query: string, _scopeDocId?: string): Promise<{ answer: string; citations: Citation[]; processingTimeMs: number }> {
    const start = Date.now();
    const data = await request<any>('/chat', {
      method: 'POST',
      body: JSON.stringify({ question: query }),
    });
    return {
      answer: data.answer || '',
      citations: (data.sources || []).map(mapCitation),
      processingTimeMs: Date.now() - start,
    };
  },

  async getReports(): Promise<ReportItem[]> {
    const data = await request<any>('/reports');
    return (data.reports || []).map((report: any) => ({
      id: report.id,
      title: report.title,
      type: 'Executive Summary',
      createdAt: report.created_at || new Date().toISOString().slice(0, 10),
      author: 'Enterprise AI Assistant',
      sourceDocuments: (report.sources || []).map((s: any) => s.document),
      summary: (report.content || '').slice(0, 220),
      contentMarkdown: `# ${report.title}\n\n${report.content || ''}\n\n## Sources\n${(report.sources || []).map((s: any) => `- ${s.document} — Page ${s.page}`).join('\n')}`,
      tags: ['AI Generated'],
      status: 'ready',
    }));
  },

  async generateReport(params: { title: string; type: ReportItem['type']; sourceDocuments: string[]; focusTopic: string }): Promise<ReportItem> {
    const data = await request<any>('/generate-report', {
      method: 'POST',
      body: JSON.stringify({ topic: params.focusTopic || params.title }),
    });
    const report = data.report;
    return {
      id: report.id,
      title: report.title || params.title,
      type: params.type,
      createdAt: new Date().toISOString().slice(0, 10),
      author: 'Enterprise AI Assistant',
      sourceDocuments: (report.sources || []).map((s: any) => s.document),
      summary: (report.content || '').slice(0, 220),
      contentMarkdown: `# ${report.title || params.title}\n\n${report.content || ''}\n\n## Sources\n${(report.sources || []).map((s: any) => `- ${s.document} — Page ${s.page}`).join('\n')}`,
      tags: ['AI Generated', params.type],
      status: 'ready',
    };
  },

  async deleteReport(id: string): Promise<boolean> {
    await request(`/reports/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return true;
  },
};
