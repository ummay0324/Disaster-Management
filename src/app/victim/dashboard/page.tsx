'use client';

import { AidRequestForm } from "@/components/victim/aid-request-form";
import { RequestStatusList } from "@/components/victim/request-status-list";
import { mockRequests, mockShelters } from "@/lib/mock-data";
import { AidRequest, Shelter, DisasterType } from "@/lib/types";
import { useState } from "react";
import { ShelterList } from "@/components/victim/shelter-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Map } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function VictimDashboardPage() {
    // In a real app, this would come from a global state or Firestore
    const [activeDisaster, setActiveDisaster] = useState<DisasterType>('flood');
    // In a real app, this would be a Firestore query for the user's requests
    const initialRequests = mockRequests.filter(r => r.status !== 'delivered').slice(0, 2);
    const [myRequests, setMyRequests] = useState<AidRequest[]>(initialRequests);
    const shelters: Shelter[] = mockShelters;
    const shelterMapImage = PlaceHolderImages.find((img) => img.id === 'shelter-map');
    
    const handleNewRequest = () => {
        // This is a simulation. In a real app, a Firestore onSnapshot listener would update the list.
        const newRequest: AidRequest = {
            id: `req${Date.now()}`,
            victimName: 'Me',
            location: 'My Current Location',
            items: ['food', 'water'],
            status: 'pending',
            createdAt: new Date(),
        };
        setMyRequests(prev => [newRequest, ...prev]);
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-8 font-headline">Victim Dashboard</h1>
            
            <div className="grid gap-12 lg:grid-cols-2">
                <div className="space-y-8">
                    <AidRequestForm onSubmitSuccess={handleNewRequest} activeDisaster={activeDisaster} />
                    <RequestStatusList requests={myRequests} />
                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Home className="w-6 h-6" />
                                Available Shelters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ShelterList shelters={shelters} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Map className="w-6 h-6" />
                                Shelters Near You
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                        {shelterMapImage && (
                            <div className="aspect-video w-full overflow-hidden rounded-lg border">
                                <Image
                                    src={shelterMapImage.imageUrl}
                                    alt={shelterMapImage.description}
                                    data-ai-hint={shelterMapImage.imageHint}
                                    width={800}
                                    height={450}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
