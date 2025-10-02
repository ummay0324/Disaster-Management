'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AidRequest } from '@/lib/types';
import { format } from 'date-fns';
import { CheckCircle, CircleDot, UserCheck } from 'lucide-react';

interface RequestStatusListProps {
  requests: AidRequest[];
}

const statusConfig = {
    pending: { label: 'Pending', icon: CircleDot, className: 'text-yellow-500 border-yellow-500/50'},
    assigned: { label: 'Assigned', icon: UserCheck, className: 'text-blue-500 border-blue-500/50'},
    delivered: { label: 'Delivered', icon: CheckCircle, className: 'text-green-500 border-green-500/50'},
}

export function RequestStatusList({ requests }: RequestStatusListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed border-white/20 rounded-lg bg-black/20 backdrop-blur-lg">
        <h2 className="text-xl font-semibold text-gray-300">You have no active requests.</h2>
        <p className="text-gray-400 mt-2">Use the form to request aid.</p>
      </div>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>My Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {requests.map((request) => {
                const status = statusConfig[request.status];
                return (
                    <div key={request.id} className="border border-white/10 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/20">
                        <div>
                            <p className="font-semibold capitalize">Request for: {request.items.join(', ')}</p>
                            <p className="text-sm text-gray-400">
                                Submitted on {format(request.createdAt, 'PPP p')}
                            </p>
                            {request.status === 'assigned' && request.assignedVolunteerName && (
                                <p className="text-sm text-primary mt-1">
                                    Volunteer {request.assignedVolunteerName} is on the way.
                                </p>
                            )}
                        </div>
                        <Badge variant="outline" className={`border-2 text-base ${status.className}`}>
                            <status.icon className="mr-2 h-4 w-4" />
                            {status.label}
                        </Badge>
                    </div>
                );
            })}
        </CardContent>
    </Card>
  );
}
