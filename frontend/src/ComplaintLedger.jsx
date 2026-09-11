import React, { useEffect, useState } from "react";

function ComplaintLedger({ onComplaintClick }) {

    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const loadComplaints = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://127.0.0.1:8000/complaints"
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load complaints"
                );
            }

            const data = await response.json();

            setComplaints(data);

        } catch (err) {

            console.error(
                "Ledger error:",
                err
            );

            setError(
                "Unable to load complaints."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadComplaints();
    }, []);


    return (

        <div className="ledger-card">

            <div className="ledger-header">

                <div>
                    <h2>
                        Complaint Ledger
                    </h2>

                    <p>
                        Customer complaints recorded
                        in the QMS.
                    </p>
                </div>


                <button
                    className="ledger-refresh"
                    onClick={loadComplaints}
                >
                    Refresh
                </button>

            </div>


            {loading && (

                <div className="ledger-message">
                    Loading complaints...
                </div>

            )}


            {error && (

                <div className="ledger-error">
                    {error}
                </div>

            )}


            {!loading &&
                !error &&
                complaints.length === 0 && (

                    <div className="ledger-message">
                        No complaints have been logged yet.
                    </div>

                )}


            {!loading &&
                !error &&
                complaints.length > 0 && (

                    <div className="ledger-table-wrapper">

                        <table className="ledger-table">

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Customer
                                    </th>

                                    <th>
                                        Product
                                    </th>

                                    <th>
                                        Batch
                                    </th>

                                    <th>
                                        Severity
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        View
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {complaints.map(
                                    (complaint) => (

                                        <tr
                                            key={
                                                complaint.id
                                            }
                                            className="ledger-row-clickable"
                                            onClick={() =>
                                                onComplaintClick(
                                                    complaint
                                                )
                                            }
                                        >

                                            <td>
                                                <strong>
                                                    #
                                                    {
                                                        complaint.id
                                                    }
                                                </strong>
                                            </td>


                                            <td>
                                                <strong>
                                                    {
                                                        complaint.customer_name ||
                                                        "Not provided"
                                                    }
                                                </strong>
                                            </td>


                                            <td>

                                                <div className="ledger-product">

                                                    {
                                                        complaint.product_name ||
                                                        "Not provided"
                                                    }

                                                    {complaint.product_strength && (

                                                        <span>
                                                            {
                                                                complaint.product_strength
                                                            }
                                                        </span>

                                                    )}

                                                </div>

                                            </td>


                                            <td>
                                                {
                                                    complaint.batch_number ||
                                                    "Not provided"
                                                }
                                            </td>


                                            <td>

                                                <span
                                                    className={`severity-badge ${complaint.severity?.toLowerCase() ||
                                                        ""
                                                        }`}
                                                >

                                                    {
                                                        complaint.severity ||
                                                        "Unknown"
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                <span className="status-badge">

                                                    {
                                                        complaint.status ||
                                                        "Pending Triage"
                                                    }

                                                </span>

                                            </td>


                                            <td>

                                                <button
                                                    className="view-complaint-button"
                                                    onClick={(event) => {

                                                        event.stopPropagation();

                                                        onComplaintClick(
                                                            complaint
                                                        );

                                                    }}
                                                >
                                                    View →
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

        </div>

    );
}

export default ComplaintLedger;