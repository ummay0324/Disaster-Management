import { Header } from '@/components/header';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';

export default function VictimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const victimUser = mockUsers.find(u => u.role === 'victim') as User;

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={victimUser} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
