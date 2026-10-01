import dotenv from "dotenv";

// Load environment variables immediately when this module is imported.
// Importing this file first (before any Clerk/DB imports) guarantees that
// process.env is populated before dependent modules initialize.
dotenv.config();
