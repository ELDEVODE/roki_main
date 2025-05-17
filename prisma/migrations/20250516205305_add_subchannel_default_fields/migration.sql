/*
  Warnings:

  - You are about to drop the `Channel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChannelRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContentTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MemberRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubChannel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WalletAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelRole" DROP CONSTRAINT "ChannelRole_channelId_fkey";

-- DropForeignKey
ALTER TABLE "ChannelRole" DROP CONSTRAINT "ChannelRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContentTag" DROP CONSTRAINT "ContentTag_contentId_fkey";

-- DropForeignKey
ALTER TABLE "ContentTag" DROP CONSTRAINT "ContentTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_channelId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_userId_fkey";

-- DropForeignKey
ALTER TABLE "MemberRole" DROP CONSTRAINT "MemberRole_channelRoleId_fkey";

-- DropForeignKey
ALTER TABLE "MemberRole" DROP CONSTRAINT "MemberRole_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_contentId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubChannel" DROP CONSTRAINT "SubChannel_parentId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "WalletAddress" DROP CONSTRAINT "WalletAddress_userId_fkey";

-- DropTable
DROP TABLE "Channel";

-- DropTable
DROP TABLE "ChannelRole";

-- DropTable
DROP TABLE "Content";

-- DropTable
DROP TABLE "ContentTag";

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "MemberRole";

-- DropTable
DROP TABLE "Reaction";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "SubChannel";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserRole";

-- DropTable
DROP TABLE "WalletAddress";

-- DropEnum
DROP TYPE "PermissionType";

-- DropEnum
DROP TYPE "RoleTemplateType";

-- CreateTable
CREATE TABLE "DemoUser" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "profileImage" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "online" BOOLEAN NOT NULL DEFAULT false,
    "lastSeen" TIMESTAMP(3),

    CONSTRAINT "DemoUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoChannel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "creatorId" TEXT NOT NULL,
    "defaultSubchannelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoSubChannel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "channelId" TEXT NOT NULL,
    "isTokenGated" BOOLEAN NOT NULL DEFAULT false,
    "tokenAddress" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemoSubChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemoMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subchannelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readByUsers" TEXT[],

    CONSTRAINT "DemoMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoUser_walletAddress_key" ON "DemoUser"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "DemoMembership_userId_channelId_key" ON "DemoMembership"("userId", "channelId");

-- AddForeignKey
ALTER TABLE "DemoChannel" ADD CONSTRAINT "DemoChannel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "DemoUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoSubChannel" ADD CONSTRAINT "DemoSubChannel_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "DemoChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoMembership" ADD CONSTRAINT "DemoMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "DemoUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoMembership" ADD CONSTRAINT "DemoMembership_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "DemoChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoMessage" ADD CONSTRAINT "DemoMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "DemoUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemoMessage" ADD CONSTRAINT "DemoMessage_subchannelId_fkey" FOREIGN KEY ("subchannelId") REFERENCES "DemoSubChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
