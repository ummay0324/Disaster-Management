import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { mockAlerts, mockRequests } from '@/lib/mock-data';

export default async function AdminDashboardPage() {
  // In a real app, you would fetch this data from Firestore
  const requests = mockRequests;
  const alerts = mockAlerts;

  return <AdminDashboard initialRequests={requests} initialAlerts={alerts} />;
}
