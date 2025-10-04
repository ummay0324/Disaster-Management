'use client';

import { AidRequestForm } from "@/components/victim/aid-request-form";
import { RequestStatusList } from "@/components/victim/request-status-list";
import { AidRequest, Shelter, DisasterType } from "@/lib/types";
import { useState, useEffect } from "react";
import { ShelterList } from "@/components/victim/shelter-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Map } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { addDoc } from "firebase/firestore";

export default function VictimDashboardPage() {
    const firestore = useFirestore();
    const [activeDisaster, setActiveDisaster] = useState<DisasterType>('flood');
    const [sessionRequestId, setSessionRequestId] = useState<string | null>(null);
    
    useEffect(() => {
        // On component mount, check if there's a request ID in session storage
        const storedRequestId = sessionStorage.getItem('session_request_id');
        if (storedRequestId) {
            setSessionRequestId(storedRequestId);
        }
    }, []);
    
    const shelterMapImage = PlaceHolderImages.find((img) => img.id === 'shelter-map');

    // Show all pending requests since we don't have a specific user
    const requestsQuery = useMemoFirebase(
      () => query(collection(firestore, 'requests'), where('status', '==', 'pending')),
      [firestore]
    );
    const { data: allRequests, isLoading: isLoadingRequests } = useCollection<AidRequest>(requestsQuery);

    const sheltersQuery = useMemoFirebase(() => collection(firestore, 'shelters'), [firestore]);
    const { data: shelters, isLoading: isLoadingShelters } = useCollection<Shelter>(sheltersQuery);
    
    const handleNewRequest = async (newRequestData: Omit<AidRequest, 'id' | 'createdAt' | 'status' | 'victimId'>) => {
        const request: Omit<AidRequest, 'id'> = {
            ...newRequestData,
            victimId: 'anonymous', // No user context
            status: 'pending',
            createdAt: new Date(),
        };

        const requestsCollection = collection(firestore, 'requests');
        try {
            const docRef = await addDoc(requestsCollection, request);
            // Store the new request ID in session storage to track it
            sessionStorage.setItem('session_request_id', docRef.id);
            setSessionRequestId(docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
    
    const isPageLoading = isLoadingRequests || isLoadingShelters;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-8 font-headline">Request Aid</h1>
            
            <div className="grid gap-12 lg:grid-cols-2">
                <div className="space-y-8">
                    <AidRequestForm onSubmitSuccess={handleNewRequest} activeDisaster={activeDisaster} />
                    <RequestStatusList 
                        requests={allRequests || []} 
                        isLoading={isLoadingRequests} 
                        title="All Pending Requests"
                        sessionRequestId={sessionRequestId}
                    />
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
