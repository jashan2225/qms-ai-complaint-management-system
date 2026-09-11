import os

from typing import TypedDict, Literal

from dotenv import load_dotenv
from pydantic import BaseModel, Field

from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END


load_dotenv()


# -----------------------------
# AI extraction structure
# -----------------------------
class ComplaintExtraction(BaseModel):
    complaint_source: str = Field(
        description="Source of the complaint, such as Pharmacy, Hospital, Customer, Distributor, or Other"
    )
    customer_name: str = Field(
        description="Name of the customer or organization reporting the complaint"
    )
    product_name: str = Field(
        description="Name of the pharmaceutical product"
    )
    product_strength: str = Field(
        description="Product strength if provided"
    )
    batch_number: str = Field(
        description="Batch or lot number if provided"
    )
    affected_quantity: str = Field(
        description="Quantity of product affected"
    )
    manufacturing_date: str = Field(
        description="Manufacturing date if provided"
    )
    expiry_date: str = Field(
        description="Expiry date if provided"
    )
    originating_site_block: str = Field(
        description="Originating site block or area involved, such as Manufacturing, Packaging, Warehouse, or Other"
    )
    impacted_npm: str = Field(
        description="Impacted non-product material such as Primary Packaging, Secondary Packaging, Label, or Other"
    )
    complaint_category: str = Field(
        description="Complaint category based on the complaint, such as Product Defect - Discoloration, Foreign Matter, Packaging Defect, etc."
    )
    complaint_description: str = Field(
        description="Concise description of the customer's complaint"
    )


# -----------------------------
# AI risk assessment structure
# -----------------------------
class RiskAssessment(BaseModel):
    severity: Literal["Minor", "Major", "Critical"] = Field(
        description="Complaint severity"
    )
    suggested_action: str = Field(
        description="Practical next action for the QA team"
    )
    risk_assessment: str = Field(
        description="Short explanation for the severity and suggested action"
    )


# -----------------------------
# AI complaint summary structure
# -----------------------------
class ComplaintSummary(BaseModel):
    summary: str = Field(
        description="A concise professional summary of the customer complaint"
    )


# -----------------------------
# AI correction structure
# -----------------------------
class ComplaintCorrection(BaseModel):
    complaint_source: str
    customer_name: str
    product_name: str
    product_strength: str
    batch_number: str
    affected_quantity: str
    manufacturing_date: str
    expiry_date: str
    originating_site_block: str
    impacted_npm: str
    complaint_category: str
    complaint_description: str


# -----------------------------
# LangGraph state
# -----------------------------
class ComplaintState(TypedDict):
    complaint: str

    complaint_source: str
    customer_name: str
    product_name: str
    product_strength: str
    batch_number: str
    affected_quantity: str
    manufacturing_date: str
    expiry_date: str
    originating_site_block: str
    impacted_npm: str
    complaint_category: str
    complaint_description: str

    severity: str
    suggested_action: str
    risk_assessment: str

    complaint_summary: str


# -----------------------------
# Groq LLM
# -----------------------------
llm = ChatGroq(
    model=os.getenv("MODEL_NAME", "openai/gpt-oss-20b"),
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY"),
)


# -----------------------------
# Structured output for complaint extraction
# -----------------------------
structured_llm = llm.with_structured_output(
    ComplaintExtraction,
    method="json_schema",
    strict=True,
)


# -----------------------------
# Structured output for risk assessment
# -----------------------------
risk_llm = llm.with_structured_output(
    RiskAssessment,
    method="json_schema",
    strict=True,
)


# -----------------------------
# Structured output for complaint summary
# -----------------------------
summary_llm = llm.with_structured_output(
    ComplaintSummary,
    method="json_schema",
    strict=True,
)


# -----------------------------
# Structured output for corrections
# -----------------------------
correction_llm = llm.with_structured_output(
    ComplaintCorrection,
    method="json_schema",
    strict=True,
)


# -----------------------------
# Node 1: Extract complaint
# -----------------------------
def process_complaint(state: ComplaintState):
    complaint = state["complaint"]

    response = structured_llm.invoke(
        f"""
You are an AI assistant for a pharmaceutical
Customer Complaint Management System.

Analyze the customer complaint below and extract
the required information.

Rules:

1. Extract information only from the complaint.

2. Do not invent information.

3. If a field is not provided, return "Not Provided".

4. Classify the complaint category based on the
actual complaint.

5. Complaint source should identify where the complaint
came from, such as Pharmacy, Hospital, Customer,
Distributor, etc.

6. Originating site block should identify the likely
business area mentioned or clearly implied by the complaint.
If it cannot be determined, return "Not Provided".

7. Impacted NPM means non-product material involved
in the complaint, such as packaging or labeling.
If not provided, return "Not Provided".

8. Keep the complaint description concise.

Customer complaint:

{complaint}
"""
    )

    return {
        "complaint_source": response.complaint_source,
        "customer_name": response.customer_name,
        "product_name": response.product_name,
        "product_strength": response.product_strength,
        "batch_number": response.batch_number,
        "affected_quantity": response.affected_quantity,
        "manufacturing_date": response.manufacturing_date,
        "expiry_date": response.expiry_date,
        "originating_site_block": response.originating_site_block,
        "impacted_npm": response.impacted_npm,
        "complaint_category": response.complaint_category,
        "complaint_description": response.complaint_description,
    }


