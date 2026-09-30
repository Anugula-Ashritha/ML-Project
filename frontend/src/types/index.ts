export type DepartmentCategory = 
  | 'HR & People'
  | 'Academic & Policies'
  | 'IT & Security'
  | 'Finance & Procurement'
  | 'Legal & Compliance'
  | 'Operations';

export interface DocumentChunk {
  id: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  tokenCount: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: string; // e.g. "2.4 MB"
  fileType: 'pdf' | 'docx' | 'txt' | 'csv' | 'md';
  category: DepartmentCategory;
  pageCount: number;
  chunkCount: number;
  uploadDate: string;
  uploadedBy: string;
  status: 'indexed' | 'processing' | 'error';
  summary: string;
  chunks?: DocumentChunk[];
}

export interface Citation {
  id: string;
  documentId: string;
  documentTitle: string;
  fileName: string;
  pageNumber: number;
  excerpt: string;
  relevanceScore: number; // 0.00 to 1.00
  category: DepartmentCategory;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  processingTimeMs?: number;
  scope?: string; // e.g. "All Documents" or specific doc title
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'Executive Summary' | 'Policy Audit' | 'Department Briefing' | 'Comparative Analysis';
  createdAt: string;
  author: string;
  sourceDocuments: string[]; // document titles or IDs
  summary: string;
  contentMarkdown: string;
  tags: string[];
  status: 'ready' | 'generating';
}

export interface DashboardStats {
  documentsCount: number;
  pagesIndexed: number;
  questionsAsked: number;
  reportsGenerated: number;
}

export interface RecentQuestion {
  id: string;
  question: string;
  timestamp: string;
  category: DepartmentCategory;
  citedDocumentCount: number;
  user: string;
}
