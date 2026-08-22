const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: [mongoose.Schema.Types.Mixed], required: true },
    isEnriched: { type: Boolean, default: false }, // to track if AI-enhanced
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" }
});

