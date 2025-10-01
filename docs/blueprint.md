# **App Name**: ReliefLink

## Core Features:

- User Authentication: Secure login/signup with role selection (Victim, Volunteer, Admin) using Firebase Auth and role stored in Firestore.
- Aid Request Submission: Form for victims to request aid (food, water, medicine, medical help), auto-fetching location via Google Maps API, and submitting requests to Firestore.
- Request Tracking: Victims can track the status of their requests (Pending / Assigned / Delivered).
- Volunteer Task Dashboard: Volunteers' dashboard displaying assigned tasks from Firestore.
- Mapping and Navigation: Map view showing victim locations for volunteers, facilitating easy navigation.
- Status Updates & Proof of Delivery: Volunteers update task status to 'Delivered' and upload proof image to Firebase Storage.
- Admin/NGO Dashboard: Web dashboard to view all victim requests on a map, assign volunteers, and monitor status with color codes.

## Style Guidelines:

- Primary color: Sky blue (#87CEEB) evoking a sense of calmness and support.
- Background color: Very light blue (#F0F8FF). A desaturated version of the primary, suitable for a light theme.
- Accent color: Teal (#008080), an analogous color with more contrast and saturation, used to highlight important CTAs.
- Font: 'PT Sans', a humanist sans-serif well-suited for both headlines and body text. Note: currently only Google Fonts are supported.
- Use clear, recognizable icons for aid categories and status indicators.
- Mobile-first design with a simple, intuitive layout for all user types.
- Subtle animations for status changes and data loading to provide user feedback.