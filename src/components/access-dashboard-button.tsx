'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth, useFirebaseApp } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getFirestore, getDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { UserRole } from '@/lib/types';

export function AccessDashboardButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth().auth!;
  const { user, isUserLoading } = useUser();
  const firestore = getFirestore(useFirebaseApp());

  const getUserRole = async (uid: string): Promise<UserRole> => {
      const adminDoc = await getDoc(doc(firestore, "admins", uid));
      if (adminDoc.exists()) return 'admin';
      
      const volunteerDoc = await getDoc(doc(firestore, "volunteers", uid));
      if (volunteerDoc.exists()) return 'volunteer';
      
      // Default to victim if not found in other collections
      return 'victim';
  };

  const handleAccessDashboard = () => {
    setIsLoading(true);

    if (user) {
        getUserRole(user.uid).then(role => {
            router.push(`/${role}/dashboard`);
        }).catch(() => {
            // Fallback for safety, though getUserRole should always resolve
            router.push('/victim/dashboard');
        });
    } else {
      initiateAnonymousSignIn(auth);
      const unsubscribe = onAuthStateChanged(auth, (newUser) => {
        if (newUser) {
          unsubscribe();
          // Create a 'victim' profile for the new anonymous user
          const userDocRef = doc(firestore, 'victims', newUser.uid);
          
          setDocumentNonBlocking(userDocRef, { 
              id: newUser.uid,
              name: 'Anonymous User',
              email: 'anonymous@example.com',
              location: '',
              phoneNumber: '',
              role: 'victim'
           }, { merge: true });
          
          router.push('/victim/dashboard');
        } else {
            // Handle case where anonymous sign-in fails
            setIsLoading(false);
        }
      });
    }
  };

  return (
    <Button onClick={handleAccessDashboard} disabled={isLoading || isUserLoading} size="lg">
      {(isLoading || isUserLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Access Dashboard
    </Button>
  );
}
