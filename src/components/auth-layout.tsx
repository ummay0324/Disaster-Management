
'use client';

import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { AlertBanner } from './alert-banner';
import type { DisasterAlert } from '@/lib/types';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isUserLoading } = useAuth();
  const firestore = useFirestore();

  const alertsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'alerts'), orderBy('createdAt', 'desc'), limit(1)) : null,
    [firestore]
  );
  const { data: alerts, isLoading: isLoadingAlerts } = useCollection<DisasterAlert>(alertsQuery);

  const latestAlert = !isLoadingAlerts && alerts && alerts.length > 0 ? alerts[0] : null;

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      {latestAlert && <AlertBanner alert={latestAlert} />}
      {children}
    </>
  );
}
