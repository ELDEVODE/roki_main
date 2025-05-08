-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastSeen" TIMESTAMP(3),
ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SubChannel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT,
    "type" TEXT NOT NULL,
    "parentId" TEXT,
    "creatorId" TEXT,
    "sentTime" TIMESTAMP(3),
    "deliveryStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubChannel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubChannel" ADD CONSTRAINT "SubChannel_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Channel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
