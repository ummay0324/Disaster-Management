'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AidRequest } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { CheckCircle, CircleDot, MailQuestion, UserCheck, QrCode, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import Image from 'next/image';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';

interface RequestStatusListProps {
  requests: AidRequest[];
  isLoading: boolean;
  title: string;
  sessionRequestId?: string | null;
}

const statusConfig = {
    pending: { label: 'Pending', icon: CircleDot, className: 'text-yellow-500 border-yellow-500/50'},
    assigned: { label: 'Assigned', icon: UserCheck, className: 'text-blue-500 border-blue-500/50'},
    delivered: { label: 'Delivered', icon: CheckCircle, className: 'text-green-500 border-green-500/50'},
}

export function RequestStatusList({ requests, isLoading, title, sessionRequestId }: RequestStatusListProps) {
  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MailQuestion className="w-6 h-6"/>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
      </Card>
    )
  }
  
  if (requests.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MailQuestion className="w-6 h-6"/>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold text-muted-foreground">No pending requests.</h2>
                    <p className="text-muted-foreground mt-2">New requests from the community will appear here.</p>
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
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            {requests.map((request) => {
                const status = statusConfig[request.status];
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(request.id)}&size=200x200`;
                const isUsersRequest = request.id === sessionRequestId;

                return (
                    <div key={request.id} className={cn("border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4 transition-all", isUsersRequest && "ring-2 ring-primary shadow-lg")}>
                        <div className='flex-1'>
                            <p className="font-semibold capitalize flex items-center gap-2">
                                {isUsersRequest && <Star className="h-5 w-5 text-primary" />}
                                Request from {request.victimName}
                            </p>
                            <p className="text-sm text-muted-foreground capitalize">
                                Needs: {request.items.join(', ')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {request.createdAt ? `Submitted ${formatDistanceToNow(new Date(request.createdAt as any), { addSuffix: true })}` : 'Submitting...'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm"><QrCode className="mr-2 h-4 w-4"/>Show QR</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Request ID QR Code</DialogTitle>
                                        <DialogDescription>
                                            Show this to the volunteer to confirm the aid delivery.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className='flex justify-center p-4'>
                                        <Image src={qrCodeUrl} alt={`QR Code for request ${request.id}`} width={200} height={200} />
                                    </div>
                                </DialogContent>
                            </Dialog>
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
