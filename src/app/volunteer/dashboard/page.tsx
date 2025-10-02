'use client';

import { TaskCard } from '@/components/volunteer/task-card';
import { AidRequest } from '@/lib/types';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';


export default function VolunteerDashboardPage() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const tasksQuery = useMemoFirebase(
    () => user ? query(
        collection(firestore, 'requests'), 
        where('assignedVolunteerId', '==', user.uid),
        where('status', 'in', ['assigned', 'delivered'])
      ) : null,
    [firestore, user]
  );
  
  const { data: assignedTasks, isLoading } = useCollection<AidRequest>(tasksQuery);


  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline">My Assigned Tasks</h1>
            <p className="text-muted-foreground mt-1">Scan the victim's QR code upon delivery to complete the task.</p>
        </div>
      
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {!isLoading && assignedTasks && assignedTasks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignedTasks.map(task => (
            <TaskCard key={task.id} request={task} />
          ))}
        </div>
      ) : (
        !isLoading && <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
          <h2 className="text-xl font-semibold text-muted-foreground">No tasks assigned yet.</h2>
          <p className="text-muted-foreground mt-2">Check back later for new assignments.</p>
        </div>
      )}
    </div>
  );
}
