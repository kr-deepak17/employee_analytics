import React, { useState } from "react";
import axios from "axios";

function AIRecommendation() {

    const [employee, setEmployee] = useState({

        name: "",
        department: "",
        skills: "",
        performanceScore: "",
        experience: ""
    });

    const [recommendation, setRecommendation] =
        useState("");

    const handleChange = (e) => {

        setEmployee({

            ...employee,
            [e.target.name]: e.target.value
        });
    };

    const getRecommendation = async () => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await axios.post(

                "https://employee-analytics-8ya2.onrender.com/api/ai/recommend",

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

            setRecommendation(
                response.data.recommendation
            );

        } catch (err) {

            console.log(err);

            alert("AI Recommendation Failed");
        }
    };

    return (

        <div className="container">

            <h2>AI Recommendation</h2>

            <input
                type="text"
                name="name"
                placeholder="Employee Name"
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

            <button onClick={getRecommendation}>
                Generate AI Recommendation
            </button>

            {

                recommendation && (

                    <div className="employee-card">

                        <h3>AI Response</h3>

                        <p>{recommendation}</p>

                    </div>
                )
            }

        </div>
    );
}

export default AIRecommendation;