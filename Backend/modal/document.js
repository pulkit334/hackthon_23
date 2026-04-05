import mongoose from "mongoose";

const { Schema, model } = mongoose;

const DocumentSchema = new Schema(
  {
    // ─── Ownership 
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sector: {
      type: String,
      required: true,
      enum: ["legal", "finance"],
      index: true,
    },

    // ─── File Identity
    originalName: { type: String, required: true },
    mimeType:     { type: String, required: true },
    sizeBytes:    { type: Number, required: true },
    fileHash:     { type: String, required: true, unique: true, index: true },

    // ─── Cloudinary 
    cloudinaryUrl: { type: String },
    cloudinaryId:  { type: String },

    // ─── Pipeline State 
    status: {
      type: String,
      enum: [
        "queued",
        "processed",
         "scanning",
        "extracting",
        "analysing",
        "done",
        "blocked",
        "failed",
      ],
      default: "queued",
      index: true,
    },
    jobId:         { type: String, default: null },
    failureReason: { type: String, default: null },

  //ref
    cyberResultId:   {
      type: Schema.Types.ObjectId,
      ref: "CyberResult",
      default: null,
    },
    extractResultId: {
      type: Schema.Types.ObjectId,
      ref: "ExtractResult",
      default: null,
    }, 
    aiResultId:      {
      type: Schema.Types.ObjectId,
      ref: "AiResult",
      default: null,
    },

    version:           { type: Number, default: 1 },
    previousVersionId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },
  },
  { timestamps: true }
);

DocumentSchema.index({ uploadedBy: 1, status: 1, createdAt: -1 });

const Document = model("Document", DocumentSchema);
export default Document;