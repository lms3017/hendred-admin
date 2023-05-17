import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@config/firebase';

export const AuthContext = React.createContext<User | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={user}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
