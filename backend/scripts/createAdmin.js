/**
 * Run once to create an admin account:
 * node scripts/createAdmin.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "kathirkathir1405@gmailcom";
    const exists = await User.findOne({ email });

    if (exists) {
      console.log("Admin already exists:", email);
      process.exit(0);
    }

    await User.create({
      name: "Admin",
      email: "kathirkathir1405@gmail.com",
      password: "Mukilan@123",
      role: "admin",
    });

    console.log("Admin created successfully!");
    console.log("Email: kathirkathir1405@gmail.com");
    console.log("Password: Mukilan@123");
    console.log("Change the password after first login.");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

createAdmin();
