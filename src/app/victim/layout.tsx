'use client';
import { Header } from '@/components/header';
import { AlertBanner } from '@/components/alert-banner';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { DisasterAlert } from '@/lib/types';
import { collection, limit, orderBy, query } from 'firebase/firestore';

export default function VictimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useAuth();
  const firestore = useFirestore();

  const alertsQuery = useMemoFirebase(
    () => query(collection(firestore, 'alerts'), orderBy('createdAt', 'desc'), limit(1)),
    [firestore]
  );
  const { data: alerts, isLoading: isLoadingAlerts } = useCollection<DisasterAlert>(alertsQuery);

  const latestAlert = !isLoadingAlerts && alerts && alerts.length > 0 ? alerts[0] : null;

  return (
    <div className="flex flex-col min-h-screen">
      {!isUserLoading && user && (
        <Header user={{
          id: user.uid,
          name: user.displayName || 'Anonymous Victim',
          email: user.email || 'No Email',
          role: 'victim'
        }} />
      )}
      {latestAlert && <AlertBanner alert={latestAlert} />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
