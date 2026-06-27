// create a lesson model using mongoose
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: [mongoose.Schema.Types.Mixed], required: true }, // flexible structured blocks
  isEnriched: { type: Boolean, default: false }, // to track if AI-enhanced
  module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" }
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;