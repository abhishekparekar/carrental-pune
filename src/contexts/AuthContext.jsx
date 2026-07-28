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
        firebaseUser.email.toLowerCase().includes('admin') ||
        firebaseUser.email.toLowerCase().includes('saselfdrive') ||
        firebaseUser.email.toLowerCase().endsWith('@nextrent.com')
      )) {
        adminDoc = await registerAdminUser(DEFAULT_TENANT_ID, firebaseUser.uid, {
          email: firebaseUser.email,
          name: 'Admin',
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
    const cleanEmail = email.trim().toLowerCase();
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

    // Target official admin email: admin@saselfdrivecars.com
    const targetEmail = (cleanEmail === 'admin@nextrent.com' || cleanEmail === 'admin@saselfdrivecars.com')
      ? 'admin@saselfdrivecars.com'
      : cleanEmail;

    // 1. Try direct sign-in with targetEmail & entered password
    try {
      const result = await signInWithEmailAndPassword(auth, targetEmail, password);
      await verifyAdminRoleInFirestore(result.user);
      toast.success('Admin Sign In Successful!');
      return result;
    } catch (firstErr) {
      console.log('First login attempt:', firstErr.message);

      // 2. If entered password is Shubham@1234 (or shubham@1234), try previous variations to update
      if (password === 'Shubham@1234' || password === 'shubham@1234' || password === 'admin123') {
        const passVariations = ['Shubham@1234', 'shubham@1234', 'admin123'];
        for (const oldPass of passVariations) {
          try {
            const fallbackRes = await signInWithEmailAndPassword(auth, targetEmail, oldPass);
            try {
              await updatePassword(fallbackRes.user, 'Shubham@1234');
            } catch (upErr) {
              console.log('Update password note:', upErr.message);
            }
            await verifyAdminRoleInFirestore(fallbackRes.user);
            toast.success('Admin Sign In Successful!');
            return fallbackRes;
          } catch {
            // try next variation
          }
        }

        // 3. If account doesn't exist yet in Firebase Auth, create official admin@saselfdrivecars.com
        try {
          const createRes = await createUserWithEmailAndPassword(auth, 'admin@saselfdrivecars.com', 'Shubham@1234');
          await registerAdminUser(DEFAULT_TENANT_ID, createRes.user.uid, {
            email: 'admin@saselfdrivecars.com',
            name: 'Admin',
            role: 'admin',
          });
          setAdminRole('admin');
          setIsAdmin(true);
          toast.success('Admin Account Created & Signed In!');
          return createRes;
        } catch (createErr) {
          if (createErr.code === 'auth/email-already-in-use') {
            // Try legacy admin@nextrent.com and update email to admin@saselfdrivecars.com
            try {
              const legacyRes = await signInWithEmailAndPassword(auth, 'admin@nextrent.com', password);
              await verifyAdminRoleInFirestore(legacyRes.user);
              toast.success('Admin Sign In Successful!');
              return legacyRes;
            } catch (legErr) {
              console.error(legErr);
            }
          }
        }
      }

      // If wrong email or password
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

  const createAdmin = async (email = 'admin@saselfdrivecars.com', password = 'Shubham@1234', name = 'Admin') => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (res.user) {
        await registerAdminUser(DEFAULT_TENANT_ID, res.user.uid, {
          email: res.user.email,
          name: name || 'Admin',
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
