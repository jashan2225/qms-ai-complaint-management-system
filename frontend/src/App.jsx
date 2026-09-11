import React, { useState } from "react";

import "./App.css";

import ComplaintForm from "./ComplaintForm";
import AICopilot from "./AICopilot";
import ComplaintLedger from "./ComplaintLedger";
import ComplaintDetail from "./ComplaintDetail";
import Dashboard from "./Dashboard";


function App() {

  const [activePage, setActivePage] =
    useState("complaints");

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);


  const handleNavigation = (page) => {

    setActivePage(page);

    // Clear selected complaint when changing section
    setSelectedComplaint(null);

  };


  const openComplaintDetail = (complaint) => {

    setSelectedComplaint(complaint);

  };


  const closeComplaintDetail = () => {

    setSelectedComplaint(null);

  };


  return (

    <div className="app">


      {/* =================================================
                SIDEBAR
            ================================================= */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-mark">
            A
          </div>

          <div>

            <h1>
              AIVOA
            </h1>

            <span>
              Quality Management
            </span>

          </div>

        </div>


        <nav className="sidebar-nav">

          <div className="nav-section">
            QUALITY
          </div>


          <div
            className={`nav-item ${activePage === "complaints"
                ? "active"
                : ""
              }`}
            onClick={() =>
              handleNavigation(
                "complaints"
              )
            }
          >
            <span>
              ▣
            </span>

            Customer Complaints
          </div>


          <div
            className={`nav-item ${activePage === "deviations"
                ? "active"
                : ""
              }`}
            onClick={() =>
              handleNavigation(
                "deviations"
              )
            }
          >
            <span>
              ◈
            </span>

            Deviations
          </div>


          <div
            className={`nav-item ${activePage === "capa"
                ? "active"
                : ""
              }`}
            onClick={() =>
              handleNavigation(
                "capa"
              )
            }
          >
            <span>
              ◇
            </span>

            CAPA
          </div>


          <div
            className={`nav-item ${activePage === "change-control"
                ? "active"
                : ""
              }`}
            onClick={() =>
              handleNavigation(
                "change-control"
              )
            }
          >
            <span>
              □
            </span>

            Change Control
          </div>


          <div className="nav-section">
            MANAGEMENT
          </div>


          <div
            className={`nav-item ${activePage === "dashboard"
                ? "active"
                : ""
              }`}
            onClick={() =>
              handleNavigation(
                "dashboard"
              )
            }
          >
            <span>
              ▤
            </span>

            Dashboard
          </div>


          <div
            className={`nav-item ${activePage === "settings"
                ? "active"
                : ""
              }`}
            onClick={() =>
              handleNavigation(
                "settings"
              )
            }
          >
            <span>
              ⚙
            </span>

            Settings
          </div>

        </nav>


        <div className="sidebar-bottom">

          <div className="user-avatar">
            U
          </div>

          <div>

            <strong>
              Quality User
            </strong>

            <span>
              QA Department
            </span>

          </div>

        </div>

      </aside>



      {/* =================================================
                MAIN CONTENT
            ================================================= */}

      <main className="main-content">


        {/* TOP BAR */}

        <header className="topbar">

          <div>

            <span className="breadcrumb">
              Quality Management /
            </span>

            <strong>

              {activePage === "complaints"
                ? " Customer Complaints"
                : activePage === "dashboard"
                  ? " Dashboard"
                  : activePage === "deviations"
                    ? " Deviations"
                    : activePage === "capa"
                      ? " CAPA"
                      : activePage === "change-control"
                        ? " Change Control"
                        : " Settings"}

            </strong>

          </div>


          <div className="topbar-right">

            <span className="notification">
              ●
            </span>

            <span className="user-name">
              Quality User
            </span>

          </div>

        </header>



        {/* =================================================
                    PAGE CONTENT
                ================================================= */}

        <section className="page-content">


          {/* =================================================
                        CUSTOMER COMPLAINTS
                    ================================================= */}

          {activePage === "complaints" && (

            selectedComplaint ? (

              <ComplaintDetail
                complaint={
                  selectedComplaint
                }
                onBack={
                  closeComplaintDetail
                }
              />

            ) : (

              <>

                <div className="page-title">

                  <div>

                    <h1>
                      Customer Complaint Management
                    </h1>

                    <p>
                      Log, analyze and manage
                      pharmaceutical customer
                      complaints.
                    </p>

                  </div>

                </div>


                <div className="dashboard-grid">

                  <ComplaintForm />

                  <AICopilot />

                </div>


                <ComplaintLedger
                  onComplaintClick={
                    openComplaintDetail
                  }
                />

              </>

            )

          )}



          {/* =================================================
                        DASHBOARD
                    ================================================= */}

          {activePage === "dashboard" && (

            <>

              <div className="page-title">

                <div>

                  <h1>
                    Quality Management Dashboard
                  </h1>

                  <p>
                    Overview of customer complaints
                    and quality management activity.
                  </p>

                </div>

              </div>


              <Dashboard />

            </>

          )}



          {/* =================================================
                        DEVIATIONS
                    ================================================= */}

          {activePage === "deviations" && (

            <>

              <div className="page-title">

                <div>

                  <h1>
                    Deviations
                  </h1>

                  <p>
                    Manage and investigate
                    quality deviations.
                  </p>

                </div>

              </div>


              <div className="ledger-card">

                <div className="ledger-message">
                  Deviation management module
                  coming soon.
                </div>

              </div>

            </>

          )}



          {/* =================================================
                        CAPA
                    ================================================= */}

          {activePage === "capa" && (

            <>

              <div className="page-title">

                <div>

                  <h1>
                    CAPA
                  </h1>

                  <p>
                    Manage corrective and
                    preventive actions.
                  </p>

                </div>

              </div>


              <div className="ledger-card">

                <div className="ledger-message">
                  CAPA management module
                  coming soon.
                </div>

              </div>

            </>

          )}



          {/* =================================================
                        CHANGE CONTROL
                    ================================================= */}

          {activePage === "change-control" && (

            <>

              <div className="page-title">

                <div>

                  <h1>
                    Change Control
                  </h1>

                  <p>
                    Manage controlled changes
                    across the quality system.
                  </p>

                </div>

              </div>


              <div className="ledger-card">

                <div className="ledger-message">
                  Change Control module
                  coming soon.
                </div>

              </div>

            </>

          )}



          {/* =================================================
                        SETTINGS
                    ================================================= */}

          {activePage === "settings" && (

            <>

              <div className="page-title">

                <div>

                  <h1>
                    Settings
                  </h1>

                  <p>
                    Configure your quality
                    management system.
                  </p>

                </div>

              </div>


              <div className="ledger-card">

                <div className="ledger-message">
                  Settings module coming soon.
                </div>

              </div>

            </>

          )}

        </section>

      </main>

    </div>

  );

}

export default App;