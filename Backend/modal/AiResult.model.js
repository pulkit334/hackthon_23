import mongoose from "mongoose";

const { Schema, model } = mongoose;

const DOCUMENT_PROC_PIPELINE = [
  "Download the PDF from the provided Cloudinary URL only. Do not access any other source.",
  "Extract raw text from the downloaded PDF using pdf-parse. Do not interpret or modify the content yet.",
  "Clean the extracted text by removing headers, footers, page numbers, and extra whitespace only. Do not remove any actual content.",
  "Chunk the cleaned text into segments of 2000 characters with 200 character overlap. Do not summarise or alter chunk content.",
  "Generate a one paragraph plain English summary of the full document. Do not add any information not present in the document.",
  "Classify the document into exactly one category based on sector. Do not assign multiple classifications.",
  "Extract parties, dates, monetary value, and jurisdiction from the text only. Do not infer values that are not explicitly written.",
  "Score the document risk from 0 to 100 based only on what is present in the text. Do not assume missing clauses unless their absence is detectable.",
  "List the exact reasons for the risk score using only evidence found in the document text.",
  "Return a single structured JSON object with all outputs. Do not return plain text, markdown, or any format other than raw JSON.",
  "Do not hallucinate. If a field cannot be determined from the document text, return null for that field.",
  "Do not access the internet. Do not use any knowledge outside the provided document text.",
];

const AiResultSchema = new Schema(
  {
    // ─── Linking to Parent account 
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      unique: true,
      index: true,
    },

  
    summary:        { type: String,   default: null },
    classification: { type: String,   default: null },
    tags:           { type: [String], default: []   },

    // ─── Risk -> Modal
    riskScore:   { type: Number, min: 0, max: 100, default: null },
    riskReasons: { type: [String], default: [] },
  
    // ─── Extracted fields-> Out-put
    parties:      { type: [String], default: []   },
    dates:        { type: [String], default: []   },
    value:        { type: String,   default: null },
    jurisdiction: { type: String,   default: null },
    customFields: { type: mongoose.Schema.Types.Mixed, default: {} },
    // customFields shape per sector:
    // legal:       { terminationNotice, liabilityCap, autoRenewal }
    // finance:     { invoiceNumber, poNumber, taxAmount }
    // healthcare:  { patientId, diagnosisCode, providerId }
    // engineering: { projectCode, revision }
  },
  { timestamps: true }
);

AiResultSchema.statics.PIPELINE = DOCUMENT_PROC_PIPELINE;

const AiResult = model("AiResult", AiResultSchema);
export default AiResult;