const mongoose = require("mongoose");

const languageExplanationSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
    audioData: { type: String, default: "" },  // Base64 audio data
    audioMimeType: { type: String, default: "audio/mpeg" },
  },
  { _id: false }
);

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      unique: true, // prevents duplicate news from being saved twice
    },
    sourceName: {
      type: String,
      required: true,
    },
    publishedDate: {
      type: Date,
      required: true,
    },
    originalSummary: {
      type: String, // short RSS summary, used only as AI input context, never shown raw to users
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    explanations: {
      en: { type: languageExplanationSchema, default: () => ({}) },
      ta: { type: languageExplanationSchema, default: () => ({}) },
      hi: { type: languageExplanationSchema, default: () => ({}) },
      ml: { type: languageExplanationSchema, default: () => ({}) },
    },
    processed: {
      type: Boolean,
      default: false, // true once AI explanation + TTS audio generation is complete
    },
    aiProvider: {
      type: String, // "groq" or "gemini" - tracks which provider generated this
      default: "",
    },
    fetchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for fast "latest news" queries
newsSchema.index({ publishedDate: -1 });

module.exports = mongoose.model("News", newsSchema);