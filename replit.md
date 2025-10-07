# Iraqi Dental Platform

## Overview
This project is a comprehensive dental platform for the Iraqi dental community, built with React, Vite, and Express. It aims to be an all-in-one solution for clinics, suppliers, patients, and medical services, emphasizing AI-assisted tools and a robust marketplace. The platform operates entirely in Arabic. Its key capabilities include AI-assisted diagnosis, clinic and patient management, a dental supply marketplace, job listings, educational resources, community features, and an integrated booking system.

## User Preferences
I prefer detailed explanations and iterative development. Ask before making major changes. I prefer to use the latest stable technologies. Do not make changes to the folder `Z`. Do not make changes to the file `Y`.

## System Architecture
The platform utilizes a client-server architecture.

**UI/UX Decisions:**
-   Fully Arabic interface with RTL support.
-   Mobile-first design, especially for community and marketplace sections.
-   Role-based navigation for tailored experiences (Supplier, Dentist, Patient, Admin).
-   Supports both modern and legacy interfaces for clinic management.

**Technical Implementations:**
-   **Frontend**: React 18, TypeScript, Vite, Radix UI, Tailwind CSS for styling. Three.js and React Three Fiber for 3D visualizations. State management with React Context API and TanStack Query. Form validation with React Hook Form and Zod.
-   **Backend**: Express.js (Node.js) API.
-   **Database**: Supabase and Firebase for data persistence.

**Feature Specifications:**
-   **AI Dental Assistant**: A dedicated AI for dentists offering diagnosis, treatment plans, and case reviews.
-   **Community Module**: A social platform for dentists with features like a news feed, stories, content filters, and messaging.
-   **Supplier Dashboard**: Tools for product management (CRUD), order tracking, and profile management.
-   **Clinic Management & Booking**: Shareable booking links with QR codes, online appointment booking, calendar integration, and a comprehensive dashboard for clinic managers including staff, reports, and settings.
-   **Admin Platform**: A robust interface for managing users, content, jobs, finances, system monitoring, and security.
-   **Marketplace**: A mobile-optimized dental supply marketplace with categorized product listings and enhanced displays.
-   **Smart Diagnostic System**: An AI diagnosis system that follows a traditional dental diagnostic methodology, starting with chief complaint and branching into specific questions for comprehensive symptom analysis across various dental conditions.
-   **Learning Section**: Includes courses with an enrollment system, educational content (articles, videos), global resources, and interactive 3D dental models.

## External Dependencies
-   **Google Maps**: Used for clinic discovery, appointment booking, and job location display via `@vis.gl/react-google-maps`.
-   **Supabase**: Utilized for database services.
-   **Firebase**: Integrated for specific data storage or real-time functionalities.
-   **api.qrserver.com**: Used for generating QR codes.