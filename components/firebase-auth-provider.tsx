"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { firebaseAuth } from "@/lib/firebase";

type FirebaseAuthContextValue = {
  user: User | null;
  loading: boolean;
};

const FirebaseAuthContext = createContext<FirebaseAuthContextValue>({
  user: null,
  loading: true,
});

export function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth, (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      }),
    [],
  );

  const value = useMemo(() => ({ user, loading }), [user, loading]);
  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth() {
  return useContext(FirebaseAuthContext);
}
