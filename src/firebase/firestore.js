// Multi-Tenant Firestore Helpers
// All data is scoped under: tenants/{tenantId}/{collection}/{docId}

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// ─── Tenant Scoping ────────────────────────────────────────────────────────────
/**
 * Returns the Firestore collection reference scoped to a tenant.
 * Path: tenants/{tenantId}/{collectionName}
 */
export function tenantCollection(tenantId, collectionName) {
  return collection(db, 'tenants', tenantId, collectionName);
}

/**
 * Returns a document reference scoped to a tenant.
 * Path: tenants/{tenantId}/{collectionName}/{docId}
 */
export function tenantDoc(tenantId, collectionName, docId) {
  return doc(db, 'tenants', tenantId, collectionName, docId);
}

// ─── Cars ──────────────────────────────────────────────────────────────────────
export async function getCars(tenantId) {
  const ref = query(tenantCollection(tenantId, 'cars'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getCar(tenantId, carId) {
  const ref = tenantDoc(tenantId, 'cars', carId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function addCar(tenantId, carData) {
  const ref = tenantCollection(tenantId, 'cars');
  return addDoc(ref, { ...carData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateCar(tenantId, carId, updates) {
  const ref = tenantDoc(tenantId, 'cars', carId);
  return updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
}

export async function deleteCar(tenantId, carId) {
  return deleteDoc(tenantDoc(tenantId, 'cars', carId));
}

export function subscribeToCars(tenantId, callback) {
  const ref = query(tenantCollection(tenantId, 'cars'), orderBy('createdAt', 'desc'));
  return onSnapshot(ref, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── Bookings ──────────────────────────────────────────────────────────────────
export async function getBookings(tenantId) {
  const ref = query(tenantCollection(tenantId, 'bookings'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getBooking(tenantId, bookingId) {
  const snap = await getDoc(tenantDoc(tenantId, 'bookings', bookingId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function addBooking(tenantId, bookingData) {
  const ref = tenantCollection(tenantId, 'bookings');
  const docRef = await addDoc(ref, {
    ...bookingData,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Upsert customer record
  if (bookingData.customerEmail) {
    await upsertCustomer(tenantId, {
      name: bookingData.customerName,
      email: bookingData.customerEmail,
      phone: bookingData.customerPhone || '',
    });
  }

  return docRef;
}

export async function updateBookingStatus(tenantId, bookingId, status) {
  return updateDoc(tenantDoc(tenantId, 'bookings', bookingId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBooking(tenantId, bookingId) {
  return deleteDoc(tenantDoc(tenantId, 'bookings', bookingId));
}

export function subscribeToBookings(tenantId, callback) {
  const ref = query(tenantCollection(tenantId, 'bookings'), orderBy('createdAt', 'desc'));
  return onSnapshot(ref, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeToRecentBookings(tenantId, callback, n = 5) {
  const ref = query(
    tenantCollection(tenantId, 'bookings'),
    orderBy('createdAt', 'desc'),
    limit(n)
  );
  return onSnapshot(ref, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── Customers ─────────────────────────────────────────────────────────────────
export async function getCustomers(tenantId) {
  const ref = query(tenantCollection(tenantId, 'customers'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function upsertCustomer(tenantId, { name, email, phone }) {
  // Check if customer with this email already exists
  const ref = query(
    tenantCollection(tenantId, 'customers'),
    where('email', '==', email),
    limit(1)
  );
  const snap = await getDocs(ref);

  if (!snap.empty) {
    // Update last seen
    await updateDoc(snap.docs[0].ref, {
      name,
      phone: phone || snap.docs[0].data().phone,
      lastBooking: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return snap.docs[0].id;
  } else {
    const docRef = await addDoc(tenantCollection(tenantId, 'customers'), {
      name,
      email,
      phone: phone || '',
      lastBooking: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }
}

export function subscribeToCustomers(tenantId, callback) {
  const ref = query(tenantCollection(tenantId, 'customers'), orderBy('createdAt', 'desc'));
  return onSnapshot(ref, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

// ─── Inquiries ─────────────────────────────────────────────────────────────────
export async function addInquiry(tenantId, inquiryData) {
  return addDoc(tenantCollection(tenantId, 'inquiries'), {
    ...inquiryData,
    status: 'new',
    createdAt: serverTimestamp(),
  });
}

export function subscribeToInquiries(tenantId, callback) {
  const ref = query(tenantCollection(tenantId, 'inquiries'), orderBy('createdAt', 'desc'));
  return onSnapshot(ref, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function updateInquiryStatus(tenantId, inquiryId, status) {
  return updateDoc(tenantDoc(tenantId, 'inquiries', inquiryId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteInquiry(tenantId, inquiryId) {
  return deleteDoc(tenantDoc(tenantId, 'inquiries', inquiryId));
}

// ─── Stats ─────────────────────────────────────────────────────────────────────
export async function getDashboardStats(tenantId) {
  const [cars, bookings, customers, inquiries] = await Promise.all([
    getDocs(tenantCollection(tenantId, 'cars')),
    getDocs(tenantCollection(tenantId, 'bookings')),
    getDocs(tenantCollection(tenantId, 'customers')),
    getDocs(tenantCollection(tenantId, 'inquiries')),
  ]);

  const bookingDocs = bookings.docs.map(d => d.data());
  const confirmedBookings = bookingDocs.filter(b => b.status === 'confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return {
    totalCars: cars.size,
    totalBookings: bookings.size,
    totalCustomers: customers.size,
    totalInquiries: inquiries.size,
    totalRevenue,
    pendingBookings: bookingDocs.filter(b => b.status === 'pending').length,
    newInquiries: inquiries.docs.filter(d => d.data().status === 'new').length,
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
// ─── Admin Roles & Authentication Scoping ────────────────────────────────────
export async function getAdminUser(tenantId, uid) {
  try {
    const snap = await getDoc(tenantDoc(tenantId, 'admins', uid));
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    // Fallback global check
    const globalSnap = await getDoc(doc(db, 'admins', uid));
    if (globalSnap.exists()) {
      return { id: globalSnap.id, ...globalSnap.data() };
    }
    return null;
  } catch (err) {
    console.error('Error fetching admin user:', err);
    return null;
  }
}

export async function registerAdminUser(tenantId, uid, { email, name, role = 'admin' }) {
  try {
    const adminData = {
      uid,
      email,
      name: name || email.split('@')[0],
      role: 'admin',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(tenantDoc(tenantId, 'admins', uid), adminData, { merge: true });
    // Also save in global admins for cross-tenant support
    await setDoc(doc(db, 'admins', uid), adminData, { merge: true });
    return adminData;
  } catch (err) {
    console.error('Error registering admin user:', err);
    throw err;
  }
}

export function formatTimestamp(ts) {
  if (!ts) return '—';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

export { serverTimestamp, Timestamp };

