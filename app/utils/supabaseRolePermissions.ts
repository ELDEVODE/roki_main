import { PermissionType, RoleTemplateType } from "../../types/prisma";
import { supabase } from "./supabase";

/**
 * Checks if a user has the specified permission in a channel
 */
export async function hasChannelPermission(
  userId: string,
  channelId: string,
  permission: PermissionType
): Promise<boolean> {
  // Check if user is a member of the channel
  const { data: member, error: memberError } = await supabase
    .from("Member")
    .select("id")
    .eq("userId", userId)
    .eq("channelId", channelId)
    .single();

  if (memberError || !member) {
    return false;
  }

  // Get member's roles and their permissions
  const { data: memberRoles, error: rolesError } = await supabase
    .from("MemberRole")
    .select(
      `
      channelRole:channelRoleId (
        role:roleId (
          id,
          permissions
        )
      )
    `
    )
    .eq("memberId", member.id);

  if (rolesError || !memberRoles || memberRoles.length === 0) {
    return false;
  }

  // Check if any of the member's roles has the ADMINISTRATOR permission or the specific permission
  for (const memberRole of memberRoles) {
    const rolePermissions =
      memberRole.channelRole?.[0]?.role?.[0]?.permissions || [];

    // Administrator has all permissions
    if (rolePermissions.includes(PermissionType.ADMINISTRATOR)) {
      return true;
    }

    // Check for the specific permission
    if (rolePermissions.includes(permission)) {
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
  const { data: member, error: memberError } = await supabase
    .from("Member")
    .select("id")
    .eq("userId", userId)
    .eq("channelId", channelId)
    .single();

  if (memberError || !member) {
    return [];
  }

  // Get member's roles and their permissions
  const { data: memberRoles, error: rolesError } = await supabase
    .from("MemberRole")
    .select(
      `
      channelRole:channelRoleId (
        role:roleId (
          id,
          permissions
        )
      )
    `
    )
    .eq("memberId", member.id);

  if (rolesError || !memberRoles || memberRoles.length === 0) {
    return [];
  }

  const permissions = new Set<PermissionType>();

  // Collect all permissions from the member's roles
  for (const memberRole of memberRoles) {
    const rolePermissions =
      memberRole.channelRole?.[0]?.role?.[0]?.permissions || [];

    // Administrator has all permissions
    if (rolePermissions.includes(PermissionType.ADMINISTRATOR)) {
      return Object.values(PermissionType);
    }

    // Add each permission to the set
    rolePermissions.forEach((permission: PermissionType) =>
      permissions.add(permission)
    );
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
    // Create the channel
    const { data: channel, error: channelError } = await supabase
      .from("Channel")
      .insert({
        title,
        type,
        creatorId,
        icon,
        maxRoles: 10,
      })
      .select()
      .single();

    if (channelError || !channel) {
      throw new Error(`Failed to create channel: ${channelError?.message}`);
    }

    // Get default roles
    const { data: defaultRoles, error: rolesError } = await supabase
      .from("Role")
      .select("id, templateType")
      .eq("isDefault", true);

    if (rolesError || !defaultRoles) {
      throw new Error(`Failed to get default roles: ${rolesError?.message}`);
    }

    // Create channel roles for each default role
    for (const role of defaultRoles) {
      const { error: channelRoleError } = await supabase
        .from("ChannelRole")
        .insert({
          channelId: channel.id,
          roleId: role.id,
        });

      if (channelRoleError) {
        console.error(
          `Failed to create channel role: ${channelRoleError.message}`
        );
      }
    }

    // Add creator as a member
    const { data: member, error: memberError } = await supabase
      .from("Member")
      .insert({
        userId: creatorId,
        channelId: channel.id,
      })
      .select()
      .single();

    if (memberError || !member) {
      throw new Error(
        `Failed to add creator as member: ${memberError?.message}`
      );
    }

    // Find owner role for the channel
    const ownerRole = defaultRoles.find(
      (role) => role.templateType === RoleTemplateType.OWNER
    );

    if (ownerRole) {
      // Find the channel role for the owner role
      const { data: channelRole, error: channelRoleError } = await supabase
        .from("ChannelRole")
        .select("id")
        .eq("channelId", channel.id)
        .eq("roleId", ownerRole.id)
        .single();

      if (channelRoleError || !channelRole) {
        throw new Error(
          `Failed to find owner channel role: ${channelRoleError?.message}`
        );
      }

      // Assign owner role to the channel creator
      const { error: memberRoleError } = await supabase
        .from("MemberRole")
        .insert({
          memberId: member.id,
          channelRoleId: channelRole.id,
        });

      if (memberRoleError) {
        throw new Error(
          `Failed to assign owner role: ${memberRoleError.message}`
        );
      }
    }

    return channel;
  } catch (error) {
    console.error("Error creating channel with roles:", error);
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
    const { data: channelRole, error: channelRoleError } = await supabase
      .from("ChannelRole")
      .select("id")
      .eq("channelId", channelId)
      .eq("roleId", roleId)
      .single();

    if (channelRoleError || !channelRole) {
      throw new Error("Role is not available in this channel");
    }

    // Create the member role
    const { data: memberRole, error: memberRoleError } = await supabase
      .from("MemberRole")
      .insert({
        memberId,
        channelRoleId: channelRole.id,
      })
      .select()
      .single();

    if (memberRoleError) {
      throw new Error(`Failed to assign role: ${memberRoleError.message}`);
    }

    return memberRole;
  } catch (error) {
    console.error("Error assigning role to member:", error);
    throw error;
  }
}
