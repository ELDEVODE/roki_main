-- CreateTable
CREATE TABLE "DemoInvite" (
    "id" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoInvite_inviteCode_key" ON "DemoInvite"("inviteCode");

-- AddForeignKey
ALTER TABLE "DemoInvite" ADD CONSTRAINT "DemoInvite_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "DemoChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
