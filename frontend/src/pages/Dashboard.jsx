import React, { useState } from "react";

import AddEmployee from "./AddEmployee";
import EmployeeList from "./EmployeeList";
import AIRecommendation from "./AIRecommendation";

function Dashboard() {

    const [activePage, setActivePage] =
        useState("home");

    const logout = () => {

        localStorage.removeItem("token");

        window.location.href = "/login";
    };

    return (

        <div className="dashboard">

            {/* SIDEBAR */}

            <div className="sidebar">

                <h2>AI Dashboard</h2>

                <button
                    onClick={() =>
                        setActivePage("home")
                    }
                >
                    Home
                </button>

                <button
                    onClick={() =>
                        setActivePage("add")
                    }
                >
                    Add Employee
                </button>

                <button
                    onClick={() =>
                        setActivePage("employees")
                    }
                >
                    Employee List
                </button>

                <button
                    onClick={() =>
                        setActivePage("ai")
                    }
                >
                    AI Recommendation
                </button>

                <button
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

            {/* MAIN CONTENT */}

            <div className="main-content">

                {
                    activePage === "home" && (

                        <div>

                            <h1>
                                Welcome to AI Employee Analytics
                            </h1>

                            <p>
                                Manage employees, analyze performance,
                                and generate AI recommendations.
                            </p>

                        </div>
                    )
                }

                {
                    activePage === "add" &&
                    <AddEmployee />
                }

                {
                    activePage === "employees" &&
                    <EmployeeList />
                }

                {
                    activePage === "ai" &&
                    <AIRecommendation />
                }

            </div>

        </div>
    );
}

export default Dashboard;