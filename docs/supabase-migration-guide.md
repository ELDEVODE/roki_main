# Supabase Migration Guide

This document provides an overview of the migration from Next.js API routes to using Supabase SDK for frontend data fetching and role-based permission handling.

## Migration Overview

We've migrated from using Next.js API routes to directly using Supabase client SDK in our application. This allows for:

1. Direct database access from the frontend with proper security rules
2. Simplified development process without maintaining separate API routes
3. Real-time capabilities for data changes
4. Consistency between frontend and backend data models

## Key Changes

### 1. Supabase Client Setup

We've created a central Supabase client in `/app/utils/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create a client with the user's session
export const createClientWithSession = (supabaseAccessToken: string) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  });
};
```

### 2. Supabase Type Definitions

Type definitions for Supabase ensure type safety and are in `/types/supabase.ts`, mirroring our Prisma schema.

### 3. Role Permission Utilities

We've created replacement utilities for role and permission handling in:

- `/app/utils/supabaseRolePermissions.ts` - Backend permission checking
- `/app/hooks/useSupabaseChannelPermissions.ts` - React hook for permission checks

### 4. Channel Service

Instead of API routes, we've implemented a comprehensive channel service in `/app/utils/channelService.ts` that provides:

- Channel creation, fetching
- Member management
- Role management (creation, updates, deletion)
- Permission checks

### 5. Components Update

Components have been updated to use the new Supabase utilities:

- `ChannelActions.tsx`
- `ManageChannelRoles.tsx`
- `ManageMemberRoles.tsx`

## Environment Setup

You need to set the following variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Seeding Default Roles

To seed the default roles in Supabase, run:

```bash
bun scripts/seedSupabaseRoles.ts
```

## Removed API Routes

The following API routes have been replaced with direct Supabase functionality:

- `/api/channels`
- `/api/channels/[channelId]`
- `/api/channels/[channelId]/members`
- `/api/channels/[channelId]/members/[memberId]`
- `/api/channels/[channelId]/members/[memberId]/roles`
- `/api/channels/[channelId]/roles`
- `/api/channels/[channelId]/roles/[roleId]`

## Documentation

The role permissions guide has been updated to reflect the Supabase implementation. See `docs/role-permissions-guide.md`.
