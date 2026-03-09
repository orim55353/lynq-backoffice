"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { onAuthChange, signOut as firebaseSignOut, type User } from "@/lib/firebase";
import { subscribeToDocument } from "@/lib/firebase/firestore";
import type { UserProfile } from "@/lib/firebase/types";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  orgId: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  orgId: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToDocument<UserProfile>(
      "users",
      user.uid,
      (userProfile) => {
        setProfile(userProfile);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const handleSignOut = useCallback(async () => {
    await firebaseSignOut();
    setUser(null);
    setProfile(null);
  }, []);

  const orgId = profile?.activeOrgId ?? null;

  return (
    <AuthContext.Provider value={{ user, profile, orgId, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
