'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { X, Siren, Loader2 } from 'lucide-react';
import type { DisasterAlert } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, limit, orderBy, query } from 'firebase/firestore';

const alertIcons = {
  flood: '🌊',
  earthquake: '🌍',
  fire: '🔥',
  heatwave: '⚡',
};

export function AlertBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const firestore = useFirestore();

  const alertsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'alerts'), orderBy('createdAt', 'desc'), limit(1)) : null,
    [firestore]
  );
  const { data: alerts, isLoading: isLoadingAlerts } = useCollection<DisasterAlert>(alertsQuery);

  const latestAlert = !isLoadingAlerts && alerts && alerts.length > 0 ? alerts[0] : null;

  if (isLoadingAlerts) {
    return (
      <div className="container my-4">
        <Alert variant="destructive" className="bg-destructive/20 border-destructive/50 text-destructive-foreground backdrop-blur-md flex items-center gap-4">
          <Loader2 className="h-5 w-5 animate-spin" />
          <AlertDescription>Checking for alerts...</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!latestAlert || !isVisible) {
    return null;
  }

  const Icon = alertIcons[latestAlert.type];

  return (
    <div className="container my-4">
      <Alert variant="destructive" className="bg-destructive/20 border-destructive/50 text-destructive-foreground backdrop-blur-md relative pr-12">
        <Siren className="h-5 w-5 text-destructive" />
        <AlertTitle className="font-bold text-lg text-destructive flex items-center gap-2">
          <span>{Icon}</span>
          Disaster Alert: {latestAlert.type.charAt(0).toUpperCase() + latestAlert.type.slice(1)}
        </AlertTitle>
        <AlertDescription className="text-destructive-foreground/90">
          {latestAlert.message}
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 text-destructive-foreground/70 hover:bg-destructive/20 hover:text-destructive-foreground"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </Alert>
    </div>
  );
}
