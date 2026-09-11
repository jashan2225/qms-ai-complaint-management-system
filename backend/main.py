from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
from pypdf import PdfReader
import io

from graph import complaint_graph, correct_complaint
from database import SessionLocal
from models import Complaint


app = FastAPI(
    title="QMS AI Complaint Management System",
    description="AI-powered pharmaceutical customer complaint management API",
    version="1.0.0",
)


# -----------------------------
# CORS
# -----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# REQUEST MODELS
# -----------------------------

class ComplaintRequest(BaseModel):
    complaint: str


class ComplaintCorrectionRequest(BaseModel):
    correction: str
    current_data: Dict[str, str]


class ComplaintSaveRequest(BaseModel):
    complaint_source: str = ""
    customer_name: str = ""
    product_name: str = ""
    product_strength: str = ""
    batch_number: str = ""
    affected_quantity: str = ""
    manufacturing_date: str = ""
    expiry_date: str = ""
    originating_site_block: str = ""
    impacted_npm: str = ""
    complaint_category: str = ""
    complaint_description: str = ""
    severity: str = ""
    suggested_action: str = ""
    risk_assessment: str = ""
    status: str = "Pending Triage"


# -----------------------------
# ROOT
# -----------------------------

@app.get("/")
def root():
    return {
        "message": "QMS AI Complaint Management API is running"
    }


# -----------------------------
# TEXT COMPLAINT ANALYSIS
# -----------------------------

@app.post("/complaints/analyze")
def analyze_complaint(request: ComplaintRequest):

    try:
        result = complaint_graph.invoke({
            "complaint": request.complaint,

            "complaint_source": "",
            "customer_name": "",
            "product_name": "",
            "product_strength": "",
            "batch_number": "",
            "affected_quantity": "",
            "manufacturing_date": "",
            "expiry_date": "",
            "originating_site_block": "",
            "impacted_npm": "",
            "complaint_category": "",
            "complaint_description": "",

            "severity": "",
            "suggested_action": "",
            "risk_assessment": "",
        })

        return result

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# -----------------------------
# PDF UPLOAD
# -----------------------------

@app.post("/complaints/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    try:
        file_bytes = await file.read()

        pdf_file = io.BytesIO(file_bytes)

        reader = PdfReader(pdf_file)

        extracted_text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                extracted_text += page_text + "\n"

        if not extracted_text.strip():
            raise HTTPException(
                status_code=400,
                detail="No readable text found in the PDF."
            )

        return {
            "filename": file.filename,
            "extracted_text": extracted_text.strip()
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process PDF: {str(error)}"
        )


# -----------------------------
# CONVERSATIONAL CORRECTION
# -----------------------------

@app.post("/complaints/correct")
def correct_complaint_endpoint(
    request: ComplaintCorrectionRequest
):

    try:

        corrected_data = correct_complaint(
            request.current_data,
            request.correction
        )

        result = {
            **request.current_data,
            **corrected_data,
        }

        return result

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


# -----------------------------
# SAVE COMPLAINT
# -----------------------------

@app.post("/complaints/save")
def save_complaint(request: ComplaintSaveRequest):

    db = SessionLocal()

    try:

        complaint = Complaint(
            complaint_source=request.complaint_source,
            customer_name=request.customer_name,
            product_name=request.product_name,
            product_strength=request.product_strength,
            batch_number=request.batch_number,
            affected_quantity=request.affected_quantity,
            manufacturing_date=request.manufacturing_date,
            expiry_date=request.expiry_date,
            originating_site_block=request.originating_site_block,
            impacted_npm=request.impacted_npm,
            complaint_category=request.complaint_category,
            complaint_description=request.complaint_description,
            severity=request.severity,
            suggested_action=request.suggested_action,
            risk_assessment=request.risk_assessment,
            status=request.status,
        )

        db.add(complaint)
        db.commit()
        db.refresh(complaint)

        return {
            "message": "Complaint saved successfully",
            "complaint_id": complaint.id
        }

    except Exception as error:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save complaint: {str(error)}"
        )

    finally:
        db.close()


@app.get("/complaints")
def get_complaints():
    db = SessionLocal()

    try:
        complaints = (
            db.query(Complaint)
            .order_by(Complaint.id.desc())
            .all()
        )

        return [
            {
                "id": complaint.id,
                "complaint_source": complaint.complaint_source,
                "customer_name": complaint.customer_name,
                "product_name": complaint.product_name,
                "product_strength": complaint.product_strength,
                "batch_number": complaint.batch_number,
                "affected_quantity": complaint.affected_quantity,
                "manufacturing_date": complaint.manufacturing_date,
                "expiry_date": complaint.expiry_date,
                "originating_site_block": complaint.originating_site_block,
                "impacted_npm": complaint.impacted_npm,
                "complaint_category": complaint.complaint_category,
                "complaint_description": complaint.complaint_description,
                "severity": complaint.severity,
                "suggested_action": complaint.suggested_action,
                "risk_assessment": complaint.risk_assessment,
                "status": complaint.status,
                "created_at": complaint.created_at,
            }
            for complaint in complaints
        ]

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch complaints: {str(error)}"
        )

    finally:
        db.close()
