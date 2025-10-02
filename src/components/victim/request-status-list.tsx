'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AidRequest } from '@/lib/types';
import { format } from 'date-fns';
import { CheckCircle, CircleDot, MailQuestion, UserCheck, QrCode } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Image from 'next/image';

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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MailQuestion className="w-6 h-6"/>
                    My Requests
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold text-muted-foreground">You have no active requests.</h2>
                    <p className="text-muted-foreground mt-2">Use the form above to request aid.</p>
                </div>
            </CardContent>
      </Card>
    );
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <MailQuestion className="w-6 h-6"/>
                My Requests
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {requests.map((request) => {
                const status = statusConfig[request.status];
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(request.id)}&size=200x200`;

                return (
                    <div key={request.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className='flex-1'>
                            <p className="font-semibold capitalize">Request for: {request.items.join(', ')}</p>
                            <p className="text-sm text-muted-foreground">
                                Submitted on {format(request.createdAt, 'PPP p')}
                            </p>
                            {request.status === 'assigned' && request.assignedVolunteerName && (
                                <p className="text-sm text-primary mt-1">
                                    Volunteer {request.assignedVolunteerName} is on the way.
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {request.status !== 'delivered' && (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm"><QrCode className="mr-2 h-4 w-4"/>Show QR</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Your Aid Request QR Code</DialogTitle>
                                            <DialogDescription>
                                                Show this to the volunteer to confirm your request.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className='flex justify-center p-4'>
                                            <Image src={qrCodeUrl} alt={`QR Code for request ${request.id}`} width={200} height={200} />
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                            <Badge variant="outline" className={`border-2 text-base ${status.className}`}>
                                <status.icon className="mr-2 h-4 w-4" />
                                {status.label}
                            </Badge>
                        </div>
                    </div>
                );
            })}
        </CardContent>
    </Card>
  );
}