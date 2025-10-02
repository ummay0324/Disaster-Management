import type { AidRequest, User, DisasterAlert, Shelter } from './types';

export const mockUsers: User[] = [
  { id: 'user1', name: 'Admin User', email: 'admin@relief.link', role: 'admin' },
  { id: 'user2', name: 'Maria Garcia', email: 'volunteer1@relief.link', role: 'volunteer' },
  { id: 'user3', name: 'John Smith', email: 'volunteer2@relief.link', role: 'volunteer' },
  { id: 'user4', name: 'Victim One', email: 'victim1@relief.link', role: 'victim' },
  { id: 'user5', name: 'Victim Two', email: 'victim2@relief.link', role: 'victim' },
  { id: 'user6', name: 'Chen Wei', email: 'volunteer3@relief.link', role: 'volunteer' },
];

export const mockVolunteers: User[] = mockUsers.filter(u => u.role === 'volunteer');

export const mockRequests: AidRequest[] = [
  {
    id: 'req1',
    victimName: 'Family in North Sector',
    location: '123 Main St, Cityville',
    items: ['food', 'water'],
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 'req2',
    victimName: 'Elderly Couple',
    location: '456 Oak Ave, Townburg',
    items: ['medicine', 'medical help'],
    status: 'assigned',
    assignedVolunteerId: 'user2',
    assignedVolunteerName: 'Maria Garcia',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: 'req3',
    victimName: 'Community Shelter',
    location: '789 Pine Ln, Villagetown',
    items: ['food', 'water', 'medicine'],
    status: 'delivered',
    assignedVolunteerId: 'user3',
    assignedVolunteerName: 'John Smith',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
    {
    id: 'req4',
    victimName: 'Individual at Bridge',
    location: '101 Elm Ct, Hamlet',
    items: ['water'],
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
  },
];


export const mockAlerts: DisasterAlert[] = [
    {
        id: 'alert1',
        type: 'flood',
        message: 'Major flood warning for the Cityville area. Please seek higher ground immediately.',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    }
];

export const mockShelters: Shelter[] = [
    {
        id: 'shelter1',
        name: 'Cityville Community Center',
        location: '100 Center St, Cityville',
        capacity: 100,
        currentOccupancy: 45,
        latitude: 34.0522,
        longitude: -118.2437,
    },
    {
        id: 'shelter2',
        name: 'Townburg High School Gym',
        location: '200 High School Dr, Townburg',
        capacity: 250,
        currentOccupancy: 180,
        latitude: 34.0600,
        longitude: -118.2500,
    },
    {
        id: 'shelter3',
        name: 'Villagetown Elementary',
        location: '300 Schoolhouse Rd, Villagetown',
        capacity: 75,
        currentOccupancy: 75,
        latitude: 34.0450,
        longitude: -118.2300,
    }
]
