'use client';
import { InventoryDashboard } from "@/components/admin/inventory-dashboard";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { AidRequest, InventoryItem } from "@/lib/types";
import { collection } from "firebase/firestore";

export default function InventoryPage() {
    const firestore = useFirestore();

    const inventoryQuery = useMemoFirebase(() => collection(firestore, 'inventory'), [firestore]);
    const { data: inventoryData, isLoading: isLoadingInventory } = useCollection<InventoryItem>(inventoryQuery);

    const requestsQuery = useMemoFirebase(() => collection(firestore, 'requests'), [firestore]);
    const { data: requestsData, isLoading: isLoadingRequests } = useCollection<AidRequest>(requestsQuery);

    return <InventoryDashboard 
        initialInventory={inventoryData || []} 
        requests={requestsData || []}
        isLoading={isLoadingInventory || isLoadingRequests}
    />;
}
