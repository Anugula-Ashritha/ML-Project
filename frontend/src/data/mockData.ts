import { DocumentItem, ReportItem, RecentQuestion, DashboardStats } from '../types';

export const INITIAL_STATS: DashboardStats = {
  documentsCount: 24,
  pagesIndexed: 1248,
  questionsAsked: 156,
  reportsGenerated: 12,
};

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    title: 'Employee & Faculty Handbook 2026',
    fileName: 'Employee_Faculty_Handbook_v4.pdf',
    fileSize: '3.8 MB',
    fileType: 'pdf',
    category: 'HR & People',
    pageCount: 48,
    chunkCount: 142,
    uploadDate: '2026-09-15',
    uploadedBy: 'Elena Rostova (HR Director)',
    status: 'indexed',
    summary: 'Comprehensive guide covering workplace conduct, leave policies, health insurance, remote work arrangements, and performance evaluation cycles.',
    chunks: [
      {
        id: 'chunk-01-1',
        pageNumber: 14,
        chunkIndex: 1,
        text: 'Section 4.2 - Remote Work Equipment Stipend: Full-time employees and academic staff are eligible for a one-time home office equipment stipend of up to $750 upon hire. Annual recurring allowances for high-speed internet and mobile connectivity are capped at $60 per month with manager approval.',
        tokenCount: 62,
      },
      {
        id: 'chunk-01-2',
        pageNumber: 22,
        chunkIndex: 2,
        text: 'Section 6.1 - Paid Time Off (PTO) Accrual: Professional staff accrue 1.67 days of PTO per calendar month (20 days annually). A maximum of 5 unused days may be rolled into the subsequent calendar year ending March 31st.',
        tokenCount: 54,
      },
      {
        id: 'chunk-01-3',
        pageNumber: 31,
        chunkIndex: 3,
        text: 'Section 8.4 - Parental and Family Leave: Primary caregivers receive 16 weeks of 100% paid leave following birth, adoption, or foster placement. Secondary caregivers receive 8 weeks of paid leave, which must be taken within 12 months.',
        tokenCount: 51,
      },
    ],
  },
  {
    id: 'doc-02',
    title: 'Enterprise IT Security, BYOD & Privacy Standard',
    fileName: 'IT_Security_BYOD_Policy_2026.pdf',
    fileSize: '2.1 MB',
    fileType: 'pdf',
    category: 'IT & Security',
    pageCount: 26,
    chunkCount: 84,
    uploadDate: '2026-09-18',
    uploadedBy: 'Marcus Vance (CISO Office)',
    status: 'indexed',
    summary: 'Security protocols including multi-factor authentication (MFA), password complexity, portable device encryption, endpoint management, and incident escalation.',
    chunks: [
      {
        id: 'chunk-02-1',
        pageNumber: 7,
        chunkIndex: 1,
        text: 'Section 3.1 - Multi-Factor Authentication (MFA): FIDO2 hardware keys or enterprise authenticator apps (TOTP with number matching) are mandatory for all systems accessing confidential records, student databases, and ERP portals. SMS-based 2FA is explicitly deprecated.',
        tokenCount: 48,
      },
      {
        id: 'chunk-02-2',
        pageNumber: 12,
        chunkIndex: 2,
        text: 'Section 4.3 - Bring Your Own Device (BYOD): Personal laptops and mobile phones connecting to the corporate network must install the enterprise MDM profile. Devices must enforce AES-256 bit encryption and auto-lock after 5 minutes of inactivity.',
        tokenCount: 47,
      },
      {
        id: 'chunk-02-3',
        pageNumber: 19,
        chunkIndex: 3,
        text: 'Section 7.2 - Incident Response Timeline: Any suspected data breach or compromised credential must be reported to security-ops@enterprise.org within 2 hours of discovery. Critical severity incidents initiate an immediate containment protocol.',
        tokenCount: 46,
      },
    ],
  },
  {
    id: 'doc-03',
    title: 'Travel, Entertainment & Expense Reimbursement Policy',
    fileName: 'Travel_Expense_Policy_Rev3.pdf',
    fileSize: '1.4 MB',
    fileType: 'pdf',
    category: 'Finance & Procurement',
    pageCount: 18,
    chunkCount: 56,
    uploadDate: '2026-09-20',
    uploadedBy: 'Sarah Lin (Finance Controller)',
    status: 'indexed',
    summary: 'Guidelines for domestic and international travel bookings, daily meal per diems, lodging caps, flight seat classes, and expense submission deadlines.',
    chunks: [
      {
        id: 'chunk-03-1',
        pageNumber: 5,
        chunkIndex: 1,
        text: 'Section 2.3 - Airfare Guidelines: Domestic commercial flights under 5 hours must be booked in Economy/Coach class. Non-stop flights exceeding 5 continuous hours or international long-haul flights qualify for Premium Economy upon VP-level pre-authorization.',
        tokenCount: 45,
      },
      {
        id: 'chunk-03-2',
        pageNumber: 8,
        chunkIndex: 2,
        text: 'Section 3.1 - Daily Meal Allowances (Per Diem): Domestic travel meal allowances follow standard GSA rates ($75/day baseline). Itemized receipts are mandatory for all single meal expenditures exceeding $25 or containing business guests.',
        tokenCount: 44,
      },
      {
        id: 'chunk-03-3',
        pageNumber: 14,
        chunkIndex: 3,
        text: 'Section 5.0 - Expense Submission Deadlines: All reimbursement claims must be filed through the Concur portal within 30 days of trip conclusion. Submissions exceeding 60 days require written CFO approval and may be treated as taxable income.',
        tokenCount: 49,
      },
    ],
  },
  {
    id: 'doc-04',
    title: 'Campus Academic Regulations & Degree Bylaws',
    fileName: 'Academic_Regulations_2025_2026.pdf',
    fileSize: '4.5 MB',
    fileType: 'pdf',
    category: 'Academic & Policies',
    pageCount: 64,
    chunkCount: 210,
    uploadDate: '2026-09-10',
    uploadedBy: 'Dr. Arthur Pendelton (Academic Senate)',
    status: 'indexed',
    summary: 'Governing statutes on grading scales, academic probation, credit requirements, thesis defense protocols, and formal grade dispute procedures.',
    chunks: [
      {
        id: 'chunk-04-1',
        pageNumber: 18,
        chunkIndex: 1,
        text: 'Article 12 - Grade Appeal Procedure: A student wishing to contest an assigned final grade must file a petition with the department chair within 15 calendar days of official grade publication. The committee conducts review hearings within 20 business days.',
        tokenCount: 50,
      },
      {
        id: 'chunk-04-2',
        pageNumber: 27,
        chunkIndex: 2,
        text: 'Article 19 - Undergraduate Capstone and Thesis Standards: All graduating seniors must complete a cumulative capstone project or thesis earning a minimum grade of B (3.0 GPA). Co-op internship alternatives require pre-approval from the curriculum director.',
        tokenCount: 49,
      },
      {
        id: 'chunk-04-3',
        pageNumber: 41,
        chunkIndex: 3,
        text: 'Article 33 - Academic Standing & Probation: Students whose cumulative GPA drops below 2.0 are placed on academic probation for one semester. Failure to reach 2.0 after two consecutive probation semesters leads to academic suspension.',
        tokenCount: 46,
      },
    ],
  },
  {
    id: 'doc-05',
    title: 'Procurement & Vendor Contract Guidelines',
    fileName: 'Procurement_Vendor_Matrix_2026.docx',
    fileSize: '890 KB',
    fileType: 'docx',
    category: 'Finance & Procurement',
    pageCount: 15,
    chunkCount: 48,
    uploadDate: '2026-09-22',
    uploadedBy: 'Sarah Lin (Finance Controller)',
    status: 'indexed',
    summary: 'Thresholds for sole-source purchasing, three-bid RFP competitive tenders, MSA contract review steps, and ESG vendor compliance.',
    chunks: [
      {
        id: 'chunk-05-1',
        pageNumber: 4,
        chunkIndex: 1,
        text: 'Clause 2.1 - Purchase Authorization Thresholds: Purchases under $5,000 require Department Head approval only. Purchases between $5,000 and $25,000 require three competitive bids. Purchases over $25,000 require formal RFP and Legal team contract sign-off.',
        tokenCount: 46,
      },
    ],
  },
  {
    id: 'doc-06',
    title: 'Campus Facilities, Lab Safety & Emergency Plan',
    fileName: 'Emergency_Action_Plan_Safety_v2.pdf',
    fileSize: '3.1 MB',
    fileType: 'pdf',
    category: 'Operations',
    pageCount: 34,
    chunkCount: 112,
    uploadDate: '2026-09-08',
    uploadedBy: 'Chief Walter Evans (Campus Safety)',
    status: 'indexed',
    summary: 'Evacuation maps, chemical hygiene in research laboratories, shelter-in-place instructions, and automated emergency notification channels.',
    chunks: [
      {
        id: 'chunk-06-1',
        pageNumber: 9,
        chunkIndex: 1,
        text: 'Protocol 3 - Chemical Hazard Spill Response: In the event of a hazardous spill exceeding 500 mL of Corrosive or Flammable liquid, activate the local pull station and isolate room ventilation immediately. Dial campus emergency line x4444.',
        tokenCount: 47,
      },
    ],
  },
];

