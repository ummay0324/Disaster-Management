'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Shelter } from '@/lib/types';
import { Building, Users, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ShelterListProps {
  shelters: Shelter[];
}

export function ShelterList({ shelters }: ShelterListProps) {
  if (shelters.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
        <h2 className="text-xl font-semibold text-muted-foreground">No shelters available.</h2>
        <p className="text-muted-foreground mt-2">Check back later for updates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shelters.map((shelter) => {
        const isFull = shelter.currentOccupancy >= shelter.capacity;
        const occupancyRate = shelter.capacity > 0 ? (shelter.currentOccupancy / shelter.capacity) * 100 : 0;
        let capacityColor = "text-green-600";
        if (occupancyRate > 75) capacityColor = "text-yellow-600";
        if (occupancyRate >= 100) capacityColor = "text-red-600";
        
        return (
          <div key={shelter.id} className="border p-4 rounded-lg flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <h3 className="font-semibold flex items-center gap-2"><Building className="h-5 w-5" /> {shelter.name}</h3>
                {isFull && <Badge variant="destructive">Full</Badge>}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4" />{shelter.location}</p>
            <div className="flex justify-between items-center text-sm">
                <div className={`flex items-center gap-2 font-medium ${capacityColor}`}>
                    <Users className="h-4 w-4" />
                    <span>{shelter.currentOccupancy} / {shelter.capacity} Occupied</span>
                </div>
                <Button asChild variant="outline" size="sm">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.location)}`} target="_blank" rel="noopener noreferrer">
                        Get Directions
                        <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
