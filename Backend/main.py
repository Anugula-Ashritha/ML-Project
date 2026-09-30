from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from routes.upload import router as upload_router
from routes.documents import router as documents_router
from routes.chat import router as chat_router
from routes.reports import router as reports_router


app = FastAPI(
    title="Enterprise AI Knowledge and Workflow Assistant",
    description="Backend API for the Enterprise AI Knowledge and Workflow Assistant",
    version="0.1.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Invalid request data."
            }
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(
    request: Request,
    exc: Exception
):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred."
            }
        }
    )


@app.get("/health")
def health_check():
    return {
        "success": True,
        "message": "Backend is running"
    }


app.include_router(upload_router)
app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(reports_router)
