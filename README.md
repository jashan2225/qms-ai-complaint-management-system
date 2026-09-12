\# AI-Powered Pharmaceutical Customer Complaint Management System



An AI-powered customer complaint management system designed for pharmaceutical quality management workflows. The application converts unstructured customer complaints from text or PDF documents into structured QMS records, performs AI-assisted complaint classification and risk assessment, generates a professional complaint summary, supports conversational corrections, and stores validated complaint records in PostgreSQL.



\## Overview



Pharmaceutical customer complaints often arrive as unstructured emails, messages, or documents. Manually reviewing these complaints and transferring the information into a structured QMS form can be time-consuming and error-prone.



This project uses AI to assist with that workflow.



A customer complaint can be provided as plain text or as a PDF. The system extracts the relevant information, classifies the complaint, performs an initial AI-assisted risk assessment, generates a concise complaint summary, and populates the QMS form.



Users can then review or correct the extracted information before saving the complaint to the database.



> \*\*Note:\*\* AI-generated risk assessments are intended as an initial quality-assurance aid and should be reviewed by a qualified QA professional before final decisions are made.



\---



\## Key Features



\### AI Complaint Extraction



Extracts structured information from unstructured customer complaints, including:



\* Complaint source

\* Customer name

\* Product name

\* Product strength

\* Batch / lot number

\* Affected quantity

\* Manufacturing date

\* Expiry date

\* Originating site / block

\* Impacted non-product material

\* Complaint category

\* Complaint description



\### AI Complaint Classification



The system uses the complaint information to classify the complaint into an appropriate category, such as:



\* Product defect

\* Discoloration

\* Foreign matter

\* Packaging defect

\* Other relevant complaint categories



\### AI Risk Assessment



The system performs an initial AI-assisted risk assessment and returns:



\* Severity: Minor, Major, or Critical

\* Suggested next action

\* Risk assessment explanation



The assessment is designed to assist the QA workflow and does not replace human quality review.



\### AI Complaint Summary



The application generates a concise professional summary of the complaint using the extracted information and AI assessment.



The summary is designed to be suitable for inclusion in a QMS complaint record.



\### Conversational Correction



Users can correct extracted information through natural language.



For example:



> "Sorry, the batch number is BMX240602 and the affected quantity is 48 capsules."



The AI processes the correction and updates the relevant complaint fields without requiring the complaint to be analyzed from scratch.



\### PDF Complaint Processing



Users can upload a customer complaint PDF.



The application:



1\. Receives the PDF through the FastAPI backend.

2\. Extracts readable text using `pypdf`.

3\. Sends the extracted text through the AI complaint analysis workflow.

4\. Populates the structured QMS complaint form.



\### Complaint Ledger



Saved complaints can be viewed in a complaint ledger containing:



\* Complaint ID

\* Customer

\* Product

\* Batch

\* Severity

\* Status



Users can open an individual complaint to view its complete record.



\### Complaint Detail View



The detailed complaint view displays:



\* Customer information

\* Product information

\* Manufacturing information

\* Complaint classification

\* Complaint description

\* AI severity

\* Suggested action

\* AI risk assessment

\* Complaint status

\* Creation timestamp



\### Dashboard



The dashboard provides an overview of recorded complaints, including:



\* Total complaints

\* Pending triage complaints

\* Major complaints

\* Critical complaints

\* Recent complaints



\---



\## AI Workflow



The core AI workflow is implemented using LangGraph.



```text

User Complaint

&#x20;     │

&#x20;     ▼

FastAPI Backend

&#x20;     │

&#x20;     ▼

LangGraph

&#x20;     │

&#x20;     ├── Process Complaint

&#x20;     │       │

&#x20;     │       ▼

&#x20;     │   Structured Extraction

&#x20;     │

&#x20;     ├── Assess Risk

&#x20;     │       │

&#x20;     │       ▼

&#x20;     │   Severity + Action + Risk

&#x20;     │

&#x20;     └── Generate Summary

&#x20;             │

&#x20;             ▼

&#x20;       Professional Summary

&#x20;             │

&#x20;             ▼

&#x20;      React + Redux QMS Form

&#x20;             │

&#x20;             ▼

&#x20;       Human Review / Correction

&#x20;             │

&#x20;             ▼

&#x20;         Save Complaint

&#x20;             │

&#x20;             ▼

&#x20;         PostgreSQL

```



\---



\## Technology Stack



\### Frontend



\* React

\* Redux Toolkit

\* Vite

\* JavaScript

\* CSS

\* Inter font



\### Backend



\* Python

\* FastAPI

\* Pydantic

