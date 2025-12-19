# Supabase Setup Guide for SolarSys

This guide will help you set up Supabase for the SolarSys project, both locally and in production.

## What Was Implemented

✅ **Supabase Client Configuration** (`src/lib/supabase.ts`)
- TypeScript-typed Supabase client
- Environment variable configuration
- Database type definitions

✅ **Session Management** (`src/lib/session.ts`)
- UUID-based session ID generation
- localStorage persistence
- Session isolation for anonymous users

✅ **Database Service Layer** (`src/lib/database.ts`)
- Lead insertion with automatic session tracking
- Session-based data retrieval
- HSP data lookup by state
- Admin functions for lead management

✅ **Database Schema** (`supabase/migrations/`)
- `leads` table with full schema and constraints
- `hsp_data` reference table with Brazilian state data
- Row Level Security (RLS) policies for data isolation

✅ **Property-Based Tests**
- Secure data storage with session isolation (Property 6)
- Anonymous database permissions (Property 7)
- Session management (Property 8)

## Prerequisites

### For Local Development
- **Docker Desktop** - Required to run local Supabase instance
  - Download: https://www.docker.com/products/docker-desktop
  - Make sure Docker is running before starting Supabase

### For Production
- **Supabase Account** - Create a free account at https://supabase.com

## Local Development Setup

### 1. Install Docker Desktop
Download and install Docker Desktop from https://www.docker.com/products/docker-desktop

Make sure Docker is running (you should see the Docker icon in your system tray).

### 2. Start Local Supabase

```bash
npm run supabase:start
```

This will:
- Download and start PostgreSQL, PostgREST, GoTrue, and other Supabase services
- Run all database migrations
- Seed the database with sample data
- Start Supabase Studio at http://127.0.0.1:54323

**First time setup takes 2-5 minutes** as it downloads Docker images.

### 3. Get Local Credentials

After starting Supabase, run:

```bash
npm run supabase:status
```

This will display your local credentials. Copy the `API URL` and `anon key`.

### 4. Create .env File

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=your_anon_key_from_status_command
```

### 5. Start Development Server

```bash
npm run dev
```

Your app is now connected to the local Supabase instance!

## Production Setup

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: solarsys
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to Brazil (e.g., South America)
5. Click "Create new project"

### 2. Link Your Project

```bash
npx supabase link --project-ref your-project-ref
```

You can find your project ref in the Supabase dashboard URL:
`https://app.supabase.com/project/[your-project-ref]`

### 3. Push Database Schema

```bash
npx supabase db push
```

This will apply all migrations to your production database.

### 4. Get Production Credentials

In the Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy the **Project URL** and **anon public** key

### 5. Configure Production Environment

Update your `.env` file (or deployment platform environment variables):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

### 6. Verify RLS Policies

In the Supabase dashboard:
1. Go to **Authentication** → **Policies**
2. Verify that RLS is enabled on both tables
3. Check that the policies match the migration file

## Database Schema Overview

### Leads Table
Stores all lead information with session-based isolation:
- Anonymous users can only see their own session data
- Authenticated admins can see all leads
- Automatic session tracking via UUID

### HSP Data Table
Reference data for solar calculations:
- Contains HSP values for all 27 Brazilian states
- Read-only for all users
- Used for system size calculations

## Useful Commands

```bash
# Local Development
npm run supabase:start      # Start local Supabase
npm run supabase:stop       # Stop local Supabase
npm run supabase:reset      # Reset database and re-run migrations
npm run supabase:status     # Show connection details
npm run supabase:studio     # Open Supabase Studio

# Database Management
npm run db:generate-types   # Generate TypeScript types from schema

# Testing
npm test                    # Run all tests including PBT
```

## Troubleshooting

### Docker Not Running
**Error**: `failed to inspect service: error during connect`

**Solution**: Start Docker Desktop and wait for it to fully start before running `npm run supabase:start`

### Port Already in Use
**Error**: `port 54321 is already allocated`

**Solution**: 
```bash
npm run supabase:stop
npm run supabase:start
```

### Migration Errors
**Error**: Migration fails to apply

**Solution**:
```bash
npm run supabase:reset  # This will reset and re-run all migrations
```

### Environment Variables Not Loading
**Error**: `Missing Supabase environment variables`

**Solution**: 
1. Make sure `.env` file exists in project root
2. Restart your development server
3. Verify variable names start with `VITE_`

## Next Steps

After setting up Supabase:

1. ✅ Test the connection by running the property-based tests
2. ✅ Verify RLS policies work correctly
3. ⏭️ Continue with task 4: Build core simulador state management
4. ⏭️ Implement the lead qualification engine
5. ⏭️ Build the admin dashboard with authentication

## Security Notes

- **Never commit** `.env` files to git
- **Never expose** the `service_role` key in frontend code
- **Always use** the `anon` key for client-side operations
- **RLS policies** protect data even if the anon key is exposed
- **Session IDs** ensure users can only access their own data

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Local Development Guide](https://supabase.com/docs/guides/local-development)