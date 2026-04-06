import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/users.js";

const MONGODB_URI = process.env.MONGODB_URI

const seedAdmin = async () => {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not set in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    
    const hash = "123456";

    await User.create([
      {
        name: "August Dey",
        email: "august.it@gaymarkairport.com",
        password: hash,
        role: "AOT",
        airline: null,
        code: "AOT01"
      },
      {
        name: "Rahul A",
        email: "rahul.it@gaymarkairport.com",
        password: hash,
        role: "AOT",
        airline: null,
        code: "AOT02"
      }
    ]);

    console.log("✅ Admin users created successfully");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();