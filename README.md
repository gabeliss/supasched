# SupaSched - Therapist Scheduling Platform

SupaSched is a modern appointment scheduling platform designed for therapists and mental health professionals. It provides an intuitive, seamless booking experience for both therapists and clients, reducing administrative overhead and improving efficiency.

## Features

- **Availability Management**: Set recurring or one-time availability with conflict resolution.
- **Time Off Management**: Block time for vacations, breaks, or personal time.
- **Appointment Scheduling**: Create, approve, reschedule, or cancel sessions.
- **Embeddable Booking Widget**: Client-facing booking system that can be embedded into your website.
- **Secure Authentication**: Powered by Supabase for secure user management.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn UI components
- **Backend**: Supabase (Database & Authentication)
- **Data Fetching**: React Query / SWR
- **Date Handling**: date-fns, react-day-picker

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Supabase account and project

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/supasched.git
   cd supasched
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. Set up your Supabase database with the required tables:

   - `availability`
   - `time_off`
   - `appointments`

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── app/                    # Next.js app router
│   ├── (auth)/             # Authentication routes
│   ├── (dashboard)/        # Protected dashboard routes
│   └── (public)/           # Public routes (booking widget)
├── components/             # React components
│   ├── availability/       # Availability management components
│   ├── time-off/           # Time off management components
│   ├── appointments/       # Appointment management components
│   ├── auth/               # Authentication components
│   ├── booking/            # Client booking widget components
│   ├── layout/             # Layout components (sidebar, etc.)
│   └── ui/                 # UI components from shadcn
├── lib/                    # Utility functions and hooks
│   ├── hooks/              # Custom React hooks
│   ├── supabase/           # Supabase client configuration
│   └── utils/              # Utility functions
└── public/                 # Static assets
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Supabase](https://supabase.com/) for authentication and database
- [Next.js](https://nextjs.org/) for the React framework
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
