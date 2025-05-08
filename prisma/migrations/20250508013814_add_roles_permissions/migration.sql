/*
  Warnings:

  - You are about to drop the column `deliveryStatus` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `sentTime` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `subcommunity` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Role` table. All the data in the column will be lost.
  - Added the required column `name` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('SEND_MESSAGES', 'MANAGE_MESSAGES', 'MANAGE_CHANNELS', 'MANAGE_ROLES', 'KICK_MEMBERS', 'BAN_MEMBERS', 'INVITE_MEMBERS', 'PIN_MESSAGES', 'MANAGE_WEBHOOKS', 'ADD_REACTIONS', 'ATTACH_FILES', 'EMBED_LINKS', 'MENTION_EVERYONE', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'VIEW_CHANNELS', 'CONNECT_VOICE', 'SPEAK_VOICE', 'STREAM_VIDEO', 'PRIORITY_SPEAKER', 'VIEW_AUDIT_LOG', 'MODERATE_MEMBERS', 'MANAGE_EMOJIS', 'ADMINISTRATOR');

-- CreateEnum
CREATE TYPE "RoleTemplateType" AS ENUM ('OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST', 'CUSTOM');

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "deliveryStatus",
DROP COLUMN "sentTime",
ADD COLUMN     "maxRoles" INTEGER NOT NULL DEFAULT 10;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "subcommunity",
DROP COLUMN "title",
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "permissions" "PermissionType"[],
ADD COLUMN     "templateType" "RoleTemplateType" NOT NULL DEFAULT 'CUSTOM';

-- CreateTable
CREATE TABLE "ChannelRole" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChannelRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberRole" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "channelRoleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChannelRole_channelId_roleId_key" ON "ChannelRole"("channelId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberRole_memberId_channelRoleId_key" ON "MemberRole"("memberId", "channelRoleId");

-- AddForeignKey
ALTER TABLE "ChannelRole" ADD CONSTRAINT "ChannelRole_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelRole" ADD CONSTRAINT "ChannelRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberRole" ADD CONSTRAINT "MemberRole_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberRole" ADD CONSTRAINT "MemberRole_channelRoleId_fkey" FOREIGN KEY ("channelRoleId") REFERENCES "ChannelRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
