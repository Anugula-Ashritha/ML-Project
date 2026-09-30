## Current Status

### Completed
- FastAPI backend setup
- PDF upload
- PDF processing through ML/RAG pipeline
- Document listing
- FAISS-based retrieval
- Local Ollama LLM integration
- Question answering
- Source/page citations
- Report generation
- Report download
- CORS configuration
- API validation and error handling
- End-to-end testing with real PDF

### LLM
- Provider: Ollama
- Model: llama3.2:3b
- Runs locally
- No OpenAI API key required

### Backend API
- GET /health
- POST /upload
- GET /documents
- POST /chat
- POST /generate-report
- GET /reports/{report_id}/download

### Known MVP Limitations
- Documents are stored in memory for the document list.
- FAISS index is in memory and resets when the backend restarts.
- Uploaded PDFs need to be re-uploaded after a backend restart.
- Authentication/RBAC is not implemented in the MVP.