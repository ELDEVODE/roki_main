import { PrismaClient, PermissionType, RoleTemplateType } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDefaultRoles() {
  try {
    console.log("Seeding default roles...");

    // Define role templates with appropriate permissions
    const roleTemplates = [
      {
        name: "Owner",
        description: "Creator of the channel with all permissions",
        templateType: RoleTemplateType.OWNER,
        isDefault: true,
        permissions: [
          PermissionType.ADMINISTRATOR,
          // When ADMINISTRATOR is set, all other permissions are implicitly granted
        ],
      },
      {
        name: "Admin",
        description: "Administrator with most permissions",
        templateType: RoleTemplateType.ADMIN,
        isDefault: true,
        permissions: [
          PermissionType.MANAGE_CHANNELS,
          PermissionType.MANAGE_ROLES,
          PermissionType.MANAGE_MESSAGES,
          PermissionType.KICK_MEMBERS,
          PermissionType.BAN_MEMBERS,
          PermissionType.INVITE_MEMBERS,
          PermissionType.PIN_MESSAGES,
          PermissionType.MANAGE_WEBHOOKS,
          PermissionType.MANAGE_NICKNAMES,
          PermissionType.VIEW_AUDIT_LOG,
          PermissionType.MODERATE_MEMBERS,
          PermissionType.MANAGE_EMOJIS,
          PermissionType.SEND_MESSAGES,
          PermissionType.ADD_REACTIONS,
          PermissionType.ATTACH_FILES,
          PermissionType.EMBED_LINKS,
          PermissionType.MENTION_EVERYONE,
          PermissionType.CHANGE_NICKNAME,
          PermissionType.VIEW_CHANNELS,
          PermissionType.CONNECT_VOICE,
          PermissionType.SPEAK_VOICE,
          PermissionType.STREAM_VIDEO,
          PermissionType.PRIORITY_SPEAKER,
        ],
      },
      {
        name: "Moderator",
        description: "Moderates users and content",
        templateType: RoleTemplateType.MODERATOR,
        isDefault: true,
        permissions: [
          PermissionType.MANAGE_MESSAGES,
          PermissionType.KICK_MEMBERS,
          PermissionType.BAN_MEMBERS,
          PermissionType.PIN_MESSAGES,
          PermissionType.MODERATE_MEMBERS,
          PermissionType.SEND_MESSAGES,
          PermissionType.ADD_REACTIONS,
          PermissionType.ATTACH_FILES,
          PermissionType.EMBED_LINKS,
          PermissionType.VIEW_CHANNELS,
          PermissionType.CONNECT_VOICE,
          PermissionType.SPEAK_VOICE,
          PermissionType.STREAM_VIDEO,
        ],
      },
      {
        name: "Member",
        description: "Regular member with basic permissions",
        templateType: RoleTemplateType.MEMBER,
        isDefault: true,
        permissions: [
          PermissionType.SEND_MESSAGES,
          PermissionType.ADD_REACTIONS,
          PermissionType.ATTACH_FILES,
          PermissionType.EMBED_LINKS,
          PermissionType.CHANGE_NICKNAME,
          PermissionType.VIEW_CHANNELS,
          PermissionType.CONNECT_VOICE,
          PermissionType.SPEAK_VOICE,
          PermissionType.STREAM_VIDEO,
        ],
      },
      {
        name: "Guest",
        description: "Limited permissions for guests",
        templateType: RoleTemplateType.GUEST,
        isDefault: true,
        permissions: [
          PermissionType.VIEW_CHANNELS,
          PermissionType.SEND_MESSAGES,
          PermissionType.ADD_REACTIONS,
        ],
      },
    ];

    // Create each role template if it doesn't exist
    for (const template of roleTemplates) {
      const existingRole = await prisma.role.findFirst({
        where: {
          templateType: template.templateType,
          isDefault: true,
        },
      });

      if (!existingRole) {
        await prisma.role.create({
          data: template,
        });
        console.log(`Created role template: ${template.name}`);
      } else {
        console.log(`Role template already exists: ${template.name}`);
      }
    }

    console.log("Default roles seeded successfully!");
  } catch (error) {
    console.error("Error seeding default roles:", error);
  }
}

// Helper function to create a channel with default roles
export async function createChannelWithRoles(channelData: {
  title: string;
  icon?: string;
  type: string;
  creatorId: string;
}) {
  try {
    // Create the channel
    const channel = await prisma.channel.create({
      data: channelData,
    });

    // Get default role templates
    const defaultRoles = await prisma.role.findMany({
      where: {
        isDefault: true,
      },
    });

    // Create channel roles for each default role
    for (const role of defaultRoles) {
      await prisma.channelRole.create({
        data: {
          channelId: channel.id,
          roleId: role.id,
        },
      });
    }

    // Add creator as a member with Owner role
    const member = await prisma.member.create({
      data: {
        userId: channelData.creatorId,
        channelId: channel.id,
      },
    });

    // Find owner role for the channel
    const ownerRole = await prisma.channelRole.findFirst({
      where: {
        channelId: channel.id,
        role: {
          templateType: RoleTemplateType.OWNER,
        },
      },
    });

    if (ownerRole) {
      // Assign owner role to the channel creator
      await prisma.memberRole.create({
        data: {
          memberId: member.id,
          channelRoleId: ownerRole.id,
        },
      });
    }

    return channel;
  } catch (error) {
    console.error("Error creating channel with roles:", error);
    throw error;
  }
}

// Main seed function
async function main() {
  try {
    await seedDefaultRoles();

    // Additional seeding can be done here

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedDefaultRoles };
