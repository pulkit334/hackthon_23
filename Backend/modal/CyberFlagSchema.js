import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CyberResultSchema = new Schema(
  {
    // ─── Link back to parent document 
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      unique: true,   
      index: true,
    },

    // ─── Scan Metadata
    scannedAt:    { type: Date, default: Date.now },
    scanDuration: { type: Number, default: null },   

    // ─── Cyber Flags --
    malware:     { type: Boolean, default: false }, 
    piiDetected: { type: Boolean, default: false },  
    piiTypes:    { type: [String], default: [] },    // ["phone", "email", "aadhaar"]
    mimeSpoof:   { type: Boolean, default: false },  //Is the file lying about its type?

    // ─── Final Verdict--
    passed: {   
      type: Boolean,
      default: true,    
    },
    blockedReasons: {
      type: [String],
      default: [],      
    },

    // // ─── Raw Scanner Output (for audit trail)--
    // rawScanReport: {
    //   type: Schema.Types.Mixed,
    //   default: null, 
    // },
  },
  { timestamps: true }
);

const CyberResult = model("CyberResult", CyberResultSchema);
export default CyberResult;
// magic bytes (file signature)