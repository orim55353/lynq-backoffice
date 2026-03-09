import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
  type Unsubscribe,
  type WhereFilterOp,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";

// ─── Generic CRUD ──────────────────────────────────────────────

export async function createDocument<T extends DocumentData>(
  collectionPath: string,
  id: string,
  data: T
): Promise<void> {
  const db = getFirebaseDb();
  await setDoc(doc(db, collectionPath, id), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getDocument<T>(
  collectionPath: string,
  id: string
): Promise<T | null> {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, collectionPath, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function updateDocument(
  collectionPath: string,
  id: string,
  data: Partial<DocumentData>
): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, collectionPath, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(
  collectionPath: string,
  id: string
): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, collectionPath, id));
}

// ─── Query helpers ─────────────────────────────────────────────

export async function queryDocuments<T>(
  collectionPath: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const db = getFirebaseDb();
  const q = query(collection(db, collectionPath), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

export function subscribeToCollection<T>(
  collectionPath: string,
  constraints: QueryConstraint[],
  callback: (items: T[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = getFirebaseDb();
  const q = query(collection(db, collectionPath), ...constraints);
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
      callback(items);
    },
    (error) => {
      console.error(`Firestore subscription error [${collectionPath}]:`, error);
      onError?.(error);
    }
  );
}

export function subscribeToDocument<T>(
  collectionPath: string,
  id: string,
  callback: (item: T | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const db = getFirebaseDb();
  return onSnapshot(
    doc(db, collectionPath, id),
    (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      callback({ id: snap.id, ...snap.data() } as T);
    },
    (error) => {
      console.error(`Firestore subscription error [${collectionPath}/${id}]:`, error);
      onError?.(error);
    }
  );
}

// Re-export query builders for convenience
export { where, orderBy, limit, serverTimestamp, collection, doc };
export type { WhereFilterOp, QueryConstraint };
