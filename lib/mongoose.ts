import mongoose from "mongoose";

declare global {
  var db: mongoose.Connection;
}

async function connectDB() {
  if (global.db) {
    return global.db;
  }

  const connection = await mongoose.connect(import.meta.env.VITE_DATABASE_URL);

  console.log("Connected to MongoDB");

  global.db = connection.connection;

  return global.db;
}

export default connectDB;
