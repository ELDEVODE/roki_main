import { PermissionType, RoleTemplateType } from "../../types/prisma";
import { supabase } from "./supabase";
import {
  createChannelWithDefaultRoles,
  hasChannelPermission,
  assignRoleToMember,
} from "./supabaseRolePermissions";

/**
 * Create a new channel
 */
export async function createChannel(
  title: string,
  type: string,
  creatorId: string,
  icon?: string
) {
  try {
    return await createChannelWithDefaultRoles(title, type, creatorId, icon);
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
}

/**
 * Get channel by ID
 */
export async function getChannel(channelId: string) {
  try {
    const { data, error } = await supabase
      .from("Channel")
      .select(
        `
        *,
        creator:creatorId (*),
        channelRoles:ChannelRole (
          id,
          role:roleId (*)
        ),
        members:Member (
          id,
          userId,
          image,
          user:userId (*),
          memberRoles:MemberRole (
            id,
            channelRole:channelRoleId (
              id,
              role:roleId (*)
            )
          )
        )
      `
      )
      .eq("id", channelId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching channel:", error);
    throw error;
  }
}

/**
 * Get all channels
 */
export async function getChannels() {
  try {
    const { data, error } = await supabase.from("Channel").select(`
        *,
        creator:creatorId (
          id,
          name,
          username,
          profileImage
        ),
        channelRoles:ChannelRole (
          id,
          role:roleId (*)
        ),
        members:Member (
          id,
          userId,
          user:userId (
            id,
            name,
            username,
            profileImage
          )
        )
      `);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching channels:", error);
    throw error;
  }
}

/**
 * Get all members in a channel
 */
export async function getChannelMembers(
  channelId: string,
  requestingUserId?: string
) {
  try {
    // If requesting user is provided, check if they are a member of the channel
    if (requestingUserId) {
      const { data: isMember, error: memberError } = await supabase
        .from("Member")
        .select("id")
        .eq("userId", requestingUserId)
        .eq("channelId", channelId)
        .single();

      if (memberError || !isMember) {
        throw new Error("You are not a member of this channel");
      }
    }

    const { data, error } = await supabase
      .from("Member")
      .select(
        `
        id,
        userId,
        channelId,
        image,
        user:userId (
          id,
          name,
          username,
          profileImage,
          online,
          lastSeen
        ),
        memberRoles:MemberRole (
          id,
          channelRole:channelRoleId (
            id,
            role:roleId (*)
          )
        )
      `
      )
      .eq("channelId", channelId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching channel members:", error);
    throw error;
  }
}

/**
 * Add a member to a channel
 */
export async function addChannelMember(
  channelId: string,
  userId: string,
  addedByUserId: string
) {
  try {
    // Check permissions
    const canInvite = await hasChannelPermission(
      addedByUserId,
      channelId,
      PermissionType.INVITE_MEMBERS
    );

    if (!canInvite) {
      throw new Error(
        "You do not have permission to invite members to this channel"
      );
    }

    // Check if user is already a member
    const { data: existingMember, error: memberError } = await supabase
      .from("Member")
      .select("id")
      .eq("userId", userId)
      .eq("channelId", channelId)
      .single();

    if (existingMember) {
      throw new Error("User is already a member of this channel");
    }

    // Add the member
    const { data: member, error: addError } = await supabase
      .from("Member")
      .insert({ userId, channelId })
      .select()
      .single();

    if (addError) throw addError;

    // Find the default member role
    const { data: defaultMemberRoles, error: rolesError } = await supabase
      .from("ChannelRole")
      .select(
        `
        id,
        role:roleId (
          id,
          templateType
        )
      `
      )
      .eq("channelId", channelId);

    if (rolesError) throw rolesError;

    const memberRoleData = defaultMemberRoles.find(
      (cr) => (cr.role as any)?.templateType === RoleTemplateType.MEMBER
    );

    // Assign the default member role
    if (memberRoleData) {
      await supabase.from("MemberRole").insert({
        memberId: member.id,
        channelRoleId: memberRoleData.id,
      });
    }

    return member;
  } catch (error) {
    console.error("Error adding member to channel:", error);
    throw error;
  }
}

/**
 * Get all roles in a channel
 */
export async function getChannelRoles(channelId: string) {
  try {
    const { data, error } = await supabase
      .from("ChannelRole")
      .select(
        `
        id,
        channelId,
        role:roleId (*)
      `
      )
      .eq("channelId", channelId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching channel roles:", error);
    throw error;
  }
}

/**
 * Create a custom role in a channel
 */
export async function createChannelRole(
  channelId: string,
  name: string,
  permissions: PermissionType[],
  createdByUserId: string,
  description?: string
) {
  try {
    // Check permissions
    const canManageRoles = await hasChannelPermission(
      createdByUserId,
      channelId,
      PermissionType.MANAGE_ROLES
    );

    if (!canManageRoles) {
      throw new Error(
        "You do not have permission to manage roles in this channel"
      );
    }

    // Check channel role limit
    const { data: channel, error: channelError } = await supabase
      .from("Channel")
      .select("maxRoles")
      .eq("id", channelId)
      .single();

    if (channelError) throw channelError;

    const { data: existingRoles, error: rolesError } = await supabase
      .from("ChannelRole")
      .select("id")
      .eq("channelId", channelId);

    if (rolesError) throw rolesError;

    if (existingRoles.length >= channel.maxRoles) {
      throw new Error(
        `Channel has reached the maximum number of roles (${channel.maxRoles})`
      );
    }

    // Create the role
    const { data: role, error: roleError } = await supabase
      .from("Role")
      .insert({
        name,
        description,
        permissions,
        templateType: RoleTemplateType.CUSTOM,
        isDefault: false,
      })
      .select()
      .single();

    if (roleError) throw roleError;

    // Associate with channel
    const { data: channelRole, error: channelRoleError } = await supabase
      .from("ChannelRole")
      .insert({
        channelId,
        roleId: role.id,
      })
      .select(
        `
        id,
        channelId,
        role:roleId (*)
      `
      )
      .single();

    if (channelRoleError) throw channelRoleError;

    return channelRole;
  } catch (error) {
    console.error("Error creating channel role:", error);
    throw error;
  }
}

/**
 * Update a role in a channel
 */
export async function updateChannelRole(
  channelId: string,
  roleId: string,
  updatedByUserId: string,
  updates: {
    name?: string;
    description?: string;
    permissions?: PermissionType[];
  }
) {
  try {
    // Check permissions
    const canManageRoles = await hasChannelPermission(
      updatedByUserId,
      channelId,
      PermissionType.MANAGE_ROLES
    );

    if (!canManageRoles) {
      throw new Error(
        "You do not have permission to manage roles in this channel"
      );
    }

    // Check if role exists in channel
    const { data: channelRole, error: channelRoleError } = await supabase
      .from("ChannelRole")
      .select(
        `
        id,
        role:roleId (
          id,
          isDefault
        )
      `
      )
      .eq("channelId", channelId)
      .eq("roleId", roleId)
      .single();

    if (channelRoleError) throw new Error("Role not found in this channel");

    // Check if role is default (cannot be modified)
    if (
      channelRole.role &&
      typeof channelRole.role === "object" &&
      "isDefault" in channelRole.role &&
      channelRole.role.isDefault
    ) {
      throw new Error("Default roles cannot be modified");
    }

    // Update the role
    const { data: updatedRole, error: updateError } = await supabase
      .from("Role")
      .update({
        ...updates,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", roleId)
      .select()
      .single();

    if (updateError) throw updateError;

    return {
      ...channelRole,
      role: updatedRole,
    };
  } catch (error) {
    console.error("Error updating channel role:", error);
    throw error;
  }
}

/**
 * Delete a role from a channel
 */
export async function deleteChannelRole(
  channelId: string,
  roleId: string,
  deletedByUserId: string
) {
  try {
    // Check permissions
    const canManageRoles = await hasChannelPermission(
      deletedByUserId,
      channelId,
      PermissionType.MANAGE_ROLES
    );

    if (!canManageRoles) {
      throw new Error(
        "You do not have permission to manage roles in this channel"
      );
    }

    // Check if role exists in channel
    const { data: channelRole, error: channelRoleError } = await supabase
      .from("ChannelRole")
      .select(
        `
        id,
        role:roleId (
          id,
          isDefault,
          templateType
        )
      `
      )
      .eq("channelId", channelId)
      .eq("roleId", roleId)
      .single();

    if (channelRoleError) throw new Error("Role not found in this channel");

    // Check if role is default (cannot be deleted)
    if (
      channelRole.role &&
      typeof channelRole.role === "object" &&
      "isDefault" in channelRole.role &&
      channelRole.role.isDefault
    ) {
      throw new Error("Default roles cannot be deleted");
    }

    // Delete associated member roles
    const { error: memberRolesError } = await supabase
      .from("MemberRole")
      .delete()
      .eq("channelRoleId", channelRole.id);

    if (memberRolesError) throw memberRolesError;

    // Delete the channel role
    const { error: deleteChannelRoleError } = await supabase
      .from("ChannelRole")
      .delete()
      .eq("id", channelRole.id);

    if (deleteChannelRoleError) throw deleteChannelRoleError;

    // Delete the role itself if it's a custom role
    const roleData = Array.isArray(channelRole.role)
      ? channelRole.role[0]
      : channelRole.role;
    if (roleData?.templateType === RoleTemplateType.CUSTOM) {
      const { error: deleteRoleError } = await supabase
        .from("Role")
        .delete()
        .eq("id", roleId);

      if (deleteRoleError) throw deleteRoleError;
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting channel role:", error);
    throw error;
  }
}

/**
 * Get member roles in a channel
 */
export async function getMemberRoles(memberId: string) {
  try {
    const { data, error } = await supabase
      .from("MemberRole")
      .select(
        `
        id,
        channelRole:channelRoleId (
          id,
          role:roleId (*)
        )
      `
      )
      .eq("memberId", memberId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching member roles:", error);
    throw error;
  }
}

/**
 * Assign a role to a member
 */
export async function assignRoleToChannelMember(
  channelId: string,
  memberId: string,
  roleId: string,
  assignedByUserId: string
) {
  try {
    // Check permissions
    const canManageRoles = await hasChannelPermission(
      assignedByUserId,
      channelId,
      PermissionType.MANAGE_ROLES
    );

    if (!canManageRoles) {
      throw new Error(
        "You do not have permission to manage roles in this channel"
      );
    }

    return await assignRoleToMember(memberId, roleId, channelId);
  } catch (error) {
    console.error("Error assigning role to member:", error);
    throw error;
  }
}

/**
 * Remove a role from a member
 */
export async function removeMemberRole(
  channelId: string,
  memberId: string,
  roleId: string,
  removedByUserId: string
) {
  try {
    // Check permissions
    const canManageRoles = await hasChannelPermission(
      removedByUserId,
      channelId,
      PermissionType.MANAGE_ROLES
    );

    if (!canManageRoles) {
      throw new Error(
        "You do not have permission to manage roles in this channel"
      );
    }

    // Find the channel role
    const { data: channelRole, error: channelRoleError } = await supabase
      .from("ChannelRole")
      .select("id")
      .eq("channelId", channelId)
      .eq("roleId", roleId)
      .single();

    if (channelRoleError) throw new Error("Role not found in this channel");

    // Delete the member role
    const { error: deleteError } = await supabase
      .from("MemberRole")
      .delete()
      .eq("memberId", memberId)
      .eq("channelRoleId", channelRole.id);

    if (deleteError) throw deleteError;

    return { success: true };
  } catch (error) {
    console.error("Error removing member role:", error);
    throw error;
  }
}
