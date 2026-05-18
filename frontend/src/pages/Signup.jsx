import React, { useState } from "react";

import axios from "axios";

import {
    Link,
    useNavigate
} from "react-router-dom";

function Signup() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignup = async () => {

        try {

            const response = await axios.post(

                "https://employee-analytics-8ya2.onrender.com/api/auth/signup",

                formData
            );

            alert(response.data.message);

            navigate("/login");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Signup Failed"
            );
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <h2>Create Account</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                />

                <button onClick={handleSignup}>
                    Signup
                </button>

                <p>

                    Already have an account?

                    <Link to="/login">
                        {" "}Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Signup;