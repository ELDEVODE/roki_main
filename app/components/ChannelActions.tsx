import React from "react";
import { PermissionType } from "../../types/prisma";
import { useState } from "react";
import { useSupabaseChannelPermissions } from "../hooks/useSupabaseChannelPermissions";

// Example component that demonstrates using the permissions system
export default function ChannelActions({
  userId,
  channelId,
}: {
  userId: string;
  channelId: string;
}) {
  // Use our Supabase hook to fetch channel data and check permissions
  const { channel, can, isAdmin, isModerator, member, isLoading, error } =
    useSupabaseChannelPermissions(userId, channelId);

  // Loading state
  if (isLoading || !channel) {
    return <div>Loading channel...</div>;
  }

  // User not a member
  if (!member) {
    return <div>You are not a member of this channel</div>;
  }

  // Render appropriate actions based on permissions
  return (
    <div className="channel-actions">
      <h2>Channel: {channel.title}</h2>

      {/* Channel management actions */}
      {can(PermissionType.SEND_MESSAGES) && (
        <button className="action-button">Send Message</button>
      )}

      {can(PermissionType.INVITE_MEMBERS) && (
        <button className="action-button">Invite Members</button>
      )}

      {can(PermissionType.PIN_MESSAGES) && (
        <button className="action-button">Pin Message</button>
      )}

      {/* Moderation actions */}
      {isModerator() && (
        <div className="moderation-actions">
          <h3>Moderation</h3>

          {can(PermissionType.MANAGE_MESSAGES) && (
            <button className="mod-button">Delete Messages</button>
          )}

          {can(PermissionType.KICK_MEMBERS) && (
            <button className="mod-button">Kick Member</button>
          )}

          {can(PermissionType.BAN_MEMBERS) && (
            <button className="mod-button">Ban Member</button>
          )}
        </div>
      )}

      {/* Admin actions */}
      {isAdmin() && (
        <div className="admin-actions">
          <h3>Administration</h3>
          <button className="admin-button">Manage Roles</button>
          <button className="admin-button">Edit Channel</button>
          <button className="admin-button">Delete Channel</button>
        </div>
      )}
    </div>
  );
}