# -----------------------------
# Node 2: Risk assessment
# -----------------------------
def assess_risk(state: ComplaintState):
    response = risk_llm.invoke(
        f"""
Assess the initial risk of this pharmaceutical
customer complaint.

Complaint information:

Customer:
{state["customer_name"]}

Product:
{state["product_name"]}

Strength:
{state["product_strength"]}

Batch:
{state["batch_number"]}

Affected Quantity:
{state["affected_quantity"]}

Category:
{state["complaint_category"]}

Description:
{state["complaint_description"]}


Instructions:

- Choose exactly one severity:
  Minor, Major, or Critical.

- Consider product quality, possible patient impact,
  defect type, and affected quantity.

- This is only an initial AI-assisted assessment.

- Do not claim that the root cause is confirmed.

- Do not automatically recommend a recall.

- Do not automatically recommend regulatory notification.

- Recommend a practical next step for the QA team.

- The final assessment must be reviewed by a qualified
  QA professional.
"""
    )

    return {
        "severity": response.severity,
        "suggested_action": response.suggested_action,
        "risk_assessment": response.risk_assessment,
    }


# -----------------------------
# Node 3: Generate complaint summary
# -----------------------------
def generate_summary(state: ComplaintState):
    response = summary_llm.invoke(
        f"""
You are an AI assistant for a pharmaceutical
Customer Complaint Management System.

Create a concise and professional summary of the
customer complaint using only the information provided.

Complaint information:

Customer:
{state["customer_name"]}

Product:
{state["product_name"]}

Product Strength:
{state["product_strength"]}

Batch Number:
{state["batch_number"]}

Affected Quantity:
{state["affected_quantity"]}

Manufacturing Date:
{state["manufacturing_date"]}

Expiry Date:
{state["expiry_date"]}

Complaint Category:
{state["complaint_category"]}

Complaint Description:
{state["complaint_description"]}

AI Severity:
{state["severity"]}

Suggested Action:
{state["suggested_action"]}

Risk Assessment:
{state["risk_assessment"]}


Instructions:

1. Write one concise professional paragraph.

2. Include the customer, product, batch number,
   affected quantity, and main complaint issue
   when available.

3. Mention the complaint category when relevant.

4. Mention the AI-assessed severity when relevant.

5. Do not invent missing information.

6. Do not claim that a root cause has been confirmed.

7. Do not recommend a recall or regulatory notification
   unless it is explicitly present in the provided information.

8. The summary should be suitable for a pharmaceutical
   QMS record.

9. Keep the summary clear and easy for a QA professional
   to understand.
"""
    )

    return {
        "complaint_summary": response.summary
    }


# -----------------------------
# Conversational correction
# -----------------------------
def correct_complaint(current_data, correction):
    response = correction_llm.invoke(
        f"""
You are an AI assistant for a pharmaceutical
Customer Complaint Management System.

A customer complaint has already been analyzed.

The current extracted complaint information is:

Complaint Source:
{current_data.get("complaint_source", "")}

Customer Name:
{current_data.get("customer_name", "")}

Product Name:
{current_data.get("product_name", "")}

Product Strength:
{current_data.get("product_strength", "")}

Batch Number:
{current_data.get("batch_number", "")}

Affected Quantity:
{current_data.get("affected_quantity", "")}

Manufacturing Date:
{current_data.get("manufacturing_date", "")}

Expiry Date:
{current_data.get("expiry_date", "")}

Originating Site Block:
{current_data.get("originating_site_block", "")}

Impacted NPM:
{current_data.get("impacted_npm", "")}

Complaint Category:
{current_data.get("complaint_category", "")}

Complaint Description:
{current_data.get("complaint_description", "")}


The user has now provided this correction:

{correction}


Instructions:

1. Apply the user's correction to the existing complaint.

2. Update only the fields that the user is correcting.

3. Keep all other existing information unchanged.

4. Do not invent information.

5. If the user corrects the batch number,
   replace the existing batch number.

6. If the user corrects the affected quantity,
   replace the existing affected quantity.

7. If the user corrects another field,
   update that field and keep everything else unchanged.

8. Return the complete complaint information
   after applying the correction.
"""
    )

    return response.model_dump()


# -----------------------------
# Build LangGraph
# -----------------------------
builder = StateGraph(ComplaintState)


builder.add_node(
    "process_complaint",
    process_complaint
)

builder.add_node(
    "assess_risk",
    assess_risk
)

builder.add_node(
    "generate_summary",
    generate_summary
)


builder.add_edge(
    START,
    "process_complaint"
)

builder.add_edge(
    "process_complaint",
    "assess_risk"
)

builder.add_edge(
    "assess_risk",
    "generate_summary"
)

builder.add_edge(
    "generate_summary",
    END
)


complaint_graph = builder.compile()
