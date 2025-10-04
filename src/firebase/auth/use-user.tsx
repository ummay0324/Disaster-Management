'use client';
import { useState, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

// This type now represents the user object we expect in the app,
// which is simpler without full Firebase auth.
export interface AppUser {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  // Add other relevant user properties here if needed in the future
}

export interface UseUserResult {
  user: AppUser | null;
  isUserLoading: boolean;
}

/**
 * A simplified hook for providing a mock user context without real authentication.
 * This hook is intended for development or for apps where authentication is not required.
 *
 * @returns {UseUserResult} An object containing the mock user and loading state.
 */
export const useUser = (): UseUserResult => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const auth = useAuth(); // We still need the auth instance to check for a user.

  useEffect(() => {
    // In a no-auth setup, we can simulate an anonymous or default user.
    // Or, we can simply have no user. For this app, anonymous access is fine.
    
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
            setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
            });
        } else {
            // No user is signed in.
            setUser(null);
        }
        setIsUserLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  return { user, isUserLoading };
};
