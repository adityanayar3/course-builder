const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    auth0Sub: {
      type: String,
      required: [true, "Auth0 sub is required"],
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    picture: {
      type: String, // profile picture URL from Auth0
    },
    role: {
      type: String,
      enum: ["learner", "creator", "admin"],
      default: "learner",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);