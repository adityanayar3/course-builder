const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    content: {
      type: [mongoose.Schema.Types.Mixed], // flexible structured blocks e.g. { type: "paragraph" | "code" | "quiz", data: ... }
      required: [true, "Lesson content is required"],
      default: [],
    },
    isEnriched: {
      type: Boolean,
      default: false, // tracks whether AI has enhanced this lesson
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);