import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE"],
      required: true
    },
    resource: {
      type: String,
      enum: ["FLIGHT"],
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userRole: {
      type: String,
      enum: ["ARL", "AOT", "USR"],
      required: true
    },
    resourceId: {
      type: String,
      required: true
    },
    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed
    },
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS"
    },
    errorMessage: String
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);