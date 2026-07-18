const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

// Load env vars
dotenv.config();

const resetPasswords = async () => {
  try {
    // Get the exact password from the terminal command
    const exactPassword = process.argv[2];

    if (!exactPassword) {
      console.log("❌ ERROR: You must provide an exact password!");
      console.log("👉 Usage: node resetPasswords.js <YourExactPassword>");
      process.exit(1);
    }

    await connectDB();
    console.log(`Database connected. Resetting all passwords to: "${exactPassword}"...`);

    const users = await User.find({});
    
    if (users.length === 0) {
      console.log("No users found in the database.");
      process.exit(0);
    }

    // Hash the exact password provided
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(exactPassword, salt);

    // Update all users
    for (let user of users) {
      user.password = hashedPassword;
      await user.save();
      console.log(`✅ Updated user: ${user.email}`);
    }

    console.log(`\n🎉 SUCCESS: All passwords have been locked to your exact password!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting passwords:", error);
    process.exit(1);
  }
};

resetPasswords();
