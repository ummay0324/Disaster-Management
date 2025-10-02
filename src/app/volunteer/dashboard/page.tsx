import { TaskCard } from '@/components/volunteer/task-card';
import { mockRequests } from '@/lib/mock-data';

export default async function VolunteerDashboardPage() {
  // In a real app, this would be a Firestore query for tasks assigned to the current user
  const assignedTasks = mockRequests.filter(req => req.status === 'assigned' || req.status === 'delivered');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8 font-headline">My Assigned Tasks</h1>
      
      {assignedTasks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignedTasks.map(task => (
            <TaskCard key={task.id} request={task} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
          <h2 className="text-xl font-semibold text-muted-foreground">No tasks assigned yet.</h2>
          <p className="text-muted-foreground mt-2">Check back later for new assignments.</p>
        </div>
      )}
    </div>
  );
}