export const INITIAL_RECENT_QUESTIONS: RecentQuestion[] = [
  {
    id: 'q-01',
    question: 'What is the equipment reimbursement cap for remote employees?',
    timestamp: '25 mins ago',
    category: 'HR & People',
    citedDocumentCount: 1,
    user: 'David Chen',
  },
  {
    id: 'q-02',
    question: 'How many days do students have to file an academic grade appeal?',
    timestamp: '2 hours ago',
    category: 'Academic & Policies',
    citedDocumentCount: 2,
    user: 'Prof. Miller',
  },
  {
    id: 'q-03',
    question: 'What are the required multi-factor authentication rules for BYOD devices?',
    timestamp: '4 hours ago',
    category: 'IT & Security',
    citedDocumentCount: 2,
    user: 'DevOps Lead',
  },
  {
    id: 'q-04',
    question: 'What is the threshold for requiring three bids in procurement?',
    timestamp: 'Yesterday',
    category: 'Finance & Procurement',
    citedDocumentCount: 1,
    user: 'Sarah Lin',
  },
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-01',
    title: 'Q3 Enterprise Policy Compliance & BYOD Risk Audit',
    type: 'Policy Audit',
    createdAt: '2026-09-24',
    author: 'Enterprise AI Assistant',
    sourceDocuments: [
      'Enterprise IT Security, BYOD & Privacy Standard',
      'Employee & Faculty Handbook 2026',
    ],
    summary: 'Comprehensive audit comparing remote work stipulations and BYOD device requirements against modern zero-trust standards.',
    tags: ['Security', 'Compliance', 'Remote Work', 'MFA'],
    status: 'ready',
    contentMarkdown: `# Q3 Enterprise Policy Compliance & BYOD Risk Audit

**Generated on:** September 24, 2026  
**Auditor:** Enterprise AI Knowledge & Workflow Assistant  
**Source Documents:**  
- Enterprise IT Security, BYOD & Privacy Standard (IT_Security_BYOD_Policy_2026.pdf)  
- Employee & Faculty Handbook 2026 (Employee_Faculty_Handbook_v4.pdf)

---

## 1. Executive Summary
This automated synthesis evaluates organizational policies governing endpoint security, employee remote work stipends, and mobile access controls. The audit verified strong alignment with FIDO2 MFA mandates, while highlighting minor variance in device encryption enforcement across personal hardware.

## 2. Key Findings & Document Evidence

### 2.1 Multi-Factor Authentication Compliance
- **Requirement:** Strict ban on legacy SMS-based 2FA; mandatory deployment of FIDO2 hardware keys or authenticator apps with number matching.
- **Citation:** *IT_Security_BYOD_Policy_2026.pdf (Page 7, Section 3.1)*
- **Status:** **Compliant**. All core ERP and academic portals require hardware or TOTP authentication.

### 2.2 Remote Work Equipment Subsidies
- **Requirement:** New hires are eligible for a one-time home office equipment stipend of up to $750. Monthly connectivity allowance capped at $60.
- **Citation:** *Employee_Faculty_Handbook_v4.pdf (Page 14, Section 4.2)*
- **Status:** **Active & Verified**. Clear budgetary limits are defined without ambiguity.

### 2.3 BYOD Endpoint Encryption & Lockout
- **Requirement:** Personal equipment must maintain AES-256 bit full disk encryption and 5-minute idle auto-locks when connected to the VPN.
- **Citation:** *IT_Security_BYOD_Policy_2026.pdf (Page 12, Section 4.3)*
- **Status:** **Attention Needed**. Continuous telemetry monitoring is recommended for non-managed Linux installations.

## 3. Strategic Recommendations
1. Conduct automated device posture checks before granting internal VPN sessions.
2. Align expense reimbursement portal validation directly with Section 4.2 stipend caps.
3. Schedule annual refresher training on rapid incident reporting within the 2-hour notification window.

---
*Report synthesized automatically from verified institutional records.*`,
  },
  {
    id: 'rep-02',
    title: 'Academic Grade Appeals & Standing Protocol Briefing',
    type: 'Department Briefing',
    createdAt: '2026-09-22',
    author: 'Enterprise AI Assistant',
    sourceDocuments: [
      'Campus Academic Regulations & Degree Bylaws',
    ],
    summary: 'Faculty reference sheet outlining the statutory 15-day student appeal window and probation progression metrics.',
    tags: ['Academic Senate', 'Grading', 'Student Regulations'],
    status: 'ready',
    contentMarkdown: `# Academic Grade Appeals & Standing Protocol Briefing

**Generated on:** September 22, 2026  
**Auditor:** Enterprise AI Knowledge & Workflow Assistant  
**Source Document:** Campus Academic Regulations & Degree Bylaws (Academic_Regulations_2025_2026.pdf)

---

## 1. Purpose & Scope
This briefing synthesizes the statutory rights, deadlines, and committee obligations governing academic disputes and GPA maintenance for the 2025-2026 academic calendar.

## 2. Key Procedural Milestones

| Stage | Responsible Party | Statutory Timeframe | Reference |
| :--- | :--- | :--- | :--- |
| Initial Grade Publication | Registrar | Day 0 | Article 11 |
| Petition Filing | Student | Within 15 calendar days | Article 12, p. 18 |
| Committee Hearing | Department Chair / Panel | Within 20 business days | Article 12, p. 18 |
| Final Binding Ruling | Academic Dean | Within 5 business days post-hearing | Article 13, p. 19 |

## 3. Probation & Suspension Criteria
Under Article 33 (p. 41), any student falling beneath the 2.0 GPA threshold enters mandatory probation for one term. A second consecutive term beneath 2.0 initiates immediate administrative suspension.

---
*Verified against institutional degree statutes.*`,
  },
  {
    id: 'rep-03',
    title: 'Procurement Thresholds & Competitive Bidding Matrix',
    type: 'Executive Summary',
    createdAt: '2026-09-19',
    author: 'Enterprise AI Assistant',
    sourceDocuments: [
      'Procurement & Vendor Contract Guidelines',
      'Travel, Entertainment & Expense Reimbursement Policy',
    ],
    summary: 'Clear reference chart of purchase dollar tiers, approval hierarchies, sole-source justification, and travel expense deadlines.',
    tags: ['Finance', 'Procurement', 'Audit', 'Vendor'],
    status: 'ready',
    contentMarkdown: `# Procurement Thresholds & Competitive Bidding Matrix

**Generated on:** September 19, 2026  
**Source Documents:**  
- Procurement & Vendor Contract Guidelines (Procurement_Vendor_Matrix_2026.docx)  
- Travel, Entertainment & Expense Reimbursement Policy (Travel_Expense_Policy_Rev3.pdf)

---

## 1. Procurement Approval Tiers
As outlined in Clause 2.1 (p. 4), all departmental purchases adhere to strict three-tier authorization:

- **Tier 1 (< $5,000):** Department Head approval only. Standard credit card or purchase requisition.
- **Tier 2 ($5,000 - $25,000):** Requires 3 documented competitive bids or an approved Sole-Source Exemption Form.
- **Tier 3 (> $25,000):** Formal RFP process with mandatory Legal Counsel review and CFO sign-off.

## 2. Expense Submission Deadlines
- Receipts mandatory for single items > $25.
- Submissions required within 30 days of expense.
- Claims > 60 days require CFO signature and become taxable.

---
*Authorized for internal enterprise dissemination.*`,
  },
];
