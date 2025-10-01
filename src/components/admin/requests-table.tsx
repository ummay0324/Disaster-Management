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
import type { AidRequest } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, CircleDot, UserCheck } from 'lucide-react';

interface RequestsTableProps {
  requests: AidRequest[];
  onAssignClick: (request: AidRequest) => void;
}

const statusConfig = {
    pending: { label: 'Pending', icon: CircleDot, color: 'bg-red-500', className: 'text-red-500 border-red-500/50'},
    assigned: { label: 'Assigned', icon: UserCheck, color: 'bg-yellow-500', className: 'text-yellow-500 border-yellow-500/50'},
    delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-500', className: 'text-green-500 border-green-500/50'},
}

export function RequestsTable({ requests, onAssignClick }: RequestsTableProps) {
    
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
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => {
            const status = statusConfig[request.status];
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
                    <TableCell>{formatDistanceToNow(request.createdAt, { addSuffix: true })}</TableCell>
                    <TableCell>{request.assignedVolunteerName || 'N/A'}</TableCell>
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
