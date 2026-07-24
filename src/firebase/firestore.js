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

export async function addCar(tenantId, carData, adminUid = null) {
  const ref = tenantCollection(tenantId, 'cars');
  return addDoc(ref, {
    tenantId,
    createdBy: adminUid || 'admin',
    ...carData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateCar(tenantId, carId, updates, adminUid = null) {
  const ref = tenantDoc(tenantId, 'cars', carId);
  return updateDoc(ref, {
    ...updates,
    tenantId,
    updatedBy: adminUid || 'admin',
    updatedAt: serverTimestamp(),
  });
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

export async function addBooking(tenantId, bookingData, userId = null) {
  const ref = tenantCollection(tenantId, 'bookings');
  const activeUserId = userId || bookingData.userId || 'guest';
  const docRef = await addDoc(ref, {
    tenantId,
    userId: activeUserId,
    createdBy: activeUserId,
    ...bookingData,
    status: bookingData.status || 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Upsert customer record
  if (bookingData.customerEmail || bookingData.email) {
    await upsertCustomer(tenantId, {
      name: bookingData.customerName || bookingData.name,
      email: bookingData.customerEmail || bookingData.email,
      phone: bookingData.customerPhone || bookingData.phone || '',
    }, activeUserId);
  }

  return docRef;
}

export async function updateBookingStatus(tenantId, bookingId, status, adminUid = null) {
  return updateDoc(tenantDoc(tenantId, 'bookings', bookingId), {
    tenantId,
    status,
    updatedBy: adminUid || 'admin',
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

export async function upsertCustomer(tenantId, { name, email, phone }, userId = null) {
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
      tenantId,
      name,
      phone: phone || snap.docs[0].data().phone,
      userId: userId || snap.docs[0].data().userId || 'guest',
      lastBooking: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return snap.docs[0].id;
  } else {
    const docRef = await addDoc(tenantCollection(tenantId, 'customers'), {
      tenantId,
      userId: userId || 'guest',
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
export async function addInquiry(tenantId, inquiryData, userId = null) {
  const activeUserId = userId || inquiryData.userId || 'guest';
  return addDoc(tenantCollection(tenantId, 'inquiries'), {
    tenantId,
    userId: activeUserId,
    createdBy: activeUserId,
    ...inquiryData,
    status: inquiryData.status || 'new',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function subscribeToInquiries(tenantId, callback) {
  const ref = query(tenantCollection(tenantId, 'inquiries'), orderBy('createdAt', 'desc'));
  return onSnapshot(ref, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function updateInquiryStatus(tenantId, inquiryId, status, adminUid = null) {
  return updateDoc(tenantDoc(tenantId, 'inquiries', inquiryId), {
    tenantId,
    status,
    updatedBy: adminUid || 'admin',
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

