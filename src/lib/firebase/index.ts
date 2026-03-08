// Client-side Firebase services
export {
  getFirebaseAuth,
  getFirebaseDb,
  getFirebaseStorage,
  getFirebaseFunctions,
  getFirebaseAnalytics,
} from "./config";

// Auth helpers
export {
  signIn,
  signUp,
  signInWithGoogle,
  signOut,
  resetPassword,
  onAuthChange,
  type User,
} from "./auth";

// Firestore helpers
export {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  subscribeToCollection,
  subscribeToDocument,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "./firestore";
