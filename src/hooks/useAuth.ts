"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithRedirect, signOut, GoogleAuthProvider, User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

const provider = new GoogleAuthProvider();
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authInstance = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAdmin = user?.email === ADMIN_EMAIL;

  const login = () => signInWithRedirect(getFirebaseAuth(), provider);
  const logout = () => signOut(getFirebaseAuth());

  return { user, loading, isAdmin, login, logout };
}
