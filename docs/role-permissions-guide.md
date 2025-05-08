# Role Permissions System Guide

This guide explains how to use the role-based permissions system in your Slack/Discord-like application.

## Overview

The permissions system is built on several key components:

1. **Permissions**: Individual capabilities a user can have (send messages, ban users, etc.)
2. **Roles**: Collections of permissions (Owner, Admin, Moderator, etc.)
3. **Channel Roles**: Roles specific to a channel
4. **Member Roles**: Assigned roles to specific members within a channel

## Permissions

We've defined a comprehensive set of permissions in the `PermissionType` enum:

```typescript
enum PermissionType {
  SEND_MESSAGES            // Can send messages in channels
  MANAGE_MESSAGES          // Can edit/delete messages
  MANAGE_CHANNELS          // Can create/edit/delete channels
  MANAGE_ROLES             // Can create/edit/delete roles
  KICK_MEMBERS             // Can remove members from channel
  BAN_MEMBERS              // Can ban members from channel
  INVITE_MEMBERS           // Can invite new members to channel
  PIN_MESSAGES             // Can pin messages in channel
  MANAGE_WEBHOOKS          // Can manage webhooks
  ADD_REACTIONS            // Can add reactions to messages
  ATTACH_FILES             // Can upload files
  EMBED_LINKS              // Can embed links in messages
  MENTION_EVERYONE         // Can use @everyone mention
  CHANGE_NICKNAME          // Can change own nickname
  MANAGE_NICKNAMES         // Can change other members' nicknames
  VIEW_CHANNELS            // Can view channels (basic access)
  CONNECT_VOICE            // Can connect to voice channels
  SPEAK_VOICE              // Can speak in voice channels
  STREAM_VIDEO             // Can stream video in channels
  PRIORITY_SPEAKER         // Has priority when speaking
  VIEW_AUDIT_LOG           // Can view audit logs
  MODERATE_MEMBERS         // Can timeout or otherwise moderate
  MANAGE_EMOJIS            // Can manage custom emojis
  ADMINISTRATOR            // Has all permissions
}
```

The `ADMINISTRATOR` permission is special - it grants all other permissions.

## Default Role Templates

The system comes with predefined role templates:

1. **Owner**: Automatically assigned to channel creators, has all permissions
2. **Admin**: Can manage most aspects of the channel
3. **Moderator**: Can moderate content and users
4. **Member**: Standard permissions for regular users
5. **Guest**: Limited permissions

These templates are created when the database is seeded, and each new channel is initialized with these default roles.

## Creating a Channel with Default Roles

When creating a new channel, use the `createChannel` function from our channelService:

```typescript
import { createChannel } from "../app/utils/channelService";

// Create a new channel with default roles
const channel = await createChannel(
  "My Channel", // title
  "general", // type
  "user-123", // creatorId
  "icon-url" // optional icon
);
```

This function:

1. Creates the channel
2. Adds default role templates to the channel
3. Makes the creator a member of the channel
4. Assigns the Owner role to the creator

## Checking Permissions (Backend)

Use the `hasChannelPermission` utility function to check if a user has a specific permission:

```typescript
import { hasChannelPermission } from "../app/utils/supabaseRolePermissions";
import { PermissionType } from "@prisma/client";

// Check if user can manage messages
const canManageMessages = await hasChannelPermission(
  userId,
  channelId,
  PermissionType.MANAGE_MESSAGES
);

if (canManageMessages) {
  // Allow the user to edit/delete messages
} else {
  // Deny the action
}
```

## Managing Roles

### Creating Custom Roles

Channels can have custom roles in addition to the default ones. Use the `createChannelRole` function from channelService to create custom roles:

```typescript
import { createChannelRole } from "../app/utils/channelService";

// Create a custom role
const customRole = await createChannelRole(
  channelId,
  "Custom Role",
  [
    PermissionType.SEND_MESSAGES,
    PermissionType.ADD_REACTIONS,
    PermissionType.ATTACH_FILES,
  ],
  userId,
  "A custom role with specific permissions" // optional description
);
```

### Assigning Roles to Members

Use the `assignRoleToChannelMember` function to assign roles:

```typescript
import { assignRoleToChannelMember } from "../app/utils/channelService";

// Assign a role to a member
const memberRole = await assignRoleToChannelMember(
  channelId,
  memberId,
  roleId,
  userId // ID of the user performing the assignment
);
```

## Using Permissions in Frontend Components

The `useSupabaseChannelPermissions` hook makes it easy to check permissions in React components:

```tsx
import { useSupabaseChannelPermissions } from "../hooks/useSupabaseChannelPermissions";
import { PermissionType } from "@prisma/client";

function MyComponent({ userId, channelId }) {
  const {
    can,
    isAdmin,
    isModerator,
    permissions,
    channel,
    member,
    isLoading,
    error
  } = useSupabaseChannelPermissions(userId, channelId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!channel) return <div>Channel not found</div>;

  return (
    <div>
      {/* Only show if user can send messages */}
      {can(PermissionType.SEND_MESSAGES) && (
        <textarea placeholder="Type a message..." />
      )}

      {/* Only show to moderators */}
      {isModerator() && <button>Moderate Channel</button>}

      {/* Only show to admins */}
      {isAdmin() && <button>Delete Channel</button>}
    </div>
  );
}
}
```

## Role Limits

Each channel has a `maxRoles` property (default: 10) that limits the number of roles that can be created. This prevents role sprawl and keeps the permission system manageable.

## Best Practices

1. **Check permissions, not roles**: Always check if a user has a specific permission, not if they have a specific role. This allows for more flexible role configurations.

2. **Use the ADMINISTRATOR permission sparingly**: The `ADMINISTRATOR` permission grants all permissions and should only be given to trusted users.

3. **Default to least privilege**: When creating custom roles, include only the permissions that are necessary for that role.

4. **Make role names clear**: Use descriptive names for roles so users understand what permissions they have.

5. **Consider UI feedback**: When a user doesn't have permission for an action, provide clear feedback or hide the UI for that action.

6. **Audit role changes**: Keep track of who assigns or removes roles for security purposes.

## Supabase Functions

The system provides the following utility functions in `channelService.ts`:

- `createChannel` - Create a new channel with default roles
- `getChannel` - Get details of a specific channel
- `getChannels` - Get all channels
- `getChannelMembers` - Get all members in a channel
- `addChannelMember` - Add a member to a channel
- `getChannelRoles` - Get all roles in a channel
- `createChannelRole` - Create a custom role
- `updateChannelRole` - Update a role
- `deleteChannelRole` - Delete a role
- `getMemberRoles` - Get all roles of a member
- `assignRoleToChannelMember` - Assign a role to a member
- `removeMemberRole` - Remove a role from a member

## Components

The system includes the following React components:

- `ChannelActions` - Shows actions a user can take based on their permissions
- `ManageChannelRoles` - Allows creating and managing roles in a channel
- `ManageMemberRoles` - Allows assigning and removing roles from members

All these components now utilize Supabase for direct data operations instead of going through API routes.
