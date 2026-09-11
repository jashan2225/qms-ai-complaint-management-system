import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateComplaintField } from "./store/complaintSlice";

function ComplaintForm() {
    const dispatch = useDispatch();

    // Read complaint data from Redux
    const formData = useSelector((state) => state.complaint);

    // Local state for save status
    const [saveMessage, setSaveMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        dispatch(
            updateComplaintField({
                field: name,
                value: value,
            })
        );
    };

    const handleSave = async () => {
        setSaveMessage("Saving complaint...");

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/complaints/save",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (response.ok && data.message === "Complaint saved successfully") {
                setSaveMessage(
                    `Complaint saved successfully. ID: ${data.complaint_id}`
                );
            } else {
                setSaveMessage(
                    `Failed to save complaint: ${data.error || data.message}`
                );
            }
        } catch (error) {
            console.error("Save error:", error);
            setSaveMessage(
                "Could not connect to the backend. Make sure FastAPI is running."
            );
        }
    };

    return (
        <div className="complaint-form-card">
            <div className="card-header">
                <div>
                    <h2>Log Customer Complaint</h2>
                    <p>API & FDF Quality Assurance Module</p>
                </div>

                <span className="status-badge">
                    {formData.status || "Pending Triage"}
                </span>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label>Complaint Source</label>
                    <input
                        name="complaint_source"
                        value={formData.complaint_source}
                        onChange={handleChange}
                        placeholder="e.g. Pharmacy"
                    />
                </div>

                <div className="form-group">
                    <label>Customer Name</label>
                    <input
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        placeholder="Customer name"
                    />
                </div>

                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        name="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        placeholder="Product name"
                    />
                </div>

                <div className="form-group">
                    <label>Product Strength</label>
                    <input
                        name="product_strength"
                        value={formData.product_strength}
                        onChange={handleChange}
                        placeholder="e.g. 500 mg"
                    />
                </div>

                <div className="form-group">
                    <label>Batch / Lot Number</label>
                    <input
                        name="batch_number"
                        value={formData.batch_number}
                        onChange={handleChange}
                        placeholder="Batch number"
                    />
                </div>

                <div className="form-group">
                    <label>Affected Quantity</label>
                    <input
                        name="affected_quantity"
                        value={formData.affected_quantity}
                        onChange={handleChange}
                        placeholder="e.g. 12 capsules"
                    />
                </div>

                <div className="form-group">
                    <label>Manufacturing Date</label>
                    <input
                        name="manufacturing_date"
                        value={formData.manufacturing_date}
                        onChange={handleChange}
                        placeholder="Manufacturing date"
                    />
                </div>

                <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                        name="expiry_date"
                        value={formData.expiry_date}
                        onChange={handleChange}
                        placeholder="Expiry date"
                    />
                </div>

                <div className="form-group">
                    <label>Originating Site Block</label>
                    <input
                        name="originating_site_block"
                        value={formData.originating_site_block}
                        onChange={handleChange}
                        placeholder="e.g. Manufacturing"
                    />
                </div>

                <div className="form-group">
                    <label>Impacted Non-Product Materials</label>
                    <input
                        name="impacted_npm"
                        value={formData.impacted_npm}
                        onChange={handleChange}
                        placeholder="e.g. Primary Packaging"
                    />
                </div>

                <div className="form-group full-width">
                    <label>Complaint Category</label>
                    <input
                        name="complaint_category"
                        value={formData.complaint_category}
                        onChange={handleChange}
                        placeholder="Complaint category"
                    />
                </div>

                <div className="form-group full-width">
                    <label>Complaint Description</label>
                    <textarea
                        name="complaint_description"
                        value={formData.complaint_description}
                        onChange={handleChange}
                        placeholder="Complaint description"
                        rows="4"
                    />
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="save-button"
                    onClick={handleSave}
                >
                    Save Complaint
                </button>

                {saveMessage && (
                    <p className="save-message">{saveMessage}</p>
                )}
            </div>
        </div>
    );
}

export default ComplaintForm;