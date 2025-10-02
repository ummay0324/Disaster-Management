'use client';

import type { DisasterAlert } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const alertIcons = {
  flood: '🌊',
  earthquake: '🌍',
  fire: '🔥',
  heatwave: '⚡',
};

interface AlertListProps {
  alerts: DisasterAlert[];
  isLoading: boolean;
}

export function AlertList({ alerts, isLoading }: AlertListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed rounded-lg bg-card/50">
        <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium text-muted-foreground">No Active Alerts</h3>
        <p className="mt-1 text-sm text-muted-foreground">Broadcasted alerts will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
      {alerts.map((alert) => (
        <div key={alert.id} className="border p-4 rounded-lg bg-card/50">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{alertIcons[alert.type]}</span>
              <div>
                <p className="font-semibold capitalize">
                  {alert.type} Warning
                </p>
                <p className="text-sm text-muted-foreground">
                  {alert.createdAt ? formatDistanceToNow(new Date(alert.createdAt as any), { addSuffix: true }) : 'Just now'}
                </p>
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm">{alert.message}</p>
        </div>
      ))}
    </div>
  );
}
