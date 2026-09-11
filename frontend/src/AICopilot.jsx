import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setComplaintData } from "./store/complaintSlice";

function AICopilot() {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const complaint = useSelector((state) => state.complaint);

    const [activeTab, setActiveTab] = useState("text");
    const [complaintText, setComplaintText] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [analysis, setAnalysis] = useState(null);

    // CHAT
    const [chatMessage, setChatMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);

    // =====================================================
    // ANALYZE TEXT
    // =====================================================

    const analyzeComplaint = async (text) => {
        if (!text.trim()) {
            setError("Please enter a customer complaint.");
            return;
        }

        setLoading(true);
        setError("");
        setAnalysis(null);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/complaints/analyze",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        complaint: text,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to analyze complaint.");
            }

            const data = await response.json();

            // Update Redux form
            dispatch(setComplaintData(data));

            // Update AI analysis result
            setAnalysis(data);

        } catch (err) {
            setError(
                err.message ||
                "Something went wrong while analyzing the complaint."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // PDF FILE PICKER
    // =====================================================

    const handlePdfClick = () => {
        fileInputRef.current.click();
    };

    // =====================================================
    // PDF SELECTED
    // =====================================================

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (file.type !== "application/pdf") {
            setError("Please select a PDF file.");
            setSelectedFile(null);
            return;
        }

        setError("");
        setSelectedFile(file);
    };

    // =====================================================
    // UPLOAD PDF + ANALYZE
    // =====================================================

    const analyzePdf = async () => {
        if (!selectedFile) {
            setError("Please select a PDF first.");
            return;
        }

        setLoading(true);
        setError("");
        setAnalysis(null);

        try {
            const formData = new FormData();

            formData.append("file", selectedFile);

            const pdfResponse = await fetch(
                "http://127.0.0.1:8000/complaints/upload-pdf",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!pdfResponse.ok) {
                throw new Error("Failed to upload PDF.");
            }

            const pdfData = await pdfResponse.json();

            const extractedText = pdfData.extracted_text;

            if (!extractedText) {
                throw new Error(
                    "No readable text was found in the PDF."
                );
            }

            setComplaintText(extractedText);

            await analyzeComplaint(extractedText);

        } catch (err) {
            setError(
                err.message ||
                "Something went wrong while processing the PDF."
            );

            setLoading(false);
        }
    };

    // =====================================================
    // CHAT / CONVERSATIONAL CORRECTION
    // =====================================================

    const sendChatMessage = async () => {
        if (!chatMessage.trim()) {
            return;
        }

        if (!complaint || !complaint.product_name) {
            setError(
                "Please analyze a complaint first before using Chat."
            );
            return;
        }

        const message = chatMessage.trim();

        setChatMessages((previous) => [
            ...previous,
            {
                role: "user",
                content: message,
            },
        ]);

        setChatMessage("");
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/complaints/correct",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        correction: message,
                        current_data: complaint,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => null);

                throw new Error(
                    errorData?.detail ||
                    "Failed to process the correction."
                );
            }

            const data = await response.json();

            // Update Redux form
            dispatch(setComplaintData(data));

            // Update AI result
            setAnalysis((previous) => ({
                ...(previous || {}),
                ...data,
            }));

            setChatMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content:
                        "Updated the complaint information successfully.",
                },
            ]);

        } catch (err) {
            setError(
                err.message ||
                "Something went wrong while processing the correction."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // ENTER KEY FOR CHAT
    // =====================================================

    const handleChatKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendChatMessage();
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="copilot-card">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="copilot-header">

                <div>
                    <h2>AIVOA Copilot</h2>

                    <p>
                        AI-powered complaint analysis
                    </p>
                </div>

                <span className="ai-badge">
                    AI
                </span>

            </div>

            {/* =================================================
                TABS
            ================================================= */}

            <div className="copilot-tabs">

                <button
                    className={
                        activeTab === "text"
                            ? "active"
                            : ""
                    }
                    onClick={() => setActiveTab("text")}
                >
                    Text Input
                </button>

                <button
                    className={
                        activeTab === "pdf"
                            ? "active"
                            : ""
                    }
                    onClick={() => setActiveTab("pdf")}
                >
                    Upload PDF
                </button>

                <button
                    className={
                        activeTab === "chat"
                            ? "active"
                            : ""
                    }
                    onClick={() => setActiveTab("chat")}
                >
                    Chat
                </button>

            </div>

            <div className="copilot-content">

                {/* =================================================
                    TEXT INPUT
                ================================================= */}

                {activeTab === "text" && (
                    <>

                        <label>
                            Customer Complaint
                        </label>

                        <textarea
                            value={complaintText}
                            onChange={(event) =>
                                setComplaintText(
                                    event.target.value
                                )
                            }
                            placeholder="Paste the customer complaint here..."
                            rows="10"
                        />

                        <div className="copilot-footer">

                            <span>
                                {complaintText.length} characters
                            </span>

                            <button
                                className="analyze-button"
                                onClick={() =>
                                    analyzeComplaint(
                                        complaintText
                                    )
                                }
                                disabled={loading}
                            >
                                {loading
                                    ? "Analyzing..."
                                    : "Analyze Complaint"}
                            </button>

                        </div>

                    </>
                )}

                {/* =================================================
                    PDF
                ================================================= */}

                {activeTab === "pdf" && (

                    <div className="pdf-upload-area">

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            style={{
                                display: "none",
                            }}
                        />

                        <div className="upload-icon">
                            ↑
                        </div>

                        <h3>
                            Upload Customer Complaint PDF
                        </h3>

                        <p>
                            Upload a complaint document and
                            the AI will extract and analyze
                            the complaint.
                        </p>

                        <button
                            className="analyze-button"
                            onClick={handlePdfClick}
                        >
                            Choose PDF
                        </button>

                        {selectedFile && (
                            <>

                                <div className="selected-file">

                                    <strong>
                                        Selected file:
                                    </strong>

                                    <span>
                                        {selectedFile.name}
                                    </span>

                                </div>

                                <button
                                    className="analyze-button"
                                    onClick={analyzePdf}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Analyzing PDF..."
                                        : "Analyze PDF"}
                                </button>

                            </>
                        )}

                    </div>

                )}

                {/* =================================================
                    CHAT
                ================================================= */}

                {activeTab === "chat" && (

                    <div className="chat-container">

                        <div className="chat-header">

                            <div>

                                <h3>
                                    Conversational Correction
                                </h3>

                                <p>
                                    Ask the AI to correct
                                    information extracted
                                    from the complaint.
                                </p>

                            </div>

                            <span className="chat-status">
                                ● AI Ready
                            </span>

                        </div>

                        {/* CHAT MESSAGES */}

                        <div className="chat-messages">

                            {chatMessages.length === 0 && (

                                <div className="chat-empty">

                                    <div className="chat-empty-icon">
                                        ✦
                                    </div>

                                    <h4>
                                        Correct complaint information
                                    </h4>

                                    <p>
                                        Analyze a complaint first,
                                        then tell the AI what needs
                                        to be corrected.
                                    </p>

                                    <div className="chat-example">

                                        <strong>
                                            Example
                                        </strong>

                                        <span>
                                            "Sorry, the batch number
                                            is BMX240602 and the
                                            affected quantity is
                                            48 capsules."
                                        </span>

                                    </div>

                                </div>

                            )}

                            {chatMessages.map(
                                (message, index) => (

                                    <div
                                        key={index}
                                        className={`chat-message ${message.role}`}
                                    >

                                        <div className="chat-message-label">

                                            {message.role === "user"
                                                ? "You"
                                                : "AIVOA"}

                                        </div>

                                        <div className="chat-message-content">

                                            {message.content}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                        {/* CHAT INPUT */}

                        <div className="chat-input-area">

                            <textarea
                                value={chatMessage}
                                onChange={(event) =>
                                    setChatMessage(
                                        event.target.value
                                    )
                                }
                                onKeyDown={
                                    handleChatKeyDown
                                }
                                placeholder={
                                    complaint &&
                                        complaint.product_name
                                        ? "Tell AIVOA what you'd like to correct..."
                                        : "Analyze a complaint first..."
                                }
                                disabled={
                                    loading ||
                                    !complaint ||
                                    !complaint.product_name
                                }
                                rows="2"
                            />

                            <button
                                className="chat-send-button"
                                onClick={sendChatMessage}
                                disabled={
                                    loading ||
                                    !chatMessage.trim() ||
                                    !complaint ||
                                    !complaint.product_name
                                }
                            >
                                {loading
                                    ? "Updating..."
                                    : "Send"}
                            </button>

                        </div>

                        <div className="chat-hint">
                            Press Enter to send · Shift + Enter
                            for a new line
                        </div>

                    </div>

                )}

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="analysis-error">
                        {error}
                    </div>

                )}

                {/* =================================================
                    AI RESULT
                ================================================= */}

                {analysis && (

                    <div className="analysis-result">

                        {/* =================================================
                            AI COMPLAINT SUMMARY
                        ================================================= */}

                        {analysis.complaint_summary && (

                            <div className="analysis-summary">

                                <div className="analysis-summary-header">

                                    <span className="analysis-summary-icon">
                                        ✦
                                    </span>

                                    <div>

                                        <strong>
                                            AI Complaint Summary
                                        </strong>

                                        <p>
                                            AI-generated summary for the QMS record
                                        </p>

                                    </div>

                                </div>

                                <div className="analysis-summary-text">
                                    {analysis.complaint_summary}
                                </div>

                            </div>

                        )}

                        {/* =================================================
                            AI RISK ASSESSMENT
                        ================================================= */}

                        <h3>
                            AI Copilot Risk Assessment
                        </h3>

                        <div className="risk-box">

                            <strong>
                                Severity
                            </strong>

                            <span>
                                {analysis.severity}
                            </span>

                        </div>

                        <div className="analysis-section">

                            <strong>
                                Suggested Next Action
                            </strong>

                            <p>
                                {analysis.suggested_action}
                            </p>

                        </div>

                        <div className="analysis-section">

                            <strong>
                                Risk Assessment
                            </strong>

                            <p>
                                {analysis.risk_assessment}
                            </p>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default AICopilot;