import { PermissionType } from "../../types/prisma";
import { PrismaClient } from "@prisma/client";

// Create a PrismaClient with extended types
interface CustomPrismaClient extends PrismaClient {
  member: any;
  channelRole: any;
  memberRole: any;
}

const prisma = new PrismaClient() as CustomPrismaClient;

/**
 * Checks if a user has the specified permission in a channel
 */
export async function hasChannelPermission(
  userId: string,
  channelId: string,
  permission: PermissionType
): Promise<boolean> {
  // Check if user is a member of the channel
  const member = await prisma.member.findUnique({
    where: {
      userId_channelId: {
        userId,
        channelId,
      },
    },
    include: {
      memberRoles: {
        include: {
          channelRole: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!member) {
    return false;
  }

  // Check if any of the member's roles has the ADMINISTRATOR permission or the specific permission
  for (const memberRole of member.memberRoles) {
    const role = memberRole.channelRole.role;

    // Administrator has all permissions
    if (role.permissions.includes(PermissionType.ADMINISTRATOR)) {
      return true;
    }

    // Check for the specific permission
    if (role.permissions.includes(permission)) {
      return true;
    }
  }

  return false;
}

/**
 * Returns all permissions a user has in a channel
 */
export async function getUserChannelPermissions(
  userId: string,
  channelId: string
): Promise<PermissionType[]> {
  // Check if user is a member of the channel
  const member = await prisma.member.findUnique({
    where: {
      userId_channelId: {
        userId,
        channelId,
      },
    },
    include: {
      memberRoles: {
        include: {
          channelRole: {
            include: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!member) {
    return [];
  }

  const permissions = new Set<PermissionType>();

  // Collect all permissions from the member's roles
  for (const memberRole of member.memberRoles) {
    const role = memberRole.channelRole.role;

    // Administrator has all permissions
    if (role.permissions.includes(PermissionType.ADMINISTRATOR)) {
      return Object.values(PermissionType);
    }

    // Add each permission to the set
    role.permissions.forEach((permission: PermissionType) => permissions.add(permission));
  }

  return Array.from(permissions);
}

/**
 * Creates a channel with default role templates
 */
export async function createChannelWithDefaultRoles(
  title: string,
  type: string,
  creatorId: string,
  icon?: string
) {
  try {
    // Import the createChannelWithRoles function from the seed file
    const { createChannelWithRoles } = await import("../seed/seed");

    // Create the channel with default roles
    const channel = await createChannelWithRoles({
      title,
      type,
      creatorId,
      icon,
    });

    return channel;
  } catch (error) {
    console.error("Error creating channel with default roles:", error);
    throw error;
  }
}

/**
 * Assigns a role to a member in a channel
 */
export async function assignRoleToMember(
  memberId: string,
  roleId: string,
  channelId: string
) {
  try {
    // Find the channel role
    const channelRole = await prisma.channelRole.findUnique({
      where: {
        channelId_roleId: {
          channelId,
          roleId,
        },
      },
    });

    if (!channelRole) {
      throw new Error("Role is not available in this channel");
    }

    // Create the member role
    const memberRole = await prisma.memberRole.create({
      data: {
        memberId,
        channelRoleId: channelRole.id,
      },
    });

    return memberRole;
  } catch (error) {
    console.error("Error assigning role to member:", error);
    throw error;
  }
}
