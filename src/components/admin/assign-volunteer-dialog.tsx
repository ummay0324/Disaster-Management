'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { mockVolunteers } from '@/lib/mock-data';
import type { AidRequest } from '@/lib/types';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

interface AssignVolunteerDialogProps {
  request: AidRequest | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onAssign: (requestId: string, volunteerId: string, volunteerName: string) => void;
}

export function AssignVolunteerDialog({
  request,
  isOpen,
  onOpenChange,
  onAssign,
}: AssignVolunteerDialogProps) {
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | undefined>();
  const [isAssigning, setIsAssigning] = useState(false);
  const { toast } = useToast();

  const handleAssign = async () => {
    if (!request || !selectedVolunteerId) return;
    
    setIsAssigning(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const volunteer = mockVolunteers.find(v => v.id === selectedVolunteerId);
    if(volunteer) {
        onAssign(request.id, selectedVolunteerId, volunteer.name);
        toast({
            title: 'Volunteer Assigned',
            description: `${volunteer.name} has been assigned to the request from ${request.victimName}.`,
        });
    }

    setIsAssigning(false);
    onOpenChange(false);
    setSelectedVolunteerId(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Volunteer</DialogTitle>
          <DialogDescription>
            Assign a volunteer to the aid request from {request?.victimName} at {request?.location}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="font-medium">Requested Items:</div>
          <ul className="list-disc list-inside capitalize text-muted-foreground">
            {request?.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <Select onValueChange={setSelectedVolunteerId} value={selectedVolunteerId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a volunteer" />
            </SelectTrigger>
            <SelectContent>
              {mockVolunteers.map((volunteer) => (
                <SelectItem key={volunteer.id} value={volunteer.id}>
                  {volunteer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={!selectedVolunteerId || isAssigning}>
            {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
