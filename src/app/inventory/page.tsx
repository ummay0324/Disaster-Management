'use client';
import { InventoryDashboard } from "@/components/admin/inventory-dashboard";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { AidRequest, InventoryItem } from "@/lib/types";
import { collection } from "firebase/firestore";
import { Header } from '@/components/header';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';


export default function InventoryPage() {
    const firestore = useFirestore();
    const adminUser = mockUsers.find(u => u.role === 'admin') as User;


    const inventoryQuery = useMemoFirebase(() => collection(firestore, 'inventory'), [firestore]);
    const { data: inventoryData, isLoading: isLoadingInventory } = useCollection<InventoryItem>(inventoryQuery);

    const requestsQuery = useMemoFirebase(() => collection(firestore, 'requests'), [firestore]);
    const { data: requestsData, isLoading: isLoadingRequests } = useCollection<AidRequest>(requestsQuery);

    return (
        <div className="flex flex-col min-h-screen">
            <Header user={adminUser} />
            <main className="flex-1">
                <InventoryDashboard 
                    initialInventory={inventoryData || []} 
                    requests={requestsData || []}
                    isLoading={isLoadingInventory || isLoadingRequests}
                />
            </main>
        </div>
    )
}
