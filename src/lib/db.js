import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("MONGODB_URL .env me nahi hai");
}

// Global cache taake har hot-reload pe naya connection na bane (Next.js ke liye zaruri)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        bufferCommands: false, // fast response
        maxPoolSize: 10, // 10 connections ek sath
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connected - Fast Mode");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.log("ERROR WHILE CONNECT DB", error);
    throw error;
  }
};

export default connectDb;
