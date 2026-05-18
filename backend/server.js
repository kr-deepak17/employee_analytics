const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

dotenv.config();

const app = express();

/* ======================================================
   MIDDLEWARE
====================================================== */

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

/* ======================================================
   DATABASE CONNECTION
====================================================== */

mongoose.connect(process.env.MONGO_URI)

.then(() => {
    console.log("MongoDB Connected Successfully");
})

.catch((err) => {
    console.log("MongoDB Error:", err.message);
});

/* ======================================================
   USER SCHEMA
====================================================== */

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    }

}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

/* ======================================================
   EMPLOYEE SCHEMA
====================================================== */

const employeeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    department: {
        type: String,
        required: true,
        trim: true
    },

    skills: {
        type: [String],
        required: true
    },

    performanceScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },

    experience: {
        type: Number,
        required: true,
        min: 0
    }

}, {
    timestamps: true
});

const Employee = mongoose.model("Employee", employeeSchema);

/* ======================================================
   JWT AUTH MIDDLEWARE
====================================================== */

const authMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Expecting format:
        // Bearer TOKEN

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verified;

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

/* ======================================================
   HOME ROUTE
====================================================== */

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "AI Employee Backend Running Successfully"
    });
});

/* ======================================================
   AUTH ROUTES
====================================================== */

/* =========================
   SIGNUP
========================= */

app.post("/api/auth/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Validation

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check existing user

        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Create user

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: "Signup successful"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/* =========================
   LOGIN
========================= */

app.post("/api/auth/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Validation

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }

        // Find user

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare password

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate token

        const token = jwt.sign(

            {
                id: user._id,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/* ======================================================
   EMPLOYEE ROUTES
====================================================== */

/* =========================
   ADD EMPLOYEE
========================= */

app.post(
    "/api/employees",
    authMiddleware,
    async (req, res) => {

    try {

        const {
            name,
            email,
            department,
            skills,
            performanceScore,
            experience
        } = req.body;

        // Validation

        if (
            !name ||
            !email ||
            !department ||
            !skills ||
            performanceScore === undefined ||
            experience === undefined
        ) {

            return res.status(400).json({
                success: false,
                message: "All employee fields are required"
            });
        }

        // Check duplicate email

        const existingEmployee =
            await Employee.findOne({ email });

        if (existingEmployee) {

            return res.status(400).json({
                success: false,
                message: "Employee email already exists"
            });
        }

        // Create employee

        const employee = new Employee({
            name,
            email,
            department,
            skills,
            performanceScore,
            experience
        });

        await employee.save();

        res.status(201).json({
            success: true,
            message: "Employee added successfully",
            employee
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/* =========================
   GET ALL EMPLOYEES
========================= */

app.get(
    "/api/employees",
    authMiddleware,
    async (req, res) => {

    try {

        const employees = await Employee.find()
        .sort({ performanceScore: -1 });

        res.status(200).json({
            success: true,
            totalEmployees: employees.length,
            employees
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/* =========================
   SEARCH EMPLOYEE
========================= */

app.get(
    "/api/employees/search",
    authMiddleware,
    async (req, res) => {

    try {

        const { department } = req.query;

        if (!department) {

            return res.status(400).json({
                success: false,
                message: "Department query required"
            });
        }

        const employees = await Employee.find({
            department: {
                $regex: department,
                $options: "i"
            }
        });

        res.status(200).json({
            success: true,
            results: employees.length,
            employees
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/* =========================
   UPDATE EMPLOYEE
========================= */

app.put(
    "/api/employees/:id",
    authMiddleware,
    async (req, res) => {

    try {

        const updatedEmployee =
            await Employee.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedEmployee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            updatedEmployee
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/* =========================
   DELETE EMPLOYEE
========================= */

app.delete(
    "/api/employees/:id",
    authMiddleware,
    async (req, res) => {

    try {

        const deletedEmployee =
            await Employee.findByIdAndDelete(
                req.params.id
            );

        if (!deletedEmployee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

/* ======================================================
   AI RECOMMENDATION ROUTE
====================================================== */

app.post(
    "/api/ai/recommend",
    authMiddleware,
    async (req, res) => {

    try {

        const {
            name,
            department,
            skills,
            performanceScore,
            experience
        } = req.body;

        const prompt = `
You are an HR AI assistant.

Analyze the employee below and provide:

1. Promotion Recommendation
2. Employee Ranking
3. Training Suggestions
4. Performance Feedback

Employee Details:

Name: ${name}
Department: ${department}
Skills: ${skills}
Performance Score: ${performanceScore}
Experience: ${experience} years
`;

        const response = await axios.post(

            "https://openrouter.ai/api/v1/chat/completions",

            {
                model: "openai/gpt-3.5-turbo",

                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            },

            {
                headers: {

                    Authorization:
                        `Bearer ${process.env.OPENROUTER_API_KEY}`,

                    "Content-Type": "application/json"
                }
            }
        );

        const aiResponse =
            response.data.choices[0].message.content;

        res.status(200).json({
            success: true,
            recommendation: aiResponse
        });

    } catch (err) {

        console.log(
            err.response?.data || err.message
        );

        res.status(500).json({
            success: false,
            message: "AI recommendation failed"
        });
    }
});

/* ======================================================
   GLOBAL ERROR HANDLER
====================================================== */

app.use((err, req, res, next) => {

    console.log(err.stack);

    res.status(500).json({
        success: false,
        message: "Something went wrong"
    });
});

/* ======================================================
   SERVER
====================================================== */

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});