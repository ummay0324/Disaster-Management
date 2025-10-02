import { Header } from '@/components/header';
import { AlertBanner } from '@/components/alert-banner';
import { mockUsers, mockAlerts } from '@/lib/mock-data';
import type { User } from '@/lib/types';

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const volunteerUser = mockUsers.find(u => u.role === 'volunteer') as User;
  // In a real app, you would fetch active alerts.
  const latestAlert = mockAlerts.length > 0 ? mockAlerts[0] : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={volunteerUser} />
      {latestAlert && <AlertBanner alert={latestAlert} />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
