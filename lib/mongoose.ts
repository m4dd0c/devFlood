import mongoose from "mongoose";
let isConnected = false;
export const connectDB = async () => {
  try {
    if (isConnected) return console.log("Already connected to DB.");
    mongoose.set("strictQuery", true);
    if (!process.env.MONGO_URI) {
      throw new Error("Mongodb uri not found!");
    }
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "devFlood",
    });
    isConnected = true;
    console.log("connect to db successful");
  } catch (error: any) {
    console.log("DB_CONN_ERR:", error.message);
  }
};
