import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    gender: String,
    dateOfBirth: String,
    about: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deleteRequestedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", ProfileSchema);