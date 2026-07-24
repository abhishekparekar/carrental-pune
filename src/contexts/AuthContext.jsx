import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { getAdminUser, registerAdminUser } from '../firebase/firestore';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
const DEFAULT_TENANT_ID = 'nextrent-demo';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [adminRole, setAdminRole] = useState(null); // 'admin' | null
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to verify & fetch admin role from Firestore
  const verifyAdminRoleInFirestore = async (firebaseUser) => {
    if (!firebaseUser) {
      setAdminRole(null);
      setIsAdmin(false);
      return false;
    }

    try {
      // 1. Fetch document from Firestore admins collection
      let adminDoc = await getAdminUser(DEFAULT_TENANT_ID, firebaseUser.uid);

      // 2. Auto-provision default admin role in Firestore if authorized email
      if (!adminDoc && firebaseUser.email && (
        firebaseUser.email.toLowerCase().startsWith('admin') ||
        firebaseUser.email.toLowerCase().endsWith('@nextrent.com')
      )) {
        adminDoc = await registerAdminUser(DEFAULT_TENANT_ID, firebaseUser.uid, {
          email: firebaseUser.email,
          name: firebaseUser.email.split('@')[0],
          role: 'admin',
        });
      }

      // 3. Check role === 'admin'
      if (adminDoc && adminDoc.role === 'admin') {
        setAdminRole('admin');
        setIsAdmin(true);
        return true;
      } else {
        setAdminRole(null);
        setIsAdmin(false);
        return false;
      }
    } catch (err) {
      console.error('Error fetching admin record from Firestore:', err);
      setAdminRole(null);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await verifyAdminRoleInFirestore(firebaseUser);
      } else {
        setAdminRole(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const msg = 'Please enter a valid email address';
      toast.error(msg);
      throw new Error(msg);
    }
    if (!password || password.length < 6) {
      const msg = 'Password must be at least 6 characters long';
      toast.error(msg);
      throw new Error(msg);
    }

    // 1. Try signing in with the provided password
    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, password);
      await verifyAdminRoleInFirestore(result.user);
      toast.success('Admin Sign In Successful!');
      return result;
    } catch (firstErr) {
      // 2. Fallback check for default admin email: if password was originally 'admin123', try 'admin123' and update password to 'shubham@1234'
      if (cleanEmail.toLowerCase() === 'admin@nextrent.com' || cleanEmail.toLowerCase().startsWith('admin')) {
        try {
          const fallbackRes = await signInWithEmailAndPassword(auth, cleanEmail, 'admin123');
          // Update password to shubham@1234 in Firebase Auth
          try {
            await updatePassword(fallbackRes.user, password);
          } catch (updateErr) {
            console.log('Password update note:', updateErr.message);
          }
          await verifyAdminRoleInFirestore(fallbackRes.user);
          toast.success('Admin Sign In Successful!');
          return fallbackRes;
        } catch (fallbackErr) {
          // If account doesn't exist in Firebase Auth yet, create it
          if (fallbackErr.code === 'auth/user-not-found' || fallbackErr.code === 'auth/invalid-credential') {
            try {
              const createRes = await createUserWithEmailAndPassword(auth, cleanEmail, password);
              await registerAdminUser(DEFAULT_TENANT_ID, createRes.user.uid, {
                email: createRes.user.email,
                name: cleanEmail.split('@')[0],
                role: 'admin',
              });
              setAdminRole('admin');
              setIsAdmin(true);
              toast.success('Admin Account Created & Signed In!');
              return createRes;
            } catch (cErr) {
              console.error(cErr);
            }
          }
        }
      }

      // If user typed wrong password
      const msg = 'Invalid password or email. Access denied.';
      toast.error(msg);
      throw new Error(msg);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setAdminRole(null);
    setIsAdmin(false);
    toast.success('Signed out');
  };

  const createAdmin = async (email, password = 'shubham@1234', name, role = 'admin') => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res.user) {
        await registerAdminUser(DEFAULT_TENANT_ID, res.user.uid, {
          email: res.user.email,
          name: name || email.split('@')[0],
          role: 'admin',
        });
        setAdminRole('admin');
        setIsAdmin(true);
      }
      return res;
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        return signIn(email, password);
      }
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, adminRole, isAdmin, loading, signIn, signOut, createAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
