import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { mockRequests } from '@/lib/mock-data';

export default async function AdminDashboardPage() {
  // In a real app, you would fetch this data from Firestore
  const requests = mockRequests;

  return <AdminDashboard initialRequests={requests} />;
}
