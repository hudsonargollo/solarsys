# Supabase Setup for SolarSys

This directory contains the Supabase configuration and database migrations for the SolarSys project.

## Local Development

### Prerequisites

- Node.js installed
- Docker Desktop installed and running (required for local Supabase)

### Start Local Supabase

```bash
npx supabase start
```

This will start a local Supabase instance with:
- PostgreSQL database
- Supabase Studio (UI) at http://127.0.0.1:54323
- API endpoint at http://127.0.0.1:54321

### Stop Local Supabase

```bash
npx supabase stop
```

### Reset Database

To reset the database and re-run all migrations:

```bash
npx supabase db reset
```

## Database Schema

The database schema is defined in the migrations directory:

- `migrations/20251218113857_create_initial_schema.sql` - Creates the leads and hsp_data tables with RLS policies

### Tables

#### leads
Stores lead information from the simulador:
- `id` - UUID primary key
- `created_at` - Timestamp
- `status` - Lead status (new, qualified, whatsapp_clicked, contacted)
- `name`, `whatsapp`, `email` - Contact information
- `zip_code`, `city`, `state` - Location data
- `bill_value` - Monthly electricity bill
- `connection_type` - Electrical connection (mono, bi, tri)
- `roof_type` - Roof type (clay, metal, fiber, slab)
- `system_size_kwp` - Calculated system size
- `est_savings` - Estimated savings
- `session_id` - Session tracking UUID
- `utm_source`, `utm_medium`, `utm_campaign` - Marketing attribution
- `disqualification_reason` - Why lead was disqualified
- `warnings` - Array of warning messages

#### hsp_data
Reference data for solar irradiation by Brazilian state:
- `state` - Two-letter state code (primary key)
- `hsp_value` - Heliometric index value
- `region` - Brazilian region name

### Row Level Security (RLS)

The database uses RLS policies to ensure data security:

**Anonymous Users (anon role):**
- Can INSERT new leads
- Can SELECT only their own session data
- Cannot SELECT all leads

**Authenticated Users (authenticated role):**
- Can SELECT all leads (admin access)
- Can UPDATE lead status

## Production Deployment

### Link to Supabase Project

```bash
npx supabase link --project-ref your-project-ref
```

### Push Migrations to Production

```bash
npx supabase db push
```

### Generate TypeScript Types

```bash
npx supabase gen types typescript --local > src/types/database.types.ts
```

## Environment Variables

Create a `.env` file in the project root with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For local development, get these values from:
```bash
npx supabase status
```

## Useful Commands

- `npx supabase status` - Show status of local Supabase services
- `npx supabase db diff` - Show differences between local and remote database
- `npx supabase migration list` - List all migrations
- `npx supabase functions list` - List edge functions
- `npx supabase db lint` - Lint database schema

## Testing

The project includes property-based tests for:
- Secure data storage with session isolation
- Anonymous database permissions
- Session management

Run tests with:
```bash
npm test
```