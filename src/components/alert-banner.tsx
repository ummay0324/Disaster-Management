'use client';

import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from './ui/button';
import { X, Siren } from 'lucide-react';
import type { DisasterAlert } from '@/lib/types';

const alertIcons = {
  flood: '🌊',
  earthquake: '🌍',
  fire: '🔥',
  heatwave: '⚡',
};

interface AlertBannerProps {
  alert: DisasterAlert;
}

export function AlertBanner({ alert }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const Icon = alertIcons[alert.type];

  return (
    <div className="container my-4">
      <Alert variant="destructive" className="bg-destructive/10 border-destructive/50 text-destructive-foreground relative pr-12">
        <Siren className="h-5 w-5 text-destructive" />
        <AlertTitle className="font-bold text-lg text-destructive flex items-center gap-2">
          <span>{Icon}</span>
          Disaster Alert: {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
        </AlertTitle>
        <AlertDescription className="text-destructive-foreground/90">
          {alert.message}
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
