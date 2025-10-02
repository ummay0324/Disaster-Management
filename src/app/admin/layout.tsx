import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { AdminHeader } from '@/components/admin/admin-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUser = mockUsers.find(u => u.role === 'admin') as User;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader user={adminUser} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
