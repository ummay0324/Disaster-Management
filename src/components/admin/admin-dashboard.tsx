'use client';

import { AssignVolunteerDialog } from '@/components/admin/assign-volunteer-dialog';
import { RequestsTable } from '@/components/admin/requests-table';
import { BroadcastAlertForm } from '@/components/admin/broadcast-alert-form';
import { AlertList } from '@/components/alert-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { AidRequest, DisasterAlert, Shelter, DisasterType, User } from '@/lib/types';
import { Home, Megaphone, Siren, TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { ShelterManagementTable } from './shelter-management-table';
import { ActiveDisasterForm } from './active-disaster-form';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { mockVolunteers } from '@/lib/mock-data';

export function AdminDashboard() {
  const firestore = useFirestore();
  const [activeDisaster, setActiveDisaster] = useState<DisasterType>('flood');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AidRequest | null>(null);

  const requestsQuery = useMemoFirebase(() => collection(firestore, 'requests'), [firestore]);
  const { data: requests, isLoading: isLoadingRequests } = useCollection<AidRequest>(requestsQuery);

  const alertsQuery = useMemoFirebase(() => collection(firestore, 'alerts'), [firestore]);
  const { data: alerts, isLoading: isLoadingAlerts } = useCollection<DisasterAlert>(alertsQuery);

  const sheltersQuery = useMemoFirebase(() => collection(firestore, 'shelters'), [firestore]);
  const { data: shelters, isLoading: isLoadingShelters } = useCollection<Shelter>(sheltersQuery);

  // In a real app, volunteers would be a collection in Firestore.
  // We'll continue to use mock data for assignment simplicity for now.
  const volunteers: User[] = mockVolunteers;

  const handleAssignClick = (request: AidRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleAssignVolunteer = (requestId: string, volunteerId: string, volunteerName: string) => {
    if (!requests) return;
    const requestDocRef = doc(firestore, 'requests', requestId);
    updateDocumentNonBlocking(requestDocRef, {
      status: 'assigned',
      assignedVolunteerId: volunteerId,
      assignedVolunteerName: volunteerName,
    });
  };

  const handleNewAlert = (newAlert: Omit<DisasterAlert, 'id' | 'createdAt'>) => {
    const alertsCollection = collection(firestore, 'alerts');
    addDocumentNonBlocking(alertsCollection, {
      ...newAlert,
      createdAt: new Date(),
    });
  };

  const handleUpdateOccupancy = (shelterId: string, newOccupancy: number) => {
    if (!shelters) return;
    const shelterDocRef = doc(firestore, 'shelters', shelterId);
    updateDocumentNonBlocking(shelterDocRef, { currentOccupancy: newOccupancy });
  };


  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <TriangleAlert className="w-6 h-6" />
                  Active Disaster
              </CardTitle>
          </CardHeader>
          <CardContent>
              <ActiveDisasterForm currentDisaster={activeDisaster} onDisasterChange={setActiveDisaster} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
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
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Siren className="w-6 h-6" />
                  Active Alerts
              </CardTitle>
          </CardHeader>
          <CardContent>
              <AlertList alerts={alerts || []} isLoading={isLoadingAlerts} />
          </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-6 h-6" />
            Shelter Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ShelterManagementTable shelters={shelters || []} onUpdateOccupancy={handleUpdateOccupancy} isLoading={isLoadingShelters} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestsTable requests={requests || []} onAssignClick={handleAssignClick} volunteers={volunteers} isLoading={isLoadingRequests} />
        </CardContent>
      </Card>

      <AssignVolunteerDialog
        request={selectedRequest}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAssign={handleAssignVolunteer}
        volunteers={volunteers}
      />
    </div>
  );
}
