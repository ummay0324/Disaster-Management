import { Header } from '@/components/header';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const volunteerUser = mockUsers.find(u => u.role === 'volunteer') as User;

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={volunteerUser} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
