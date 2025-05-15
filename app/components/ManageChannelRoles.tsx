import React from "react";
import { useState, useEffect } from "react";
import { PermissionType } from "../../types/prisma";
import { useSupabaseChannelPermissions } from "../hooks/useSupabaseChannelPermissions";
import {
  getChannelRoles,
  createChannelRole,
  updateChannelRole,
  deleteChannelRole,
} from "../utils/channelService";

const permissionLabels = {
  [PermissionType.SEND_MESSAGES]: "Send Messages",
  [PermissionType.MANAGE_MESSAGES]: "Manage Messages",
  [PermissionType.MANAGE_CHANNELS]: "Manage Channels",
  [PermissionType.MANAGE_ROLES]: "Manage Roles",
  [PermissionType.KICK_MEMBERS]: "Kick Members",
  [PermissionType.BAN_MEMBERS]: "Ban Members",
  [PermissionType.INVITE_MEMBERS]: "Invite Members",
  [PermissionType.PIN_MESSAGES]: "Pin Messages",
  [PermissionType.MANAGE_WEBHOOKS]: "Manage Webhooks",
  [PermissionType.ADD_REACTIONS]: "Add Reactions",
  [PermissionType.ATTACH_FILES]: "Attach Files",
  [PermissionType.EMBED_LINKS]: "Embed Links",
  [PermissionType.MENTION_EVERYONE]: "Mention Everyone",
  [PermissionType.CHANGE_NICKNAME]: "Change Nickname",
  [PermissionType.MANAGE_NICKNAMES]: "Manage Nicknames",
  [PermissionType.VIEW_CHANNELS]: "View Channels",
  [PermissionType.CONNECT_VOICE]: "Connect to Voice",
  [PermissionType.SPEAK_VOICE]: "Speak in Voice",
  [PermissionType.STREAM_VIDEO]: "Stream Video",
  [PermissionType.PRIORITY_SPEAKER]: "Priority Speaker",
  [PermissionType.VIEW_AUDIT_LOG]: "View Audit Log",
  [PermissionType.MODERATE_MEMBERS]: "Moderate Members",
  [PermissionType.MANAGE_EMOJIS]: "Manage Emojis",
  [PermissionType.ADMINISTRATOR]: "Administrator",
};

export default function ManageChannelRoles({
  userId,
  channelId,
}: {
  userId: string;
  channelId: string;
}) {
  const [channelData, setChannelData] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewRoleForm, setShowNewRoleForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for new role
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as PermissionType[],
  });

  // Use our Supabase custom hook to check permissions
  const {
    channel,
    can,
    isLoading: permissionsLoading,
  } = useSupabaseChannelPermissions(userId, channelId);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        if (!channelId) return;
        setIsLoading(true);
        const data = await getChannelRoles(channelId);
        setRoles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [channelId]);

  // If user doesn't have permission to manage roles, show an error
  if (!isLoading && !permissionsLoading && !can(PermissionType.MANAGE_ROLES)) {
    return <div>You don't have permission to manage roles in this channel</div>;
  }

  // Toggle permission in the new role form
  const togglePermission = (permission: PermissionType) => {
    setNewRole((prev) => {
      if (prev.permissions.includes(permission)) {
        return {
          ...prev,
          permissions: prev.permissions.filter((p) => p !== permission),
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, permission],
        };
      }
    });
  };

  // Create a new role
  const createRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newRole.name) {
      alert("Role name is required");
      return;
    }

    if (newRole.permissions.length === 0) {
      alert("At least one permission is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const createdRole = await createChannelRole(
        channelId,
        newRole.name,
        newRole.permissions,
        userId,
        newRole.description
      );

      setRoles((prev) => [...prev, createdRole]);
      setNewRole({
        name: "",
        description: "",
        permissions: [],
      });
      setShowNewRoleForm(false);
    } catch (error) {
      console.error("Error creating role:", error);
      alert(
        `Failed to create role: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a role
  const deleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) {
      return;
    }

    try {
      await deleteChannelRole(channelId, roleId, userId);
      setRoles((prev) => prev.filter((role) => role.role.id !== roleId));
    } catch (error) {
      console.error("Error deleting role:", error);
      alert(
        `Failed to delete role: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  if (isLoading) {
    return <div>Loading roles...</div>;
  }

  return (
    <div className="manage-roles">
      <h2>Manage Channel Roles</h2>

      <div className="roles-list">
        <h3>Current Roles</h3>
        {roles.length === 0 ? (
          <p>No roles found</p>
        ) : (
          <ul>
            {roles.map((channelRole: any) => (
              <li key={channelRole.role.id} className="role-item">
                <div className="role-header">
                  <h4>{channelRole.role.name}</h4>
                  {!channelRole.role.isDefault && (
                    <button
                      className="delete-button"
                      onClick={() => deleteRole(channelRole.role.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p>{channelRole.role.description}</p>
                <div className="permissions-list">
                  <h5>Permissions:</h5>
                  <ul>
                    {channelRole.role.permissions.map(
                      (permission: PermissionType) => (
                        <li key={permission}>{permissionLabels[permission]}</li>
                      )
                    )}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {channel && roles.length < (channel.maxRoles ?? 10) ? (
        <div className="new-role">
          {!showNewRoleForm ? (
            <button
              className="create-button"
              onClick={() => setShowNewRoleForm(true)}
            >
              Create New Role
            </button>
          ) : (
            <form onSubmit={createRole} className="role-form">
              <h3>New Role</h3>

              <div className="form-field">
                <label htmlFor="roleName">Role Name *</label>
                <input
                  id="roleName"
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="roleDescription">Description</label>
                <textarea
                  id="roleDescription"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-field">
                <label>Permissions *</label>
                <div className="permissions-grid">
                  {Object.values(PermissionType).map((permission) => (
                    <div key={permission as string} className="permission-option">
                      <input
                        type="checkbox"
                        id={`perm-${permission}`}
                        checked={newRole.permissions.includes(permission as PermissionType)}
                        onChange={() => togglePermission(permission as PermissionType)}
                      />
                      <label htmlFor={`perm-${permission}`}>
                        {permissionLabels[permission as keyof typeof permissionLabels]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowNewRoleForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Role"}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <p>
          This channel has reached the maximum number of roles (
          {channel?.maxRoles}).
        </p>
      )}
    </div>
  );
}
