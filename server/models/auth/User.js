const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true, trim: true },
  is_verified: { type: Boolean, default: false },
  roles: { type: [String], enum: ["user", "admin"], default: ["user"] },
  friends: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  lastSeen: { type: Date, default: Date.now() },
  theme: { type: String, default: "light" },
  bio: { type: String, default: "I am a new user" },
});

module.exports = mongoose.model("User", userSchema);
