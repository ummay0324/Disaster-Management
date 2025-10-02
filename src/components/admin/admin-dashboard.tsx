'use client';

import { AssignVolunteerDialog } from '@/components/admin/assign-volunteer-dialog';
import { RequestsTable } from '@/components/admin/requests-table';
import { BroadcastAlertForm } from '@/components/admin/broadcast-alert-form';
import { AlertList } from '@/components/alert-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { AidRequest, DisasterAlert, Shelter } from '@/lib/types';
import { Home, MapPin, Megaphone, Siren } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ShelterManagementTable } from './shelter-management-table';
import { mockShelters } from '@/lib/mock-data';

interface AdminDashboardClientProps {
  initialRequests: AidRequest[];
  initialAlerts: DisasterAlert[];
}

export function AdminDashboard({ initialRequests, initialAlerts }: AdminDashboardClientProps) {
  const [requests, setRequests] = useState<AidRequest[]>(initialRequests);
  const [alerts, setAlerts] = useState<DisasterAlert[]>(initialAlerts);
  const [shelters, setShelters] = useState<Shelter[]>(mockShelters);
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

  const handleNewAlert = (newAlert: DisasterAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleUpdateOccupancy = (shelterId: string, newOccupancy: number) => {
    setShelters(prev => prev.map(s => s.id === shelterId ? { ...s, currentOccupancy: newOccupancy } : s));
  };


  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-6 h-6" />
                  Broadcast Alert
              </CardTitle>
          </CardHeader>
          <CardContent>
              <BroadcastAlertForm onAlertSent={handleNewAlert} />
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Siren className="w-6 h-6" />
                  Active Alerts
              </CardTitle>
          </CardHeader>
          <CardContent>
              <AlertList alerts={alerts} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-6 h-6" />
            Shelter Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ShelterManagementTable shelters={shelters} onUpdateOccupancy={handleUpdateOccupancy}/>
        </CardContent>
      </Card>
      
      <Card>
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
