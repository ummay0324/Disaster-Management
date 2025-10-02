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
import type { AidRequest, User } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, CircleDot, UserCheck, QrCode, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';

interface RequestsTableProps {
  requests: AidRequest[];
  onAssignClick: (request: AidRequest) => void;
  volunteers: User[];
  isLoading: boolean;
}

const statusConfig = {
    pending: { label: 'Pending', icon: CircleDot, color: 'bg-red-500', className: 'text-red-500 border-red-500/50'},
    assigned: { label: 'Assigned', icon: UserCheck, color: 'bg-yellow-500', className: 'text-yellow-500 border-yellow-500/50'},
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-500', className: 'text-green-500 border-green-500/50'},
}

export function RequestsTable({ requests, onAssignClick, volunteers, isLoading }: RequestsTableProps) {
    
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Victim</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Requested</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead className="text-center">QR Code</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => {
            const status = statusConfig[request.status];
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(request.id)}&size=200x200`;

            return (
                <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.victimName}</TableCell>
                    <TableCell>{request.location}</TableCell>
                    <TableCell className='capitalize'>{request.items.join(', ')}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={`border-2 ${status.className}`}>
                            <status.icon className="mr-2 h-3.5 w-3.5" />
                            {status.label}
                        </Badge>
                    </TableCell>
                    <TableCell>{request.createdAt ? formatDistanceToNow(new Date(request.createdAt as any), { addSuffix: true }) : 'Just now'}</TableCell>
                    <TableCell>{request.assignedVolunteerName || 'N/A'}</TableCell>
                    <TableCell className="text-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon"><QrCode className="h-5 w-5"/></Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Request ID: {request.id}</DialogTitle>
                                </DialogHeader>
                                <div className='flex justify-center p-4'>
                                    <Image src={qrCodeUrl} alt={`QR Code for request ${request.id}`} width={200} height={200} />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </TableCell>
                    <TableCell className="text-right">
                    {request.status === 'pending' && (
                        <Button variant="default" size="sm" onClick={() => onAssignClick(request)}>
                        Assign
                        </Button>
                    )}
                    </TableCell>
                </TableRow>
            )
        })}
      </TableBody>
    </Table>
  );
}
