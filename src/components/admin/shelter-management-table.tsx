'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import type { Shelter } from '@/lib/types';
import { Pencil } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ShelterManagementTableProps {
  shelters: Shelter[];
  onUpdateOccupancy: (shelterId: string, newOccupancy: number) => void;
}

export function ShelterManagementTable({ shelters, onUpdateOccupancy }: ShelterManagementTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shelter Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead className="text-center">Occupancy</TableHead>
          <TableHead className="w-[200px]">Capacity</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shelters.map((shelter) => {
            const occupancyPercentage = (shelter.currentOccupancy / shelter.capacity) * 100;
            const isFull = shelter.currentOccupancy >= shelter.capacity;
            return (
                <TableRow key={shelter.id}>
                    <TableCell className="font-medium">{shelter.name}</TableCell>
                    <TableCell>{shelter.location}</TableCell>
                    <TableCell className="text-center">
                        {shelter.currentOccupancy} / {shelter.capacity}
                        {isFull && <Badge variant="destructive" className="ml-2">Full</Badge>}
                    </TableCell>
                    <TableCell>
                        <Progress value={occupancyPercentage} className="h-3" />
                    </TableCell>
                    <TableCell className="text-right">
                        <UpdateOccupancyDialog shelter={shelter} onUpdate={onUpdateOccupancy} />
                    </TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  );
}

function UpdateOccupancyDialog({ shelter, onUpdate }: { shelter: Shelter, onUpdate: (shelterId: string, newOccupancy: number) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [newOccupancy, setNewOccupancy] = useState(shelter.currentOccupancy);
    const { toast } = useToast();

    const handleUpdate = () => {
        if (newOccupancy > shelter.capacity || newOccupancy < 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Occupancy',
                description: `Occupancy must be between 0 and ${shelter.capacity}.`
            });
            return;
        }
        onUpdate(shelter.id, newOccupancy);
        toast({
            title: "Occupancy Updated",
            description: `Occupancy for ${shelter.name} set to ${newOccupancy}.`
        });
        setIsOpen(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-2" /> Update</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Occupancy for {shelter.name}</DialogTitle>
                    <DialogDescription>
                        Current capacity is {shelter.capacity}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="occupancy">New Occupancy</Label>
                    <Input 
                        id="occupancy" 
                        type="number" 
                        value={newOccupancy}
                        onChange={(e) => setNewOccupancy(Number(e.target.value))}
                        max={shelter.capacity}
                        min={0}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
