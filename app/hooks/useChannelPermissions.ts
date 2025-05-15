import { useState, useEffect } from "react";
import { PermissionType } from "../../types/prisma";
import {
  hasPermission,
  getMemberPermissions,
  Member,
  Channel,
} from "../utils/rolePermissions";

/**
 * Hook for working with channel permissions in React components
 */
export function useChannelPermissions(
  userId: string | undefined,
  channel: Channel | undefined | null
) {
  const [member, setMember] = useState<Member | undefined | null>(null);
  const [permissions, setPermissions] = useState<PermissionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId || !channel) {
      setMember(undefined);
      setPermissions([]);
      setIsLoading(false);
      return;
    }

    // Find the current user in the channel members
    const foundMember = channel.members.find((m) => m.userId === userId);
    setMember(foundMember);

    // Get all permissions for this member
    if (foundMember) {
      setPermissions(getMemberPermissions(foundMember));
    } else {
      setPermissions([]);
    }

    setIsLoading(false);
  }, [userId, channel]);

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
    member,
    permissions,
    isLoading,
    can,
    isMember,
    isAdmin,
    isModerator,
  };
}
