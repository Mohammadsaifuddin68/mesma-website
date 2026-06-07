import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type AuditAction =
  | "login"
  | "logout"
  | "user_created"
  | "user_disabled"
  | "user_enabled"
  | "user_deleted"
  | "permissions_updated"
  | "lead_status_updated"
  | "csv_exported"
  | "password_reset_requested";

export async function logAuditAction({
  adminEmail,
  action,
  targetUser = "",
  leadId = "",
  details = "",
}: {
  adminEmail: string;
  action: AuditAction;
  targetUser?: string;
  leadId?: string;
  details?: string;
}) {
  try {
    await addDoc(collection(db, "audit_logs"), {
      adminEmail,
      action,
      targetUser,
      leadId,
      details,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Failed to log audit action:", error);
    // Non-critical failure — don't block main action
  }
}
