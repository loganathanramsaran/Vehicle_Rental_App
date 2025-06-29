require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB ✅");

    await User.create({
      name: "Test User",
      email: "testuser@example.com",
      password: "123456",
    });

    console.log("✅ User inserted");
    process.exit();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
