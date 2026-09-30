/**
 * Mock API Service Layer for Enterprise AI Knowledge & Workflow Assistant
 * 
 * Note for FastAPI backend integration:
 * This module is structured to match standard REST and RAG endpoints:
 * - GET  /api/v1/stats              -> getDashboardStats()
 * - GET  /api/v1/documents          -> getDocuments()
 * - POST /api/v1/documents/upload   -> uploadDocument()
 * - DELETE /api/v1/documents/{id}   -> deleteDocument()
 * - POST /api/v1/assistant/query    -> queryAssistant()
 * - GET  /api/v1/reports            -> getReports()
 * - POST /api/v1/reports/generate   -> generateReport()
 * - DELETE /api/v1/reports/{id}     -> deleteReport()
 */

import {
  DocumentItem,
  DocumentChunk,
  Citation,
  ChatMessage,
  ReportItem,
  DashboardStats,
  RecentQuestion,
  DepartmentCategory,
} from '../types';
import {
  INITIAL_DOCUMENTS,
  INITIAL_REPORTS,
  INITIAL_RECENT_QUESTIONS,
  INITIAL_STATS,
} from '../data/mockData';

// In-memory state with localStorage fallback for persistent session state
const STORAGE_KEYS = {
  DOCUMENTS: 'enterprise_ai_documents_v1',
  REPORTS: 'enterprise_ai_reports_v1',
  STATS: 'enterprise_ai_stats_v1',
  QUESTIONS: 'enterprise_ai_questions_v1',
};

function loadStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// Initial state
let currentDocuments: DocumentItem[] = loadStored(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
let currentReports: ReportItem[] = loadStored(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
let currentStats: DashboardStats = loadStored(STORAGE_KEYS.STATS, INITIAL_STATS);
let currentQuestions: RecentQuestion[] = loadStored(STORAGE_KEYS.QUESTIONS, INITIAL_RECENT_QUESTIONS);

// Simulate network latency (200ms - 500ms)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  /**
   * GET /api/v1/stats
   * Retrieves high-level knowledge base metrics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(180);
    return {
      documentsCount: currentDocuments.length,
      pagesIndexed: currentDocuments.reduce((acc, doc) => acc + doc.pageCount, 0),
      questionsAsked: currentStats.questionsAsked,
      reportsGenerated: currentReports.length,
    };
  },

  /**
   * GET /api/v1/documents
   * Returns all indexed and processing documents
   */
  async getDocuments(): Promise<DocumentItem[]> {
    await delay(220);
    return [...currentDocuments];
  },

  /**
   * POST /api/v1/documents/upload
   * Simulates file processing, text extraction, chunking, and vector indexing
   */
  async uploadDocument(
    params: {
      title: string;
      fileName: string;
      fileSize: string;
      fileType: 'pdf' | 'docx' | 'txt' | 'csv' | 'md';
      category: DepartmentCategory;
      pageCount?: number;
      customContent?: string;
    },
    onProgress?: (step: string, progress: number) => void
  ): Promise<DocumentItem> {
    const pages = params.pageCount || Math.floor(Math.random() * 25) + 6;
    const estimatedChunks = Math.max(pages * 3, 12);

    if (onProgress) {
      onProgress('Uploading file to server...', 25);
      await delay(300);
      onProgress('Extracting raw text & parsing structure...', 55);
      await delay(350);
      onProgress(`Chunking text into ${estimatedChunks} semantic vectors...`, 80);
      await delay(350);
      onProgress('Generating embeddings & updating index...', 100);
      await delay(250);
    } else {
      await delay(800);
    }

    const generatedChunks: DocumentChunk[] = [
      {
        id: `chunk-${Date.now()}-1`,
        pageNumber: 1,
        chunkIndex: 1,
        text: `Overview and scope of ${params.title}. This verified institutional document provides operational directives, regulatory compliance checks, and departmental workflows established for 2026.`,
        tokenCount: 42,
      },
      {
        id: `chunk-${Date.now()}-2`,
        pageNumber: Math.min(3, pages),
        chunkIndex: 2,
        text: `Section 2 - Core Responsibilities & Standards: All authorized personnel must review protocol requirements annually. Approvals must be submitted through the enterprise portal with verification.`,
        tokenCount: 38,
      },
      {
        id: `chunk-${Date.now()}-3`,
        pageNumber: Math.min(7, pages),
        chunkIndex: 3,
        text: `Section 5 - Enforcement and Verification: Non-compliance or deviation from documented standards requires immediate escalation to department heads within 48 business hours.`,
        tokenCount: 40,
      },
    ];

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: params.title,
      fileName: params.fileName,
      fileSize: params.fileSize,
      fileType: params.fileType,
      category: params.category,
      pageCount: pages,
      chunkCount: estimatedChunks,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Demo User (College Project)',
      status: 'indexed',
      summary: `Recently indexed document containing ${pages} pages and ${estimatedChunks} searchable vector chunks. Ready for semantic RAG Q&A and reports.`,
      chunks: generatedChunks,
    };

    currentDocuments = [newDoc, ...currentDocuments];
    saveStored(STORAGE_KEYS.DOCUMENTS, currentDocuments);

    currentStats.documentsCount = currentDocuments.length;
    currentStats.pagesIndexed = currentDocuments.reduce((a, b) => a + b.pageCount, 0);
    saveStored(STORAGE_KEYS.STATS, currentStats);

    return newDoc;
  },

  /**
   * DELETE /api/v1/documents/{id}
   */
  async deleteDocument(id: string): Promise<boolean> {
    await delay(200);
    currentDocuments = currentDocuments.filter((d) => d.id !== id);
    saveStored(STORAGE_KEYS.DOCUMENTS, currentDocuments);
    return true;
  },

  /**
   * GET /api/v1/questions/recent
   */
  async getRecentQuestions(): Promise<RecentQuestion[]> {
    await delay(150);
    return [...currentQuestions];
  },

  /**
   * POST /api/v1/assistant/query
   * Semantic search + RAG generation simulation
   */
  async queryAssistant(query: string, scopeDocId?: string): Promise<{
    answer: string;
    citations: Citation[];
    processingTimeMs: number;
  }> {
    const startTime = Date.now();
    await delay(600); // realistic RAG latency

    const lowerQuery = query.toLowerCase();
    const citations: Citation[] = [];
    let answerText = '';

    // Smart semantic keyword matching against indexed documents & chunks
    if (lowerQuery.includes('remote') || lowerQuery.includes('stipend') || lowerQuery.includes('equipment') || lowerQuery.includes('home office')) {
      const handbook = currentDocuments.find((d) => d.title.includes('Handbook')) || currentDocuments[0];
      citations.push({
        id: 'cit-1',
        documentId: handbook.id,
        documentTitle: handbook.title,
        fileName: handbook.fileName,
        pageNumber: 14,
        excerpt: 'Section 4.2 - Remote Work Equipment Stipend: Full-time employees and academic staff are eligible for a one-time home office equipment stipend of up to $750 upon hire. Annual recurring allowances for high-speed internet and mobile connectivity are capped at $60 per month with manager approval.',
        relevanceScore: 0.94,
        category: 'HR & People',
      });
      answerText = `According to the **${handbook.title}**, employees receive the following remote work support:

1. **One-Time Equipment Stipend:** Eligible full-time staff can claim up to **$750** upon hire for home workstation hardware (monitors, ergonomic chairs, docking stations).
2. **Monthly Connectivity Allowance:** Up to **$60/month** is reimbursed for high-speed home internet and mobile data, subject to manager pre-authorization.
3. **Reimbursement Method:** Claims must be submitted via the expense portal within 30 days of purchase along with itemized receipts.`;
    } else if (lowerQuery.includes('mfa') || lowerQuery.includes('password') || lowerQuery.includes('byod') || lowerQuery.includes('security') || lowerQuery.includes('authenticat')) {
      const itDoc = currentDocuments.find((d) => d.title.includes('Security')) || currentDocuments[1];
      citations.push(
        {
          id: 'cit-2',
          documentId: itDoc.id,
          documentTitle: itDoc.title,
          fileName: itDoc.fileName,
          pageNumber: 7,
          excerpt: 'Section 3.1 - Multi-Factor Authentication (MFA): FIDO2 hardware keys or enterprise authenticator apps (TOTP with number matching) are mandatory for all systems accessing confidential records, student databases, and ERP portals. SMS-based 2FA is explicitly deprecated.',
          relevanceScore: 0.96,
          category: 'IT & Security',
        },
        {
          id: 'cit-3',
          documentId: itDoc.id,
          documentTitle: itDoc.title,
          fileName: itDoc.fileName,
          pageNumber: 12,
          excerpt: 'Section 4.3 - Bring Your Own Device (BYOD): Personal laptops and mobile phones connecting to the corporate network must install the enterprise MDM profile. Devices must enforce AES-256 bit encryption and auto-lock after 5 minutes of inactivity.',
          relevanceScore: 0.91,
          category: 'IT & Security',
        }
      );
      answerText = `Based on the **${itDoc.title}**, the organization strictly enforces these security requirements:

- **Mandatory MFA Methods:** Systems holding confidential records require **FIDO2 hardware security keys** or enterprise authenticator applications with numeric matching. **SMS 2-Factor Authentication is officially deprecated** due to SIM-swap vulnerabilities.
- **BYOD Device Safeguards:** Any personal device accessing internal networks or emails must install the enterprise MDM profile.
- **Storage & Auto-lock:** Laptops must have **AES-256 bit full disk encryption** turned on and screen lock configured to trigger after **5 minutes of inactivity**.`;
    } else if (lowerQuery.includes('travel') || lowerQuery.includes('flight') || lowerQuery.includes('meal') || lowerQuery.includes('per diem') || lowerQuery.includes('concur')) {
      const travelDoc = currentDocuments.find((d) => d.title.includes('Travel')) || currentDocuments[2];
      citations.push(
        {
          id: 'cit-4',
          documentId: travelDoc.id,
          documentTitle: travelDoc.title,
          fileName: travelDoc.fileName,
          pageNumber: 5,
          excerpt: 'Section 2.3 - Airfare Guidelines: Domestic commercial flights under 5 hours must be booked in Economy/Coach class. Non-stop flights exceeding 5 continuous hours or international long-haul flights qualify for Premium Economy upon VP-level pre-authorization.',
          relevanceScore: 0.93,
          category: 'Finance & Procurement',
        },
        {
          id: 'cit-5',
          documentId: travelDoc.id,
          documentTitle: travelDoc.title,
          fileName: travelDoc.fileName,
          pageNumber: 8,
          excerpt: 'Section 3.1 - Daily Meal Allowances (Per Diem): Domestic travel meal allowances follow standard GSA rates ($75/day baseline). Itemized receipts are mandatory for all single meal expenditures exceeding $25 or containing business guests.',
          relevanceScore: 0.89,
          category: 'Finance & Procurement',
        }
      );
      answerText = `Under the **${travelDoc.title}**, travel and reimbursement rules are defined as follows:

- **Flight Bookings:** Domestic flights under 5 hours must be standard Economy. Premium Economy is allowable for non-stop flights over 5 hours or international itineraries with VP authorization.
- **Meal Per Diem:** Daily meals follow standard GSA per diem allowances (**$75/day baseline**).
- **Receipts:** Mandatory for any single meal expense exceeding **$25**.
- **Filing Window:** All expense claims must be submitted in the Concur portal within **30 days** of trip completion.`;
    } else if (lowerQuery.includes('grade') || lowerQuery.includes('appeal') || lowerQuery.includes('probation') || lowerQuery.includes('thesis') || lowerQuery.includes('capstone')) {
      const academicDoc = currentDocuments.find((d) => d.title.includes('Academic')) || currentDocuments[3];
      citations.push(
        {
          id: 'cit-6',
          documentId: academicDoc.id,
          documentTitle: academicDoc.title,
          fileName: academicDoc.fileName,
          pageNumber: 18,
          excerpt: 'Article 12 - Grade Appeal Procedure: A student wishing to contest an assigned final grade must file a petition with the department chair within 15 calendar days of official grade publication. The committee conducts review hearings within 20 business days.',
          relevanceScore: 0.95,
          category: 'Academic & Policies',
        },
        {
          id: 'cit-7',
          documentId: academicDoc.id,
          documentTitle: academicDoc.title,
          fileName: academicDoc.fileName,
          pageNumber: 41,
          excerpt: 'Article 33 - Academic Standing & Probation: Students whose cumulative GPA drops below 2.0 are placed on academic probation for one semester. Failure to reach 2.0 after two consecutive probation semesters leads to academic suspension.',
          relevanceScore: 0.88,
          category: 'Academic & Policies',
        }
      );
      answerText = `In accordance with the **${academicDoc.title}**:

- **Filing Deadline:** A student contesting a final semester grade must file a formal petition with the Department Chair within **15 calendar days** of official grade publication.
- **Hearing Timeline:** The review committee must convene hearings and issue preliminary findings within **20 business days** of petition filing.
- **Academic Standing Rules:** If a student's cumulative GPA drops below **2.0**, they are placed on probation for one semester. Failing to recover a 2.0 GPA after two consecutive probation terms results in academic suspension.`;
    } else if (lowerQuery.includes('bid') || lowerQuery.includes('procurement') || lowerQuery.includes('vendor') || lowerQuery.includes('rfp') || lowerQuery.includes('purchase')) {
      const procDoc = currentDocuments.find((d) => d.title.includes('Procurement')) || currentDocuments[4];
      citations.push({
        id: 'cit-8',
        documentId: procDoc.id,
        documentTitle: procDoc.title,
        fileName: procDoc.fileName,
        pageNumber: 4,
        excerpt: 'Clause 2.1 - Purchase Authorization Thresholds: Purchases under $5,000 require Department Head approval only. Purchases between $5,000 and $25,000 require three competitive bids. Purchases over $25,000 require formal RFP and Legal team contract sign-off.',
        relevanceScore: 0.97,
        category: 'Finance & Procurement',
      });
      answerText = `Per the **${procDoc.title}**, purchasing authorization follows these defined thresholds:

- **Tier 1 (< $5,000):** Requires direct Department Head approval. Standard P-Card or direct invoice.
- **Tier 2 ($5,000 – $25,000):** Requires documentation of **three (3) competitive vendor bids** or an authorized Sole Source Justification form.
- **Tier 3 (> $25,000):** Mandatory formal RFP competitive process with Procurement Director sign-off and Legal Counsel contract review.`;
    } else {
      // General grounded answer synthesis across available documents
      const primaryDoc = scopeDocId 
        ? currentDocuments.find(d => d.id === scopeDocId) || currentDocuments[0]
        : currentDocuments[0];

      citations.push({
        id: `cit-${Date.now()}`,
        documentId: primaryDoc.id,
        documentTitle: primaryDoc.title,
        fileName: primaryDoc.fileName,
        pageNumber: 3,
        excerpt: primaryDoc.chunks?.[0]?.text || `Institutional standard documentation regarding ${primaryDoc.title}. Outlines governance protocols, operational directives, and compliance compliance schedules for academic and enterprise staff.`,
        relevanceScore: 0.87,
        category: primaryDoc.category,
      });

      answerText = `Based on an index search across **${scopeDocId ? primaryDoc.title : `${currentDocuments.length} organizational documents`}**:

Regarding your query: *"${query}"*

1. **Policy Alignment:** The relevant provisions are outlined in **${primaryDoc.title}**. Operational units must adhere to established departmental guidelines and obtain prerequisite supervisory sign-offs.
2. **Procedure:** In accordance with institutional documentation, requests and compliance disclosures are recorded through the enterprise portal.
3. **Escalation Path:** For special exceptions or inter-departmental inquiries, consult your designated department coordinator or reference the specific sections cited below.`;
    }

    // Update stats & recent questions
    currentStats.questionsAsked += 1;
    saveStored(STORAGE_KEYS.STATS, currentStats);

    const newQuestionRecord: RecentQuestion = {
      id: `q-${Date.now()}`,
      question: query,
      timestamp: 'Just now',
      category: citations[0]?.category || 'Operations',
      citedDocumentCount: citations.length,
      user: 'Demo User',
    };
    currentQuestions = [newQuestionRecord, ...currentQuestions.slice(0, 9)];
    saveStored(STORAGE_KEYS.QUESTIONS, currentQuestions);

    const processingTimeMs = Date.now() - startTime;
    return {
      answer: answerText,
      citations,
      processingTimeMs,
    };
  },

  /**
   * GET /api/v1/reports
   */
  async getReports(): Promise<ReportItem[]> {
    await delay(200);
    return [...currentReports];
  },

  /**
   * POST /api/v1/reports/generate
   */
  async generateReport(params: {
    title: string;
    type: 'Executive Summary' | 'Policy Audit' | 'Department Briefing' | 'Comparative Analysis';
    sourceDocuments: string[];
    focusTopic: string;
  }): Promise<ReportItem> {
    await delay(900); // synthesis simulation

    const generatedMarkdown = `# ${params.title}

**Generated on:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}  
**Report Type:** ${params.type}  
**Synthesized By:** Enterprise AI Knowledge & Workflow Assistant  
**Source Documents:**  
${params.sourceDocuments.map((doc) => `- ${doc}`).join('\n')}

---

## 1. Executive Summary & Objective
This report synthesizes knowledge and directives regarding **"${params.focusTopic || params.title}"** across ${params.sourceDocuments.length} verified organizational repositories. The objective is to provide actionable intelligence and clear compliance pathways for department stakeholders.

## 2. Synthesized Policy Directives
- **Governance & Accountability:** Requirements derived from ${params.sourceDocuments[0] || 'primary records'} enforce strict audit trails and regular compliance reviews.
- **Workflow Optimization:** Cross-referencing institutional documentation indicates potential time savings by consolidating redundant review checkpoints into standardized digital workflows.
- **Risk Mitigation:** Clear escalation windows (e.g., standard 15-day appeal windows and 2-hour incident notifications) safeguard operational continuity.

## 3. Verified Evidence & References
| Metric / Standard | Regulatory Source | Impact Level |
| :--- | :--- | :--- |
| Core Operational Mandate | ${params.sourceDocuments[0] || 'Handbook Standard'} | High |
| Cross-Departmental Coordination | ${params.sourceDocuments[1] || 'Institutional Guidelines'} | Medium |
| Compliance Validation | Internal Enterprise Policy Matrix | High |

## 4. Key Recommendations
1. Establish automated notification reminders prior to statutory deadlines.
2. Maintain indexed documentation updates as new directives or policy amendments are ratified.
3. Conduct quarterly review sessions with designated department leads.

---
*Generated automatically by Enterprise AI Knowledge Assistant.*`;

    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      title: params.title,
      type: params.type,
      createdAt: new Date().toISOString().split('T')[0],
      author: 'Enterprise AI Assistant',
      sourceDocuments: params.sourceDocuments,
      summary: `Automated ${params.type} analyzing ${params.focusTopic || params.title} with verified citations from ${params.sourceDocuments.length} source document(s).`,
      tags: ['Automated', params.type.split(' ')[0], 'Enterprise'],
      status: 'ready',
      contentMarkdown: generatedMarkdown,
    };

    currentReports = [newReport, ...currentReports];
    saveStored(STORAGE_KEYS.REPORTS, currentReports);

    currentStats.reportsGenerated = currentReports.length;
    saveStored(STORAGE_KEYS.STATS, currentStats);

    return newReport;
  },

  /**
   * DELETE /api/v1/reports/{id}
   */
  async deleteReport(id: string): Promise<boolean> {
    await delay(180);
    currentReports = currentReports.filter((r) => r.id !== id);
    saveStored(STORAGE_KEYS.REPORTS, currentReports);
    return true;
  },
};
