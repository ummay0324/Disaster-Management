export type UserRole = 'victim' | 'volunteer' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AidRequest = {
  id: string;
  victimName: string;
  location: string;
  items: ('food' | 'water' | 'medicine' | 'medical help')[];
  status: 'pending' | 'assigned' | 'delivered';
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  createdAt: Date;
};
