import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log("ERROR WHILE CONNECT DB", error);
    return;
  }
};

export default connectDb;
