import { InventoryDashboard } from "@/components/admin/inventory-dashboard";
import { mockInventory, mockRequests } from "@/lib/mock-data";

export default function InventoryPage() {
    // In a real app, this data would be fetched from Firestore
    const inventory = mockInventory;
    const requests = mockRequests;

    return <InventoryDashboard initialInventory={inventory} requests={requests} />;
}
