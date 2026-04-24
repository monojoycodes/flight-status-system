import AuditLog from "../models/auditLog.js";

export const logAudit = async (req, action, resource, resourceId, before = null, after = null, status = "SUCCESS", errorMessage = null) => {
  try {
    await AuditLog.create({
      action,
      resource,
      userId: req.user?.id,
      userRole: req.user?.role,
      resourceId,
      changes: { before, after },
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      status,
      errorMessage
    });
  } catch (error) {
    console.error("Failed to log audit:", error);
  }
};