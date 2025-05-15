import { useState, useEffect } from "react";
import { PermissionType } from "../../types/prisma";
import { supabase } from "../utils/supabase";
import { getUserChannelPermissions } from "../utils/supabaseRolePermissions";
import { hasPermission, getMemberPermissions } from "../utils/rolePermissions";

// Types imported from rolePermissions.ts
import type { Member, Channel } from "../utils/rolePermissions";

/**
 * Hook for working with channel permissions in React components using Supabase
 */
export function useSupabaseChannelPermissions(
  userId: string | undefined,
  channelId: string | undefined
) {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!userId || !channelId) {
        setChannel(null);
        setMember(null);
        setPermissions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch channel data
        const { data: channelData, error: channelError } = await supabase
          .from("Channel")
          .select(
            `
            id,
            title,
            type,
            maxRoles,
            channelRoles:ChannelRole (
              id,
              role:roleId (
                id,
                name,
                permissions
              )
            )
          `
          )
          .eq("id", channelId)
          .single();

        if (channelError) throw new Error(channelError.message);

        // Fetch members data
        const { data: membersData, error: membersError } = await supabase
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
              profileImage
            ),
            memberRoles:MemberRole (
              id,
              channelRole:channelRoleId (
                id,
                role:roleId (
                  id,
                  name,
                  permissions
                )
              )
            )
          `
          )
          .eq("channelId", channelId);

        if (membersError) throw new Error(membersError.message);

        // Create channel object with members
        const channel = {
          ...channelData,
          members: membersData,
        } as unknown as Channel;

        setChannel(channel);

        // Find current user in members
        const currentMember = membersData.find(
          (m) => m.userId === userId
        ) as unknown as Member;
        setMember(currentMember);

        // Get permissions for this member
        if (currentMember) {
          setPermissions(getMemberPermissions(currentMember));
        } else {
          setPermissions([]);
        }
      } catch (err) {
        console.error("Error fetching channel data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannelData();
  }, [userId, channelId]);

  /**
   * Check if the current user has a specific permission
   */
  const can = (permission: PermissionType): boolean => {
    return hasPermission(member, permission);
  };

  /**
   * Check if the current user is a member of the channel
   */
  const isMember = (): boolean => {
    return !!member;
  };

  /**
   * Check if the current user is an admin (has ADMINISTRATOR permission)
   */
  const isAdmin = (): boolean => {
    return can(PermissionType.ADMINISTRATOR);
  };

  /**
   * Check if the current user is a moderator
   */
  const isModerator = (): boolean => {
    return (
      can(PermissionType.KICK_MEMBERS) ||
      can(PermissionType.BAN_MEMBERS) ||
      can(PermissionType.MANAGE_MESSAGES)
    );
  };

  return {
    channel,
    member,
    permissions,
    isLoading,
    error,
    can,
    isMember,
    isAdmin,
    isModerator,
  };
}
