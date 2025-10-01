'use client';

import { AidRequestForm } from "@/components/victim/aid-request-form";
import { RequestStatusList } from "@/components/victim/request-status-list";
import { mockRequests } from "@/lib/mock-data";
import { AidRequest } from "@/lib/types";
import { useState } from "react";

export default function VictimDashboardPage() {
    // In a real app, this would be a Firestore query for the user's requests
    const initialRequests = mockRequests.filter(r => r.status !== 'delivered').slice(0, 2);
    const [myRequests, setMyRequests] = useState<AidRequest[]>(initialRequests);
    
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
                    <AidRequestForm onSubmitSuccess={handleNewRequest} />
                </div>
                <div className="space-y-8">
                    <RequestStatusList requests={myRequests} />
                </div>
            </div>
        </div>
    );
}
