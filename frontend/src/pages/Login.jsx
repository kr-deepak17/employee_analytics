import React, { useState } from "react";

import axios from "axios";

import {
    useNavigate,
    Link
} from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async () => {

        try {

            setLoading(true);

            const response = await axios.post(

                "https://employee-analytics-8ya2.onrender.com/api/auth/login",

                formData
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            navigate("/dashboard");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Login Failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <h2>Login</h2>

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

                <button
                    onClick={handleLogin}
                    disabled={loading}
                >

                    {
                        loading
                            ? "Logging in..."
                            : "Login"
                    }

                </button>

                <p>

                    Don't have an account?

                    <Link to="/signup">
                        {" "}Signup
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;