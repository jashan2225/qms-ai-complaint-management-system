import React, { useEffect, useState } from "react";

function Dashboard() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadComplaints = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://127.0.0.1:8000/complaints"
            );

            if (!response.ok) {
                throw new Error("Failed to load complaints");
            }

            const data = await response.json();
            setComplaints(data);
        } catch (error) {
            console.error("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComplaints();
    }, []);

    const totalComplaints = complaints.length;

    const pendingComplaints = complaints.filter(
        (complaint) =>
            complaint.status?.toLowerCase() === "pending triage"
    ).length;

    const majorComplaints = complaints.filter(
        (complaint) =>
            complaint.severity?.toLowerCase() === "major"
    ).length;

    const criticalComplaints = complaints.filter(
        (complaint) =>
            complaint.severity?.toLowerCase() === "critical"
    ).length;

    return (
        <div className="dashboard-page">

            {/* Summary Cards */}
            <div className="dashboard-stats">

                <div className="stat-card">
                    <div className="stat-icon">▣</div>

                    <div>
                        <span className="stat-label">
                            Total Complaints
                        </span>

                        <strong className="stat-value">
                            {loading ? "—" : totalComplaints}
                        </strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">◷</div>

                    <div>
                        <span className="stat-label">
                            Pending Triage
                        </span>

                        <strong className="stat-value">
                            {loading ? "—" : pendingComplaints}
                        </strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">!</div>

                    <div>
                        <span className="stat-label">
                            Major Complaints
                        </span>

                        <strong className="stat-value">
                            {loading ? "—" : majorComplaints}
                        </strong>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⚠</div>

                    <div>
                        <span className="stat-label">
                            Critical Complaints
                        </span>

                        <strong className="stat-value">
                            {loading ? "—" : criticalComplaints}
                        </strong>
                    </div>
                </div>

            </div>

            {/* Recent Complaints */}
            <div className="dashboard-recent">

                <div className="dashboard-section-header">
                    <div>
                        <h2>Recent Complaints</h2>
                        <p>
                            Latest customer complaints recorded in the QMS.
                        </p>
                    </div>

                    <button
                        className="ledger-refresh"
                        onClick={loadComplaints}
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="ledger-message">
                        Loading complaints...
                    </div>
                ) : complaints.length === 0 ? (
                    <div className="ledger-message">
                        No complaints have been logged yet.
                    </div>
                ) : (
                    <div className="ledger-table-wrapper">
                        <table className="ledger-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Batch</th>
                                    <th>Severity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {complaints.slice(0, 5).map((complaint) => (
                                    <tr key={complaint.id}>

                                        <td>
                                            #{complaint.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {complaint.customer_name ||
                                                    "Not provided"}
                                            </strong>
                                        </td>

                                        <td>
                                            <div className="ledger-product">
                                                {complaint.product_name ||
                                                    "Not provided"}

                                                {complaint.product_strength && (
                                                    <span>
                                                        {complaint.product_strength}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td>
                                            {complaint.batch_number ||
                                                "Not provided"}
                                        </td>

                                        <td>
                                            <span
                                                className={`severity-badge ${complaint.severity?.toLowerCase() || ""
                                                    }`}
                                            >
                                                {complaint.severity || "Unknown"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="status-badge">
                                                {complaint.status ||
                                                    "Pending Triage"}
                                            </span>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Dashboard;