\* SQLAlchemy

\* pypdf



\### AI



\* LangGraph

\* LangChain

\* Groq

\* `openai/gpt-oss-20b`

\* Structured LLM output



\### Database



\* PostgreSQL



\---



\## Project Structure



```text

QMS\_AI/

│

├── backend/

│   ├── ai\_test.py

│   ├── database.py

│   ├── graph.py

│   ├── main.py

│   ├── models.py

│   ├── test\_database.py

│   └── test\_graph.py

│

├── frontend/

│   ├── public/

│   ├── src/

│   │   ├── assets/

│   │   ├── store/

│   │   │   ├── complaintSlice.js

│   │   │   └── store.js

│   │   │

│   │   ├── AICopilot.jsx

│   │   ├── App.jsx

│   │   ├── App.css

│   │   ├── ComplaintDetail.jsx

│   │   ├── ComplaintForm.jsx

│   │   ├── ComplaintLedger.jsx

│   │   ├── Dashboard.jsx

│   │   ├── index.css

│   │   └── main.jsx

│   │

│   ├── package.json

│   ├── package-lock.json

│   └── vite.config.js

│

├── .env.example

├── .gitignore

└── README.md

```



\---



\## How the Application Works



\### 1. Submit a Complaint



A user can enter an unstructured customer complaint into the AI Copilot.



Example:



```text

Apollo Pharmacy reported discoloration in Amoxicillin

Capsules 500 mg from batch AMX240602. 12 capsules were

affected. The product was manufactured in March 2026 and

expires in February 2028.

```



\### 2. AI Extraction



The complaint is sent to the FastAPI backend.



The backend invokes the LangGraph workflow, which uses the Groq LLM to extract structured information.



\### 3. Complaint Classification



The AI identifies the relevant complaint category based on the complaint information.



\### 4. Risk Assessment



The extracted information is passed to the risk assessment stage.



The system generates an initial:



\* Severity

\* Suggested action

\* Risk assessment



\### 5. Complaint Summary



The system generates a concise professional summary using the extracted complaint information and AI assessment.



\### 6. Human Review



The user can review the information in the QMS form.



If something is incorrect, the user can manually edit the fields or use the conversational correction feature.



\### 7. Save the Complaint



Once the information has been reviewed, the complaint can be saved.



The FastAPI backend stores the complaint in PostgreSQL using SQLAlchemy.



\### 8. Complaint Ledger



Saved complaints appear in the complaint ledger and can be opened for detailed review.



\---



\## API Endpoints



The FastAPI backend provides the following endpoints:



| Method | Endpoint                 | Purpose                            |

| ------ | ------------------------ | ---------------------------------- |

| GET    | `/`                      | API health check                   |

| POST   | `/complaints/analyze`    | Analyze a text complaint           |

| POST   | `/complaints/upload-pdf` | Upload and extract PDF text        |

| POST   | `/complaints/correct`    | Process conversational corrections |

| POST   | `/complaints/save`       | Save a complaint                   |

| GET    | `/complaints`            | Retrieve saved complaints          |



\---



\## Environment Variables



The application uses environment variables for API credentials and database configuration.



Create a local `.env` file in the project root:



```env

GROQ\_API\_KEY=your\_groq\_api\_key

MODEL\_NAME=openai/gpt-oss-20b

DATABASE\_URL=postgresql://postgres:your\_password@localhost:5432/qms\_ai

```



A safe template is provided in:



```text

.env.example

```



\### Security



The actual `.env` file should never be committed to GitHub.



The repository `.gitignore` excludes:



```text

.env

qms\_env/

node\_modules/

\_\_pycache\_\_/

```



\---



\## Database Setup



The project uses PostgreSQL.



Create a database named:



```text

qms\_ai

```



Then configure the connection in the local `.env` file:



```env

DATABASE\_URL=postgresql://postgres:YOUR\_PASSWORD@localhost:5432/qms\_ai

```



Make sure PostgreSQL is running before starting the backend.



\---



\## Backend Setup



\### 1. Create and activate the virtual environment



From the project root:



\### Windows PowerShell



```powershell

python -m venv qms\_env

```



Activate it:



```powershell

.\\qms\_env\\Scripts\\Activate.ps1

```



\### 2. Install dependencies



Install the required Python packages:



```powershell

pip install fastapi uvicorn langgraph langchain-core langchain-groq python-dotenv pydantic python-multipart pypdf sqlalchemy psycopg2-binary

```



\### 3. Start the backend



From the `backend` directory:



```powershell

cd backend

uvicorn main:app --reload

```



The API will run at:



```text

http://127.0.0.1:8000

```



