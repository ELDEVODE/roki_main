# Supabase Setup for Roki

This directory contains the database schema and migrations for the Roki application using Supabase.

## Setup Instructions

1. Create a Supabase project at [https://supabase.com](https://supabase.com) if you haven't already

2. Set environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. You can run the SQL migrations manually from the Supabase dashboard:
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of the migration files in the `migrations` directory
   - Run the SQL commands in the editor

## Tables

The demo schema includes the following tables:

- **DemoUser**: Stores user information including wallet addresses
- **DemoChannel**: Represents chat channels (can be token-gated)
- **DemoMembership**: Maps users to channels with roles
- **DemoMessage**: Stores messages sent in channels

## Development Notes

- The application uses a fallback mechanism that tries Supabase first and then falls back to in-memory storage if Supabase operations fail
- All tables have Row Level Security (RLS) enabled with public access policies for development/demo purposes 