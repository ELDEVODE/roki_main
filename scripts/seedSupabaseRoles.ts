import { PrismaClient } from "@prisma/client";
import { PermissionType, RoleTemplateType } from "../types/prisma";
import { supabase } from "../app/utils/supabase";

// Create default roles and permissions
async function seedDefaultRoles() {
  console.log("Seeding default roles...");

  try {
    // Default role templates
    const roleTemplates = [
      {
        name: "Owner",
        description: "Full control over the channel",
        permissions: Object.values(PermissionType),
        templateType: RoleTemplateType.OWNER,
        isDefault: true,
      },
      {
        name: "Admin",
        description: "Can manage most aspects of the channel",
        permissions: [
          PermissionType.MANAGE_CHANNELS,
          PermissionType.MANAGE_ROLES,
          PermissionType.KICK_MEMBERS,
          PermissionType.BAN_MEMBERS,
          PermissionType.INVITE_MEMBERS,
          PermissionType.MANAGE_MESSAGES,
          PermissionType.PIN_MESSAGES,
          PermissionType.MANAGE_WEBHOOKS,
          PermissionType.VIEW_AUDIT_LOG,
          PermissionType.MODERATE_MEMBERS,
          PermissionType.MANAGE_EMOJIS,
          PermissionType.MANAGE_NICKNAMES,
          PermissionType.SEND_MESSAGES,
          PermissionType.EMBED_LINKS,
          PermissionType.ATTACH_FILES,
          PermissionType.ADD_REACTIONS,
          PermissionType.VIEW_CHANNELS,
        ],
        templateType: RoleTemplateType.ADMIN,
        isDefault: true,
      },
      {
        name: "Moderator",
        description: "Can moderate content and users",
        permissions: [
          PermissionType.KICK_MEMBERS,
          PermissionType.BAN_MEMBERS,
          PermissionType.MANAGE_MESSAGES,
          PermissionType.PIN_MESSAGES,
          PermissionType.MODERATE_MEMBERS,
          PermissionType.SEND_MESSAGES,
          PermissionType.EMBED_LINKS,
          PermissionType.ATTACH_FILES,
          PermissionType.ADD_REACTIONS,
          PermissionType.VIEW_CHANNELS,
        ],
        templateType: RoleTemplateType.MODERATOR,
        isDefault: true,
      },
      {
        name: "Member",
        description: "Regular channel member",
        permissions: [
          PermissionType.SEND_MESSAGES,
          PermissionType.EMBED_LINKS,
          PermissionType.ATTACH_FILES,
          PermissionType.ADD_REACTIONS,
          PermissionType.CHANGE_NICKNAME,
          PermissionType.VIEW_CHANNELS,
          PermissionType.CONNECT_VOICE,
          PermissionType.SPEAK_VOICE,
        ],
        templateType: RoleTemplateType.MEMBER,
        isDefault: true,
      },
      {
        name: "Guest",
        description: "Limited access to the channel",
        permissions: [
          PermissionType.VIEW_CHANNELS,
          PermissionType.ADD_REACTIONS,
        ],
        templateType: RoleTemplateType.GUEST,
        isDefault: true,
      },
    ];

    // Insert roles
    for (const role of roleTemplates) {
      const { data, error } = await supabase
        .from("Role")
        .upsert(
          {
            name: role.name,
            description: role.description,
            permissions: role.permissions,
            templateType: role.templateType,
            isDefault: role.isDefault,
          },
          { onConflict: "name" }
        )
        .select();

      if (error) {
        console.error(`Error creating role ${role.name}:`, error);
      } else {
        console.log(`Created/updated role: ${role.name}`);
      }
    }

    console.log("Default roles seeded successfully!");
  } catch (error) {
    console.error("Error seeding default roles:", error);
  }
}

// Run the seed function
seedDefaultRoles()
  .then(() => console.log("Seeding completed."))
  .catch((error) => console.error("Seeding failed:", error));
