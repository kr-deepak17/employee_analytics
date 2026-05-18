import React, { useState } from "react";
import axios from "axios";

function AddEmployee() {

    const [employee, setEmployee] = useState({

        name: "",
        email: "",
        department: "",
        skills: "",
        performanceScore: "",
        experience: ""
    });

    const handleChange = (e) => {

        setEmployee({

            ...employee,
            [e.target.name]: e.target.value
        });
    };

    const addEmployee = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.post(

                "https://employee-analytics-8ya2.onrender.com/api/employees",

                {
                    ...employee,
                    skills: employee.skills.split(",")
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message);

        } catch (err) {

            alert(err.response.data.message);
        }
    };

    return (

        <div className="container">

            <h2>Add Employee</h2>

            <input
                type="text"
                name="name"
                placeholder="Employee Name"
                onChange={handleChange}
            />

            <input
                type="email"
                name="email"
                placeholder="Employee Email"
                onChange={handleChange}
            />

            <input
                type="text"
                name="department"
                placeholder="Department"
                onChange={handleChange}
            />

            <input
                type="text"
                name="skills"
                placeholder="Skills separated by commas"
                onChange={handleChange}
            />

            <input
                type="number"
                name="performanceScore"
                placeholder="Performance Score"
                onChange={handleChange}
            />

            <input
                type="number"
                name="experience"
                placeholder="Experience"
                onChange={handleChange}
            />

            <button onClick={addEmployee}>
                Add Employee
            </button>

        </div>
    );
}

export default AddEmployee;