FastAPI documentation is available at:



```text

http://127.0.0.1:8000/docs

```



\---



\## Frontend Setup



Open a second terminal.



Go to the frontend directory:



```powershell

cd D:\\py\\QMS\_AI\\frontend

```



Install the Node dependencies:



```powershell

npm install

```



Start the development server:



```powershell

npm run dev

```



The frontend will normally be available at:



```text

http://localhost:5173

```



\---



\## Running the Complete Application



Two terminals are required.



\### Terminal 1 — Backend



```powershell

cd D:\\py\\QMS\_AI\\backend

..\\qms\_env\\Scripts\\Activate.ps1

uvicorn main:app --reload

```



\### Terminal 2 — Frontend



```powershell

cd D:\\py\\QMS\_AI\\frontend

npm run dev

```



Then open:



```text

http://localhost:5173

```



\---



\## Testing the Application



A basic test workflow is:



1\. Open the frontend.

2\. Enter a customer complaint.

3\. Click \*\*Analyze Complaint\*\*.

4\. Review the extracted QMS information.

5\. Review the AI Complaint Summary.

6\. Review the AI Copilot Risk Assessment.

7\. Open the Chat tab.

8\. Submit a correction.

9\. Verify the corrected information appears in the QMS form.

10\. Save the complaint.

11\. Open the Complaint Ledger.

12\. Open the saved complaint.

13\. Verify the complete complaint record.



The PDF workflow can also be tested by uploading a readable complaint PDF through the \*\*Upload PDF\*\* tab.



\---



\## Example AI Workflow



```text

Unstructured Complaint

&#x20;       │

&#x20;       ▼

&#x20;  Text / PDF Input

&#x20;       │

&#x20;       ▼

&#x20;     FastAPI

&#x20;       │

&#x20;       ▼

&#x20;   LangGraph

&#x20;       │

&#x20;       ├───────────────┐

&#x20;       ▼               │

&#x20;  AI Extraction        │

&#x20;       │               │

&#x20;       ▼               │

&#x20;Classification         │

&#x20;       │               │

&#x20;       ▼               │

&#x20;Risk Assessment        │

&#x20;       │               │

&#x20;       ▼               │

&#x20;Complaint Summary      │

&#x20;       │               │

&#x20;       └───────┬───────┘

&#x20;               ▼

&#x20;         Redux State

&#x20;               │

&#x20;               ▼

&#x20;          QMS Form

&#x20;               │

&#x20;               ▼

&#x20;      Human Correction

&#x20;               │

&#x20;               ▼

&#x20;       PostgreSQL

&#x20;               │

&#x20;               ▼

&#x20;      Complaint Ledger

```



\---



\## Design Approach



The interface is designed around a modern glass-style visual system with a clean and calm layout.



The main complaint workflow uses a two-column structure:



```text

┌───────────────────────────┬───────────────────────────┐

│                           │                           │

│      QMS Complaint        │       AI Copilot          │

│          Form             │                           │

│                           │  Text / PDF / Chat        │

│      Structured Data      │                           │

│                           │  AI Analysis              │

│                           │  Risk Assessment          │

│                           │  Complaint Summary        │

│                           │                           │

└───────────────────────────┴───────────────────────────┘

```



The design focuses on keeping AI assistance alongside the QMS form so that users can review AI-generated information before saving it.



\---



\## AI Safety and Human Review



The system is designed as an AI-assisted quality workflow rather than a fully autonomous decision-making system.



The AI does not claim that a root cause has been confirmed, and the risk assessment is intended to provide an initial assessment for review.



Final quality decisions should be made by appropriately qualified personnel.



\---



\## Future Improvements



Potential future enhancements include:



\* Complaint completeness checking

\* Duplicate complaint detection

\* Root cause recommendations

\* CAPA recommendations

\* Improved document parsing

\* OCR support for scanned complaint documents

\* Authentication and role-based access

\* Audit trails

\* Complaint status workflow

\* Advanced search and filtering

\* Production database deployment

\* Automated test coverage

\* Human approval workflow



\---



\## Project Status



\*\*Current status:\*\* Functional AI-powered complaint management MVP.



Implemented:



\* React frontend

\* Redux state management

\* FastAPI backend

\* LangGraph AI workflow

\* Groq LLM integration

\* Structured complaint extraction

\* Complaint classification

\* AI-assisted risk assessment

\* AI complaint summary

\* Conversational correction

\* PDF text extraction

\* PostgreSQL persistence

\* Complaint ledger

\* Complaint detail view

\* Dashboard



\---



\## License



No open-source license has been applied to this project at this time.



