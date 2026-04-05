import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: false,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,

    },

    accountType: {
      type: String,
      enum: ["admin","user"],
      required: true,
    },

    additionalDetails: {
      type: mongoose.Schema.ObjectId,
      ref: "Profile",
    },


    status: {
      type: String,
      enum: ["Active", "InActive", "Blocked"],
      default: "Active",
    },

    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    googleId: { type: String },
    recoveryToken: {
      type: String,
    },

    recoveryTokenExpires: {
      type: Date,
    },

    token: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },

    isdeleted: {
      type: Boolean,
      default: false,
    },

    deleteRequestedAt: {
      type: Date,
      default: null,
    },

    // NEW: FCM token for push notifications
    fcmToken: {
      type: String,
      default: null,
    },

    notificationPreferences: {
      broadcastAll: {
        type: Boolean,
        default: true,
      },
      purchaseOnly: {
        type: Boolean,
        default: false,
      },
      paymentReminders: {
        type: Boolean,
        default: true,
      },
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });
userSchema.index({ fcmToken: 1 });
userSchema.index({ "notificationPreferences.broadcastAll": 1 });

export default mongoose.model("User", userSchema);
