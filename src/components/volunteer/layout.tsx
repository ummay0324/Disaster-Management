'use client';
import { Header } from '@/components/header';
import { useAuth } from '@/firebase';

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isUserLoading && user && (
        <Header user={{
          id: user.uid,
          name: user.displayName || 'Anonymous Volunteer',
          email: user.email || 'No Email',
          role: 'volunteer'
        }} />
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}
