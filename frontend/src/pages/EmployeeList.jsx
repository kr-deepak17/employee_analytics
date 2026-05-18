import React, { useEffect, useState } from "react";

import axios from "axios";

function EmployeeList() {

    const [employees, setEmployees] = useState([]);

    const fetchEmployees = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.get(

                "https://employee-analytics-8ya2.onrender.com/api/employees",

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEmployees(response.data.employees);

        } catch (err) {

            console.log(err);
        }
    };

    useEffect(() => {

        fetchEmployees();

    }, []);

    const deleteEmployee = async (id) => {

        try {

            const token =
                localStorage.getItem("token");

            await axios.delete(

                `https://employee-analytics-8ya2.onrender.com/api/employees/${id}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Employee Deleted Successfully");

            fetchEmployees();

        } catch (err) {

            console.log(err);

            alert("Delete Failed");
        }
    };

    return (

        <div className="container">

            <h2>Employee List</h2>

            {

                employees.map((emp) => (

                    <div
                        className="employee-card"
                        key={emp._id}
                    >

                        <h3>{emp.name}</h3>

                        <p>
                            <strong>Email:</strong>
                            {" "}
                            {emp.email}
                        </p>

                        <p>
                            <strong>Department:</strong>
                            {" "}
                            {emp.department}
                        </p>

                        <p>
                            <strong>Skills:</strong>
                            {" "}
                            {emp.skills.join(", ")}
                        </p>

                        <p>
                            <strong>Performance:</strong>
                            {" "}
                            {emp.performanceScore}
                        </p>

                        <p>
                            <strong>Experience:</strong>
                            {" "}
                            {emp.experience} years
                        </p>

                        <button
                            onClick={() =>
                                deleteEmployee(emp._id)
                            }
                        >
                            Delete Employee
                        </button>

                    </div>
                ))
            }

        </div>
    );
}

export default EmployeeList;