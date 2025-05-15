import { PermissionType } from "../../types/prisma";

/**
 * Utility functions for working with roles and permissions on the client side
 */

// Types for frontend use
export type Member = {
  id: string;
  userId: string;
  channelId: string;
  image?: string;
  user: {
    id: string;
    name?: string;
    username?: string;
    profileImage?: string;
  };
  memberRoles: Array<{
    id: string;
    channelRole: {
      id: string;
      role: {
        id: string;
        name: string;
        permissions: PermissionType[];
      };
    };
  }>;
};

export type Channel = {
  maxRoles: number;
  id: string;
  title: string;
  type: string;
  members: Member[];
  channelRoles: Array<{
    id: string;
    role: {
      id: string;
      name: string;
      permissions: PermissionType[];
    };
  }>;
};

/**
 * Check if a member has a specific permission in a channel
 */
export function hasPermission(
  member: Member | undefined | null,
  permission: PermissionType
): boolean {
  if (!member) return false;

  // Check each role the member has
  for (const memberRole of member.memberRoles) {
    const permissions = memberRole.channelRole.role.permissions;

    // ADMINISTRATOR has all permissions
    if (permissions.includes(PermissionType.ADMINISTRATOR)) {
      return true;
    }

    // Check for the specific permission
    if (permissions.includes(permission)) {
      return true;
    }
  }

  return false;
}

/**
 * Get all permissions a member has in a channel
 */
export function getMemberPermissions(
  member: Member | undefined | null
): PermissionType[] {
  if (!member) return [];

  const permissions = new Set<PermissionType>();

  // Collect permissions from all roles
  for (const memberRole of member.memberRoles) {
    const rolePermissions = memberRole.channelRole.role.permissions;

    // ADMINISTRATOR has all permissions
    if (rolePermissions.includes(PermissionType.ADMINISTRATOR)) {
      return Object.values(PermissionType);
    }

    // Add each permission to the set
    rolePermissions.forEach((permission) => permissions.add(permission));
  }

  return Array.from(permissions);
}

/**
 * Find a member in a channel by user ID
 */
export function findMemberByUserId(
  channel: Channel | undefined | null,
  userId: string
): Member | undefined {
  if (!channel) return undefined;
  return channel.members.find((member) => member.userId === userId);
}

/**
 * Get the highest role of a member in a channel (for display purposes)
 * Priority: OWNER > ADMIN > MODERATOR > MEMBER > GUEST > CUSTOM
 */
export function getHighestRole(
  member: Member | undefined | null
): { name: string; id: string } | undefined {
  if (!member || member.memberRoles.length === 0) {
    return undefined;
  }

  // Priority order of role types
  const rolePriority = [
    "OWNER",
    "ADMIN",
    "MODERATOR",
    "MEMBER",
    "GUEST",
    "CUSTOM",
  ];

  // Sort roles by priority
  const sortedRoles = [...member.memberRoles].sort((a, b) => {
    const roleA = a.channelRole.role;
    const roleB = b.channelRole.role;

    // Compare based on templateType priority
    const priorityA = rolePriority.indexOf(roleA.name.toUpperCase());
    const priorityB = rolePriority.indexOf(roleB.name.toUpperCase());

    return priorityA - priorityB;
  });

  // Return the highest priority role
  const highestRole = sortedRoles[0].channelRole.role;
  return {
    name: highestRole.name,
    id: highestRole.id,
  };
}
