export type UserRole = 'victim' | 'volunteer' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber?: string;
  location?: string;
  availability?: boolean;
};

export type AidRequestItem = 'food' | 'water' | 'medicine' | 'medical help' | 'boat transport' | 'life jackets' | 'blankets' | 'tents';

export type AidRequest = {
  id: string;
  victimId: string;
  victimName: string;
  location: string;
  items: AidRequestItem[];
  status: 'pending' | 'assigned' | 'delivered';
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  createdAt: Date;
};

export type DisasterType = 'flood' | 'earthquake' | 'fire' | 'heatwave';

export type DisasterAlert = {
    id: string;
    type: DisasterType;
    message: string;
    createdAt: Date;
}

export type Shelter = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentOccupancy: number;
  latitude: number;
  longitude: number;
};

export type InventoryItem = {
    id: AidRequestItem;
    name: string;
    quantity: number;
    threshold: number;
}
