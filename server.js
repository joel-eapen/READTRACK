// Load environment variables FIRST, before any other imports.
// This ensures CLERK_* and other vars are available when app.js
// (and its Clerk middleware) initialize.
import "./src/config/env.js";

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

/**
 * Bootstraps the application: connects to the database first,
 * then starts the HTTP server on localhost.
 */
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
