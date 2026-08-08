import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, AccessRequest, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from '../data/products';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

const DEFAULT_ALLOWED = [
  'mikiskymew@gmail.com',
  'sp-deeprom@gmail.com',
  'sp.deeprom@gmail.com',
  'somchai.hvac@gmail.com'
];

/**
 * Real-time listener for Products
 */
export function subscribeProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
) {
  const colRef = collection(db, 'products');

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // First-time seed from INITIAL_PRODUCTS to Firestore
        console.log('Seeding initial products to Firestore...');
        try {
          const batch = writeBatch(db);
          INITIAL_PRODUCTS.forEach((p) => {
            const pRef = doc(db, 'products', p.id);
            batch.set(pRef, p);
          });
          await batch.commit();
        } catch (e) {
          console.error('Error seeding products:', e);
        }
        onUpdate(INITIAL_PRODUCTS);
      } else {
        const productsList: Product[] = [];
        snapshot.forEach((docSnap) => {
          productsList.push(docSnap.data() as Product);
        });
        onUpdate(productsList);
      }
    },
    (err) => {
      console.warn('Firestore products subscribe error, fallback to local state:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save single product or batch products to Firestore
 */
export async function saveProductToFirestore(product: Product) {
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, product, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to save product to Firestore:', err);
    return false;
  }
}

export async function saveAllProductsToFirestore(products: Product[]) {
  try {
    const batch = writeBatch(db);
    products.forEach((p) => {
      const docRef = doc(db, 'products', p.id);
      batch.set(docRef, p, { merge: true });
    });
    await batch.commit();
    return true;
  } catch (err) {
    console.error('Failed to save batch products to Firestore:', err);
    return false;
  }
}

export async function deleteProductFromFirestore(productId: string) {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error('Failed to delete product from Firestore:', err);
    return false;
  }
}

/**
 * Real-time listener for Allowed Emails
 */
export function subscribeAllowedEmails(
  onUpdate: (emails: string[]) => void
) {
  const docRef = doc(db, 'settings', 'access_control');

  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await setDoc(docRef, { allowedEmails: DEFAULT_ALLOWED });
        } catch (e) {
          console.error('Failed to seed allowed emails:', e);
        }
        onUpdate(DEFAULT_ALLOWED);
      } else {
        const data = snapshot.data();
        const list = Array.isArray(data?.allowedEmails) ? data.allowedEmails : DEFAULT_ALLOWED;
        onUpdate(list);
      }
    },
    (err) => {
      console.warn('Firestore allowed emails error:', err);
      onUpdate(DEFAULT_ALLOWED);
    }
  );
}

export async function saveAllowedEmailsToFirestore(emails: string[]) {
  try {
    const docRef = doc(db, 'settings', 'access_control');
    await setDoc(docRef, { allowedEmails: emails }, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to save allowed emails:', err);
    return false;
  }
}

/**
 * Real-time listener for Access Requests
 */
export function subscribeAccessRequests(
  onUpdate: (requests: AccessRequest[]) => void
) {
  const colRef = collection(db, 'access_requests');

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: AccessRequest[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as AccessRequest);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
      onUpdate(list);
    },
    (err) => {
      console.warn('Firestore access requests subscribe error:', err);
    }
  );
}

export async function addAccessRequestToFirestore(request: AccessRequest) {
  try {
    const docRef = doc(db, 'access_requests', request.id);
    await setDoc(docRef, request);
    return true;
  } catch (err) {
    console.error('Failed to add access request:', err);
    return false;
  }
}

export async function updateAccessRequestStatusInFirestore(id: string, status: 'APPROVED' | 'REJECTED') {
  try {
    const docRef = doc(db, 'access_requests', id);
    await updateDoc(docRef, { status });
    return true;
  } catch (err) {
    console.error('Failed to update access request:', err);
    return false;
  }
}

/**
 * Real-time listener for Orders
 */
export function subscribeOrders(
  onUpdate: (orders: Order[]) => void
) {
  const colRef = collection(db, 'orders');

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          INITIAL_ORDERS.forEach((ord) => {
            const oRef = doc(db, 'orders', ord.id);
            batch.set(oRef, ord);
          });
          await batch.commit();
        } catch (e) {
          console.error('Failed to seed initial orders:', e);
        }
        onUpdate(INITIAL_ORDERS);
      } else {
        const list: Order[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Order);
        });
        onUpdate(list);
      }
    },
    (err) => {
      console.warn('Firestore orders subscribe error:', err);
    }
  );
}

export async function saveOrderToFirestore(order: Order) {
  try {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, order);
    return true;
  } catch (err) {
    console.error('Failed to save order to Firestore:', err);
    return false;
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: Order['status'], trackingNo?: string) {
  try {
    const docRef = doc(db, 'orders', orderId);
    const updates: any = { status };
    if (trackingNo) updates.trackingNo = trackingNo;
    await updateDoc(docRef, updates);
    return true;
  } catch (err) {
    console.error('Failed to update order status:', err);
    return false;
  }
}

/**
 * System Security PIN Management
 */
export function subscribeSecurityPin(
  onUpdate: (pin: string) => void
) {
  const docRef = doc(db, 'settings', 'security_pin');

  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        const defaultPin = '8888';
        try {
          await setDoc(docRef, { pin: defaultPin });
        } catch (e) {
          console.error('Failed to set default security pin:', e);
        }
        onUpdate(defaultPin);
      } else {
        const data = snapshot.data();
        onUpdate(data?.pin || '8888');
      }
    },
    () => {
      onUpdate('8888');
    }
  );
}

export async function updateSecurityPinInFirestore(newPin: string) {
  try {
    const docRef = doc(db, 'settings', 'security_pin');
    await setDoc(docRef, { pin: newPin }, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to update security PIN:', err);
    return false;
  }
}
