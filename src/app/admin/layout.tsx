import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';
import { AdminSidebarLayout } from '@/components/admin/admin-sidebar-layout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminUser = mockUsers.find(u => u.role === 'admin') as User;

  return (
    <AdminSidebarLayout user={adminUser}>
        {children}
    </AdminSidebarLayout>
  );
}
