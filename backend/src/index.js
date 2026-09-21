import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { dbConnection } from "./DB/db.connection.js";
import authRoutes from "./modules/auth/auth.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database
dbConnection();

// Routes
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (_req, res) => {
    res.json({
        status: "ok"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(
        `Server listening on http://localhost:${PORT}`
    );
});