import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ExtractResultSchema = new Schema(
  {
    // ─── Link back to parent document --
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      unique: true,   // one extract result per document
      index: true,
    },

    // ─── Extract Meta ─────────────────────────────────────────
    extractedAt:     { type: Date, default: Date.now },
    extractDuration: { type: Number, default: null }, 
    pageCount:       { type: Number, default: null }, 
    wordCount:       { type: Number, default: null },  
    chunkCount:      { type: Number, default: null },      
    // ─── Extracted Content--
    fullText: {
      type: String,
      default: null,
      // Atlas Search index created on this field in Atlas UI
    },

    textChunks: {
      type: [String],
      default: [],
      // each chunk ~2000 chars with 200 char overlap
    },

    // ─── Extract Quality--
    isScanned: {
      type: Boolean,
      default: false,   // true if PDF was a scanned image (OCR needed) may be 
    },
    extractionConfidence: {
      type: Number,
      default: null,    //extract ka confidence 
    },
  },
  { timestamps: true }
);

const ExtractResult = model("ExtractResult", ExtractResultSchema);
export default ExtractResult;