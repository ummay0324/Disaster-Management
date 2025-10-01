'use client';

import { AssignVolunteerDialog } from '@/components/admin/assign-volunteer-dialog';
import { RequestsTable } from '@/components/admin/requests-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { AidRequest } from '@/lib/types';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface AdminDashboardClientProps {
  initialRequests: AidRequest[];
}

export function AdminDashboard({ initialRequests }: AdminDashboardClientProps) {
  const [requests, setRequests] = useState<AidRequest[]>(initialRequests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AidRequest | null>(null);
  const mapImage = PlaceHolderImages.find((img) => img.id === 'map');

  const handleAssignClick = (request: AidRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleAssignVolunteer = (requestId: string, volunteerId: string, volunteerName: string) => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId
          ? { ...req, status: 'assigned', assignedVolunteerId: volunteerId, assignedVolunteerName: volunteerName }
          : req
      )
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            Live Aid Requests Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mapImage && (
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                    src={mapImage.imageUrl}
                    alt={mapImage.description}
                    data-ai-hint={mapImage.imageHint}
                    width={1600}
                    height={900}
                    className="object-cover w-full h-full"
                />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestsTable requests={requests} onAssignClick={handleAssignClick} />
        </CardContent>
      </Card>

      <AssignVolunteerDialog
        request={selectedRequest}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAssign={handleAssignVolunteer}
      />
    </div>
  );
}
