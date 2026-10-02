import express from "express";
import morgan from "morgan";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import searchRouter from "./routes/search.route.js";
import privateRouter from "./routes/privateAPI.route.js";
import errorHandler from "./middlewares/errorHandler.js";
import ApiError from "./utils/ApiError.js";
import ApiResponse from "./utils/ApiResponse.js";


const app = express();

// CORS configuration.
// Set CORS_ORIGIN in .env to a comma-separated list of allowed origins.
// Defaults to "*" (allow all) when unset — tighten this in production.
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : "*";

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk authentication middleware.
// Attaches auth state to every request (req.auth) without blocking access.
// Use getAuth(req) / requireAuth() in routes to read or enforce auth.
app.use(clerkMiddleware());

// HTTP request logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Health check
app.get("/health", (req, res) => {
  new ApiResponse(200, { uptime: process.uptime() }, "OK").send(res);
});

//search Routes

app.use("/api",searchRouter)

//private APIs
app.use("/api",privateRouter)

// 404 handler - forward to the global error handler
app.use((req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
