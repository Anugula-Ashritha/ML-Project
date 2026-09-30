## Current Status

### Completed
- FastAPI backend setup
- PDF upload
- PDF processing through ML/RAG pipeline
- Multi-document in-memory knowledge base
- FAISS-based semantic retrieval
- Normalized embeddings with cosine-similarity search
- Local Ollama LLM integration
- Question answering
- Source/page citations
- Relevance scores returned to the frontend
- Original PDF filenames preserved in citations
- Report generation
- Report download
- Report listing
- Report deletion
- Document metadata storage
- Frontend/backend CORS alignment for port 3000
- Upload title/category metadata handling
- Backend Ollama dependency alignment
- Frontend esbuild dependency alignment
- API validation and error handling

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
- GET /reports
- POST /generate-report
- DELETE /reports/{report_id}
- GET /reports/{report_id}/download

### RAG Fixes
- Embeddings are normalized before indexing and querying.
- FAISS now uses inner-product search for cosine similarity.
- Chat/report retrieval uses up to 5 relevant chunks.
- Ollama prompt now handles briefing/summary questions more reliably.
- Citation payloads include relevance_score.
- Uploaded PDF citations use the original filename.

### Known MVP Limitations
- Document metadata is stored in memory.
- Report metadata is stored in memory.
- FAISS index is in memory and resets when the backend restarts.
- Uploaded PDFs need to be re-uploaded after a backend restart.
- Authentication/RBAC is not implemented in the MVP.
