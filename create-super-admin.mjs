import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// The config from .env.local
const firebaseConfig = {
  apiKey: "AIzaSyCkMOWh__8zd6q0ZU5fpj5JG3q3E63Nfes",
  authDomain: "mesma-admin-68.firebaseapp.com",
  projectId: "mesma-admin-68",
  storageBucket: "mesma-admin-68.firebasestorage.app",
  messagingSenderId: "662737215913",
  appId: "1:662737215913:web:77f2908a5213cf8cebe4b8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createSuperAdmin() {
  const email = "mohammadsaifuddin68@gmail.com";
  const password = "Mesma_Saif@1413";
  
  try {
    console.log("Creating user in Firebase Auth...");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User created with UID:", user.uid);
    
    console.log("Adding user to Firestore admins collection...");
    await setDoc(doc(db, "admins", user.uid), {
      name: "Mohammad Saifuddin",
      email: email,
      role: "super_admin",
      active: true,
      permissions: {
        dashboard: true,
        viewLeads: true,
        editLeadStatus: true,
        exportLeads: true,
        manageAdmins: true,
        auditLogs: true,
        settings: true,
        createAdmins: true,
        disableAdmins: true,
        deleteAdmins: true,
        analytics: true,
        systemConfig: true
      },
      createdAt: new Date()
    });
    console.log("Super Admin successfully created in Firestore!");
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("User already exists in Auth. Updating Firestore...");
      try {
        await signInWithEmailAndPassword(auth, email, password);
        const user = auth.currentUser;
        await setDoc(doc(db, "admins", user.uid), {
          name: "Mohammad Saifuddin",
          email: email,
          role: "super_admin",
          active: true,
          permissions: {
            dashboard: true,
            viewLeads: true,
            editLeadStatus: true,
            exportLeads: true,
            manageAdmins: true,
            auditLogs: true,
            settings: true,
            createAdmins: true,
            disableAdmins: true,
            deleteAdmins: true,
            analytics: true,
            systemConfig: true
          },
          createdAt: new Date()
        });
        console.log("Firestore updated for existing user.");
        process.exit(0);
      } catch(err) {
         console.error("Error signing in:", err);
         process.exit(1);
      }
    } else {
      console.error("Error creating super admin:", error);
      process.exit(1);
    }
  }
}

createSuperAdmin();
