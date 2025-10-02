'use client';

import { AidRequestForm } from "@/components/victim/aid-request-form";
import { RequestStatusList } from "@/components/victim/request-status-list";
import { AidRequest, Shelter, DisasterType } from "@/lib/types";
import { useState } from "react";
import { ShelterList } from "@/components/victim/shelter-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Map } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { useAuth, useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function VictimDashboardPage() {
    const { user } = useAuth();
    const firestore = useFirestore();
    const [activeDisaster, setActiveDisaster] = useState<DisasterType>('flood');
    
    const shelterMapImage = PlaceHolderImages.find((img) => img.id === 'shelter-map');

    const requestsQuery = useMemoFirebase(
      () => user ? collection(firestore, 'requests') : null, // Simplified: In a real app, query by victimId
      [firestore, user]
    );
    const { data: myRequests, isLoading: isLoadingRequests } = useCollection<AidRequest>(requestsQuery);

    const sheltersQuery = useMemoFirebase(() => collection(firestore, 'shelters'), [firestore]);
    const { data: shelters, isLoading: isLoadingShelters } = useCollection<Shelter>(sheltersQuery);
    
    const handleNewRequest = (newRequestData: Omit<AidRequest, 'id' | 'createdAt' | 'status' | 'victimName'>) => {
        if (!user) return;
        
        const request: Omit<AidRequest, 'id'> = {
            ...newRequestData,
            victimName: user.displayName || "Anonymous",
            status: 'pending',
            createdAt: new Date(),
        };

        const requestsCollection = collection(firestore, 'requests');
        addDocumentNonBlocking(requestsCollection, request);
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-8 font-headline">Victim Dashboard</h1>
            
            <div className="grid gap-12 lg:grid-cols-2">
                <div className="space-y-8">
                    <AidRequestForm onSubmitSuccess={handleNewRequest} activeDisaster={activeDisaster} />
                    <RequestStatusList requests={myRequests || []} isLoading={isLoadingRequests} />
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
                             <ShelterList shelters={shelters || []} isLoading={isLoadingShelters} />
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
