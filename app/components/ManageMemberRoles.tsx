import { useState, useEffect } from "react";
import { PermissionType } from "@prisma/client";
import { useSupabaseChannelPermissions } from "../hooks/useSupabaseChannelPermissions";
import {
  getChannelRoles,
  getMemberRoles,
  assignRoleToChannelMember,
  removeMemberRole,
} from "../utils/channelService";
import { supabase } from "../utils/supabase";

export default function ManageMemberRoles({
  userId,
  channelId,
  memberId,
}: {
  userId: string;
  channelId: string;
  memberId: string;
}) {
  const [channel, setChannel] = useState<any>(null);
  const [member, setMember] = useState<any>(null);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [memberRoles, setMemberRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch all roles in the channel
        const rolesData = await getChannelRoles(channelId);
        setAvailableRoles(rolesData);

        // Get the member
        const { data: memberData } = await supabase
          .from("Member")
          .select(
            `
            id,
            userId,
            user:userId (
              id,
              name,
              username
            )
          `
          )
          .eq("id", memberId)
          .single();

        setMember(memberData);

        // Fetch member roles
        const memberRolesData = await getMemberRoles(memberId);
        setMemberRoles(memberRolesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (channelId && memberId) {
      fetchData();
    }
  }, [channelId, memberId]);

  // Use our Supabase hook to check permissions
  const { can } = useSupabaseChannelPermissions(userId, channelId);

  // If user doesn't have permission to manage roles, show an error
  if (!isLoading && !can(PermissionType.MANAGE_ROLES)) {
    return <div>You don't have permission to manage roles in this channel</div>;
  }

  // Check if a role is assigned to the member
  const hasRole = (roleId: string): boolean => {
    return memberRoles.some((mr: any) => mr.channelRole.role.id === roleId);
  };

  // Assign a role to the member
  const assignRole = async (roleId: string) => {
    try {
      setIsSubmitting(true);

      // Find the channel role
      const channelRole = availableRoles.find((cr) => cr.role.id === roleId);
      if (!channelRole) {
        alert("Role not found in this channel");
        return;
      }

      const newMemberRole = await assignRoleToChannelMember(
        channelId,
        memberId,
        roleId,
        userId
      );

      setMemberRoles((prev) => [...prev, newMemberRole]);
    } catch (error) {
      console.error("Error assigning role:", error);
      alert(
        `Failed to assign role: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove a role from the member
  const removeRole = async (roleId: string) => {
    try {
      setIsSubmitting(true);

      await removeMemberRole(channelId, memberId, roleId, userId);
      setMemberRoles((prev) =>
        prev.filter((mr) => mr.channelRole.role.id !== roleId)
      );
    } catch (error) {
      console.error("Error removing role:", error);
      alert(
        `Failed to remove role: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!member) {
    return <div>Member not found</div>;
  }

  return (
    <div className="manage-member-roles">
      <h2>Manage Roles for {member.user.name || member.user.username}</h2>

      <div className="current-roles">
        <h3>Current Roles</h3>
        {memberRoles.length === 0 ? (
          <p>No roles assigned</p>
        ) : (
          <ul className="roles-list">
            {memberRoles.map((memberRole: any) => (
              <li key={memberRole.id} className="role-item">
                <div className="role-info">
                  <span className="role-name">
                    {memberRole.channelRole.role.name}
                  </span>
                  <button
                    className="remove-role-button"
                    onClick={() => removeRole(memberRole.channelRole.role.id)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="available-roles">
        <h3>Available Roles</h3>
        <ul className="roles-list">
          {availableRoles
            .filter((cr: any) => !hasRole(cr.role.id))
            .map((channelRole: any) => (
              <li key={channelRole.id} className="role-item">
                <div className="role-info">
                  <span className="role-name">{channelRole.role.name}</span>
                  <button
                    className="assign-role-button"
                    onClick={() => assignRole(channelRole.role.id)}
                    disabled={isSubmitting}
                  >
                    Assign
                  </button>
                </div>
                <div className="role-description">
                  {channelRole.role.description}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
