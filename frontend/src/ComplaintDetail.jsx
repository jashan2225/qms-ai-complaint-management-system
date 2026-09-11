import React from "react";

function ComplaintDetail({ complaint, onBack }) {
    if (!complaint) {
        return null;
    }

    return (
        <div className="complaint-detail-page">

            {/* Header */}
            <div className="detail-topbar">

                <button
                    className="detail-back-button"
                    onClick={onBack}
                >
                    ← Back to Complaints
                </button>

                <div className="detail-id">
                    Complaint #{complaint.id}
                </div>

            </div>


            {/* Main header */}
            <div className="detail-header-card">

                <div>
                    <span className="detail-eyebrow">
                        CUSTOMER COMPLAINT
                    </span>

                    <h1>
                        {complaint.product_name || "Product not provided"}
                    </h1>

                    <p>
                        {complaint.customer_name || "Customer not provided"}
                        {" · "}
                        {complaint.product_strength || "Strength not provided"}
                    </p>
                </div>


                <div className="detail-status-area">

                    <span
                        className={`severity-badge ${complaint.severity?.toLowerCase() || ""
                            }`}
                    >
                        {complaint.severity || "Unknown"}
                    </span>

                    <span className="status-badge">
                        {complaint.status || "Pending Triage"}
                    </span>

                </div>

            </div>


            {/* Information grid */}
            <div className="detail-grid">

                {/* Complaint Information */}
                <div className="detail-card">

                    <div className="detail-card-header">
                        <h2>Complaint Information</h2>
                        <span>01</span>
                    </div>

                    <div className="detail-fields">

                        <DetailField
                            label="Complaint Source"
                            value={complaint.complaint_source}
                        />

                        <DetailField
                            label="Customer Name"
                            value={complaint.customer_name}
                        />

                        <DetailField
                            label="Product Name"
                            value={complaint.product_name}
                        />

                        <DetailField
                            label="Product Strength"
                            value={complaint.product_strength}
                        />

                        <DetailField
                            label="Batch / Lot Number"
                            value={complaint.batch_number}
                        />

                        <DetailField
                            label="Affected Quantity"
                            value={complaint.affected_quantity}
                        />

                    </div>

                </div>


                {/* Manufacturing Information */}
                <div className="detail-card">

                    <div className="detail-card-header">
                        <h2>Manufacturing Information</h2>
                        <span>02</span>
                    </div>

                    <div className="detail-fields">

                        <DetailField
                            label="Manufacturing Date"
                            value={complaint.manufacturing_date}
                        />

                        <DetailField
                            label="Expiry Date"
                            value={complaint.expiry_date}
                        />

                        <DetailField
                            label="Originating Site / Block"
                            value={complaint.originating_site_block}
                        />

                        <DetailField
                            label="Impacted Non-Product Materials"
                            value={complaint.impacted_npm}
                        />

                    </div>

                </div>


                {/* Classification */}
                <div className="detail-card">

                    <div className="detail-card-header">
                        <h2>Complaint Classification</h2>
                        <span>03</span>
                    </div>

                    <div className="detail-fields">

                        <DetailField
                            label="Complaint Category"
                            value={complaint.complaint_category}
                            fullWidth
                        />

                    </div>

                    <div className="detail-long-field">

                        <span className="detail-label">
                            Complaint Description
                        </span>

                        <div className="detail-text">
                            {complaint.complaint_description ||
                                "No description provided."}
                        </div>

                    </div>

                </div>


                {/* AI Assessment */}
                <div className="detail-card ai-detail-card">

                    <div className="detail-card-header">

                        <div>
                            <h2>AI Copilot Assessment</h2>

                            <p>
                                AI-assisted quality risk assessment
                            </p>
                        </div>

                        <span className="ai-detail-badge">
                            AI
                        </span>

                    </div>


                    <div className="ai-severity-row">

                        <span className="detail-label">
                            Risk Severity
                        </span>

                        <span
                            className={`severity-badge ${complaint.severity?.toLowerCase() || ""
                                }`}
                        >
                            {complaint.severity || "Unknown"}
                        </span>

                    </div>


                    <div className="ai-assessment-section">

                        <span className="detail-label">
                            Suggested Next Action
                        </span>

                        <p>
                            {complaint.suggested_action ||
                                "No suggested action available."}
                        </p>

                    </div>


                    <div className="ai-assessment-section">

                        <span className="detail-label">
                            Risk Assessment
                        </span>

                        <p>
                            {complaint.risk_assessment ||
                                "No risk assessment available."}
                        </p>

                    </div>

                </div>


                {/* Original complaint */}
                <div className="detail-card detail-full-width">

                    <div className="detail-card-header">
                        <h2>Complaint Record</h2>
                        <span>04</span>
                    </div>

                    <div className="record-grid">

                        <DetailField
                            label="Complaint ID"
                            value={`#${complaint.id}`}
                        />

                        <DetailField
                            label="Status"
                            value={complaint.status}
                        />

                        <DetailField
                            label="Created At"
                            value={
                                complaint.created_at
                                    ? new Date(
                                        complaint.created_at
                                    ).toLocaleString()
                                    : "Not available"
                            }
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}


/* Reusable field */

function DetailField({ label, value, fullWidth = false }) {
    return (
        <div
            className={`detail-field ${fullWidth ? "detail-field-full" : ""
                }`}
        >

            <span className="detail-label">
                {label}
            </span>

            <strong>
                {value || "Not provided"}
            </strong>

        </div>
    );
}

export default ComplaintDetail;