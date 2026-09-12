# AI-Powered QMS
An AI-powered complaint management system that converts unstructured pharmaceutical customer complaints into structured QMS records using **LangGraph, Groq LLMs, FastAPI, React, Redux, and PostgreSQL**.

## 🤖 AI Capabilities

* **Complaint Information Extraction**
  Extracts customer, product, batch, quantity, dates, complaint category, manufacturing information, and other QMS fields from unstructured complaint text.

* **AI Risk Assessment**
  Evaluates the complaint and provides an initial **Minor / Major / Critical** severity, suggested next action, and risk assessment.

* **AI Complaint Summary**
  Generates a concise professional summary suitable for a QMS record.

* **Conversational Correction**
  Users can correct extracted information using natural language. For example:

  > "Sorry, the batch number is BMX240602 and the affected quantity is 48 capsules."

  The AI identifies the relevant fields and updates the complaint data.

* **PDF Complaint Processing**
  Extracts text from uploaded complaint PDFs and sends it through the same AI analysis workflow.

## 🧠 AI Workflow

```text
Customer Complaint
       ↓
Input Handler
       ↓
Complaint Extraction
       ↓
Complaint Classification
       ↓
AI Risk Assessment
       ↓
AI Complaint Summary
       ↓
Structured QMS Record
       ↓
Human Review & Save
```

The AI workflow is implemented using **LangGraph**, with **Groq** providing the LLM.

## 🛠️ Tech Stack

**AI / Backend**

* Python
* LangGraph
* Groq LLM
* FastAPI
* Pydantic

**Frontend**

* React
* Redux Toolkit
* Vite

**Database**

* PostgreSQL
* SQLAlchemy

**Document Processing**

* PyPDF

## 📁 Project Structure

```text
QMS_AI/
├── backend/
│   ├── graph.py
│   ├── main.py
│   ├── models.py
│   └── database.py
│
├── frontend/
│   └── src/
│       ├── AICopilot.jsx
│       ├── ComplaintForm.jsx
│       ├── ComplaintLedger.jsx
│       ├── ComplaintDetail.jsx
│       ├── Dashboard.jsx
│       └── store/
│
├── sample_data/
├── .env.example
└── README.md
```

## 🚀 Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd QMS_AI
```

### 2. Backend

Create and activate a virtual environment, then install the required packages.

Create a `.env` file:

```env
GROQ_API_KEY=your_groq_api_key
MODEL_NAME=openai/gpt-oss-20b
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/qms_ai
```

Run the backend:

```bash
uvicorn main:app --reload
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## 🔄 Example

Input:

```text
Apollo Pharmacy reported discoloration in Amoxicillin
Capsules 500 mg from batch AMX240602. 12 capsules
were affected.
```

The AI extracts the complaint information, classifies the complaint, performs an initial risk assessment, and generates a QMS-ready summary.

The user can then correct information conversationally without manually editing every field.

## ⚠️ AI-Assisted Decision Making

The AI-generated risk assessment is intended as an **initial quality assessment**. Final complaint evaluation and quality decisions should be reviewed and approved by a qualified QA professional.

## 📌 Project Status

Functional MVP demonstrating an end-to-end AI complaint management workflow from **unstructured customer input to structured QMS record and database persistence**.
