import mongoose from "mongoose";

/**
 * Establishes a connection to MongoDB using the URI from environment variables.
 * Exits the process on failure so issues surface early during bootstrap.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/readtrack";

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
