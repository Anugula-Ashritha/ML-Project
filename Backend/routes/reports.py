import os
import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from models.schemas import ReportRequest
from services.rag_service import generate_report
from services.report_store import add_report, get_reports, remove_report


router = APIRouter()

REPORT_DIR = "generated_reports"
os.makedirs(REPORT_DIR, exist_ok=True)


@router.post("/generate-report")
def create_report(request: ReportRequest):
    result = generate_report(request.topic)

    report_id = f"report_{uuid.uuid4().hex[:8]}"
    file_path = os.path.join(REPORT_DIR, f"{report_id}.txt")

    with open(file_path, "w", encoding="utf-8") as file:
        file.write(result["title"])
        file.write("\n")
        file.write("=" * len(result["title"]))
        file.write("\n\n")
        file.write(result["content"])
        file.write("\n\n")
        file.write("Sources\n")
        file.write("-------\n")

        for source in result["sources"]:
            file.write(
                f"{source['document']} - Page {source['page']}\n"
            )

    report = {
        "id": report_id,
        "title": result["title"],
        "content": result["content"],
        "sources": result["sources"],
        "created_at": datetime.now().isoformat(),
        "file_path": file_path
    }

    add_report(report)

    return {
        "success": True,
        "report": report,
        "download_url": f"/reports/{report_id}/download"
    }


@router.get("/reports")
def list_reports():
    return {
        "success": True,
        "reports": get_reports()
    }


@router.delete("/reports/{report_id}")
def delete_report(report_id: str):
    report = remove_report(report_id)

    if report is None:
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "error": {
                    "code": "REPORT_NOT_FOUND",
                    "message": "Report not found."
                }
            }
        )

    file_path = report.get("file_path")
    if file_path and os.path.exists(file_path):
        os.remove(file_path)

    return {"success": True, "message": "Report deleted."}


@router.get("/reports/{report_id}/download")
def download_report(report_id: str):
    file_path = os.path.join(REPORT_DIR, f"{report_id}.txt")

    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=404,
            detail={
                "success": False,
                "error": {
                    "code": "REPORT_NOT_FOUND",
                    "message": "Report not found."
                }
            }
        )

    return FileResponse(
        path=file_path,
        media_type="text/plain",
        filename=f"{report_id}.txt"
    )
