"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface AdminPermissions {
  dashboard: boolean;
  viewLeads: boolean;
  editLeadStatus: boolean;
  exportLeads: boolean;
  manageAdmins: boolean;
  auditLogs: boolean;
  settings: boolean;
  createAdmins: boolean;
  disableAdmins: boolean;
  deleteAdmins: boolean;
  analytics: boolean;
  systemConfig: boolean;
}

export interface AdminProfile {
  uid: string;
  name: string;
  email: string;
  role: "super_admin" | "admin";
  active: boolean;
  permissions: AdminPermissions;
  createdAt: any;
}

interface AdminContextType {
  user: User | null;
  adminProfile: AdminProfile | null;
  loading: boolean;
  isSuperAdmin: boolean;
  can: (permission: keyof AdminPermissions) => boolean;
}

const AdminContext = createContext<AdminContextType>({
  user: null,
  adminProfile: null,
  loading: true,
  isSuperAdmin: false,
  can: () => false,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setAdminProfile(null);
        setLoading(false);
        return;
      }

      // Subscribe to admin profile in Firestore
      const adminRef = doc(db, "admins", firebaseUser.uid);
      const unsubscribeFirestore = onSnapshot(adminRef, (docSnap) => {
        if (docSnap.exists()) {
          setAdminProfile({ uid: firebaseUser.uid, ...docSnap.data() } as AdminProfile);
        } else {
          setAdminProfile(null); // User exists in Auth but not in admins collection
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching admin profile:", error);
        setAdminProfile(null);
        setLoading(false);
      });

      return () => unsubscribeFirestore();
    });

    return () => unsubscribeAuth();
  }, []);

  const isSuperAdmin = adminProfile?.role === "super_admin";

  const can = (permission: keyof AdminPermissions): boolean => {
    if (!adminProfile || !adminProfile.active) return false;
    if (adminProfile.role === "super_admin") return true;
    return adminProfile.permissions?.[permission] === true;
  };

  return (
    <AdminContext.Provider value={{ user, adminProfile, loading, isSuperAdmin, can }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
